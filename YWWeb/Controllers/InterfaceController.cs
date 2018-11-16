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
    public class InterfaceController : Controller
    {
        //
        // GET: /Interface/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Index()
        {
            return View();
        }
        private string getSessionID()
        {
            string sessionid = "";
            if (Request.Headers["Cookie"] != null)
            {

                sessionid = Request.Headers["Cookie"].ToString();
                sessionid = sessionid.Substring(sessionid.IndexOf('=') + 1);

            }
            return sessionid;
        }
        public ActionResult AppUserInfo(string username, string UserPassWord)         //接口登录验证  创建于 20160411
        {
            try
            {
                string MD5password = Encrypt.MD5Encrypt(UserPassWord);
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.UserName == username && u.UserPassWord == MD5password).ToList();

                if (list.Count > 0)
                {
                    Session["Huerinfo"] = list[0];
                    string sID = Session.SessionID;
                    Session[sID] = list[0];
                    //log
                    Common.InsertLog("接口用户登录", username, "接口用户登录[" + username + "]");
                    return Content(sID);
                }
                else
                {
                    return Content("用户名密码错误");
                }
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        public ActionResult getUserAllot()         //查询授权,获取授权 修改于 20160525
        {
            string sid = getSessionID().Split(';')[0];
            string strJson = "";
            string pdrlist = "";
            string getNandS = "";
            string[] NandS = { "", "" };
            string[] PDRType = { "地上开闭站", "地下开闭站", "高低压电缆分界室", "高低压电缆分界箱 ", "低压配电室", "地上小区配电室", "地下小区配电室", "用户配电室", "开闭器", "小区配电室(箱变)" };
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
               // pdrlist = user.PDRList;
                pdrlist = HomeController.GetPID(user.UNITList);
                string pdrSQL = "SELECT * FROM t_CM_PDRInfo WHERE pid in (" + pdrlist + ")";
                List<t_CM_PDRInfo> list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(pdrSQL).ToList();
                List<t_CM_Area> Arealist = bll.t_CM_Area.ToList();
                if (list.Count > 0)
                {
                    foreach (t_CM_PDRInfo model in list)
                    {
                        getNandS = "";
                        if (model.Coordination != null)
                        {
                            NandS = model.Coordination.Split('|');
                            getNandS = "\",\"latitude\":\"" + NandS[0] + "\",\"longtitude\":\"" + NandS[1];
                            strJson += "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + getNandS + "\",\"status\":\"" + model.AlarmState + "\",\"Area\":\"" + Arealist.Where(a => a.AreaID == model.AreaID).First().AreaName + "\",\"Type\":\"" + PDRType[(int)model.TypeID - 1] + "\"},";
                        }
                        else
                        {
                            strJson += "";
                        }
                    }
                    strJson = strJson.TrimEnd(',');
                    strJson = "{\"rows\":[" + strJson + "]," + "\"total\":" + list.Count + "}";
                }
            }
            else
                strJson = "no login";
            return Content(strJson);
        }
        public ActionResult getPDRInfo(string UserName)         //获取权限内配电房信息 修改于 20160525
        {
            string sid = getSessionID().Split(';')[0];
            string strJson = "";
            string pdrlist = "0";
            string getNandS = "";
            string[] NandS = { "", "" };
            string[] PDRType = { "地上开闭站", "地下开闭站", "高低压电缆分界室", "高低压电缆分界箱 ", "低压配电室", "地上小区配电室", "地下小区配电室", "用户配电室", "开闭器", "小区配电室(箱变)" };
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                List<t_CM_UserInfo> UserList = bll.t_CM_UserInfo.Where(u => u.UserName == UserName && u.UserName != "admin").ToList();
                if (UserList.Count > 0)
                {
                    pdrlist = HomeController.GetPID(UserList.First().UNITList);
                }
                string pdrSQL = "SELECT * FROM t_CM_PDRInfo WHERE pid in (" + pdrlist + ")";
                List<t_CM_PDRInfo> list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(pdrSQL).ToList();
                List<t_CM_Area> Arealist = bll.t_CM_Area.ToList();
                if (list.Count > 0)
                {
                    foreach (t_CM_PDRInfo model in list)
                    {
                        getNandS = "";
                        if (model.Coordination != null)
                        {
                            NandS = model.Coordination.Split('|');
                            getNandS = "\",\"latitude\":\"" + NandS[0] + "\",\"longtitude\":\"" + NandS[1];
                            strJson += "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + getNandS + "\",\"status\":\"" + model.AlarmState + "\",\"Area\":\"" + Arealist.Where(a => a.AreaID == model.AreaID).First().AreaName + "\",\"Type\":\"" + PDRType[(int)model.TypeID - 1] + "\"},";
                        }
                        else
                        {
                            strJson += "";
                        }
                    }
                    strJson = strJson.TrimEnd(',');
                    strJson = "{\"rows\":[" + strJson + "]," + "\"total\":" + list.Count + "}";
                }
            }
            else
                strJson = "no login";
            return Content(strJson);
        }
        public ActionResult getDeviceInfo(int pid)         //获取权限内配电房的设备信息 修改于 20160525
        {
            string sid = getSessionID().Split(';')[0];
            string strJson = "";
            string pdrlist = "";
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                pdrlist = HomeController.GetPID(user.UNITList);
                //pdrlist = user.PDRList;

                string pdrSQL = "SELECT * FROM t_DM_DeviceInfo WHERE PID = " + pid + " and pid in (" + pdrlist + ")";
                List<t_DM_DeviceInfo> list = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(pdrSQL).ToList();
                List<t_CM_DeviceType> DTlist = bll.t_CM_DeviceType.ToList();
                if (list.Count > 0)
                {
                    foreach (t_DM_DeviceInfo model in list)
                    {
                        strJson += "{\"DID\":" + model.DID + ",\"DeviceName\":\"" + model.DeviceName + "\",\"DeviceType\":\"" + DTlist.Where(k => k.DTID == (int)model.DTID).First().Name + "\",\"UseState\":\"" + model.UseState + "\"},";
                    }
                    strJson = strJson.TrimEnd(',');
                    strJson = "{\"rows\":[" + strJson + "]," + "\"total\":" + list.Count + "}";
                }
            }
            else
                strJson = "no login";
            return Content(strJson);
        }
        public ActionResult getPointsInfo(int did)         //获取权限内配电房的设备的测点信息 修改于 20160525
        {
            string sid = getSessionID().Split(';')[0];
            string strJson = "";
            string pdrlist = "";
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                pdrlist = HomeController.GetPID(user.UNITList);
                //pdrlist = user.PDRList;

                string pdrSQL = "SELECT * FROM V_PointsInfo WHERE DID = " + did + " and pid in (" + pdrlist + ")";
                List<V_PointsInfo> list = bll.ExecuteStoreQuery<V_PointsInfo>(pdrSQL).ToList();
                List<t_CM_DeviceType> DTlist = bll.t_CM_DeviceType.ToList();
                if (list.Count > 0)
                {
                    foreach (V_PointsInfo model in list)
                    {
                        strJson += "{\"TagID\":" + model.TagID + ",\"TagName\":\"" + model.Position + "\",\"TypeName\":\"" + model.TypeName + "\"},";
                    }
                    strJson = strJson.TrimEnd(',');
                    strJson = "{\"rows\":[" + strJson + "]," + "\"total\":" + list.Count + "}";
                }
            }
            else
                strJson = "no login";
            return Content(strJson);
        }
        public ActionResult getRealTimeValue(string tagid)         //获取测点实时温度信息 修改于 20160525
        {
            string sid = getSessionID().Split(';')[0];
            string strJson = "";
            string pdrlist = "";
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                //pdrlist = user.PDRList;

                pdrlist = HomeController.GetPID(user.UNITList);
                string pdrSQL = "SELECT * FROM V_DeviceInfoState_PDR1 WHERE TagID in (" + tagid + ") and pid in (" + pdrlist + ")";
                List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(pdrSQL).ToList();

                if (list.Count > 0)
                {
                    foreach (V_DeviceInfoState_PDR1 model in list)
                    {
                        strJson += "{\"TagID\":" + model.TagID + ",\"PV\":" + model.PV + ",\"Units\":\"" + model.Units + "\",\"RecTime\":\"" + model.RecTime + "\"},";
                    }
                    strJson = strJson.TrimEnd(',');
                    strJson = "{\"rows\":[" + strJson + "]," + "\"total\":" + list.Count + "}";
                }
            }
            else
                strJson = "no login";
            return Content(strJson);
        }
        public ActionResult getPtAlarmInfo(int pid, string ALarmType, string startdate, string enddate)         //获取报警信息 修改于 20160525
        {
            string sid = getSessionID().Split(';')[0];
            string strJson = "";
            string pdrlist = "";
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                pdrlist = HomeController.GetPID(user.UNITList);
               // pdrlist = user.PDRList;
                string pdrSQL = "SELECT * FROM t_AlarmTable_en WHERE PID = " + pid + " and pid in (" + pdrlist + ")";
                if (ALarmType != "" && ALarmType != null)
                {
                    pdrSQL += " and ALarmType = " + ALarmType;
                }
                if (startdate != "" && startdate != null)
                    startdate = startdate.Replace('-', '/');
                else
                    startdate = DateTime.Now.ToString("yyyy/MM/dd");
                if (enddate != "" && enddate != null)
                    enddate = enddate.Replace('-', '/');
                else
                    enddate = DateTime.Now.ToString("yyyy/MM/dd");
                pdrSQL += " and AlarmDate>='" + startdate + "' and AlarmDate<='" + enddate + "'";


                List<t_AlarmTable_en> list = bll.ExecuteStoreQuery<t_AlarmTable_en>(pdrSQL).ToList();

                if (list.Count > 0)
                {
                    foreach (t_AlarmTable_en model in list)
                    {
                        strJson += "{\"TagID\":\"" + model.TagID + "\",\"AlarmCate\":\"" + model.AlarmArea + model.AlarmAddress + "\",\"AlarmValue\":\"" + model.AlarmValue + "\",\"ALarmType\":\"" + model.ALarmType + "\",\"AlarmState\":\"" + model.AlarmState + "\",\"AlarmConfirm\":\"" + model.AlarmConfirm + "\",\"AlarmTime\":\"" + model.AlarmTime + "\"},";
                    }
                    strJson = strJson.TrimEnd(',');
                    strJson = "{\"rows\":[" + strJson + "]," + "\"total\":" + list.Count + "}";
                }
            }
            else
                strJson = "no login";
            return Content(strJson);
        }

        public ActionResult MonthBoll(int? Month, int PID, int DID, int CID)
        {
            if (Month != null)
            {
                for (int j = 1; j < 31; j++)
                {
                    string sSql = "exec proc_ee_insertrandom '2017-" + Month + "-" + j + " 00:00:00','t_EE_PowerQualityMonthly','" + PID + "','" + DID + "','" + CID + "'";
                    bll.ExecuteStoreCommand(sSql);
                }
            }
            return Content("OK");
        }
        public ActionResult DayBoll(int Month, int PID, int DID, int CID)
        {
            for (int i = 1; i <= 31; i++)
            {
                for (int j = 0; j < 24; j++)
                {
                    string sSql = "exec proc_ee_insertrandom '2017-" + Month + "-" + i + " " + j + ":00:00','t_EE_PowerQualityDaily','" + PID + "','" + DID + "','" + CID + "'";
                    bll.ExecuteStoreCommand(sSql);
                }
            }
            return Content("OK");
        }
        public ActionResult RealBoll(int RDM, int RDD, int PID, int DID, int CID)
        {
            for (int i = 1; i < 24; i++)
            {
                for (int j = 0; j < 60; j += 5)
                {
                    string sSql = "exec proc_ee_insertrandom '2017-" + RDM + "-" + RDD + " " + i + ":" + j + ":00','t_EE_PowerQualityRealTime','" + PID + "','" + DID + "','" + CID + "'";
                    bll.ExecuteStoreCommand(sSql);
                }
            }
            return Content("OK");
        }
        public ActionResult InsertHisTable(string Date, string PID, int TID, int Count, int BValue = 23)
        {
            string ss = "";
            DateTime Time = Convert.ToDateTime(Date);
            Random ran = new Random();
            int RandKey = 0;
            for (int i = 0; i < Count; i++)
            {
                RandKey = ran.Next(-5, 10) + BValue;
                Time = Time.AddMinutes(5);
                string sSql = " insert into t_SM_HisData_00" + PID + " VALUES  ('" + Time + "' ," + TID + " ," + PID + " ," + RandKey + " ,'正常', 10000)";
                bll.ExecuteStoreCommand(sSql);
                ss += Time + ":" + RandKey + ",";
            }
            return Content(ss);
        }
    }
}
