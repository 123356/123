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
using System.Collections.Specialized;

namespace YWWeb.Controllers
{
    public class AppController : Controller
    {
        //
        // GET: /App/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();

        //获取用户信息
        public ActionResult LoadUser()
        {
            string strJson = "error";
            string sid = getSessionID();
            if (!sid.Equals(""))
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                if (user != null)
                {
                    strJson = JsonConvert.SerializeObject(user);
                    strJson = Common.JsonDataInfo(user);
                }
            }
            else
                strJson = "no login";
            return Content(strJson);
        }
        private string getSessionID()
        {
            string sessionid = "";
            if (Request.Headers["Cookie"] != null)
            {
                sessionid = Request.Headers["Cookie"].ToString();                
                //sessionid = sessionid.Substring(sessionid.IndexOf('_') + 1);
                //sessionid = sessionid.Substring(sessionid.IndexOf('=') + 1);
                sessionid = sessionid.Replace(';','&').Replace(" ","");
                NameValueCollection query = HttpUtility.ParseQueryString(sessionid, Encoding.GetEncoding("gb2312"));
                sessionid = query["ASP.NET_SessionId"];
            }
            return sessionid;
        }
        //监测页面_获取配电房列表 修改于 20160407
        public ActionResult getPDRList()
        {
            string sid = getSessionID();
            string strJson = "";
            string pdrlist = "";
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                pdrlist = HomeController.GetPID(user.UNITList);
                //pdrlist = user.PDRList;
                List<int> listid = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));

                string pdrSQL = "SELECT * FROM t_CM_PDRInfo WHERE pid in (" + pdrlist + ")";
                List<t_CM_PDRInfo> list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(pdrSQL).ToList();
                string AlarmpdrSQL = "  SELECT distinct AlarmState,PID FROM t_AlarmTable_en WHERE pid in (" + pdrlist + ") order by  AlarmState desc";
                List<AlarmTable> Alarmlist = bll.ExecuteStoreQuery<AlarmTable>(AlarmpdrSQL).ToList();

                if (list.Count > 0)
                {
                    foreach (t_CM_PDRInfo model in list)
                    {
                        int getAlarmState = 0;
                        List<AlarmTable> Alarm = Alarmlist.Where(a => a.PID == model.PID).ToList();
                        if (Alarm.Count > 0)
                        {
                            getAlarmState = Convert.ToInt32(Alarm[0].AlarmState);
                        }
                        string getNandS = "";
                        string[] NandS = { "", "" };
                        if (model.Coordination != null)
                        {
                            string Camstr = "";
                            List<t_CM_CameraInfo> Cameras = bll.t_CM_CameraInfo.Where(cr => cr.PID == model.PID).ToList();
                            if (Cameras.Count > 0)
                            {
                                t_CM_CameraInfo Camera = Cameras.First();
                                Camstr = ",\"videourl\":\"/Media/login.html?OpenPreView=" + Camera.OpenPreView + "&user=" + Camera.UserName + "&passwd=" + Camera.passwd + "&mediaport=" + Camera.mediaport + "&StreamType=" + Camera.nStreamType + "&IP=" + Camera.ip + "\"";
                            }
                            NandS = model.Coordination.Split('|');
                            string latitude = "0", longtitude = "0";
                            if (NandS.Length > 1) {
                                latitude = NandS[0].ToString();
                                longtitude = NandS[1].ToString();
                            }
                            getNandS = "\",\"latitude\":\"" + latitude + "\",\"longtitude\":\"" + longtitude;

                            if (getAlarmState <= 0)
                            {

                                strJson = strJson + ", {\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + getNandS + "\",\"status\":\"" + getAlarmState + "\"" + getRealTimeData(model.PID) + Camstr + "}";
                            }
                            else
                            {
                                strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + getNandS + "\",\"status\":\"" + getAlarmState + "\"" + getRealTimeData(model.PID) + Camstr + "}," +  strJson;
                            }    
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
        public class AlarmTable
        {
            public int AlarmState { set; get; }
            public int PID { set; get; }
        }
        //获取配电房所有的设备列表
        public ActionResult DeviceInfoList(int pid, int pagesize, int pageindex)
        {
            string strJson = "no data";
            try
            {
                List<t_DM_DeviceInfo> list = bll.t_DM_DeviceInfo.Where(d => d.PID == pid).ToList();
                strJson = Common.List2Json(list, pagesize, pageindex);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                strJson = "error";
            }
            //    }
            //}
            return Content(strJson);
        }
        //获取配电房实时温度，湿度数据   修改于 20160408
        private string getRealTimeData(int pid)
        {
            List<int> TypeList = new List<int>();
            TypeList.Add(12);
            TypeList.Add(13);
            List<V_PointsInfo> list = bll.V_PointsInfo.Where(p => p.PID == pid && TypeList.Contains((int)p.DataTypeID)).ToList();
            string temperature = "[", humidity = "[";
            List<int> ltemp = new List<int>();//温度taglist
            List<int> lhumid = new List<int>();//湿度taglist
            List<int> taglist = new List<int>();//所有的tagid list
            foreach (V_PointsInfo model in list)
            {
                taglist.Add(model.TagID);
                if (model.DataTypeID == 12)
                    ltemp.Add(model.TagID);
                else
                    lhumid.Add(model.TagID);
            }
            List<V_RealTimeData_All> alllist = bll.V_RealTimeData_All.Where(a => taglist.Contains(a.TagID)).ToList();
            V_PointsInfo pointsinfo = null;
            foreach (V_RealTimeData_All RealData in alllist)
            {
                pointsinfo = list.Where(p => p.TagID == RealData.TagID).First();
                if (ltemp.Contains(RealData.TagID))
                    temperature = temperature + "{ \"postion\": \"" + pointsinfo.Position + "\",\"pv\":" + RealData.PV + "},";
                else
                    humidity = humidity + "{ \"postion\": \"" + pointsinfo.Position + "\",\"pv\":" + RealData.PV + "},";
            }
            if (!humidity.Equals(""))
                humidity = humidity.TrimEnd(',');
            if (!temperature.Equals(""))
                temperature = temperature.TrimEnd(',');
            return ",\"Temperature\":" + temperature + "],\"Humidity\":" + humidity + "]";
        }
        //获取测点实时数据
        public ActionResult RealTimePointInfo(int tagid)
        {
            string strJson = "";
            try
            {
                List<V_RealTimeData_All> list = bll.V_RealTimeData_All.Where(r => r.TagID == tagid).ToList();
                strJson = Common.List2Json(list);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                strJson = "error";
            }
            return Content(strJson);
        }
        //获取测点历史数据
        public ActionResult HistoryPointInfo(int pid, int tagid, int pageSize, int index)
        {
            string strJson = "";
            try
            {
                DateTime DateStart = DateTime.Today.AddYears(-1);
                DateTime DateEnd = DateTime.Today;

                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                string strwhere = "记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "' and  测点编号=" + tagid;
                List<配电房_00001_历史数据表> list = bll.P_HisData(tablename, "*", "记录时间", pageSize, index, true, strwhere).ToList();
                strJson = Common.List2Json(list);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                strJson = "error";
            }
            return Content(strJson);
        }
        //报警页面_报警列表返回  修改于 20170510
        public ActionResult getStationAlarm(int pagesize, int pageindex, int type) //
        {
            string sqltime;
            int startrows = pagesize * (pageindex - 1);
            string sid = getSessionID();
            string pdrlist = "";
            string strJson = "[";
            try
            {
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                    pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;
                    if (type == 0)
                    {
                        DateTime DateStart = Convert.ToDateTime(DateTime.Today.ToString("yyyy/MM/dd 00:00:00"));                 //获得今天的开始和结束时间
                        DateTime DateEnd = DateStart.AddDays(1);
                        sqltime = "where AlarmDate >= '" + DateStart.ToString("yyyy/MM/dd") + "' and AlarmDate <='" + DateEnd.ToString("yyyy/MM/dd") + "'";
                    }
                    else if (type == 1)
                    {
                        DateTime WeeklyDay = DateTime.Today;                                                                     //得到本周的开始和结束时间
                        int DayOfWeek = Convert.ToInt16(WeeklyDay.DayOfWeek);
                        if (DayOfWeek == 0)
                            DayOfWeek = 7;
                        DateTime WeekStart = WeeklyDay.AddDays(Convert.ToDouble((1 - DayOfWeek)));
                        DateTime WeekEnd = WeeklyDay.AddDays(Convert.ToDouble((7 - DayOfWeek))).AddHours(23).AddMinutes(59).AddSeconds(59);
                        sqltime = "where AlarmDate >= '" + WeekStart.ToString("yyyy/MM/dd") + "' and AlarmDate <='" + WeekEnd.ToString("yyyy/MM/dd") + "'";
                    }
                    else if (type == 2)
                    {
                        DateTime MonthStart = Convert.ToDateTime(DateTime.Today.ToString("yyyy-MM-01 00:00:00"));              //得到本月的开始和结束时间
                        DateTime MonthEnd = MonthStart.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);
                        sqltime = "where AlarmDate >= '" + MonthStart.ToString("yyyy/MM/dd") + "' and AlarmDate <='" + MonthEnd.ToString("yyyy/MM/dd") + "'";
                    }
                    else
                        sqltime = "where 1 = 1";

                    string Esql = "SELECT * FROM t_AlarmTable_en  " + sqltime + " and PID in (" + pdrlist + ") order by Company"; //在报警表中取自己权限内的配电房列表
                    List<t_AlarmTable_en> Elist = bll.ExecuteStoreQuery<t_AlarmTable_en>(Esql).ToList();
                    Elist = Elist.Skip(startrows).Take(pagesize).ToList();
                    if (Elist.Count > 0)
                    {
                        foreach (t_AlarmTable_en eachAt in Elist)
                        {
                            if (eachAt.AlarmConfirm != "未确认")
                            {
                                strJson += "{\"AlarmType\":\"" + eachAt.ALarmType + "\",\"AlarmCate\":\"" + eachAt.AlarmCate + "\",\"AlarmValue\":\"" + eachAt.AlarmValue + "\",\"AlarmMaxValue\":\"" + eachAt.AlarmMaxValue + "\",\"UserName\":\"" + eachAt.UserName + "\",\"ConfirmDate\":\"" + eachAt.ConfirmDate + "\",\"AlarmState\":\"" + eachAt.AlarmState + "\",\"ItemType\":\"" + "5" + "\",\"alarmDate\":\"" + eachAt.AlarmDate + " " + eachAt.AlarmTime + "\",\"alertType\":\"" + eachAt.AlarmArea + eachAt.AlarmAddress + "\",\"hasRead\":\"" + eachAt.AlarmConfirm + "\",\"point\":\"" + eachAt.AlarmAddress + "\",\"roomName\":\"" + eachAt.Company + "\"},";
                            }
                            else if (eachAt.AlarmConfirm == "未确认")
                            {
                                strJson += "{\"AlarmType\":\"" + eachAt.ALarmType + "\",\"AlarmCate\":\"" + eachAt.AlarmCate + "\",\"AlarmValue\":\"" + eachAt.AlarmValue + "\",\"AlarmMaxValue\":\"" + eachAt.AlarmMaxValue + "\",\"UserName\":\"" + eachAt.UserName + "\",\"ConfirmDate\":\"" + eachAt.ConfirmDate + "\",\"AlarmState\":\"" + eachAt.AlarmState + "\",\"ItemType\":\"" + "4" + "\",\"alarmDate\":\"" + eachAt.AlarmDate + " " + eachAt.AlarmTime + "\",\"alertType\":\"" + eachAt.AlarmArea + eachAt.AlarmAddress + "\",\"hasRead\":\"" + eachAt.AlarmConfirm + "\",\"point\":\"" + eachAt.AlarmAddress + "\",\"roomName\":\"" + eachAt.Company + "\"," + PDRHisDataJson(Convert.ToString(eachAt.AlarmDateTime), Convert.ToInt32(eachAt.PID), Convert.ToInt32(eachAt.DID), Convert.ToInt32(eachAt.TagID)) + "},";
                            }
                        }
                    }
                    strJson = strJson.TrimEnd(',') + "]";
                }
                else
                    strJson = "no login";
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                strJson = "error";
            }
            //    }
            //}
            return Content(strJson);
        }
        private class AlarmCompany
        {
            public string Company { get; set; }
            public string ALarmType { get; set; }
        }
        //报警配电房历史温度  创建于 20160408
        private string PDRHisDataJson(string AlarmTime, int pid = 0, int did = 0, int tagid = 0)
        {
            try
            {
                string sid = getSessionID();
                string strJson = "[";
                if (sid != null && sid != "")
                {
                    DateTime DateStart = Convert.ToDateTime(AlarmTime).AddHours(-18);
                    DateTime DateEnd = Convert.ToDateTime(AlarmTime);
                    Double LastVal = 0;
                    string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                    //获取设备温度与该配电室环境温度（PID = 12）
                    List<V_DeviceInfoState_PDR1> PDRlist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>("select * from V_DeviceInfoState_PDR1 where DID=" + did + " and (DataTypeID = 12 or DataTypeID = 24) and pv>0 order by DataTypeID").ToList();

                    int D = tagid;
                    int R = 0;
                    if (PDRlist.Count > 0)
                    {
                        R = PDRlist.Last().TagID;
                    }
                    else
                        R = 0;
                    string Dsql = "select 记录时间 Graphdate,测量值 Graphvalue ,测点编号 Graphtagid from " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "' and 测点编号=" + D;
                    string Rsql = "select 记录时间 Graphdate,测量值 Graphvalue ,测点编号 Graphtagid from " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "' and 测点编号=" + R;

                    List<AppGraphsPoint> Dlist = bll.ExecuteStoreQuery<AppGraphsPoint>(Dsql).ToList();//历史设备温度 间隔2小时，取9点
                    List<AppGraphsPoint> RList = bll.ExecuteStoreQuery<AppGraphsPoint>(Rsql).ToList();//历史环境温度 间隔2小时，取9点

                    DateTime Start = DateStart;
                    DateTime End = Start.AddHours(2);

                    List<AppGraphsPoint> LVD = RList.Where(j => j.Graphvalue > 0 && j.Graphvalue < 40).ToList();
                    if (LVD.Count > 0)
                        LastVal = LVD.First().Graphvalue;
                    else
                        LastVal = 25.0;

                    strJson = "\"HisDevData\":{";
                    for (int m = 0; m < 9; m++)
                    {
                        List<AppGraphsPoint> HisDevList = Dlist.Where(n => n.Graphdate >= Start && n.Graphdate <= End && n.Graphtagid == D).ToList();
                        if (HisDevList.Count > 0)
                        {
                            AppGraphsPoint AGP = HisDevList.OrderByDescending(n => n.Graphvalue).ToList().First();
                            strJson += "\"" + End + "\":" + AGP.Graphvalue + ",";
                            LastVal = AGP.Graphvalue;
                        }
                        else
                        {
                            strJson += "\"" + End + "\":" + LastVal + ",";
                        }
                        Start = Start.AddHours(2);
                        End = End.AddHours(2);
                    }
                    strJson = strJson.TrimEnd(',') + "}";
                    //重置计数
                    Start = DateStart;
                    End = Start.AddHours(2);

                    List<AppGraphsPoint> LVR = RList.Where(j => j.Graphvalue > 0 && j.Graphvalue < 40).ToList();
                    if (LVR.Count > 0)
                        LastVal = LVR.First().Graphvalue;
                    else
                        LastVal = 25.0;

                    strJson += ",\"HisEnvData\":{";
                    for (int m = 0; m < 9; m++)
                    {
                        List<AppGraphsPoint> HisEnvList = RList.Where(n => n.Graphdate >= Start && n.Graphdate <= End && n.Graphtagid == R).ToList();
                        if (HisEnvList.Count > 0)
                        {
                            AppGraphsPoint AGP = HisEnvList.OrderByDescending(n => n.Graphvalue).ToList().First();
                            strJson += "\"" + End + "\":" + AGP.Graphvalue + ",";
                            LastVal = AGP.Graphvalue;
                        }
                        else
                        {
                            strJson += "\"" + End + "\":" + LastVal + ",";
                        }
                        Start = Start.AddHours(2);
                        End = End.AddHours(2);
                    }
                    strJson = strJson.TrimEnd(',') + "}";


                }
                else
                    strJson = "no login";
                return strJson;
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return error;
            }
        }
        //历史曲线实体  创建于 20160408
        public class AppGraphsPoint
        {
            public DateTime Graphdate { set; get; }
            public double Graphvalue { set; get; }
            public int Graphtagid { set; get; }
        }
        //获取设备的温度测点列表
        public ActionResult GetPointsInfo(int did)
        {

            string strJson = "no data";
            string sid = getSessionID();

            if (sid != null && sid != "")
            {
                try
                {
                    List<t_DM_DeviceInfo> dlist = bll.t_DM_DeviceInfo.Where(d => d.DID == did).ToList();
                    if (dlist.Count > 0)
                    {
                        t_DM_DeviceInfo model = dlist.First();
                        int pid = (int)model.PID;
                        string tablename = "t_SM_RealTimeData_" + pid.ToString("00000");
                        string sql = "select r.TagID,TagName,PV,PID,Position,DataTypeID from " + tablename + " r join t_CM_PointsInfo p on r.TagID=p.TagID where DID=" + did;
                        List<PointsTempInfo> list = bll.ExecuteStoreQuery<PointsTempInfo>(sql).ToList();
                        //List<t_CM_PointsInfo> list = bll.t_CM_PointsInfo.Where(p => p.DID == did && p.DataTypeID==1).ToList();
                        strJson = "{\"info\":" + JsonConvert.SerializeObject(model) + ",\"rows\":" + Common.ComboboxToJson(list) + "}";
                    }
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    strJson = "error";
                }
            }
            return Content(strJson);
        }
        public class PointsTempInfo
        {
            public int TagID { set; get; }
            public string TagName { set; get; }
            public double PV { set; get; }
            public string Position { set; get; }
            public int DataTypeID { set; get; }
        }
        //获取当前设备测点温度
        List<string> getPDRNameOkList(string pdrlist)
        {
            try
            {
                List<string> sPDRNameOkList = new List<string>();
                if (pdrlist != null && !pdrlist.Equals(""))
                {
                    List<int> listid = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
                    var query = from module in bll.t_CM_PDRInfo where listid.Contains(module.PID) select module;
                    List<t_CM_PDRInfo> list = query.ToList();
                    foreach (t_CM_PDRInfo module in list)
                    {
                        sPDRNameOkList.Add(module.Name);
                    }
                }
                return sPDRNameOkList;

            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return null;
            }
        }
        //捕捉界面接口_获取配电房列表:获取配电房+ 设备 + 设备监测点 的Json  创建于 20160411
        public ActionResult PReado()
        {
            try
            {
                string sid = getSessionID();
                string pdrlist = "1,2,3";

                string strJson = "[";
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                     pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;

                    strJson = "[";
                    string PDRsql = "SELECT * FROM t_CM_PDRInfo WHERE PID in (" + pdrlist + ")";
                    List<t_CM_PDRInfo> PDRlist = bll.ExecuteStoreQuery<t_CM_PDRInfo>(PDRsql).ToList();

                    foreach (t_CM_PDRInfo PDR in PDRlist)
                    {
                        strJson += "{\"PID\":" + PDR.PID + ",\"PDRName\":\"" + PDR.Name + "\",";
                        string DEVsql = "SELECT top 2 * FROM t_DM_DeviceInfo WHERE PID= " + PDR.PID;
                        List<t_DM_DeviceInfo> DEVlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(DEVsql).ToList();
                        strJson += "\"devices\":[";
                        foreach (t_DM_DeviceInfo DEV in DEVlist)
                        {
                            strJson += "{\"DID\":" + DEV.DID + ",\"DeviceName\":\"" + DEV.DeviceName + "\",";
                            string POSsql = "SELECT top 2 * FROM t_CM_PointsInfo WHERE DID = " + DEV.DID;
                            List<t_CM_PointsInfo> POSlist = bll.ExecuteStoreQuery<t_CM_PointsInfo>(POSsql).ToList();
                            strJson += "\"positions\":[";
                            foreach (t_CM_PointsInfo POS in POSlist)
                            {
                                strJson += "{\"TagID\":" + POS.TagID + ",\"TagName\":\"" + POS.TagName + "\"},";
                            }
                            strJson = strJson.TrimEnd(',') + "]},";
                        }
                        strJson = strJson.TrimEnd(',') + "]},";
                    }
                    strJson = strJson.TrimEnd(',') + "]";
                }
                else
                    strJson = "no login";
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
        }
        //捕捉界面接口_获取工单列表  创建于 20160411
        public string PROrder()
        {
            try
            {
                string sid = getSessionID();
                string pdrlist = "1,2,3";
                string strJson = "[";
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];

                    pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;
                    strJson = "[";
                    string PDOsql = "SELECT * FROM t_PM_Order WHERE PID in (" + pdrlist + ")"; //根据权限的配电房列表获取信息
                    List<t_PM_Order> PDOlist = bll.ExecuteStoreQuery<t_PM_Order>(PDOsql).ToList();

                    foreach (t_PM_Order PDO in PDOlist)
                    {
                        strJson += "{\"OrderID\":" + PDO.OrderID + ",\"OrderNO\":\"" + PDO.OrderNO + "\"},";
                    }
                    strJson = strJson.TrimEnd(',') + "]";
                }
                else
                    strJson = "no login";
                return strJson;
            }

            catch (Exception ex)
            {
                string error = ex.ToString();
                return error;
            }
        }
        //设备信息界面_获取配电房详细:获取配电房+ 设备 + 设备监测点 的Json  创建于 20160411 
        public ActionResult PDRInfo(int DID = 0)
        {
            try
            {
                string sid = getSessionID();
                string strJson = "[";
                string pdrlist;
                string[] IsUsed = { "使用中", "未使用", "维护中", "其它" };
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];

                    pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;
                    //读取设备列表
                    string DEVsql = "SELECT  * FROM t_DM_DeviceInfo WHERE DID = " + DID + " and pid in (" + pdrlist + ")";
                    List<t_DM_DeviceInfo> DEVlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(DEVsql).ToList();
                    DEVlist = DEVlist.Where(u => u.DID == DID).ToList();
                    strJson = "";
                    foreach (t_DM_DeviceInfo DEV in DEVlist)
                    {
                        strJson += "{\"DID\":" + DEV.DID + ",\"DeviceName\":\"" + DEV.DeviceName + "\",\"DAlarmState\":\"" + IsUsed[DEV.UseState] + "\",\"DeviceCode\":\"" + DEV.DeviceCode;//设备编号，名称，状态，编码
                        strJson += "\",\"DeviceModel\":\"" + DEV.DeviceModel + "\",\"MFactory\":\"" + DEV.MFactory + "\",\"BuyTime\":\"" + DEV.BuyTime + "\",\"UseDate\":\"" + DEV.UseDate;//型号，厂家，生产时间，投运时间
                        strJson += "\",\"InstallAddr\":\"" + DEV.InstallAddr + "\",\"Company\":\"" + DEV.Company + "\",\"LastMtcDate\":\"" + DEV.LastMtcDate + "\",\"LastMtcPerson\":\"" + DEV.D;//安装地,所属单位，最后维护日期，最后维护人员
                        strJson += "\",\"instruction\":\"" + DEV.E + "\",\"devicePhoto\":\"" + DEV.F + "\",";//说明书连接 ，图片连接
                        //获取设备测点列表
                        string POSsql = "SELECT * FROM V_DeviceInfoState_PDR1 WHERE DID = " + DEV.DID;
                        List<V_DeviceInfoState_PDR1> POSlist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(POSsql).ToList();
                        //判断设备是否有环境温度监测
                        List<V_DeviceInfoState_PDR1> TPOSlist = POSlist.Where(a => a.DataTypeID == 12 || a.DataTypeID == 24).ToList();
                        if (TPOSlist.Count > 0)
                        {
                            int TTagID = TPOSlist.First().TagID;
                            strJson += "\"realTimeTemp\":\"" + POSlist.Where(l => l.TagID == TTagID).Last().PV + "\",";
                        }
                        //判断设备是否有环境湿度监测
                        List<V_DeviceInfoState_PDR1> HPOSlist = POSlist.Where(a => a.DataTypeID == 13 || a.DataTypeID == 25).ToList();
                        if (HPOSlist.Count > 0)
                        {
                            int HTagID = HPOSlist.First().TagID;
                            strJson += "\"realTimeHumi\":\"" + POSlist.Where(l => l.TagID == HTagID).Last().PV + "\",";
                        }
                        //判断设备是否有电度监测  缺少数据类型                      
                        strJson += "\"elec\":\"233\",";
                        //实时参数
                        strJson += "\"realTimeParams\":[";
                        string InputValue;
                        string lasttype = "";
                        foreach (V_DeviceInfoState_PDR1 model in POSlist)
                        {
                            //根据数据类型把0替换为--
                            if ((model.TypeName.Contains("温度") || model.TypeName.Contains("湿度")) && model.PV == 0)
                            {
                                InputValue = "--";
                            }
                            else if (model.DataTypeID == 51)//功率因素取绝对值
                            {
                                double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                                strCashAmt = Math.Round(strCashAmt, 3);//保留三位小数
                                InputValue = strCashAmt + "";
                            }
                            else if (model.PID == 105 && model.DeviceTypeName.Equals("变压器") && model.PV == 0)
                                InputValue = "--";
                            else if (model.DID == 480 && model.PV == 0)//直流屏
                                InputValue = "--";
                            else
                                InputValue = model.PV.ToString();
                            //判断是否有三相数据
                            if (model.ABCID > 0)
                            {
                                if (model.Position != lasttype)
                                {
                                    lasttype = model.Position;
                                    strJson += "{\"PName\": \"" + model.Position + "(" + model.Units + ")\"},";
                                }
                                if (model.ABCID == 1)
                                {
                                    strJson = strJson.TrimEnd('}', ',') + ",\"ValueA\": \"" + InputValue + "\"},";

                                }
                                else if (model.ABCID == 2)
                                {
                                    strJson = strJson.TrimEnd('}', ',') + ",\"ValueB\": \"" + InputValue + "\"},";
                                }
                                else if (model.ABCID == 3)
                                {
                                    strJson = strJson.TrimEnd('}', ',') + ",\"ValueC\": \"" + InputValue + "\"},";
                                }
                            }
                            else
                            {
                                strJson += "{\"PName\": \"" + model.Position + "(" + model.Units + ")\",\"Value\": \"" + InputValue + "\"},";
                            }
                        }
                        strJson = strJson.TrimEnd(',') + "]},";
                    }
                    strJson = strJson.TrimEnd(',');
                }
                else
                    strJson = "no login";
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
        }
        //设备信息界面_获取设备详细:获取设备 + 设备监测点 的Json  创建于 20160411   新增测点状态 20170523
        public ActionResult getDeviceState(int DID = 0)
        {
            try
            {
                string sid = getSessionID();
                string strJson = "[";
                string pdrlist;
                string[] IsUsed = { "使用中", "未使用", "维护中", "其它" };
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];

                    pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;
                    //读取设备列表
                    string DEVsql = "SELECT  * FROM t_DM_DeviceInfo WHERE DID = " + DID + " and pid in (" + pdrlist + ")";
                    List<t_DM_DeviceInfo> DEVlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(DEVsql).ToList();
                    DEVlist = DEVlist.Where(u => u.DID == DID).ToList();
                    strJson = "";
                    foreach (t_DM_DeviceInfo DEV in DEVlist)
                    {
                        strJson += "{\"DID\":" + DEV.DID + ",\"DeviceName\":\"" + DEV.DeviceName + "\",\"DeviceState\":\"" + IsUsed[DEV.UseState] + "\",\"DeviceCode\":\"" + DEV.DeviceCode;//设备编号，名称，使用状态，编码
                        strJson += "\",\"DeviceModel\":\"" + DEV.DeviceModel + "\",\"MFactory\":\"" + DEV.MFactory + "\",\"BuyTime\":\"" + DEV.BuyTime + "\",\"UseDate\":\"" + DEV.UseDate;//型号，厂家，生产时间，投运时间
                        strJson += "\",\"InstallAddr\":\"" + DEV.InstallAddr + "\",\"Company\":\"" + DEV.Company + "\",\"LastMtcDate\":\"" + DEV.LastMtcDate + "\",\"LastMtcPerson\":\"" + DEV.D;//安装地,所属单位，最后维护日期，最后维护人员
                        strJson += "\",\"instruction\":\"" + DEV.E + "\",\"devicePhoto\":\"" + DEV.F + "\",";//说明书连接 ，图片连接
                        //获取设备测点列表
                        string POSsql = "SELECT * FROM V_DeviceInfoState_PDR1 WHERE DID = " + DEV.DID + " and DataTypeID !=23 order by orderby,devicetypename,did,DataTypeID,TagID,ABCID";
                        List<V_DeviceInfoState_PDR1> POSlist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(POSsql).ToList();
                        //判断设备是否有环境温度监测
                        List<V_DeviceInfoState_PDR1> TPOSlist = POSlist.Where(a => a.DataTypeID == 12 || a.DataTypeID == 24).ToList();
                        if (TPOSlist.Count > 0)
                        {
                            int TTagID = TPOSlist.First().TagID;
                            strJson += "\"realTimeTemp\":\"" + POSlist.Where(l => l.TagID == TTagID).Last().PV + "\",";
                        }
                        //判断设备是否有环境湿度监测
                        List<V_DeviceInfoState_PDR1> HPOSlist = POSlist.Where(a => a.DataTypeID == 13 || a.DataTypeID == 25).ToList();
                        if (HPOSlist.Count > 0)
                        {
                            int HTagID = HPOSlist.First().TagID;
                            strJson += "\"realTimeHumi\":\"" + POSlist.Where(l => l.TagID == HTagID).Last().PV + "\",";
                        }
                        //判断设备是否有电度监测  缺少数据类型                      
                        strJson += "\"elec\":\"233\",";
                        //实时参数
                        strJson += "\"realTimeParams\":[";
                        string InputValue;
                        string lasttype = "";
                        foreach (V_DeviceInfoState_PDR1 model in POSlist)
                        {
                            //获取测点状态
                            string pointstatus = loadAlarmStatus(model.TagID, model.AlarmStatus);
                            //根据数据类型把0替换为--
                            if ((model.TypeName.Contains("温度") || model.TypeName.Contains("湿度")) && model.PV == 0)
                            {
                                InputValue = "--";
                            }
                            else if (model.DataTypeID == 51)//功率因素取绝对值
                            {
                                double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                                strCashAmt = Math.Round(strCashAmt, 3);//保留三位小数
                                InputValue = strCashAmt + "";
                            }
                            else if (model.PID == 105 && model.DeviceTypeName.Equals("变压器") && model.PV == 0)
                                InputValue = "--";
                            else if (model.DID == 480 && model.PV == 0)//直流屏
                                InputValue = "--";
                            else
                                InputValue = model.PV.ToString();
                            //判断是否有三相数据
                            if (model.ABCID > 0)
                            {
                                if (model.Position != lasttype)
                                {
                                    lasttype = model.Position;
                                    strJson += "{\"PName\": \"" + model.Position + "(" + model.Units + ")\"},";
                                }
                                if (model.ABCID == 1)
                                {
                                    strJson = strJson.TrimEnd('}', ',') + ",\"ValueA\": \"" + InputValue + "\",\"StatusA\": \"" + pointstatus + "\",\"TagIDA\": \"" + model.TagID + "\"},";

                                }
                                else if (model.ABCID == 2)
                                {
                                    strJson = strJson.TrimEnd('}', ',') + ",\"ValueB\": \"" + InputValue + "\",\"StatusB\": \"" + pointstatus + "\",\"TagIDB\": \"" + model.TagID + "\"},";
                                }
                                else if (model.ABCID == 3)
                                {
                                    strJson = strJson.TrimEnd('}', ',') + ",\"ValueC\": \"" + InputValue + "\",\"StatusC\": \"" + pointstatus + "\",\"TagIDC\": \"" + model.TagID + "\"},";
                                }
                            }
                            else
                            {
                                strJson += "{\"PName\": \"" + model.Position + "(" + model.Units + ")\",\"Value\": \"" + InputValue + "\",\"Status\": \"" + pointstatus + "\",\"TagID\": \"" + model.TagID + "\"},";
                            }
                        }
                        strJson = strJson.TrimEnd(',') + "]},";
                    }
                    strJson = strJson.TrimEnd(',');
                }
                else
                    strJson = "no login";
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
        }
        private class PointsTypeInfo
        {
            public string Position { set; get; }
        }
        //App登录验证  创建于 20160411
        public ActionResult AppUserInfo(string username, string UserPassWord)
        {
            try
            {
                string MD5password = Encrypt.MD5Encrypt(UserPassWord);
                //string MD5password = "xdfc546347"; //临时验证用的万能密码
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.UserName == username && u.UserPassWord == MD5password & u.IsScreen == 0).ToList();

                if (list.Count > 0)
                {
                    Session["Huerinfo"] = list[0];
                    string sID = Session.SessionID;
                    Session[sID] = list[0];
                    //log
                    Common.InsertLog("App用户登录", username, "App用户登录[" + username + "]");
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
        public ActionResult AppLoginUserInfo(string mobile)
        {
            try
            {

                var model = bll.t_CM_UserInfo.Where(u => u.Mobilephone == mobile).FirstOrDefault();
                if (model != null)
                {
                    Session["Huerinfo"] = model;
                    string sID = Session.SessionID;
                    Session[sID] = model;
                    //log
                    Common.InsertLog("App用户登录", model.UserName, "App用户登录[" + model.UserName + "]");
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
        //App密码修改  创建于 20160509
        public ActionResult AppChangePW(string username, string oldPassword, string newPassword)
        {
            try
            {
                string sid = getSessionID();
                if (sid != null && sid != "")
                {
                    string MD5password = Encrypt.MD5Encrypt(oldPassword);
                    List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.UserName == username && u.UserPassWord == MD5password).ToList();

                    if (list.Count > 0)
                    {
                        list.ForEach(i =>
                        {
                            i.UserPassWord = Encrypt.MD5Encrypt(newPassword);
                            bll.ObjectStateManager.ChangeObjectState(i, EntityState.Modified);
                            bll.SaveChanges();
                        });
                        //log
                        Common.InsertLog("App用户登录", username, "App用户修改密码[" + Encrypt.MD5Encrypt(newPassword) + "]");
                        return Content("{\"code\":101,\"message\":\"修改成功！\"}");
                    }
                    else
                    {
                        return Content("{\"code\":102,\"message\":\"原密码错误！\"}");
                    }
                }
                return Content("no login");
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        //捕捉界面接口_获取配电房运行状态曲线:获取配电房平面图+ 一次图 + 温度最高点历史温度 + 配电房历史负荷 的Json  创建于 20160411
        public ActionResult getPDRState(int pid)
        {
            try
            {
                string sid = getSessionID();
                string strJson = "[";
                string pdrlist;
                if (sid != null && sid != "")
                {

                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];

                    pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;
                    string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";                                    //匹配配电房列表

                    DateTime DateStart = DateTime.Now.AddDays(-1);                 //获得今天的开始和结束时间
                    DateTime DateEnd = DateTime.Now;

                    DateTime WeeklyDay = DateTime.Today;                                                                     //得到本周的开始和结束时间
                    int DayOfWeek = Convert.ToInt16(WeeklyDay.DayOfWeek);
                    if (DayOfWeek == 0)
                        DayOfWeek = 7;
                    DateTime WeekStart = DateTime.Today.AddDays(-7);
                    DateTime WeekEnd = DateTime.Today;

                    DateTime MonthStart = DateTime.Today.AddMonths(-1);              //得到本月的开始和结束时间
                    DateTime MonthEnd = DateTime.Today;

                    DateTime AllStart = DateTime.Today.AddMonths(1).AddYears(-1);                                        //得到全部的开始和结束时间,已经改为年曲线的开始和结束 2016年6月20日 zzz         
                    DateTime AllEnd = DateTime.Today.AddMonths(1);

                    string strAsql = "select top 1 * from t_AlarmTable_en where AlarmState>0 and pid=" + pid + "and pid in (" + pdrlist + ") order by AlarmState desc,AlarmValue desc"; //判断是否存在报警数据
                    List<t_AlarmTable_en> alist = bll.ExecuteStoreQuery<t_AlarmTable_en>(strAsql).ToList();
                    t_AlarmTable_en AlarmPDR = new t_AlarmTable_en();

                    string strsql = "select top 1 *  from V_DeviceInfoState_PDR1 where PID=" + pid + "and pid in (" + pdrlist + ") and DataTypeID=1 order by PV desc,TagID";                 //获取配电房最高温度的点的TagID，之前需检查有无报警点
                    List<V_DeviceInfoState_PDR1> PDRlist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                    V_DeviceInfoState_PDR1 PDR = new V_DeviceInfoState_PDR1();
                    int HiPoTagID = 0;
                    string HiPoTagName = "null";
                    int AlarmState = 0;
                    if (alist.Count > 0)
                    {
                        AlarmPDR = alist.First();
                        HiPoTagID = (int)AlarmPDR.TagID;
                        HiPoTagName = AlarmPDR.AlarmArea;
                    }
                    else if (PDRlist.Count > 0)
                    {
                        PDR = PDRlist.First();
                        HiPoTagID = PDR.TagID;
                        HiPoTagName = PDR.Remarks;
                    }
                    if (alist.Count > 0)
                    {
                        AlarmState = Convert.ToInt32(alist[0].AlarmState);
                    }
                    else
                        AlarmState = 0;

                    string strEPsql = "select  *  from V_DeviceInfoState_PDR1 where PID = " + pid + " and DataTypeID =12";                 //获取配电房环境温度的点的TagID
                    List<V_DeviceInfoState_PDR1> EPlist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strEPsql).ToList();
                    int EvPoTagID = 0;
                    if (EPlist.Count > 0)
                    {
                        EvPoTagID = EPlist.First().TagID;
                    }

                    string strPDRinfosql = "select  *  from t_CM_PDRInfo where PID = " + pid;                 //获取配电房的信息
                    List<t_CM_PDRInfo> PDRinfolist = bll.ExecuteStoreQuery<t_CM_PDRInfo>(strPDRinfosql).ToList();
                    t_CM_PDRInfo PDRinfo = new t_CM_PDRInfo();
                    if (PDRinfolist.Count > 0)
                    {
                        PDRinfo = PDRinfolist.First();
                    }

                    List<t_CM_AlarmSet> AlarmValList = bll.t_CM_AlarmSet.Where(a => a.TagID == PDR.TagID).ToList(); //获取报警值，预警值
                    t_CM_AlarmSet AlarmVal = new t_CM_AlarmSet();
                    if (AlarmValList.Count > 0)
                    {
                        AlarmVal = AlarmValList.First();
                    }

                    ////取最高温度点 和 环境监测点 的历史数据，间隔一天，取一个月的数据
                    string Daysql = "select  记录时间 Graphdate,测量值 Graphvalue,测点编号 Graphtagid from ( select row_number() over(partition by grouprow order by 测量值 desc) as rownum , * from (select dateadd(mi,(datediff(mi,convert(varchar(10),dateadd(ss,0,记录时间),120),dateadd(ss,0,记录时间))/1440)*1440,convert(varchar(10),记录时间,120)) grouprow ,  * from  " + tablename + " where  测点编号 in (" + HiPoTagID + "," + EvPoTagID + ")) as b) as T where T.rownum = 1 and 记录时间 >= '" + AllStart + "' and 记录时间 <= '" + AllEnd + "' ";
                    Daysql += "union select  记录时间 Graphdate,测量值 Graphvalue,测点编号 Graphtagid from " + tablename + " where  测点编号 in (" + HiPoTagID + "," + EvPoTagID + ") and 记录时间 >= '" + DateStart + "' and 记录时间 <= '" + DateEnd + "'";
                    List<AppGraphsPoint> HisPoList = bll.ExecuteStoreQuery<AppGraphsPoint>(Daysql).ToList();

                    //DateTime AllStart = HisPoList.First().Graphdate;                                        //得到全部的开始和结束时间         
                    //DateTime AllEnd = DateTime.Today;
                    //int AllDeff = (AllEnd - AllStart).Days;                                                 //计算开始和结束相隔的小时数

                    strJson = "{\"HiPointHisData\":{";
                    strJson += getHisGra(HisPoList, HiPoTagID, EvPoTagID, 12, 720, 3, AllStart, AllEnd);   //全部,现在改为年
                    strJson += getHisGra(HisPoList, HiPoTagID, EvPoTagID, 30, 24, 2, MonthStart, MonthEnd);   //月
                    strJson += getHisGra(HisPoList, HiPoTagID, EvPoTagID, 7, 24, 1, WeekStart, WeekEnd);     //周   
                    strJson += getHisGra(HisPoList, HiPoTagID, EvPoTagID, 24, 1, 0, DateStart, DateEnd);     //日
                    strJson += "\"max_name\":\"" + HiPoTagName + "\",";
                    strJson += "\"AlarmStatus\":\"" + AlarmState + "\",\"AlarmVal\":\"" + AlarmVal.AlarmVal + "\",\"TypeName\":\"" + PDR.TypeName + "\",\"Position\":\"" + PDR.Position + "\",\"TagName\":\"" + PDR.TagName + "\",\"TagID\":\"" + PDR.TagID + "\"},";
                    strJson += "\"image_url\":\"" + "http://11111/Content/yicitu/p" + PDRinfo.PID + ".png" + "\",\"pdname\":\"" + PDRinfo.Name + "\",\"pid\":\"" + PDRinfo.PID + "\",\"status\":\"" + AlarmState + "\",\"web_url\":\"" + "http://113.106.90.51:8004/App/AppIndex?pid=" + PDRinfo.PID + "\"";
                    strJson = strJson.TrimEnd(',') + "}";
                }
                else
                    strJson = "no login";
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = "error!";
                return Content(error);
            }
        }
        private string getHisGra(List<AppGraphsPoint> PoList, int HitagID, int EvtagID, int Pcount, int Deff, int GraType, DateTime HisStart, DateTime HisEnd)//数据列表，最高温度TagID，环境温度TagID，取点数,取值时间间隔（小时），曲线类型，起始时间，结束时间
        {
            List<AppGraphsPoint> HisPoList = PoList.Where(m => m.Graphdate >= HisStart && m.Graphdate <= HisEnd).ToList();
            string strHiPo = "";
            string strHiEv = "";
            string strHiGragh = "";
            string[] head = { "Day", "Wee", "Mon", "All" };
            int tagID = 0;
            int jj = 1;
            double LastVal = 25.5;
            if (Deff == 0)   //如果时间间隔为0，则设定为24小时
                Deff = 24;
            if (EvtagID > 0)
                jj = 2;
            for (int p = 0; p < jj; p++)
            {

                DateTime Start = HisStart;                 //定义一个时间段的开始和结束时间
                DateTime End = Start.AddHours(Deff);
                if (p == 0)
                {
                    strHiPo = "\"" + head[GraType] + "HiPoint\":{"; //最高温度点的曲线数据
                    tagID = HitagID;
                }
                else if (p == 1)
                {
                    strHiEv += "\"" + head[GraType] + "EvPoint\":{"; //环境温度点的曲线数据
                    tagID = EvtagID;
                }

                for (int m = 0; m < Pcount; m++)
                {
                    List<AppGraphsPoint> TagHisPoList = HisPoList.Where(n => n.Graphdate >= Start && n.Graphdate <= End && n.Graphtagid == tagID).ToList();
                    if (TagHisPoList.Count > 0)
                    {
                        AppGraphsPoint AGP = TagHisPoList.OrderByDescending(n => n.Graphvalue).ToList().First();
                        double GraphValue;
                        if (AGP.Graphvalue > 10000 || AGP.Graphvalue == 0) //0和异常数值过滤
                            GraphValue = LastVal;
                        else
                        {
                            GraphValue = AGP.Graphvalue;
                        }

                        if (p == 0)
                        {
                            strHiPo += "\"" + Start + "\":" + GraphValue + ",";
                            //TotalVal0 += AGP.Graphvalue;
                        }
                        if (p == 1)
                        {
                            strHiEv += "\"" + Start + "\":" + GraphValue + ",";
                            //TotalVal1 += AGP.Graphvalue;
                        }

                    }
                    else
                    {
                        if (p == 0)
                            strHiPo += "\"" + Start + "\":" + LastVal + ",";
                        if (p == 1)
                            strHiEv += "\"" + Start + "\":" + LastVal + ",";
                    }
                    Start = Start.AddHours(Deff);
                    End = End.AddHours(Deff);
                }
                if (p == 0)
                    strHiPo = strHiPo.TrimEnd(',') + "},";
                if (p == 1)
                    strHiEv = strHiEv.TrimEnd(',') + "},";
            }
            //if (TotalVal0 == 0.0)
            //    strHiPo = "";
            //if (TotalVal1 == 0.0)
            //    strHiEv = "";
            strHiGragh = strHiPo + strHiEv;
            return strHiGragh;
        }
        public ActionResult reportDanger(string DangerType, string Detail, string[] ImageArrayList, int pid = 0)
        {  //隐患提交  创建于 20160419
            string str = "";
            string sid = getSessionID();
            if (sid != null && sid != "")
            {
                if (pid != 0 && DangerType != null && Detail != null && ImageArrayList != null)
                    str = "{\"code\": 300,\"message\": \"提交成功!\"}";
                else
                    str = "{\"code\": 301,\"message\": \"提交失败，请修改上报情况后重新提交！\"}";
            }
            else
                str = "no login";

            return Content(str);
        }
        public ActionResult reportFeedBack(string FeedbackTitle, string FeedbackContent) //意见反馈提交  创建于 20160419
        {
            string str = "";
            string sid = getSessionID();
            if (sid != null && sid != "")
            {
                if (FeedbackTitle != null && FeedbackContent != null)
                    str = "{\"code\": 200,\"message\": \"提交成功!\"}";
                else
                    str = "{\"code\": 201,\"message\": \"已提交成功，请勿重复提交！\"}";
            }
            else
                str = "no login";
            return Content(str);
        }
        public ActionResult getMission(int pagersize = 20, int pageindex = 0, int type = 0) //我的代办  创建于 20160419
        {
            string str = "";
            string sid = getSessionID();
            string pdrlist = "1,2,3";
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];

                pdrlist = HomeController.GetPID(user.UNITList);
               // pdrlist = user.PDRList;
                string strJson = "";
                str = "{\"raws\":[ ";
                if (type == 0)
                    str += "{\"pid\": 1,\"tagid\": 1,\"title\": \"配电房巡检1\"}],\"tatal\": 1}";
                else if (type == 1)
                    str += "{\"pid\": 1,\"tagid\": 1,\"title\": \"配电房检修1\"},{\"pid\": 3,\"tagid\": 3,\"title\": \"配电房检修2\"},{\"pid\": 5,\"tagid\": 5,\"title\": \"配电房检修3\"}],\"tatal\": 3}";
                else if (type == 2)
                {
                    string PDOsql = "SELECT * FROM t_PM_Order WHERE PID in (" + pdrlist + ")"; //根据权限的配电房列表获取信息
                    List<t_PM_Order> PDOlist = bll.ExecuteStoreQuery<t_PM_Order>(PDOsql).ToList();
                    foreach (t_PM_Order PDO in PDOlist)
                    {
                        strJson += "{\"OrderID\":" + PDO.OrderID + ",\"OrderNO\":\"" + PDO.OrderNO + "\"},";
                    }
                    str += strJson.TrimEnd(',') + "],\"tatal\": " + PDOlist.Count + "}";

                }
                else
                    str = "{}";
            }
            else
                str = "no login";
            return Content(str);
        }
        public ActionResult getNotice(int pagersize = 20, int pageindex = 0, int type = 0) //通知列表  创建于 20160419
        {
            string str = "";
            string sid = getSessionID();
            if (sid != null && sid != "")
            {
                if (type == 0)
                    str = "{\"raws\": [{\"raws\": [{\"pid\": 1,\"time\": \"2015-5-23 13:30\",\"title\": \"共创配电房停电通知\"}],\"tatal\": 1}";
                else if (type == 1)
                    str = "{\"raws\": [{\"pid\": 1,\"time\": \"2015-5-23 13:30\",\"title\": \"配电房停电通知\"},{\"pid\": 3, \"time\":\"2015-5-23 13:39\",\"title\": \"配电房停电通知2\"},{\"pid\": 5,\"time\": \"2015-5-23 13:31\",\"title\": \"配电房停电通知3\"}],\"tatal\": 3}";
                else if (type == 2)
                    str = "{\"raws\": [{\"pid\": 1,\"time\": \"2015-5-23 13:30\",\"title\": \"配电房停电通知\"},{\"pid\": 3, \"time\":\"2015-5-23 13:39\",\"title\": \"配电房停电通知2\"}],\"tatal\": 2}";
                else
                    str = "{}";
            }
            else
                str = "no login";
            return Content(str);
        }
        public ActionResult getUpdate() //获取更新  创建于 20160510
        {
            string str = "";
            string sid = getSessionID();
            if (sid != null && sid != "")
            {
                str = "http://1111/App/AppUpData.Json";
            }
            else
                str = "no login";
            return Content(str);
        }
        public ActionResult getNewAlarm(string lastAlarmTime)
        {
            try
            {
                string sid = getSessionID();
                string pdrlist = "1,2,3";
                string strJson = "[";
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];

                    pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;

                    string PDRsql = "SELECT * FROM t_AlarmTable_en WHERE AlarmDateTime > '" + lastAlarmTime + "' and PID in (" + pdrlist + ")";
                    string title;
                    DateTime Time;
                    List<t_AlarmTable_en> Alarmlist = bll.ExecuteStoreQuery<t_AlarmTable_en>(PDRsql).ToList();
                    if (Alarmlist.Count > 0)
                    {
                        title = "有新报警信息";
                        Time = Convert.ToDateTime(Alarmlist.Last().AlarmDateTime).AddSeconds(1);
                    }
                    else
                    {
                        title = "无新报警信息";
                        Time = Convert.ToDateTime(lastAlarmTime);
                    }
                    strJson = "{\"AlarmCount\":" + Alarmlist.Count + ",\"lastAlarmTime\": \"" + Time + "\",\"message\": \"有" + Alarmlist.Count + "条新的报警信息！\",\"title\": \"" + title + "\"}";
                }
                else
                    strJson = "no login";
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
        }


        /// <summary>
        /// 获取工单详情
        /// </summary>
        /// <param name="OrderID">工单ID</param>
        /// <returns></returns>
        public ActionResult LoadOrderInfo(int OrderID)
        {
            string strJson = "error";
            string sessionid = getSessionID();
            if (sessionid != null && !sessionid.Equals(""))
            {
                try
                {
                    List<t_PM_Order> orderlist = bll.t_PM_Order.Where(o => o.OrderID == OrderID).ToList();
                    if (orderlist.Count > 0)
                    {
                        t_PM_Order order = orderlist.First();
                        string tMobNo = "", lMobNo = "", lName = "", lDate = "";
                        strJson = Common.JsonDataInfo(order);
                        int tUID = (int)order.UserID, lUID = 0;
                        List<t_PM_Order> Lastorder = bll.t_PM_Order.Where(o => o.BugID == order.BugID).OrderByDescending(o => o.OrderID).ToList();
                        if (Lastorder.Count > 0)
                        {
                            lUID = (int)Lastorder[0].UserID;
                            lName = Lastorder[0].UserName;
                            lDate = Lastorder[0].CheckDate.ToString();
                        }
                        //获取联系人信息
                        string sql = "SELECT * FROM t_CM_UserInfo WHERE UserID in (" + tUID + "," + lUID + ") ";
                        List<t_CM_UserInfo> Ulist = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                        List<t_CM_UserInfo> tUlist = Ulist.Where(o => o.UserID == tUID).ToList();
                        tMobNo = tUlist[0].Telephone;
                        List<t_CM_UserInfo> lUlist = Ulist.Where(o => o.UserID == lUID).ToList();
                        if (lUlist.Count > 0) lMobNo = lUlist[0].Telephone;
                        //获取工单附件
                        string imgs = "", vocs = "", infs = "";
                        List<t_cm_files> Flist = bll.t_cm_files.Where(o => o.Modules == "order" && o.Fk_ID == order.OrderID).ToList();
                        if (Flist.Count > 0)
                        {
                            //图片
                            List<t_cm_files> imglist = Flist.Where(o => o.FileType == "image").ToList();
                            foreach (t_cm_files img in imglist)
                            {
                                imgs += "{\"flieName\":\"" + img.FileName + "\",\"fliePath\":\"" + img.FilePath + "\"},";
                            }
                            List<t_cm_files> voclist = Flist.Where(o => o.FileType == "voice").ToList();
                            foreach (t_cm_files voc in voclist)
                            {
                                vocs += "{\"flieName\":\"" + voc.FileName + "\",\"fliePath\":\"" + voc.FilePath + "\"},";
                            }
                            List<t_cm_files> inflist = Flist.Where(o => o.FileType == "infrared").ToList();
                            foreach (t_cm_files inf in inflist)
                            {
                                infs += "{\"flieName\":\"" + inf.FileName + "\",\"fliePath\":\"" + inf.FilePath + "\"},";
                            }
                        }
                        strJson = strJson.TrimEnd('}');
                        strJson += ",\"UserTel\":\"" + tMobNo + "\",\"lastName\":\"" + lName + "\",\"lastTel\":\"" + lMobNo + "\",\"lastDate\":\"" + lDate + "\",\"PhotoUrl\":[" + imgs.TrimEnd(',') + "],\"VoiceUrl\":[" + vocs.TrimEnd(',') + "],\"InfUrl\":[" + infs.TrimEnd(',') + "]}";
                        //修改工单状态，已领取
                        if (order.OrderState == 0)
                        {
                            order.OrderState = 1;
                            order.AcceptedDate = DateTime.Now;
                            bll.ObjectStateManager.ChangeObjectState(order, EntityState.Modified);
                            bll.SaveChanges();
                        }
                    }
                    else
                    {
                        strJson = "error";
                    }
                }
                catch (Exception ex)
                {
                    strJson = ex.ToString();
                }
            }
            return Content(strJson);
        }
        /// <summary>
        /// 获取工单列表
        /// </summary>
        /// <param name="UserName">用户名称</param>
        /// <param name="OrderState">工单状态 0 所有 1未完成 2已完成</param>
        /// <returns></returns>
        public ActionResult OrderInfoData(int pid = 0, string UserName = "", string OrderType = "", int OrderState = 0)
        {
            string strJson = "error";
            string sessionid = getSessionID();
            if (sessionid != null && !sessionid.Equals(""))
            {
                if (Session[sessionid] != null)
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];

                    string pdrlist = HomeController.GetPID(user.UNITList);
                   // string pdrlist = user.PDRList;
                    string sql = "SELECT * FROM [t_PM_Order] WHERE 1=1 ";
                    if (pid > 0)
                    {
                        sql += " AND PID =" + pid;
                    }
                    if (OrderState >= 0)
                    {
                        sql += " AND OrderState =" + OrderState;
                    }
                    if (!OrderType.Equals(""))
                    {
                        sql += " AND OrderType LIKE '%" + OrderType + "%'";
                    }
                    if (!UserName.Equals(""))
                    {
                        sql += " AND UserName LIKE '%" + UserName + "%'";
                    }
                    sql += " AND PID in (" + pdrlist + ") AND UserID = " + user.UserID + " order by CreateDate desc";
                    List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(sql).ToList();
                    list = list.OrderByDescending(o => o.OrderID).ToList();
                    strJson = Common.JsonDataList(list);
                }
            }
            return Content(strJson);
        }
        /// <summary>
        /// 保存工单信息
        /// </summary>
        /// <param name="order">工单详情</param>
        /// <returns></returns>
        public ActionResult SaveOrderInfo(t_PM_Order order)
        {
            string result = "成功";
            string sessionid = getSessionID();
            if (sessionid != null && !sessionid.Equals(""))
            {
                if (Session[sessionid] != null)
                {
                    try
                    {
                        List<t_PM_Order> list = bll.t_PM_Order.Where(o => o.OrderID == order.OrderID).ToList();
                        if (list.Count > 0)
                        {
                            t_PM_Order orderinfo = list[0];
                            orderinfo.IsQualified = order.IsQualified; //是否合格
                            orderinfo.CheckDate = DateTime.Now;
                            //orderinfo.Rectification = order.Rectification;
                            orderinfo.CheckInfo = Common.ReplaceEnter(order.CheckInfo); //处理结果
                            orderinfo.AcceptedDate = DateTime.Now;
                            orderinfo.OrderState = 2;//1未处理，2处理完成
                            orderinfo.Latitude = order.Latitude; //坐标
                            orderinfo.Longtitude = order.Longtitude; //坐标
                            orderinfo.Rectification = order.Rectification; //处理情况
                            //orderinfo.Currentplace = order.Currentplace;
                            bll.ObjectStateManager.ChangeObjectState(orderinfo, EntityState.Modified);
                            bll.SaveChanges();
                            PubClass.Exportdoc.ExportWordFromOrder(order.OrderID);
                            result = "{\"OrderID\": " + order.OrderID + ",\"resultCode\": 1,\"result\": \"成功\"}";
                        }
                        else
                            result = "{\"OrderID\": " + order.OrderID + ",\"resultCode\": 0,\"result\": \"源工单不存在！\"}";
                    }
                    catch (Exception ex)
                    {
                        result = "{\"OrderID\": " + order.OrderID + ",\"resultCode\": 0,\"result\": \"" + ex.ToString() + "\"}";
                    }
                }
                else
                    result = "no login";
            }
            else
                result = "no login";
            return Content(result);
        }
        /// <summary>
        /// 获取隐患列表
        /// </summary>
        /// <param name="pid">配电房编号 0 所有 !0 对应的</param>
        /// <returns></returns>
        public ActionResult BugInfoData(int pid = 0 , int did = 0)
        {
            string strJson = "error";
            string sessionid = getSessionID();
            if (sessionid != null && !sessionid.Equals(""))
            {
                if (Session[sessionid] != null)
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];

                    string pdrlist = HomeController.GetPID(user.UNITList);
                    //string pdrlist = user.PDRList;
                    string sql = "SELECT * FROM [t_CM_BugInfo] WHERE 1=1 ";
                    if (pid > 0)
                        sql += " AND PID =" + pid;
                    if (did > 0)
                        sql += " AND DID =" + did;
                    sql += " AND PID in (" + pdrlist + ")";
                    List<t_CM_BugInfo> list = bll.ExecuteStoreQuery<t_CM_BugInfo>(sql).OrderByDescending(o => o.BugID).ToList();
                    strJson = Common.JsonDataList(list);
                }
            }
            return Content(strJson);
        }
        /// <summary>
        /// 获取隐患详情
        /// </summary>
        /// <param name="BugID">隐患编号 0 所有 !0 对应的</param>
        /// <returns></returns>
        public ActionResult LoadBugInfo(int BugID = 0)
        {
            string strJson = "error";
            string sessionid = getSessionID();
            if (sessionid != null && !sessionid.Equals(""))
            {
                try
                {
                    List<t_CM_BugInfo> order = bll.t_CM_BugInfo.Where(o => o.BugID == BugID).ToList();
                    if (order.Count > 0)
                    {
                        t_CM_BugInfo ord = order[0];
                        strJson = Common.JsonDataInfo(ord);
                        List<t_DM_DeviceInfo> Dlist = bll.t_DM_DeviceInfo.Where(o => o.DID == ord.DID).ToList();
                        if (Dlist.Count > 0)
                        {
                            t_DM_DeviceInfo D = Dlist[0];
                            strJson = strJson.TrimEnd('}');
                            strJson += ",\"DeviceModel\":\"" + D.DeviceModel + "\",\"VoltageLevel\":\"" + D.J + "\",\"InstallAddr\":\"" + D.InstallAddr + "\"";
                        }
                        //获取隐患附件
                        string imgs = "", vocs = "", infs = "", CheckDate = "";
                        List<t_cm_files> Flist = bll.t_cm_files.Where(o => o.Modules == "bug" && o.Fk_ID == ord.BugID).ToList();
                        if (Flist.Count > 0)
                        {
                            CheckDate = Flist[0].CommitTime.ToString();
                            //图片
                            List<t_cm_files> imglist = Flist.Where(o => o.FileType == "image").ToList();
                            foreach (t_cm_files img in imglist)
                            {
                                imgs += "{\"flieName\":\"" + img.FileName + "\",\"fliePath\":\"" + img.FilePath + "\"},";
                            }
                            List<t_cm_files> voclist = Flist.Where(o => o.FileType == "voice").ToList();
                            foreach (t_cm_files voc in voclist)
                            {
                                vocs += "{\"flieName\":\"" + voc.FileName + "\",\"fliePath\":\"" + voc.FilePath + "\"},";
                            }
                            List<t_cm_files> inflist = Flist.Where(o => o.FileType == "infrared").ToList();
                            foreach (t_cm_files inf in inflist)
                            {
                                infs += "{\"flieName\":\"" + inf.FileName + "\",\"fliePath\":\"" + inf.FilePath + "\"},";
                            }
                        }
                        strJson = strJson.TrimEnd('}');
                        strJson += ",\"CheckDate\":\"" + CheckDate + "\",\"PhotoUrl\":[" + imgs.TrimEnd(',') + "],\"VoiceUrl\":[" + vocs.TrimEnd(',') + "],\"InfUrl\":[" + infs.TrimEnd(',') + "]";
                        if (ord.AlarmID > 0)
                        {
                            List<t_AlarmTable_en> Al = bll.t_AlarmTable_en.Where(c => c.AlarmID == ord.AlarmID).ToList();
                            string AlarmMax = "", ALarmType = "", HisData = "";
                            Double ALarmValue = 0;
                            if (Al.Count > 0)
                            {
                                AlarmMax = Al[0].AlarmMaxValue;
                                ALarmType = Al[0].ALarmType;
                                ALarmValue = (Double)Al[0].AlarmValue;
                                DateTime DateStart = Convert.ToDateTime(Al[0].AlarmDate).AddDays(-1);                 //获得今天的开始和结束时间
                                DateTime DateEnd = Convert.ToDateTime(Al[0].AlarmDate);
                                int pid = (int)Al[0].PID, tagid = (int)Al[0].TagID;
                                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                                string Daysql = "select  记录时间 Graphdate,测量值 Graphvalue,测点编号 Graphtagid from ( select row_number() over(partition by grouprow order by 测量值 desc) as rownum , * from (select dateadd(mi,(datediff(mi,convert(varchar(10),dateadd(ss,0,记录时间),120),dateadd(ss,0,记录时间))/1440)*1440,convert(varchar(10),记录时间,120)) grouprow ,  * from  " + tablename + " where  测点编号 in (" + Al[0].TagID + ")) as b) as T where T.rownum = 1 and 记录时间 >= '" + DateStart + "' and 记录时间 <= '" + DateEnd + "' ";
                                List<AppGraphsPoint> HisPoList = bll.ExecuteStoreQuery<AppGraphsPoint>(Daysql).ToList();
                                HisData = getHisGra(HisPoList, tagid, 0, 24, 1, 0, DateStart, DateEnd);
                            }
                            strJson += ",\"AlarmMaxValue\":\"" + AlarmMax + "\",\"ALarmValue\":\"" + ALarmValue + "\",\"ALarmType\":\"" + ALarmType + "\",\"HisData\":" + HisData.TrimEnd(',');
                        }
                        strJson += "}";
                    }
                    else
                    {
                        strJson = "bug does not exist!";
                    }
                }
                catch (Exception ex)
                {
                    strJson = ex.ToString();
                }
            }
            return Content(strJson);
        }
        /// <summary>
        /// 保存隐患信息
        /// </summary>
        /// <param name="bug">隐患详情</param>
        /// <returns></returns>
        public ActionResult SaveBugInfo(t_CM_BugInfo bug)
        {
            string result = "0";
            string sessionid = getSessionID();
            if (sessionid != null && !sessionid.Equals(""))
            {
                if (Session[sessionid] != null)
                {
                    try
                    {
                        string pName = "", dName = "环境";
                        List<V_DeviceDetail> pl = bll.V_DeviceDetail.Where(k => k.PID == bug.PID).ToList();
                        if (pl.Count > 0)
                        {
                            pName = pl[0].PName;
                        }
                        if (bug.DID > 0)
                        {
                            List<V_DeviceDetail> pld = pl.Where(k => k.DID == bug.DID).ToList();
                            if (pld.Count > 0)
                            {
                                dName = pl[0].DeviceName;
                            }
                        }
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        bug.PName = pName;
                        bug.DeviceName = dName;
                        bug.BugDesc = Common.ReplaceEnter(bug.BugDesc);
                        bug.ReportUser = user.UserName;
                        bug.ReportWay = "app"; //提交方式
                        bug.ReportDate = DateTime.Now;
                        bug.HandeSituation = "未审核";
                        bll.t_CM_BugInfo.AddObject(bug);
                        bll.SaveChanges();
                        //t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        //if (user != null)
                        //{
                        //    List<t_cm_files> fl = bll.t_cm_files.Where(u => u.Fk_ID == (user.UserID + bug.PID + 99999) && u.Modules == "bug").ToList();
                        //    fl.ForEach(d =>
                        //    {
                        //        d.Fk_ID = bug.BugID;
                        //        bll.ObjectStateManager.ChangeObjectState(d, EntityState.Modified);
                        //    });
                        //    bll.SaveChanges();
                        //}
                        result = "{\"bugid\": " + bug.BugID + ",\"resultCode\": 1,\"result\": \"成功\"}";
                    }
                    catch (Exception ex)
                    {
                        result = "{\"bugid\": " + bug.BugID + ",\"resultCode\": 0,\"result\": \"" + ex.ToString() + "\"}";
                    }
                }
                else
                    result = "no login";
            }
            else
                result = "no login";
            return Content(result);
        }
        /// <summary>
        /// 根据智能电力编码获取设备信息
        /// </summary>
        /// <param name="EadoCode">智能电力编码</param>
        /// <returns></returns>
        public ActionResult scanEadoCode(string EadoCode)
        {
            try
            {
                string sid = getSessionID();
                string pdrlist = "1,2,3";
                string strJson = "[";
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];

                    pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;
                    int Head = EadoCode[0];
                    string DataTable = "t_DM_DeviceInfo";
                    if (Head == 1)
                        DataTable = "t_DM_DeviceInfo";
                    else if (Head == 2)
                        DataTable = "t_DM_DeviceInfo";
                    string PDRsql = "SELECT * FROM " + DataTable + " WHERE EadoCode = '" + EadoCode + "' and PID in (" + pdrlist + ")";
                    List<t_DM_DeviceInfo> Dlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(PDRsql).ToList();
                    if (Dlist.Count > 0)
                    {
                        t_DM_DeviceInfo ord = Dlist[0];
                        strJson = Common.JsonDataInfo(ord);
                    }
                }
                else
                    strJson = "no login";
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
        }
        private class EadoObject
        {
            public string EadoCode { get; set; }
            public int ObjectID { get; set; }
            public string ObjectName { get; set; }
            public string Cphase { get; set; }
        }
        //报警数据查询   新接口  新增于 20170510  
        public String GetAlarmDate(int rows, int page, int type,int pid = 0)
        {
            string sessionid = getSessionID();
            string strJson = "no login",sqltime;;
            if (sessionid != null && sessionid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];

                string PDRList = HomeController.GetPID(user.UNITList);
                try
                {
                    if (type == 0)
                    {
                        DateTime DateStart = Convert.ToDateTime(DateTime.Today.ToString("yyyy/MM/dd 00:00:00"));                 //获得今天的开始和结束时间
                        DateTime DateEnd = DateStart.AddDays(1);
                        sqltime = "where AlarmDateTime >= '" + DateStart.ToString("yyyy/MM/dd") + "' and AlarmDateTime <='" + DateEnd.ToString("yyyy/MM/dd") + "'";
                    }
                    else if (type == 1)
                    {
                        DateTime WeeklyDay = DateTime.Today;                                                                     //得到本周的开始和结束时间
                        int DayOfWeek = Convert.ToInt16(WeeklyDay.DayOfWeek);
                        if (DayOfWeek == 0)
                            DayOfWeek = 7;
                        DateTime WeekStart = WeeklyDay.AddDays(Convert.ToDouble((1 - DayOfWeek)));
                        DateTime WeekEnd = WeeklyDay.AddDays(Convert.ToDouble((7 - DayOfWeek))).AddHours(23).AddMinutes(59).AddSeconds(59);
                        sqltime = "where AlarmDateTime >= '" + WeekStart.ToString("yyyy/MM/dd") + "' and AlarmDateTime <='" + WeekEnd.ToString("yyyy/MM/dd") + "'";
                    }
                    else if (type == 2)
                    {
                        DateTime MonthStart = Convert.ToDateTime(DateTime.Today.ToString("yyyy-MM-01 00:00:00"));              //得到本月的开始和结束时间
                        DateTime MonthEnd = MonthStart.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);
                        sqltime = "where AlarmDateTime >= '" + MonthStart.ToString("yyyy/MM/dd") + "' and AlarmDateTime <='" + MonthEnd.ToString("yyyy/MM/dd") + "'";
                    }
                    else
                        sqltime = "where 1 = 1";
                    if(pid > 0)
                        sqltime += " and pid = " + pid;
                    string Esql = "SELECT * FROM t_AlarmTable_en  " + sqltime + " and PID in (" + PDRList + ") order by  AlarmDateTime desc"; //在报警表中取自己权限内的配电房列表
                    List<t_AlarmTable_en> Elist = bll.ExecuteStoreQuery<t_AlarmTable_en>(Esql).ToList();
                    strJson = Common.List2Json(Elist, rows, page);
                    return strJson;
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    strJson = error;
                }
            }
            return strJson;
        }
        //测点历史温度和配电房环境温度  新增于 20170510 
        public string PointHisDataJson(string AlarmTime, int pid = 0, int did = 0, int tagid = 0)
        {
            try
            {
                string sid = getSessionID();
                string strJson = "{}";
                if (sid != null && sid != "")
                {

                    DateTime DateStart = Convert.ToDateTime(AlarmTime).AddHours(-12);
                    DateTime DateEnd = Convert.ToDateTime(AlarmTime);
                    
                    //配电房采集的间隔
                    int diff1=5;
                    List<t_CM_PDRInfo> pl = bll.t_CM_PDRInfo.Where(c => c.PID == pid).ToList();
                    t_CM_PDRInfo p = pl.First();
                    if (p.DataRate > 0)
                        diff1 = p.DataRate / 60;

                    string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                    //获取设备温度与该配电室环境温度（PID = 12）
                    List<V_DeviceInfoState_PDR1> PDRlist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>("select * from V_DeviceInfoState_PDR1 where DID=" + did + " and (DataTypeID = 12 or DataTypeID = 24) and pv>0 order by DataTypeID").ToList();

                    int D = tagid;
                    int R = 0;
                    if (PDRlist.Count > 0)
                    {
                        R = PDRlist.Last().TagID;
                    }
                    else
                        R = 0;
                    string Dsql = "select 记录时间 Graphdate,测量值 Graphvalue ,测点编号 Graphtagid from " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "' and 测点编号=" + D;
                    string Rsql = "select 记录时间 Graphdate,测量值 Graphvalue ,测点编号 Graphtagid from " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "' and 测点编号=" + R;

                    List<AppGraphsPoint> Dlist = bll.ExecuteStoreQuery<AppGraphsPoint>(Dsql).ToList();//历史设备温度 间隔2小时，取9点
                    List<AppGraphsPoint> RList = bll.ExecuteStoreQuery<AppGraphsPoint>(Rsql).ToList();//历史环境温度 间隔2小时，取9点

                    DateTime Start = DateStart;
                    DateTime End = Start.AddMinutes(diff1);

                    strJson = "{\"HisDevData\":{";

                    TimeSpan TotalDiff = DateEnd - DateStart;
                    int diffCount = (int)TotalDiff.TotalMinutes / diff1;

                    for (int m = 0; m < diffCount; m++)
                    {
                        List<AppGraphsPoint> HisDevList = Dlist.Where(n => n.Graphdate >= Start && n.Graphdate <= End && n.Graphtagid == D).ToList();
                        if (HisDevList.Count > 0)
                        {
                            AppGraphsPoint AGP = HisDevList.OrderByDescending(n => n.Graphvalue).ToList().First();
                            strJson += "\"" + End + "\":\"" + AGP.Graphvalue + "\",";
                        }
                        else
                        {
                            strJson += "\"" + End + "\":\"\",";
                        }
                        Start = Start.AddMinutes(diff1);
                        End = End.AddMinutes(diff1);
                    }
                    strJson = strJson.TrimEnd(',') + "}";
                    //重置计数
                    Start = DateStart;
                    End = Start.AddMinutes(diff1);

                    strJson += ",\"HisEnvData\":{";
                    for (int m = 0; m < diffCount; m++)
                    {
                        List<AppGraphsPoint> HisEnvList = RList.Where(n => n.Graphdate >= Start && n.Graphdate <= End && n.Graphtagid == R).ToList();
                        if (HisEnvList.Count > 0)
                        {
                            AppGraphsPoint AGP = HisEnvList.OrderByDescending(n => n.Graphvalue).ToList().First();
                            strJson += "\"" + End + "\":\"" + AGP.Graphvalue + "\",";
                        }
                        else
                        {
                            strJson += "\"" + End + "\":\"\",";
                        }
                        Start = Start.AddMinutes(diff1);
                        End = End.AddMinutes(diff1);
                    }
                    strJson = strJson.TrimEnd(',') + "}}";


                }
                else
                    strJson = "no login";
                return strJson;
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return error;
            }
        }
        //测点历史温度  新增于 20170523 
        public string PointDataJson(string DateTime,int hours =12, int pid = 0, int did = 0, int tagid = 0)
        {
            try
            {
                string sid = getSessionID();
                string strJson = "{}";
                if (sid != null && sid != "")
                {

                    DateTime DateStart = Convert.ToDateTime(DateTime).AddHours(-hours);
                    DateTime DateEnd = Convert.ToDateTime(DateTime);

                    //配电房采集的间隔
                    int diff1 = 5;
                    List<t_CM_PDRInfo> pl = bll.t_CM_PDRInfo.Where(c => c.PID == pid).ToList();
                    t_CM_PDRInfo p = pl.First();
                    if (p.DataRate > 0)
                        diff1 = p.DataRate / 60;

                    string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                    int D = tagid;
                    string Dsql = "select 记录时间 Graphdate,测量值 Graphvalue ,测点编号 Graphtagid from " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "' and 测点编号=" + D;

                    List<AppGraphsPoint> Dlist = bll.ExecuteStoreQuery<AppGraphsPoint>(Dsql).ToList();//历史设备温度

                    DateTime Start = DateStart;
                    DateTime End = Start.AddMinutes(diff1);

                    strJson = "{\"HisDevData\":{";

                    TimeSpan TotalDiff = DateEnd - DateStart;
                    int diffCount = (int)TotalDiff.TotalMinutes / diff1;

                    for (int m = 0; m < diffCount; m++)
                    {
                        List<AppGraphsPoint> HisDevList = Dlist.Where(n => n.Graphdate >= Start && n.Graphdate <= End && n.Graphtagid == D).ToList();
                        if (HisDevList.Count > 0)
                        {
                            AppGraphsPoint AGP = HisDevList.OrderByDescending(n => n.Graphvalue).ToList().First();
                            strJson += "\"" + End + "\":\"" + AGP.Graphvalue + "\",";
                        }
                        else
                        {
                            strJson += "\"" + End + "\":\"\",";
                        }
                        Start = Start.AddMinutes(diff1);
                        End = End.AddMinutes(diff1);
                    }
                    strJson = strJson.TrimEnd(',') + "}}";
                }
                else
                    strJson = "no login";
                return strJson;
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return error;
            }
        }
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
                status = ex.ToString();
            }
            return realstatus + " " + status;
        }
    }
}
