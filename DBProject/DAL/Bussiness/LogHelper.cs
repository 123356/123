using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using log4net;
using System.Web;
using System.IO;
using System.Data;
using System.Diagnostics;

namespace DAL.Loger
{
    public class LogHelper
    {

        //路径动态设置，应该需要跟config配合使用才能生效，待需要时再研究

        //将日记对象缓存起来
        public static Dictionary<string, ILog> LogDic = new Dictionary<string, ILog>();
        static object _islock = new object();
        static LogHelper()
        {
            //var pathLoc = "~/bin";
            //var path = HostingEnvironment.MapPath(pathLoc) + @"\log4net.config";
            //log4net.Config.XmlConfigurator.Configure(new System.IO.FileInfo(path));
        }
        public static ILog GetLog(string name)
        {
            try
            {
                if (LogDic == null)
                {
                    LogDic = new Dictionary<string, ILog>();
                }
                lock (_islock)
                {
                    if (!LogDic.ContainsKey(name))
                    {
                        LogDic.Add(name, LogManager.GetLogger(name));
                    }
                }
                return LogDic[name];
            }
            catch
            {
                return LogManager.GetLogger("Default");
            }
        }
        public static void Debug(string client, string name, object message)
        {
            //该参数有三部分组成：客户端_日记类型_logger配置名称；<file value="logs/%Client/%LogType/" />
            //value如果不需要客户端时可写成<file value="logs/%LogType/" />；这里是需要动态配置的才加上
            //在上面的配置，name传入的就是 Test 最终字符串是：客户端_Debug_Test
            var log = GetLog(string.Format("{0}_Debug_{1}", client, name));
            if (log == null)
            {
                return;
            }
            log.Debug(message);
        }
        public static void Error(string client, string name, object message)
        {
            var log = GetLog(string.Format("{0}_Error_{1}", client, name));
            if (log == null)
            {
                return;
            }
            log.Error(message);
        }


        public static void Info(string client, string name, object message)
        {
            var log = GetLog(string.Format("{0}_Info_{1}", client, name));
            if (log == null)
            {
                return;
            }
            log.Info(message);
        }
        public static void Warn(string client, string name, object message)
        {
            var log = GetLog(string.Format("{0}_Warn_{1}", client, name));
            if (log == null)
            {
                return;
            }
            log.Warn(message);
        }

        #region type

        public static void Debug(Type type, object message)
        {
            //该参数有三部分组成：客户端_日记类型_logger配置名称；<file value="logs/%Client/%LogType/" />
            //value如果不需要客户端时可写成<file value="logs/%LogType/" />；这里是需要动态配置的才加上
            //在上面的配置，name传入的就是 Test 最终字符串是：客户端_Debug_Test
            var log = GetLog(string.Format("{0}_Debug_{1}", type.Module.Name, type.Name));
            if (log == null)
            {
                return;
            }
            log.Debug(message);
        }
        public static void Error(Type type, object message)
        {
            var log = GetLog(string.Format("{0}_Error_{1}", type.Module.Name, type.Name));
            if (log == null)
            {
                return;
            }
            log.Error(message);
        }


        public static void Info(Type type, object message)
        {
            var log = GetLog(string.Format("{0}_Info_{1}", type.Module.Name, type.Name));
            if (log == null)
            {
                return;
            }
            log.Info(message);
        }
        public static void Warn(Type type, object message)
        {
            var log = GetLog(string.Format("{0}_Warn_{1}", type.Module.Name, type.Name));
            if (log == null)
            {
                return;
            }
            log.Warn(message);
        }
        #endregion

        #region default

        public static void Debug(object message)
        {
            //该参数有三部分组成：客户端_日记类型_logger配置名称；<file value="logs/%Client/%LogType/" />
            //value如果不需要客户端时可写成<file value="logs/%LogType/" />；这里是需要动态配置的才加上
            //在上面的配置，name传入的就是 Test 最终字符串是：客户端_Debug_Test
            var log = GetLog(string.Format("{0}_Debug_{1}", typeof(LogHelper).Module.Name, typeof(LogHelper).Name));
            if (log == null)
            {
                return;
            }
            log.Debug(message);
        }
        public static void Error( object message)
        {
            var log = GetLog(string.Format("{0}_Error_{1}", typeof(LogHelper).Module.Name, typeof(LogHelper).Name));
            if (log == null)
            {
                return;
            }
            log.Error(message);
        }


        public static void Info( object message)
        {
            var log = GetLog(string.Format("{0}_Info_{1}", typeof(LogHelper).Module.Name, typeof(LogHelper).Name));
            if (log == null)
            {
                return;
            }
            log.Info(message);
        }
        public static void Warn( object message)
        {
            var log = GetLog(string.Format("{0}_Warn_{1}", typeof(LogHelper), typeof(LogHelper).Name));
            if (log == null)
            {
                return;
            }
            log.Warn(message);
        }
        #endregion

        /// <summary>
        /// 绑定程序中的异常处理
        /// </summary>
        public static void BindExceptionHandler()
        {
            //设置应用程序处理异常方式：ThreadException处理
            //Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
            ////处理UI线程异常
            //Application.ThreadException += new System.Threading.ThreadExceptionEventHandler(Application_ThreadException);
            ////处理未捕获的异常
            //AppDomain.CurrentDomain.UnhandledException += new UnhandledExceptionEventHandler(CurrentDomain_UnhandledException);
            //Application.ApplicationExit += new EventHandler(Application_ApplicationExit);
        }
        //根据异常以name+时间生成log文件保存到本地；
        //public static void makeLog(Exception ex, string name)
        //{
        //    Exception innerException = ex.InnerException;
        //    if (innerException != null) ex = innerException;
        //    var logPath = HttpContext.Current.Server.MapPath("~/logs/");
        //    if (!Directory.Exists(logPath))
        //    {
        //        Directory.CreateDirectory(logPath);
        //    }
        //    using (StreamWriter sw = new StreamWriter(logPath + @"\"+name + DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss") + ".txt", true))
        //    {
        //        sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        //        sw.WriteLine("未处理异常：" + ex.GetType().ToString());
        //        sw.WriteLine("异常信息：" + ex.Message);
        //        sw.WriteLine("异常堆栈：" + ex.StackTrace);
        //    }
        //}

        static void Application_ApplicationExit(object sender, EventArgs e)
        {
            //throw new NotImplementedException();
            LogHelper.Info("Application_ApplicationExit():"+e.ToString());
        }
        /// <summary>
        /// 处理UI线程异常
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        static void Application_ThreadException(object sender, System.Threading.ThreadExceptionEventArgs e)
        {
            LogHelper.Error(e.GetType(), "Application_ThreadException: "+(e.Exception as Exception).ToString());
        }
        /// <summary>
        /// 处理未捕获的异常
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            LogHelper.Error(e.GetType(), "终止？"+e.IsTerminating+(e.ExceptionObject as Exception).ToString());
        }

    }
}

