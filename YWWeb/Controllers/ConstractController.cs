using YWWeb.PubClass;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using YWWeb;

namespace YWWeb.Controllers
{
    public class ConstractController : UserControllerBaseEx
    {
        //
        // GET: /合同管理/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult YunYingConstract()
        {
            return View();
        }
        public ActionResult YunYingConstractEdit()
        {
            return View();
        }
        public ActionResult YunYingConstractView()
        {
            return View();
        }
        public ActionResult YunYingDetaliView()
        {
            return View();
        }
        public ActionResult YunYingImagesView()
        {
            return View();
        }
        #region 运营合同

        //加载合同列表；
        public ActionResult LoadConstractDatas(string CtrName, int rows, int page)
        {
            try
            {
                string sql = "";
                if (CurrentUser.RoleID == 1)
                    sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID ORDER BY createDate DESC,id DESC";
                else
                {
                    string str = "";
                    if (Convert.ToBoolean(CurrentUser.IsAdmin))
                    {
                        var Ulist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).ToList();
                        foreach (var item in Ulist)
                        {
                            if (!string.IsNullOrEmpty(item.UNITList))
                                str += item.UserID + ",";
                        }
                        if (!string.IsNullOrEmpty(str))
                            str = str.Substring(0, str.Length - 1);

                    }
                    else
                    {
                        str = CurrentUser.UserID.ToString();
                    }
                    if (string.IsNullOrEmpty(str))
                    {
                        return Content("");
                    }
                    sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID where t_CM_Constract.AddUserID IN(" + str + ")  ORDER BY createDate DESC,id DESC";
                }
                List<Constract> list = bll.ExecuteStoreQuery<Constract>(sql).ToList();
                if (!string.IsNullOrEmpty(CtrName))
                {
                    list = list.Where(c => c.CtrName.ToLower().Contains(CtrName.ToLower())).ToList();
                }
                for (var i = 0; i < list.Count(); i++)
                {
                    if (IsAlarm(Convert.ToInt32(list[i].id)))
                    {
                        list[i].IsAlarm = "true";
                    }
                    else
                    {
                        list[i].IsAlarm = "false";
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

        //上传事项文件；
        public ActionResult Upload2(HttpPostedFileBase fileData, int fk_id, string tRemark, string ctype = "file", string modules = "matter")
        {
            if (fileData != null)
            {
                try
                {
                    //备注
                    string Remark = string.Empty;
                    //上传用户
                    string CommitUser = string.Empty;
                    //资料类型（图片，视频,文档）
                    string FileType = ctype;
                    //来源(web,app)
                    string FSource = string.Empty;

                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string url = "~/UploadFiles/YunYingConstract/";
                    string filePath = Server.MapPath(url);

                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = DateTime.Now.Ticks + fileExtension;
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";
                    //获取上传人
                    CommitUser = CurrentUser.UserName;

                    FileType = getFileType(fileExtension);
                    //资料类型（图片，视频,文档）
                    //来源(web,app)
                    FSource = "web";

                    //所属模块:事项；

                    //保存到资料库t_cm_files表
                    t_cm_files obj = new t_cm_files();
                    obj.CommitTime = DateTime.Now;
                    obj.CommitUser = CurrentUser.UserName;
                    obj.FileName = fileName;
                    obj.FilePath = url + saveName;
                    obj.FileExtension = fileExtension;
                    obj.FileSize = fSize;
                    obj.FileType = FileType;
                    obj.Fk_ID = fk_id;
                    obj.FSource = FSource;
                    obj.MaxTemp = 0;
                    obj.MinTemp = 0;
                    obj.Remark = Remark;
                    obj.Modules = modules;
                    bll.t_cm_files.AddObject(obj);
                    bll.SaveChanges();
                    return Content(saveName);
                }
                catch (Exception ex)
                {
                    return Content(ex.ToString());
                }
            }
            else
            {
                return Content("false");
            }
        }

        private static string getFileType(string fileExtension)
        {
            string FileType = "file";
            string LFE = fileExtension.ToLower();
            string[] wic = { ".doc", ".xls" };
            string[] pic = { ".jpg", ".jpeg", ".bmp", ".png", ".gif" };
            string[] ved = { ".avi", ".rmvb", ".mp4", ".flv", ".wmv", ".mkv", ".mpeg" };
            string[] voi = { ".wav", ".mp3", ".wma", ".ogg", ".ape", ".acc", ".3gp" };
            if (pic.Contains(LFE))
            {
                FileType = "image";
            }
            else if (ved.Contains(LFE))
            {
                FileType = "video";
            }
            else if (voi.Contains(LFE))
            {
                FileType = "voice";
            }
            else if (wic.Contains(LFE))
            {
                FileType = "doc";
            }
            return FileType;
        }
        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="fileData"></param>
        /// <param name="folder"></param>
        /// <param name="pid">配电室编号</param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public ActionResult Upload(HttpPostedFileBase fileData, int conid, string folder, int ConTempID, string tRemark, string ctype = "file", int pid = 0)
        {
            if (fileData != null)
            {
                try
                {
                    //所属编号
                    int fk_id = 0;
                    //备注
                    string Remark = string.Empty;
                    //上传用户
                    string CommitUser = string.Empty;
                    //资料类型（图片，视频,文档）
                    string FileType = string.Empty;
                    //来源(web,app)
                    string FSource = string.Empty;
                    //所属模块
                    string Modules = string.Empty;

                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string url = "~/UploadFiles/YunYingConstract/";
                    string filePath = Server.MapPath(url);

                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = DateTime.Now.Ticks + fileExtension;
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";


                    FileType = getFileType(fileExtension);
                    //上传文件到t_PM_EmergencyPlan表和t_cm_files表
                    //保存到t_PM_EmergencyPlan表
                    t_CM_Constract_File obj_file = new t_CM_Constract_File();
                    obj_file.Name = fileName;
                    obj_file.SaveName = saveName;
                    obj_file.conid = conid;
                    obj_file.FilePath = url + saveName;
                    obj_file.ConTempID = ConTempID;
                    obj_file.Remark = tRemark;
                    obj_file.UserID = CurrentUser.UserID;
                    obj_file.CreatTime = DateTime.Now;
                    bll.t_CM_Constract_File.AddObject(obj_file);
                    bll.SaveChanges();

                    //获取pk_id
                    fk_id = ConTempID;
                    //获取上传人
                    CommitUser = CurrentUser.UserName;
                    //来源(web,app)
                    FSource = "web";
                    //所属模块
                    Modules = "YunYingConstract";
                    //保存到资料库t_cm_files表
                    t_cm_files obj = new t_cm_files();
                    obj.CommitTime = DateTime.Now;
                    obj.CommitUser = CurrentUser.UserName;
                    obj.FileName = fileName;
                    obj.FilePath = url + saveName;
                    obj.FileExtension = fileExtension;
                    obj.FileSize = fSize;
                    obj.FileType = FileType;
                    obj.Fk_ID = fk_id;
                    obj.FSource = FSource;
                    obj.MaxTemp = 0;
                    obj.MinTemp = 0;
                    obj.Remark = Remark;
                    obj.Modules = Modules;
                    bll.t_cm_files.AddObject(obj);
                    bll.SaveChanges();
                    return Content(saveName);
                }
                catch (Exception ex)
                {
                    return Content(ex.ToString());
                }
            }
            else
            {
                return Content("false");
            }
        }
        /// <summary>
        /// 读文件字节流
        /// </summary>
        /// <param name="fileData"></param>
        /// <returns></returns>
        private byte[] ReadFileBytes(HttpPostedFileBase fileData)
        {
            byte[] data;
            using (Stream inputStream = fileData.InputStream)
            {
                MemoryStream memoryStream = inputStream as MemoryStream;
                if (memoryStream == null)
                {
                    memoryStream = new MemoryStream();
                    inputStream.CopyTo(memoryStream);
                }
                data = memoryStream.ToArray();
            }
            return data;
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
        public ActionResult saveConstract(t_CM_Constract info, int personid, string personids, string str1, string str2, string str3, string str4, string str5, string str6, string str7, string str8, string uploadid)
        {
            List<string> ids = new List<string>();
            if (personid > 0)
            {
                ids.Add(personid + "");
            }
            if (!string.IsNullOrEmpty(personids))
            {
                string[] iii = personids.Split(',');
                for (int i = 0; i < iii.Length; i++)
                {
                    if (!ids.Contains(iii[i]))
                    {
                        ids.Add(iii[i]);
                    }
                }
            }
            string strJson = "OK";
            try
            {
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
                        constract.start_time = info.start_time;
                        constract.end_time = info.end_time;
                        constract.personid = personid;
                        var user = bll.t_CM_UserInfo.Where(p => p.UserID == personid).FirstOrDefault();
                        if (user != null)
                            constract.person = user.UserName;
                        constract.personids = personids;
                        constract.dateFixCount = info.dateFixCount;
                        constract.testFixCount = info.testFixCount;
                        constract.UID = info.UID;
                        constract.Type = info.Type;
                        constract.ConType = 3;
                        constract.LinkMan = info.LinkMan;
                        constract.Tel = info.Tel;
                        constract.AddUserID = CurrentUser.UserID;
                        constract.UnitCity = info.UnitCity;
                        constract.UnitProvince = info.UnitProvince;

                        constract.ProjectName = info.ProjectName;
                        bll.ObjectStateManager.ChangeObjectState(constract, EntityState.Modified);
                        bll.SaveChanges();

                        addConstractInfo(constract, str1, str2, str3, str4, str5, str6, str7, str8);


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
                        var user = bll.t_CM_UserInfo.Where(p => p.UserID == personid).FirstOrDefault();
                        if (user != null)
                            constract.person = user.UserName;
                        constract.personid = personid;
                        constract.personids = personids;
                        constract.dateFixCount = info.dateFixCount;
                        constract.testFixCount = info.testFixCount;
                        constract.ConType = 3;
                        constract.LinkMan = info.LinkMan;

                        constract.Type = info.Type;
                        constract.Tel = info.Tel;

                        constract.AddUserID = CurrentUser.UserID;

                        constract.UnitCity = info.UnitCity;
                        constract.UnitProvince = info.UnitProvince;

                        constract.ProjectName = info.ProjectName;
                        bll.t_CM_Constract.AddObject(constract);
                        bll.SaveChanges();
                        t_CM_Constract con = bll.t_CM_Constract.Where(p => p.id == constract.id).FirstOrDefault();
                        con.ConNo = GetConNo(con.Type, con.id.ToString());
                        bll.ObjectStateManager.ChangeObjectState(con, EntityState.Modified);
                        bll.SaveChanges();
                        //List<t_CM_Constract> dd = bll.t_CM_Constract.Where(c => c.CtrName == info.CtrName).ToList();
                        addConstractInfo(con, str1, str2, str3, str4, str5, str6, str7, str8);
                        //addfile(uploadid, con);
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
                    constract.personid = personid;
                    constract.personids = personids;
                    constract.dateFixCount = info.dateFixCount;
                    constract.testFixCount = info.testFixCount;
                    constract.UID = info.UID;
                    constract.ConType = 3;
                    constract.LinkMan = info.LinkMan;
                    constract.Tel = info.Tel;

                    constract.Type = info.Type;
                    constract.AddUserID = CurrentUser.UserID;
                    constract.UnitCity = info.UnitCity;
                    constract.UnitProvince = info.UnitProvince;
                    constract.ProjectName = info.ProjectName;
                    bll.t_CM_Constract.AddObject(constract);
                    bll.SaveChanges();
                    t_CM_Constract con = bll.t_CM_Constract.Where(p => p.id == constract.id).FirstOrDefault();
                    con.ConNo = GetConNo(con.Type, con.id.ToString());
                    bll.ObjectStateManager.ChangeObjectState(con, EntityState.Modified);
                    bll.SaveChanges();
                    //List<t_CM_Constract> dd = bll.t_CM_Constract.Where(c => c.CtrName == info.CtrName).ToList();         
                    addConstractInfo(con, str1, str2, str3, str4, str5, str6, str7, str8);
                    //addfile(uploadid, con);
                    strJson = "添加成功！";
                }
                sendMsg(ids);
                return Content(strJson);
            }
            catch (Exception e)
            {
                return Content("处理失败！");
            }

        }
        //public void addfile(string uploadid, t_CM_Constract con)
        //{
        //    if (uploadid != "")
        //    {
        //        t_ES_ContractTemplet model = new t_ES_ContractTemplet();
        //        model.Name = "事项_合同签订";
        //        model.StartTime = DateTime.Now;
        //        model.IsOk = 1;
        //        model.PersonID = CurrentUser.UserID;
        //        model.BeforDay = 0;
        //        model.EndTime = DateTime.Now;
        //        model.DefTempID = 2;
        //        model.CreatTime = DateTime.Now;
        //        model.conid = con.id;
        //        model.ConTempNo = con.ConNo + "_1";
        //        bll.t_ES_ContractTemplet.AddObject(model);
        //        bll.SaveChanges();

        //        string[] s = uploadid.Split(',');
        //        foreach (var item in s)
        //        {
        //            int v = Convert.ToInt32(item);
        //            var m = bll.t_cm_files.Where(p => p.ID == v).FirstOrDefault();
        //            //m.Fk_ID = con.id;
        //            m.Fk_ID = model.ID;
        //            bll.ObjectStateManager.ChangeObjectState(m, EntityState.Modified);
        //        }
        //        bll.SaveChanges();
        //    }
        //}
        //批量发送短信;
        public void sendMsg(List<string> personids)
        {
            string ids = "0";
            for (int i = 0; i < personids.Count; i++)
            {
                ids += ("," + personids[i]);
            }
            string sql = "SELECT * FROM t_CM_UserInfo WHERE UserID IN (" + ids + ")";
            List<t_CM_UserInfo> listPDRinfo = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
            for (int i = 0; i < listPDRinfo.Count; i++)
            {
                UtilsSms.smsContractTemp(listPDRinfo[i].Mobilephone, "有合同事项");
            }
        }

        private string GetConNo(int? type, string conid)
        {
            string res = string.Empty;
            string Contype;
            switch (type)
            {
                case 1:
                    Contype = "CB";
                    break;
                case 2:
                    Contype = "SJ";
                    break;
                case 3:
                    Contype = "CP";
                    break;
                case 4:
                    Contype = "YW";
                    break;
                case 5:
                    Contype = "GL";
                    break;
                case 6:
                    Contype = "SLGL";
                    break;
                default:
                    Contype = "YW";
                    break;

            }
            res = Contype + "-" + DateTime.Now.ToString("yy") + "-" + conid;
            return res;

        }
        private void addConstractInfo(t_CM_Constract info, string str1, string str2, string str3, string str4, string str5, string str6, string str7, string str8)
        {
            if (str1 != "")
            {
                string[] strArr1 = str1.Split(',');
                string[] strArr2 = str2.Split(',');
                string[] strArr3 = str3.Split(',');
                string[] strArr4 = str4.Split(',');
                string[] strArr5 = str5.Split(',');
                string[] strArr6 = str6.Split(',');
                string[] strArr7 = str7.Split(',');
                string[] strArr8 = str8.Split(',');

                List<int> ids = strArr1.ToList().ConvertAll<int>(p => int.Parse(p)).ToList();
                List<t_ES_ContractTemplet> list = bll.t_ES_ContractTemplet.Where(p => !ids.Contains(p.ID) && p.conid == info.id).ToList();
                list.ForEach(index =>
                {
                    bll.DeleteObject(index);
                });
                for (var i = 0; i < strArr1.Length; i++)
                {
                    int id = Convert.ToInt32(strArr1[i]);
                    if (id != 0)
                    {

                    }
                    else
                    {
                        t_ES_ContractTemplet model = new t_ES_ContractTemplet();
                        model.Name = strArr2[i];
                        model.StartTime = Convert.ToDateTime(strArr3[i]);
                        model.IsOk = Convert.ToInt32(strArr6[i]);
                        model.PersonID = Convert.ToInt32(strArr4[i]);
                        model.BeforDay = Convert.ToInt32(strArr5[i]);
                        model.EndTime = Convert.ToDateTime(strArr7[i]);
                        model.DefTempID = Convert.ToInt32(strArr8[i]);
                        model.CreatTime = DateTime.Now;
                        model.conid = info.id;
                        model.ConTempNo = info.ConNo + "_" + (i + 1);
                        bll.t_ES_ContractTemplet.AddObject(model);
                    }
                }

                bll.SaveChanges();
            }
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

        //编辑合同，加载合同信息；
        public ActionResult LoadConstractInfo(int id)
        {
            //SELECT t_CM_Constract.* ,t_CM_PDRInfo.Name as CtrPName FROM  t_CM_Constract,t_CM_PDRInfo WHERE t_CM_Constract.CtrPid =t_CM_PDRInfo.PID AND t_CM_Constract.id=1
            string strJson = "";
            string sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID =t_CM_Unit.UnitID where t_CM_Constract.id=" + id;
            Constract listPDRinfo = bll.ExecuteStoreQuery<Constract>(sql).FirstOrDefault();
            List<t_ES_UsePlan> planList = new List<t_ES_UsePlan>();
            List<t_ES_Purchase> urc = new List<t_ES_Purchase>();
            List<Contemp> contemp = new List<Contemp>();
            string sqlVal = "";
            if (listPDRinfo != null)
            {
                sqlVal = @"select a.ID,a.CommitUser as UserName,a.Fk_ID,a.FileName as Name, a.FileType,a.FilePath,b.Name as ConTempName,a.Remark,a.CommitTime as CreatTime from t_cm_files a 
                           inner join t_ES_ContractTemplet b on a.Fk_ID=b.ID where  a.Fk_ID in(select ID from t_ES_ContractTemplet c where c.conid=" + id + ") and FileType!='image' and a.Modules='matter' order by a.CommitTime asc";
                string st = @"select a.ID, a.Name,a.CompleTime,a.StartTime,a.EndTime,a.BeforDay,a.IsOk,a.Remark,a.PersonID,c.UserName from t_ES_ContractTemplet a 
                             inner join t_CM_Constract b on a.conid=b.id inner join t_CM_UserInfo c on a.PersonID=c.UserID where a.conid=" + listPDRinfo.id + " order by a.CreatTime asc";
                var ss = bll.ExecuteStoreQuery<Contemp>(st).ToList();
                foreach (var item in ss)
                {

                    t_CM_Constract_File f = bll.t_CM_Constract_File.Where(p => p.ConTempID == item.ID).FirstOrDefault();
                    t_cm_files cf = bll.t_cm_files.Where(p => p.Fk_ID == item.ID && p.Modules == "yunyingcon" && p.FileType == "image").FirstOrDefault();
                    if (f != null || cf != null || item.IsOk == 1)
                        item.IsDel = false;
                    else
                        item.IsDel = true;

                    contemp.Add(item);
                }

            }

            var result = bll.ExecuteStoreQuery<ConFileview>(sqlVal).ToList();
            return Json(new { listPDRinfo = listPDRinfo, result = result, contemp = contemp }, JsonRequestBehavior.AllowGet);
        }

        public class ConFileview
        {
            public int ID { get; set; }
            public int? UserID { get; set; }
            public int? conid { get; set; }
            public string Name { get; set; }
            public string SaveName { get; set; }
            public string FilePath { get; set; }
            public string ConTempName { get; set; }
            public string UserName { get; set; }
            public string Remark { get; set; }
            public DateTime? CreatTime { get; set; }
        }
        //确认合同项
        [Login]
        public ActionResult UpdateContrc(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_ES_ContractTemplet> list = bll.t_ES_ContractTemplet.Where(m => resultlist.Contains(m.ID)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    i.IsOk = 1;
                    i.CompleTime = DateTime.Now;
                    bll.ObjectStateManager.ChangeObjectState(i, EntityState.Modified);
                });
                bll.SaveChanges();
                //项目负责人+抄送人员
                string sql = "SELECT c.personid,c.personids FROM t_ES_ContractTemplet a,t_CM_Constract c WHERE a.ID=" + id + " AND c.id=a.conid";
                t_CM_Constracti l = bll.ExecuteStoreQuery<t_CM_Constracti>(sql).ToList().First();
                //事项负责人；
                string sql2 = "SELECT PersonID as personid FROM t_ES_ContractTemplet WHERE id=" + id;
                List<string> ids = new List<string>();
                t_CM_Constracti l2 = bll.ExecuteStoreQuery<t_CM_Constracti>(sql2).ToList().First();
                if (l.personid != null && l.personid > 0)
                {
                    ids.Add(l.personid + "");
                }
                if (!string.IsNullOrEmpty(l.personids))
                {
                    string[] iii = l.personids.Split(',');
                    for (int i = 0; i < iii.Length; i++)
                    {
                        if (!ids.Contains(iii[i]))
                        {
                            ids.Add(iii[i]);
                        }
                    }
                }
                if (l2.personid != null && l2.personid > 0)
                {
                    if (!ids.Contains(l2.personid + ""))
                    {
                        ids.Add(l2.personid + "");
                    }

                }
                sendMsg(ids);
                Common.InsertLog("确认合同项", CurrentUser.UserName, "确认成功[用户ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        public class valCon
        {
            public int ID { get; set; }
            public int? conid { get; set; }
            public string Name { get; set; }
            public string SaveName { get; set; }
        }
        public class Contemp
        {
            public int ID { get; set; }
            public string Name { get; set; }
            public DateTime? StartTime { get; set; }
            public int? BeforDay { get; set; }
            public string Remark { get; set; }
            public int? PersonID { get; set; }
            public string UserName { get; set; }
            public int? IsOk { get; set; }
            public DateTime? CompleTime { get; set; }
            public bool IsDel { get; set; }
            public DateTime? EndTime { get; set; }
        }
        public ActionResult DeleteConstract(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_Constract> list = bll.t_CM_Constract.Where(m => resultlist.Contains(m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.DeleteObject(i);
                    bll.t_ES_ContractTemplet.Where(p => p.conid == i.id).ToList().ForEach(index =>
                    {
                        bll.DeleteObject(index);
                    });
                });
                bll.SaveChanges();
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        public bool IsAlarm(int id)
        {
            bool flag = false;
            List<t_ES_ContractTemplet> list = bll.t_ES_ContractTemplet.Where(p => p.conid == id && p.IsOk == 0).ToList();
            foreach (var item in list)
            {
                if (item.StartTime <= DateTime.Now.AddDays(Convert.ToDouble(item.BeforDay)))
                {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
        //public t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}

        /// <summary>
        /// 判断当前文件是否存在
        /// </summary>
        /// <param name="fk_id"></param>
        /// <returns></returns>
        public ActionResult IsExistFilePath(string filePathName)
        {
            string strJson = "success";
            try
            {
                string filePath = string.Empty;
                string[] fileArry = filePathName.Split('/');
                if (fileArry.Length > 0)
                {
                    filePath = fileArry[fileArry.Length - 1];
                }
                //判断文件是否存在
                string filePath_temp = Server.MapPath("~/UploadFiles/YunYingConstract/");
                if (Directory.Exists(filePath_temp))
                {
                    if (System.IO.File.Exists(filePath_temp + filePath))
                    {
                        strJson = "success";
                    }
                    else
                    {
                        strJson = "failure";
                    }
                }
                else
                {
                    strJson = "failure";
                }
            }
            catch (Exception ex)
            {
                strJson = "error";
            }
            return Content(strJson);
        }
        //获取工单详情
        [Login]
        public ActionResult getTempDetail(int id)
        {
            string strJson = "";
            try
            {
                StringBuilder sbOrder = new StringBuilder();
                t_ES_ContractTemplet temp = bll.t_ES_ContractTemplet.Where(o => o.ID == id).FirstOrDefault();
                if (temp != null)
                {

                    t_CM_UserInfo user = bll.t_CM_UserInfo.Where(o => o.UserID == temp.PersonID).FirstOrDefault();
                    sbOrder.Append("<table cellpadding=\"\" cellspacing=\"\" border=\"0\" class=\"d_list\" style=\"font-size: 13px;\">");
                    sbOrder.Append("<tr><td class=\"d_l_t\" style=\"width: 80px;\">事项名称：</td><td class=\"d_l_d\">");
                    sbOrder.Append(temp.Name + "</td><td class=\"d_l_t\" style=\"width: 100px;\">人员：</td><td class=\"d_l_d\">");
                    sbOrder.Append(user.UserName + "</td><td class=\"d_l_t\" style=\"width: 100px;\">开始时间：</td><td class=\"d_l_d\" >");
                    sbOrder.Append(temp.StartTime);
                    sbOrder.Append("</td></tr>");
                    //sbOrder.Append("<tr><td class=\"d_l_t\">反馈时间：</td><td class=\"d_l_d\">" + temp.CompleTime + "</td></tr>");
                    //sbOrder.Append("<tr><td class=\"d_l_t\">反馈描述：</td><td class=\"d_l_d\" colspan=\"5\">"+temp.Remark+"</td></tr>");
                    //sbOrder.Append("<tr><td class=\"d_l_t\">图片：</td><td class=\"d_l_d\" colspan=\"5\">"+getOrderFile(id,"image","yunyingcon")+"</td></tr>");
                    sbOrder.Append(getOrderFile(id, "image", "matter"));
                    sbOrder.Append("<tr><td class=\"d_l_t\">反馈描述：</td><td class=\"d_l_d\" colspan=\"5\">" + temp.Remark + "</td></tr>");
                    sbOrder.Append("<tr><td class=\"d_l_t\">附件：</td><td class=\"d_l_d\" colspan=\"5\">");
                    string str = string.Empty;
                    foreach (var item in bll.t_cm_files.Where(p => p.Fk_ID == id && p.Modules == "matter" && p.FileType != "image").ToList())
                    {
                        str += "<span><a href=" + item.FilePath.Replace("~", "") + " target='blank'>" + item.FileName + "</a></span><br/>";
                    }
                    if (str != string.Empty)
                        str = str.Substring(0, str.Length - 1);
                    sbOrder.Append(str);
                    sbOrder.Append("</td></tr>");

                    sbOrder.Append("</table>");


                    strJson = sbOrder.ToString();
                }
            }
            catch (Exception ex)
            {
                strJson = "";
            }

            return Content(strJson);
        }


        //获取工单资料信息
        private string getOrderFile(int id, string filetype, string module = "YunYingConstract")
        {
            List<t_cm_files> list = bll.t_cm_files.Where(f => f.Modules == module && f.Fk_ID == id && f.FileType == filetype).ToList();
            StringBuilder sbphoto = new StringBuilder();
            if (list.Count > 0)
            {
                int count = 1;
                string name = Dns.GetHostName();
                string MyUrl = HttpContext.Request.UrlReferrer.Authority.ToString();

                list.ForEach(p =>
                {
                    //图片
                    if (filetype.Equals("image"))
                    {
                        string str = string.Empty;
                        str += "<a onclick=\"ShowImage('" + p.FilePath.Replace("~", "") + "','" + p.ID + "','" + p.Fk_ID + "','" + module + "')\" href=\"#\">";
                        str += "<img src=\"" + p.FilePath.Replace("~", "") + "\" width='30px' height='30px' alt=\"\" border='0'/>";
                        str += "</a>";
                        sbphoto.Append("<tr><td class=\"d_l_t\">反馈时间：</td><td class=\"d_l_d\" colspan=\"5\">" + p.CommitTime + "</td></tr>");
                        //sbphoto.Append("<tr><td class=\"d_l_t\">反馈描述：</td><td class=\"d_l_d\" colspan=\"5\">" + p.Remark + "</td></tr>");
                        sbphoto.Append("<tr style='border-bottom:solid 3px #121214'><td class=\"d_l_t\">图片：</td><td class=\"d_l_d\" colspan=\"5\">" + str + "</td></tr>");


                        //sbphoto.Append(string.Concat(new object[]
                        //{
                        //"<a onclick=\"ShowImage('"+p.FilePath.Replace("~","")+"','"+p.ID+"','"+p.Fk_ID+"','"+module+"')\" href=\"#\">",
                        //"<img src=\"" + p.FilePath.Replace("~","") + "\" width='30px' height='30px' alt=\"\" border='0'/>",
                        //"</a>"
                        //}));
                    }
                    count++;
                });



            }
            else
            {
                sbphoto.Append("<tr><td class=\"d_l_t\">反馈时间：</td><td class=\"d_l_d\">暂无</td></tr>");
                sbphoto.Append("<tr><td class=\"d_l_t\">反馈描述：</td><td class=\"d_l_d\" colspan=\"5\">暂无</td></tr>");
                sbphoto.Append("<tr><td class=\"d_l_t\">图片：</td><td class=\"d_l_d\" colspan=\"5\">暂无图片</td></tr>");


            }
            return sbphoto.ToString();
        }

        //获取合同事项图片列表
        [Login]
        public ActionResult GetConTempInfoImage(int id, int conid, string module = "YunYingConstract")
        {
            List<t_cm_files> list = bll.t_cm_files.Where(p => p.ID == id && p.Modules == module && p.FileType == "image" && p.Fk_ID == conid).ToList();
            string strjson = "";
            if (list.Count > 0)
            {
                foreach (t_cm_files model in list)
                {
                    strjson += "<li><img src=\"" + model.FilePath.Replace("~", "") + "\" alt=\"\" /></li>";
                }
            }
            return Content(strjson);
        }
        public ActionResult GetDefaultTemp()
        {
            List<t_ES_DefaultTemplet> list = new List<t_ES_DefaultTemplet>();
            using (var bll = new pdermsWebEntities())
            {
                list = bll.t_ES_DefaultTemplet.ToList();
            }
            return Json(list);
        }
        public ActionResult GetTempByconid(int id)
        {
            List<t_ES_ContractTemplet> list = new List<t_ES_ContractTemplet>();
            using (var bll = new pdermsWebEntities())
            {
                list = bll.t_ES_ContractTemplet.Where(p => p.conid == id).ToList();
            }
            return Json(list);
        }
        public string GetTempMoBan(string ConNo, int type)
        {
            string fileName;
            string path = PubClass.Exportdoc.ExportWordConTemp(ConNo, type, out fileName);
            return path;

        }
        public string GetHanJianMoBan(int id)
        {
            var m = bll.t_ES_ContractTemplet.Where(p => p.ID == id).FirstOrDefault();
            string fileName;
            string path = PubClass.Exportdoc.ExportWordHanJianTemp(m.ConTempNo, out fileName);
            return path;

        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="fileData"></param>
        /// <param name="folder"></param>
        /// <param name="pid">配电室编号</param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public ActionResult Upload6(HttpPostedFileBase fileData, string ctype = "file", int pid = 0)
        {
            if (fileData != null)
            {
                try
                {
                    //所属编号
                    int fk_id = 0;
                    //备注
                    string Remark = string.Empty;
                    //上传用户
                    string CommitUser = string.Empty;
                    //资料类型（图片，视频,文档）
                    string FileType = string.Empty;
                    //来源(web,app)
                    string FSource = string.Empty;
                    //所属模块
                    string Modules = string.Empty;

                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";


                    // 文件上传后的保存路径

                    string url = "~/UploadFiles/YunYingConstract/";

                    string filePath = Server.MapPath(url);

                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = DateTime.Now.Ticks + fileExtension;
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";

                    //上传文件到t_PM_EmergencyPlan表和t_cm_files表
                    //保存到t_PM_EmergencyPlan表

                    //获取pk_id
                    // fk_id = ConTempID;
                    //获取上传人
                    CommitUser = CurrentUser.UserName;
                    //资料类型（图片，视频,文档）
                    FileType = getFileType(fileExtension);
                    //来源(web,app)
                    FSource = "web";
                    //所属模块
                    Modules = "matter";
                    //保存到资料库t_cm_files表
                    t_cm_files obj = new t_cm_files();
                    obj.CommitTime = DateTime.Now;
                    obj.CommitUser = CurrentUser.UserName;
                    obj.FileName = fileName;
                    obj.FilePath = url + saveName;
                    obj.FileExtension = fileExtension;
                    obj.FileSize = fSize;
                    obj.FileType = FileType;
                    obj.Fk_ID = fk_id;
                    obj.FSource = FSource;
                    obj.MaxTemp = 0;
                    obj.MinTemp = 0;
                    obj.Remark = Remark;
                    obj.Modules = Modules;
                    bll.t_cm_files.AddObject(obj);
                    bll.SaveChanges();
                    return Json(obj = obj);
                }
                catch (Exception ex)
                {
                    return Content(ex.ToString());
                }
            }
            else
            {
                return Content("false");
            }
        }


        //上传事项文件；
        public ActionResult Upload7(HttpPostedFileBase fileData, string tRemark, string ctype = "file", string modules = "matter")
        {
            if (fileData != null)
            {
                try
                {
                    //备注
                    string Remark = string.Empty;
                    //上传用户
                    string CommitUser = string.Empty;
                    //资料类型（图片，视频,文档）
                    string FileType = string.Empty;
                    //来源(web,app)
                    string FSource = string.Empty;

                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string url = "~/UploadFiles/YunYingConstract/";
                    string filePath = Server.MapPath(url);

                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = DateTime.Now.Ticks + fileExtension;
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";
                    //获取上传人
                    CommitUser = CurrentUser.UserName;
                    //资料类型（图片，视频,文档）
                    FileType = getFileType(fileExtension);
                    //来源(web,app)
                    FSource = "web";

                    //所属模块:事项；
                    //保存到t_PM_EmergencyPlan表

                    //保存到资料库t_cm_files表
                    t_cm_files obj = new t_cm_files();
                    obj.CommitTime = DateTime.Now;
                    obj.CommitUser = CurrentUser.UserName;
                    obj.FileName = fileName;
                    obj.FilePath = url + saveName;
                    obj.FileExtension = fileExtension;
                    obj.FileSize = fSize;
                    obj.FileType = FileType;
                    obj.Fk_ID = 0;
                    obj.FSource = FSource;
                    obj.MaxTemp = 0;
                    obj.MinTemp = 0;
                    obj.Remark = Remark;
                    obj.Modules = "matter";
                    bll.t_cm_files.AddObject(obj);
                    bll.SaveChanges();
                    return Json(obj);
                }
                catch (Exception ex)
                {
                    return Content(ex.ToString());
                }
            }
            else
            {
                return Content("false");
            }
        }


        public ActionResult addhanjian(t_ES_ContractTemplet model, int conid, string ConNo, int type)
        {
            string res = "";
            model.PersonID = CurrentUser.UserID;
            model.BeforDay = 3;
            model.EndTime = model.StartTime.Value.AddDays(15);

            model.DefTempID = 0;
            model.CreatTime = DateTime.Now;
            model.conid = conid;

            model.ConTempNo = ConNo + "_1";
            bll.t_ES_ContractTemplet.AddObject(model);
            bll.SaveChanges();

            if (type == 3)
            {
                res = GetHanJianMoBan(model.ID);
            }
            else
            {
                res = GetTempMoBan(ConNo, type);
            }

            return Content(res);
        }
        #endregion
    }
}
