using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.Text;
using S5001Web.PubClass;

namespace S5001Web.Controllers
{
    public class UserInfoController : Controller
    {
        //
        // GET: /UserList/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult UserList()
        {
            return View();
        }
        //加载数据
        [Login]
        public ActionResult LoadPageDatas(string username, int rows, int page)
        {
            try
            {

                List<int?> unlist = new List<int?>();

                string str = HomeController.GetUserID();
                str.Split(',').ToList().ForEach(p =>
                {
                    unlist.Add(Convert.ToInt32(p));
                });
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(p=>unlist.Contains(p.UserID)).ToList();
                
                if (!string.IsNullOrEmpty(username))
                    list = list.Where(u => unlist.Contains(u.UserID) && u.UserName.ToLower().Contains(username.ToLower())).ToList();
                else
                    list = list.Where(u => unlist.Contains(u.UserID)).ToList();

                var result = from r in list
                             select new m
                             {
                                 UserID = r.UserID,
                                 RoleID = r.RoleID,
                                 //RoleName = bll.t_CM_RoleInfo.Where(x => x.RoleID == bll.t_CM_UserRoles.Where(p => p.UserID == r.UserID).FirstOrDefault().RoleID).FirstOrDefault().RoleName,
                                 Company = r.Company,
                                 Email = r.Email,
                                 IsAdmin = r.IsAdmin,
                                 IsScreen = r.IsScreen,
                                 OpenAlarmEmail = r.OpenAlarmEmail,
                                 OpenAlarmMsg = r.OpenAlarmMsg,
                                 openid = r.openid,
                                 openid2 = r.openid2,
                                 openid_bg2 = r.openid_bg2,
                                 Mobilephone = r.Mobilephone,
                                 GroupName = r.GroupName,
                                 LogUrl = r.LogUrl,
                                 UserName = r.UserName,
                                 UserPassWord = r.UserPassWord,
                                 UID = r.UID,
                                 UNITList = r.UNITList,
                                 Post = r.Post,
                                 Telephone = r.Telephone,
                             };
                List<m> li = new List<m>();
                foreach(var i in result)
                {
                   var userrole= bll.t_CM_UserRoles.Where(p => p.UserID == i.UserID).FirstOrDefault();
                    if (userrole != null)
                    {
                        var r = bll.t_CM_RoleInfo.Where(p => p.RoleID == userrole.RoleID).FirstOrDefault();
                        if (r != null)
                            i.RoleName = r.RoleName;
                    }
                    li.Add(i);
                }
                string strJson = Common.List2Json(li, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        public class m : t_CM_UserInfo
        {
            public string RoleName { get; set; }
        }
        //加载合同列表；
        public ActionResult LoadConstractDatas(string CtrName, int rows, int page)
        {
            try
            {
                string PDRList = HomeController.GetPID(CurrentUser.UNITList);
                //SELECT t_CM_Constract.* ,t_CM_PDRInfo.Name as CtrPName FROM  t_CM_Constract,t_CM_PDRInfo WHERE t_CM_Constract.CtrPid =t_CM_PDRInfo.PID AND t_CM_Constract.CtrCom='北京公司'
                string sql = "SELECT t_CM_Constract.* ,t_CM_PDRInfo.Name as CtrPName FROM  t_CM_Constract,t_CM_PDRInfo WHERE t_CM_Constract.CtrPid =t_CM_PDRInfo.PID AND PID IN(" + PDRList + ") and t_CM_Constract.Type=1  ORDER BY createDate DESC,id DESC";
                List<Constract> list = bll.ExecuteStoreQuery<Constract>(sql).ToList();
                if (!string.IsNullOrEmpty(CtrName))
                {
                    list = list.Where(c => c.CtrName.ToLower().Contains(CtrName.ToLower())).ToList();
                }

                for (int i = 0; i < list.Count; i++)
                {
                    //List<t_CM_ConstractInfo> tci = bll.ExecuteStoreQuery<t_CM_ConstractInfo>("SELECT * FROM t_CM_ConstractInfo WHERE constractId=" + list[i].id + " AND orderType='日常巡检'").ToList();
                    //List<t_CM_ConstractInfo> tci2 = bll.ExecuteStoreQuery<t_CM_ConstractInfo>("SELECT * FROM t_CM_ConstractInfo WHERE constractId=" + list[i].id + " AND orderType='检修试验'").ToList();

                    List<CstrOrder> tci = bll.ExecuteStoreQuery<CstrOrder>("SELECT t_CM_ConstractInfo.*,t_CM_CstrOrder.*,t_CM_CstrOrder.id as id1 FROM t_CM_ConstractInfo,t_CM_CstrOrder WHERE constractId=" + list[i].id + " AND orderType='日常巡检' AND constractId=CtrId AND CtrInfoId=t_CM_ConstractInfo.id").ToList();
                    List<CstrOrder> tci2 = bll.ExecuteStoreQuery<CstrOrder>("SELECT t_CM_ConstractInfo.*,t_CM_CstrOrder.*,t_CM_CstrOrder.id as id1 FROM t_CM_ConstractInfo,t_CM_CstrOrder WHERE constractId=" + list[i].id + " AND orderType='检修试验' AND constractId=CtrId AND CtrInfoId=t_CM_ConstractInfo.id").ToList();

                    if (tci != null && tci.Count > 0)
                    {
                        string times = makeTimesStr(tci);
                        list[i].orderrc = times;
                    }
                    if (tci2 != null && tci2.Count > 0)
                    {
                        string times = makeTimesStr(tci2);
                        list[i].orderjx = times;
                    }
                }
                return Content(Common.List2Json(list, rows, page));
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        private static string makeTimesStr(List<CstrOrder> tci)
        {
            string times = "";
            for (int j = 0; j < tci.Count; j++)
            {
                string time = tci[j].PlanDate.ToString();
                if (times.Length > 1)
                    times = times + "<br>" + time.Substring(0, time.IndexOf(' '));
                else
                    times = time.Substring(0, time.IndexOf(' '));
            }
            return times;
        }

        public ActionResult LoadConstractInfoDatas(int rows, int page, int ctrContID = 0)
        {
            try
            {
                string sQ = "";
                if (ctrContID != 0)
                {
                    sQ = " and t_CM_Constract.id = " + ctrContID;
                }
                string sql = "select t_CM_ConstractInfo.* ,t_CM_Constract.CtrName AS constractName from t_CM_Constract,t_CM_ConstractInfo where t_CM_Constract.id=t_CM_ConstractInfo.constractId AND t_CM_Constract.CtrCom='" + CurrentUser.Company + "'" + sQ;
                List<ConstractContent> list = bll.ExecuteStoreQuery<ConstractContent>(sql).ToList();
                return Content(Common.List2Json(list, rows, page));
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        class ConstractContent
        {
            public Nullable<global::System.Int32> id { get; set; }
            public Nullable<global::System.Int32> constractId { get; set; }
            public string constractName { get; set; }
            public string constractInfo { get; set; }
            public string orderType { get; set; }
            public string TemplateIds { get; set; }
        }

        [Login]
        public ActionResult UserEdit()
        {
            return View();
        }
        //合同信息浏览
        public ActionResult ConstractView()
        {
            return View();
        }
        //合同信息编辑
        public ActionResult ConstractEdit()
        {
            return View();
        }
        public ActionResult CtrContEdit()
        {
            return View();
        }

        public ActionResult CtrContAdd()
        {
            return View();
        }
        //获取用户信息
        [Login]
        public ActionResult LoadUserInfo(int userid)
        {
            string strJson = "";
            t_CM_UserInfo user = bll.t_CM_UserInfo.Where(c => c.UserID == userid).First();
            if (user != null)
            {
                strJson = JsonConvert.SerializeObject(user);
            }
            return Content(strJson);
        }

        //编辑合同，加载合同信息；
        public ActionResult LoadConstractInfo(int id)
        {
            //SELECT t_CM_Constract.* ,t_CM_PDRInfo.Name as CtrPName FROM  t_CM_Constract,t_CM_PDRInfo WHERE t_CM_Constract.CtrPid =t_CM_PDRInfo.PID AND t_CM_Constract.id=1
            string strJson = "";
            string sql = "SELECT t_CM_Constract.* ,t_CM_PDRInfo.Name as CtrPName FROM  t_CM_Constract,t_CM_PDRInfo WHERE t_CM_Constract.CtrPid =t_CM_PDRInfo.PID AND t_CM_Constract.id=" + id;
            List<Constract> listPDRinfo = bll.ExecuteStoreQuery<Constract>(sql).ToList();
            if (listPDRinfo != null && listPDRinfo.Count > 0)
            {
                //SELECT t_CM_ConstractInfo.*,t_CM_CstrOrder.* FROM t_CM_ConstractInfo,t_CM_CstrOrder WHERE constractId=92 AND orderType='检修试验' AND constractId=CtrId AND CtrInfoId=t_CM_ConstractInfo.id
                List<t_CM_ConstractInfo> rc = bll.ExecuteStoreQuery<t_CM_ConstractInfo>("SELECT * FROM t_CM_ConstractInfo WHERE constractId=" + id + " AND orderType='日常巡检'").ToList();
                if (rc.Count > 0)
                {
                    listPDRinfo.First().rcTemplateIds = rc[0].TemplateIds;
                }
                List<t_CM_ConstractInfo> sy = bll.ExecuteStoreQuery<t_CM_ConstractInfo>("SELECT * FROM t_CM_ConstractInfo WHERE constractId=" + id + " AND orderType='检修试验'").ToList();
                if (sy.Count > 0)
                {
                    listPDRinfo.First().syTemplateIds = sy[0].TemplateIds;
                }
                List<CstrOrder> tci = bll.ExecuteStoreQuery<CstrOrder>("SELECT t_CM_ConstractInfo.*,t_CM_CstrOrder.*,t_CM_CstrOrder.id as id1 FROM t_CM_ConstractInfo,t_CM_CstrOrder WHERE constractId=" + id + " AND orderType='日常巡检' AND constractId=CtrId AND CtrInfoId=t_CM_ConstractInfo.id").ToList();
                List<CstrOrder> tci2 = bll.ExecuteStoreQuery<CstrOrder>("SELECT t_CM_ConstractInfo.*,t_CM_CstrOrder.*,t_CM_CstrOrder.id as id1 FROM t_CM_ConstractInfo,t_CM_CstrOrder WHERE constractId=" + id + " AND orderType='检修试验' AND constractId=CtrId AND CtrInfoId=t_CM_ConstractInfo.id").ToList();
                List<t_PM_Order> allOrders = bll.ExecuteStoreQuery<t_PM_Order>("SELECT * FROM t_PM_Order WHERE PID =" + listPDRinfo.First().CtrPid).ToList();
                strJson = JsonConvert.SerializeObject(new ConstractInfoc(listPDRinfo.First(), tci, tci2, allOrders));
            }
            return Content(strJson);
        }



        public ActionResult LoadConstractContentInfo(int id)
        {
            string strJson = "";
            t_CM_ConstractInfo constractInfo = bll.t_CM_ConstractInfo.Where(c => c.id == id).First();

            if (constractInfo != null)
            {
                strJson = JsonConvert.SerializeObject(constractInfo);
            }
            return Content(strJson);
        }
        public ActionResult GetContractDevices(int constractId)
        {
            t_CM_Constract constarct = bll.t_CM_Constract.Where(c => c.id == constractId).First();
            if (constarct != null)
            {
                string strJson = "";
                string DEVsql = "SELECT  * FROM t_DM_DeviceInfo WHERE pid=" + constarct.CtrPid + " Order By OrderBy";
                List<t_DM_DeviceInfo> DEVlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(DEVsql).ToList();
                List<DeviceInfo> devices = new List<DeviceInfo>();
                foreach (t_DM_DeviceInfo model in DEVlist)
                {
                    devices.Add(new DeviceInfo(model.DID, model.PName, model.DeviceName));
                }
                strJson = JsonConvert.SerializeObject(devices);
                return Content(strJson);
            }
            else
            {
                return Content("");
            }
        }
        public ActionResult GetTemplateById(int constractId)
        {
            t_CM_Constract constarct = bll.t_CM_Constract.Where(c => c.id == constractId).First();
            if (constarct != null)
            {
                string strJson = "";
                string DEVsql = "SELECT  * FROM t_DM_DeviceInfo WHERE pid=" + constarct.CtrPid + " Order By OrderBy";
                List<t_DM_DeviceInfo> DEVlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(DEVsql).ToList();
                List<DeviceInfo> devices = new List<DeviceInfo>();
                foreach (t_DM_DeviceInfo model in DEVlist)
                {
                    devices.Add(new DeviceInfo(model.DID, model.PName, model.DeviceName));
                }
                strJson = JsonConvert.SerializeObject(devices);
                return Content(strJson);
            }
            else
            {
                return Content("");
            }
        }

        public class TemplateNameListCls
        {
            public int templateId { set; get; }
            public string templateName { set; get; }
        }

        public class TemplateNameListAllCls
        {
            public int id { set; get; }
            public int constractId { set; get; }
            public string constractInfo { set; get; }
            public string orderType { set; get; }
            public string templateIds { set; get; }
            public string templateName { set; get; }
        }

        public ActionResult GetOrderTemplates()
        {

            string strJson = "";
            string DEVsql = "SELECT DISTINCT  templateId,templateName  FROM t_PM_Order_Template ";
            List<TemplateNameListCls> DEVlist = bll.ExecuteStoreQuery<TemplateNameListCls>(DEVsql).ToList();


            strJson = JsonConvert.SerializeObject(DEVlist);
            return Content(strJson);

        }
        public ActionResult getUserInfo()
        {
            List<t_CM_UserInfo> list = bll.ExecuteStoreQuery<t_CM_UserInfo>("SELECT * FROM t_CM_UserInfo").ToList();
            return Content(JsonConvert.SerializeObject(list));
        }

        public ActionResult GetOrderTemplatesById(string pid, string orderType)
        {
            string strJson = "[";
            if (string.IsNullOrEmpty(pid) || string.IsNullOrEmpty(orderType))
                return Content("");
            try
            {

                string DEVsql = "select b.id,b.constractId,b.constractInfo,b.orderType,b.TemplateIds ,a.CtrName AS constractName from t_CM_Constract a,t_CM_ConstractInfo b where a.id=b.constractId AND a.CtrPid=" + pid + " AND b.orderType='" + orderType + "' ";
                // string DEVsql = "select t_CM_ConstractInfo.id, ,t_CM_Constract.CtrName AS constractName from t_CM_Constract,t_CM_ConstractInfo where t_CM_Constract.id=t_CM_ConstractInfo.constractId AND t_CM_Constract.CtrPid=" + pid + " AND t_CM_ConstractInfo.orderType='" + orderType + "' ";
                List<TemplateNameListAllCls> list = bll.ExecuteStoreQuery<TemplateNameListAllCls>(DEVsql).ToList();


                if (list.Count > 0)
                {

                    if (list[0].constractInfo != null && list[0].templateIds != null)
                    {
                        List<string> listID = new List<string>(list[0].templateIds.Split(','));
                        List<string> listTemp = new List<string>(list[0].constractInfo.Split(','));

                        for (int m = 0; m < listID.Count; m++)
                        {
                            strJson += "{\"templateId\":" + listID[m] + ",\"templateName\":\"" + listTemp[m] + "\"},";
                        }
                        strJson = strJson.TrimEnd(',') + "]";
                    }
                }
                //strJson = JsonConvert.SerializeObject(DEVlist);                
            }
            catch (Exception ex)
            {
                //strJson = ex.ToString();
            }
            return Content(strJson);
        }
        class Constract2
        {
            public t_CM_ConstractInfo constract { get; set; }
            public List<DeviceInfo> devices { get; set; }
        }

        public ActionResult LoadConstractListName()
        {
            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            if (pdrlist == null)
                return Content("");

            List<t_CM_Constract> list = bll.t_CM_Constract.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        public ActionResult DeleteConstract(int id)
        {
            string result = "OK";
            try
            {
                t_CM_Constract constract;
                if (id > 0)
                {
                    constract = bll.t_CM_Constract.Where(c => c.id == id).First();
                    bll.t_CM_Constract.DeleteObject(constract);
                    bll.SaveChanges();
                    string sql = "DELETE FROM t_CM_ConstractInfo WHERE constractId =" + id;
                    bll.ExecuteStoreCommand(sql, null);
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }


        public ActionResult DeleteConstractInfo(int id)
        {
            string result = "OK";
            try
            {
                t_CM_ConstractInfo constract;
                if (id > 0)
                {
                    constract = bll.t_CM_ConstractInfo.Where(c => c.id == id).First();
                    bll.t_CM_ConstractInfo.DeleteObject(constract);
                    bll.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        //保存合同信息；
        //string constractInfo1, 日常巡检doc报告名称；
        //string templateIdsrc,  日常巡检报告ids；
        //string timesrc,        日常巡检工单时间；

        //string constractInfo2, 检修试验doc报告名称；
        //string templateIdsjx,  检修试验报告ids；
        //string timesjx         检修试验工单时间；
        public ActionResult saveConstract(t_CM_Constract info, string constractInfo1, string templateIdsrc, string timesrc, string constractInfo2, string templateIdsjx, string timesjx)
        {
            string strJson = "OK";
            try
            {
                templateIdsrc = sub(templateIdsrc);
                templateIdsjx = sub(templateIdsjx);
                timesrc = sub(timesrc);
                timesjx = sub(timesjx);
                t_CM_Constract constract;
                if (info.id > 0)
                {
                    constract = bll.t_CM_Constract.Where(c => c.id == info.id).First();
                    if (constract != null)
                    {
                        constract.id = info.id;
                        constract.CtrName = info.CtrName;
                        constract.CtrCom = CurrentUser.Company;
                        constract.CtrAdmin = info.CtrAdmin;
                        constract.CtrInfo = info.CtrInfo;
                        constract.CtrPid = info.CtrPid;
                        constract.start_time = info.start_time;
                        constract.end_time = info.end_time;
                        constract.person = info.person;
                        constract.dateFixCount = info.dateFixCount;
                        constract.testFixCount = info.testFixCount;
                        bll.ObjectStateManager.ChangeObjectState(constract, EntityState.Modified);
                        bll.SaveChanges();

                        List<t_CM_ConstractInfo> rc = bll.t_CM_ConstractInfo.Where(c => c.constractId == info.id && c.orderType == "日常巡检").ToList();
                        if (rc != null && rc.Count > 0)
                        {
                            t_CM_ConstractInfo r = rc[0];
                            r.constractInfo = constractInfo1;
                            r.TemplateIds = templateIdsrc;
                            r.orderTimes = timesrc;
                            bll.ObjectStateManager.ChangeObjectState(r, EntityState.Modified);
                            bll.SaveChanges();
                        }
                        else
                        {
                            t_CM_ConstractInfo r = new t_CM_ConstractInfo();
                            r.constractId = info.id;
                            r.constractInfo = constractInfo1;
                            r.orderType = "日常巡检";
                            r.TemplateIds = templateIdsrc;
                            r.orderTimes = timesrc;
                            bll.t_CM_ConstractInfo.AddObject(r);
                            bll.SaveChanges();
                        }

                        List<t_CM_ConstractInfo> rc2 = bll.t_CM_ConstractInfo.Where(c => c.constractId == info.id && c.orderType == "检修试验").ToList();
                        if (rc2 != null && rc2.Count > 0)
                        {
                            t_CM_ConstractInfo r = rc2[0];
                            r.constractInfo = constractInfo2;
                            r.TemplateIds = templateIdsjx;
                            r.orderTimes = timesjx;
                            bll.ObjectStateManager.ChangeObjectState(r, EntityState.Modified);
                            bll.SaveChanges();
                        }
                        else
                        {
                            t_CM_ConstractInfo r = new t_CM_ConstractInfo();
                            r.constractId = info.id;
                            r.constractInfo = constractInfo2;
                            r.orderType = "检修试验";
                            r.TemplateIds = templateIdsjx;
                            r.orderTimes = timesjx;
                            bll.t_CM_ConstractInfo.AddObject(r);
                            bll.SaveChanges();
                        }

                        strJson = "修改完成！";
                    }
                    else
                    {
                        constract = new t_CM_Constract();
                        constract.createDate = DateTime.Now;
                        constract.CtrName = info.CtrName;
                        constract.CtrCom = CurrentUser.Company;
                        constract.CtrAdmin = info.CtrAdmin;
                        constract.CtrInfo = info.CtrInfo;
                        constract.CtrPid = info.CtrPid;
                        constract.start_time = info.start_time;
                        constract.end_time = info.end_time;
                        constract.person = info.person;
                        constract.dateFixCount = info.dateFixCount;
                        constract.testFixCount = info.testFixCount;
                        constract.Type = 1;
                        bll.t_CM_Constract.AddObject(constract);
                        bll.SaveChanges();
                        List<t_CM_Constract> dd = bll.t_CM_Constract.Where(c => c.CtrName == info.CtrName).ToList();
                        addConstractInfo(dd.Last(), constractInfo1, templateIdsrc, timesrc, constractInfo2, templateIdsjx, timesjx);
                        strJson = "添加成功！";
                    }
                }
                else
                {
                    constract = new t_CM_Constract();
                    constract.createDate = DateTime.Now;
                    constract.CtrName = info.CtrName;
                    constract.CtrCom = CurrentUser.Company;
                    constract.CtrAdmin = info.CtrAdmin;
                    constract.CtrInfo = info.CtrInfo;
                    constract.CtrPid = info.CtrPid;
                    constract.start_time = info.start_time;
                    constract.end_time = info.end_time;
                    constract.person = info.person;
                    constract.dateFixCount = info.dateFixCount;
                    constract.testFixCount = info.testFixCount;
                    bll.t_CM_Constract.AddObject(constract);
                    bll.SaveChanges();
                    List<t_CM_Constract> dd = bll.t_CM_Constract.Where(c => c.CtrName == info.CtrName).ToList();
                    addConstractInfo(dd.Last(), constractInfo1, templateIdsrc, timesrc, constractInfo2, templateIdsjx, timesjx);
                    strJson = "添加成功！";
                }
                return Content(strJson);
            }
            catch (Exception e)
            {
                return Content("处理失败！");
            }

        }

        private string sub(string str)
        {
            if (str.StartsWith(","))
            {
                str = str.Substring(1, str.Length - 1);
            }
            return str;
        }

        private void addConstractInfo(t_CM_Constract info, string constractInfo1, string templateIdsrc, string timesrc, string constractInfo2, string templateIdsjx, string timesjx)
        {
            //INSERT INTO t_CM_ConstractInfo(constractId,constractInfo,orderType,TemplateIds,orderTimes) VALUES (72,'info','rc','1,2,8','2018-8-11,2018-3-6,2018-9-11')
            addCInfo(info, constractInfo1, "日常巡检", templateIdsrc, timesrc);
            addCInfo(info, constractInfo2, "检修试验", templateIdsjx, timesjx);
        }

        private void addCInfo(t_CM_Constract info, string constractInfo, string orderType, string templateIds, string orderTimes)
        {
            //t_CM_ConstractInfo cinfo = new t_CM_ConstractInfo();
            //cinfo.constractId = info.id;
            //cinfo.constractInfo = constractInfo;
            //cinfo.orderType = orderType;
            string name = "";
            string value = "";
            if (!string.IsNullOrEmpty(templateIds))
            {
                name = name + "," + "TemplateIds";
                value = value + ",'" + templateIds + "'";
                //cinfo.TemplateIds = templateIds;
            }
            if (!string.IsNullOrEmpty(orderTimes))
            {
                name = name + "," + "orderTimes";
                value = value + ",'" + orderTimes + "'";
                //cinfo.orderTimes = orderTimes;
            }
            string sql = "INSERT INTO t_CM_ConstractInfo(constractId,constractInfo,orderType" + name + ") VALUES (" + info.id + ",'" + constractInfo + "','" + orderType + "'" + value + ")";
            bll.ExecuteStoreCommand(sql);
            //bll.t_CM_ConstractInfo.AddObject(cinfo);
            //bll.SaveChanges();
        }

        //保存运维内容；
        public ActionResult saveConstractInfo(t_CM_ConstractInfo info)
        {
            string strJson = "OK";
            try
            {
                t_CM_ConstractInfo constractInfo;
                if (info.id > 0)
                {
                    constractInfo = bll.t_CM_ConstractInfo.Where(c => c.id == info.id).First();
                    if (constractInfo != null)
                    {
                        constractInfo.id = info.id;
                        constractInfo.constractId = info.constractId;
                        constractInfo.constractInfo = info.constractInfo;
                        constractInfo.orderType = info.orderType;
                        constractInfo.TemplateIds = info.TemplateIds;
                        bll.ObjectStateManager.ChangeObjectState(constractInfo, EntityState.Modified);
                        bll.SaveChanges();
                        strJson = "修改完成！";
                    }

                }
                else
                {
                    constractInfo = new t_CM_ConstractInfo();
                    constractInfo.constractId = info.constractId;
                    constractInfo.constractInfo = info.constractInfo;
                    constractInfo.orderType = info.orderType;
                    if (!string.IsNullOrEmpty(info.TemplateIds))
                    {
                        constractInfo.TemplateIds = info.TemplateIds;
                    }
                    if (!string.IsNullOrEmpty(info.orderTimes))
                    {
                        constractInfo.orderTimes = info.orderTimes;
                    }
                    bll.t_CM_ConstractInfo.AddObject(constractInfo);
                    bll.SaveChanges();
                    strJson = "添加成功！";
                }
                return Content(strJson);
            }
            catch (Exception e)
            {
                return Content("处理失败！");
            }
        }

        //获取当前用户信息
        [Login]
        public ActionResult LoadCurrentUser()
        {
            string strJson = "";
            if (CurrentUser != null)
            {
                string pwd = CurrentUser.UserPassWord;
                strJson = CurrentUser.UserName + "," + Encrypt.MD5Decrypt(pwd);
            }
            return Content(strJson);
        }
        //APP获取用户信息
        [Login]
        public ActionResult LoadUser()
        {
            string sid = "";
            string strJson = "error";
            if (Request.Cookies["sid"] != null)
            {
                sid = Request.Cookies["sid"].Value;
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                if (user != null)
                {
                    //strJson = JsonConvert.SerializeObject(user);
                    strJson = Common.JsonDataInfo(user);
                }
            }
            return Content(strJson);
        }

        //重置密码
        [Login]
        public ActionResult ResetPwd(string userid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(userid.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(m => resultlist.Any(a => a == m.UserID)).ToList();
                list.ForEach(i =>
                {
                    i.UserPassWord = "l/0acXY/ol4=";
                    bll.ObjectStateManager.ChangeObjectState(i, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("用户管理", CurrentUser.UserName, "重置密码[用户ID:" + userid + "]");
                });
            }
            catch (Exception ex)
            {
                result = "操作有误！";
            }
            return Content(result);
        }
        [Login]
        public ActionResult ChangePwd()
        {
            return View();
        }
        //修改用户密码
        [Login]
        public ActionResult Changepassword(string oldpwd, string password)
        {
            string result = "OK";
            try
            {
                string MD5oldpwd = Encrypt.MD5Encrypt(oldpwd);
                string MD5password = Encrypt.MD5Encrypt(password);
                if (CurrentUser.UserPassWord != MD5oldpwd)
                {
                    result = "原始密码输入有误！";
                }
                else
                {
                    t_CM_UserInfo userinfo = bll.t_CM_UserInfo.Where(u => u.UserID == CurrentUser.UserID).First();
                    userinfo.UserPassWord = MD5password;
                    bll.ObjectStateManager.ChangeObjectState(userinfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("用户管理", CurrentUser.UserName, "修改用户密码[用户ID:" + userinfo.UserID + "]");
                    ResetLoginDate();//重置用户登录时间
                }
            }
            catch (Exception ex)
            {
                result = "密码修改失败!";
            }
            return Content(result);
        }
        //屏蔽
        [Login]
        public ActionResult IsScreen(string userid, int screen)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(userid.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(m => resultlist.Any(a => a == m.UserID)).ToList();
                list.ForEach(i =>
                {
                    i.IsScreen = screen;
                    bll.ObjectStateManager.ChangeObjectState(i, EntityState.Modified);
                    bll.SaveChanges();
                });
                if (screen == 0)
                    Common.InsertLog("用户管理", CurrentUser.UserName, "授权用户[用户ID:" + userid + "]");
                else
                    Common.InsertLog("用户管理", CurrentUser.UserName, "屏蔽用户[用户ID:" + userid + "]");
            }
            catch (Exception ex)
            {
                result = "操作有误！";
            }
            return Content(result);
        }
        //删除
        [Login]
        public ActionResult DeleteUserInfo(string userid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(userid.Split(',')).ConvertAll(i => int.Parse(i));
                //删除原用户角色信息
                List<t_CM_UserRoles> listuserle = bll.t_CM_UserRoles.Where(m => resultlist.Any(a => a == m.UserID)).ToList();
                int count = 0;
                t_CM_RoleInfo role = null;
                listuserle.ForEach(r =>
                {
                    bll.t_CM_UserRoles.DeleteObject(r);
                    bll.SaveChanges();
                    count = bll.t_CM_UserRoles.Where(u => u.RoleID == r.RoleID).ToList().Count;
                    role = bll.t_CM_RoleInfo.Where(i => i.RoleID == r.RoleID).First();
                    role.UserState = count;
                    bll.ObjectStateManager.ChangeObjectState(role, EntityState.Modified);
                    bll.SaveChanges();
                });
                //删除用户列表
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(m => resultlist.Any(a => a == m.UserID)).ToList();
                list.ForEach(i =>
                {
                    bll.t_CM_UserInfo.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("用户管理", CurrentUser.UserName, "删除用户[用户ID:" + userid + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }



        //保存
        [Login]
        public ActionResult SaveUserInfo(t_CM_UserInfo userInfo, string RoleList)
        {
            List<t_CM_UserInfo> list = bll.t_CM_UserInfo.ToList();
            int userid = userInfo.UserID;
            string result = "OK";
            //新增
            try
            {
                if (userid < 1)
                {
                    list = list.Where(s => s.UserName.ToLower() == userInfo.UserName.ToLower()).ToList();

                    if (list.Count > 0)
                    {
                        result = "此用户已存在，请重新输入！";
                    }
                    else
                    {
                        userInfo.UserPassWord = "l/0acXY/ol4=";
                        userInfo.IsScreen = 0;
                        bll.t_CM_UserInfo.AddObject(userInfo);
                        userid = bll.SaveChanges();
                        userid = userInfo.UserID;
                        Common.InsertLog("用户管理", CurrentUser.UserName, "新增用户[用户ID:" + userid + "_" + userInfo.UserName + "]");
                    }
                }
                else//修改
                {
                    list = list.Where(s => s.UserName.ToLower() == userInfo.UserName.ToLower() && s.UserID != userInfo.UserID).ToList();
                    if (list.Count > 0)
                    {
                        result = "此用户已存在，请重新输入！";
                    }
                    else
                    {
                        t_CM_UserInfo user = bll.t_CM_UserInfo.Where(c => c.UserID == userid).First();
                        user.Company = userInfo.Company;
                        user.Mobilephone = userInfo.Mobilephone;
                        user.Post = userInfo.Post;
                        user.GroupName = userInfo.GroupName;
                        user.Telephone = userInfo.Telephone;
                        user.UserName = userInfo.UserName;
                        user.UNITList = userInfo.UNITList;
                        user.Email = userInfo.Email;
                        user.OpenAlarmEmail = userInfo.OpenAlarmEmail;
                        user.OpenAlarmMsg = userInfo.OpenAlarmMsg;
                        user.LogUrl = userInfo.LogUrl;
                        user.UID = userInfo.UID;
                        //user.LastYearPower = userInfo.LastYearPower;
                        bll.ObjectStateManager.ChangeObjectState(user, EntityState.Modified);
                        bll.SaveChanges();
                        Common.InsertLog("用户管理", CurrentUser.UserName, "修改用户[用户ID:" + userid + "_" + userInfo.UserName + "]");
                    }
                }
                if (userInfo.UserName != "admin")
                {
                    //删除原用户角色信息，重新填充数据
                    List<t_CM_UserRoles> listur = bll.t_CM_UserRoles.Where(u => u.UserID == userid).ToList();
                    //如果存在数据，先删除
                    if (listur != null && listur.Count > 0)
                    {
                        listur.ForEach(r =>
                        {
                            bll.t_CM_UserRoles.DeleteObject(r);
                        });
                    }
                    bll.SaveChanges();
                }
                //添加用户角色
                if (!RoleList.Equals(""))
                {
                    int count = 0;
                    t_CM_RoleInfo role = null;
                    List<int> newlist = new List<string>(RoleList.Split(',')).ConvertAll(i => int.Parse(i));
                    newlist.ForEach(r =>
                    {
                        t_CM_UserRoles userroles = new t_CM_UserRoles();
                        userroles.UserID = userid;
                        userroles.RoleID = r;
                        bll.t_CM_UserRoles.AddObject(userroles);
                        bll.SaveChanges();
                        count = bll.t_CM_UserRoles.Where(u => u.RoleID == r).ToList().Count;
                        role = bll.t_CM_RoleInfo.Where(i => i.RoleID == r).First();
                        role.UserState = count;
                        bll.ObjectStateManager.ChangeObjectState(role, EntityState.Modified);
                        bll.SaveChanges();
                    });
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }

        public void ResetLoginDate() //重置用户登录时间，减1分钟使之可以立即再登录
        {
            if (null == CurrentUser)//移除历史保存的信息,主要作用于注销登录
            {
                HttpCookie aCookie = Request.Cookies["myYWAppInf"];
                if (null != aCookie)
                {
                    aCookie.Values["appu"] = string.Empty;
                    aCookie.Values.Remove("myYWAppInf");
                    aCookie.Expires = DateTime.Now.AddDays(-1);
                    Response.Cookies.Add(aCookie);
                }
                HttpContext.Session.RemoveAll();
                return;
            }
            string MyName = CurrentUser.UserName;
            List<t_CM_UserLogin> LoginList = bll.t_CM_UserLogin.Where(k => k.UserName == MyName).ToList();
            if (LoginList.Count > 0)
            {
                t_CM_UserLogin MyLogin = LoginList[0];
                DateTime LastLoginDate = Convert.ToDateTime(MyLogin.LoginDate).AddMinutes(-1);
                string strsql = "update t_CM_UserLogin set LoginDate = '" + LastLoginDate + "' where UserName = '" + MyName + "' ";

                HttpCookie aCookie = Request.Cookies["myYWAppInf"];
                if (null != aCookie)
                {
                    aCookie.Values["appu"] = string.Empty;
                    aCookie.Values.Remove("myYWAppInf");
                    aCookie.Expires = DateTime.Now.AddDays(-1);
                    Response.Cookies.Add(aCookie);
                }
                HttpContext.Session.RemoveAll();
                bll.ExecuteStoreCommand(strsql, null);

            }
        }

        #region  行业管理
        //获取行业信息
        [Login]
        public ActionResult IndustryData(int rows, int page)
        {
            List<t_ES_Industry> list = bll.t_ES_Industry.ToList();
            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }

        //添加行业类型
        public ActionResult saveIndustryInfo(t_ES_Industry info)
        {
            string strJson = "OK";
            try
            {
                t_ES_Industry industryInfo;
                if (info.IndustryID > 0)
                {
                    industryInfo = bll.t_ES_Industry.Where(c => c.IndustryID == info.IndustryID).First();
                    if (industryInfo != null)
                    {
                        industryInfo.IndustryID = info.IndustryID;
                        industryInfo.IndustryName = info.IndustryName;
                        bll.ObjectStateManager.ChangeObjectState(industryInfo, EntityState.Modified);
                        bll.SaveChanges();
                        strJson = "修改完成！";
                    }

                }
                else
                {
                    industryInfo = new t_ES_Industry();
                    industryInfo.IndustryID = info.IndustryID;
                    industryInfo.IndustryName = info.IndustryName;
                    bll.t_ES_Industry.AddObject(industryInfo);
                    bll.SaveChanges();
                    strJson = "添加成功！";
                }
                return Content(strJson);
            }
            catch (Exception e)
            {
                return Content("处理失败！");
            }
        }

        //删除行业
        [Login]
        public ActionResult DeleteIndustryInfo(string IndustryID)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(IndustryID.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_ES_Industry> list = bll.t_ES_Industry.Where(m => resultlist.Any(a => a == m.IndustryID)).ToList();
                list.ForEach(i =>
                {
                    bll.t_ES_Industry.DeleteObject(i);
                    bll.SaveChanges();
                });

                Common.InsertLog("行业管理", CurrentUser.UserName, "删除行业信息[" + IndustryID + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        #endregion


        #region 角色
        [Login]
        public ActionResult RoleList()
        {
            return View();
        }
        //加载角色列表
        [Login]
        public ActionResult LoadRoleInfo(int rows, int page)
        {
            List<r> R = new List<r>();
            List<t_CM_RoleInfo> list = bll.t_CM_RoleInfo.ToList();
            foreach(var i in list)
            {
                r r = new r();
                r.RoleID = i.RoleID;
                r.RoleName = i.RoleName;
                r.UserState = i.UserState;
                r.Remarks = i.Remarks;
                var s = bll.t_CM_UserRoles.Where(p => p.RoleID == i.RoleID).Select(p => p.UserID).ToList();
                var u = bll.t_CM_UserInfo.Where(p => s.Contains(p.UserID)).Select(p => p.UserName).ToList().ToArray();
                r.UserNames= string.Join(",", u);
                R.Add(r);
            }
            
            string strJson = Common.List2Json(R, rows, page);
            return Content(strJson);
        }
        public class r:t_CM_RoleInfo
        {
            public string UserNames { get; set; }
        }
        //保存角色信息
        [Login]
        public ActionResult SaveRoleInfo(t_CM_RoleInfo role)
        {
            string result = "OK";
            List<t_CM_RoleInfo> lits = bll.t_CM_RoleInfo.Where(r => r.RoleName == role.RoleName && r.RoleID != role.RoleID).ToList();
            if (lits != null && lits.Count > 0)
            {
                result = "此角色已存在，请重新输入！";
            }
            else
            {
                if (role.RoleID < 1)
                {
                    role.UserState = 0;
                    role.Remarks = JsonHelper.ToJsonString(role.Remarks);
                    bll.t_CM_RoleInfo.AddObject(role);
                    bll.SaveChanges();
                    Common.InsertLog("角色权限", CurrentUser.UserName, "新增角色权限[角色ID:" + role.RoleID + "_" + role.RoleName + "]");
                }
                else
                {
                    t_CM_RoleInfo roleinfo = bll.t_CM_RoleInfo.Where(r => r.RoleID == role.RoleID).First();
                    roleinfo.RoleName = role.RoleName;
                    roleinfo.Remarks = JsonHelper.ToJsonString(role.Remarks);
                    bll.ObjectStateManager.ChangeObjectState(roleinfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("角色权限", CurrentUser.UserName, "修改角色权限[角色ID:" + role.RoleID + "_" + role.RoleName + "]");
                }
            }
            return Content(result);
        }
        //删除 如果角色被授予，则不能删除。删除角色的同时，删除对应的权限

        [Login]
        public ActionResult DeleteRoleInfo(string roleid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(roleid.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_RoleInfo> list = bll.t_CM_RoleInfo.Where(m => resultlist.Any(a => a == m.RoleID)).ToList();
                list.ForEach(i =>
                {
                    //判断是否有用户属于该角色
                    List<t_CM_UserRoles> userlist = bll.t_CM_UserRoles.Where(u => u.RoleID == i.RoleID).ToList();
                    if (userlist != null && userlist.Count > 0)
                        result = "此角色已被授予用户，请确认后删除！";
                    else
                    {
                        bll.t_CM_RoleInfo.DeleteObject(i);
                        //删除该角色权限
                        List<t_CM_RoleRight> rolelist = bll.t_CM_RoleRight.Where(r => r.RoleID == i.RoleID).ToList();
                        rolelist.ForEach(r =>
                        {
                            bll.t_CM_RoleRight.DeleteObject(r);
                        });
                    }
                });
                bll.SaveChanges();
                Common.InsertLog("角色权限", CurrentUser.UserName, "删除角色权限[角色ID:" + roleid + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        #endregion

        #region 角色权限
        [Login]
        public ActionResult AllotPurview()
        {
            return View();
        }
        [Login]
        public ActionResult LoadAllPurview(int roleid)
        {
            string strList = get_MenuTree(roleid);
            string strJson = JsonConvert.SerializeObject(strList);
            return Content(strJson);
        }
        //获取模块列表
        [Login]
        private string get_MenuTree(int roleid)
        {
            StringBuilder StrTree_Menu = new StringBuilder();
            List<t_CM_Module> toplist = bll.t_CM_Module.Where(m => m.ParentID == 0).ToList();
            List<t_CM_RoleRight> listRoleRight = bll.t_CM_RoleRight.ToList();
            List<t_CM_Module> listButton = bll.t_CM_Module.Where(m => m.ModuleType == 3).ToList();
            List<t_CM_Module> listMenu = bll.t_CM_Module.Where(m => m.ModuleType < 3).ToList();
            int eRowIndex = 0;
            foreach (t_CM_Module module in toplist)
            {
                string trID = "node-" + eRowIndex;
                StrTree_Menu.Append("<tr id='" + trID + "'>");
                StrTree_Menu.Append("<td style='width: 200px;padding-left:20px;'><span class=\"folder\">" + module.ModuleName + "</span></td>");
                if (!string.IsNullOrEmpty(module.Icon))
                {
                    StrTree_Menu.Append("<td style='width: 30px;text-align:center;'><img src='/Content/images/Icon32/" + module.Icon + "' style='width:16px; height:16px;vertical-align: middle;' alt=''/></td>");
                }
                else
                {
                    StrTree_Menu.Append("<td style='width: 30px;text-align:center;'><img src='/Content/images/Icon32/5005_flag.png' style='width:16px; height:16px;vertical-align: middle;' alt=''/></td>");
                }
                StrTree_Menu.Append(string.Concat(new object[]
                    {
                        "<td style=\"width: 23px; text-align: left;\"><input id='ckb",
                        trID,
                        "' style='vertical-align: middle;margin-bottom:2px;' type=\"checkbox\" ",
                        GetChecked(module.ModuleID, listRoleRight,roleid),
                        "  value=\"",
                        module.ModuleID,
                        "\" name=\"checkbox\" /></td>"
                    }));
                StrTree_Menu.Append(string.Concat(new object[]
                    {
                        "<td style=\"width: 23px; text-align: left;\"><input id='_ckb",
                        trID,
                        "' onclick=\"ckbValueObj(id)\" style='vertical-align: middle;margin-bottom:2px;' type=\"checkbox\" ",
                        GetDisenableChecked(module.ModuleID, listRoleRight,roleid),
                        "  value=\"",
                        module.ModuleID,
                        "\" name=\"desenabledcheckbox\" /></td>"
                    }));
                StrTree_Menu.Append("<td>" + GetButton(module.ModuleID, listButton, trID, listRoleRight, roleid) + "</td>");
                StrTree_Menu.Append("</tr>");
                StrTree_Menu.Append(GetTableTreeNode(module.ModuleID, listMenu, trID, listButton, listRoleRight, roleid));
                eRowIndex++;
            }
            return StrTree_Menu.ToString();
        }
        //获取模块功能按钮
        [Login]
        public string GetButton(int ModuleID, List<t_CM_Module> listButton, string parentTRID, List<t_CM_RoleRight> listRoleRight, int roleid)
        {
            StringBuilder ButtonHtml = new StringBuilder();

            List<t_CM_Module> currButton = listButton.Where(m => m.ParentID == ModuleID).ToList();
            string result = "";

            int i = 1;

            foreach (t_CM_Module module in currButton)
            {
                string trID = parentTRID + "--" + i.ToString();
                ButtonHtml.Append(string.Concat(new object[]
                    {
                        "<lable><input id='ckb",
                        trID,
                        "' onclick=\"ckbValueObj(id)\" ",
                        GetChecked(module.ModuleID, listRoleRight,roleid),
                        " style='vertical-align: middle;margin-bottom:2px;' type=\"checkbox\" value=\"",
                        module.ModuleID,
                        "\" name=\"checkbox\" />"
                    }));
                ButtonHtml.Append(module.ModuleName + "</lable>&nbsp;&nbsp;&nbsp;&nbsp;");
                i++;
            }
            result = ButtonHtml.ToString();
            return result;
        }
        //获取子节点
        [Login]
        private string GetTableTreeNode(int parentID, List<t_CM_Module> list, string parentTRID, List<t_CM_Module> listButoon, List<t_CM_RoleRight> listRoleRight, int roleid)
        {
            StringBuilder sb_TreeNode = new StringBuilder();
            int i = 1;
            List<t_CM_Module> listmenu = list.Where(m => m.ParentID == parentID).ToList();
            foreach (t_CM_Module module in listmenu)
            {
                string trID = parentTRID + "-" + i.ToString();
                sb_TreeNode.Append(string.Concat(new string[]
                {
                    "<tr id='",
                    trID,
                    "' class='child-of-",
                    parentTRID,
                    "'>"
                }));
                sb_TreeNode.Append("<td style='padding-left:20px;'><span class=\"folder\">" + module.ModuleName + "</span></td>");
                if (!string.IsNullOrEmpty(module.Icon))
                {
                    sb_TreeNode.Append("<td style='width: 30px;text-align:center;'><img src='/Content/images/Icon32/" + module.Icon + "' style='width:16px; height:16px;vertical-align: middle;' alt=''/></td>");
                }
                else
                {
                    sb_TreeNode.Append("<td style='width: 30px;text-align:center;'><img src='/Content/images/Icon32/5005_flag.png' style='width:16px; height:16px;vertical-align: middle;' alt=''/></td>");
                }
                sb_TreeNode.Append(string.Concat(new object[]
                {
                    "<td style=\"width: 23px; text-align: left;\"><input id='ckb",
                    trID,
                    "' onclick=\"ckbValueObj(id)\" ",
                    GetChecked(module.ModuleID, listRoleRight,roleid),
                    " style='vertical-align: middle;margin-bottom:2px;' type=\"checkbox\" value=\"",
                    module.ModuleID,
                    "\" name=\"checkbox\" /></td>"
                }));
                sb_TreeNode.Append(string.Concat(new object[]
                {
                    "<td style=\"width: 23px; text-align: left;\"><input id='_ckb",
                    trID,"'",
                    GetDisenableChecked(module.ModuleID, listRoleRight,roleid),
                    " style='vertical-align: middle;margin-bottom:2px;' type=\"checkbox\" value=\"",
                    module.ModuleID,
                    "\" name=\"desenabledcheckbox\" /></td>"
                }));
                sb_TreeNode.Append("<td>" + GetButton(module.ModuleID, listButoon, trID, listRoleRight, roleid) + "</td>");
                sb_TreeNode.Append("</tr>");
                sb_TreeNode.Append(GetTableTreeNode(module.ModuleID, list, trID, listButoon, listRoleRight, roleid));
                i++;
            }
            return sb_TreeNode.ToString();
        }
        //判断是否选中
        private string GetChecked(int ModuleID, List<t_CM_RoleRight> list, int roleid)
        {

            list = list.Where(l => l.ModuleID == ModuleID && l.RoleID == roleid).ToList();
            string result;
            if (list != null && list.Count > 0)
            {
                result = "checked=\"checked\"";
            }
            else
            {
                result = "";
            }
            return result;
        }
        //判断Disenable是否选中
        private string GetDisenableChecked(int ModuleID, List<t_CM_RoleRight> list, int roleid)
        {

            list = list.Where(l => l.ModuleID == ModuleID && l.RoleID == roleid && l.Disenable == true).ToList();
            string result;
            if (list != null && list.Count > 0)
            {
                result = "checked=\"checked\"";
            }
            else
            {
                result = "";
            }
            return result;
        }
        //保存角色权限
        [Login]
        public ActionResult SaveRoleRight(string ModuleID, string disenbaleID, int roleid)
        {
            string result = "OK";
            if (!ModuleID.Equals(""))
            {
                try
                {
                    List<int> newlist = new List<string>(ModuleID.Split(',')).ConvertAll(i => int.Parse(i));
                    List<int> disenablelist = new List<int>();
                    if (!string.IsNullOrEmpty(disenbaleID))
                    {
                        disenablelist = null;
                        disenablelist = new List<string>(disenbaleID.Split(',')).ConvertAll(i => int.Parse(i));
                    }
                    List<t_CM_RoleRight> list = bll.t_CM_RoleRight.Where(r => r.RoleID == roleid).ToList();
                    list.ForEach(i =>
                    {
                        bll.t_CM_RoleRight.DeleteObject(i);
                    });
                    newlist.ForEach(r =>
                    {
                        t_CM_RoleRight right = new t_CM_RoleRight();
                        right.RoleID = roleid;
                        right.ModuleID = r;
                        right.Disenable = disenablelist.Contains(r);
                        bll.t_CM_RoleRight.AddObject(right);
                    });
                    bll.SaveChanges();
                    Common.InsertLog("角色权限", CurrentUser.UserName, "修改角色权限[角色ID:" + roleid + "_权限ID:" + ModuleID + "]");
                }
                catch (Exception ex)
                {
                    result = ex.ToString();
                }
            }
            else
            {
                result = "没有选择功能，操作失败！";
            }
            return Content(result);
        }
        [Login]
        public ActionResult UserRole(int userid)
        {
            string result = checkboxRole(userid);
            string strJson = JsonConvert.SerializeObject(result);
            return Content(strJson);
        }
        //角色列表复选框
        [Login]
        private string checkboxRole(int userid)
        {
            StringBuilder sbrole = new StringBuilder();
            List<t_CM_RoleInfo> list = bll.t_CM_RoleInfo.Where(p => p.RoleID != 1).ToList();
            foreach (t_CM_RoleInfo roleinfo in list)
            {
                sbrole.Append(string.Concat(new object[]
                {
                    "<input id='ckb",
                        roleinfo.RoleID+"' ",
                        HasRole(roleinfo.RoleID, userid),
                        " style='vertical-align: middle;margin-bottom:2px;' type=\"checkbox\" value=\"",
                        roleinfo.RoleID,
                        "\" name=\"checkbox\" />"}));
                sbrole.Append(roleinfo.RoleName + "&nbsp;&nbsp;");
            }
            return sbrole.ToString();
        }
        //用户是否为该角色
        private string HasRole(int roleid, int userid)
        {
            string result = "";
            List<t_CM_UserRoles> list = bll.t_CM_UserRoles.Where(u => u.RoleID == roleid && u.UserID == userid).ToList();
            if (list != null && list.Count > 0)
                result = "checked=\"checked\"";
            return result;
        }
        public t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }

        public ActionResult SetAdmin(int id)
        {
            using (var bll = new pdermsWebEntities())
            {
                t_CM_UserInfo UserInfo = bll.t_CM_UserInfo.Where(r => r.UserID == id).First();
                UserInfo.IsAdmin = true;
                bll.ObjectStateManager.ChangeObjectState(UserInfo, EntityState.Modified);
                bll.SaveChanges();
            }
            return Content("ok");
        }
        #endregion
    }
}
