using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;
using System.Text;
//using System.Data.Objects;
//using System.Data.Objects.SqlClient;
using System.Data.SqlClient;
using YWWeb.PubClass;
using DAL;
using IDAO.Models;

namespace YWWeb.Controllers
{
    public class DataInfoController : UserControllerBaseEx
    {

        // GET: /Web/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();

        [Login]
        public ActionResult DataTransferList()
        {
            return View();
        }

        [Login]
        public ActionResult DataTransferEdit()
        {
            return View();
        }


        //[Login]
        public ActionResult RealtimeDataInfo()
        {
            return View();
        }
        #region t_CM_DataTransfer

        public ActionResult RealtimeDataInfo1()
        {
            return View();
        }

        public ActionResult RealtimeDataInfo2()
        {
            return View();
        }
        public ActionResult RealtimeDataInfo3()
        {
            return View();
        }
        /// <summary>
        /// 根据SysCode查询实体
        /// </summary>
        /// <param name="SysCode"></param>
        /// <returns></returns>
        [Login]
        public ActionResult getDataTransfer(string SysCode)
        {
            string strJson = "";
            try
            {
                List<t_CM_DataTransfer> list = bll.t_CM_DataTransfer.Where(r => r.SysCode == SysCode).ToList();
                if (list.Count > 0)
                {
                    t_CM_DataTransfer Info = list.First();
                    strJson = JsonConvert.SerializeObject(Info);
                }
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                strJson = "error";
            }
            return Content(strJson);
        }

        /// <summary>
        /// 获取信息
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [Login]
        public ActionResult LoadDataTransferInfo(int ID)
        {
            string strJson = "";
            t_CM_DataTransfer DataTransfer = bll.t_CM_DataTransfer.Where(c => c.ID == ID).First();
            if (DataTransfer != null)
            {
                strJson = JsonConvert.SerializeObject(DataTransfer);
            }
            return Content(strJson);
        }

        /// <summary>
        /// 查询所有数据
        /// </summary>
        /// <param name="rows"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [Login]
        public ActionResult getDataTransferList(int rows, int page)
        {
            string strJson = "";
            try
            {
                List<t_CM_DataTransfer> list = bll.t_CM_DataTransfer.ToList();
                strJson = Common.List2Json(list, rows, page);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                strJson = "error";
            }
            return Content(strJson);
        }

        /// <summary>
        /// 保存信息
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SaveDataTransferInfo(t_CM_DataTransfer info)
        {
            string result = "OK";
            try
            {
                List<t_CM_DataTransfer> list = bll.t_CM_DataTransfer.Where(p => p.SysCode == info.SysCode && p.ID != info.ID).ToList();
                if (list.Count > 0)
                    result = "此数据库已存在，请重新录入！ ";
                else
                {
                    if (info.ID > 0)
                    {
                        t_CM_DataTransfer DataTransferInfo = bll.t_CM_DataTransfer.Where(r => r.ID == info.ID).First();
                        DataTransferInfo.SysCode = info.SysCode;
                        DataTransferInfo.SysName = info.SysName;
                        DataTransferInfo.pointLimit = info.pointLimit;
                        DataTransferInfo.timeLimit = info.timeLimit;
                        DataTransferInfo.CenterIP = info.CenterIP;
                        DataTransferInfo.CenterPort = info.CenterPort;
                        DataTransferInfo.UserName = info.UserName;
                        DataTransferInfo.Pwd = info.Pwd;
                        DataTransferInfo.DBType = info.DBType;
                        DataTransferInfo.DBName = info.DBName;
                        DataTransferInfo.ConnectString = info.ConnectString;
                        if (info.Remarks != null)
                            DataTransferInfo.Remarks = Server.HtmlEncode(info.Remarks).Replace("\n", "<br>");
                        else
                            DataTransferInfo.Remarks = info.Remarks;
                        bll.ObjectStateManager.ChangeObjectState(DataTransferInfo, EntityState.Modified);
                        bll.SaveChanges();
                        Common.InsertLog("数据库管理", CurrentUser.UserName, "编辑数据库信息[" + DataTransferInfo.SysCode + "]");
                    }
                    else
                    {
                        if (info.Remarks != null)
                            info.Remarks = info.Remarks.Replace("\n", "<br>");
                        else
                            info.Remarks = info.Remarks;
                        info.UseState = "0";
                        bll.t_CM_DataTransfer.AddObject(info);
                        bll.SaveChanges();
                        Common.InsertLog("数据库管理", CurrentUser.UserName, "新增数据库信息[" + info.SysCode + "]");
                    }
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return Content(result);
        }

        /// <summary>
        /// 删除信息
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        [Login]
        public ActionResult DeleteDataTransferInfo(string ids)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(ids.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_DataTransfer> list = bll.t_CM_DataTransfer.Where(m => resultlist.Any(a => a == m.ID)).ToList();
                list.ForEach(i =>
                {
                    bll.t_CM_DataTransfer.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("数据库管理", CurrentUser.UserName, "删除数据库信息[" + ids + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }

        /// <summary>
        /// 启用/屏蔽
        /// </summary>
        /// <param name="ids"></param>
        /// <param name="usestate"></param>
        /// <returns></returns>
        [Login]
        public ActionResult IsUse(string ids, string usestate)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(ids.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_DataTransfer> list = bll.t_CM_DataTransfer.Where(m => resultlist.Any(a => a == m.ID)).ToList();
                list.ForEach(i =>
                {
                    i.UseState = usestate;
                    bll.ObjectStateManager.ChangeObjectState(i, EntityState.Modified);
                    bll.SaveChanges();
                });
                if (usestate == "0")
                    Common.InsertLog("数据库管理", CurrentUser.UserName, "授权数据库[ID:" + ids + "]");
                else
                    Common.InsertLog("数据库管理", CurrentUser.UserName, "屏蔽数据库[ID:" + ids + "]");
            }
            catch (Exception ex)
            {
                result = "操作有误！";
            }
            return Content(result);
        }
        #endregion

        #region t_CM_SubSysPDRInfo

        /// <summary>
        /// 查询所有数据
        /// </summary>
        /// <param name="rows"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [Login]
        public ActionResult GetSubSysPDRList(int rows, int page)
        {
            string strJson = "";
            try
            {
                List<t_CM_SubSysPDRInfo> list = bll.t_CM_SubSysPDRInfo.ToList();
                strJson = Common.List2Json(list, rows, page);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                strJson = "error";
            }
            return Content(strJson);
        }

        /// <summary>
        /// 获取信息
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [Login]
        public ActionResult LoadSubSysPDRInfo(int ID)
        {
            string strJson = "";
            t_CM_SubSysPDRInfo SubSysPDRInfo = bll.t_CM_SubSysPDRInfo.Where(c => c.ID == ID).First();
            if (SubSysPDRInfo != null)
            {
                strJson = JsonConvert.SerializeObject(SubSysPDRInfo);
            }
            return Content(strJson);
        }

        /// <summary>
        /// 保存信息
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SaveSubSysPDRInfo(t_CM_SubSysPDRInfo info)
        {
            string result = "OK";
            try
            {
                List<t_CM_SubSysPDRInfo> list = bll.t_CM_SubSysPDRInfo.Where(p => p.SysCode == info.SysCode && p.ID != info.ID).ToList();
                if (list.Count > 0)
                    result = "此分站室已存在，请重新录入！ ";
                else
                {
                    if (info.ID > 0)
                    {
                        t_CM_SubSysPDRInfo SubSysPDRInfo = bll.t_CM_SubSysPDRInfo.Where(r => r.ID == info.ID).First();
                        SubSysPDRInfo.SysCode = info.SysCode;
                        SubSysPDRInfo.RemotePID = info.RemotePID;
                        SubSysPDRInfo.CenterPID = info.CenterPID;

                        bll.ObjectStateManager.ChangeObjectState(SubSysPDRInfo, EntityState.Modified);
                        bll.SaveChanges();
                        Common.InsertLog("分站室管理", CurrentUser.UserName, "编辑分站室信息[" + SubSysPDRInfo.SysCode + "]");
                    }
                    else
                    {
                        bll.t_CM_SubSysPDRInfo.AddObject(info);
                        bll.SaveChanges();
                        Common.InsertLog("分站室管理", CurrentUser.UserName, "新增分站室信息[" + info.SysCode + "]");
                    }
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return Content(result);
        }

        /// <summary>
        /// 删除信息
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        [Login]
        public ActionResult DeleteSubSysPDRInfo(string ids)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(ids.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_SubSysPDRInfo> list = bll.t_CM_SubSysPDRInfo.Where(m => resultlist.Any(a => a == m.ID)).ToList();
                list.ForEach(i =>
                {
                    bll.t_CM_SubSysPDRInfo.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("分站室管理", CurrentUser.UserName, "删除分站室信息[" + ids + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }

        #endregion


        //加载数据
        //[Login]
        public ActionResult LoadRealPageData(string username, int rows, int page)
        {
            try
            {
                int pid = 1;
                string strquery = " and DataTypeID!=23 ";// 不显示开关量
                string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery + " order by orderby,devicetypename,did,DataTypeID,TagID,ABCID";
                List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        public JsonResult GetTaskJson(jqDataTableParameter tableParam, int did, int cid, int tdid, int pid = 1)
        {           
            #region 2.0 加载分页数据

            //0.0 全部数据
            //string strquery = " and DataTypeID!=23 ";// 不显示开关量
            //string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery ;
            //if (cid != 0)
            //{
            //    strsql += " and v.CID=" + cid;
            //}
            //if (did != 0)
            //{
            //    strsql += " and v.DID=" + did;
            //}
            //if (tdid != 0)
            //{
            //    strsql += " and v.DTID=" + tdid;
            //}
            //strsql += " order by cid,orderby,devicetypename,did,DataTypeID,TagID,ABCID";
            //List<V_DeviceInfoState_PDR1> DataSource = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();

            List<t_V_RealTimeData> DataSource = VRealTimeDataDAL.getInstance().GetRealTimeData(99999, 1, pid, cid, tdid, did).ToList();
            ////1.0 首先获取datatable提交过来的参数
            string echo = tableParam.sEcho;  //用于客户端自己的校验
            int dataStart = tableParam.iDisplayStart;//要请求的该页第一条数据的序号
            int pageSize = tableParam.iDisplayLength == -1 ? DataSource.Count : tableParam.iDisplayLength;//每页容量（=-1表示取全部数据）
            string search = tableParam.sSearch;
            int i = tableParam.iSortingCols;
            string columns = tableParam.sColumns;
            string sortCol = tableParam.iSortCol_0;
            string sortDir = tableParam.sSortDir_0;
            //var data = DataSource.Skip<V_DeviceInfoState_PDR1>(dataStart)
            //                     .Take(pageSize)
            //                     .Select(a => new
            //                     {
            //                         DeviceTypeName = a.DeviceTypeName,
            //                         DeviceName = a.DeviceName,
            //                         CName = a.CName,
            //                         Position = a.中文描述,
            //                         pv = DataRepalce(Convert.ToInt32(a.DataTypeID), Convert.ToDecimal(a.PV)),
            //                         tagid = a.TagID,
            //                         did = a.DID,
            //                         Units=a.Units,
            //                         pointstatus = loadAlarmStatus(a.TagID, a.AlarmStatus),//获取测点状态
            //                         rectime = a.RecTime.ToString("yyyy-MM-dd HH:mm")
            //                     }).ToList();
            
            var data = DataSource.Skip<t_V_RealTimeData>(dataStart)
                                 .Take(pageSize).ToList();
            //3.0 构造datatable所需要的数据json对象...aaData里面应是一个二维数组：即里面是一个数组[["","",""],[],[],[]]
            return Json(new
            {
                sEcho = echo,
                iTotalRecords = DataSource.Count,
                iTotalDisplayRecords = DataSource.Count,
                aaData = data
            }, JsonRequestBehavior.AllowGet);
            #endregion
        }

        //类别
        //public ActionResult BindDeviceTypeName(int pid)
        //{
        //    string strsql = "select * from (select distinct a.DTID,a.Name from t_CM_DeviceType a join V_DeviceInfoState_PDR1 v on a.DTID=v.DTID join t_CM_PDRInfo p on p.PID=v.PID) as g";
        //    List<v> list = bll.ExecuteStoreQuery<v>(strsql).ToList();
        //    string strJson = Common.ComboboxToJson(list);
        //    return Content(strJson);
        //}
        //public class v
        //{
        //    public int DTID { get; set; }
        //    public string Name { get; set; }
        //}
        public ActionResult BindDevice(int pid,int DTID=-1)
        {
            List<t_DM_DeviceInfo> reslut =new List<t_DM_DeviceInfo>();
            if (DTID > 0)
            {
                reslut = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.DTID==DTID).ToList();
            }
            else
            {
                reslut = bll.t_DM_DeviceInfo.Where(p => p.PID == pid).ToList();
            }
            string strJson = Common.ComboboxToJson(reslut);
            strJson= AddShowAll(reslut.Count(), strJson, "DID", "DeviceName");
            return Content(strJson);
        }
        public ActionResult BindC(int pid,int DTID,int DID=-1)
        {
            List<t_DM_CircuitInfo> reslut = new List<t_DM_CircuitInfo>();
            var dids = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.DTID == DTID).Select(p => p.DID).ToList();
            if (DID>0)
            {
                reslut = bll.t_DM_CircuitInfo.Where(p => p.PID == pid && p.DID == DID && dids.Contains(p.DID.Value)).ToList();
            } 
            else
            {
                reslut = bll.t_DM_CircuitInfo.Where(p => p.PID == pid && dids.Contains(p.DID.Value)).ToList();
            }
                
            string strJson = Common.ComboboxToJson(reslut);
            strJson = AddShowAll(reslut.Count(), strJson, "CID", "CName");
            return Content(strJson);
        }
        private string AddShowAll(int rowcount, string strJson, string dkey, string dvalue)
        {
            if (rowcount > 0)
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==全部==\"},");
            else
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==全部==\"}");
            return strJson;
        }
        public JsonResult GetTaskJson1(jqDataTableParameter tableParam, int pid = 1)
        {
            #region 2.0 加载分页数据

            //0.0 全部数据
            string strquery = " and DataTypeID=23 and DeviceTypeName='高压室'";// 显示开关量
            string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery + " order by orderby,devicetypename,did,DataTypeID,TagID,ABCID";
            List<V_DeviceInfoState_PDR1> DataSource = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            //1.0 首先获取datatable提交过来的参数
            string echo = tableParam.sEcho;  //用于客户端自己的校验
            int dataStart = tableParam.iDisplayStart;//要请求的该页第一条数据的序号
            int pageSize = tableParam.iDisplayLength == -1 ? DataSource.Count : tableParam.iDisplayLength;//每页容量（=-1表示取全部数据）
            string search = tableParam.sSearch;
            int i = tableParam.iSortingCols;
            string columns = tableParam.sColumns;
            string sortCol = tableParam.iSortCol_0;
            string sortDir = tableParam.sSortDir_0;
            var data = DataSource.Skip<V_DeviceInfoState_PDR1>(dataStart)
                                 .Take(pageSize)
                                 .Select(a => new
                                 {
                                     DID = a.DID,
                                     Remarks = a.Remarks,
                                     pv = a.PV                              
                                 }).ToList();
            //3.0 构造datatable所需要的数据json对象...aaData里面应是一个二维数组：即里面是一个数组[["","",""],[],[],[]]
            return Json(new
            {
                sEcho = echo,
                iTotalRecords = DataSource.Count,
                iTotalDisplayRecords = DataSource.Count,
                aaData = data
            }, JsonRequestBehavior.AllowGet);
            #endregion
        }

        public JsonResult GetTaskJson2(jqDataTableParameter tableParam,int pid = 1)
        {
            #region 2.0 加载分页数据

            //0.0 全部数据
            string strquery = " and DataTypeID=23 and DeviceTypeName='低压室'";// 显示开关量
            string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery + " order by orderby,devicetypename,did,DataTypeID,TagID,ABCID";
            List<V_DeviceInfoState_PDR1> DataSource = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            //1.0 首先获取datatable提交过来的参数
            string echo = tableParam.sEcho;  //用于客户端自己的校验
            int dataStart = tableParam.iDisplayStart;//要请求的该页第一条数据的序号
            int pageSize = tableParam.iDisplayLength == -1 ? DataSource.Count : tableParam.iDisplayLength;//每页容量（=-1表示取全部数据）
            string search = tableParam.sSearch;
            int i = tableParam.iSortingCols;
            string columns = tableParam.sColumns;
            string sortCol = tableParam.iSortCol_0;
            string sortDir = tableParam.sSortDir_0;
            var data = DataSource.Skip<V_DeviceInfoState_PDR1>(dataStart)
                                 .Take(pageSize)
                                 .Select(a => new
                                 {
                                     DID = a.DID,
                                     Remarks = a.Remarks,
                                     pv = a.PV
                                 }).ToList();
            //3.0 构造datatable所需要的数据json对象...aaData里面应是一个二维数组：即里面是一个数组[["","",""],[],[],[]]
            return Json(new
            {
                sEcho = echo,
                iTotalRecords = DataSource.Count,
                iTotalDisplayRecords = DataSource.Count,
                aaData = data
            }, JsonRequestBehavior.AllowGet);
            #endregion
        }

        private string DataRepalce(int datatypeid, decimal pv)
        {
            if (datatypeid == 1 && pv > 240)
            {
                pv = 0;
            }
            if (pv == 0)
                return "--";
            else
                return pv + "";
        }
        //private t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}
        //获取当前测点的状态
        private string loadAlarmStatus(int tagid, string realstatus)
        {
            string status = "正常";
            string strsql = "select top 1 AlarmConfirm+ALarmType from t_AlarmTable_en  where  TagID=" + tagid + " and ALarmType<>'恢复' order by AlarmConfirm,AlarmState desc";
            try
            {
                List<string> list = bll.ExecuteStoreQuery<string>(strsql).ToList();

                if (list.Count() > 0)
                {
                    string value = list[0];
                    if (value.Contains("未确认"))
                    {
                        status = value.Substring(3);
                    }
                    else
                        status = "已确认";
                }
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                //status = strsql;
            }

            return realstatus + " " + status;

        }
    }

    /// <summary>
    /// 在服务器端,可以通过以下请求参数来获得当前客户端的操作信息
    /// jquery $('selector').datatable()插件 参数model
    /// </summary>
    public class jqDataTableParameter
    {
        /// <summary>
        /// 1.0 DataTable用来生成的信息
        /// </summary>       
        public string sEcho { get; set; }

        /// <summary>
        /// 2.0分页起始索引
        /// </summary>
        public int iDisplayStart { get; set; }

        /// <summary>
        /// 3.0每页显示的数量
        /// </summary>
        public int iDisplayLength { get; set; }

        /// <summary>
        /// 4.0搜索字段
        /// </summary>
        public string sSearch { get; set; }

        /// <summary>
        /// 5.0列数
        /// </summary>
        public int iColumns { get; set; }

        /// <summary>
        /// 6.0排序列的数量
        /// </summary>
        public int iSortingCols { get; set; }

        /// <summary>
        /// 7.0逗号分割所有的列
        /// </summary>
        public string sColumns { get; set; }

        /// <summary>
        /// 8.0排序的列
        /// </summary>
        public string iSortCol_0 { get; set; }

        /// <summary>
        ///9.0排序的类型
        /// </summary>
        public string sSortDir_0 { get; set; }
    }
}