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
using YWWeb.PubClass;
using System.Diagnostics;
using Hyman.DataUtility;
using Yunpian.conf;
using Yunpian.lib;
using Yunpian.model;

namespace YWWeb.Controllers
{
    public class AlarmManageController : UserControllerBaseEx// Controller
    {
        //报警管理
        // GET: /AlarmManage/

        //
        // GET: /AlarmInfo/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult AlarmMain()
        {
            return View();
        }
        [Login]
        public ActionResult Index()
        {
            return View();
        }

        [Login]
        public ActionResult Treatment()
        {
            return View();
        }

        [Login]
        public ActionResult AlarmSysTableList()
        {
            return View();
        }
        [Login]
        public ActionResult SOEevent()//报警-SOE事件
        {
            return View();
        }

        public ActionResult CommunicaTopo()//通讯树
        {
            return View();
        }

        #region 报警数据

        /// <summary>
        ///  配电房报警状态查询 
        /// </summary>
        static int g_iFromAlarmId = 0;//报警查询序号
        [Login]
        public ActionResult getStationAlarm()
        {
            try
            {
                List<PAlarmState> listm = new List<PAlarmState>();
                List<string> listArea = new List<string>();
                PAlarmState PAStage;
                string PDRList = HomeController.GetPID(CurrentUser.UNITList);
                string sSql = "select * from t_AlarmTable_en where  AlarmID >=" + g_iFromAlarmId.ToString() + " and AlarmState in (select max(AlarmState) from t_AlarmTable_en where  AlarmID >=" + g_iFromAlarmId.ToString() + " and AlarmState != 0 and pid in (" + PDRList + ") group by AlarmArea) order by AlarmID desc";

                List<t_AlarmTable_en> t_ATlist = bll.ExecuteStoreQuery<t_AlarmTable_en>(sSql).ToList();
                string sAlarmInfo = "";
                listm.Clear();
                listArea.Clear();
                foreach (t_AlarmTable_en aList in t_ATlist)
                {
                    PAStage = new PAlarmState();
                    sAlarmInfo = "报警时间:" + aList.AlarmDate + " " + aList.AlarmTime + ",设备:" + aList.AlarmArea + "_" + aList.AlarmAddress + ",报警值:" + aList.AlarmValue + ",限值:" + aList.AlarmMaxValue + ",类型:" + aList.AlarmCate;
                    PAStage.pid = (int)aList.PID;
                    PAStage.state = (int)aList.AlarmState;
                    PAStage.info = sAlarmInfo;
                    if (!listArea.Contains(aList.Company))
                    {
                        listArea.Add(aList.Company);
                        listm.Add(PAStage);
                        //记录最新查询ID
                        g_iFromAlarmId = aList.AlarmID;
                    }
                }
                string strJson = Common.ToJson(listm);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        //报警数据查询
        [Login]
        public ActionResult AlarmDate(int rows = 0, int page = 0, int pid = 0,int dtid=0, string startdate = "", string enddate = "", string typename = "",string AlarmConfirm="全部",string adress="")
        {
            try
            {
                string PDRList = HomeController.GetPID(CurrentUser.UNITList);


                string ALarmType = "";
                if (dtid == 1)
                {
                    ALarmType = "and ALarmType='一般'";
                }
                else if (dtid == 2)
                {
                    ALarmType = "and ALarmType='恢复'";

                }
                else if (dtid == 3)
                {
                    ALarmType = "and ALarmType='严重'";

                }
                else if (dtid == 4)
                {
                    ALarmType = "and ALarmType='危急'";

                }
                string strquery = " 1=1" + ALarmType;
                if (!startdate.Equals(""))
                    strquery = strquery + " and AlarmDateTime>='" + startdate + "'";
                else
                {
                    strquery = strquery + " and AlarmDateTime>='" + DateTime.Now.AddDays(-10) + "'";
                }
                if (!enddate.Equals(""))
                    strquery = strquery + " and AlarmDateTime<='" + enddate + "'";
                //typename = typename.Replace("==全部==", "");
                //if (!typename.Equals(""))
                //    strquery = strquery + " and AlarmCate='" + typename + "'";
                if (!AlarmConfirm.Equals("全部"))
                {
                    strquery = strquery + " and AlarmConfirm='" + AlarmConfirm + "'";
                }
                if (pid > 0)
                    strquery = strquery + " and pid=" + pid;
                else
                    strquery = strquery + " and pid in (" + PDRList + ")";

                //string strsql = "select a.*,b.Remarks as RArae from (select * from t_AlarmTable_en where " + strquery + " ) a left join t_CM_PointsInfo b on a.TagID=b.TagID   order by AlarmID desc";
          
                string strsql = "select count(*) totalRows from t_AlarmTable_en  where " + strquery;
                List<RowCount> rowcount = bll.ExecuteStoreQuery<RowCount>(strsql).ToList();
                string strJson = "{\"total\":0,\"rows\":[]}";
                if (rowcount.Count > 0 && rowcount[0].totalRows > 0)
                {
                    strsql = "select c.*,b.Remarks as RArae,b.单位 as Unit from (select top " + rows + " * from t_AlarmTable_en where " + strquery
                        + " and AlarmID not in(select alarmid from(select top " + rows * (page - 1) + " alarmid from t_AlarmTable_en  where " + strquery
                    + " order by AlarmID desc ) a) ) c left join t_CM_PointsInfo b on c.TagID=b.TagID  where 1=1";

                    strsql += " order by AlarmID desc";
                    List<AralmView> list = bll.ExecuteStoreQuery<AralmView>(strsql).ToList();
                    var dev = bll.t_DM_DeviceInfo.ToList();
                    var cir = bll.t_DM_CircuitInfo.ToList();
                    foreach (var item in list)
                    {
                        if (!string.IsNullOrEmpty(item.Unit))
                            item.AlarmCate = item.AlarmCate + "(" + item.Unit + ")";
                        if (item.AlarmCate == "开关量")
                            item.AlarmMaxValue = "";
                        string devName = "";
                        string cirName = "";
                        if (dev.Where(p => p.DID == item.DID).FirstOrDefault() != null)
                            devName = dev.Where(p => p.DID == item.DID).FirstOrDefault().DeviceName;
                        if (cir.Where(p => p.CID == item.CID).FirstOrDefault() != null)
                            cirName = cir.Where(p => p.CID == item.CID).FirstOrDefault().CName;
                        if (devName != "" && cirName != "")
                            item.RArae = devName + "_" + cirName + "_" + item.AlarmAddress;
                        else
                            item.RArae = item.AlarmAddress;
                    }
                    if (!string.IsNullOrEmpty(adress))
                        list = list.Where(p => p.RArae.Contains(adress)).ToList();
                    strJson = Common.List2Json(list, (int)rowcount[0].totalRows);
                }
                //string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                Common.InsertLog("报警查询", CurrentUser.UserName, "数据查询出错");
                string error = ex.ToString();
                return Content("");
            }
        }
        public class AralmView : t_AlarmTable_en
        {
            public string RArae { get; set; }
            public string Unit { get; set; }
        }

        //确认所有配电房的报警
        public ActionResult DelAllPAlarm()
        {
            try
            {
                string PDRList = HomeController.GetPID(CurrentUser.UNITList);
                // string PDRList = CurrentUser.PDRList;
                if (!PDRList.Equals(""))
                {
                    string sSql = "update [t_AlarmTable_en] set AlarmState = 0,AlarmConfirm='已确认',UserName='" + CurrentUser.UserName + "',ConfirmDate='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "' where PID in (" + PDRList + ") and AlarmConfirm='未确认' and AlarmState>0";
                    bll.ExecuteStoreCommand(sSql);

                    return Content("报警已全部确认！");
                }
                else
                {
                    return Content("没有权限，报警未确认！");
                }
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("报警确认失败！");
            }
        }

        public ActionResult DelAlarmById(int AlarmID, string AlarmTreatment)
        {
            try
            {
                string PDRList = HomeController.GetPID(CurrentUser.UNITList);
                //string PDRList = CurrentUser.PDRList;
                if (!PDRList.Equals(""))
                {
                    string sSql = "update [t_AlarmTable_en] set AlarmState = 0,AlarmTreatment = '" + AlarmTreatment + "',AlarmConfirm='已确认',UserName='" + CurrentUser.UserName + "',ConfirmDate='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "' where PID in (" + PDRList + ") and AlarmConfirm='未确认' and AlarmState>0 and AlarmID=" + AlarmID;
                    bll.ExecuteStoreCommand(sSql);
                    if (AlarmTreatment != null && AlarmTreatment.Contains("真实"))//添加隐患，并且下发工单；
                    {
                        List<t_AlarmTable_en> list = bll.t_AlarmTable_en.Where(p => p.AlarmID == AlarmID).ToList();
                        if (list != null && list.Count > 0)
                        {
                            try
                            {
                                t_AlarmTable_en alarm = list.First();
                                t_PM_Order order = new t_PM_Order();
                                order.PID = alarm.PID;
                                t_CM_PDRInfo pdrinfo = bll.t_CM_PDRInfo.Where(p => p.PID == alarm.PID).ToList().First();
                                order.PName = pdrinfo.Name;
                                try
                                {
                                    string c = pdrinfo.Coordination;
                                    string[] xx = c.Split('|');
                                    order.Latitude = decimal.Parse(xx[1]);
                                    order.Longtitude = decimal.Parse(xx[0]);
                                }
                                catch
                                {

                                }
                                order.OrderName = order.PName + "应急抢修" + DateTime.Now;
                                List<t_CM_Constract> ll = bll.t_CM_Constract.Where(p => p.CtrPid == alarm.PID).ToList();
                                if (ll == null || ll.Count <= 0)
                                {
                                    return Content("报警已确认！\n未找到合同中的负责人！\n自动下发工单失败，请手工处理！");
                                }
                                t_CM_Constract t = ll.First();
                                string sql = "SELECT * FROM t_CM_UserInfo WHERE UserName='" + t.person + "'";
                                List<t_CM_UserInfo> listUsers = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                                if (listUsers == null | listUsers.Count <= 0)
                                {
                                    return Content("报警已确认！\n未找到工单需要下发的人员！\n自动下发工单失败，请手工处理！");
                                }
                                order.UserName = t.person;//根据pid，类型查找合同，到名字；
                                order.PlanDate = DateTime.Now;
                                order.UserID = listUsers.First().UserID;
                                order.Priority = 1;
                                order.OrderNO = DateTime.Now.Ticks + "";
                                order.OrderType = "应急抢修";
                                order.DressCodeID = 2;
                                order.OrderState = 0;//0待接收 1已受理 2已完成
                                order.IsQualified = -1;//-1 未检查 0不合格 1合格
                                order.CreateDate = DateTime.Now;
                                order.Creater = CurrentUser.UserName;
                                order.OrderTypeId = 3;
                                order.OrderContent = "报警内容：" + alarm.ALarmType + ";" + alarm.AlarmDateTime + ";" + alarm.AlarmCate + ";" + ValueReset((double)alarm.AlarmValue, alarm.AlarmCate) + ";" + alarm.AlarmAddress + ";" + alarm.AlarmArea + ";" + alarm.Company + "。已确认为真实故障，请立即检修。";
                                bll.t_PM_Order.AddObject(order);
                                bll.SaveChanges();
                                //发送短信；
                                Result a = UtilsSms.smsOrderAdd(order.UserName, order.OrderName, bll);
                                AddBugInfo(AlarmID);
                                return Content("报警已确认！" + "\n\n" + parserContent(a));
                            }
                            catch (Exception ex)
                            {
                                string error = ex.ToString();
                                return Content("报警已确认！\n自动下发工单失败，请手工处理！");
                            }
                        }
                    }
                    return Content("报警已确认！");
                }
                else
                {
                    return Content("没有权限，报警未确认！");
                }
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("报警确认失败！");
            }
        }
        public ActionResult DelAlarmByIds(string AlarmID, string AlarmTreatment)
        {
            try
            {
                string PDRList = HomeController.GetPID(CurrentUser.UNITList);
                if (!PDRList.Equals(""))
                {
                    string sSql = "update [t_AlarmTable_en] set AlarmState = 0,AlarmTreatment = '" + AlarmTreatment + "',AlarmConfirm='已确认',UserName='" + CurrentUser.UserName + "',ConfirmDate='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "' where PID in (" + PDRList + ") and AlarmConfirm='未确认' and AlarmState>0 and AlarmID IN(" + AlarmID + ")";
                    bll.ExecuteStoreCommand(sSql);
                    return Content("报警已确认！");
                }
                else
                {
                    return Content("没有权限，报警未确认！");
                }
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("报警确认失败！");
            }
        }

        public ActionResult getMan(int AlarmID)
        {
            string result = "";
            try
            {
                t_AlarmTable_en alarm = bll.t_AlarmTable_en.Where(p => p.AlarmID == AlarmID).ToList().First();
                List<t_CM_Constract> ll = bll.t_CM_Constract.Where(p => p.CtrPid == alarm.PID).ToList();
                if (ll == null || ll.Count <= 0)
                {
                    return Content(result);
                }
                t_CM_Constract t = ll.First();
                string sql = "SELECT * FROM t_CM_UserInfo WHERE UserName='" + t.person + "'";
                List<t_CM_UserInfo> listUsers = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                if (listUsers != null | listUsers.Count > 0)
                {
                    return Content("联系班长：" + listUsers.First().UserName + "." + listUsers.First().Mobilephone);
                }
                return Content(listUsers.First().Mobilephone);
            }
            catch
            {
                return Content(result);
            }
        }

        private string ValueReset(double value, string AlarmCate)
        {
            string result = "";
            if (AlarmCate == "开关量")
            {
                if (value == 0)
                    result = "关";
                else
                    result = "开";
            }
            return result;
        }

        private string parserContent(Result result)
        {
            ResultT t = JsonConvert.DeserializeObject<ResultT>(result.responseText);
            if (t.code == 0)
            {
                return "发送工单短信成功！";
            }
            else
            {
                return "发送工单短信失败！\n原因：" + t.msg;
            }
            throw new NotImplementedException();
        }

        List<string> getPDRNameOkList()
        {
            try
            {
                List<string> sPDRNameOkList = new List<string>();
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = "1,2,3";
                //string pdrlist = CurrentUser.PDRList;
                sPDRNameOkList.Clear();
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

        //报警数据导出
        public ActionResult ExportAlarmData(int pid = 0, string startdate = "", string enddate = "", string typename = "")
        {

            string PDRList = HomeController.GetPID(CurrentUser.UNITList);
            string query = " where 1=1 ";
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
                //query = query + " and pid in (1,3)";
                query = query + " and pid in (" + PDRList + ")";
            if (!typename.Equals("") && !typename.Equals("==全部=="))
                query = query + " and AlarmCate='" + typename + "'";
            if (!startdate.Equals(""))
            {
                startdate = startdate.Replace('-', '/');
                query = query + " and AlarmDateTime>='" + startdate + "'";
            }
            if (!enddate.Equals(""))
            {
                enddate = enddate.Replace('-', '/');
                query = query + " and AlarmDateTime<='" + enddate + "'";
            }
            string strsql = "select ALarmType 报警级别,AlarmDate 日期,AlarmTime 时间,AlarmCate 报警类型,AlarmValue 数值,AlarmAddress 监测位置,AlarmArea 监测站点,Company 所属单位,AlarmConfirm 确认,UserName 确认人,ConfirmDate 确认时间 from t_AlarmTable_en " + query + " order by AlarmID desc";
            DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
            ExportExcel.doExport2003(ds, "~/DownLoad/alarmdata.xls");
            return Content("/DownLoad/alarmdata.xls");
        }


        //报警报告
        public ActionResult ExportAlarmDoc(int AlarmID)
        {
            try
            {
                PubClass.Exportdoc.ExportWordFromAlarm(AlarmID, CurrentUser);
                string fileName = "/DownLoad/alarm/alarm" + AlarmID + ".doc";

                return Content(fileName);
            }
            catch (Exception)
            {
                return Content("生成报警报告异常！");
            }
        }

        //添加隐患
        [Login]
        public ActionResult AddBugInfo(int AlarmID)
        {
            string result = "OK";
            try
            {
                List<t_CM_BugInfo> list = bll.t_CM_BugInfo.Where(p => p.AlarmID == AlarmID).ToList();
                if (list.Count > 0)
                    result = "此报警隐患已存在，请重新选择！ ";
                else
                {
                    t_AlarmTable_en Alarm = bll.t_AlarmTable_en.Where(r => r.AlarmID == AlarmID).First();
                    t_CM_PDRInfo PDRInfo = bll.t_CM_PDRInfo.Where(r => r.PID == Alarm.PID).First();
                    t_CM_BugInfo info = new t_CM_BugInfo();
                    info.PID = Alarm.PID;
                    info.PName = PDRInfo.Name;
                    info.DID = Alarm.DID;
                    if (Alarm.DID > 0)
                    {
                        t_DM_DeviceInfo DeviceInfo = bll.t_DM_DeviceInfo.Where(r => r.DID == Alarm.DID).First();
                        info.DeviceName = DeviceInfo.DeviceName;
                    }
                    info.ReportWay = "在线监测";
                    if (Alarm.ALarmType == "关注")
                        info.BugLevel = "一般";
                    else if (Alarm.ALarmType == "预警")
                        info.BugLevel = "重大";
                    else
                        info.BugLevel = "紧急";
                    info.BugLocation = Alarm.AlarmArea;
                    info.BugDesc = Alarm.ALarmType + "：" + Alarm.AlarmCate + "" + PDRInfo.Name + Alarm.AlarmAddress + Alarm.Company + "：" + Alarm.AlarmValue + "，限值" + Alarm.AlarmMaxValue + "，" + Convert.ToDateTime(Alarm.AlarmDateTime).ToString("yyyy-MM-dd HH:mm:ss");
                    info.AlarmID = AlarmID;
                    info.ReportDate = DateTime.Now;
                    info.HandeSituation = "未审核";
                    info.ReportUser = CurrentUser.UserName;
                    bll.t_CM_BugInfo.AddObject(info);
                    bll.SaveChanges();
                    Common.InsertLog("隐患管理", CurrentUser.UserName, "报警新增隐患信息[" + AlarmID + "]");
                    result = "OKadd";
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return Content(result);
        }

        //private t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}
        /// <summary>
        /// 配电房报警状态实体
        /// </summary>
        public class PAlarmState
        {
            public int pid { set; get; }
            public int state { set; get; }
            public string info { set; get; }
        }
        #endregion

        #region 通讯状态数据
        //通讯状态数据查询
        [Login]
        public ActionResult AlarmSysTableDate(int rows = 0, int page = 0, int pid = 0, int alarmstate = -1, string startdate = "", string enddate = "")
        {
            try
            {

                string strquery = " 1=1";
                string PDRList = HomeController.GetPID(CurrentUser.UNITList);
                if (pid > 0)
                    strquery = strquery + " and pid=" + pid;
                else
                    strquery = strquery + " and pid in (" + PDRList + ")";
                if (alarmstate > -1)
                    strquery = strquery + " and alarmstate= " + alarmstate;
                if (!startdate.Equals(""))
                    strquery = strquery + " and AlarmDateTime>='" + startdate + "'";
                else
                {
                    strquery = strquery + " and AlarmDateTime>='" + DateTime.Now.AddDays(-10) + "'";
                }
                if (!enddate.Equals(""))
                    strquery = strquery + " and AlarmDateTime<='" + enddate + "'";
                string strsql = "select * from t_AlarmSysTable_en where " + strquery + " order by AlarmID desc";
                List<t_AlarmSysTable_en> list = bll.ExecuteStoreQuery<t_AlarmSysTable_en>(strsql).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                Common.InsertLog("通讯状态查询", CurrentUser.UserName, "数据查询出错");
                string error = ex.ToString();
                return Content("");
            }
        }

        //通讯状态数据导出
        public ActionResult ExportAlarmSysTableData(int pid = 0, int alarmstate = -1, string startdate = "", string enddate = "")
        {
            string query = " where 1=1 ";
            string PDRList = HomeController.GetPID(CurrentUser.UNITList);
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
                query = query + " and pid in (" + PDRList + ")";
            if (alarmstate > -1)
                query = query + " and alarmstate= " + alarmstate;
            if (!startdate.Equals(""))
            {
                //startdate = startdate.Replace('-', '/');
                query = query + " and AlarmDateTime>='" + startdate + "'";
            }
            if (!enddate.Equals(""))
            {
                //enddate = enddate.Replace('-', '/');
                query = query + " and AlarmDateTime<='" + enddate + "'";
            }
            string strsql = "select ALarmType 报警类型,AlarmDateTime 日期,PDRName 站室名称,CASE AlarmState WHEN 0 THEN '通讯正常' ELSE '通讯断开' END 通讯状态 from t_AlarmSysTable_en " + query + " order by AlarmID desc";
            DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
            ExportExcel.doExport2003(ds, "~/DownLoad/alarmsysdata.xls");
            return Content("/DownLoad/alarmsysdata.xls");
        }
        #endregion

        #region SOE数据

        //SOE列表
        [Login]
        public ActionResult SoeListData(int rows, int page, int PID = 0, string StartHappenDate = "", string EndHappenDate = "")
        {
            DateTime startdate = !string.IsNullOrWhiteSpace(StartHappenDate) ? Convert.ToDateTime(StartHappenDate) : DateTime.MinValue;
            DateTime enddate = !string.IsNullOrWhiteSpace(EndHappenDate) ? Convert.ToDateTime(EndHappenDate) : DateTime.MinValue;

            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string strsql = "select * from t_CM_SOEInfo where 1=1";
            string strquery = "";
            if (PID > 0)
                strquery += " and pid=" + PID;
            else
                strquery += " and pid in (" + pdrlist + ")";
            if (!StartHappenDate.Equals(""))
                strquery += " and HappenDate > '" + StartHappenDate + "'";
            if (!EndHappenDate.Equals(""))
                strquery += " and HappenDate < '" + EndHappenDate + "'";
            strsql = strsql + strquery;

            List<t_CM_SOEInfo> Blist = bll.ExecuteStoreQuery<t_CM_SOEInfo>(strsql).OrderByDescending(o => o.HappenDate).ToList();
            string strJson = Common.List2Json(Blist, rows, page);

            return Content(strJson);
        }
        #endregion
    }
}
