using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Data.Objects;
using System.Data.Objects.SqlClient;
using System.Data.SqlClient;
using S5001Web.PubClass;

namespace S5001Web.Controllers
{
    public class WebController : Controller
    {

        // GET: /Web/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();

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

        [Login]
        public ActionResult SubSysPDRInfoList()
        {
            return View();
        }

        #region t_CM_DataTransfer

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
        public ActionResult getDataTransferList(int rows, int page, string sysname)
        {
            string strJson = "";
            try
            {
                List<t_CM_DataTransfer> list = bll.t_CM_DataTransfer.ToList();
                if (!string.IsNullOrEmpty(sysname))
                    list = bll.t_CM_DataTransfer.Where(d => d.SysName.Contains(sysname)).ToList();
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
                    result = "此子站名称已存在，请重新录入！ ";
                else
                {
                    if (info.ID > 0)
                    {
                        t_CM_DataTransfer DataTransferInfo = bll.t_CM_DataTransfer.Where(r => r.ID == info.ID).First();
                        DataTransferInfo.SysCode = info.SysCode;
                        DataTransferInfo.SysName = info.SysName;
                        DataTransferInfo.address = info.address;
                        DataTransferInfo.SetupDate = info.SetupDate;
                        DataTransferInfo.CommStatus = info.CommStatus;
                        DataTransferInfo.UploadDate = info.UploadDate;
                        DataTransferInfo.SysVersion = info.SysVersion;
                        DataTransferInfo.SysUpdateDate = info.SysUpdateDate;
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
                        Common.InsertLog("子站管理", CurrentUser.UserName, "编辑子站管理信息[" + DataTransferInfo.SysCode + "]");
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
                        Common.InsertLog("子站管理", CurrentUser.UserName, "新增子站管理信息[" + info.SysCode + "]");
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
                Common.InsertLog("子站管理", CurrentUser.UserName, "删除子站管理信息[" + ids + "]");//log
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
                    Common.InsertLog("子站管理", CurrentUser.UserName, "授权子站管理[ID:" + ids + "]");
                else
                    Common.InsertLog("子站管理", CurrentUser.UserName, "屏蔽子站管理[ID:" + ids + "]");
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


        private t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
    }
}