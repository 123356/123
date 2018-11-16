using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Yunpian.conf;
using Yunpian.lib;
using Yunpian.model;

namespace S5001Web.PubClass
{
    public class UtilsSms
    {
        public static string company = "能云盈和";
        public static string key = "acbe574db01bac8ee5dbad7abc9169be";
        public static Result smsOrderAdd(string handler,string OrderName, pdermsWebEntities bll)
        {
            try
            {
                string sql = "SELECT * FROM t_CM_UserInfo WHERE UserName='" + handler + "'";
                List<t_CM_UserInfo> listUsers = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                if (listUsers != null && listUsers.Count > 0)
                {
                    string mobile = listUsers.First().Mobilephone;
                    Config config = new Config(key);
                    Dictionary<string, string> data = new Dictionary<string, string>();
                    Result result = null;
                    SmsOperator sms = new SmsOperator(config);
                    data.Clear();
                    data.Add("mobile", mobile);
                    data.Add("text", "【"+company+"】您有一个工单名称为[" + subString(OrderName) + "]的待处理工单，请及时处理！");               
                    return sms.singleSend(data);
                }
                else
                {
                    string rm= "{\"code\":2,\"msg\":\""+"查找不到"+handler+"的手机号"+"\",\"count\":1,\"fee\":0.05,\"unit\":\"RMB\",\"mobile\":\"13681206520\",\"sid\":22927664130}";
                    return new Result(-1,rm);
                }             
            }
            catch (Exception e)
            {
                string rm = "{\"code\":2,\"msg\":\"" + "发送短信出错：" + e.Message +  "\",\"count\":1,\"fee\":0.05,\"unit\":\"RMB\",\"mobile\":\"13681206520\",\"sid\":22927664130}";
                return new Result(-1, rm);
            }
          
        }
        //合同事项通知
        public static void smsContractTemp(string mobile,string content)
        {
            try
            {
                Config config = new Config(key);
                Dictionary<string, string> data = new Dictionary<string, string>();
                Result result = null;
                SmsOperator sms = new SmsOperator(config);
                data.Clear();
                data.Add("mobile", mobile);
                data.Add("text", "【" + company + "】您有一条信息通知：" + content + "，请及时处理。如有疑问，联系管理员。");
                result = sms.singleSend(data);
                Console.WriteLine(result);
            }
            catch (Exception e)
            {

            }

        }
        //运营合同项短信通知
        public static void smsConTemp(string mobile)
        {
            try
            {
                Config config = new Config(key);
                Dictionary<string, string> data = new Dictionary<string, string>();
                Result result = null;
                string content = "有未处理的合同项";
                SmsOperator sms = new SmsOperator(config);
                data.Clear();
                data.Add("mobile", mobile);
                data.Add("text", "【" + company + "】您有一条信息通知：" + content + "，请及时处理。如有疑问，联系管理员。");
                result = sms.singleSend(data);
                Console.WriteLine(result);
            }
            catch (Exception e)
            {

            }

        }

        //用电计划修改短信通知；
        public static void smsInform(string mobile,int year,int month)
        {
            try
            {
                Config config = new Config(key);
                Dictionary<string, string> data = new Dictionary<string, string>();
                Result result = null;
                SmsOperator sms = new SmsOperator(config);
                data.Clear();
                data.Add("mobile", mobile);
                data.Add("text", "【" + company + "】系统已确认分配了您的"+year+"-"+month+"的用电计划，详细信息请登录微信小程序查看。");
                result = sms.singleSend(data);
                Console.WriteLine(result);
            }
            catch (Exception e)
            {

            }

        }

        public static void smsContent(string mobile,string content)
        {
            try
            {
                Config config = new Config(key);
                Dictionary<string, string> data = new Dictionary<string, string>();
                Result result = null;
                SmsOperator sms = new SmsOperator(config);
                data.Clear();
                data.Add("mobile", mobile);
                data.Add("text", "【"+company+"】您有一条信息通知："+content+"，请及时处理。如有疑问，联系管理员。");
                result = sms.singleSend(data);
                Console.WriteLine(result);
            }
            catch (Exception e)
            {

            }

        }

        private static string subString(string OrderName)
        {
            if (OrderName.Length > 10) OrderName = OrderName.Substring(0, 7)+"...";
            return OrderName;
        }
        public static void smsOrderCancel(string handler, string OrderName, pdermsWebEntities bll)
        {
            try
            {
                string sql = "SELECT * FROM t_CM_UserInfo WHERE UserName='" + handler + "'";
                List<t_CM_UserInfo> listUsers = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                if (listUsers != null && listUsers.Count > 0)
                {
                    string mobile = listUsers.First().Mobilephone;
                    Config config = new Config(key);
                    Dictionary<string, string> data = new Dictionary<string, string>();
                    SmsOperator sms = new SmsOperator(config);
                    data.Clear();
                    data.Add("mobile", mobile);
                    data.Add("text", "【"+company+"】您的一个待处理工单[" + subString(OrderName) + "]，已取消！");
                    sms.singleSend(data);
                }
            }catch(Exception e){

            }     
        }
        //String.Format("Hello {0}, I'm {1}", p1, p2)
        //1合;0分;
        private static string sj = "【"+company+"】您有{0}级水浸警报，值：{1}，位置：{2}";
        private static string yg = "【"+company+"】您有{0}级烟感警报，值：{1}，位置：{2}";
        private static string wd = "【"+company+"】您有{0}级超温警报，温度：{1}℃，位置：{2}";
        private static string gl = "【"+company+"】您有{0}级过流警报，电流：{1}A，位置：{2}";
        private static string gy = "【"+company+"】您有{0}级过压警报，电压：{1}，位置：{2}";
        private static string glv = "【"+company+"】您有{0}级功率因素警报，值：{1}，位置：{2}";
        private static string kg = "【"+company+"】您有{0}级开关变位警报，值：{1}，位置：{2}";
        internal static Result smsAlarm(string Mobilephone, t_AlarmTable_en alarm)
        {
            Config config = new Config(key);
            Dictionary<string, string> data = new Dictionary<string, string>();
            SmsOperator sms = new SmsOperator(config);
            data.Clear();
            data.Add("mobile", Mobilephone);
            data.Add("text", getText(alarm));
            return sms.singleSend(data);
        }

        private static string getText(t_AlarmTable_en alarm)
        {
            string result = "";
            if (alarm.AlarmCate.Contains("水"))
            {
                string value=getValue(alarm.AlarmCate,alarm.AlarmValue);
                result = String.Format(sj, alarm.AlarmState,value, subString(alarm.Company,9-value.Length));
            }
            else if (alarm.AlarmCate.Contains("烟"))
            {
                string value = getValue(alarm.AlarmCate, alarm.AlarmValue);
                result = String.Format(yg, alarm.AlarmState, value, subString(alarm.Company, 9 - value.Length));
            }
            else if (alarm.AlarmCate.Contains("温度"))
            {
                string value = getValue(alarm.AlarmCate, alarm.AlarmValue);
                result = String.Format(wd, alarm.AlarmState, value, subString(alarm.Company, 9 - value.Length));
            }
            else if (alarm.AlarmCate.Contains("电流"))
            {
                string value = getValue(alarm.AlarmCate, alarm.AlarmValue);
                result = String.Format(gl, alarm.AlarmState, value, subString(alarm.Company, 9 - value.Length));
            }
            else if (alarm.AlarmCate.Contains("电压"))
            {
                string value = getValue(alarm.AlarmCate, alarm.AlarmValue);
                result = String.Format(gy, alarm.AlarmState, value, subString(alarm.Company, 9 - value.Length));
            }
            else if (alarm.AlarmCate.Contains("功率"))
            {
                string value = getValue(alarm.AlarmCate, alarm.AlarmValue);
                result = String.Format(glv, alarm.AlarmState, value, subString(alarm.Company, 9 - value.Length));
            }
            else if (alarm.AlarmCate.Contains("开关"))
            {
                string value = getValue(alarm.AlarmCate, alarm.AlarmValue);
                result = String.Format(kg, alarm.AlarmState, value, subString(alarm.Company, 9-value.Length));
            }
            else
            {
                string content = alarm.AlarmState + "级" + (alarm.AlarmCate.Contains("温度") ? "温度" : alarm.AlarmCate) + " " + (alarm.AlarmCate.Contains("温度") ? alarm.AlarmValue + "℃" : "");
                result = "【"+company+"】您有一条信息通知：" + content + "，请及时处理。如有疑问，联系管理员。";
            }
            return result; 
        }

        private static string getValue(string alarmCate, double? value)
        {
            string result=value+"";
            if (value != null)
            {
                double v = (double)value;
                if (v < 1000 && v>10)
                {
                   result= v.ToString("0.0");
                }
                else if (v >= 1000)
                {
                   result = (int)v + "";
                }
            }
            if (alarmCate.Contains("水") || alarmCate.Contains("开关") || alarmCate.Contains("烟"))
                result = value == 0 ? "分" : "合";
            return result;
        }

        private static string subString(string str, int count)         
        {
            if (count <= 0) return "";
            if (str.Length <= count)
                return str;
            else
            {
                return str.Substring(0, count);
            }
        }
    }
}