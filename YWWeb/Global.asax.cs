using DAL;
using DAL.Models;
using IDAO.Models;
using Loger;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using YWWeb.PubClass;

namespace YWWeb
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
            Thread weather = new Thread(getWeatherInfo);
            weather.Start();
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
                //List<t_AlarmTable_en> alarmList = bll.ExecuteStoreQuery<t_AlarmTable_en>("SELECT * FROM t_AlarmTable_en WHERE t_AlarmTable_en.Alarmstate>0 AND AlarmDateTime>'" + DateTime.Now.AddDays(-1).ToString() + "' ORDER BY  AlarmDateTime desc,PID").ToList();
                List<OrderByCondtion> orderby = new List<OrderByCondtion>();
                orderby.Add(new OrderByCondtion { ColumnName = "AlarmDateTime", orderType = OrderByType.DESC });
                orderby.Add(new OrderByCondtion { ColumnName = "PID", orderType = OrderByType.ASC });
                IList<IDAO.Models.t_AlarmTable_en> alarmList = DAL.AlarmTable_enDAL.getInstance().GetAlarm_enInf(1, DateTime.Now.AddDays(-1), null, orderby);

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
                LogHelper.Error(ex);
                return;
            }
        }

        private void sendAlarm(IDAO.Models.t_AlarmTable_en alarm)
        {
            int pid = (int)alarm.PID;
            //List<t_CM_UserInfo> userList = bll.ExecuteStoreQuery<t_CM_UserInfo>("SELECT * FROM t_CM_UserInfo WHERE (PDRList LIKE '" + pid + ",%' OR PDRList = '%," + pid + "' OR PDRList LIKE '%," + pid + ",%' OR PDRList = '" + pid + "')").ToList();
            IList<IDAO.Models.t_CM_UserInfo> userList = UserInfoDAL.getInstance().GetUsers(pid);
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
            //Debug.WriteLine(DateTime.Now.ToString() + ",alarm.PID=" + alarm.PID);//c#打印输出信息
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



        private void getWeatherInfo()
        {
            var timer = new System.Timers.Timer();
            timer.Elapsed += InsertWeatherInfo;
            timer.AutoReset = true;
            timer.Enabled = true;
            timer.Interval = 3600000;
            timer.Interval = 3600000;
            Console.Read();
        }
        public void InsertWeatherInfo(object sender, System.Timers.ElapsedEventArgs e)
        {
            try
            {
                string url = "http://api.k780.com/?app=weather.today";
                PostData data = new PostData();
                data.appkey = "39089";
                data.sign = "6e957038e2c4e3836e9a2c5621e9361d";
                data.format = "json";
                data.weaid = getIp();
                string s = SendHttpRequest(url, "post", data);
                var model = JsonConvert.DeserializeObject<WeatherView>(s);
                if (model.success == "1")
                {
                    DateTime d = Convert.ToDateTime(DateTime.Now.ToString("yy-MM-dd HH:00:00"));
                    var mm = bll.t_EE_WeatherDaily.Where(p => p.RecordTime == d && p.CityCode == model.result.cityid).FirstOrDefault();
                    if (mm != null)
                    {
                        mm.MaxValue = model.result.temperature.Split('/')[0];
                        mm.MinValue = model.result.temperature.Split('/')[1];
                        bll.ObjectStateManager.ChangeObjectState(mm, System.Data.EntityState.Modified);
                    }
                    else
                    {
                        t_EE_WeatherDaily m = new t_EE_WeatherDaily();
                        m.CityCode = model.result.cityid;
                        m.CityName = model.result.citynm;
                        m.RecordTime = Convert.ToDateTime(d);
                        m.MaxValue = model.result.temperature.Split('/')[0];
                        m.MinValue = model.result.temperature.Split('/')[1];
                        bll.t_EE_WeatherDaily.AddObject(m);
                    }
                    bll.SaveChanges();

                    var lastDay = bll.t_EE_WeatherDaily.OrderByDescending(p => p.RecordTime).FirstOrDefault();
                    if (lastDay != null)
                    {
                        DateTime dM = Convert.ToDateTime(lastDay.RecordTime.Value.ToString("yy-MM-dd"));
                        var Mon = bll.t_EE_WeatherMonthly.Where(p => p.RecordTime == dM && p.CityCode == model.result.cityid).FirstOrDefault();
                        if (Mon != null)
                        {
                            Mon.MaxValue = lastDay.MaxValue;
                            Mon.MinValue = lastDay.MinValue;
                            bll.ObjectStateManager.ChangeObjectState(Mon, System.Data.EntityState.Modified);
                        }
                        else
                        {
                            t_EE_WeatherMonthly month = new t_EE_WeatherMonthly();
                            month.CityName = lastDay.CityName;
                            month.CityCode = lastDay.CityCode;
                            month.RecordTime = dM;
                            month.MaxValue = lastDay.MaxValue;
                            month.MinValue = lastDay.MinValue;
                            bll.t_EE_WeatherMonthly.AddObject(month);
                        }
                    }
                    bll.SaveChanges();
                    var lastMonth = bll.t_EE_WeatherMonthly.OrderByDescending(p => p.RecordTime).FirstOrDefault();
                    if (lastMonth != null)
                    {
                        DateTime dY = Convert.ToDateTime(lastMonth.RecordTime.Value.ToString("yy-MM-01"));
                        var Yea = bll.t_EE_WeatherYearly.Where(p => p.RecordTime == dY && p.CityCode == model.result.cityid).FirstOrDefault();
                        if (Yea != null)
                        {
                            Yea.MaxValue = lastMonth.MaxValue;
                            Yea.MinValue = lastMonth.MinValue;
                            bll.ObjectStateManager.ChangeObjectState(Yea, System.Data.EntityState.Modified);
                        }
                        else
                        {
                            t_EE_WeatherYearly year = new t_EE_WeatherYearly();
                            year.CityName = lastMonth.CityName;
                            year.CityCode = lastMonth.CityCode;
                            year.RecordTime = dY;
                            year.MaxValue = lastMonth.MaxValue;
                            year.MinValue = lastMonth.MinValue;
                            bll.t_EE_WeatherYearly.AddObject(year);
                        }
                    }
                    bll.SaveChanges();

                }
            }

            catch (Exception ex)
            {
                string error = ex.ToString();
                return;
            }
        }
        public string getIp()
        {
            string ipAddress = null;
            try
            {
                string hostName = Dns.GetHostName();
                IPHostEntry ipEntry = Dns.GetHostEntry(hostName);
                for (int i = 0; i < ipEntry.AddressList.Length; i++)
                {
                    if (ipEntry.AddressList[i].AddressFamily == AddressFamily.InterNetwork)
                    {
                        ipAddress = ipEntry.AddressList[i].ToString();
                    }
                }
                return ipAddress;
            }
            catch (Exception ex)
            {
                return "获取IP出错:" + ex.Message;
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
            string err = (null == sender) ? "" : sender.ToString();
            err += "error:" + ex.ToString();
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

        private string SendHttpRequest(string requestURI, string requestMethod, PostData data)
        {
            //json格式请求数据
            string requestData = JsonConvert.SerializeObject(data);
            //拼接URL
            string serviceUrl = requestURI;//string.Format("{0}/{1}", requestURI, requestMethod);
            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(serviceUrl);
            //post请求
            myRequest.Method = requestMethod;
            Type type = data.GetType();
            PropertyInfo[] pis = type.GetProperties();
            StringBuilder builder = new StringBuilder();
            int i = 0;
            foreach (var item in pis)
            {
                if (i > 0)
                    builder.Append("&");
                builder.AppendFormat("{0}={1}", item.Name, item.GetValue(data) == null ? "no" : item.GetValue(data));
                i++;
            }
            //utf-8编码
            byte[] buf = System.Text.Encoding.GetEncoding("UTF-8").GetBytes(builder.ToString());

            myRequest.ContentLength = buf.Length;
            myRequest.Timeout = 5000;
            //指定为json否则会出错
            myRequest.ContentType = "application/x-www-form-urlencoded";
            myRequest.MaximumAutomaticRedirections = 1;
            myRequest.AllowAutoRedirect = true;
            Stream newStream = myRequest.GetRequestStream();
            newStream.Write(buf, 0, buf.Length);
            newStream.Close();

            //获得接口返回值
            HttpWebResponse myResponse = (HttpWebResponse)myRequest.GetResponse();
            StreamReader reader = new StreamReader(myResponse.GetResponseStream(), Encoding.UTF8);
            string ReqResult = reader.ReadToEnd();
            reader.Close();
            myResponse.Close();
            return ReqResult;
        }

        private class WeatherView
        {
            public WeatherView()
            {
                result = new Weather();
            }
            public string success { get; set; }
            public Weather result { get; set; }
        }
        public class Weather
        {
            public string weaid { get; set; }
            public string days { get; set; }
            public string week { get; set; }
            public string cityno { get; set; }
            public string citynm { get; set; }
            public string cityid { get; set; }
            public string temperature { get; set; }
            public string temperature_curr { get; set; }
            public string humidity { get; set; }
        }
        public class PostData
        {
            public string weaid { get; set; }
            public string appkey { get; set; }
            public string sign { get; set; }
            public string format { get; set; }
        }
    }
}