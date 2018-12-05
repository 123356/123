using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using YWWeb.PubClass;
using System.Collections.Specialized;
using Yunpian.conf;
using Yunpian.lib;
using Yunpian.model;

namespace YWWeb.Controllers
{
    public class WxController : Controller
    {
        //
        // GET: /App/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();

        private string getSessionID()
        {
            string sessionid = "";
            if (Request.Headers["Cookie"] != null)
            {
                sessionid = Request.Headers["Cookie"].ToString();
                //sessionid = sessionid.Substring(sessionid.IndexOf('_') + 1);
                //sessionid = sessionid.Substring(sessionid.IndexOf('=') + 1);
                sessionid = sessionid.Replace(';', '&').Replace(" ", "");
                NameValueCollection query = HttpUtility.ParseQueryString(sessionid, Encoding.GetEncoding("gb2312"));
                sessionid = query["ASP.NET_SessionId"];
            }
            return sessionid;
        }

        public ActionResult wxLogin(string code)
        {
            try
            {
                OpenIdResult openIdResult = getOpenIdBean(code);
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.openid == openIdResult.openid && u.IsScreen == 0).ToList();
                if (list.Count > 0)
                {
                    Session["Huerinfo"] = list[0];
                    string sID = Session.SessionID;
                    Session[sID] = list[0];
                    Common.InsertLog("App用户登录", list.First().UserName, "App用户登录[" + list.First().UserName + "]");
                    return Content(JsonConvert.SerializeObject(new LoginBean(sID, list[0])));
                }
                else
                {
                    List<t_CM_UserInfo> list22 = bll.t_CM_UserInfo.Where(u => u.openid == openIdResult.openid).ToList();//注册且未通过
                    if (list22 != null && list22.Count > 0)
                    {
                        return Content("微信号未通过审核");
                    } return Content("微信号未注册");
                }
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        public ActionResult wxLogin2(string code)
        {
            try
            {
                OpenIdResult openIdResult = getOpenIdBean2(code);
                t_CM_UserInfo model = bll.t_CM_UserInfo.Where(u => u.openid2 == openIdResult.openid).FirstOrDefault();
                if (model!=null)
                {
                    if (model.IsScreen == 0)
                    {
                        Session["Huerinfo"] = model;
                        string sID = Session.SessionID;
                        Session[sID] = model;
                        Common.InsertLog("App用户登录", model.UserName, "App用户登录[" + model.UserName + "]");
                        return Content(sID);
                    }else
                    {
                        return Content("1");
                    }
                }
                else
                {
                       return Content("0");
                }
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }

        public ActionResult wxLoginBg(string code)
        {
            try
            {
                OpenIdResult openIdResult = getOpenIdBeanBg(code);
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.openid_bg == openIdResult.openid && u.IsScreen == 0).ToList();
                if (list.Count > 0)
                {
                    Session["Huerinfo"] = list[0];
                    string sID = Session.SessionID;
                    Session[sID] = list[0];
                    Common.InsertLog("App用户登录", list.First().UserName, "App用户登录[" + list.First().UserName + "]");
                    return Content(JsonConvert.SerializeObject(new LoginBean(sID, list[0])));
                }
                else
                {
                    List<t_CM_UserInfo> list22 = bll.t_CM_UserInfo.Where(u => u.openid_bg == openIdResult.openid).ToList();//注册且未通过
                    if (list22 != null && list22.Count > 0)
                    {
                        return Content("微信号未通过审核");
                    } return Content("微信号未注册");
                }
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        public ActionResult wxLoginBogaoClient(string code)
        {
            try
            {
                OpenIdResult openIdResult = getOpenIdBeanBg2(code);
                List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.openid_bg2 == openIdResult.openid && u.IsScreen == 0).ToList();
                if (list.Count > 0)
                {
                    Session["Huerinfo"] = list[0];
                    string sID = Session.SessionID;
                    Session[sID] = list[0];
                    Common.InsertLog("App用户登录", list.First().UserName, "App用户登录[" + list.First().UserName + "]");
                    return Content(sID);
                }
                else
                {
                    List<t_CM_UserInfo> list22 = bll.t_CM_UserInfo.Where(u => u.openid_bg2 == openIdResult.openid).ToList();//注册且未通过
                    if (list22 != null && list22.Count > 0)
                    {
                        return Content("微信号未通过审核");
                    } return Content("微信号未注册");
                }
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }

        //能云运维 小程序
        private OpenIdResult getOpenIdBean(string code)
        {
            //https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
            string result = HttpUtils.Post("https://api.weixin.qq.com/sns/jscode2session", new Dictionary<string, string>() { { "appid", "wx5e75691d252c30fd" }, { "secret", "8989e0eb37c9e5a2af0fb1a675d5f18a" }, { "js_code", code }, { "grant_type", "authorization_code" } });
            return JsonConvert.DeserializeObject<OpenIdResult>(result);
        }
        //能云客户端 小程序
        private OpenIdResult getOpenIdBean2(string code)
        {
            //https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
            string result = HttpUtils.Post("https://api.weixin.qq.com/sns/jscode2session", new Dictionary<string, string>() { { "appid", "wx8a7ccbb7dcb0a798" }, { "secret", "dfcb20b70da1057eea91850e2d03c9f8" }, { "js_code", code }, { "grant_type", "authorization_code" } });
            return JsonConvert.DeserializeObject<OpenIdResult>(result);
        }
        //博高运维 小程序
        private OpenIdResult getOpenIdBeanBg(string code)
        {
            //https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
            string result = HttpUtils.Post("https://api.weixin.qq.com/sns/jscode2session", new Dictionary<string, string>() { { "appid", "wx34e0efa8def938de" }, { "secret", "32ce2d873bdd08b3a15c742710668707" }, { "js_code", code }, { "grant_type", "authorization_code" } });
            return JsonConvert.DeserializeObject<OpenIdResult>(result);
        }
       
        //博高：能源托管 小程序
        private OpenIdResult getOpenIdBeanBg2(string code)
        {
            //https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
            string result = HttpUtils.Post("https://api.weixin.qq.com/sns/jscode2session", new Dictionary<string, string>() { { "appid", "wx6211df36c3c5fc2a" }, { "secret", "c136669fc743880efba1f40e78537584" }, { "js_code", code }, { "grant_type", "authorization_code" } });
            return JsonConvert.DeserializeObject<OpenIdResult>(result);
        }

        public ActionResult register(string mobilephone, string com, string Name, string code)
        {
            string result = "";
            try
            {
                OpenIdResult x = getOpenIdBean(code);
                string sql = "SELECT * FROM t_CM_UserInfo WHERE Mobilephone='" + mobilephone + "'";
                List<t_CM_UserInfo> list = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                if (list != null && list.Count > 0)
                {
                    bll.ExecuteStoreCommand("UPDATE t_CM_UserInfo SET openid = '" + x.openid + "' WHERE Mobilephone='" + mobilephone + "'");
                    result = "{\"resultCode\": 0,\"results\": \"绑定成功\"}";
                    return Content(result);
                }
                else
                {
                    t_CM_UserInfo obj = new t_CM_UserInfo();
                    obj.UserName = Name;
                    obj.Mobilephone = mobilephone;
                    obj.Company = com;
                    obj.openid = x.openid;
                    obj.UserPassWord = "l/0acXY/ol4=";//原始密码：123；
                    obj.IsScreen = 2;//未通过审核
                    bll.t_CM_UserInfo.AddObject(obj);
                    bll.SaveChanges();
                    result = "{\"resultCode\": 0,\"results\": \"注册成功，未通过审核。\"}";
                    return Content(result);
                }

            }
            catch (Exception e)
            {
                result = "{\"resultCode\": 2,\"results\": \"" + e.Message + "\"}";
                return Content(result);
            }
        }

        public ActionResult register2(string mobilephone, string com, string Name, string code)
        {
            string result = "";
            try
            {
                OpenIdResult x = getOpenIdBean2(code);
                string sql = "SELECT * FROM t_CM_UserInfo WHERE Mobilephone='" + mobilephone + "'";
                List<t_CM_UserInfo> list = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                if (list != null && list.Count > 0)
                {
                    bll.ExecuteStoreCommand("UPDATE t_CM_UserInfo SET openid2 = '" + x.openid + "' WHERE Mobilephone='" + mobilephone + "'");
                    result = "{\"resultCode\": 0,\"results\": \"绑定成功\"}";
                    return Content(result);
                }
                else
                {
                    t_CM_UserInfo obj = new t_CM_UserInfo();
                    obj.UserName = Name;
                    obj.Mobilephone = mobilephone;
                    obj.Company = com;
                    obj.openid2 = x.openid;
                    obj.UserPassWord = "l/0acXY/ol4=";//原始密码：123；
                    obj.IsScreen = 2;//未通过审核
                    bll.t_CM_UserInfo.AddObject(obj);
                    bll.SaveChanges();
                    result = "{\"resultCode\": 0,\"results\": \"注册成功，未通过审核。\"}";
                    return Content(result);
                }

            }
            catch (Exception e)
            {
                result = "{\"resultCode\": 2,\"results\": \"" + e.Message + "\"}";
                return Content(result);
            }
        }

        public ActionResult registerBg(string mobilephone, string com, string Name, string code)
        {
            string result = "";
            try
            {
                OpenIdResult x = getOpenIdBeanBg(code);
                string sql = "SELECT * FROM t_CM_UserInfo WHERE Mobilephone='" + mobilephone + "'";
                List<t_CM_UserInfo> list = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                if (list != null && list.Count > 0)
                {
                    bll.ExecuteStoreCommand("UPDATE t_CM_UserInfo SET openid_bg = '" + x.openid + "' WHERE Mobilephone='" + mobilephone + "'");
                    result = "{\"resultCode\": 0,\"results\": \"绑定成功\"}";
                    return Content(result);
                }
                else
                {
                    t_CM_UserInfo obj = new t_CM_UserInfo();
                    obj.UserName = Name;
                    obj.Mobilephone = mobilephone;
                    obj.Company = com;
                    obj.openid_bg = x.openid;
                    obj.UserPassWord = "l/0acXY/ol4=";//原始密码：123；
                    obj.IsScreen = 2;//未通过审核
                    bll.t_CM_UserInfo.AddObject(obj);
                    bll.SaveChanges();
                    result = "{\"resultCode\": 0,\"results\": \"注册成功，未通过审核。\"}";
                    return Content(result);
                }

            }
            catch (Exception e)
            {
                result = "{\"resultCode\": 2,\"results\": \"" + e.Message + "\"}";
                return Content(result);
            }
        }
        public ActionResult registerBg2(string mobilephone, string com, string Name, string code)
        {
            string result = "";
            try
            {
                OpenIdResult x = getOpenIdBeanBg2(code);
                string sql = "SELECT * FROM t_CM_UserInfo WHERE Mobilephone='" + mobilephone + "'";
                List<t_CM_UserInfo> list = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
                if (list != null && list.Count > 0)
                {
                    bll.ExecuteStoreCommand("UPDATE t_CM_UserInfo SET openid_bg2 = '" + x.openid + "' WHERE Mobilephone='" + mobilephone + "'");
                    result = "{\"resultCode\": 0,\"results\": \"绑定成功\"}";
                    return Content(result);
                }
                else
                {
                    t_CM_UserInfo obj = new t_CM_UserInfo();
                    obj.UserName = Name;
                    obj.Mobilephone = mobilephone;
                    obj.Company = com;
                    obj.openid_bg2 = x.openid;
                    obj.UserPassWord = "l/0acXY/ol4=";//原始密码：123；
                    obj.IsScreen = 2;//未通过审核
                    bll.t_CM_UserInfo.AddObject(obj);
                    bll.SaveChanges();
                    result = "{\"resultCode\": 0,\"results\": \"注册成功，未通过审核。\"}";
                    return Content(result);
                }

            }
            catch (Exception e)
            {
                result = "{\"resultCode\": 2,\"results\": \"" + e.Message + "\"}";
                return Content(result);
            }
        }
        public ActionResult getUserInfo()
        {
                string sid = getSessionID();
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                    return Content(JsonConvert.SerializeObject(user));
                }
                return Content("");
        }

        //根据用户获取峰谷平电量；
        [Login]
        public ActionResult getPowerRatePeak(int uid)
        {
            try
            {
                //本月电量，上月电量；今年电量；本月电费峰谷平，本月电量峰谷平；
                List<t_ES_UserUsePowerMonthly> list = bll.t_ES_UserUsePowerMonthly.Where(p => p.UID == uid).ToList();
                DateTime now = DateTime.Now;
                DateTime start = TimeUtils.getThisMonthFirstDay(now);
                string thisMonth = "SELECT * FROM t_ES_UserUsePowerMonthly WHERE UID=" + uid + " AND RecordTime>='" + start + "'" + " AND RecordTime<='"+now+"'";
                List<UsePower> thisM = bll.ExecuteStoreQuery<UsePower>(thisMonth).ToList();
                Consumption thisMonthC = getConsumption(thisM);

                start = TimeUtils.getLastMonthFirstDay(now);
                DateTime end = TimeUtils.getLastMonthLastDay(now);
                string lastMonth = "SELECT * FROM t_ES_UserUsePowerMonthly WHERE UID=" + uid + " AND RecordTime>='" + start + "'" + " AND RecordTime<='" + end + "'";
                List<UsePower> lastM = bll.ExecuteStoreQuery<UsePower>(lastMonth).ToList();
                Consumption lastMonthC = getConsumption(lastM);

                start = TimeUtils.getThisYearFirstDay(now);
                end = TimeUtils.getThisMonthFirstDay(now);
                string thisYear = "SELECT * FROM t_ES_UserUsePowerYearly WHERE UID=" + uid + " AND RecordTime>='" + start + "'" + " AND RecordTime<'" + end + "'";
                List<UsePower> thisY = bll.ExecuteStoreQuery<UsePower>(thisYear).ToList();
                Consumption thisYearC = getConsumption(getAll(thisY,thisM));

                return Content(JsonConvert.SerializeObject(new ReturnBean<ConsumptionBean>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, new ConsumptionBean(thisMonthC, lastMonthC, thisYearC))));
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "获取失败:" + e.Message)));
            }
        }

        private List<UsePower> getAll(List<UsePower> thisY, List<UsePower> thisM)
        {
            if (thisY != null)
            {
                thisY.AddRange(thisM);
                return thisY;
            }
            if (thisM != null)
            {
                thisM.AddRange(thisY);
                return thisM;
            }
            return null;
        }

        private Consumption getConsumption(List<UsePower> userPowerList)
        {
            if(userPowerList==null||userPowerList.Count<1) return null;
            decimal flatRate=0, peakRate=0, peakPeakRate=0, valleyRate=0,flat=0, peak=0, peakPeak=0, valley=0;
            for (int i = 0; i < userPowerList.Count;i++ )
            {
                UsePower m = userPowerList[i];
                if (m.UserPowerFlat != null)
                    flat += (decimal)m.UserPowerFlat;
                if (m.UserPowerPeak != null)
                    peak += (decimal)m.UserPowerPeak;
                if (m.UserPowerPeakPeak != null)
                    peakPeak += (decimal)m.UserPowerPeakPeak;
                if (m.UserPowerValley != null)
                    valley += (decimal)m.UserPowerValley;
                if (m.UserPowerRateFlat != null)
                    flatRate += (decimal)m.UserPowerRateFlat;
                if (m.UserPowerRatePeak != null)
                    peakRate += (decimal)m.UserPowerRatePeak;
                if (m.UserPowerRatePeakPeak != null)
                    peakPeakRate += (decimal)m.UserPowerRatePeakPeak;
                if (m.UserPowerRateValley != null)
                    valleyRate += (decimal)m.UserPowerRateValley;
            }
            return new Consumption(peak, valley, flat, peakPeak,peakRate, valleyRate, flatRate, peakPeakRate); 
        }

        [Login]
        public ActionResult getPlanById(int id)
        {
            try
            {
                List<t_ES_UsePlan> list = bll.t_ES_UsePlan.Where(p => p.id == id).ToList();
                return Content(JsonConvert.SerializeObject(new ReturnBean<t_ES_UsePlan>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, list.First())));
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "获取失败:" + e.Message)));
            }
        }
        //first_week,second_week,third_week,fourth_week,change_time,change_remark,change_plan
        [Login]
        public ActionResult savePlan(int id,float change_plan,float first_week=0,float second_week=0,float third_week=0,float fourth_week=0,string change_remark="")
        {
            try
            {
                DateTime change_time = DateTime.Now;
                string sql = "UPDATE t_ES_UsePlanChange SET  ";
                sql += " change_plan =" + change_plan;
                if (first_week > 0)
                {
                    sql += " , first_week=" + first_week;
                }
                if (second_week > 0)
                {
                    sql += " , second_week=" + second_week;
                }
                if (third_week > 0)
                {
                    sql += " , third_week=" + third_week;
                }
                if (fourth_week > 0)
                {
                    sql += " , fourth_week=" + fourth_week;
                }
                if (!string.IsNullOrEmpty(change_remark))
                {
                    sql += " , change_remark='" + change_remark+"'";
                }
                sql += " , change_time='" + change_time + "'";
                sql += " WHERE id=" + id;
                bll.ExecuteStoreCommand(sql);
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, "更新成功")));
            }
            catch(Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "更新失败:"+e.Message)));
            }
        }
        public ActionResult getRooms(int uid=0)
        {

            try
            {

                string sid = getSessionID();
                string strJson = "";
                string pdrlist = "";
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                    if (user == null) return Content("{\"resultCode\": 1,\"results\": []}");
                    //pdrlist = user.PDRList;

                    var pr= bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault();
                    if (pr != null)
                        pdrlist = pr.PDRList;
                    List<int> listid = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
                    List<t_CM_PDRInfo> list = getPDRinfos(pdrlist, user);
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
                            string[] NandS = { "", "" };
                            if (model.Coordination != null)
                            {
                                NandS = model.Coordination.Split('|');
                                string latitude = "0", longtitude = "0";
                                if (NandS.Length > 1)
                                {
                                    latitude = NandS[0].ToString();
                                    longtitude = NandS[1].ToString();
                                }
                                string statusname = "正常";
                                if (getAlarmState == 1)
                                    statusname = "关注";
                                else if (getAlarmState == 2)
                                    statusname = "预警";
                                else if (getAlarmState == 3)
                                    statusname = "报警";
                                if (getAlarmState <= 0)
                                {
                                    
                                    if (strJson.Equals(""))
                                    {
                                        strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                    }
                                    else
                                    {
                                        strJson = strJson + ", {\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                    }
                                }
                                else
                                {
                                    if (strJson.Equals(""))
                                    {
                                        strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                    }
                                    else
                                    {
                                        strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\""+ "}," + strJson;
                                    }

                                }
                            }
                            else
                            {
                                strJson += "";
                            }
                        }
                        strJson = strJson.TrimEnd(',');
                        strJson = "{\"resultCode\": 0,\"results\":[" + strJson + "]}";
                    }
                }
                else
                    strJson = "{\"resultCode\": 1,\"results\": []}";
                return Content(strJson);
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": []}");
            }
        }

        private List<t_CM_PDRInfo> getPDRinfos(string pdrlist, t_CM_UserInfo user)
        {
            List<t_CM_PDRInfo> list;
            if ("admin".Equals(user.UserName))
            {
                list = bll.t_CM_PDRInfo.ToList();
            }
            else
            {
                string pdrSQL = "SELECT * FROM t_CM_PDRInfo WHERE pid in (" + pdrlist + ")";
                list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(pdrSQL).ToList();
            }
            return list;
        }

        public ActionResult getAlarmList(int pid)
        {
            try
            {
                string sid = getSessionID();
                string strJson = "";
                string pdrlist = "";
                List<AlarmBean> alarmList = new List<AlarmBean>();
                int resultCode = 0;
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                    if (user == null) return Content("{\"resultCode\": 1,\"results\": []}");
                    pdrlist = HomeController.GetPID(user.UNITList);
                    //pdrlist = user.PDRList;
                    string sql = "SELECT * FROM t_AlarmTable_en WHERE pid in (" + pdrlist + ") and pid =" + pid + " order by  AlarmDateTime desc";
                    List<t_AlarmTable_en> alarm = bll.ExecuteStoreQuery<t_AlarmTable_en>(sql).Take(20).ToList();
                    if (alarm != null && alarm.Count > 0)
                    {

                        for (int i = 0; i < alarm.Count; i++)
                        {
                            alarmList.Add(new AlarmBean(alarm[i]));
                        }
                        resultCode = 0;
                        //strJson = "{\"resultCode\": 0,\"results\":" + JsonConvert.SerializeObject(alarmList) + "}";
                    }
                    else
                    {
                        //strJson = "{\"resultCode\": 0,\"results\": []}";
                        resultCode = 0;
                    }
                }
                else
                    resultCode = 1;
                //strJson = "{\"resultCode\": 1,\"results\": []}";
                return Json(new { resultCode = resultCode, results = alarmList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": []}");
            }
        }

        public ActionResult searchRoom2(string pname)
        {
            try
            {
                string UserName;
                string strJson = "";
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;

                        string pdrlist = HomeController.GetPID(user.UNITList);
                        //SELECT * FROM t_CM_PDRInfo where (Name like '%2%') and PID in (1,2,3,4,5,6,7,8,9)
                        string sql = "SELECT * FROM t_CM_PDRInfo where (Name like '%" + pname + "%')  and PID in (" + pdrlist + ")";
                        List<t_CM_PDRInfo> list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sql).ToList();

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
                                string[] NandS = { "", "" };
                                if (model.Coordination != null)
                                {
                                    NandS = model.Coordination.Split('|');
                                    string latitude = "0", longtitude = "0";
                                    if (NandS.Length > 1)
                                    {
                                        latitude = NandS[0].ToString();
                                        longtitude = NandS[1].ToString();
                                    }
                                    string statusname = "正常";
                                    if (getAlarmState == 1)
                                        statusname = "关注";
                                    else if (getAlarmState == 2)
                                        statusname = "预警";
                                    else if (getAlarmState == 3)
                                        statusname = "报警";
                                    if (getAlarmState < 1)
                                    {

                                        if (strJson.Equals(""))
                                        {
                                            strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                        }
                                        else
                                        {
                                            strJson = strJson + ", {\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                        }
                                    }
                                    else
                                    {
                                        string sql2 = "SELECT * FROM t_AlarmTable_en WHERE pid =" + model.PID + " order by  AlarmState desc";
                                        List<t_AlarmTable_en> alarm = bll.ExecuteStoreQuery<t_AlarmTable_en>(sql2).ToList();
                                        if (strJson.Equals(""))
                                        {
                                            strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"alarmbean\":" + JsonConvert.SerializeObject(alarm) + ",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                        }
                                        else
                                        {
                                            strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"alarmbean\":" + JsonConvert.SerializeObject(alarm) + ",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}," + strJson;
                                        }
                                    }
                                }
                                else
                                {
                                    strJson += "";
                                }
                            }
                            strJson = strJson.TrimEnd(',');
                            strJson = "{\"resultCode\": 0,\"results\":[" + strJson + "]}";
                            return Content(strJson);
                        }else
                        {
                            return Content("{\"resultCode\": 1,\"results\": []}");
                        }
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        public ActionResult getRooms2(int uid=0)
        {
            try
            {
                string sid = getSessionID();
                string strJson = "";
                string pdrlist = "";
                if (sid != null && sid != "")
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                    if (user == null) return Content("{\"resultCode\": 1,\"results\": []}");
                    //pdrlist = user.PDRList;
                    var pr = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault();
                    if (pr != null)
                        pdrlist = pr.PDRList;
                    List<int> listid = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
                    List<t_CM_PDRInfo> list = getPDRinfos(pdrlist, user);
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
                            string[] NandS = { "", "" };
                            if (model.Coordination != null)
                            {
                                NandS = model.Coordination.Split('|');
                                string latitude = "0", longtitude = "0";
                                if (NandS.Length > 1)
                                {
                                    latitude = NandS[0].ToString();
                                    longtitude = NandS[1].ToString();
                                }
                                string statusname = "正常";
                                if (getAlarmState == 1)
                                    statusname = "关注";
                                else if (getAlarmState == 2)
                                    statusname = "预警";
                                else if (getAlarmState == 3)
                                    statusname = "报警";
                                if (getAlarmState < 1)
                                {

                                    if (strJson.Equals(""))
                                    {
                                        strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                    }
                                    else
                                    {
                                        strJson = strJson + ", {\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                    }
                                }
                                else
                                {
                                    string sql = "SELECT * FROM t_AlarmTable_en WHERE pid =" + model.PID + "  AND AlarmState>0 AND AlarmState<4 AND AlarmConfirm='未确认' order by  AlarmState desc";
                                    List<t_AlarmTable_en> alarm = bll.ExecuteStoreQuery<t_AlarmTable_en>(sql).ToList();
                                    if (strJson.Equals(""))
                                    {
                                        strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"alarmbean\":" + JsonConvert.SerializeObject(alarm) + ",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}";
                                    }
                                    else
                                    {
                                        strJson = "{\"PID\":" + model.PID + ",\"Name\":\"" + model.Name + "\",\"alarmbean\":" + JsonConvert.SerializeObject(alarm) + ",\"status\":\"" + getAlarmState + "\"," + "\"statusname\":\"" + statusname + "\"" + "}," + strJson;
                                    }

                                }
                            }
                            else
                            {
                                strJson += "";
                            }
                        }
                        strJson = strJson.TrimEnd(',');
                        strJson = "{\"resultCode\": 0,\"results\":[" + strJson + "]}";
                    }
                }
                else
                    strJson = "{\"resultCode\": 1,\"results\": []}";
                return Content(strJson);
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": []}");
            }
        }

        private t_CM_UserInfo isLogin()
        {
            string sid = getSessionID();
            if (sid != null && sid != "")
            {
                return (t_CM_UserInfo)Session[sid];
            }
            else
            {
                return null;
            }
        }
        public ActionResult getPDRState(int pid)
        {

            try
            {
                string sid = getSessionID();
                string pdrlist;
                if (sid != null && sid != "")
                {
                    int HiPoTagID;
                    string Coordination="";
                    string HiPoTagName;
                    string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                    string nextMonitorTime, lastMonitorTime, activePower, reactivePower, maxTemperature, load, maxTemp, lastRepairTime;//environmentTemperature, environmentHumidity,
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                    //pdrlist = user.PDRList;
                    pdrlist = HomeController.GetPID(user.UNITList);
                    string strAsql = "select top 1 * from t_AlarmTable_en where AlarmState>0 and pid=" + pid + "and pid in (" + pdrlist + ") order by AlarmState desc,AlarmValue desc"; //判断是否存在报警数据
                    List<t_AlarmTable_en> alist = bll.ExecuteStoreQuery<t_AlarmTable_en>(strAsql).ToList();
                    string strsql = "select top 1 *  from V_DeviceInfoState_PDR1 where PID=" + pid + "and pid in (" + pdrlist + ") and DataTypeID=1 order by PV desc,TagID";                 //获取配电房最高温度的点的TagID，之前需检查有无报警点
                    List<V_DeviceInfoState_PDR1> PDRlist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                    //string his = "";
                    int AlarmState = 0;
                    t_AlarmTable_en AlarmPDR=null;
                    if (alist.Count > 0)
                    {
                        AlarmPDR = alist.First();
                        HiPoTagID = (int)AlarmPDR.TagID;
                        HiPoTagName = AlarmPDR.AlarmArea;
                        AlarmState = Convert.ToInt32(alist[0].AlarmState);
                    }
                    else
                    {
                        AlarmState = 0;
                    }
                    //string tempStr = getRealTimeData(pid);
                    RoomInfo info = GetMaxTempInfo(pid);
                    //reactivePower；
                    string sql = "SELECT * FROM [t_PM_Order] WHERE 1=1 AND (OrderState=0 or OrderState=1 or OrderState=2 or OrderState=3) and PID=" + pid + " and PlanDate>'" + DateTime.Now.ToString() + "' order by PlanDate";
                    List<t_PM_Order> listUn = bll.ExecuteStoreQuery<t_PM_Order>(sql).ToList();
                    string finishSql = "SELECT * FROM [t_PM_Order] WHERE 1=1 AND OrderState=4 and PID=" + pid + " and CheckDate<'" + DateTime.Now.ToString() + "' order by CheckDate desc";
                    List<t_PM_Order> listFinish = bll.ExecuteStoreQuery<t_PM_Order>(finishSql).ToList();

                    string repairSql = "SELECT * FROM [t_PM_Order] WHERE 1=1 AND OrderState=4 and PID=" + pid + " and  RepairDID!='' and CheckDate<'" + DateTime.Now.ToString() + "' order by CheckDate desc";
                    List<t_PM_Order> listRepair = bll.ExecuteStoreQuery<t_PM_Order>(repairSql).ToList();

                    string strPDRinfosql = "select  *  from t_CM_PDRInfo where PID = " + pid;                 //获取配电房的信息
                    List<t_CM_PDRInfo> PDRinfolist = bll.ExecuteStoreQuery<t_CM_PDRInfo>(strPDRinfosql).ToList();
                    t_CM_PDRInfo PDRinfo = PDRinfolist.First();
                    Coordination = PDRinfo.Coordination;
                    string address= PDRinfo.Position;
                    if (listUn != null && listUn.Count > 0)
                    {
                        nextMonitorTime = listUn.First().PlanDate.ToString();
                    }
                    else
                    {
                        nextMonitorTime = "";
                    }
                    if (listFinish != null && listFinish.Count > 0)
                    {
                        lastMonitorTime = listFinish.First().CheckDate.ToString();
                    }
                    else
                    {
                        lastMonitorTime = "";
                    }
                    if (listRepair != null && listRepair.Count > 0)
                    {
                        lastRepairTime = listRepair.First().CheckDate.ToString();
                    }
                    else
                    {
                        lastRepairTime = "";
                    }
                    string statusStr = "";
                    switch (AlarmState)
                    {
                        case 0:
                            statusStr = "正常";
                            break;
                        case 1:
                            statusStr = "关注";
                            break;
                        case 2:
                            statusStr = "预警";
                            break;
                        default:
                            statusStr = "报警";
                            break;
                    }
                    return Content("{\"resultCode\": 0, \"results\": {\"pid\": \"" + pid + "\"," + "\"Coordination\": \"" + Coordination + "\"," + "\"address\": \"" + address + "\"," + "\"status\": \"" + AlarmState + "\"," + "\"statusStr\":\"" + statusStr + "\",\"activePower\": \""
                + "--\",\"reactivePower\": \"--\",\"lastRepairTime\": \""
                + lastRepairTime + "\"," + "\"pdname\":\"" + PDRinfo.Name + "\","
                + "\"nextMonitorTime\": \"" + nextMonitorTime
                + "\",\"lastMonitorTime\": \"" + lastMonitorTime + "\",\"roomInfo\": "
                + JsonConvert.SerializeObject(info) +",\"alarmInfo\": "+JsonConvert.SerializeObject(AlarmPDR)+
                "}}");
                }
                else
                {
                    return Content("{\"resultCode\": 1,\"results\": {}}");
                }
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }


        //获取客户端小程序的站 安全监测评分。
        public ActionResult getRoomScore(int pid)
        {

            try
            {
                if (isLogin() != null)
                {
                    string sql = "SELECT t_CM_InstallRecord.id as rid, t_CM_InstallRecord.*,t_CM_InstallType.id as cid,t_CM_InstallType.* FROM t_CM_InstallRecord,t_CM_InstallType WHERE pid=" + pid + " AND contentId=t_CM_InstallType.id ORDER BY cid";
                    List<MonitorContent> listM = bll.ExecuteStoreQuery<MonitorContent>(sql).ToList();
                    return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(listM) + "}");
                }
                else
                {
                    return Content("{\"resultCode\": 1,\"results\": {}}");
                }
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        private DateTime FirstDayOfMonth(DateTime datetime)
        {
            return datetime.AddDays(1 - datetime.Day);
        }

        //获取当日累计，当月累计：
        public ActionResult getRoomAddUp(int pid)
        {

            try
            {
                if (isLogin() != null)
                {
                    string sql = "SELECT * FROM t_EE_PowerQualityDaily WHERE RecordTime>='"+DateTime.Now.Date.ToString()+"' AND PID="+pid;
                    List<t_EE_PowerQualityDaily> plist = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(sql).ToList();
                    string sqlm = "SELECT * FROM t_EE_PowerQualityMonthly WHERE RecordTime>='" + FirstDayOfMonth(DateTime.Now).Date.ToString() + "' AND PID=" + pid;
                    List<t_EE_PowerQualityMonthly> mlist = bll.ExecuteStoreQuery<t_EE_PowerQualityMonthly>(sqlm).ToList();
                    double dayAll = 0;
                    double monAll = 0;
                    if (plist != null && plist.Count>0)
                        for (int i = 0; i < plist.Count;i++ )
                        {
                            if (plist[i].UsePower != null)
                                dayAll += (double)plist[i].UsePower;
                        }
                    if (mlist != null && mlist.Count > 0)
                        for (int i = 0; i < mlist.Count; i++)
                        {
                            if (mlist[i].UsePower != null)
                                monAll += (double)mlist[i].UsePower;
                        }
                    return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(new AddAll(dayAll, monAll)) + "}");
                }
                else
                {
                    return Content("{\"resultCode\": 1,\"results\": {}}");
                }
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }
        public t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
        //列出合同列表；
        public ActionResult LoadConstractDatas(string CtrName="",int CType=-1,int isOK=-1)
        {
            try
            {
                string sql = "";
                if (CurrentUser.RoleID == 1){
                    sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID";
                    if (CType > 0)
                    {
                        sql += " where t_CM_Constract.Type="+CType;
                    }
                    sql += " ORDER BY createDate DESC,id DESC";
                }   
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
                    sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID where 1=1";
                    if (CType > 0)
                        sql += " and t_CM_Constract.Type=" + CType + " and t_CM_Constract.AddUserID IN(" + str + ")  ORDER BY createDate DESC,id DESC";
                    else
                        sql += " and t_CM_Constract.AddUserID IN(" + str + ")  ORDER BY createDate DESC,id DESC";
                }
                List<Constract> list = bll.ExecuteStoreQuery<Constract>(sql).ToList();
                if (isOK >= 0)
                {
                    for (int i = 0; i < list.Count; i++)
                    {
                        string ss = "SELECT * FROM t_ES_ContractTemplet WHERE conid =" + list[i].id + "  AND IsOk=1";
                        List<t_ES_ContractTemplet> lls = bll.ExecuteStoreQuery<t_ES_ContractTemplet>(ss).ToList();
                        if (lls != null && lls.Count > 0)
                        {
                            list[i].isOk = 1;
                        }
                        else
                        {
                            list[i].isOk = 0;
                        }
                    }
                    list = list.Where(c => c.isOk==isOK).ToList();
                }
                if (!string.IsNullOrEmpty(CtrName))
                {
                    list = list.Where(c => c.CtrName.ToLower().Contains(CtrName.ToLower())).ToList();
                }
                return Content(Common.List2Json(list));
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        public ActionResult updateTempletInfo(int id,string remark)
        {
            try
            {
                string sql = "UPDATE t_ES_ContractTemplet SET Remark='"+remark+"' WHERE ID="+id;
                bll.ExecuteStoreCommand(sql);
                return Content(JsonConvert.SerializeObject(new ReturnBean<t_ES_ContractTempletI>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, null)));
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_EX, Cons.MSG_EX, null)));
            }
        }
        //根据事项id 获取事项内容；
        public ActionResult LoadTempletInfo(int id)
        {
            try
            {
                string sql = "SELECT a.*,b.CtrName,b.ConNo,c.UserName FROM t_ES_ContractTemplet a INNER JOIN t_CM_Constract b ON a.conid=b.id  AND a.ID="+id+" INNER JOIN t_CM_UserInfo c ON b.AddUserID=c.UserID";
                t_ES_ContractTempletI templetI = bll.ExecuteStoreQuery<t_ES_ContractTempletI>(sql).ToList().First();
                string sqlImages = "SELECT * FROM t_cm_files WHERE Fk_ID="+id+" AND Modules='YunYingConstract' AND (FileExtension LIKE '%png%' OR FileExtension LIKE '%jpg%')";
                List<t_cm_files> images = bll.ExecuteStoreQuery<t_cm_files>(sqlImages).ToList();
                templetI.images=images;
                return Content(JsonConvert.SerializeObject(new ReturnBean<t_ES_ContractTempletI>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, templetI)));
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_EX, Cons.MSG_EX, null)));
            }
        }
        //根据合同id 获取事项列表
        public ActionResult LoadConstractInfo(int id)
        {
            try
            {
                if (isLogin() != null)
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[getSessionID()];
                    string sql="SELECT a.*,b.CtrName,b.ConNo,c.UserName FROM t_ES_ContractTemplet a INNER JOIN t_CM_Constract b ON a.conid=b.id  AND b.id ="+id+" INNER JOIN t_CM_UserInfo c ON b.AddUserID=c.UserID";
                    List<t_ES_ContractTempletI> list = bll.ExecuteStoreQuery<t_ES_ContractTempletI>(sql).ToList();
                    string sqlFiles = "SELECT * FROM t_cm_files WHERE Fk_ID IN (SELECT ID FROM t_ES_ContractTemplet WHERE conid="+id+") AND Modules='YunYingConstract' AND FileExtension LIKE '%doc%'";
                    List<t_cm_files> files = bll.ExecuteStoreQuery<t_cm_files>(sqlFiles).ToList();
                    ConInfo info= new ConInfo(list, files);
                    return Content(JsonConvert.SerializeObject(new ReturnBean<ConInfo>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, info)));
                }
                return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_EX, Cons.MSG_EX, null)));
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_EX, Cons.MSG_EX, null)));
            }
        }

        //根据当前用户，获取未完成事项；
        public ActionResult getContractTask()
        {
            try
            {
                if (isLogin() != null)
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[getSessionID()];
                    string sql;
                    DateTime now = DateTime.Now;
                    if (Convert.ToBoolean(user.IsAdmin))
                    {
                        sql = "SELECT t_ES_ContractTemplet.*,t_CM_Constract.CtrName,t_CM_Constract.ConNo,t_CM_UserInfo.UserName \n" +
            "FROM t_ES_ContractTemplet,t_CM_Constract,t_CM_UserInfo \n" +
            "WHERE t_ES_ContractTemplet.conid=t_CM_Constract.id \n" +
            "AND  t_ES_ContractTemplet.PersonID=t_CM_UserInfo.UserID\n" +
            "AND IsOk=0\n" +
            "AND t_ES_ContractTemplet.StartTime<='" + now.AddDays(7) + "'" +
            "ORDER BY CreatTime DESC"; 
                    }
                    else
                    {
                        sql = "SELECT t_ES_ContractTemplet.*,t_CM_Constract.CtrName,t_CM_Constract.ConNo,t_CM_UserInfo.UserName \n" +
            "FROM t_ES_ContractTemplet,t_CM_Constract,t_CM_UserInfo \n" +
            "WHERE t_ES_ContractTemplet.conid=t_CM_Constract.id \n" +
            "AND t_ES_ContractTemplet.conid IN (SELECT id from t_CM_Constract WHERE AddUserID='"+user.UserID+"')\n" +
            "AND  t_ES_ContractTemplet.PersonID=t_CM_UserInfo.UserID\n" +
            "AND IsOk=0\n" +
            "AND t_ES_ContractTemplet.StartTime<='" + now.AddDays(7) + "'" +
            "ORDER BY CreatTime DESC";               
                    }
                    List<t_ES_ContractTempletI> list = bll.ExecuteStoreQuery<t_ES_ContractTempletI>(sql).ToList();
                    ConInfo info = new ConInfo(list, null);
                    return Content(JsonConvert.SerializeObject(new ReturnBean<ConInfo>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, info)));
                }
                return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_EX, Cons.MSG_EX, null)));
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_EX, Cons.MSG_EX, null)));
            }
        }


       //获取博高客户端小程序的站 首页信息：站 实时负荷，负载率，本月电量；上月电量；今年电量；
        public ActionResult getHomeInfo()
        {
            try
            {
                if (isLogin() != null)
                {
                    t_CM_UserInfo user = (t_CM_UserInfo)Session[getSessionID()];

                    string allPower = "--";//站实时负荷      SELECT * FROM t_EE_PowerReportConfig WHERE PID =138 AND cid_type_id=9
                    string minPowerRate = "--";//最小负载率  SELECT * FROM t_EE_PowerReportConfig WHERE PID =138 AND cid_type_id=10
                    string maxPowerRate = "--";//最大负载率  

                    string thismon = "--";//本月电量;SELECT * FROM t_EE_PowerReportConfig WHERE PID =138 AND cid_type_id=2
                    string lastmon = "--";//上月电量;
                    string thisyear = "--";//今年电量；
                    string units = "0";
                    string pdrlist = HomeController.GetPID(user.UNITList);
                    if (!string.IsNullOrEmpty(pdrlist))
                    {
                        string sql = "SELECT * FROM t_CM_Unit WHERE UnitID IN (SELECT DISTINCT t_CM_PDRInfo.UnitID FROM t_CM_PDRInfo WHERE PID IN (" + pdrlist + "))";
                    //string sql = "SELECT * FROM t_CM_Unit";
                        List<t_CM_Unit> list = bll.ExecuteStoreQuery<t_CM_Unit>(sql).ToList();
                        for(int i=0;i<list.Count;i++){
                            units += "," + list[i].UnitID;                      
                        }
                        string[] PDRList= pdrlist.Split(',');
                        for (int j = 0; j < PDRList.Length; j++)
                        {      
                            string pid = PDRList[j];
                            //实时负荷:
                            List<t_EE_PowerReportConfig> config = bll.ExecuteStoreQuery<t_EE_PowerReportConfig>("SELECT * FROM t_EE_PowerReportConfig WHERE PID =" + pid + " AND cid_type_id=9").ToList();
                            if (config != null && config.Count > 0 && !string.IsNullOrEmpty(config.First().cid))
                            {
                                string rr = "SELECT top(1) * FROM t_EE_PowerQualityRealTime WHERE PID =" + pid + " AND RecordTime>='" + DateTime.Now.AddMinutes(-65) + "' and CID IN (" + config.First().cid + ")  ORDER BY RecordTime DESC";
                                List<t_EE_PowerQualityRealTime> ls = bll.ExecuteStoreQuery<t_EE_PowerQualityRealTime>(rr).ToList();
                                if (ls == null || ls.Count < 1) continue;
                                t_EE_PowerQualityRealTime s = ls.First();
                                string aa = "SELECT * FROM t_EE_PowerQualityRealTime WHERE PID =" + pid + " AND RecordTime='" + s.RecordTime + "' and CID IN (" + config.First().cid + ")";
                                List<t_EE_PowerQualityRealTime> RoomPowerInfoList = bll.ExecuteStoreQuery<t_EE_PowerQualityRealTime>(aa).ToList();
                                double pp = 0;
                                for (int i = 0; i < RoomPowerInfoList.Count; i++)
                                {
                                    if (RoomPowerInfoList[i].Power > 0)
                                        pp += (double)RoomPowerInfoList[i].Power;
                                }
                                if (pp > 0)
                                {
                                    allPower = pp + "";
                                }
                            }
                            //实时负载率:
                            config = bll.ExecuteStoreQuery<t_EE_PowerReportConfig>("SELECT * FROM t_EE_PowerReportConfig WHERE PID =" + pid + " AND cid_type_id=10").ToList();
                            if (config != null && config.Count > 0 && !string.IsNullOrEmpty(config.First().cid))
                            {
                                string rr = "SELECT top(1) * FROM t_EE_PowerQualityRealTime WHERE PID =" + pid + " AND RecordTime>='" + DateTime.Now.AddMinutes(-65) + "' and CID IN (" + config.First().cid + ")  ORDER BY RecordTime DESC";
                                List<t_EE_PowerQualityRealTime> ls = bll.ExecuteStoreQuery<t_EE_PowerQualityRealTime>(rr).ToList();
                                if (ls == null || ls.Count < 1) continue;
                                t_EE_PowerQualityRealTime s = ls.First();
                                string bb = "SELECT * FROM t_EE_PowerQualityRealTime WHERE PID =" + pid + " AND RecordTime>='" + s.RecordTime + "' and CID IN (" + config.First().cid + ")";
                                List<t_EE_PowerQualityRealTime> RoomPowerInfoList = bll.ExecuteStoreQuery<t_EE_PowerQualityRealTime>(bb).ToList();
                                double maxP = 0;
                                double minP = 100;
                                Boolean hasMax = false;
                                Boolean hasMin = false;
                                for (int i = 0; i < RoomPowerInfoList.Count; i++)
                                {
                                    if (RoomPowerInfoList[i].PowerRate != null && RoomPowerInfoList[i].PowerRate != -1)
                                    {
                                        
                                        if ((double)RoomPowerInfoList[i].PowerRate >= maxP)
                                        {
                                            hasMax = true;
                                            maxP = (double)RoomPowerInfoList[i].PowerRate;
                                        }
                                        if ((double)RoomPowerInfoList[i].PowerRate <= minP && RoomPowerInfoList[i].PowerRate >= 0)
                                        {
                                            hasMin = true;
                                            minP = (double)RoomPowerInfoList[i].PowerRate;
                                        }
                                    }
                                }
                                if(hasMax){                
                                    maxPowerRate = maxP + "";
                                }
                                if(hasMin){
                                   minPowerRate = minP + "";
                                }
                            }

                         }
                    }
                    //用户用电情况
                    //本月用电量
                    //SELECT * FROM t_ES_UserUsePowerMonthly WHERE UUPID=1 AND RecordTime>='2018-05-01 00:00:00.000' AND RecordTime<='2018-05-31 23:59:59.000' 
                    DateTime startTime = TimeUtils.getThisMonthFirstDay(DateTime.Now);
                    DateTime endTime = DateTime.Now;
                    thismon = getUserPower(units, thismon, startTime, endTime);

                    //上月用电量
                    startTime = TimeUtils.getLastMonthFirstDay(DateTime.Now);
                    endTime = TimeUtils.getLastMonthLastDay(DateTime.Now);
                    lastmon = getUserPower(units, lastmon, startTime, endTime);

                    //今年用电量；
                    startTime = TimeUtils.getThisYearFirstDay(DateTime.Now);
                    endTime = DateTime.Now;
                    List<t_ES_UserUsePowerYearly> yearUsePowerList = bll.ExecuteStoreQuery<t_ES_UserUsePowerYearly>("SELECT * FROM t_ES_UserUsePowerYearly WHERE UID in (" + units+ ") AND RecordTime>='"+startTime+"' AND RecordTime<='" +endTime + "'").ToList();
                    double thisYearUserPower = 0;
                    if (yearUsePowerList != null && yearUsePowerList.Count > 0)
                    {
                        thisyear = "0";
                        for (int i = 0; i < yearUsePowerList.Count; i++)
                        {
                            if (yearUsePowerList[i].UsePower!=null)
                                thisYearUserPower += (double)yearUsePowerList[i].UsePower;
                        }
                        thisYearUserPower += double.Parse(thismon);
                        thisyear = thisYearUserPower + "";
                    }
                    return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, new HomeInfo(thismon, lastmon, thisyear, allPower, minPowerRate, maxPowerRate))));
                }
                else
                {
                    return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_NEED_LOGIN, Cons.MSG_NEED_LOGIN, null)));
                }
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<HomeInfo>(Cons.CODE_EX, Cons.MSG_EX, null)));
            }
        }

        private string getUserPower(string units, string thismon, DateTime startTime, DateTime endTime)
        {
            List<t_ES_UserUsePowerMonthly> usePower = bll.ExecuteStoreQuery<t_ES_UserUsePowerMonthly>("SELECT * FROM t_ES_UserUsePowerMonthly WHERE UID in (" + units + ") AND RecordTime>='" + startTime + "' AND RecordTime<='" + endTime + "'").ToList();
            double thisMonthUserPower = 0;
            if (usePower != null && usePower.Count > 0)
            {
                thismon = "0";
                for (int i = 0; i < usePower.Count; i++)
                {
                    if (usePower[i].UsePower != null)
                    {
                        thisMonthUserPower += (double)usePower[i].UsePower;
                    }
                }
                thismon = thisMonthUserPower + "";
            }
            return thismon;
        }

        //获取客户端小程序的站 安全监测 信息：安全运行多少天，环境温度，湿度，监测点最高温度，站实时负荷，负载率，本月最大负荷，本月最大需量，今年最大负荷。
        public ActionResult getRoomInfo(int pid)
        {

            try
            {
                if (isLogin() != null)
                {
                    string days = "--";//多少天
                    string temp = "--";//环境温度,从配置表取；
                    string hum = "--";//湿度，从配置表取；
                    string MaxPointTemperature = "--";//监测点最高温度
                    string allPower = "--";//站实时负荷
                    string powerRate = "--";//负载率
                    string monPower = "--";//本月最大负荷
                    string monNeed = "--";//本月最大需量
                    string yearPower = "--";//今年最大负荷

                    List<t_CM_Constract> listConstract = bll.ExecuteStoreQuery<t_CM_Constract>("SELECT TOP(1) * FROM t_CM_Constract WHERE CtrPid =" + pid).ToList();
                    if (listConstract!=null&&listConstract.Count>0)
                    {
                        try
                        {
                            DateTime startDate = (DateTime)listConstract.First().start_time;
                            days = DateTime.Now.Subtract(startDate).Duration().Days.ToString();
                        }catch(Exception e){} 
                    }
                    List<t_EE_PowerQualityRealTime> realtimelist = bll.ExecuteStoreQuery<t_EE_PowerQualityRealTime>("SELECT * FROM t_EE_PowerQualityRealTime WHERE PID="+pid+" AND RecordTime>='"+DateTime.Now.AddMinutes(-15)+"'").ToList();
                    double pp = 0;
                    double last = -1;
                    for (int i = 0; i < realtimelist.Count; i++)
                    {
                        if (realtimelist[i].Power > 0)
                            pp +=(double)realtimelist[i].Power;
                        if ((double)realtimelist[i].PowerRate > last)
                        {
                            last = (double)realtimelist[i].PowerRate;
                        }
                    }
                    if (pp > 0)
                    {
                        allPower = pp + "";
                    }                   
                    if (last > 0)
                    {
                        powerRate = last + "";
                    }

                    List<t_EE_PowerQualityRealTime> s2 = bll.ExecuteStoreQuery<t_EE_PowerQualityRealTime>("SELECT TOP(1) * FROM t_EE_PowerQualityRealTime WHERE PID=" + pid + " AND RecordTime>='" + DateTime.Now.AddMinutes(-15) + "' ORDER BY MaxTemperature DESC").ToList();
                    if (s2 != null && s2.Count > 0 && s2[0].MaxTemperature > 0)
                        MaxPointTemperature = s2[0].MaxTemperature+"";

                    List<t_EE_PowerQualityMonthly> Monthlylist = bll.ExecuteStoreQuery<t_EE_PowerQualityMonthly>("SELECT TOP(1) * FROM t_EE_PowerQualityMonthly WHERE PID=" + pid + " ORDER BY Power desc").ToList();
                    if (Monthlylist != null && Monthlylist.Count > 0)
                    {
                        if (Monthlylist[0].Power != null && Monthlylist[0].Power > 0)
                            monPower = Monthlylist[0].Power + "";
                    }

                    List<t_EE_PowerQualityMonthly> Monthlylist2 = bll.ExecuteStoreQuery<t_EE_PowerQualityMonthly>("SELECT TOP(1) * FROM t_EE_PowerQualityMonthly WHERE PID=" + pid + " ORDER BY NeedPower desc").ToList();
                    if (Monthlylist2 != null && Monthlylist2.Count > 0)
                    {
                        if (Monthlylist2[0].NeedPower != null && Monthlylist2[0].NeedPower>0)
                            monNeed = Monthlylist2[0].NeedPower + "";
                    }

                    List<t_EE_PowerQualityYearly> yearlist = bll.ExecuteStoreQuery<t_EE_PowerQualityYearly>("SELECT TOP(1) * FROM t_EE_PowerQualityYearly WHERE PID=" + pid + " ORDER BY Power desc").ToList();
                    if (yearlist != null && yearlist.Count > 0)
                    {
                        if (yearlist[0].NeedPower != null && yearlist[0].NeedPower > 0)
                            yearPower = yearlist[0].Power + "";
                    } 
                    return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(new RoomInfo2(days, temp, hum, MaxPointTemperature, allPower, powerRate, monPower, monNeed, yearPower)) + "}");
                }
                else
                {
                    return Content("{\"resultCode\": 1,\"results\": {}}");
                }
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        public ActionResult getTaizhangList(int pid)
        {

            try
            {
                if (isLogin() != null)
                {
                    string DEVsql = "SELECT  * FROM t_DM_DeviceInfo WHERE pid=" + pid + " Order By OrderBy";
                    List<t_DM_DeviceInfo> DEVlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(DEVsql).ToList();
                    List<DeviceInfo> Alarm = new List<DeviceInfo>();
                    foreach (t_DM_DeviceInfo model in DEVlist)
                    {
                        Alarm.Add(new DeviceInfo(model.DID, model.PName, model.DeviceName));
                    }
                    return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(Alarm) + "}");
                }
                else
                {
                    return Content("{\"resultCode\": 1,\"results\": {}}");
                }
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }
        public ActionResult getTaizhang(int did)
        {
            try
            {
                if (isLogin() != null)
                {
                    string DEVsql = "SELECT  * FROM t_DM_DeviceInfo WHERE DID =" + did;
                    List<t_DM_DeviceInfo> DEVlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(DEVsql).ToList();

                    string repairsql = "SELECT  * FROM t_PM_Order WHERE OrderState=4 and (RepairDID  like '" + did + ",%' or RepairDID like '%," + did + ",%')";
                    List<t_PM_Order> repairList = bll.ExecuteStoreQuery<t_PM_Order>(repairsql).ToList();
                    Taizhang t = new Taizhang(DEVlist.First(), repairList);
                    return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(t) + "}");
                }
                else
                {
                    return Content("{\"resultCode\": 1,\"results\": {}}");
                }
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        //获取设备点的实时数据；
        [Login]
        public ActionResult getDeviceInfo(int pid,int did)
        {
            try
            {
                string DEVsql = "select * from V_DeviceInfoState_PDR1 where pid="+pid+" and DataTypeID!=23 and CID in ((SELECT CID FROM t_DM_CircuitInfo WHERE PID="+pid+" AND DID="+did+")) order by cid,DataTypeID,TagID,ABCID";
                //string DEVsql = "select * from V_DeviceInfoState_PDR1 where pid=5 and DataTypeID!=23 and CID in (1,2,5,7) order by cid,DataTypeID,TagID,ABCID";
                List<V_DeviceInfoState_PDR1> DEVlist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(DEVsql).ToList();
                List<DataInfo> dataInfos= makeList(DEVlist);
                return Content(JsonConvert.SerializeObject(new ReturnBean<List<DataInfo>>(Cons.CODE_SUCCESS,Cons.MSG_SUCCESS,dataInfos)));   
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, e.Message)));
            }
        }

        private List<DataInfo> makeList(List<V_DeviceInfoState_PDR1> list)
        {
            if (list == null || list.Count < 1)
                return null;
            int cid=(int)list.First().CID;
            ItemNode inode=new ItemNode(list.First());
            List<V_DeviceInfoState_PDR1> datas = new List<V_DeviceInfoState_PDR1>();
            List<DataInfo> dataInfos = new List<DataInfo>(); 

            for (int i = 0; i < list.Count; i++)
            {
                if (cid == list[i].CID)
                {
                    datas.Add(list[i]);
                }
                else
                {
                    cid = (int)list[i].CID;
                    dataInfos.Add(new DataInfo(inode, datas));
                    inode = new ItemNode(list[i]);
                    datas = new List<V_DeviceInfoState_PDR1>();
                    datas.Add(list[i]);
                }
                if (i == list.Count-1)
                {
                    dataInfos.Add(new DataInfo(inode, datas));
                }
            }
            return dataInfos;
        }

        public ActionResult rejectOrder(int OrderId,string rejectReason)
        {
            try
            {
                if (isLogin() != null)
                {
                    string DEVsql = "SELECT * FROM t_PM_Order WHERE OrderID=" + OrderId;
                    List<t_PM_Order> DEVlist = bll.ExecuteStoreQuery<t_PM_Order>(DEVsql).ToList();
                    if (DEVlist != null && DEVlist.Count > 0)
                    {
                        bll.ExecuteStoreCommand("UPDATE t_PM_Order SET OrderState=5,RejectReason='"+rejectReason+"' WHERE OrderID=" + OrderId); 
                    }
                    return Content("{\"resultCode\": 0,\"results\": {}}");
                }
                else
                {
                    return Content("{\"resultCode\": 1,\"results\": {}}");
                }
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        public ActionResult getOrdersList()
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        //string pdrlist = user.PDRList;

                        string pdrlist = HomeController.GetPID(user.UNITList);

                        //SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE OrderState=4 and  UserName LIKE '%admin%' AND t_PM_Order.PID=t_CM_PDRInfo.PID order by CreateDate desc
                        string sql = "SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE (OrderState<4 or OrderState=5) and  UserName LIKE '%" + UserName + "%' AND t_PM_Order.PID=t_CM_PDRInfo.PID order by OrderTypeId,PlanDate desc";
                        List<t_Order> list = bll.ExecuteStoreQuery<t_Order>(sql).ToList();

                        string finishSql = "SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE OrderState=4 and  UserName LIKE '%" + UserName + "%' AND t_PM_Order.PID=t_CM_PDRInfo.PID order by OrderTypeId, CheckDate desc";
                        List<t_Order> listFinish = bll.ExecuteStoreQuery<t_Order>(finishSql).ToList();

                        //listFinish = listFinish.OrderByDescending(o => o.OrderID).ToList();
                        return Content("{\"resultCode\": 0,\"results\": " + "{\"fished_orders\":" + JsonConvert.SerializeObject(listFinish) + "," + "\"unfished_orders\":" + JsonConvert.SerializeObject(list) + "}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        //返回的未完成工单包含模板id列表；
        public ActionResult getOrdersList2()
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        //string pdrlist = user.PDRList;
                        string pdrlist = HomeController.GetPID(user.UNITList);
                        string sql = "";
                        //SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE OrderState=4 and  UserName LIKE '%admin%' AND t_PM_Order.PID=t_CM_PDRInfo.PID order by CreateDate desc
                        if (user.RoleID == 1)
                        {
                          sql  = "SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE (OrderState<4 or OrderState=5) AND t_PM_Order.PID=t_CM_PDRInfo.PID order by OrderTypeId,PlanDate desc";
                        }
                        else
                        {
                            sql = "SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE (OrderState<4 or OrderState=5) AND UserName LIKE '%" + UserName + "%' AND t_PM_Order.PID=t_CM_PDRInfo.PID order by OrderTypeId,PlanDate desc";
                        }
                        List<t_Order> list = bll.ExecuteStoreQuery<t_Order>(sql).ToList();
                        if (list != null && list.Count > 0)
                        {
                            for (int i = 0; i < list.Count;i++ )
                            {
                                list[i].templates = getTemplateList((int)list[i].OrderID);//修改为设备个数的templatesId；
                            }
                        }
                        string finishSql = "";
                        if (user.RoleID==1)
                        {
                            finishSql = "SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE OrderState=4 AND UserName LIKE '%" + UserName + "%' AND t_PM_Order.PID=t_CM_PDRInfo.PID order by OrderTypeId, CheckDate desc";
                        }else
                        {
                            finishSql = "SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE OrderState=4 AND t_PM_Order.PID=t_CM_PDRInfo.PID order by OrderTypeId, CheckDate desc";
                        }
                        List<t_Order> listFinish = bll.ExecuteStoreQuery<t_Order>(finishSql).ToList();

                        //listFinish = listFinish.OrderByDescending(o => o.OrderID).ToList();
                        return Content("{\"resultCode\": 0,\"results\": " + "{\"fished_orders\":" + JsonConvert.SerializeObject(listFinish) + "," + "\"unfished_orders\":" + JsonConvert.SerializeObject(list) + "}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        public ActionResult templateList(int OrderID)
        {
            return Content(JsonConvert.SerializeObject(getTemplateList(OrderID)));
        }


        public  List<Template> getTemplateList(int OrderID)
        {
             string sqlTemplateList = "SELECT  DISTINCT t_PM_Order_Info.*, t_PM_Order_Template.templateName FROM t_PM_Order_Info ,t_PM_Order_Template WHERE orderId ="+OrderID+" AND t_PM_Order_Template.templateId=t_PM_Order_Info.templateId";
             return bll.ExecuteStoreQuery<Template>(sqlTemplateList).ToList();
        }

        public ActionResult getUnOrderDetail(int OrderID)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        List<t_PM_Order> sss = bll.ExecuteStoreQuery<t_PM_Order>("SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID).ToList();
                        if (sss != null && sss.Count > 0)
                        {
                            if (sss.First().OrderState == 0)//UPDATE t_PM_Order SET AcceptedDate = '2018-01-02 00:00:00.000',OrderState=1 WHERE OrderID=6
                            bll.ExecuteStoreCommand("UPDATE t_PM_Order SET AcceptedDate ='"+DateTime.Now+"',OrderState=" + 1 + " WHERE OrderID=" + OrderID);
                        }
                        string sql = "SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID + " and  UserName='" + UserName + "' order by CreateDate desc";
                        List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(sql).ToList();
                        if (list != null && list.Count > 0)
                        {
                            t_PM_Order order = list.First();
                            string sqlPDRinfo = "SELECT * FROM [t_CM_PDRInfo] WHERE PID=" + order.PID;
                            List<t_CM_PDRInfo> listPDRinfo = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sqlPDRinfo).ToList();
                            string sqlCreater = "SELECT * FROM [t_CM_UserInfo] WHERE UserName='" + order.Creater + "'";
                            List<t_CM_UserInfo> listUsers = bll.ExecuteStoreQuery<t_CM_UserInfo>(sqlCreater).ToList();
                            UnOrderDetail orderDetail = new UnOrderDetail(order, listPDRinfo.First(), listUsers.First().Telephone);
                            return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(orderDetail) + "}");
                        }
                        return Content("{\"resultCode\": 0,\"results\": {}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        public ActionResult getUnOrderDetailC(int OrderID)
        {
            try
            {
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        string sql = "SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID + " order by CreateDate desc";
                        List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(sql).ToList();
                        if (list != null && list.Count > 0)
                        {
                            t_PM_Order order = list.First();
                            string sqlPDRinfo = "SELECT * FROM [t_CM_PDRInfo] WHERE PID=" + order.PID;
                            List<t_CM_PDRInfo> listPDRinfo = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sqlPDRinfo).ToList();
                            string sqlCreater = "SELECT * FROM [t_CM_UserInfo] WHERE UserName='" + order.UserName + "'";
                            List<t_CM_UserInfo> listUsers = bll.ExecuteStoreQuery<t_CM_UserInfo>(sqlCreater).ToList();
                            UnOrderDetail orderDetail = new UnOrderDetail(order, listPDRinfo.First(), listUsers.First().Mobilephone, getTemplateList(OrderID));
                            return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(orderDetail) + "}");
                        }
                        return Content("{\"resultCode\": 0,\"results\": {}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        //根据t_PM_Order_Info（工单内容的记录表），二级列表；填入结果
        public ActionResult getUnOrderDetail3(int OrderID,int templateId)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        string strOrderInfo = "SELECT * FROM t_PM_Order_Template WHERE templateId="+templateId+" ORDER BY InfoOrder";
                        List<OrderInfo> infos = bll.ExecuteStoreQuery<OrderInfo>(strOrderInfo).ToList();
                        List<t_PM_Order> sss = bll.ExecuteStoreQuery<t_PM_Order>("SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID).ToList();
                        if (sss != null && sss.Count > 0)
                        {
                            if (sss.First().OrderState == 0)//UPDATE t_PM_Order SET AcceptedDate = '2018-01-02 00:00:00.000',OrderState=1 WHERE OrderID=6
                                bll.ExecuteStoreCommand("UPDATE t_PM_Order SET AcceptedDate ='" + DateTime.Now + "',OrderState=" + 1 + " WHERE OrderID=" + OrderID);
                        }
                        string sql = "SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID + " and  UserName='" + UserName + "' order by CreateDate desc";
                        List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(sql).ToList();
                        if (list != null && list.Count > 0)
                        {
                            t_PM_Order order = list.First();
                            string sqlPDRinfo = "SELECT * FROM [t_CM_PDRInfo] WHERE PID=" + order.PID;
                            List<t_CM_PDRInfo> listPDRinfo = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sqlPDRinfo).ToList();
                            string sqlCreater = "SELECT * FROM [t_CM_UserInfo] WHERE UserName='" + order.Creater + "'";
                            List<t_CM_UserInfo> listUsers = bll.ExecuteStoreQuery<t_CM_UserInfo>(sqlCreater).ToList();
                            UnOrderDetail3 orderDetail = new UnOrderDetail3(infos, order, listPDRinfo.First(), listUsers.First().Telephone);
                            return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(orderDetail) + "}");
                        }
                        return Content("{\"resultCode\": 0,\"results\": {}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        //提交工单的模板信息；
        [HttpPost]
        public ActionResult postOrderInfo(string postdata,int orderId,int templateId,int DID,int PID)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        List<Oinfo> lista = JsonConvert.DeserializeObject<List<Oinfo>>(postdata);
                        if (lista!=null&&lista.Count>0)
                        {
                            string valuesStr="";
                            //先查询，存在则删除，在插入；
                            List<t_PM_Order_InfoRecord> insss = bll.ExecuteStoreQuery<t_PM_Order_InfoRecord>("SELECT * FROM t_PM_Order_InfoRecord WHERE orderId=" + orderId + " AND templateId=" + templateId + " AND DID=" + DID).ToList();
                            if (insss!=null && insss.Count>0)
                            {
                                bll.ExecuteStoreCommand("DELETE FROM t_PM_Order_InfoRecord WHERE orderId=" + orderId + " AND templateId=" + templateId + " AND DID=" + DID);
                            }                          
                            for (int i = 0; i < lista.Count; i++)
                            {
                                //INSERT INTO t_PM_Order_InfoRecord (orderId,templateId,tInfoId,infoValue,DID) VALUES (51,2,1,'升水',1014)
                                //string updateInfo = "UPDATE t_PM_Order_Info SET t_PM_Order_Info.infoValue='" + lista[i].infoValue + "' WHERE  t_PM_Order_Info.tInfoId=" + lista[i].tInfoId;
                                //INSERT INTO t_PM_Order_InfoRecord (orderId,templateId,tInfoId,infoValue,DID) VALUES (51,2,1,'升水',1014),(51,2,1,'升水2',1015),(51,2,1,'升水3',1016)
                                 valuesStr +="("+orderId+","+templateId+","+lista[i].tInfoId+",'"+lista[i].infoValue+"',"+DID+")";
                                 if (i < lista.Count-1)
                                     valuesStr += ",";
                            }
                            string insertInfo = "INSERT INTO t_PM_Order_InfoRecord (orderId,templateId,tInfoId,infoValue,DID) VALUES "+valuesStr;
                            bll.ExecuteStoreCommand(insertInfo);
                            //count--
                            List<t_PM_Order_Info> s=  bll.ExecuteStoreQuery<t_PM_Order_Info>("SELECT * FROM t_PM_Order_Info WHERE orderId=" + orderId + " AND templateId =" + templateId).ToList();
                            if (s != null && s.Count > 0 && s[0].unCount > 0)
                            {
                                bll.ExecuteStoreCommand("UPDATE t_PM_Order_Info SET unCount=" + (s[0].unCount - 1) + " WHERE orderId=" + orderId + " AND templateId =" + templateId);
                            }
                            PubClass.Exportdoc.ExportWordFromReport(orderId,DID,user,templateId,PID);
                        }                     
                        return Content("{\"resultCode\": 0,\"results\": {}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }


        //根据t_PM_Order_Info（工单内容的记录表），三级列表；填入结果
        public ActionResult getUnOrderDetail2(int OrderID)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        string strOrderInfo = "SELECT t_PM_Order_Info.* ,t_PM_Order_Template.templateName,t_PM_Order_Template.templateBlock,t_PM_Order_Template.templateInfo,t_PM_Order_Template.infoType FROM  t_PM_Order_Info,t_PM_Order_Template WHERE t_PM_Order_Info.orderId=" + OrderID + " AND t_PM_Order_Info.tInfoId =t_PM_Order_Template.id ";
                        List<OrderInfo> infos = bll.ExecuteStoreQuery<OrderInfo>(strOrderInfo).ToList();
                        List<t_PM_Order> sss = bll.ExecuteStoreQuery<t_PM_Order>("SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID).ToList();
                        if (sss != null && sss.Count > 0)
                        {
                            if (sss.First().OrderState == 0)//UPDATE t_PM_Order SET AcceptedDate = '2018-01-02 00:00:00.000',OrderState=1 WHERE OrderID=6
                                bll.ExecuteStoreCommand("UPDATE t_PM_Order SET AcceptedDate ='" + DateTime.Now + "',OrderState=" + 1 + " WHERE OrderID=" + OrderID);
                        }
                        string sql = "SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID + " and  UserName='" + UserName + "' order by CreateDate desc";
                        List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(sql).ToList();
                        if (list != null && list.Count > 0)
                        {
                            t_PM_Order order = list.First();
                            string sqlPDRinfo = "SELECT * FROM [t_CM_PDRInfo] WHERE PID=" + order.PID;
                            List<t_CM_PDRInfo> listPDRinfo = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sqlPDRinfo).ToList();
                            string sqlCreater = "SELECT * FROM [t_CM_UserInfo] WHERE UserName='" + order.Creater + "'";
                            List<t_CM_UserInfo> listUsers = bll.ExecuteStoreQuery<t_CM_UserInfo>(sqlCreater).ToList();
                            UnOrderDetail2 orderDetail = new UnOrderDetail2(infos,order, listPDRinfo.First(), listUsers.First().Telephone);
                            return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(orderDetail) + "}");
                        }
                        return Content("{\"resultCode\": 0,\"results\": {}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        private void updateOrderState(int state,int OrderID)
        {
            List<t_PM_Order> sss = bll.ExecuteStoreQuery<t_PM_Order>("SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID).ToList();
            if (sss != null && sss.Count > 0)
            {
                if (sss.First().OrderState != state)
                    bll.ExecuteStoreCommand("UPDATE t_PM_Order SET OrderState=" + state + " WHERE OrderID=" + OrderID);
            }
        }

        public ActionResult SaveOrderInfo(t_PM_Order order, string BugDesc, string ReportWay = "wx")
        {
            string result = "";
            t_CM_UserInfo user = isLogin();
            if (user != null)
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
                        orderinfo.OrderState = 4;//0待接收,1待处理,2申请中,3待进场,4已完成;
                        orderinfo.Latitude = order.Latitude; //坐标
                        orderinfo.Longtitude = order.Longtitude; //坐标
                        //orderinfo.Rectification = order.Rectification; //处理情况
                        orderinfo.Currentplace = order.Currentplace;
                        orderinfo.RepairDID = order.RepairDID;
                        bll.ObjectStateManager.ChangeObjectState(orderinfo, EntityState.Modified);
                        bll.SaveChanges();
                        //INSERT INTO t_CM_BugInfo (PID,PName,BugDesc,ReportWay,ReportDate,ReportUser) VALUES ( 105 , '亦创会展中心','隐患描述啥啊BugDesc','wx','2018-01-03 16:40:15.097','admin')
                        if (!string.IsNullOrEmpty(BugDesc))
                        {
                            string[] dids=orderinfo.RepairDID.Split(',');
                            for (int i = 0; i < dids.Length; i++)
                            {
                                if (!string.IsNullOrEmpty(dids[i]))
                                {
                                    addNewBugInfo(dids[i],BugDesc, ReportWay, user, orderinfo);
                                }
                            }
                        }
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
            return Content(result);
        }

        //public ActionResult makeDocByOrderId(int OrderID)
        //{
        //    PubClass.Exportdoc.ExportWordFromOrder(OrderID);
        //    return Content("ExportWordFromOrder"); 
        //}

        //public ActionResult makeFromReport(int orderId, int DID, int templateId, int PID)
        //{
        //    string sessionid = getSessionID();
        //    PubClass.Exportdoc.ExportWordFromReport(orderId, DID, bll.t_CM_UserInfo.Where(p => p.UserName == "武林伟").ToList().First(), templateId, PID);
        //    return Content("ExportWordFromReport"); 
        //}

        private void addNewBugInfo(string did, string BugDesc, string ReportWay, t_CM_UserInfo user, t_PM_Order orderinfo)
        {

            t_DM_DeviceInfo d= bll.ExecuteStoreQuery<t_DM_DeviceInfo>("SELECT * FROM t_DM_DeviceInfo WHERE DID ="+did).ToList().First();
            string sql = "INSERT INTO t_CM_BugInfo (PID,PName,BugDesc,DID,DeviceName,ReportWay,ReportDate,ReportUser) VALUES ( " + orderinfo.PID + " , '" + orderinfo.PName + "','" + BugDesc + "','" + did + "','" + d.DeviceName + "','" + ReportWay + "','" + DateTime.Now + "','" + user.UserName + "')";
            bll.ExecuteStoreCommand(sql);
        }
        //SELECT t_cm_files.*,t_PM_Order.* FROM t_cm_files,t_PM_Order WHERE PID in (1,2,3,138) AND Fk_ID=t_PM_Order.OrderID AND FileType LIKE '%doc%' order BY Fk_ID desc, CommitTime desc
        public ActionResult getWordList()
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        string pdrlist = HomeController.GetPID(user.UNITList);
                        if (pdrlist != null && pdrlist.Length > 0)
                        {
                            string sql = "SELECT t_cm_files.*,t_PM_Order.* FROM t_cm_files,t_PM_Order WHERE PID in (" + pdrlist + ") AND Fk_ID=t_PM_Order.OrderID AND VerifyOk=1 AND FileType LIKE '%doc%' order BY Fk_ID desc, CommitTime desc";
                            List<t_cm_files> list = bll.ExecuteStoreQuery<t_cm_files>(sql).ToList();
                            return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(list) + "}");
                        }
                        return Content("{\"resultCode\": 0,\"results\": []}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": []}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": []}");
            }
        }

        public ActionResult getOrderDetail(int OrderID)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        string sql = "SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID + " order by CreateDate desc";
                        List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(sql).ToList();
                        if (list != null && list.Count > 0)
                        {
                            t_PM_Order order = list.First();
                            string sqlPDRinfo = "SELECT * FROM [t_CM_PDRInfo] WHERE PID=" + order.PID;
                            List<t_CM_PDRInfo> listPDRinfo = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sqlPDRinfo).ToList();
                            
                            string sqlUnit = "SELECT * FROM [t_CM_Unit] WHERE PDRList like '%," + order.PID + ",%' or PDRList like '%," + order.PID + "' or PDRList like '" + order.PID + ",%' or PDRList= '" + order.PID + "' ";
                            List<t_CM_Unit> listUnit = bll.ExecuteStoreQuery<t_CM_Unit>(sqlUnit).ToList();


                            List<t_cm_files> listFiles = bll.ExecuteStoreQuery<t_cm_files>("SELECT * FROM t_cm_files WHERE  Fk_ID="+OrderID+" AND Modules='report'").ToList();

                            OrderDetail orderDetail = new OrderDetail(order, listPDRinfo.First(), listUnit.First(), user, listFiles);
                            return Content("{\"resultCode\": 0,\"results\": " + JsonConvert.SerializeObject(orderDetail) + "}");
                        }
                        return Content("{\"resultCode\": 0,\"results\": {}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        public ActionResult getApplying(int OrderID)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        string sql = "SELECT * FROM [t_PM_Order] WHERE OrderID=" + OrderID;
                        List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(sql).ToList();
                        if (list != null && list.Count > 0)
                        {
                            t_PM_Order apply = list.First();//SELECT * FROM [t_PM_Order_DressCode] WHERE DressCode=1
                            string sql2 = "SELECT * FROM t_PM_Order_DressCode WHERE DressCode=" + apply.DressCodeID;
                            List<t_PM_Order_DressCode> list2 = bll.ExecuteStoreQuery<t_PM_Order_DressCode>(sql2).ToList();
                            if (list2 != null && list2.Count > 0)
                            {
                                return Content("{\"resultCode\": 0,\"results\":{" + "\"Remarks\":\"" + list2.First().Remarks + "\"}}");
                            }
                        }
                        return Content("{\"resultCode\": 0,\"results\": {}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        public ActionResult postApplying(int OrderID, string applyInfo)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        string sql2 = "SELECT * FROM t_PM_Order where OrderID=" + OrderID;
                        List<t_PM_Order> listee = bll.ExecuteStoreQuery<t_PM_Order>(sql2).ToList();
                        if (listee != null && listee.Count > 0)
                        {
                            //update t_PM_Order set ApplyInfo='ApplyInfo,2018年1月10日11:33:00',ApplyDate='2018-01-10 11:33:19.810' where OrderID=11
                            string sql = "update t_PM_Order set ApplyInfo='" + applyInfo + "',ApplyDate='" + DateTime.Now + "',OrderState=2 where OrderID=" + OrderID;
                            int updateResult = bll.ExecuteStoreCommand(sql);
                            if (updateResult > 0)
                            {
                                return Content("{\"resultCode\": 0,\"results\":{\"OrderID\":" + OrderID + "}}");
                            }
                        }
                        else
                        {
                            return Content("{\"resultCode\": 0,\"results\":{\"OrderID\":0}}");
                        }
                        return Content("{\"resultCode\": 0,\"results\":{\"OrderID\":\"\"}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }

        }

        public ActionResult updateArrivedTime(int OrderID,float distance)
        {
            t_CM_UserInfo user = isLogin();
            if (user != null)
            {
                string time = DateTime.Now.ToString();
                string DstsInfo;
                if (distance < 300)
                    DstsInfo = "正常打卡，距离" + distance + "米";
                else
                    DstsInfo = "异常打卡，距离" + distance + "米";
                //UPDATE t_PM_Order SET FistDate='2018-02-03 17:40:15.097',DstsInfo='正常打卡，距离100米' WHERE OrderID=39
                string sql = "UPDATE t_PM_Order SET FistDate='" + time + "',DstsInfo='" + DstsInfo + "' WHERE OrderID=" + OrderID;
                bll.ExecuteStoreCommand(sql);
                return Content("{\"resultCode\": 0,\"results\":{\"ArrivedTime\":\"" + time + "\"}}");
            }
            return Content("{\"data\": \"未登录\",\"statusCode\": 200}");
        }

        public ActionResult upload(HttpPostedFileBase file, int OrderID, string Modules, string FSource = "wx")
        {
            t_CM_UserInfo user = isLogin();
            if (user != null)
            {
                string CommitUser = user.UserName;
                int fk_id = OrderID;
                string Remark = "";
                return Content(MultiUpload(file, Modules, fk_id, FSource, Remark, CommitUser));
            }
            return Content("{\"data\": \"未登录\",\"statusCode\": 200}");
        }
        public ActionResult getRepairList(int pid)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        string repairSql = "SELECT * FROM [t_PM_Order] WHERE 1=1 AND OrderState=4 and PID=" + pid + " and CheckDate<'" + DateTime.Now.ToString() + "' order by CheckDate desc";
                        List<t_PM_Order> listRepair = bll.ExecuteStoreQuery<t_PM_Order>(repairSql).ToList();
                        return Content("{\"resultCode\": 0,\"results\":{" + "\"listRepair\":" + JsonConvert.SerializeObject(listRepair) + "}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }
        public ActionResult GetVideoByPID(int pid)
        {
            try
            {
                var m = bll.t_CM_CameraInfo.Where(p => p.PID == pid).ToList();
                var result = from n in m
                             select new
                             {
                                 link = n.ip,
                                 VideoName = n.Remarks
                             };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("暂无数据");
            }
        }

        public ActionResult searchRoom(string pname)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];                      
                        UserName = user.UserName;

                        string pdrlist = HomeController.GetPID(user.UNITList);
                        //SELECT * FROM t_CM_PDRInfo where (Name like '%2%') and PID in (1,2,3,4,5,6,7,8,9)
                        string sql = "SELECT * FROM t_CM_PDRInfo where (Name like '%"+pname+"%')  and PID in (" + pdrlist + ")";
                        List<t_CM_PDRInfo> list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sql).ToList();
                        return Content("{\"resultCode\": 0,\"results\":{" + "\"list\":" + JsonConvert.SerializeObject(list) + "}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }

        public ActionResult searchTaizhang(string tname)
        {
            try
            {
                string UserName;
                string sessionid = getSessionID();
                if (sessionid != null && !sessionid.Equals(""))
                {
                    if (Session[sessionid] != null)
                    {
                        t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];
                        UserName = user.UserName;
                        //SELECT  * FROM t_DM_DeviceInfo WHERE PName like '%AH2%' or DeviceName like '%AH2%'
                        string DEVsql = "SELECT  * FROM t_DM_DeviceInfo WHERE PName like '%"+tname+"%' or DeviceName like '%"+tname+"%'";
                        List<t_DM_DeviceInfo> DEVlist = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(DEVsql).ToList();
                        return Content("{\"resultCode\": 0,\"results\":{" + "\"list\":" + JsonConvert.SerializeObject(DEVlist) + "}}");
                    }
                }
                return Content("{\"resultCode\": 1,\"results\": {}}");
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }



        //短信验证码发送
        public ActionResult singleSm(String mobile,int type=0)
        {
            string verificationText = "";
            int hasInfo = 0;
            try
            {
                if (type == 0)
                {
                    t_CM_UserInfo list = bll.ExecuteStoreQuery<t_CM_UserInfo>("SELECT * FROM t_CM_UserInfo WHERE Mobilephone='" + mobile + "'").FirstOrDefault();
                    if (list != null)
                    {
                        if (list.IsScreen == 0)
                        {

                            hasInfo = 1;
                            verificationText = CreateVerificationText(4);
                            //设置apikey
                            Config config = new Config(UtilsSms.key);
                            Dictionary<string, string> data = new Dictionary<string, string>();
                            Result result = null;

                            //// 获取用户信息
                            //UserOperator user = new UserOperator(config);
                            //result = user.get(data);
                            //Console.WriteLine(result);

                            //// 获取模板信息
                            //TplOperator tpl = new TplOperator(config);
                            //data.Clear();
                            //data.Add("tpl_id", "1");
                            //result = tpl.getDefault(data);
                            //Console.WriteLine(result);

                            // 发送单条短信
                            SmsOperator sms = new SmsOperator(config);
                            data.Clear();
                            data.Add("mobile", mobile);
                            Session["ver"] = verificationText;
                            string xxx = Session["ver"] as string;
                            data.Add("text", "【" + UtilsSms.company + "】您的验证码是" + verificationText + "。如非本人操作，请忽略本短信");
                            result = sms.singleSend(data);
                            Console.WriteLine(result);
                        }
                        else
                        {
                            hasInfo = 2;
                            verificationText = "手机号未通过审核";
                        }
                    }
                    else
                    {
                        hasInfo = 0;
                        verificationText = "手机号未注册";
                    }
                    return Content("{\"resultCode\": 0,\"hasInfo\": " + hasInfo + ",\"results\": \"" + verificationText + "\"}");
                }else
                {
                    t_CM_UserInfo list = bll.ExecuteStoreQuery<t_CM_UserInfo>("SELECT * FROM t_CM_UserInfo WHERE Mobilephone='" + mobile + "'").FirstOrDefault();
                    if (list != null)
                    {
                        if (list.IsScreen == 0)
                        {

                            hasInfo = 1;
                            verificationText = CreateVerificationText(4);
                            //设置apikey
                            Config config = new Config(UtilsSms.key);
                            Dictionary<string, string> data = new Dictionary<string, string>();
                            Result result = null;

                            //// 获取用户信息
                            //UserOperator user = new UserOperator(config);
                            //result = user.get(data);
                            //Console.WriteLine(result);

                            //// 获取模板信息
                            //TplOperator tpl = new TplOperator(config);
                            //data.Clear();
                            //data.Add("tpl_id", "1");
                            //result = tpl.getDefault(data);
                            //Console.WriteLine(result);

                            // 发送单条短信
                            SmsOperator sms = new SmsOperator(config);
                            data.Clear();
                            data.Add("mobile", mobile);
                            Session["ver"] = verificationText;
                            string xxx = Session["ver"] as string;
                            data.Add("text", "【" + UtilsSms.company + "】您的验证码是" + verificationText + "。如非本人操作，请忽略本短信");
                            result = sms.singleSend(data);
                            Console.WriteLine(result);
                        }
                        else
                        {
                            hasInfo = 2;
                            verificationText = "已注册，未通过审核";
                        }
                    }
                    else
                    {
                        hasInfo = 3;
                        verificationText = CreateVerificationText(4);
                        //设置apikey
                        Config config = new Config(UtilsSms.key);
                        Dictionary<string, string> data = new Dictionary<string, string>();
                        Result result = null;

                        //// 获取用户信息
                        //UserOperator user = new UserOperator(config);
                        //result = user.get(data);
                        //Console.WriteLine(result);

                        //// 获取模板信息
                        //TplOperator tpl = new TplOperator(config);
                        //data.Clear();
                        //data.Add("tpl_id", "1");
                        //result = tpl.getDefault(data);
                        //Console.WriteLine(result);

                        // 发送单条短信
                        SmsOperator sms = new SmsOperator(config);
                        data.Clear();
                        data.Add("mobile", mobile);
                        Session["ver"] = verificationText;
                        string xxx = Session["ver"] as string;
                        data.Add("text", "【" + UtilsSms.company + "】您的验证码是" + verificationText + "。如非本人操作，请忽略本短信");
                        result = sms.singleSend(data);
                    }
                    return Content("{\"resultCode\": 0,\"hasInfo\": " + hasInfo + ",\"results\": \"" + verificationText + "\"}");
                }
            }
            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"hasInfo\": " + hasInfo + ",\"results\": \"" + verificationText + "\"}");
            }           
        }


        /// <summary>
        /// 创建验证码字符
        /// 利用伪随机数生成器生成验证码字符串。
        /// </summary>
        /// <param name="length">字符长度</param>
        /// <returns>验证码字符</returns>
        public static string CreateVerificationText(int length)
        {
            char[] _verification = new char[length];
            char[] _dictionary = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };
            Random _random = new Random();
            for (int i = 0; i < length; i++)
            {
                _verification[i] = _dictionary[_random.Next(_dictionary.Length - 1)];
            }
            return new string(_verification);
        }

        /// <summary>
        /// 资料上传《对外接口》
        /// </summary>
        /// <param name="file">文件</param>
        /// <param name="Modules">所属模块</param>
        /// <param name="fk_id">ID</param>
        /// <param name="FSource">来源</param>
        /// <param name="FileType">资料类型（图片，视频）</param>
        /// <param name="Remark">备注</param>
        /// <param name="CommitUser">上传用户</param>
        public string MultiUpload(HttpPostedFileBase file, string Modules, int fk_id, string FSource, string Remark, string CommitUser)
        {
            try
            {
                double maxsize = 1024;
                //设置文件上传路径
                string pathForSaving = "";// Server.MapPath("~/UploadFiles/" + Modules + DateTime.Now.ToString("yyMM"));
                //检查目录是否存在，如果不存在，则新建目录
                string filename, filePath, fileExtension, saveName;//原文件名称，文件路径，文件后缀，文件重命名
                int fileSize;//文件大小
                byte[] FileData;//获取文件信息
                double fileSizeKB;//转换文件大小，单位KB
                string fSize;//文件大小完整，如：54KB
                string FileType = "unknow";//文件类型
                t_cm_files obj;
                string[] pic = { ".jpg", ".jpeg", ".bmp", ".png", ".gif" };
                string[] ved = { ".avi", ".rmvb", ".mp4", ".flv", ".wmv", ".mkv", ".mpeg" };
                string[] voi = { ".wav", ".mp3", ".wma", ".ogg", ".ape", ".acc", ".3gp" };
                if (file != null && file.ContentLength > 0)
                {
                    filename = file.FileName;
                    fileExtension = Path.GetExtension(filename);//文件扩展名
                    saveName = DateTime.Now.Ticks + fileExtension;//文件重命名                         
                    //根据判断文件类型
                    string LFE = fileExtension.ToLower();
                    if (pic.Contains(LFE))
                    {
                        FileType = "image";
                    }
                    else if (ved.Contains(LFE))
                    {
                        FileType = "infrared";
                    }
                    else if (voi.Contains(LFE))
                    {
                        FileType = "voice";
                    }
                    pathForSaving = Server.MapPath("~/UploadFiles/" + Modules + DateTime.Now.ToString("yyMM") + "/" + FileType);
                    //判断文件是否存在
                    if (this.CreateFolderIfNeeded(pathForSaving))
                    {
                        //上传资料
                        var path = Path.Combine(pathForSaving, saveName);
                        file.SaveAs(path);//上传资料到服务器
                        FileData = ReadFileBytes(file);
                        fileSize = FileData.Length;
                        fileSizeKB = fileSize / 1024.00;
                        fileSizeKB = Math.Round(fileSizeKB, 2);
                        fSize = fileSizeKB + "KB";
                        filePath = "~/UploadFiles/" + Modules + DateTime.Now.ToString("yyMM") + "/" + FileType + "/" + saveName;
                        obj = new t_cm_files();
                        obj.CommitTime = DateTime.Now;
                        obj.CommitUser = CommitUser;
                        obj.FileName = filename;
                        obj.FilePath = filePath;
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
                    }
                }
            }
            catch (Exception ex)
            {
                return "{\"data\": \"上传失败：" + ex.Message + "\",\"statusCode\": 200}";
            }
            return "{\"data\": \"上传成功\",\"statusCode\": 200}";
        }

        private bool CreateFolderIfNeeded(string path)
        {
            bool result = true;
            if (!Directory.Exists(path))
            {
                try
                {
                    Directory.CreateDirectory(path);
                }
                catch (Exception)
                {
                    //TODO：处理异常
                    result = false;
                }
            }
            return result;
        }

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


        private RoomInfo GetMaxTempInfo(int pid)
        {
            int maxdid = 0;
            string strsql = "select top 1 AlarmAddress,AlarmArea,AlarmValue,ALarmType,t.AlarmState,Units,AlarmCate,t.DID from t_AlarmTable_en AS t INNER JOIN V_DeviceInfoState_PDR1 AS r ON t.TagID = r.TagID join t_CM_PDRInfo p on p.PID=t.PID where t.AlarmState>0 and (t.pid=" + pid + " or p.ParentID=" + pid + ") and AlarmCate <>'开关量' order by t.AlarmState desc,AlarmID desc";
            //判断是否存在报警数据
            string alarmcate = "报警值";
            List<AlarmInfo> alist = bll.ExecuteStoreQuery<AlarmInfo>(strsql).ToList();
            AlarmInfo alarm = new AlarmInfo();
            string maxtDiviceTemp = "";
            string addr = "";
            if (alist.Count > 0)
            {
                alarm = alist.First();
                if (!alarm.AlarmCate.Equals(""))
                    alarmcate = alarm.AlarmCate;
                maxtDiviceTemp = alarm.AlarmValue + alarm.Units;
                addr = alarm.AlarmArea + alarm.AlarmAddress;
            }
            else
            {
                //获取站室最高温度
                strsql = "select top 1 [中文描述] AlarmAddress,DeviceName AlarmArea,PV AlarmValue,'正常' ALarmType,0 AlarmState,Units,TypeName AlarmCate,DID  from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") and (DataTypeID=1 or DataTypeID=72) order by PV desc,TagID";
                alist = bll.ExecuteStoreQuery<AlarmInfo>(strsql).ToList();
                if (alist.Count > 0)
                {
                    alarm = alist.First();
                    if (!alarm.AlarmCate.Equals(""))
                        alarmcate = alarm.AlarmCate;
                    maxdid = alarm.DID;
                    maxtDiviceTemp = alarm.AlarmValue + alarm.Units;
                    addr = alarm.AlarmArea + alarm.AlarmAddress;
                }
                else
                {
                    alarm.ALarmType = "正常";
                    alarm.AlarmState = 0;
                    maxtDiviceTemp = "--";
                }
            }
            //获取室内环境温度12，室内环境湿度13，柜内环境温度24
            strsql = "select DataTypeID,PV from ( select row_number() over(partition by DataTypeID order by pv desc) as rownum , v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") and DataTypeID in (12)"
                + ") as T where T.rownum = 1 order by datatypeid desc";
            List<TempValue> listtemp = bll.ExecuteStoreQuery<TempValue>(strsql).ToList();
            int rowcount = listtemp.Count;
            double mintemp = 0, maxtemp = 0, humidity = 0;//柜内温度，室内温度，室内湿度
            double pv = 0;
            int dtid = 0;
            foreach (TempValue model in listtemp)
            {
                dtid = model.DataTypeID;
                pv = (double)model.PV;
                if (dtid == 12)
                    maxtemp = pv;
                else if (dtid == 13)
                    humidity = pv;
            }
            string strtemp = "--", strhumidity = "--";
            if (humidity > 0)
                strhumidity = humidity + " %Rh";
            if (maxtemp > 0)
            {
                if (mintemp > 0)
                    strtemp = mintemp + " ℃~" + maxtemp + " ℃";
                else
                    strtemp = maxtemp + " ℃";
            }
            DevicePowerInfo maxPowerInfo = null;
            try
            {
                //电网总负荷，负载率，主进电压，主进电流，
                List<t_DM_DeviceInfo> deviceInfos = bll.ExecuteStoreQuery<t_DM_DeviceInfo>("Select * from t_DM_DeviceInfo where pid = " + pid + " and B!=''").ToList();
                if (deviceInfos != null && deviceInfos.Count > 0)
                {
                    List<DevicePowerInfo> powerInfos = new List<DevicePowerInfo>();
                    foreach (t_DM_DeviceInfo inf in deviceInfos)
                    {
                        //DataTypeID=2:电流;
                        ValueBean current = getPVbyType(pid, inf.B, 2);
                        //3:电压;
                        ValueBean voltage = getPVbyType(pid, inf.B, 3);
                        //45:有功功率；
                        ValueBean activePower = getPVbyType(pid, inf.B, 45);
                        if (activePower.PV ==-1)
                        {
                            activePower = getPVbyType(pid, inf.B, 4);
                        }
                        //47：无功功率；
                        ValueBean reactivePower = getPVbyType(pid, inf.B, 47);
                        if (current.PV == -1 || voltage.PV == -1 || activePower.PV == -1 || reactivePower.PV == -1 || inf.Z == "")
                            continue;
                        powerInfos.Add(new DevicePowerInfo(current.PV, current.Units, voltage.PV, voltage.Units, activePower.PV, reactivePower.PV, double.Parse(inf.Z), inf.DeviceName));
                    }
                    powerInfos = powerInfos.OrderByDescending(o => o.load).ToList();//降序
                    maxPowerInfo = powerInfos.First();
                }
            }catch (Exception e) { }      
            TempInfo tempInfo = new TempInfo(maxPowerInfo, strtemp, strhumidity, maxtDiviceTemp, addr);
            //sbtitle.Append("<span>站内湿度：" + strhumidity + "</span><span>站内温度：" + strtemp + "</span></div>");
            RoomInfo info = new RoomInfo(alarm, tempInfo);
            return info;
        }

        private ValueBean getPVbyType(int pid, string did, int DataTypeID)
        {
            try
            {
                List<t_CM_PointsInfo> pointsInfos = bll.ExecuteStoreQuery<t_CM_PointsInfo>("SELECT * FROM t_CM_PointsInfo WHERE DID=" + int.Parse(did) + " AND PID=" + pid + " AND DataTypeID=" + DataTypeID).ToList();
                List<V_RealTimeData_All> realTimeDatas = bll.ExecuteStoreQuery<V_RealTimeData_All>("SELECT * FROM V_RealTimeData_All WHERE TagID=" + pointsInfos.First().TagID).ToList();

                List<V_DeviceInfoState_PDR1> unitssds = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>("SELECT * FROM V_DeviceInfoState_PDR1 WHERE TagID=" + pointsInfos.First().TagID).ToList();
                string unit = unitssds.First().Units;
                return new ValueBean { PV = (double)realTimeDatas.First().PV, Units = unit };
            }
            catch (Exception e)
            {
                return new ValueBean { PV = -1 };
            }      
        }

        public class ValueBean
        {
            public double PV { set; get; }
            public string Units { set; get; }
        }


        public class AlarmTable
        {
            public int AlarmState { set; get; }
            public int PID { set; get; }
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
                    //pdrlist = user.PDRList;

                    pdrlist = HomeController.GetPID(user.UNITList);
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

        private class PointsTypeInfo
        {
            public string Position { set; get; }
        }

        //捕捉界面接口_获取配电房运行状态曲线:获取配电房平面图+ 一次图 + 温度最高点历史温度 + 配电房历史负荷 的Json  创建于 20160411

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





        private class EadoObject
        {
            public string EadoCode { get; set; }
            public int ObjectID { get; set; }
            public string ObjectName { get; set; }
            public string Cphase { get; set; }
        }
        //报警数据查询   新接口  新增于 20170510  
        public String GetAlarmDate(int rows, int page, int type, int pid = 0)
        {
            string sessionid = getSessionID();
            string strJson = "no login", sqltime; ;
            if (sessionid != null && sessionid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sessionid];

                string pdrlist = HomeController.GetPID(user.UNITList);
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
                    if (pid > 0)
                        sqltime += " and pid = " + pid;
                    string Esql = "SELECT * FROM t_AlarmTable_en  " + sqltime + " and PID in (" + pdrlist + ") order by  AlarmDateTime desc"; //在报警表中取自己权限内的配电房列表
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
                    int diff1 = 5;
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
        public string PointDataJson(string DateTime, int hours = 12, int pid = 0, int did = 0, int tagid = 0)
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
        public class CVData
        {
            public string Voltage { get; set; }
            public string currer { get; set; }
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

        public string GetCurrentAndVoltageByPid(int pid)
        {
            string strJson = "";
            try
            {
                t_EE_PowerConfigInfo config = bll.t_EE_PowerConfigInfo.Where(p => p.cid_type_name == "主进电流电压").FirstOrDefault();
                if (config != null)
                {
                    t_EE_PowerReportConfig cong = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == config.cid_type_id && p.pid == pid).FirstOrDefault();

                    string sqlPoint = "select * from t_CM_PointsInfo where CID IN(" + cong.cid + ")";
                    List<int> list1 = bll.ExecuteStoreQuery<t_CM_PointsInfo>(sqlPoint).Where(p => p.Position == "电流").Select(p => p.TagID).ToList();
                    string str1 = string.Join(",", list1);
                    List<int> list2 = bll.ExecuteStoreQuery<t_CM_PointsInfo>(sqlPoint).Where(p => p.Position == "电压").Select(p => p.TagID).ToList();
                    string str2 = string.Join(",", list2);
                    string tablename = "t_SM_RealTimeData_" + pid.ToString("00000");
                    string sql1 = "select SUM(PV) from " + tablename + " where TagID IN(" + str1 + ")";
                    string sql2 = "select SUM(PV) from " + tablename + " where TagID IN(" + str2 + ")";
                    string c = bll.ExecuteStoreQuery<double>(sql1).ToList().FirstOrDefault().ToString();
                    string v = bll.ExecuteStoreQuery<double>(sql2).ToList().FirstOrDefault().ToString();
                    CVData S = new CVData();
                    S.currer = c;
                    S.Voltage = v;
                    strJson = JsonConvert.SerializeObject(S);
                    //strJson += "[{\"currer\":" + c + ",\"Voltage\":\"" + v + "\"}]";
                    
                }

            }
            catch (Exception e)
            {
                strJson += "[{\"currer\":" + 0 + ",\"Voltage\":\"" + 0 + "\"}]";
            }
            return strJson;
        }
        [Login]
        public ActionResult getCSMinfo()
        {
            string sid = getSessionID();
            if (sid != null && sid != "")
            {
                t_CM_UserInfo user = (t_CM_UserInfo)Session[sid];
                string sql = "SELECT * FROM t_CM_Unit WHERE UnitID=(SELECT UID FROM t_CM_UserInfo WHERE UserID=" + user.UserID + ")";
                t_CM_Unit r = null;
                try
                {
                    r = bll.ExecuteStoreQuery<t_CM_Unit>(sql).ToList().First();
                }
                catch { }
                return Content(JsonConvert.SerializeObject(new ReturnBean<t_CM_Unit>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, r)));
            }
            return Content(JsonConvert.SerializeObject(new ReturnBean<t_CM_Unit>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, null))); ;
        }
        public ActionResult getUserInfoByOpenid(string openid)
        {
            //bool flag= false;
            try
            {
                var m = bll.t_CM_UserInfo.Where(p => p.openid2 == openid).FirstOrDefault();
                if (m != null)
                {
                    Session["Huerinfo"] = m;
                    string sID = Session.SessionID;
                    Session[sID] = m;
                    //log
                    Common.InsertLog("App用户登录", m.UserName, "App用户登录[" + m.UserName + "]");
                    return Content(sID);
                }
                else
                {
                    return Content("该微信未绑定小程序");
                }
            }
            catch(Exception ex)
            {
                return Content(ex.Message);
            }
        }

    }
    public class OpenIdResult
    {
        public string openid { get; set; }

        public string session_key { get; set; }

        public string unionid { get; set; }

        public int errcode { get; set; }

        public string errmsg { get; set; }
    }

   public class Template
    {
        public Nullable<global::System.Int32> orderId { get; set; }
        public Nullable<global::System.Int32> templateId { get; set; }
        public Nullable<global::System.Int32> unCount { get; set; }
        public Nullable<global::System.Int32> deviceCount { get; set; }
        public string templateName { get; set; }
    }

    class Oinfo
    {
        public Nullable<global::System.Int32> tInfoId { get; set; }
        public string infoValue { get; set; }
    }

    class t_Order
    {
        public Nullable<global::System.Int32> OrderID { get; set; }
        public string OrderNO { get; set; }
        public string OrderName { get; set; }
        public Nullable<global::System.Int32> PID { get; set; }
        public string PName { get; set; }
        public string OrderContent { get; set; }
        public Nullable<global::System.Int32> UserID { get; set; }
        public string UserName { get; set; }
        public Nullable<global::System.DateTime> PlanDate { get; set; }
        public Nullable<global::System.DateTime> CheckDate { get; set; }
        public Nullable<global::System.Int32> Priority { get; set; }
        public Nullable<global::System.Int32> OrderState { get; set; }
        public Nullable<global::System.Int32> IsQualified { get; set; }
        public string CheckInfo { get; set; }
        public string Rectification { get; set; }
        public string Remarks { get; set; }
        public Nullable<global::System.DateTime> CreateDate { get; set; }
        public string Creater { get; set; }
        public Nullable<global::System.Decimal> Latitude { get; set; }
        public Nullable<global::System.Decimal> Longtitude { get; set; }
        public string Currentplace { get; set; }
        public Nullable<global::System.DateTime> FistDate { get; set; }
        public string OrderType { get; set; }
        public Nullable<global::System.Int32> BugID { get; set; }
        public string BugInfo { get; set; }
        public Nullable<global::System.DateTime> AcceptedDate { get; set; }
        public string RepairDID { get; set; }
        public Nullable<global::System.DateTime> ReceiveDate { get; set; }
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public string Coordination { get; set; }
        public List<Template> templates { get; set; }
    }
}
