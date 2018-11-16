using S5001Web.PubClass;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace S5001Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        pdermsWebEntities bll = new pdermsWebEntities();
        protected void Application_Start()
        {
            var pathLoc = "~/bin";
            var path = HostingEnvironment.MapPath(pathLoc) + @"\log4net.config";
            log4net.Config.XmlConfigurator.Configure(new System.IO.FileInfo(path));

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            Thread th = new Thread(getPtAlarmInfo);
            th.Start();
            Thread conth = new Thread(getContempInfo);
            conth.Start();
        }
        private void getPtAlarmInfo()
        {
            var timer = new System.Timers.Timer();
            timer.Elapsed += timer_Elapsed;
            timer.AutoReset = true;
            timer.Enabled = true;
            timer.Interval = 5000;
            Console.Read();
        }
        private void timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            try
            {
                List<t_AlarmTable_en> alarmList = bll.ExecuteStoreQuery<t_AlarmTable_en>("SELECT * FROM t_AlarmTable_en WHERE t_AlarmTable_en.Alarmstate>0 AND AlarmDateTime>'" + DateTime.Now.AddDays(-1).ToString() + "' ORDER BY  AlarmDateTime desc,PID").ToList();
                if (alarmList != null && alarmList.Count > 0)
                {
                    int pid = (int)alarmList[0].PID;
                    sendAlarm(alarmList[0]);
                    for (int i = 0; i < alarmList.Count; i++)
                    {
                        if (pid == (int)alarmList[i].PID)
                        {
                            continue;
                        }
                        else
                        {
                            pid = (int)alarmList[i].PID;
                            sendAlarm(alarmList[i]);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return;
            }
        }

        private void sendAlarm(t_AlarmTable_en alarm)
        {
            int pid = (int)alarm.PID;
            List<t_CM_UserInfo> userList = bll.ExecuteStoreQuery<t_CM_UserInfo>("SELECT * FROM t_CM_UserInfo WHERE (PDRList LIKE '" + pid + ",%' OR PDRList = '%," + pid + "' OR PDRList LIKE '%," + pid + ",%' OR PDRList = '" + pid + "')").ToList();
            if (userList == null || userList.Count <= 0) return;
            for (int i = 0; i < userList.Count; i++)
            {
                if (userList[i].OpenAlarmMsg == 1)
                {
                    //根据手机号查询该报警是否发过短信；
                    List<t_Alarm_SMS> sendedList = bll.ExecuteStoreQuery<t_Alarm_SMS>("SELECT * FROM t_Alarm_SMS WHERE mobilephone='" + userList[i].Mobilephone + "' AND alarmId=" + alarm.AlarmID).ToList();
                    if (sendedList == null || sendedList.Count <= 0)
                    {
                        UtilsSms.smsAlarm(userList[i].Mobilephone, alarm);
                        //INSERT INTO t_Alarm_SMS (alarmTime,alarmId,sendTime,mobilephone) VALUES ('2018-03-20 16:53:11',1522,'2018-03-20 16:53:11','15210091230')
                        string insert = "INSERT INTO t_Alarm_SMS (alarmTime,alarmId,sendTime,mobilephone) VALUES ('" + alarm.AlarmDateTime + "'," + alarm.AlarmID + ",'" + DateTime.Now.ToString() + "','" + userList[i].Mobilephone + "')";
                        bll.ExecuteStoreCommand(insert);
                    }
                }
            }
            Debug.WriteLine(DateTime.Now.ToString() + ",alarm.PID=" + alarm.PID);//c#打印输出信息
        }
        private void getContempInfo()
        {
            var timer = new System.Timers.Timer();
            timer.Elapsed += SendConTemp;
            timer.AutoReset = true;
            timer.Enabled = true;
            timer.Interval = 5000;
            Console.Read();
        }
        public void SendConTemp(object sender, System.Timers.ElapsedEventArgs e)
        {
            try
            {
                var list = bll.t_ES_ContractTemplet.Where(p => p.IsOk == 0).ToList();
                foreach (var item in list)
                {

                    //var sss = item.StartTime.Value.Date;
                    //var ss = DateTime.Now.AddDays(Convert.ToDouble(item.BeforDay)).Date;
                    if (
                        (item.StartTime.Value.Date == DateTime.Now.AddDays(Convert.ToDouble(item.BeforDay)).Date && item.AlarmTime.Value.Date != DateTime.Now.Date)
                        || item.AlarmTime.Value.Date == Convert.ToDateTime("1900-01-01").Date
                        || (item.StartTime.Value.Date == DateTime.Now.Date && item.AlarmTime.Value.Date != DateTime.Now.Date)
                        )

                    {
                        t_CM_UserInfo user = bll.t_CM_UserInfo.Where(p => p.UserID == item.PersonID).FirstOrDefault();
                        if (user != null)
                        {
                            item.AlarmTime = DateTime.Now;
                            bll.ObjectStateManager.ChangeObjectState(item, System.Data.EntityState.Modified);
                            UtilsSms.smsConTemp(user.Telephone);
                        }
                    }
                }
                bll.SaveChanges();

            }

            catch (Exception ex)
            {
                string error = ex.ToString();
                return;
            }
        }
        protected void Session_End()
        {
            string sss = "";

        }
        protected void Application_Error(object sender, EventArgs e)
        {
            //获取到HttpUnhandledException异常，这个异常包含一个实际出现的异常
            Exception ex = Server.GetLastError();
            //实际发生的异常
            Exception innerException = ex.InnerException;
            if (innerException != null) ex = innerException;
            string err=(null==sender) ?"":sender.ToString();
            err+="error:"+ex.ToString();
            Loger.LogHelper.Error(err);
            //var logPath = Server.MapPath("~/logs/");
            //if (!Directory.Exists(logPath))
            //{
            //    Directory.CreateDirectory(logPath);
            //}
            ////new StreamWriter(mydocpath + @"\WriteLines.txt", true)
            //using (StreamWriter sw = new StreamWriter(logPath + @"\Log" + DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss") + ".txt", true))
            //{
            //    sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            //    sw.WriteLine("Global捕获到未处理异常：" + ex.GetType().ToString());
            //    sw.WriteLine("异常信息：" + ex.Message);
            //    sw.WriteLine("异常堆栈：" + ex.StackTrace);
            //    sw.WriteLine();
            //}
            //HttpContext.Current.Response.Write(string.Format("捕捉到未处理的异常：{0}<br/>", ex.GetType().ToString()));
            //HttpContext.Current.Response.Write("Global已进行错误处理。");
            Server.ClearError();
        }
    }
}