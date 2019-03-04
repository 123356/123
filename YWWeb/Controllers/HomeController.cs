using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using YWWeb.PubClass;
using System.Data;
using System.IO;
using Loger;
using System.Diagnostics;
using Newtonsoft.Json;
using System.Collections;
using YWWeb.Lib.Base;
using DAL;
using System.Net;
using System.Reflection;

namespace YWWeb.Controllers
{
    public class HomeController : UserControllerBaseEx //Controller
    {
        //
        // GET: /Home/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            if (null != CurrentUser)
            {
                ViewData["UserName"] = CurrentUser.UserName;
                string logurl = CurrentUser.LogUrl;
                if (logurl == "" || logurl == null)//如果没有设置logo
                    logurl = "logo.png";

                ViewData["LogUrl"] = logurl;

                return View();
            }
            return RedirectToAction("Login");
        }
        public ActionResult ChargingPile()
        {
            return View();
        }
        public ActionResult ChargingPileData()
        {
            return View();
        }
        [AuthorizeIgnore]
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Loginldzs()
        {
            return View();
        }
        public ActionResult Loginftj()
        {
            return View();
        }
        [Login]
        public ActionResult MapPage()
        {
            return View();
        }
        [Login]
        public ActionResult MapPageStatic()
        {
            return View();
        }
        public ActionResult MapPageStaticSingle()
        {
            return View();
        }
        public ActionResult MapPageBaidu()
        {
            return View();
        }
        [Login]
        public ActionResult LeftPdrList()
        {
            return View();
        }
        [Login]
        public ActionResult LeftMenu()
        {
            return View();
        }
        [Login]
        public ActionResult LeftPointsMenu()
        {
            return View();
        }
        [Login]
        public ActionResult ExitSystem()
        {
            return View();
        }
        public ActionResult Loginpub()
        {
            return View();
        }
        public ActionResult Tips()
        {
            return View();
        }
        public ActionResult AnalysisReport()
        {
            return View();
        }
        public ActionResult PermissionError()//无权限页面
        {
            return View();
        }
        public ActionResult UserInfoMap()//用户地图
        {
            return View();
        }
        public ActionResult PowerInfoMap()
        {
            return View();
        }
        public ActionResult PowerMapDetail()
        {
            return View();
        }
        public ActionResult PUEHistory()
        {
            return View();
        }
        public ActionResult PUERealTime()
        {
            return View();
        }
        static DateTime m_dtLicense = DateTime.Now.AddHours(-1);//check license 时间
        //登录
        [HttpPost]
        [AuthorizeIgnore]
        public ActionResult CheckUserInfo(string username, string UserPassWord)
        {
            try
            {
                int errCode;
                IDAO.Models.t_CM_UserInfo userinfo = LoginManager.Login(username, UserPassWord, this.ControllerContext, out errCode);
                if (null != userinfo)
                {
                    if (userinfo.IsScreen == 0)//启用
                    {
                        //string sID = list[0].UserID + "hy" + Session.SessionID;
                        string sID = Session.SessionID;
                        //IDAO.Models.t_CM_UserInfo userinfo = list[0];
                        if (userinfo.RoleID == 1)
                            userinfo.UNITList = GetAllUnit();
                        Session[sID] = userinfo;
                        //添加登录信息
                        string strsql = "delete from t_CM_UserLogin where username='" + username + "';insert into t_CM_UserLogin values ('" + username + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + sID + "');";
                        bll.ExecuteStoreCommand(strsql, null);
                        //log
                        Common.InsertLog("用户登录", username, "用户登录[" + username + "]");


                        //保存登陆成功的令牌
                        string Guid_str = "";
                        //分配一个唯一标识符
                        Guid_str = Guid.NewGuid().ToString();
                        Response.Cookies["GUID"].Value = Guid_str;
                        HttpContext.Application[userinfo.UserID + "_GUID"] = Guid_str;

                        return Content(sID);
                    }
                    else
                    {
                        return Content("此用户已屏蔽请联系管理！");
                    }
                }
                else
                {
                    if (-1 == errCode)
                        return Content("系统正在维护，暂时不能访问！(code:000074)"); // Content("未检测到加密狗，请联系系统管理员！");
                    return Content("用户名密码错误！");
                }

            }
            catch (Exception ex)
            {
                LogHelper.makeLog(ex, "LoginError");
                return Content(ex.ToString());
            }
            #region 稍后删除
#if false
            try
            {

                //判断用户是否登录
                List<t_CM_UserLogin> listLogin = bll.t_CM_UserLogin.Where(l => l.UserName.ToLower() == username.ToLower()).ToList();
                if (listLogin.Count > 0)
                {
                    //间隔时间<分钟>
                    //TimeSpan tsTime = DateTime.Now - Convert.ToDateTime(listLogin[0].LoginDate);
                    //double gapMinutes = tsTime.TotalMinutes;
                    //if (gapMinutes < 0)
                    //{
                    //    return Content("用户"+username+"已在其他电脑登录，请切换其他账号登录！");
                    //}
                    //else
                    //{
                    //    Session.Remove(listLogin[0].SessionID);
                    //}
                }
                //UMHCONTROLLib.IRCUMHDog dog = new UMHCONTROLLib.RCUMHDogClass();
                //int retCode = 0;// dog.OperateDog();
                bool b = false;
                if (DateTime.Now > m_dtLicense)
                {
                    var root = "~/bin/";
                    StringBuilder sbPath = new StringBuilder(HostingEnvironment.MapPath(root));
                    int nRet = LibLicenseEx.SetLicensePath(sbPath, sbPath.Capacity);
                    StringBuilder sb = new StringBuilder(250);
                    LibLicenseEx.SDK_GetLicenseFile(sb, sb.Capacity);
                    StringBuilder sbmsg = new StringBuilder(50);
                    int nb = LibLicenseEx.SDK_CheckLicense(sbmsg, sbmsg.Capacity);
                    b = nb > 0 ? true : false;
                    if (b)
                    { m_dtLicense = DateTime.Now.AddMinutes(1); }
                }
                else { b = true; }
                int retCode = b ? 0 : -1;// dog.OperateDog();
                if (retCode == 0)
                {
                    string MD5password = Lib.Base.Encrypt.MD5Encrypt(UserPassWord);
                    //List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.UserName == username && u.UserPassWord == MD5password).ToList();
                    IList<IDAO.Models.t_CM_UserInfo> list = UserInfoDAL.getInstance().GetUsers(username,MD5password);

                    if (list.Count > 0)
                    {
                        if (list[0].IsScreen == 0)//启用
                        {
                            Session["Huerinfo"] = list[0];
                            //string sID = list[0].UserID + "hy" + Session.SessionID;
                            string sID = Session.SessionID;
                            IDAO.Models.t_CM_UserInfo userinfo = list[0];
                            if (userinfo.RoleID == 1)
                                userinfo.UNITList = GetAllUnit();
                            Session[sID] = userinfo;
                            //添加登录信息
                            string strsql = "delete from t_CM_UserLogin where username='" + username + "';insert into t_CM_UserLogin values ('" + username + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','" + sID + "');";
                            bll.ExecuteStoreCommand(strsql, null);
                            //log
                            Common.InsertLog("用户登录", username, "用户登录[" + username + "]");


                            //保存登陆成功的令牌
                            string Guid_str = "";
                            //分配一个唯一标识符
                            Guid_str = Guid.NewGuid().ToString();
                            Response.Cookies["GUID"].Value = Guid_str;
                            HttpContext.Application[userinfo.UserID + "_GUID"] = Guid_str;




                            try
                            {
                                HttpCookie cookie = new HttpCookie("myYWAppInf");
                                //cookie.Expires = DateTime.Now.AddYears(20);
                                cookie.Values.Set("appkey", Lib.Base.Encrypt.MD5Encrypt2(username));
                                cookie.Values.Add("appu", Lib.Base.Encrypt.MD5Encrypt2(MD5password));
                                Response.SetCookie(cookie);
                                Response.Cookies.Add(cookie);
                            }
                            catch (Exception ex)
                            {
                                LogHelper.Warn(ex);
                            }
                            return Content(sID);
                        }
                        else
                        {
                            return Content("此用户已屏蔽请联系管理！");
                        }
                    }
                    else
                    {
                        return Content("用户名密码错误！");
                    }
                }
                else
                    return Content("系统正在维护，暂时不能访问！(code:000074)"); // Content("未检测到加密狗，请联系系统管理员！");
            }
            catch (Exception ex)
            {
                LogHelper.makeLog(ex, "LoginError");
                return Content(ex.ToString());
            }
#endif
            #endregion
        }

        public ActionResult IsLogin()
        {
            string IsReusable = "false";
            HttpApplicationStateBase applicationState = HttpContext.Application;
            //获取session里面的用户id
            if (CurrentUser != null)
            {
                string Uid = CurrentUser.UserID.ToString();
                if (Request.Cookies["GUID"] != null && applicationState[Uid + "_GUID"] != null)
                {
                    //判断用户是否重复登陆
                    if (applicationState[Uid + "_GUID"].ToString() != HttpContext.Request.Cookies["GUID"].Value)
                    {
                        Session.Clear();
                        IsReusable = "true";
                    }
                }
            }
            return Content(IsReusable);
        }
        //SELECT t_CM_Constract.*,t_CM_ConstractInfo.* FROM t_CM_Constract,t_CM_ConstractInfo WHERE CtrPid in (2,3,4,5,6,7,8,9,10,11) AND t_CM_Constract.id=t_CM_ConstractInfo.constractId
        public ActionResult getConstractOrdersByUser()
        {
            if (CurrentUser != null)
            {
                string PDRList = HomeController.GetPID(CurrentUser.UNITList);
                if (string.IsNullOrEmpty(PDRList))
                {
                    return Content("no");
                }
                string co = "SELECT t_CM_Constract.*,t_CM_CstrOrder.* FROM t_CM_Constract,t_CM_CstrOrder WHERE CtrPid in (" + PDRList + ") AND t_CM_Constract.id=t_CM_CstrOrder.CtrId AND PlanDate>'" + DateTime.Now + "' AND PlanDate<'" + DateTime.Now.AddDays(7) + "' and OrderId is null  ORDER BY PlanDate";
                List<ConstractOrder2> cOrders = bll.ExecuteStoreQuery<ConstractOrder2>(co).ToList();
                return Content(JsonConvert.SerializeObject(cOrders));
            }
            else
            {
                return Content("no");
            }
        }

        //获取所有站室ID 列表
        public string getAllPdrList()
        {
            string strsql = "select top 1 stuff((select ','+cast(pid as varchar) from t_CM_PDRInfo where 1=1 for xml path('')),1,1,'') PdrList from t_CM_PDRInfo";
            List<string> pdrlist = bll.ExecuteStoreQuery<string>(strsql, null).ToList();
            if (pdrlist.Count > 0)
                return pdrlist[0];
            else
                return "";
        }
        public string GetAllUnit()
        {
            string strsql = "select top 1 stuff((select ','+cast(UnitID as varchar) from t_CM_Unit where 1=1 for xml path('')),1,1,'') UnitList from t_CM_Unit";
            List<string> unitlist = bll.ExecuteStoreQuery<string>(strsql, null).ToList();
            if (unitlist.Count > 0)
                return unitlist[0];
            else
                return "";
        }
        //站室列表
        [Login]
        public ActionResult AccordionMenu(string pname)
        {
            try
            {
                string stridlist = HomeController.GetPID(CurrentUser.UNITList);
                //string stridlist = CurrentUser.PDRList;
                string strsql = "select PID,Name,Areaname,Typename,Coordination from t_CM_PDRInfo p join t_CM_Area a on p.AreaID=a.AreaID join t_CM_PDRType t on p.TypeID=t.TypeID where IsLast = 1 and pid in ( " + stridlist + " )";
                if (!pname.Equals(""))
                    strsql = strsql + " and Name like '%" + pname + "%'";
                strsql += " order by AreaName";
                List<AccordionInfo> list = bll.ExecuteStoreQuery<AccordionInfo>(strsql).Where(k => k.Coordination != null).ToList();
                //整理一下数据
                string areaname = "", bareaname = "", typename = "", btypename = "", Coordination = "", x = "", y = "";
                //int icount = 0;
                List<MenuFormatInfo1> listMenu = new List<MenuFormatInfo1>();
                MenuFormatInfo1 inf1 = null;
                MenuFormatInfo2 inf2 = null;
                MenuFormatInfo3 inf3 = null;
                foreach (AccordionInfo model in list)
                {
                    areaname = model.Areaname;
                    typename = model.Typename;
                    if (!bareaname.Equals(areaname))
                    {
                        inf1 = new MenuFormatInfo1();
                        listMenu.Add(inf1);
                        inf1.Areaname = areaname;
                    }
                    if (!btypename.Equals(typename))
                    {
                        inf2 = new MenuFormatInfo2();
                        inf1.MenuInfo2.Add(inf2);
                        inf2.Typename = typename;
                    }
                    inf3 = new MenuFormatInfo3();
                    inf2.MenuInfo3.Add(inf3);
                    inf3.PID = model.PID;
                    inf3.Name = model.Name;
                    Coordination = model.Coordination;
                    if (Coordination.Contains('|'))
                    {
                        inf3.Coordination_X = double.Parse(Coordination.Split('|')[0]);
                        inf3.Coordination_Y = double.Parse(Coordination.Split('|')[1]);
                    }
                    bareaname = areaname;
                    btypename = typename;
                }
                list.Clear();
                ViewData["List"] = listMenu;
                //StringBuilder sbAccord = new StringBuilder();
                //string areaname = "", bareaname = "", typename = "", btypename = "", Coordination = "", x = "", y = "";
                //int icount = 0;
                //foreach (AccordionInfo model in list)
                //{
                //    areaname = model.Areaname;
                //    typename = model.Typename;
                //    if (!bareaname.Equals(areaname))
                //    {
                //        if (icount > 0)
                //        {
                //            sbAccord.Append("<div class=\"clear\"></div></ul></li></ul>");
                //            sbAccord.Append("</li>");
                //        }
                //        sbAccord.Append("<li>");
                //        sbAccord.Append("<a href=\"javascript:;\"");
                //        if (icount == 0)
                //            sbAccord.Append("class=\"xz\"");
                //        sbAccord.Append(">" + areaname + "<i class=\"one_colse\"></i></a>");
                //        sbAccord.Append("<ul class=\"two\"");
                //        if (icount == 0)
                //            sbAccord.Append(" style=\"display:block;\"");
                //        sbAccord.Append(" ><li class=\"e_li\"><a href=\"javascript:;\">" + typename + "</a>");
                //        sbAccord.Append(" <ul class=\"thr\">");

                //    }
                //    else if (icount > 0 && !typename.Equals(btypename))
                //    {
                //        sbAccord.Append("<div class=\"clear\"></div></ul></li>");
                //        sbAccord.Append(" <li class=\"e_li\"><a href=\"javascript:;\">" + typename + "</a>");
                //        sbAccord.Append(" <ul class=\"thr\">");
                //    }
                //    Coordination = model.Coordination;
                //    if (Coordination.Contains('|'))
                //    {
                //        x = Coordination.Split('|')[0];
                //        y = Coordination.Split('|')[1];
                //    }
                //    else
                //    {
                //        x = y = "0";
                //    }
                //    sbAccord.Append("<li><a href=\"javascript:\" target=\"maincontent\" onclick=\"aa(" + x + "," + y + ")\" ondblclick=\"bb(" + model.PID + ")\">" + model.Name + "</a></li>");
                //    btypename = typename;
                //    bareaname = areaname;
                //    icount++;
                //}
                //sbAccord.Append("<div class=\"clear\"></div></ul></li></ul>");
                //sbAccord.Append("</li><div class=\"clear\"></div>");
                //string strjsoin = sbAccord.ToString();

                return View();
            }
            catch (Exception ex)
            {
                return Content("error");
            }
        }
        ////站室列表
        //[Login]
        //public ActionResult AccordionMenu(string pname)
        //{
        //    try
        //    {
        //        string stridlist = CurrentUser.PDRList;
        //        string strsql = "select PID,Name,Areaname,Typename,Coordination from t_CM_PDRInfo p join t_CM_Area a on p.AreaID=a.AreaID join t_CM_PDRType t on p.TypeID=t.TypeID where IsLast = 1 and pid in ( " + stridlist + " )";
        //        if (!pname.Equals(""))
        //            strsql = strsql + " and Name like '%" + pname + "%'";
        //        strsql += " order by AreaName";
        //        List<AccordionInfo> list = bll.ExecuteStoreQuery<AccordionInfo>(strsql).Where(k => k.Coordination != null).ToList();
        //        StringBuilder sbAccord = new StringBuilder();
        //        string areaname = "", bareaname = "", typename = "", btypename = "", Coordination = "", x = "", y = "";
        //        int icount = 0;
        //        foreach (AccordionInfo model in list)
        //        {
        //            areaname = model.Areaname;
        //            typename = model.Typename;
        //            if (!bareaname.Equals(areaname))
        //            {
        //                if (icount > 0)
        //                {
        //                    sbAccord.Append("<div class=\"clear\"></div></ul></li></ul>");
        //                    sbAccord.Append("</li>");
        //                }
        //                sbAccord.Append("<li>");
        //                sbAccord.Append("<a href=\"javascript:;\"");
        //                if (icount == 0)
        //                    sbAccord.Append("class=\"xz\"");
        //                sbAccord.Append(">" + areaname + "<i class=\"one_colse\"></i></a>");
        //                sbAccord.Append("<ul class=\"two\"");
        //                if (icount == 0)
        //                    sbAccord.Append(" style=\"display:block;\"");
        //                sbAccord.Append(" ><li class=\"e_li\"><a href=\"javascript:;\">" + typename + "</a>");
        //                sbAccord.Append(" <ul class=\"thr\">");

        //            }
        //            else if (icount > 0 && !typename.Equals(btypename))
        //            {
        //                sbAccord.Append("<div class=\"clear\"></div></ul></li>");
        //                sbAccord.Append(" <li class=\"e_li\"><a href=\"javascript:;\">" + typename + "</a>");
        //                sbAccord.Append(" <ul class=\"thr\">");
        //            }
        //            Coordination = model.Coordination;
        //            if (Coordination.Contains('|'))
        //            {
        //                x = Coordination.Split('|')[0];
        //                y = Coordination.Split('|')[1];
        //            }
        //            else
        //            {
        //                x = y = "0";
        //            }
        //            sbAccord.Append("<li><a href=\"javascript:\" target=\"maincontent\" onclick=\"aa(" + x + "," + y + ")\" ondblclick=\"bb(" + model.PID + ")\">" + model.Name + "</a></li>");
        //            btypename = typename;
        //            bareaname = areaname;
        //            icount++;
        //        }
        //        sbAccord.Append("<div class=\"clear\"></div></ul></li></ul>");
        //        sbAccord.Append("</li><div class=\"clear\"></div>");
        //        string strjsoin = sbAccord.ToString();

        //        return Content(strjsoin);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Content("error");
        //    }
        //}
        //站室列表 combotree
        [Login]
        public ActionResult ComboTreeMenu(int type = 0)
        {
            string strjson = "";
            if (CurrentUser != null)
            {

                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                // string pdrlist = CurrentUser.PDRList;
                if (string.IsNullOrEmpty(pdrlist))
                    return Content("");
                //if (pdrlist == null)
                string strsql = "select PID,Name,Areaname,Typename,Coordination from t_CM_PDRInfo p join t_CM_Area a on p.AreaID=a.AreaID join t_CM_PDRType t on p.TypeID=t.TypeID where IsLast = 1 and PID in (" + pdrlist + ")  order by AreaName,Typename";
                List<AccordionInfo> list = bll.ExecuteStoreQuery<AccordionInfo>(strsql).ToList();
                StringBuilder sbMenu = new StringBuilder();
                string areaname = "", bareaname = "", typename = "", btypename = "";
                int acount = 0, tcount = 0, count = 0;
                //sbMenu.Append("[{\"id\":0,\"text\":\"北京市\",\"children\":[");
                sbMenu.Append("[");
                if (type == 1)
                {
                    sbMenu.Append("{\"id\": -1,\"text\": \"全部\"},");
                }
                foreach (AccordionInfo model in list)
                {
                    areaname = model.Areaname;
                    typename = model.Typename;
                    if (!areaname.Equals(bareaname))//如果区域不同
                    {
                        if (acount > 0)
                        {
                            sbMenu.Append("]}]},");
                            //sbMenu.Append("{\"id\":0,\"state\":\"closed\",\"text\":\"" + areaname + "\",\"children\":[");
                            //sbMenu.Append("{\"id\":" + model.PID + ",\"state\":\"closed\",\"text\":\"" + typename + "\",\"children\":[");
                            sbMenu.Append("{\"id\":0,\"state\":\"closed\",\"text\":\"" + areaname + "\",\"children\":[");
                            sbMenu.Append("{\"id\":0,\"state\":\"closed\",\"text\":\"" + typename + "\",\"children\":[");
                        }
                        else
                        {
                            sbMenu.Append("{\"id\":0,\"text\":\"" + areaname + "\",\"children\":[");
                            sbMenu.Append("{\"id\":0,\"text\":\"" + typename + "\",\"children\":[");
                        }
                        count = 0;
                        acount++;
                        tcount++;
                    }
                    else if (!btypename.Equals(typename))//如果类型不同
                    {
                        if (tcount > 0)
                            sbMenu.Append("]},");
                        sbMenu.Append("{\"id\":0,\"text\":\"" + typename + "\",\"children\":[");
                        count = 0;
                        tcount++;
                    }
                    if (count > 0)
                        sbMenu.Append(",");
                    sbMenu.Append("{\"id\":" + model.PID + ",\"text\":\"" + model.Name + "\"}");
                    count++;
                    bareaname = areaname;
                    btypename = typename;
                }
                //sbMenu.Append("]}]}]}]");
                sbMenu.Append("]}]}]");
                strjson = sbMenu.ToString();
            }
            return Content(strjson);
        }
        //站室设备列表
        [Login]
        public ActionResult StationDevice(int pid)
        {
            string strsql = "select DID,d.DTID,DeviceName,dt.Name TypeName from t_DM_DeviceInfo d join t_CM_DeviceType dt on d.DTID=dt.DTID join t_CM_PDRInfo p on d.PID=p.PID where (d.pid=" + pid + " or parentid=" + pid + ") and d.DTID!=8 order by orderby";
            List<DeviceType> list = bll.ExecuteStoreQuery<DeviceType>(strsql).ToList();
            StringBuilder sbAccord = new StringBuilder();
            string dname = "", typename = "", btypename = "";
            int icount = 0;
            foreach (DeviceType model in list)
            {
                typename = model.TypeName;
                dname = model.DeviceName;
                if (!typename.Equals(btypename))
                {
                    if (icount > 0)
                    {
                        sbAccord.Append("</ul></li>");
                    }
                    sbAccord.Append("<li>");
                    sbAccord.Append("<a href=\"javascript:;\"");
                    if (icount == 0)
                        sbAccord.Append("class=\"xz\"");
                    sbAccord.Append(">" + typename + "<i class=\"one_colse\"></i></a>");
                    sbAccord.Append("<ul class=\"two\"");
                    if (icount == 0)
                        sbAccord.Append(" style=\"display: block;\"");
                    sbAccord.Append(">");
                }
                // if (model.DID == 18)//环境--门禁 调用第三方页面
                //     sbAccord.Append("<li><a href=\"javascript::\"  onclick=\"javascript:window.open('http://192.168.1.123');\">" + dname + "</a></li>");
                // else if (model.DID == 19)//环境--视频
                //     sbAccord.Append("<li><a href=\"javascript::\"  onclick=\"javascript:window.open('http://192.168.1.88');\">" + dname + "</a></li>");
                else
                    sbAccord.Append("<li><a href=\"/DeviceManage/Index?pid=" + pid + "&did=" + model.DID + "\" target=\"maincontent\">" + dname + "</a></li>");
                btypename = typename;
                icount++;
            }
            sbAccord.Append("<div class=\"clear\"></div></ul></li>");
            string strjson = sbAccord.ToString();
            return Content(strjson);
        }
        //站室设备列表 2.0.4
        [Login]
        public ActionResult StationDeviceTree(int pid, string typeName)
        {
            string addType = "";
            if (typeName != "")
            {
                addType = "dt.Name like '%" + typeName + "%'";
            }
            string strsql = "select DID,DeviceName,dt.Name TypeName, OrderBy from t_DM_DeviceInfo d join t_CM_DeviceType dt on d.DTID=dt.DTID join t_CM_PDRInfo p on d.PID=p.PID where (d.pid=" + pid + " or parentid=" + pid + ") and " + addType + "and d.DTID!=8  order by TypeName, OrderBy";

            List<DeviceType> list = bll.ExecuteStoreQuery<DeviceType>(strsql).ToList();
            StringBuilder sbAccord = new StringBuilder();
            string dname = "", typename = "", btypename = "";
            int icount = 0;
            foreach (DeviceType model in list)
            {
                typename = model.TypeName;
                dname = model.DeviceName;
                if (!typename.Equals(btypename))
                {
                    if (icount > 0)
                    {
                        sbAccord.Append("</ul></li>");
                    }
                    sbAccord.Append("<li>");
                    sbAccord.Append("<a href=\"javascript:;\"");
                    if (icount == 0)
                        sbAccord.Append("class=\"xz\"");
                    sbAccord.Append(">" + typename + "<i class=\"one_colse\"></i></a>");
                    sbAccord.Append("<ul class=\"two\"");
                    if (icount == 0)
                        sbAccord.Append(" style=\"display: block;\"");
                    sbAccord.Append(">");
                }
                //if (model.DID == 18)//环境--门禁 调用第三方页面
                //     sbAccord.Append("<li><a href=\"javascript::\"  onclick=\"javascript:window.open('http://192.168.1.123');\">" + dname + "</a></li>");
                //else if (model.DID == 19)//环境--视频
                //     sbAccord.Append("<li><a href=\"javascript::\"  onclick=\"javascript:window.open('http://192.168.1.88');\">" + dname + "</a></li>");
                // else
                sbAccord.Append("<li><a onClick=\"callAway(" + pid + "," + model.DID + ")\" target=\"maincontent\" data-did=" + model.DID + ">" + dname + "</a></li>");
                btypename = typename;
                icount++;
            }
            sbAccord.Append("<div class=\"clear\"></div></ul></li>");
            string strjson = sbAccord.ToString();
            return Content(strjson);
        }
        //站室设备列表 json
        [Login]
        public JsonResult StationDeviceTreeJson(int pid, string typeName)
        {
            string addType = "";
            if (typeName != "")
            {
                addType = "dt.Name like '%" + typeName + "%'";
            }
            string strsql = "select DID,DeviceName,dt.Name TypeName, OrderBy from t_DM_DeviceInfo d join t_CM_DeviceType dt on d.DTID=dt.DTID join t_CM_PDRInfo p on d.PID=p.PID where (d.pid=" + pid + " or parentid=" + pid + ") and " + addType + "and d.DTID!=8  order by TypeName, OrderBy";

            List<DeviceType> list = bll.ExecuteStoreQuery<DeviceType>(strsql).ToList();
            return Json(list);
        }
        //站室传感器列表
        [Login]
        public ActionResult StationPointsType(int pid)
        {
            //string strsql = "SELECT  TagID,TagName,Name TypeName FROM t_CM_PointsInfo d join t_CM_ValueType dt on d.DataTypeID = dt.DataTypeID where d.DID in (select DID from t_DM_DeviceInfo where pid=" + pid + ") order by TagName";
            string strsql = "select distinct(DataTypeID),TypeName from V_DeviceInfoState_PDR1 Where PID = " + pid + " order by TypeName";
            List<PointsType> list = bll.ExecuteStoreQuery<PointsType>(strsql).ToList();
            StringBuilder sbAccord = new StringBuilder();
            string dname = "", typename = "", btypename = "";
            int icount = 0;
            foreach (PointsType model in list)
            {
                typename = "全部显示";
                dname = model.TypeName;
                if (!typename.Equals(btypename))
                {
                    if (icount > 0)
                    {
                        sbAccord.Append("</ul></li>");
                    }
                    sbAccord.Append("<li>");
                    sbAccord.Append("<a href=\"javascript:;\"");
                    if (icount == 0)
                        sbAccord.Append("class=\"xz\"");
                    sbAccord.Append(">" + typename + "<i class=\"one_colse\"></i></a>");
                    sbAccord.Append("<ul class=\"two\"");
                    if (icount == 0)
                        sbAccord.Append(" style=\"display: block;\"");
                    sbAccord.Append(">");
                }
                sbAccord.Append("<li><a href=\"/DeviceManage/Index?pid=" + pid + "&did=" + model.DataTypeID + "\" target=\"maincontent\">" + dname + "</a></li>");
                btypename = typename;
                icount++;
            }
            sbAccord.Append("<div class=\"clear\"></div></ul></li>");
            string strjson = sbAccord.ToString();
            return Content(strjson);
        }
        //获取当前地址
        [Login]
        public string GetCurrentNav(int pid, string url)
        {
            string strnav = "当前位置：首页 >  ";
            string mname = "";
            if (url != null)
            {
                if (url.IndexOf("PlanInfo") >= 0)
                    mname = "平面图";
                else if (url.IndexOf("OneGraph") >= 0)
                    mname = "一次图";
                else if (url.IndexOf("RealTimePage") >= 0)
                    mname = "实时数据";
            }
            try
            {
                //string pdrlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                string strsql = "select *,(select AreaName from t_CM_Area where t_CM_Area.AreaID=a.ParentID) CityName from t_CM_PDRInfo p join t_CM_PDRType pt  on p.TypeID=pt.TypeID join t_CM_Area a on p.AreaID=a.AreaID where pid=" + pid;
                List<AccordionInfo> list = bll.ExecuteStoreQuery<AccordionInfo>(strsql).ToList();
                if (list.Count > 0)
                {
                    AccordionInfo model = list[0];
                    strnav = "当前位置：状态 > 实时 > " + mname + " > " + model.Name;
                    string x = "113.554768", y = "22.172356";
                    if (model.Coordination != null && model.Coordination.Contains("|"))
                    {
                        x = model.Coordination.Split('|')[0];
                        y = model.Coordination.Split('|')[1];
                    }
                    strnav = strnav + "|" + x + "|" + y;
                }
            }
            catch (Exception ex)
            {

            }
            return strnav;
        }
        //获取报警信息
        [Login]
        public ActionResult getPtAlarmInfo()
        {

            string strAlarmInfo = "null";//返回值不能为空
            string format = " <p class=\"content_size\"> <a href=\"/AlarmManage/Index?pid=0\" target=\"main_frame\">有<span class=\"am-badge am-badge-warning am-round item-feed-badge\" id=\"alarmNum\">{0}</span>条【监测报警】，请立即处理...</a></p>";
            if (null == CurrentUser)
                return Content(string.Format(format, 0));
            try
            {
                int rowcount = AlarmTable_enDAL.getInstance().GetAlarmCount(HomeController.GetPID(CurrentUser.UNITList));
                if (rowcount > 0)
                    strAlarmInfo = string.Format(format, rowcount);
                else
                    strAlarmInfo = "null";
            }
            catch (Exception ex)
            {
                LogHelper.Error(ex);
            }
            return Content(strAlarmInfo);
#if N_Redis
            try
            {
                //string strPlist = CurrentUser.PDRList;
                string strPlist = HomeController.GetPID(CurrentUser.UNITList);
                string strsql = "select * from "
    + "("
    + " select row_number() over(partition by did order by AlarmState desc) as rownum"
    + ", *"
    + " from t_AlarmTable_en where PID in (" + strPlist + ") and AlarmState>0 "
    + ") as T "
    /*+ "where T.rownum = 1"*/;
                List<t_AlarmTable_en> list = bll.ExecuteStoreQuery<t_AlarmTable_en>(strsql).ToList();
                //更新在线时间
                strsql = "update t_CM_UserLogin set LoginDate='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserName='" + CurrentUser.UserName + "';";
                bll.ExecuteStoreCommand(strsql, null);
                int rowcount = list.Count;
                if (rowcount > 0)
                {
                    t_AlarmTable_en model = list[0];
                    string units = "℃";
                    if (model.TagID != 0 && model.TagID != null)
                    {
                        strsql = "select units from t_CM_PointsInfo p join t_CM_ValueType v on p.DataTypeID=v.DataTypeID where TagID=" + model.TagID;
                        List<string> listunits = bll.ExecuteStoreQuery<string>(strsql).ToList();
                        if (listunits.Count > 0)
                            units = listunits[0];
                    }
                    //
                    string sVal = "";
                    if (model.AlarmCate.Equals("开关量"))
                    {
                        sVal = (model.AlarmValue == 0) ? "关" : "开";
                    }
                    else
                    {
                        sVal = model.AlarmValue + " " + units;
                    }
                    strAlarmInfo = " <p class=\"content_size\"> <a href=\"/AlarmManage/Index?pid=0\" target=\"main_frame\">有<span class=\"am-badge am-badge-warning am-round item-feed-badge\" id=\"alarmNum\">" + rowcount + "</span>条【监测报警】，请立即处理...</a></p>";
                    //strAlarmInfo = " <p class=\"content_size\"><a href=\"/AlarmManage/Index?pid=0\" target=\"main_frame\" >有<span class=\"am-badge am-badge-warning am-round item-feed-badge\"><b>" + rowcount + "</span>条【监测报警】请立即处理..." + model.ALarmType + "</b>：</span>" + model.AlarmDate.Replace('/', '-') + " " + model.AlarmTime.Substring(0, 8) + "/" + model.Company + "/" + model.AlarmArea + "/" + model.AlarmAddress + "：" + sVal + "<br>......</a></p>";
                }
            }
            catch (Exception ex)
            {
                strAlarmInfo = ex.Message;
            }
            return Content(strAlarmInfo);
#endif
        }
        //获取通讯报警信息
        [Login]
        public ActionResult GetSysAlarmInfo()
        {
            string strAlarmInfo = "";
            try
            {
                string strPlist = HomeController.GetPID(CurrentUser.UNITList);
                //string strPlist = CurrentUser.PDRList;
                string strsql = "SELECT * FROM t_SM_StationStatusRealTime WHERE PID in (" + strPlist + ") order by State";
                List<t_SM_StationStatusRealTime> list = bll.ExecuteStoreQuery<t_SM_StationStatusRealTime>(strsql).ToList();
                string hasAlarm = "<div class=\"com_normal\"><img src=\"../Content/images/com_normal.png\" />通讯正常</div>";
                int state = 2, docount = 0;
                StringBuilder sbTraff = new StringBuilder();
                sbTraff.Append("<div class=\"com_list radius5\"><ul>");
                foreach (t_SM_StationStatusRealTime ol in list)
                {
                    state = (int)ol.State;
                    if (docount == 0 && state < 2)
                        hasAlarm = " <div class=\"com_abnormal\"><img src=\"../Content/images/com_abnormal.gif\" />通讯异常</div>";
                    sbTraff.Append("<li>" + ol.PDRName);
                    if (state < 2)
                        sbTraff.Append("<img src=\"../Content/Images/com_abnormal.png\" /></li>");
                    else
                        sbTraff.Append("<img src=\"../Content/Images/com_normal.png\" /></li>");
                    docount = 1;
                }
                sbTraff.Append("</ul><div><img src=\"../Content/Images/com_abnormalico.png\" /></div></div>");
                strAlarmInfo = hasAlarm;
                if (list.Count > 0)
                    strAlarmInfo = strAlarmInfo + sbTraff.ToString();
            }
            catch (Exception ex)
            {
                strAlarmInfo = "";
            }
            return Content(strAlarmInfo);
        }
        //根据权限获取功能模块
        [Login]
        public string GetMenuInfo()
        {
            StringBuilder sbMenu = new StringBuilder();
            int UserID = CurrentUser.UserID;
            string strsql = "select * from t_CM_Module where ModuleID in (select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")) and ParentID=0 order by SN";
            //string strsql = "select * from t_CM_Module where ParentID=0 order by SN";
            List<t_CM_Module> list = bll.ExecuteStoreQuery<t_CM_Module>(strsql).ToList();
            sbMenu.Append("<li id='m0'><a href=\"/Home/MapPage\" target=\"maincontent\"><label><img src=\"/Content/images/menu/home.png\" /></label>首页</a></li>");
            string strsecond = "", strmenu = "";
            foreach (t_CM_Module model in list)
            {
                strmenu = GetChildMenuInfo(model.ModuleID);
                if (!strmenu.Equals(""))
                {
                    sbMenu.Append("<li id=\"m" + model.ModuleID + "\"><a href=\"javascript:;\" _t_nav=\"hy" + model.ModuleID + "\"><label><img src=\"/Content/images/menu/" + model.Icon + "\" /></label>" + model.ModuleName + "</a></li>");
                    strsecond = strsecond + GetChildMenuInfo(model.ModuleID);
                }
                else
                    sbMenu.Append("<li id=\"m" + model.ModuleID + "\"><a href=\"" + model.Location + "\" target=\"maincontent\"><label><img src=\"/Content/images/menu/" + model.Icon + "\" /></label>" + model.ModuleName + "</a></li>");
            }
            sbMenu.Append("<li><a href=\"javascript::\" onclick=\"chgPwd()\" class=\"header_tc\"><label><img src=\"/Content/images/menu/mmxg.png\" /></label>修改密码</a></li>");
            sbMenu.Append("<li><a href=\"javascript::\" onclick=\"LoginOut()\" class=\"header_tc\"><label><img src=\"/Content/images/menu/exit.png\" /></label>注销</a></li>");
            return sbMenu.ToString() + "|" + strsecond;
        }
        //根据权限获取下一级功能模块
        private string GetChildMenuInfo(int mid)
        {
            StringBuilder sbMenu = new StringBuilder();
            int UserID = CurrentUser.UserID;
            string strsql = "select * from t_CM_Module where (Target='IFrame' or  Target='main_frame') and ModuleID in (select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")) and ParentID=" + mid + " order by SN";
            List<t_CM_Module> list = bll.ExecuteStoreQuery<t_CM_Module>(strsql).ToList();
            if (list.Count() > 0)
            {
                sbMenu.Append("<div id=\"hy" + mid + "\" class=\"nav-down-menu\" _t_nav=\"hy" + mid + "\">");
                sbMenu.Append("<div class=\"navigation-down-inner position" + mid + "\">");
                sbMenu.Append("<ul>");
                foreach (t_CM_Module model in list)
                {
                    sbMenu.Append("<li class='panel'><a href=\"" + model.Location + "\" target=\"maincontent\"><label><img src=\"/Content/images/menu/" + model.Icon + "\" /></label>" + model.ModuleName + "</a></li>");
                }
                sbMenu.Append("</ul></div></div>");
            }
            return sbMenu.ToString();
        }
        [Login]
        public ActionResult GetMenuInfoNew()
        {
            //StringBuilder sbMenu = new StringBuilder();
            if (CurrentUser != null)
            {
                int UserID = CurrentUser.UserID;
                string strsql = "select * from t_CM_Module where ModuleID in (select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")) and ParentID=0 order by SN";
                //string strsql = "select * from t_CM_Module where ParentID=0 order by SN";
                List<t_CM_Module> list = bll.ExecuteStoreQuery<t_CM_Module>(strsql).ToList();
                ViewData["list"] = list;
                foreach (t_CM_Module model in list)
                {
                    int mid = (int)model.ModuleID;
                    string strsql2 = "select * from t_CM_Module where (Target='IFrame' or  Target='main_frame') and ModuleID in (select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")) and ParentID=" + mid + " order by SN";
                    List<t_CM_Module> list2 = bll.ExecuteStoreQuery<t_CM_Module>(strsql2).ToList();
                    ViewData["list" + mid] = list2;
                }
            }
            return View();

        }
        //class menuInf
        //{
        //    public t_CM_Module moduleParent;
        //    public List<t_CM_Module> childern;
        //    public List<t_CM_RoleRight> disenableModule;
        //}
        [Login]
        public ActionResult GetMenuInfoJson()
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            if (null == CurrentUser)
            {
                return Content("{}");
            }
            string json = ModuleDAL.getInstance().GetMenuInfoJson(CurrentUser.UserID);
            sw.Stop();
            Debug.WriteLine("GetMenuInfoJson time:" + sw.Elapsed.ToString());
            return Content(json);
#if N_Redis
            //StringBuilder sbMenu = new StringBuilder();
            List<menuInf> listMenu = new List<menuInf>();
            if (CurrentUser != null)
            {
                int UserID = CurrentUser.UserID;
                string strsql = "select * from t_CM_Module where ModuleID in (select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")) and ParentID=0 order by SN";
                //string strsql = "select * from t_CM_Module where ParentID=0 order by SN";
                List<t_CM_Module> list = bll.ExecuteStoreQuery<t_CM_Module>(strsql).ToList();
                //ViewData["list"] = list;

                foreach (t_CM_Module model in list)
                {
                    menuInf menu = new menuInf();
                    listMenu.Add(menu);
                    menu.moduleParent = model;
                    int mid = (int)model.ModuleID;
                    string strsql2 = "select * from t_CM_Module where (Target='IFrame' or  Target='main_frame') and ModuleID in (select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")) and ParentID=" + mid + " order by SN";
                    List<t_CM_Module> list2 = bll.ExecuteStoreQuery<t_CM_Module>(strsql2).ToList();
                    //ViewData["list" + mid] = list2;
                    menu.childern = list2;
                    menu.disenableModule = bll.ExecuteStoreQuery<t_CM_RoleRight>("select * from t_CM_RoleRight where Disenable=1 and RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")").ToList();
                    //隐藏链接
                    var right = from c in menu.disenableModule where c.ModuleID == model.ModuleID && c.Disenable select c;
                    if (right.Count() > 0)
                    {
                        model.Location = "#";
                    }
                    foreach (var m in menu.childern)
                    {
                        right = from c in menu.disenableModule where c.ModuleID == m.ModuleID && c.Disenable select c;
                        if (right.Count() > 0)
                        {
                            m.Location = "#";
                        }
                    }
                }

            }
            string json = JsonConvert.SerializeObject(listMenu);
            listMenu.Clear();
            listMenu = null;
            return Content(json);
#endif
        }
        [Login]
        public ActionResult ReFlash()
        {
            return View();

        }
        //根据权限获取下一级功能模块
        //[Login]
        public string GetThirdMenuInfo(int mid)
        {
            StringBuilder sbMenu = new StringBuilder();
            if (CurrentUser != null)
            {

                int UserID = CurrentUser.UserID;
                string strsql = "select * from t_CM_Module where ModuleID in (select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")) and ParentID=" + mid + " order by SN";
                //List<t_CM_Module> list = bll.ExecuteStoreQuery<t_CM_Module>(strsql).ToList();            
                List<t_CM_Module> list = bll.ExecuteStoreQuery<t_CM_Module>(strsql).ToList();
                int count = 0;
                foreach (t_CM_Module model in list)
                {
                    count++;
                    sbMenu.Append("<li id=\"m" + model.ModuleID + "\"  onclick=\"setIframeUrl('" + model.Location + "'," + model.ModuleID + ");\" ");
                    if (count == 1)
                        sbMenu.Append(" class=\"current\" ");
                    sbMenu.Append(">" + model.ModuleName + "</li>");
                }
                return sbMenu.ToString();
            }
            return "";
        }
        public JsonResult GetThirdMenuInfo2(int mid)
        {
            StringBuilder sbMenu = new StringBuilder();
            if (CurrentUser != null)
            {

                int UserID = CurrentUser.UserID;
                string strsql = "select * from t_CM_Module where ModuleID in (select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + UserID + ")) and ParentID=" + mid + " order by SN";
                //List<t_CM_Module> list = bll.ExecuteStoreQuery<t_CM_Module>(strsql).ToList();            
                List<t_CM_Module> list = bll.ExecuteStoreQuery<t_CM_Module>(strsql).ToList();

                return Json(list);
            }
            return null;
        }
        [Login]
        public string CurrentUserName()
        {
            string username = CurrentUser.UserName;
            string logurl = CurrentUser.LogUrl;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            // string pdrlist = CurrentUser.PDRList;   // update by zzz 20161124
            if (logurl == "" || logurl == null)//如果没有设置logo
                logurl = "logo.png";
            return username + "$" + logurl + "$" + pdrlist;
        }
        public class DeviceType
        {
            public int DID { get; set; }
            public string DeviceName { get; set; }
            public string TypeName { get; set; }
            public int OrderBy { get; set; }
        }
        public class PointsType
        {
            public int DataTypeID { get; set; }
            public string TypeName { get; set; }
        }
        public class AccordionInfo
        {
            public int PID { get; set; }
            public string Name { get; set; }
            public string Areaname { get; set; }
            public string Typename { get; set; }
            public string Coordination { get; set; }
        }

        //public t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}
        public class MenuFormatInfo1
        {
            public string Areaname { get; set; }
            public List<MenuFormatInfo2> MenuInfo2 = new List<MenuFormatInfo2>();
        }
        public class MenuFormatInfo2
        {
            public string Typename { get; set; }
            public List<MenuFormatInfo3> MenuInfo3 = new List<MenuFormatInfo3>();
        }
        public class MenuFormatInfo3
        {
            public int PID { get; set; }
            public string Name { get; set; }
            //public string Coordination { get; set; }
            public double Coordination_X { get; set; }
            public double Coordination_Y { get; set; }
        }


        public JsonResult GetPDFTypeCharts()
        {
            string PIDS = HomeController.GetPID(CurrentUser.UNITList);
            List<int?> pids = PIDS.Split(',').ToList().ConvertAll<int?>(i => Convert.ToInt32(i)).Distinct().ToList();
            if (string.IsNullOrEmpty(PIDS))
                return Json("");
            string sql = "select COUNT(*) as sums,b.TypeName as Name from t_CM_PDRInfo a inner join t_CM_PDRType b on a.TypeID=b.TypeID WHERE a.PID IN (" + PIDS + ") group by b.TypeName";
            var reslut = bll.ExecuteStoreQuery<pdfcharts>(sql);
            sums s = new sums();

            s.alarmCount = bll.t_AlarmTable_en.Where(p => pids.Contains(p.PID) && p.AlarmState != 0).Count();
            var alarmIDs = bll.t_CM_BugInfo.Where(p => pids.Contains(p.PID)).Select(p => p.AlarmID).ToList();
            s.bugCount = bll.t_AlarmTable_en.Where(p => alarmIDs.Contains(p.AlarmID) && p.AlarmState != 0).Count();
            s.communicationCount = bll.t_SM_StationStatusRealTime.Where(p => p.State != 2).Count();
            return Json(new { tubiao = reslut, count = s });
        }
        public class pdfcharts
        {
            public int sums { get; set; }
            public string Name { get; set; }
        }
        public class sums
        {
            public decimal alarmCount { get; set; }
            public decimal communicationCount { get; set; }
            public decimal bugCount { get; set; }
        }
        public JsonResult GetAlarmCharts()
        {
            string PIDS = HomeController.GetPID(CurrentUser.UNITList);
            if (string.IsNullOrEmpty(PIDS))
                return Json("");
            string sql = "select COUNT(*) as sums,CONVERT(nvarchar(50), MONTH(AlarmDateTime)) as Name from t_AlarmTable_en WHERE ALarmType='报警' AND PID IN (" + PIDS + ") group by MONTH(AlarmDateTime)";
            var reslut = bll.ExecuteStoreQuery<pdfcharts>(sql);
            return Json(reslut);
        }
        #region 用户地图


        [Login]
        public ActionResult UnitListData()
        {
            string ustr = string.Empty;
            ustr = GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Content("");
            //string PDRList = HomeController.GetPID(CurrentUser.UNITList);
            //string sql="SELECT DISTINCT t_CM_PDRInfo.UnitID FROM t_CM_PDRInfo WHERE PID IN ("+pdlist+")";
            string sql = "SELECT a.*,b.IndustryName FROM t_CM_Unit a left join t_ES_Industry b on a.IndustryID=b.IndustryID  WHERE UnitID IN (" + ustr + ")";
            //string sql = "SELECT * FROM t_CM_Unit";
            List<m> list = bll.ExecuteStoreQuery<m>(sql).ToList();
            foreach (var item in list)
            {
                var l = bll.t_ES_UsePlan.Where(p => p.unid == item.UnitID).GroupBy(p => p.categoryID).ToList();
                foreach (var i in l)
                {
                    decimal? v = i.Sum(p => p.plan);

                    int key = Convert.ToInt32(i.Key);
                    string name = bll.t_ES_Category.Where(p => p.id == key).FirstOrDefault().category_name;
                    UserPlan mm = new UserPlan();
                    mm.CName = name;
                    mm.SumPlan = v;
                    item.listPlan.Add(mm);
                }
                List<int?> x = bll.t_CM_PDRInfo.Where(p => p.UnitID == item.UnitID).Select(p => p.VoltageID).Distinct().ToList();
                string dianya = "", type = "";
                List<decimal> dianyal = new List<decimal>();
                foreach (var i in x)
                {
                    t_ES_ElecVoltages v = bll.t_ES_ElecVoltages.Where(p => p.VoltageID == i).FirstOrDefault();
                    if (v != null)
                    {

                        if (v.VoltageName.Contains("/"))
                        {
                            dianya = v.VoltageName;
                        }
                        else
                        {
                            if (v.VoltageName.Contains("V"))
                            {
                                if (v.VoltageName.Contains("kV"))
                                {
                                    dianyal.Add(Convert.ToDecimal(v.VoltageName.Replace("kV", "").Trim()));
                                }
                                else
                                {
                                    dianyal.Add(Convert.ToDecimal(v.VoltageName.Replace("V", "").Trim()));
                                }
                            }
                        }
                    }
                }
                if (dianya.Contains("/"))
                {

                }
                else
                {
                    foreach (var i in dianyal.OrderByDescending(o => o))
                    {
                        dianya += i + "/";
                    }
                    if (dianya != "")
                        dianya = dianya.Substring(0, dianya.Length - 1);
                    dianya += "kV";
                }
                List<int?> xx = bll.t_CM_PDRInfo.Where(p => p.UnitID == item.UnitID).Select(p => p.IndID).Distinct().ToList();
                foreach (var i in xx)
                {
                    t_ES_ElecIndustry inn = bll.t_ES_ElecIndustry.Where(p => p.IndID == i).FirstOrDefault();
                    if (inn != null)
                    {
                        type += inn.IndName + "、";
                    }
                }
                List<int?> pids = bll.t_CM_PDRInfo.Where(p => p.UnitID == item.UnitID).Select(p => p.PID).Distinct().ToList().ConvertAll<int?>(i => i);
                var count = bll.t_AlarmTable_en.Where(p => pids.Contains(p.PID)).OrderByDescending(p => p.AlarmState).FirstOrDefault();
                if (count != null)
                {
                    item.isAlarm = count.AlarmState.Value;
                }

                if (type != "")
                    type = type.Substring(0, type.Length - 1);
                item.DType = type;

                item.dianya = dianya;
            }
            //string strJson = Common.ComboboxToJson(list);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public class m : t_CM_Unit
        {
            public m()
            {
                listPlan = new List<UserPlan>();
                isAlarm = 0;
            }
            public string IndustryName { get; set; }
            public string dianya { get; set; }
            public string DType { get; set; }
            public List<UserPlan> listPlan { get; set; }
            public string UnitProjectTypeName { get; set; }
            public int isAlarm { get; set; }

        }
        public class UserPlan
        {
            public decimal? SumPlan { get; set; }
            public string CName { get; set; }
        }

        public ActionResult GetPdfListByUID(int id)
        {
            List<t_CM_PDRInfo> list = new List<t_CM_PDRInfo>();
            m unit = new m();
            using (var db = new pdermsWebEntities())
            {
                string PDRList = bll.t_CM_Unit.Where(p => p.UnitID == id).Select(p => p.PDRList).FirstOrDefault();
                string sqlpdr = "";
                if (!string.IsNullOrEmpty(PDRList))
                {
                    sqlpdr = "select * from t_CM_PDRInfo a where a.PID IN(" + PDRList + ")";

                    list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sqlpdr).ToList();
                }
                string sql = "SELECT a.*,b.IndustryName FROM t_CM_Unit a inner join t_ES_Industry b on a.IndustryID=b.IndustryID  WHERE UnitID=" + id + "";
                unit = bll.ExecuteStoreQuery<m>(sql).FirstOrDefault();
                List<int?> x = bll.t_CM_PDRInfo.Where(p => p.UnitID == unit.UnitID).Select(p => p.VoltageID).Distinct().ToList();
                string dianya = "", type = "";

                foreach (var i in x)
                {
                    t_ES_ElecVoltages v = bll.t_ES_ElecVoltages.Where(p => p.VoltageID == i).FirstOrDefault();
                    if (v != null)
                    {
                        dianya += v.VoltageName + "、";
                    }
                }

                List<int?> xx = bll.t_CM_PDRInfo.Where(p => p.UnitID == unit.UnitID).Select(p => p.IndID).Distinct().ToList();
                foreach (var i in xx)
                {
                    t_ES_ElecIndustry inn = bll.t_ES_ElecIndustry.Where(p => p.IndID == i).FirstOrDefault();
                    if (inn != null)
                    {
                        type += inn.IndName + "、";
                    }
                }
                if (type != "")
                    type = type.Substring(0, type.Length - 1);
                if (dianya != "")
                    dianya = dianya.Substring(0, dianya.Length - 1);
                unit.DType = type;
                unit.dianya = dianya;
            }
            return Json(new { list = list, unit = unit });
        }

        [Login]
        public ActionResult getUnitAlarm()
        {
            try
            {
                string ustr = string.Empty;
                ustr = GetUID();
                if (string.IsNullOrEmpty(ustr))
                    return Content("");
                string sql = "SELECT a.*,b.IndustryName FROM t_CM_Unit a left join t_ES_Industry b on a.IndustryID=b.IndustryID  WHERE UnitID IN (" + ustr + ")";
                //string sql = "SELECT * FROM t_CM_Unit";
                List<m> list = bll.ExecuteStoreQuery<m>(sql).ToList();
                foreach (var item in list)
                {
                    List<int?> pids = bll.t_CM_PDRInfo.Where(p => p.UnitID == item.UnitID).Select(p => p.PID).Distinct().ToList().ConvertAll<int?>(i => i);
                    var count = bll.t_AlarmTable_en.Where(p => pids.Contains(p.PID)).OrderByDescending(p => p.AlarmState).FirstOrDefault();
                    if (count != null)
                    {
                        item.isAlarm = count.AlarmState.Value;
                    }
                }
                var result = from s in list
                             select new
                             {
                                 isAlarm = s.isAlarm,
                                 UnitName = s.UnitName,
                                 Type = s.Type
                             };

                //string strJson = Common.ComboboxToJson(list);
                return Json(result);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        /// <summary>
        /// 配电房报警状态实体
        /// </summary>
        public class UnitAlarmState
        {
            public int typeid { set; get; }
            public int state { set; get; }
            public string name { set; get; }
            public int pid { set; get; }
            public int UnitID { get; set; }
        }
        public ActionResult GetUnitByUID(int id)
        {
            t_CM_Unit unit = bll.t_CM_Unit.Where(p => p.UnitID == id).FirstOrDefault();
            return Json(unit);
        }

        #endregion

        //根据权限获取站室
        public static string GetPID(string UNITList)
        {
            string ustr = string.Empty;
            if (string.IsNullOrEmpty(UNITList))
                return "";
            string str = "";
            using (HomeController h = new HomeController())
            {

                using (pdermsWebEntities bll = new pdermsWebEntities())
                {

                    if (h.CurrentUser.RoleID == 1)
                    {
                        List<t_CM_PDRInfo> list = new List<t_CM_PDRInfo>();
                        string strsql = "select * from  t_CM_PDRInfo";
                        list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(strsql).ToList();
                        foreach (var item in list)
                        {
                            str += item.PID + ",";
                        }
                        if (!string.IsNullOrEmpty(str))
                            str = str.Substring(0, str.Length - 1);
                        return str;
                    }
                    else
                    {
                        if (Convert.ToBoolean(h.CurrentUser.IsAdmin))
                        {
                            string unlist = "";
                            var Ulist = bll.t_CM_UserInfo.Where(p => p.UID == h.CurrentUser.UID).ToList();
                            foreach (var item in Ulist)
                            {
                                if (!string.IsNullOrEmpty(item.UNITList))
                                    unlist += item.UNITList + ",";
                            }
                            if (!string.IsNullOrEmpty(unlist))
                                unlist = unlist.Substring(0, unlist.Length - 1);

                            ustr = unlist;
                        }
                        else
                        {
                            ustr = UNITList;
                        }
                    }



                    var unitlist = bll.ExecuteStoreQuery<t_CM_Unit>("SELECT * FROM t_CM_Unit WHERE UnitID IN (" + ustr + ")").ToList();
                    foreach (var item in unitlist)
                    {
                        if (!string.IsNullOrEmpty(item.PDRList))
                            str += item.PDRList + ",";
                    }
                    if (!string.IsNullOrEmpty(str))
                        str = str.Substring(0, str.Length - 1);
                }

            }
            return str;
        }

        //根据权限获取单位
        public static string GetUID()
        {
            string ustr = string.Empty;

            using (HomeController h = new HomeController())
            {
                using (var bll = new pdermsWebEntities())
                {
                    if (h.CurrentUser.RoleID == 1)
                    {
                        List<t_CM_Unit> ulist = new List<t_CM_Unit>();
                        string unlist = "";
                        string strsql1 = "select * from  t_CM_Unit";
                        ulist = bll.ExecuteStoreQuery<t_CM_Unit>(strsql1).ToList();
                        foreach (var item in ulist)
                        {
                            unlist += item.UnitID + ",";
                        }
                        if (!string.IsNullOrEmpty(unlist))
                            unlist = unlist.Substring(0, unlist.Length - 1);

                        ustr = unlist;
                    }
                    else
                    {
                        if (Convert.ToBoolean(h.CurrentUser.IsAdmin))
                        {
                            string unlist = "";
                            var Ulist = bll.t_CM_UserInfo.Where(p => p.UID == h.CurrentUser.UID && p.RoleID != 1).ToList();
                            foreach (var item in Ulist)
                            {
                                if (!string.IsNullOrEmpty(item.UNITList))
                                    unlist += item.UNITList + ",";
                            }
                            if (!string.IsNullOrEmpty(unlist))
                                unlist = unlist.Substring(0, unlist.Length - 1);

                            ustr = unlist;
                        }
                        else
                        {
                            ustr = h.CurrentUser.UNITList;
                        }
                    }
                }
            }
            return ustr;

        }
        public static string GetUserID()
        {
            string str = string.Empty;
            using (HomeController h = new HomeController())
            {
                using (var bll = new pdermsWebEntities())
                {
                    IQueryable<t_CM_UserInfo> list = bll.t_CM_UserInfo;
                    if (h.CurrentUser.RoleID == 1)
                    {
                    }
                    else
                    {
                        if (Convert.ToBoolean(h.CurrentUser.IsAdmin))
                        {
                            list = bll.t_CM_UserInfo.Where(p => p.UID == h.CurrentUser.UID && p.RoleID != 1);
                        }
                        else
                        {
                            list = bll.t_CM_UserInfo.Where(p => p.UserID == h.CurrentUser.UserID);
                        }
                    }
                    foreach (var item in list)
                    {
                        str += item.UserID + ",";
                    }
                    if (!string.IsNullOrEmpty(str))
                        str = str.Substring(0, str.Length - 1);
                }

            }
            return str;
        }
        public ActionResult UnitSelect()
        {
            string ustr = string.Empty;
            ustr = GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Content("");
            string sql = "SELECT * FROM t_CM_Unit WHERE UnitID IN (" + ustr + ")";
            List<t_CM_Unit> list = bll.ExecuteStoreQuery<t_CM_Unit>(sql).ToList();
            var result = from r in list
                         select new
                         {
                             r.UnitID,
                             r.UnitName,
                             r.LinkAddress
                         };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #region 前台接口
        /// <summary>
        /// 获取站状态
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        //public JsonResult GetStationStateByPid(int uid)
        //{
        //    PdfState model = new PdfState();
        //    try
        //    {
        //        //string uids = GetAllUnit();
        //        string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
        //        var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
        //        //var pidlist = pids.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
        //        var list = bll.t_AlarmTable_en.Where(p => pidlist.Contains(p.PID) && p.AlarmState != 0).OrderByDescending(p => p.AlarmDateTime);
        //        var pdflist = bll.t_CM_PDRInfo.Where(p => pidlist.Contains(p.PID)).OrderByDescending(p => p.ApplcationTime);
        //        var cidsss = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == 12 && pidlist.Contains(p.pid)).ToList();
        //        List<int?> cidlist = new List<int?>();
        //        string s = "";
        //        foreach (var xssss in cidsss)
        //        {
        //            s += xssss.cid + ",";
        //        }
        //        if (s != "")
        //        {
        //            s = s.Substring(0, s.Length - 1);
        //            cidlist = s.Split(',').ToList().Distinct().ToList().ConvertAll<int?>(p => int.Parse(p));
        //        }
        //        if (list.Count() > 0)
        //        {
        //            model.Name = "严重";
        //            model.NormalDays = list.FirstOrDefault().AlarmDateTime.ToString();
        //        }
        //        else
        //        {
        //            var list_yunxing = bll.t_AlarmTable_en.Where(p => pidlist.Contains(p.PID) && p.AlarmState == 0).OrderByDescending(p => p.AlarmDateTime);
        //            int days = 0;
        //            if (list_yunxing.Count() > 0)
        //            {
        //                DateTime start = Convert.ToDateTime(Convert.ToDateTime(list_yunxing.FirstOrDefault().AlarmDateTime).ToShortDateString());
        //                DateTime end = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString());
        //                TimeSpan sp = end.Subtract(start);
        //                days = sp.Days;
        //            }
        //            else
        //            {
        //                if (pdflist.Count() > 0)
        //                {
        //                    DateTime start = Convert.ToDateTime(Convert.ToDateTime(pdflist.FirstOrDefault().ApplcationTime).ToShortDateString());
        //                    DateTime end = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString());
        //                    TimeSpan sp = end.Subtract(start);
        //                    days = sp.Days;
        //                }
        //            }
        //            model.Name = "正常运行";
        //            model.NormalDays = days.ToString();
        //        }
        //        if (pdflist.Count() > 0)
        //        {
        //            string checkDays = "--";
        //            DateTime start;
        //            DateTime end;
        //            var order = bll.t_PM_Order.Where(p => pidlist.Contains(p.PID) && p.OrderContent.Contains("检修试验") && p.OrderState == 0).OrderByDescending(p => p.AcceptedDate);
        //            if (order.Count() > 0)
        //            {
        //                start = Convert.ToDateTime(Convert.ToDateTime(order.FirstOrDefault().AcceptedDate).AddMonths(6).ToShortDateString());
        //                end = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString());

        //            }
        //            else
        //            {

        //                //if (Convert.ToDateTime(pdflist.FirstOrDefault().ApplcationTime).AddMonths(6) < DateTime.Now)
        //                //    start = DateTime.Now.AddMonths(6);
        //                //else
        //                //    start = Convert.ToDateTime(Convert.ToDateTime(pdflist.FirstOrDefault().ApplcationTime).AddMonths(6).ToShortDateString());
        //                if (pdflist.FirstOrDefault().ApplcationTime == null)
        //                {
        //                    model.CheckDays = checkDays;
        //                }
        //                else
        //                {
        //                    start = GetDatime(pdflist.FirstOrDefault().ApplcationTime.Value);
        //                    end = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString());
        //                    TimeSpan sp = start.Subtract(end);
        //                    checkDays = sp.Days.ToString();
        //                    model.CheckDays = checkDays;
        //                }


        //            }

        //        }
        //        decimal SumScore = 0;
        //        foreach (var item in pidlist)
        //        {
        //            var sids = bll.t_CM_InstallRecord.Where(p => p.pid == item).Select(p => p.contentId).ToList();
        //            SumScore += Convert.ToDecimal(bll.t_CM_InstallType.Where(p => sids.Contains(p.id)).Sum(p => p.score));
        //        }
        //        model.Score = GetUnitScoreByUID(uid);

        //        DateTime d = DateTime.Now.Date;
        //        DateTime xd = DateTime.Now;
        //        var xzzz = bll.t_EE_PowerQualityDaily.Where(p => p.RecordTime >= d && p.RecordTime <= xd && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
        //        if (xzzz != null)
        //        {
        //            model.thisDayPower = Math.Round(xzzz.Value, 2);
        //        }
        //        else
        //        {
        //            model.thisDayPower = 0;
        //        }
        //        if (model.thisDayPower == null)
        //            model.thisDayPower = 0;
        //        DateTime lastsd = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
        //        DateTime lasted = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour - 1, 0, 0);
        //        var lastDayPower = bll.t_EE_PowerQualityDaily.Where(p => p.RecordTime >= lastsd && p.RecordTime <= lasted && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
        //        if (lastDayPower != 0)
        //        {
        //            model.thisDayOccupation = Math.Round(Convert.ToDecimal(model.thisDayPower / lastDayPower * 100), 2);
        //        }
        //        DateTime dgh = DateTime.Now.AddMonths(-1);
        //        DateTime dd = new DateTime(dgh.Year, dgh.Month, 1);
        //        var xsss = bll.t_EE_PowerQualityMonthly.Where(p => p.RecordTime.Value.Month == d.Month && p.RecordTime.Value.Year == dd.Year && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
        //        if (xsss != null)
        //        {
        //            model.thisMonthPower = Math.Round(xsss.Value, 2);
        //        }
        //        else
        //        {
        //            model.thisMonthPower = 0;
        //        }
        //        DateTime lastssd = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, 1);

        //        var lastMonthPower = bll.t_EE_PowerQualityMonthly.Where(p => p.RecordTime.Value.Month == lastssd.Month && p.RecordTime.Value.Year == lastssd.Year && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
        //        if (lastMonthPower != 0)
        //        {   
        //            model.thisMonthOccupation = Math.Round(Convert.ToDecimal(model.thisMonthPower / lastMonthPower * 100), 2);
        //        }
        //        int dayy = DateTime.DaysInMonth(dgh.Year, dgh.Month);
        //        // DateTime ddd = new DateTime(DateTime.Now.Year, DateTime.Now.Month - 1, dayy);
        //        DateTime ddd = DateTime.Now;
        //        DateTime sddd = new DateTime(DateTime.Now.Year, 1, 1);
        //        var sumYearPower = bll.t_EE_PowerQualityMonthly.Where(p => p.RecordTime >= sddd && p.RecordTime <= ddd && pidlist.Contains(p.PID)).Sum(p => p.UsePower);
        //        var lastPower = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().LastYearPower;
        //        model.thisPowerLastYear = Math.Round(Convert.ToDecimal(sumYearPower / lastPower * 100), 2);
        //        //List<int?> cids = GetcidByPID(pids);


        //        var cids = bll.t_DM_DeviceInfo.Where(p => pidlist.Contains(p.PID) && p.C != null && p.C != "").Select(p => p.C).ToList().ConvertAll<int?>(i => int.Parse(i));
        //        var dbbb = bll.t_DM_CircuitInfo.Where(p => pidlist.Contains(p.PID)).Select(p => p.CID).ToList();
        //        //总负载   
        //        //model.Sumload = bll.t_EE_PowerQualityRealTime.Where(p => pidlist.Contains(p.PID) && cids.Contains(p.CID)).Sum(p => p.Power);
        //        var z = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().InstalledCapacitys;
        //        model.RongL = z;
        //        decimal? suml = 0;
        //        foreach (var item in pidlist)
        //        {
        //            var bianyaqilist = bll.t_DM_DeviceInfo.Where(p => p.PID == item && p.DTID == 3).ToList();
        //            foreach (var by in bianyaqilist)
        //            {
        //                if (!string.IsNullOrEmpty(by.C))
        //                {
        //                    int ciddd = Convert.ToInt32(by.C);
        //                    var dbb = bll.t_DM_CircuitInfo.Where(p => p.DID == ciddd && p.PID == item).FirstOrDefault();
        //                    if (dbb != null)
        //                    {
        //                        int cid = dbb.CID;
        //                        if (cid != 0)
        //                        {
        //                            var ss = bll.t_EE_PowerQualityRealTime.Where(p => p.PID == item && p.CID == cid).OrderByDescending(p => p.RecordTime).FirstOrDefault();
        //                            if (ss != null)
        //                            {
        //                                if (ss.Power != null)
        //                                {
        //                                    suml += ss.Power;
        //                                    anwyis m = new anwyis();

        //                                    m.zhanbiEvery = ss.Power / z * 100;
        //                                    if (Convert.ToDecimal(by.Z) != 0 && !string.IsNullOrEmpty(by.Z))
        //                                        m.viewEvery = ss.Power / Convert.ToDecimal(by.Z) * 100;
        //                                    m.CName = bll.t_CM_PDRInfo.Where(p => p.PID == item).FirstOrDefault().Name + "_" + by.DeviceName;
        //                                    model.fuzaiView.Add(m);

        //                                }
        //                            }
        //                        }
        //                    }
        //                }

        //            }
        //        }
        //        model.Sumload = suml;
        //        var fuzai = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID) && dbbb.Contains(p.CID.Value) && p.RecordTime >= d && p.RecordTime <= xd).GroupBy(p => p.RecordTime).ToList();

        //        decimal? maxfuzai = 0;
        //        string maxT = "";
        //        for (int i = 0; i < fuzai.Count(); i++)
        //        {
        //            if (i == 0)
        //            {
        //                maxfuzai = fuzai[i].Sum(p => p.Power);
        //                maxT = fuzai[i].Key.ToString();
        //            }
        //            else
        //            {
        //                if (fuzai[i].Sum(p => p.Power) > maxfuzai)
        //                {
        //                    maxfuzai = fuzai[i].Sum(p => p.Power);
        //                    maxT = fuzai[i].FirstOrDefault().NeedPowerTime.ToString();
        //                }
        //            }
        //        }
        //        model.MaxLoad = maxfuzai;
        //        model.maxTime = maxT;

        //        //总负载率

        //        if (z != 0 && z != null)
        //        {
        //            model.RatedCapacity = Math.Round((model.Sumload / z * 100).Value, 2);
        //        }


        //        model.BianYacount = bll.t_DM_DeviceInfo.Where(p => pidlist.Contains(p.PID) && p.DTID == 3).Count();

        //        model.Diancount = bll.t_CM_PointsInfo.Where(p => pidlist.Contains(p.PID)).Count();

        //        //var xss = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().InstalledCapacitys;
        //        //var sss = bll.t_DM_DeviceInfo.Where(p => pidlist.Contains(p.PID) && p.DTID == 3).GroupBy(p => p.PID);
        //        //foreach (var it in sss)
        //        //{
        //        //    decimal? cc = bll.t_DM_DeviceInfo.Where(p => p.PID == it.Key && p.Z != "" && p.Z != null).Select(p => p.Z).ToList().ConvertAll<decimal>(i => decimal.Parse(i)).Sum(p => p);
        //        //    if (cc == null)
        //        //        cc = 0;
        //        //    anwyis m = new anwyis();
        //        //    if (cc != 0)
        //        //    {
        //        //        var xz = bll.t_EE_PowerQualityRealTime.Where(p => p.PID == it.Key && cids.Contains(p.CID)).Sum(p => p.Power);
        //        //        m.zhanbiEvery = Math.Round((xz / model.Sumload * 100).Value, 2);
        //        //        m.viewEvery = xz / cc * 100;
        //        //        m.CName = bll.t_CM_PDRInfo.Where(p => p.PID == it.Key).FirstOrDefault().Name;
        //        //        model.fuzaiView.Add(m);
        //        //    }

        //        //}

        //        foreach (var iii in pidlist)
        //        {
        //            decimal? sum2 = 0;
        //            pdfview pdf = new pdfview();
        //            var bianyaqilist = bll.t_DM_DeviceInfo.Where(p => p.PID == iii && p.DTID == 3).ToList();
        //            pdf.bianyaCount = bianyaqilist.Count();
        //            if (bianyaqilist.Count != 0)
        //            {
        //                var zj = bianyaqilist.Where(p => p.Z != "" && p.Z != null).Select(p => p.Z).ToList();
        //                if (zj.Count != 0)
        //                    pdf.zhaungji = zj.ConvertAll<decimal?>(p => decimal.Parse(p)).Sum(p => p);
        //                else
        //                    pdf.zhaungji = 0;
        //            }
                
        //            foreach (var by in bianyaqilist)
        //            {
        //                if (!string.IsNullOrEmpty(by.C))
        //                {
        //                    int ciddd = Convert.ToInt32(by.C);
        //                    var dbb = bll.t_DM_CircuitInfo.Where(p => p.DID == ciddd && p.PID == iii).FirstOrDefault();
        //                    if (dbb != null)
        //                    {
        //                        int cid = dbb.CID;
        //                        if (cid != 0)
        //                        {
        //                            var ss = bll.t_EE_PowerQualityDaily.Where(p => p.PID == iii && p.CID == cid).OrderByDescending(p => p.RecordTime).FirstOrDefault();
        //                            if (ss != null)
        //                            {
        //                                if (ss.Power != null)
        //                                {
        //                                    sum2 += ss.Power;
        //                                    anwyis v = new anwyis();
        //                                    if (pdf.zhaungji != 0)
        //                                        v.zhanbiEvery = Math.Round((ss.Power / pdf.zhaungji * 100).Value, 2);
        //                                    v.CName = by.DeviceName;
        //                                    pdf.fuzaiView.Add(v);

        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //            if (bll.t_CM_PDRInfo.Where(p => p.PID == iii).FirstOrDefault() != null)
        //                pdf.PName = bll.t_CM_PDRInfo.Where(p => p.PID == iii).FirstOrDefault().Name;
        //            pdf.pointCount = bll.t_CM_PointsInfo.Where(p => p.PID == iii).Count();
        //            if (pdf.zhaungji != 0)
        //                pdf.fuzailv = Math.Round((sum2 / pdf.zhaungji * 100).Value, 2);
        //            model.pdfList.Add(pdf);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return Json(model);
        //}


        public JsonResult GetStationState(int uid)
        {
            PdfState model = new PdfState();
            try
            {
                string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
                var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
                //var pidlist = pids.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
                var list = bll.t_AlarmTable_en.Where(p => pidlist.Contains(p.PID) && p.AlarmState != 0).OrderByDescending(p => p.AlarmDateTime);
                var pdflist = bll.t_CM_PDRInfo.Where(p => pidlist.Contains(p.PID)).OrderByDescending(p => p.ApplcationTime);
                if (list.Count() > 0)
                {
                    model.Name = "严重";
                    model.NormalDays = "0";
                }
                else
                {
                    var list_yunxing = bll.t_AlarmTable_en.Where(p => pidlist.Contains(p.PID) && p.AlarmState == 0).OrderByDescending(p => p.AlarmDateTime);
                    int days = 0;
                    if (list_yunxing.Count() > 0)
                    {
                        DateTime start = Convert.ToDateTime(Convert.ToDateTime(list_yunxing.FirstOrDefault().AlarmDateTime).ToShortDateString());
                        DateTime end = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString());
                        TimeSpan sp = end.Subtract(start);
                        days = sp.Days;
                    }
                    else
                    {
                        if (pdflist.Count() > 0)
                        {
                            DateTime start = Convert.ToDateTime(Convert.ToDateTime(pdflist.FirstOrDefault().ApplcationTime).ToShortDateString());
                            DateTime end = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString());
                            TimeSpan sp = end.Subtract(start);
                            days = sp.Days;
                        }
                    }
                    model.Name = "正常运行";
                    model.NormalDays = days.ToString();
                }
                if (pdflist.Count() > 0)
                {
                    string checkDays = "--";
                    DateTime start;
                    DateTime end;
                    var order = bll.t_PM_Order.Where(p => pidlist.Contains(p.PID) && p.OrderContent.Contains("检修试验") && p.OrderState == 0).OrderByDescending(p => p.AcceptedDate);
                    if (order.Count() > 0)
                    {
                        start = Convert.ToDateTime(Convert.ToDateTime(order.FirstOrDefault().AcceptedDate).AddMonths(6).ToShortDateString());
                        end = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString());

                    }
                    else
                    {

                        //if (Convert.ToDateTime(pdflist.FirstOrDefault().ApplcationTime).AddMonths(6) < DateTime.Now)
                        //    start = DateTime.Now.AddMonths(6);
                        //else
                        //    start = Convert.ToDateTime(Convert.ToDateTime(pdflist.FirstOrDefault().ApplcationTime).AddMonths(6).ToShortDateString());
                        if (pdflist.FirstOrDefault().ApplcationTime == null)
                        {
                            model.CheckDays = checkDays;
                        }
                        else
                        {
                            start = GetDatime(pdflist.FirstOrDefault().ApplcationTime.Value);
                            end = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString());
                            TimeSpan sp = start.Subtract(end);
                            checkDays = sp.Days.ToString();
                            model.CheckDays = checkDays;
                        }


                    }

                }
                decimal SumScore = 0;
                foreach (var item in pidlist)
                {
                    var sids = bll.t_CM_InstallRecord.Where(p => p.pid == item).Select(p => p.contentId).ToList();
                    SumScore += Convert.ToDecimal(bll.t_CM_InstallType.Where(p => sids.Contains(p.id)).Sum(p => p.score));
                }
                model.Score = GetUnitScoreByUID(uid);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetThisDayPower(int uid)
        {
            PdfState model = new PdfState();
            try
            {
                string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
                var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
              
                var cidsss = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == 12 && pidlist.Contains(p.pid)).ToList();
                List<int?> cidlist = new List<int?>();
                string s = "";
                foreach (var xssss in cidsss)
                {
                    s += xssss.cid + ",";
                }
                if (s != "")
                {
                    s = s.Substring(0, s.Length - 1);
                    cidlist = s.Split(',').ToList().Distinct().ToList().ConvertAll<int?>(p => int.Parse(p));
                }

                DateTime d = DateTime.Now.Date;
                DateTime xd = DateTime.Now;
                var xzzz = bll.t_EE_PowerQualityDaily.Where(p => p.RecordTime >= d && p.RecordTime <= xd && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
                if (xzzz != null)
                {
                    model.thisDayPower = Math.Round(xzzz.Value, 2);
                }
                else
                {
                    model.thisDayPower = 0;
                }
                if (model.thisDayPower == null)
                    model.thisDayPower = 0;
                DateTime lastsd = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
                DateTime lasted = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour - 1, 0, 0);
                var lastDayPower = bll.t_EE_PowerQualityDaily.Where(p => p.RecordTime >= lastsd && p.RecordTime <= lasted && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
                if (lastDayPower != 0)
                {
                    model.thisDayOccupation = Math.Round(Convert.ToDecimal(model.thisDayPower / lastDayPower * 100), 2);
                }
            }catch(Exception ex)
            {
                throw ex;
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLastMonthPower(int uid)
        {
            PdfState model = new PdfState();
            try
            {
                string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
                var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
           
                var cidsss = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == 12 && pidlist.Contains(p.pid)).ToList();
                List<int?> cidlist = new List<int?>();
                string s = "";
                foreach (var xssss in cidsss)
                {
                    s += xssss.cid + ",";
                }
                if (s != "")
                {
                    s = s.Substring(0, s.Length - 1);
                    cidlist = s.Split(',').ToList().Distinct().ToList().ConvertAll<int?>(p => int.Parse(p));
                }
                DateTime d = DateTime.Now.Date;
                DateTime dgh = DateTime.Now.AddMonths(-1);
                DateTime dd = new DateTime(dgh.Year, dgh.Month, 1);
                var xsss = bll.t_EE_PowerQualityMonthly.Where(p => p.RecordTime.Value.Month == d.Month && p.RecordTime.Value.Year == dd.Year && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
                if (xsss != null)
                {
                    model.thisMonthPower = Math.Round(xsss.Value, 2);
                }
                else
                {
                    model.thisMonthPower = 0;
                }
                DateTime lastssd = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, 1);

                var lastMonthPower = bll.t_EE_PowerQualityMonthly.Where(p => p.RecordTime.Value.Month == lastssd.Month && p.RecordTime.Value.Year == lastssd.Year && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
                if (lastMonthPower != 0)
                {
                    model.thisMonthOccupation = Math.Round(Convert.ToDecimal(model.thisMonthPower / lastMonthPower * 100), 2);
                }
            }catch(Exception ex)
            {
                throw ex;
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetThisYearPower(int uid)
        {
            PdfState model = new PdfState();
            try
            {
                string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
                var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
                DateTime ddd = DateTime.Now;
                DateTime sddd = new DateTime(DateTime.Now.Year, 1, 1);
                var sumYearPower = bll.t_EE_PowerQualityMonthly.Where(p => p.RecordTime >= sddd && p.RecordTime <= ddd && pidlist.Contains(p.PID)).Sum(p => p.UsePower);
                var lastPower = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().LastYearPower;
                model.thisPowerLastYear = Math.Round(Convert.ToDecimal(sumYearPower / lastPower * 100), 2);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }
        public DateTime GetDatime(DateTime d)
        {
            DateTime dt = d.AddMonths(6);
            while (dt < DateTime.Now)
            {
                dt = dt.AddMonths(6);
            };
            DateTime start = Convert.ToDateTime(Convert.ToDateTime(dt.ToShortDateString()));
            return start;
        }

        public JsonResult ViewLoop(int uid)
        {
            PdfState model = new PdfState();
            try
            {
                //string uids = GetAllUnit();
                string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
                var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
                //var pidlist = pids.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();


                var cidsss = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == 12 && pidlist.Contains(p.pid)).ToList();
                List<int?> cidlist = new List<int?>();
                string s = "";
                foreach (var xssss in cidsss)
                {
                    s += xssss.cid + ",";
                }
                if (s != "")
                {
                    s = s.Substring(0, s.Length - 1);
                    cidlist = s.Split(',').ToList().Distinct().ToList().ConvertAll<int?>(p => int.Parse(p));
                }



                DateTime d = DateTime.Now.Date;
                DateTime xd = DateTime.Now;
                var xzzz = bll.t_EE_PowerQualityDaily.Where(p => p.RecordTime >= d && p.RecordTime <= xd && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
                if (xzzz != null)
                {
                    model.thisDayPower = Math.Round(xzzz.Value, 2);
                }
                else
                {
                    model.thisDayPower = 0;
                }
                if (model.thisDayPower == null)
                    model.thisDayPower = 0;
                DateTime lastsd = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
                DateTime lasted = new DateTime(DateTime.Now.Year - 1, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour - 1, 0, 0);
                var lastDayPower = bll.t_EE_PowerQualityDaily.Where(p => p.RecordTime >= lastsd && p.RecordTime <= lasted && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).Sum(p => p.UsePower);
                if (lastDayPower != 0)
                {
                    model.thisDayOccupation = Math.Round(Convert.ToDecimal(model.thisDayPower / lastDayPower * 100), 2);
                }
                var cids = bll.t_DM_DeviceInfo.Where(p => pidlist.Contains(p.PID) && p.C != null && p.C != "").Select(p => p.C).ToList().ConvertAll<int?>(i => int.Parse(i));
                var dbbb = bll.t_DM_CircuitInfo.Where(p => pidlist.Contains(p.PID)).Select(p => p.CID).ToList();
                //总负载   
                //model.Sumload = bll.t_EE_PowerQualityRealTime.Where(p => pidlist.Contains(p.PID) && cids.Contains(p.CID)).Sum(p => p.Power);
                var z = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().InstalledCapacitys;
                model.RongL = z;
                decimal? suml = 0;
                foreach (var item in pidlist)
                {
                    var bianyaqilist = bll.t_DM_DeviceInfo.Where(p => p.PID == item && p.DTID == 3).ToList();
                    foreach (var by in bianyaqilist)
                    {
                        if (!string.IsNullOrEmpty(by.C))
                        {
                            int ciddd = Convert.ToInt32(by.C);
                            var dbb = bll.t_DM_CircuitInfo.Where(p => p.DID == ciddd && p.PID == item).FirstOrDefault();
                            if (dbb != null)
                            {
                                int cid = dbb.CID;
                                if (cid != 0)
                                {
                                    var ss = bll.t_EE_PowerQualityRealTime.Where(p => p.PID == item && p.CID == cid).OrderByDescending(p => p.RecordTime).FirstOrDefault();
                                    if (ss != null)
                                    {
                                        if (ss.Power != null)
                                        {
                                            suml += ss.Power;
                                            anwyis m = new anwyis();

                                            m.zhanbiEvery = ss.Power / z * 100;
                                            if (Convert.ToDecimal(by.Z) != 0 && !string.IsNullOrEmpty(by.Z))
                                                m.viewEvery = ss.Power / Convert.ToDecimal(by.Z) * 100;
                                            m.CName = bll.t_CM_PDRInfo.Where(p => p.PID == item).FirstOrDefault().Name + "_" + by.DeviceName;
                                            model.fuzaiView.Add(m);

                                        }
                                    }
                                }
                            }
                        }

                    }
                }
                model.Sumload = suml;
                //总负载率
                if (z != 0 && z != null)
                {
                    model.RatedCapacity = Math.Round((model.Sumload / z * 100).Value, 2);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(model);
        }

        public ActionResult GetAlarmAndOrderCount(int uid)
        {
            //string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
            //var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            string unstr = HomeController.GetUID();
            string pidstr = HomeController.GetPID(unstr);
            var pidlist = pidstr.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            int AlarmCount = bll.t_AlarmTable_en.Where(p => pidlist.Contains(p.PID) && p.AlarmState != 0).Count();
            int orderCount = bll.t_PM_Order.Where(p => pidlist.Contains(p.PID) && p.OrderState != 4).Count();
            var result = new { AlarmCount = AlarmCount, orderCount = orderCount };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public decimal GetUnitScoreByUID(int uid)
        {
            decimal score = 0;
            List<int?> li = new List<int?>();
            li.Add(18);
            li.Add(19);
            li.Add(20);
            li.Add(21);
            decimal? s1 = bll.t_CM_UnitScore.Where(p => !li.Contains(p.TypeID) && p.UID == uid).Sum(p => p.Score);
            if (s1 == null)
                s1 = 0;
            string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
            var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            var z = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().InstalledCapacitys;
            decimal s2 = 0;
            decimal? suml = 0;
            foreach (var item in pidlist)
            {
                var bianyaqilist = bll.t_DM_DeviceInfo.Where(p => p.PID == item && p.DTID == 3).ToList();
                foreach (var by in bianyaqilist)
                {
                    if (!string.IsNullOrEmpty(by.C))
                    {
                        int ciddd = Convert.ToInt32(by.C);
                        var dbb = bll.t_DM_CircuitInfo.Where(p => p.DID == ciddd && p.PID == item).FirstOrDefault();
                        if (dbb != null)
                        {
                            int cid = dbb.CID;
                            if (cid != 0)
                            {
                                var ss = bll.t_EE_PowerQualityDaily.Where(p => p.PID == item && p.CID == cid).OrderByDescending(p => p.RecordTime).FirstOrDefault();
                                if (ss != null)
                                {
                                    if (ss.Power != null)
                                    {
                                        suml += ss.Power;

                                    }
                                }
                            }
                        }
                    }

                }
            }
            if (z != 0 && z != null)
            {
                s2 = Math.Round((suml / z * 100).Value, 2);
            }
            s2 = UnitScore.checkLoadRateScore(s2);

            decimal s3 = 0;
            var x = bll.t_AlarmTable_en.Where(p => pidlist.Contains(p.PID)).Count();
            s3 = UnitScore.checkAlarmScore(x);
            decimal? s4 = 0;
            var x1 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Sum(p => p.AFactor);
            if (x1 != null && pidlist.Count() != 0)
                s4 = x1 / pidlist.Count();
            s4 = UnitScore.checkPowerfactor(s4.Value);
            decimal? s5 = 0;
            var x2 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Sum(p => p.UnBalanceUa);
            if (x2 != null && pidlist.Count() != 0)
                s5 = x2 / pidlist.Count();
            s5 = UnitScore.checkTripartiteimbalance(s5.Value);
            decimal? s6 = 0;
            var x3 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Sum(p => p.UnBalanceUa);
            if (x3 != null && pidlist.Count() != 0)
                s6 = x3 / pidlist.Count();
            s6 = UnitScore.checkFrequency(s6.Value);

            decimal? s7 = 0;
            var x4 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Max(p => p.MaxTemperature);
            if (x4 != null && pidlist.Count() != 0)
                s7 = x4 / pidlist.Count();
            s7 = UnitScore.checkTemperature(s7.Value);

            decimal? s8 = 0;
            var x5 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Max(p => p.MaxTemperature);
            if (x5 != null && pidlist.Count() != 0)
                s8 = x5 / pidlist.Count();
            s8 = UnitScore.checkHumidity(s8.Value);
            score = s1.Value + s2 + s3 + s4.Value + s5.Value + s6.Value + s7.Value + s8.Value;
            return score;
        }

        public class PdfState
        {
            public PdfState()
            {
                thisDayOccupation = 0;
                fuzaiView = new List<anwyis>();
                pdfList = new List<pdfview>();
            }
            public string Name { get; set; }
            public string NormalDays { get; set; }
            public string CheckDays { get; set; }
            public decimal Score { get; set; }
            public decimal? thisDayPower { get; set; }
            public decimal? thisDayOccupation { get; set; }
            public decimal? thisMonthPower { get; set; }
            public decimal? thisMonthOccupation { get; set; }
            public decimal? thisPowerLastYear { get; set; }
            public decimal? Sumload { get; set; }
            public decimal? RatedCapacity { get; set; }
            public List<anwyis> fuzaiView { get; set; }
            // public decimal? AlarmCount { get; set; }
            public decimal? MaxLoad { get; set; }
            public string maxTime { get; set; }
            public decimal? RongL { get; set; }
            public decimal? BianYacount { get; set; }
            public decimal? Diancount { get; set; }
            //public decimal? orderCount { get; set; }
            public List<pdfview> pdfList { get; set; }
        }
        public class pdfview
        {
            public pdfview()
            {
                fuzaiView = new List<anwyis>();
            }
            public decimal? zhaungji { get; set; }
            public decimal? bianyaCount { get; set; }
            public decimal? pointCount { get; set; }
            public decimal? fuzailv { get; set; }
            public string PName { get; set; }
            public List<anwyis> fuzaiView { get; set; }
        }

        public class anwyis
        {
            public anwyis()
            {
                viewEvery = 0;
            }
            public decimal? zhanbiEvery { get; set; }
            public decimal? viewEvery { get; set; }
            public string CName { get; set; }
        }

        public class lastPowerView
        {
            public decimal? thisPowerLastYear { get; set; }
            public string CName { get; set; }
        }
        /// <summary>
        /// 获取总负载的CID
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        private List<int?> GetcidByPID(string pids)
        {
            string cid = "0";
            string typename = string.Empty;
            using (var bll = new pdermsWebEntities())
            {

                t_EE_PowerConfigInfo model = bll.t_EE_PowerConfigInfo.Where(p => p.cid_type_name == "站总负荷").FirstOrDefault();
                if (model != null)
                {
                    int i = 0;
                    foreach (var pid in pids.Split(','))
                    {
                        int pidd = Convert.ToInt32(pid);
                        var info = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == model.cid_type_id && p.pid == pidd).FirstOrDefault();
                        if (info != null)
                        {
                            if (i == 0)
                            {
                                cid = info.cid;
                            }
                            else
                            {
                                cid += "," + info.cid;
                            }
                            i++;
                        }
                    }
                }
            }
            return cid.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p));
        }

        /// <summary>
        /// 获取配电房
        /// </summary>
        /// <returns></returns>
        public JsonResult GetPDF(int uid)
        {
            //string uids = GetAllUnit();
            //string pids = GetPID(uids);
            List<t_CM_PDRInfo> list = new List<t_CM_PDRInfo>();
            if (uid != 0)
            {

                var s = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault();
                if (s != null && !string.IsNullOrEmpty(s.PDRList))
                {
                    var pids = s.PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
                    list = bll.t_CM_PDRInfo.Where(p => pids.Contains(p.PID)).ToList();
                }    
            }
            return Json(list);
        }
        public JsonResult GetPDFByPID(int pid = 0)
        {
            PDFView model = new PDFView();
            if (pid != 0)
            {
                t_DM_CircuitInfo Cinfo = bll.t_DM_CircuitInfo.Where(p => p.PID == pid && p.CName == "变压器").FirstOrDefault();
                if (Cinfo != null)
                {
                    model.Capacity = Cinfo.RatedCapacity;
                    if (model.Capacity == null)
                        model.Capacity = 0;
                }
                t_EE_PowerConfigInfo config = bll.t_EE_PowerConfigInfo.Where(p => p.cid_type_name == "主进功率").FirstOrDefault();
                if (config != null)
                {

                    List<int?> listP = new List<int?>();
                    var info = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == config.cid_type_id && p.pid == pid).FirstOrDefault();
                    if (info != null)
                    {
                        listP = info.cid.Split(',').ToList().ConvertAll<int?>(i => int.Parse(i));
                        model.gonglv = bll.t_EE_PowerQualityMonthly.Where(p => p.PID == pid && listP.Contains(p.CID)).Sum(p => p.Power);
                        if (model.Capacity != 0)
                            model.fuzailv = bll.t_EE_PowerQualityMonthly.Where(p => p.PID == pid && listP.Contains(p.CID)).Sum(p => p.Power) / model.Capacity * 100;
                    }

                }
            }
            return Json(model);
        }
        public class PDFView
        {
            public PDFView()
            {
                Capacity = 0;
                gonglv = 0;
                fuzailv = 0;
            }
            public decimal? Capacity { get; set; }
            public decimal? gonglv { get; set; }
            public decimal? fuzailv { get; set; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="did"></param>
        /// <param name="cid"></param>
        /// <param name="datestart"></param>
        /// <param name="dateend"></param>
        /// <param name="cidsType"></param>
        /// <returns></returns>
        public JsonResult LoadCurve(int pid, int did = 0, int cid = 0, int cidsType = 19)
        {
            string result = "";
            PDFView model = new PDFView();
            var device = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.C != null && p.C != "" && p.DID == did).Select(p => p.C).Distinct().ToList().ConvertAll<int?>(i => int.Parse(i));
            //var TransformerID = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.DID == did).Select(p => p.C).ToList();
            antis an = new antis();
            try
            {
                string dateend = DateTime.Now.ToString("yyyy-MM-dd 23:59:59");
                string datestart = DateTime.Now.ToString("yyyy-MM-dd  00:00:00");


                string d = did.ToString();
                var Cinfo = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.DID == did).FirstOrDefault();
                if (Cinfo != null)
                {
                    model.Capacity = Convert.ToDecimal(Cinfo.Z);
                    if (model.Capacity == null)
                        model.Capacity = 0;
                }
                List<int> cis = bll.t_DM_CircuitInfo.Where(p => device.Contains(p.DID) && p.PID == pid).OrderBy(p => p.CID).Select(p => p.CID).ToList();
                if (cis.Count() > 0)
                {
                    var mmm = bll.t_EE_PowerQualityRealTime.Where(p => p.PID == pid && cis.Contains(p.CID.Value)).OrderByDescending(p => p.RecordTime).FirstOrDefault();
                    if (mmm != null)
                        model.gonglv = mmm.Power;
                    else
                        model.gonglv = null;
                }
                else
                {
                    model.gonglv = null;
                }
                if (model.Capacity != 0)
                    model.fuzailv = model.gonglv / model.Capacity * 100;



                string strsql = "select a.RecordTime,a.Power Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType from  t_EE_PowerQualityRealTime a,t_DM_CircuitInfo b where 1=1 and a.CID = b.cid and a.Power is not null";
                string strsqlm = "", strsqly = "";
                if (!pid.Equals(""))
                {
                    strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                }
                //if (!did.Equals("") && !did.Equals(0))
                //{

                //    strsql += " and b.did=" + Cinfo.DID;

                //}
                if (!cid.Equals("") && !cid.Equals(0))
                {
                    strsql += " and a.cid=" + cid;
                }
                strsql = addCidsLimit(strsql, pid, cis);

                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsql += " and a.RecordTime >='" + datestart + "' and a.RecordTime <='" + dateend + "'";
                }
                if (cid.Equals("") || cid.Equals(0))
                {
                    strsql += "   ORDER BY a.CID,RecordTime";
                    strsqlm += " ORDER BY a.CID,RecordTime";
                    strsqly += "  ORDER BY a.CID,RecordTime";
                }
                List<PowerData_SSQX> list = bll.ExecuteStoreQuery<PowerData_SSQX>(strsql).ToList();

                string xAxis = "", yAxis = "", series1 = "", series2 = "", CName = "", yData = "";

                List<int> litCid = new List<int>();
                List<string> litTime = new List<string>();
                foreach (PowerData_SSQX mod in list)
                {
                    if (mod.Aphase < 0)
                        continue;

                    if (xAxis.Contains(mod.RecordTime.ToString("MM-dd HH:mm")) == false)
                    {
                        xAxis += mod.RecordTime.ToString("MM-dd HH:mm") + ",";
                        an.xAxis.Add(mod.RecordTime.ToString("MM-dd HH:mm"));
                        litTime.Add(mod.RecordTime.ToString("MM-dd HH:mm"));
                    }
                    if (litCid.Contains(mod.CID) == false)
                    {
                        //限制最多10个回路显示
                        if (litCid.Count() > 10)
                            break;

                        an.CName.Add(mod.CName);
                        CName += "\"" + mod.CName + "\",";
                        litCid.Add(mod.CID);
                    }
                }

                Hashtable hashYData = new Hashtable();
                foreach (string modTime in litTime)
                {
                    //yData y = new yData();
                    foreach (int modCid in litCid)
                    {
                        List<PowerData_SSQX> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd HH:mm").Equals(modTime) && m.CID == modCid).ToList();
                        string sVal = "";
                        if (ListTemp.Count > 0)
                        {
                            sVal = ListTemp[0].Aphase.ToString();
                        }
                        //

                        //y.y.Add(sVal);
                        if (hashYData.Contains(modCid))
                        {
                            hashYData[modCid] += "," + sVal;
                        }
                        else
                        {
                            hashYData.Add(modCid, sVal);
                        }
                    }
                    //an.yData.Add(y);
                }
                foreach (int modCid in litCid)
                {
                    yData y = new yData();
                    foreach (string modTime in litTime)
                    {


                        List<PowerData_SSQX> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd HH:mm").Equals(modTime) && m.CID == modCid).ToList();
                        string sVal = "";
                        if (ListTemp.Count > 0)
                        {
                            sVal = ListTemp[0].Aphase.ToString();
                        }
                        //

                        y.y.Add(sVal);
                        if (hashYData.Contains(modCid))
                        {
                            hashYData[modCid] += "," + sVal;
                        }
                        else
                        {
                            hashYData.Add(modCid, sVal);
                        }


                    }
                    an.yData.Add(y);
                }

                for (int i = 0; i < litCid.Count; i++)
                {

                    if (i < (litCid.Count - 1))
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',') + "\",\"";
                    }
                    else
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',');
                    }
                }

                result = "{\"CName\":[" + CName.TrimEnd(',') + "],\"xAxis\":\"" + xAxis.TrimEnd(',') + "\",\"yData\":[\"" + yData.TrimEnd(',') + "\"]}";

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }

            var Transformer = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.DID == did).Select(p => new { p.DeviceName, p.DID }).ToList();
            var ssss = JsonConvert.DeserializeObject(result);
            return Json(new { result = an, model = model, Transformer = Transformer });
        }

        public JsonResult getBianyaqi(int pid)
        {
            var Transformer = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.DTID == 3).Select(p => new { p.DeviceName, C = p.DID }).ToList();
            // var Transformer = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && TransformerID.Contains(p.C)).ToList();
            return Json(Transformer);
        }
        public class antis
        {
            public antis()
            {
                CName = new List<string>();
                xAxis = new List<string>();
                yData = new List<yData>();
            }
            public List<string> CName { get; set; }
            public List<string> xAxis { get; set; }
            public List<yData> yData { get; set; }

        }
        public class yData
        {
            public yData()
            {
                y = new List<string>();
            }
            public List<string> y { get; set; }
        }
        private string addCidsLimit(string strsql, int pid, List<int> cids)
        {
            //var device = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.C != null&& p.C != "").Select(p => p.C).Distinct().ToList().ConvertAll<int?>(i => int.Parse(i));

            //var cids = bll.t_DM_CircuitInfo.Where(p => device.Contains(p.DID) && p.PID == pid).Select(p => p.CID).ToList();
            if (cids.Count() == 0)
            {
                strsql += " AND b.CID IN (0) ";
            }
            else
            {
                foreach (var cid in cids)
                {
                    strsql += " AND b.CID IN (" + cid + ") ";
                }
            }
            return strsql;
        }

        public class PowerData_SSQX
        {
            public DateTime RecordTime { get; set; }
            public decimal Aphase { get; set; }
            public int CID { get; set; }
            public string CName { get; set; }
            public string UserType { get; set; }
            public string AreaType { get; set; }
            public string ItemType { get; set; }
        }
        /// <summary>
        /// 消息通知
        /// </summary>
        /// <returns></returns>
        public JsonResult AlarmManager(int uid)
        {
            bool flagOrder = false;
            bool alarmflag = false;
            var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            var order = bll.t_PM_Order.Where(p => p.OrderState != 0 && pidlist.Contains(p.PID));
            if (order.Count() > 0)
            {
                flagOrder = true;
            }
            var Alarm = bll.t_AlarmTable_en.Where(p => p.AlarmState != 0 && pidlist.Contains(p.PID));
            if (Alarm.Count() > 0)
            {
                alarmflag = true;
            }
            return Json(new { flagOrder = flagOrder, order = order, alarmflag = alarmflag, Alarm = Alarm });
        }
        /// <summary>
        /// 项目信息
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectInfo(int uid)
        {
            string ustr = string.Empty;
            ustr = GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");
            string sql = "SELECT a.*,b.IndustryName,c.UnitProjectTypeName FROM t_CM_Unit a left join t_ES_Industry b on a.IndustryID=b.IndustryID left join t_CM_UnitProjectType c on a.ProjectType=c.ID  WHERE UnitID =" + uid + "";
            //string sql = "SELECT * FROM t_CM_Unit";
            m item = bll.ExecuteStoreQuery<m>(sql).ToList().FirstOrDefault();

            List<int?> x = bll.t_CM_PDRInfo.Where(p => p.UnitID == item.UnitID).Select(p => p.VoltageID).Distinct().ToList();
            string dianya = "", type = "";
            List<decimal> dianyal = new List<decimal>();
            foreach (var i in x)
            {
                t_ES_ElecVoltages v = bll.t_ES_ElecVoltages.Where(p => p.VoltageID == i).FirstOrDefault();

                if (v != null)
                {
                    if (v.VoltageName.Contains("/"))
                    {
                        dianya = v.VoltageName;
                    }
                    else
                    {
                        if (v.VoltageName.Contains("V"))
                        {
                            if (v.VoltageName.Contains("kV"))
                            {
                                dianyal.Add(Convert.ToDecimal(v.VoltageName.Replace("kV", "").Trim()));
                            }
                            else
                            {
                                dianyal.Add(Convert.ToDecimal(v.VoltageName.Replace("V", "").Trim()));
                            }
                        }
                    }
                }
            }

            if (dianya.Contains("/"))
            {

            }
            else
            {
                foreach (var i in dianyal.OrderByDescending(o => o))
                {
                    dianya += i + "/";
                }
                if (dianya != "")
                    dianya = dianya.Substring(0, dianya.Length - 1);
                dianya += "kV";

            }

            List<int?> xx = bll.t_CM_PDRInfo.Where(p => p.UnitID == item.UnitID).Select(p => p.IndID).Distinct().ToList();
            foreach (var i in xx)
            {
                t_ES_ElecIndustry inn = bll.t_ES_ElecIndustry.Where(p => p.IndID == i).FirstOrDefault();
                if (inn != null)
                {
                    type += inn.IndName + "、";
                }
            }
            if (type != "")
                type = type.Substring(0, type.Length - 1);

            item.DType = type;
            item.dianya = dianya;
            return Json(item);
        }
        /// <summary>
        /// 日曲线
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public JsonResult GetDayPower(int uid = 0)
        {
            //DateTime now = DateTime.Now;
            //DateTime start = TimeUtils.getThisMonthFirstDay(now);
            //string thisDay = "SELECT * FROM t_ES_UserUsePowerMonthly WHERE UID=" + uid + " AND RecordTime>='" + start + "'" + " AND RecordTime<='" + now + "'";
            //List<t_EE_PowerQualityDaily> thisD = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(thisDay).ToList();
            //return Json(thisD);
            List<xy> result = new List<xy>();
            if (bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault() == null)
                return Json("暂无数据");

            string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
            var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();

            var cids = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == 1 && pidlist.Contains(p.pid)).Select(p => p.cid);
            string sxx = "";
            foreach (var c in cids)
            {
                sxx += c + ",";
            }
            sxx = sxx.Substring(0, sxx.Length - 1);

            var cidlist = sxx.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            DateTime now = DateTime.Now;
            DateTime start = DateTime.Now.AddDays(-1);
            var list = bll.t_EE_PowerQualityDaily.Where(p => p.RecordTime >= start && p.RecordTime <= now && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).GroupBy(p => p.RecordTime).ToList();
            foreach (var item in list)
            {
                xy m = new xy();
                if (item.Key != null)
                {
                    m.x = item.Key.ToString();
                }
                if (item.Sum(p => p.UsePower) != null)
                {
                    m.y = item.Sum(p => p.UsePower).ToString();
                }
                result.Add(m);
            }
            // List<t_ES_UserUsePowerMonthly> thisD = bll.ExecuteStoreQuery<t_ES_UserUsePowerMonthly>(thisMonth).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 月曲线
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public JsonResult GetMonthPower(int uid = 0)
        {
            List<xy> result = new List<xy>();
            if (bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault() == null)
                return Json("暂无数据");

            string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
            var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();

            var cids = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == 1 && pidlist.Contains(p.pid)).Select(p => p.cid);
            string sxx = "";
            foreach (var c in cids)
            {
                sxx += c + ",";
            }
            sxx = sxx.Substring(0, sxx.Length - 1);

            var cidlist = sxx.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            DateTime now = DateTime.Now;
            DateTime start = TimeUtils.getThisMonthFirstDay(now);
            var list = bll.t_EE_PowerQualityMonthly.Where(p => p.RecordTime >= start && p.RecordTime <= now && pidlist.Contains(p.PID) && cidlist.Contains(p.CID)).GroupBy(p => p.RecordTime).ToList();
            foreach (var item in list)
            {
                xy m = new xy();
                if (item.Key != null)
                {
                    m.x = item.Key.ToString();
                }
                if (item.Sum(p => p.UsePower) != null)
                {
                    m.y = item.Sum(p => p.UsePower).ToString();
                }
                result.Add(m);
            }
            // List<t_ES_UserUsePowerMonthly> thisD = bll.ExecuteStoreQuery<t_ES_UserUsePowerMonthly>(thisMonth).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public class xy
        {
            public xy()
            {
                this.x = null;
                this.y = null;
            }
            public string x { get; set; }
            public string y { get; set; }
        }
        /// <summary>
        /// 重点回路
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="cidsType"></param>
        /// <returns></returns>
        public JsonResult GetPower(int uid, int cidsType = 13)
        {
            if (bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault() == null)
                return Json("暂无数据");
            antis an = new antis();

            string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
            var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            string dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            string datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");

            foreach (var pid in pidlist)
            {
                string xAxis = "", yAxis = "", series1 = "", series2 = "", CName = "", yData = "";
                string strsql = "select a.RecordTime,a.Power Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType from t_EE_PowerQualityDaily  a,t_DM_CircuitInfo b where 1=1 and a.CID = b.cid and a.Power  is not null";
                if (!pid.Equals(""))
                {
                    strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                }
                strsql = addCidsLimit(cidsType, strsql, pid.Value);

                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsql += " and a.RecordTime >='" + datestart + "' and a.RecordTime <='" + dateend + "'";
                }
                strsql += "   ORDER BY a.CID,RecordTime";
                List<PowerData_SSQX> list = bll.ExecuteStoreQuery<PowerData_SSQX>(strsql).ToList();
                List<int> litCid = new List<int>();
                List<string> litTime = new List<string>();
                foreach (PowerData_SSQX mod in list)
                {
                    if (mod.Aphase < 0)
                        continue;

                    if (xAxis.Contains(mod.RecordTime.ToString("MM-dd HH:mm")) == false)
                    {
                        xAxis += mod.RecordTime.ToString("MM-dd HH:mm") + ",";
                        if (!an.xAxis.Contains(mod.RecordTime.ToString("MM-dd HH:mm")))
                            an.xAxis.Add(mod.RecordTime.ToString("MM-dd HH:mm"));
                        litTime.Add(mod.RecordTime.ToString("MM-dd HH:mm"));
                    }
                    if (an.CName.Count() < 4)
                    {
                        if (litCid.Contains(mod.CID) == false)
                        {
                            //限制最多10个回路显示
                            if (litCid.Count() > 10)
                                break;


                            an.CName.Add(bll.t_CM_PDRInfo.Where(p => p.PID == pid).FirstOrDefault().Name + mod.CName);

                            CName += "\"" + mod.CName + "\",";
                            litCid.Add(mod.CID);
                        }
                    }
                }

                Hashtable hashYData = new Hashtable();
                foreach (string modTime in litTime)
                {
                    //yData y = new yData();
                    foreach (int modCid in litCid)
                    {
                        List<PowerData_SSQX> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd HH:mm").Equals(modTime) && m.CID == modCid).ToList();
                        string sVal = "";
                        if (ListTemp.Count > 0)
                        {
                            sVal = ListTemp[0].Aphase.ToString();
                        }
                        //

                        //y.y.Add(sVal);
                        if (hashYData.Contains(modCid))
                        {
                            hashYData[modCid] += "," + sVal;
                        }
                        else
                        {
                            hashYData.Add(modCid, sVal);
                        }
                    }
                    //an.yData.Add(y);
                }
                foreach (int modCid in litCid)
                {
                    yData y = new yData();
                    foreach (string modTime in litTime)
                    {


                        List<PowerData_SSQX> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd HH:mm").Equals(modTime) && m.CID == modCid).ToList();
                        string sVal = "";
                        if (ListTemp.Count > 0)
                        {
                            sVal = ListTemp[0].Aphase.ToString();
                        }
                        //

                        y.y.Add(sVal);
                        if (hashYData.Contains(modCid))
                        {
                            hashYData[modCid] += "," + sVal;
                        }
                        else
                        {
                            hashYData.Add(modCid, sVal);
                        }


                    }
                    if (an.yData.Count() < 4)
                        an.yData.Add(y);
                }

                for (int i = 0; i < litCid.Count; i++)
                {

                    if (i < (litCid.Count - 1))
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',') + "\",\"";
                    }
                    else
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',');
                    }
                }
            }
            return Json(an, JsonRequestBehavior.AllowGet);
        }



        private string addCidsLimit(int cid_type, string strsql, int pid)
        {
            List<t_EE_PowerReportConfig> config = bll.ExecuteStoreQuery<t_EE_PowerReportConfig>("SELECT * FROM t_EE_PowerReportConfig WHERE pid=" + pid + " AND cid_type_id=" + cid_type).ToList();
            if (config != null && config.Count > 0 && config.First().cid != null && config.First().cid != "")
                strsql += " AND b.CID IN (" + config.First().cid + ") ";
            else
                strsql += " AND b.CID IN (0)";
            return strsql;
        }


        /// <summary>
        /// 分类用电趋势
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="cidsType"></param>
        /// <returns></returns>
        public JsonResult GetDagongyePower(int uid, int cidsType = 12)
        {
            if (bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault() == null)
                return Json("暂无数据");
            antis an = new antis();
            string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
            var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            string dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            string datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
            foreach (var pid in pidlist)
            {
                string xAxis = "", yAxis = "", series1 = "", series2 = "", CName = "", yData = "";
                string strsql = "select a.RecordTime,a.Power Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType from t_EE_PowerQualityDaily  a,t_DM_CircuitInfo b where 1=1 and a.CID = b.cid and a.Power  is not null";
                if (!pid.Equals(""))
                {
                    strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                }
                strsql = addCidsLimit(cidsType, strsql, pid.Value);

                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsql += " and a.RecordTime >='" + datestart + "' and a.RecordTime <='" + dateend + "'";
                }
                strsql += "   ORDER BY a.CID,RecordTime";
                List<PowerData_SSQX> list = bll.ExecuteStoreQuery<PowerData_SSQX>(strsql).ToList();
                List<int> litCid = new List<int>();
                List<string> litTime = new List<string>();
                foreach (PowerData_SSQX mod in list)
                {
                    if (mod.Aphase < 0)
                        continue;


                    if (xAxis.Contains(mod.RecordTime.ToString("MM-dd HH:mm")) == false)
                    {
                        xAxis += mod.RecordTime.ToString("MM-dd HH:mm") + ",";
                        if (!an.xAxis.Contains(mod.RecordTime.ToString("MM-dd HH:mm")))
                            an.xAxis.Add(mod.RecordTime.ToString("MM-dd HH:mm"));
                        litTime.Add(mod.RecordTime.ToString("MM-dd HH:mm"));
                    }
                    if (litCid.Contains(mod.CID) == false)
                    {
                        //限制最多10个回路显示
                        if (litCid.Count() > 10)
                            break;

                        an.CName.Add(bll.t_CM_PDRInfo.Where(p => p.PID == pid).FirstOrDefault().Name + mod.CName);
                        CName += "\"" + mod.CName + "\",";
                        litCid.Add(mod.CID);
                    }
                }

                Hashtable hashYData = new Hashtable();
                foreach (string modTime in litTime)
                {
                    //yData y = new yData();
                    foreach (int modCid in litCid)
                    {
                        List<PowerData_SSQX> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd HH:mm").Equals(modTime) && m.CID == modCid).ToList();
                        string sVal = "";
                        if (ListTemp.Count > 0)
                        {
                            sVal = ListTemp[0].Aphase.ToString();
                        }
                        //

                        //y.y.Add(sVal);
                        if (hashYData.Contains(modCid))
                        {
                            hashYData[modCid] += "," + sVal;
                        }
                        else
                        {
                            hashYData.Add(modCid, sVal);
                        }
                    }
                    //an.yData.Add(y);
                }
                foreach (int modCid in litCid)
                {
                    yData y = new yData();
                    foreach (string modTime in litTime)
                    {


                        List<PowerData_SSQX> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd HH:mm").Equals(modTime) && m.CID == modCid).ToList();
                        string sVal = "";
                        if (ListTemp.Count > 0)
                        {
                            sVal = ListTemp[0].Aphase.ToString();
                        }
                        //

                        y.y.Add(sVal);
                        if (hashYData.Contains(modCid))
                        {
                            hashYData[modCid] += "," + sVal;
                        }
                        else
                        {
                            hashYData.Add(modCid, sVal);
                        }


                    }
                    an.yData.Add(y);
                }

                for (int i = 0; i < litCid.Count; i++)
                {

                    if (i < (litCid.Count - 1))
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',') + "\",\"";
                    }
                    else
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',');
                    }
                }
            }

            return Json(an, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetAlarmData(int uid, int rows = 0, int page = 0)
        {
            List<AralmView> list = new List<AralmView>();
            try
            {
                //if (bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault() == null)
                //    return Json("暂无数据");
                //string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
                //var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();

                string unstr = HomeController.GetUID();
                string pids = HomeController.GetPID(unstr);
                var pidlist = pids.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();

                string strquery = " 1=1";



                strquery = strquery + " and pid in (" + pids + ")";
                //string strsql = "select a.*,b.Remarks as RArae from (select * from t_AlarmTable_en where " + strquery + " ) a left join t_CM_PointsInfo b on a.TagID=b.TagID   order by AlarmID desc";
                string strsql = "select count(*) totalRows from t_AlarmTable_en  where " + strquery;
                List<RowCount> rowcount = bll.ExecuteStoreQuery<RowCount>(strsql).ToList();
                string strJson = "{}";
                if (rowcount.Count > 0 && rowcount[0].totalRows > 0)
                {
                    strsql = "select c.*,b.Remarks as RArae from (select top " + rows + " * from t_AlarmTable_en where " + strquery
                        + " and AlarmID not in(select alarmid from(select top " + rows * (page - 1) + " alarmid from t_AlarmTable_en  where " + strquery
                    + " order by AlarmID desc ) a) ) c left join t_CM_PointsInfo b on c.TagID=b.TagID   order by AlarmID desc";
                    list = bll.ExecuteStoreQuery<AralmView>(strsql).ToList();
                    //strJson = Common.List2Json(list, (int)rowcount[0].totalRows);
                }
                //string strJson = Common.List2Json(list, rows, page);


                return Json(list, JsonRequestBehavior.AllowGet);
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
        }


        public ActionResult OrderInfoList(int uid, int rows, int page)
        {
            try
            {
                //if (bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault() == null)
                //    return Json("暂无数据");
                //string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
                //var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
                string unstr = HomeController.GetUID();
                if (string.IsNullOrEmpty(unstr))
                    return Content("暂无数据");
                string pids = HomeController.GetPID(unstr);
                var pidlist = pids.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
                //string pdrlist = CurrentUser.PDRList;
                string strsql = "select * from t_PM_Order where 1=1";
                string strquery = "";

                strquery += " and pid in (" + pids + ")";


                List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(strsql).OrderByDescending(r => r.CreateDate).ToList().Skip(rows * (page - 1)).Take(rows).ToList();

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        /// <summary>
        /// 获取设备类型
        /// </summary>
        /// <returns></returns>
        public JsonResult GetDeviceType(int pid)
        {
            //if (bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault() == null)
            //    return Json("暂无数据");
            // var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            var dtlist = bll.t_DM_DeviceInfo.Where(p => p.PID == pid).Select(p => p.DTID).ToList().Distinct();
            var result = bll.t_CM_DeviceType.Where(p => dtlist.Contains(p.DTID)).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取设备
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="dtid"></param>
        /// <returns></returns>
        public JsonResult GetDeviceByDTID(int pid, int dtid)
        {
            //if (bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault() == null)
            //    return Json("暂无数据");
            //var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            var result = bll.t_DM_DeviceInfo.Where(p => p.PID == pid && p.DTID == dtid).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion

        public ActionResult GetScoreByUID(int uid)
        {
            List<ScoreP> soure = new List<ScoreP>();
            try
            {
                string sql = @"select c.*,d.Score as HScore,d.UID,d.ID as zid from( select a.ID,a.Name,a.Score,b.ID as LTypeID,b.Fullmarks,b.Name as LName,b.Remarks from t_CM_BigScoringType a join t_CM_Score b on a.ID=b.BigTypeID) c 
                       left join t_CM_UnitScore d on c.LTypeID = d.TypeID";

                List<int?> li = new List<int?>();
                li.Add(18);
                li.Add(19);
                li.Add(20);
                li.Add(21);
                var list = bll.t_CM_BigScoringType.Where(p => p.ID != 4).ToList();
                foreach (var item in list)
                {
                    ScoreP so = new ScoreP();
                    so.key = item.ID;
                    so.keyName = item.Name;
                    so.score = item.Score;
                    var l = bll.t_CM_Score.Where(p => p.BigTypeID == item.ID).ToList();
                    foreach (var sl in l)
                    {
                        ScoreView sv = new ScoreView();
                        sv.ID = sl.ID;
                        sv.Name = sl.Name;
                        sv.Fullmarks = sl.Fullmarks;
                        sv.Remarks = sl.Remarks;
                        var s = bll.t_CM_UnitScore.Where(p => p.TypeID == sl.ID && p.UID == uid).FirstOrDefault();
                        if (s != null)
                        {
                            if (!li.Contains(sl.ID))
                            {
                                sv.Score = s.Score;
                                sv.UID = s.UID;
                                sv.zid = s.ID;
                            }
                            if (s.Score != null)
                                sv.isHave = true;
                            else
                                sv.isHave = false;

                            sv.Result = s.Remarks;
                        }
                        so.Ldata.Add(sv);
                    }
                    soure.Add(so);
                }
                var m = bll.t_CM_BigScoringType.Where(p => p.ID == 4).FirstOrDefault();

                ScoreP soo = new ScoreP();
                soo.key = m.ID;
                soo.keyName = m.Name;
                soo.score = m.Score;
                var ll = bll.t_CM_Score.Where(p => p.BigTypeID == m.ID).ToList();
                foreach (var sl in ll)
                {
                    ScoreView sv = new ScoreView();
                    sv.ID = sl.ID;
                    sv.Name = sl.Name;
                    sv.Fullmarks = sl.Fullmarks;
                    sv.Remarks = sl.Remarks;
                    //var s = bll.t_CM_UnitScore.Where(p => p.TypeID == sl.ID && p.UID == uid).FirstOrDefault();
                    //if (s != null)
                    //{

                    sv.Score = GetUnitScoreByJiSuanUID(uid, sl.ID);
                    sv.UID = uid;
                    //sv.zid = s.ID;

                    if (sv.Score != null && sv.Score.Value > 0)
                        sv.isHave = true;
                    else
                        sv.isHave = false;
                    //}
                    sv.Result = sl.Remarks;
                    soo.Ldata.Add(sv);
                }
                soure.Add(soo);

                //var result = bll.ExecuteStoreQuery<ScoreView>(sql).ToList();
                //var re = result.GroupBy(p => p.ID);
                return Json(soure);
            }
            catch (Exception ex)
            {
                return Json("出现异常");
            }
        }
        public decimal GetUnitScoreByJiSuanUID(int uid, int typeid)
        {
            decimal score = 0;
            string pids = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList;
            var pidlist = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().PDRList.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p)).ToList().Distinct();
            var z = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault().InstalledCapacitys;

            switch (typeid)
            {
                case 18:
                    decimal s2 = 0;
                    decimal? suml = 0;
                    foreach (var item in pidlist)
                    {
                        var bianyaqilist = bll.t_DM_DeviceInfo.Where(p => p.PID == item && p.DTID == 3).ToList();
                        foreach (var by in bianyaqilist)
                        {
                            if (!string.IsNullOrEmpty(by.C))
                            {
                                int ciddd = Convert.ToInt32(by.C);
                                var dbb = bll.t_DM_CircuitInfo.Where(p => p.DID == ciddd && p.PID == item).FirstOrDefault();
                                if (dbb != null)
                                {
                                    int cid = dbb.CID;
                                    if (cid != 0)
                                    {
                                        var ss = bll.t_EE_PowerQualityDaily.Where(p => p.PID == item && p.CID == cid).OrderByDescending(p => p.RecordTime).FirstOrDefault();
                                        if (ss != null)
                                        {
                                            if (ss.Power != null)
                                            {
                                                suml += ss.Power;

                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                    if (z != 0 && z != null)
                    {
                        s2 = Math.Round((suml / z * 100).Value, 2);
                    }
                    s2 = UnitScore.checkLoadRateScore(s2);
                    score = s2;
                    break;
                case 19:
                    decimal s3 = 0;
                    var x = bll.t_AlarmTable_en.Where(p => pidlist.Contains(p.PID)).Count();
                    s3 = UnitScore.checkAlarmScore(x);
                    score = s3;
                    break;
                case 20:
                    decimal? s4 = 0;
                    var x1 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Sum(p => p.AFactor);
                    if (x1 != null && pidlist.Count() != 0)
                        s4 = x1 / pidlist.Count();
                    s4 = UnitScore.checkPowerfactor(s4.Value);
                    decimal? s5 = 0;
                    var x2 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Sum(p => p.UnBalanceUa);
                    if (x2 != null && pidlist.Count() != 0)
                        s5 = x2 / pidlist.Count();
                    s5 = UnitScore.checkTripartiteimbalance(s5.Value);
                    decimal? s6 = 0;
                    var x3 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Sum(p => p.UnBalanceUa);
                    if (x3 != null && pidlist.Count() != 0)
                        s6 = x3 / pidlist.Count();
                    s6 = UnitScore.checkFrequency(s6.Value);
                    score = s4.Value + s5.Value + s6.Value;
                    break;
                case 21:
                    decimal? s7 = 0;
                    var x4 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Max(p => p.MaxTemperature);
                    if (x4 != null && pidlist.Count() != 0)
                        s7 = x4 / pidlist.Count();
                    s7 = UnitScore.checkTemperature(s7.Value);

                    decimal? s8 = 0;
                    var x5 = bll.t_EE_PowerQualityDaily.Where(p => pidlist.Contains(p.PID)).Max(p => p.MaxTemperature);
                    if (x5 != null && pidlist.Count() != 0)
                        s8 = x5 / pidlist.Count();
                    s8 = UnitScore.checkHumidity(s8.Value);
                    score = s7.Value + s8.Value;
                    break;
                default:
                    break;
            }
            return score;
        }

        public class ScoreP
        {
            public ScoreP()
            {
                this.Ldata = new List<ScoreView>();
            }
            public int key { get; set; }
            public string keyName { get; set; }
            public decimal? score { get; set; }
            public List<ScoreView> Ldata = new List<ScoreView>();
        }


        public class ScoreView
        {
            public ScoreView()
            {
                this.isHave = false;
            }
            public int? ID { get; set; }
            public string Name { get; set; }
            public decimal? Score { get; set; }
            public int LTypeID { get; set; }
            public decimal? Fullmarks { get; set; }
            public string LName { get; set; }
            public string Remarks { get; set; }
            public decimal? HScore { get; set; }
            public int? UID { get; set; }
            public int? zid { get; set; }
            public bool isHave { get; set; }
            public string Result { get; set; }
        }

        public ActionResult SaveUnitScore(int uid, string str)
        {
            string result = "";
            try
            {
                List<sco> list = JsonConvert.DeserializeObject<List<sco>>(str);

                foreach (var item in list)
                {
                    var m = bll.t_CM_UnitScore.Where(p => p.UID == uid && p.TypeID == item.typeid).FirstOrDefault();
                    if (m == null)
                    {
                        t_CM_UnitScore model = new t_CM_UnitScore();
                        model.UID = uid;
                        model.Score = item.val;
                        model.TypeID = item.typeid;
                        model.Remarks = item.remarks;
                        bll.t_CM_UnitScore.AddObject(model);
                    }
                    else
                    {
                        m.Score = item.val;
                        m.Remarks = item.remarks;
                        bll.ObjectStateManager.ChangeObjectState(m, EntityState.Modified);
                    }
                }
                int n = bll.SaveChanges();
                if (n > 0)
                {
                    result = "保存成功";
                }
                else
                {
                    result = "保存失败,请联系管理员";
                }

            }
            catch (Exception ex)
            {
                result = "保存失败,请联系管理员";
            }
            return Content(result);
        }
        private class sco
        {
            public int typeid { get; set; }
            public decimal val { get; set; }
            public string remarks { get; set; }
        }
        //返回的未完成工单包含模板id列表；
        public ActionResult getMyselfOrderCount()
        {
            try
            {
                //string pdrlist = user.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                string sql = "";
                //SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE OrderState=4 and  UserName LIKE '%admin%' AND t_PM_Order.PID=t_CM_PDRInfo.PID order by CreateDate desc
                if (CurrentUser.RoleID == 1)
                {
                    sql = "SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE (OrderState<4 or OrderState=5) AND t_PM_Order.PID=t_CM_PDRInfo.PID order by OrderTypeId,PlanDate desc";
                }
                else
                {
                    sql = "SELECT t_PM_Order.*,t_CM_PDRInfo.CompanyName,t_CM_PDRInfo.Position,t_CM_PDRInfo.Coordination FROM t_PM_Order,t_CM_PDRInfo WHERE (OrderState<4 or OrderState=5) AND UserName LIKE '%" + CurrentUser.UserName + "%' AND t_PM_Order.PID=t_CM_PDRInfo.PID order by OrderTypeId,PlanDate desc";
                }
                int list = bll.ExecuteStoreQuery<t_Order>(sql).Count();
                return Json(list);
            }

            catch (Exception e)
            {
                return Content("{\"resultCode\": 2,\"results\": {}}");
            }
        }
        #region 项目管理
        //获取未完成的项目
        public ActionResult GetUnfinishedPrject()
        {
            List<t_CM_Constract> list = new List<t_CM_Constract>();
            try
            {
                //int userid = CurrentUser.UserID;
                //string str = HomeController.GetUserID();
                string str = "";

                var userlist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).Select(p => p.UserID).ToList().Distinct();
                foreach (var item in userlist)
                {
                    str += item + ",";
                }
                if (string.IsNullOrEmpty(str))
                {
                    return Content("");
                }
                str = str.Substring(0, str.Length - 1);
                if (!string.IsNullOrEmpty(str))
                {

                    string sql = "select * from t_CM_Constract where AddUserID in (" + str + ") and Isaccomplish=0";
                    list = bll.ExecuteStoreQuery<t_CM_Constract>(sql).ToList();
                    var result = from n in list
                                 select new
                                 {
                                     id = n.id,
                                     ProjectName = n.ProjectName,
                                     ConNo = n.ConNo
                                 };
                    return Json(result);
                }
                else
                {
                    return Json("No Data");
                }
            }
            catch (Exception ex)
            {

                return Json("Error" + ex.Message);
            }

        }
        /// <summary>
        /// 项目信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetProjectByID(int id)
        {

            try
            {
                t_CM_Constract model = bll.t_CM_Constract.Where(p => p.id == id).FirstOrDefault();
                int ok = bll.t_ES_ContractTemplet.Where(p => p.conid == id && p.IsOk == 4).Count();
                int Nok = bll.t_ES_ContractTemplet.Where(p => p.conid == id && p.IsOk != 4).Count();
                int Feedback = bll.t_ES_ContractTemplet.Where(p => p.conid == id && p.IsOk == 2).Count();
                int Pending = bll.t_ES_ContractTemplet.Where(p => p.conid == id && p.IsOk == 1).Count();
                int s = 0;
                string area = "";
                string UnitName = "";
                string BudgetUser = "";
                string ProjectManager = "";
                string[] sss = new string[] { };
                if (model != null)
                {
                    s = Convert.ToInt32(model.UnitCity);
                    if (s != 0)
                    {
                        area = bll.t_Sys_City.Where(p => p.cityID == s).FirstOrDefault().cityName;
                    }
                    if (bll.t_CM_Unit.Where(p => p.UnitID == model.UID).FirstOrDefault() != null)
                    {
                        UnitName = bll.t_CM_Unit.Where(p => p.UnitID == model.UID).FirstOrDefault().UnitName;
                    }
                    if (bll.t_CM_UserInfo.Where(p => p.UserID == model.BudgetUser.Value).FirstOrDefault() != null)
                    {
                        BudgetUser = bll.t_CM_UserInfo.Where(p => p.UserID == model.BudgetUser.Value).FirstOrDefault().UserName;
                    }
                    if (bll.t_CM_UserInfo.Where(p => p.UserID == model.ProjectManager.Value).FirstOrDefault() != null)
                    {
                        ProjectManager = bll.t_CM_UserInfo.Where(p => p.UserID == model.ProjectManager.Value).FirstOrDefault().UserName;
                    }
                    if (model.personids != null)
                    {
                        sss = model.personids.Split(',');
                    }
                }

                var result = new
                {
                    id = model.id,
                    ConNo = model.ConNo,
                    CtrAdmin = UnitName,
                    ProjectName = model.ProjectName,
                    Nok = Nok,
                    ok = ok,
                    LinkMan = model.LinkMan,
                    end_time = model.end_time.ToString(),
                    Tel = model.Tel,
                    UnitCity = area,
                    TypeName = GetConNo(model.ConType),
                    person = model.person,
                    conName = model.CtrName,
                    BudgetUser = BudgetUser,
                    ProjectManager = ProjectManager,
                    conMoney = model.ConMoneys,
                    ReturnedMoney = model.ReturnedMoney,
                    personids = sss,
                    Feedback = Feedback,
                    Pending = Pending
                };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("Error" + ex.Message);
            }
        }
        private string GetConNo(int? data)
        {
            string type = "";
            switch (data)
            {
                case 1:
                    type = "工程施工";
                    break;
                case 2:
                    type = "电力设计";
                    break;
                case 3:
                    type = "设备产品";
                    break;
                case 4:
                    type = "运维实验";
                    break;
                case 5:
                    type = "管理";
                    break;
                case 6:
                    type = "系统开发";
                    break;
                case 7:
                    type = "设计管理";
                    break;
                case 8:
                    type = "测绘";
                    break;
            }
            return type;
        }

        /// <summary>
        /// 备忘提醒
        /// </summary>
        /// <param name="conid"></param>
        /// <param name="time"></param>
        /// <returns></returns>
        public ActionResult GetConTemp(int conid, string time = "")
        {
            List<t_ES_ContractTemplet> list = new List<t_ES_ContractTemplet>();
            try
            {
                if (string.IsNullOrEmpty(time))
                {
                    list = bll.t_ES_ContractTemplet.Where(p => p.conid == conid).ToList();
                }
                else
                {
                    DateTime d = Convert.ToDateTime(time);
                    string sql = "select * from t_ES_ContractTemplet where conid=" + conid + "and convert(char(10),EndTime,120)='" + time + "'";
                    //list = bll.t_ES_ContractTemplet.Where(p => p.conid == conid && p.EndTime == d).ToList();
                    list = bll.ExecuteStoreQuery<t_ES_ContractTemplet>(sql).ToList();
                }
                var result = from n in list
                             select new
                             {
                                 id = n.ID,
                                 Name = n.Name,
                                 StartTime = n.Type == 3 ? n.StartTime.ToString() : n.EndTime.ToString(),
                                 Type = n.Type,
                                 isOk = n.IsOk
                             };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("Error" + ex.Message);
            }
        }

        public ActionResult GetTemLog(int conid, int type, int isok = 0)
        {
            try
            {
                if (isok == 0)
                {
                    var rr = bll.t_ES_ContractTemplet.Where(p => p.Type == type).ToList();

                    var list = rr.Where(p => p.conid == conid && (p.IsOk < 4 || p.IsOk == 5)).ToList();
                    var result = from n in list
                                 select new
                                 {
                                     id = n.ID,
                                     Name = n.Name,
                                     EndTime = n.EndTime.ToString(),
                                     Type = GetStateName(n.IsOk.Value),
                                     person = bll.t_CM_UserInfo.Where(p => p.UserID == n.PersonID).FirstOrDefault().UserName,
                                 };
                    return Json(result);
                }
                else
                {
                    var rr = bll.t_ES_ContractTemplet.Where(p => p.Type == type).ToList();

                    var list = rr.Where(p => p.conid == conid && p.IsOk == 4).ToList();
                    var result = from n in list
                                 select new
                                 {
                                     id = n.ID,
                                     Name = n.Name,
                                     EndTime = n.EndTime.ToString(),
                                     Type = GetStateName(n.IsOk.Value),
                                     person = bll.t_CM_UserInfo.Where(p => p.UserID == n.PersonID).FirstOrDefault().UserName,
                                 };
                    return Json(result);
                }
            }
            catch (Exception ex)
            {
                return Json("Error" + ex.Message);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        public ActionResult addConTemp(t_ES_ContractTemplet info)
        {
            if (info.ID > 0)
            {
                t_ES_ContractTemplet model = bll.t_ES_ContractTemplet.Where(p => p.ID == info.ID).FirstOrDefault();
                model.Name = info.Name;
                model.StartTime = info.StartTime;
                model.IsOk = info.IsOk;
                model.PersonID = info.PersonID;
                model.BeforDay = info.BeforDay;
                model.EndTime = info.EndTime;
                model.DefTempID = info.DefTempID;
                model.conid = info.conid;
                model.Isemphasis = info.Isemphasis;
                model.Type = info.Type;
                model.Moneys = info.Moneys;
                model.period = info.period;
                model.emphasisName = info.emphasisName;
                model.Subcontractors = info.Subcontractors;
                model.PeopleCopied = info.PeopleCopied;
                model.Reason = info.Reason;
                model.TomorrowWork = info.TomorrowWork;
                if (info.Type == 2)
                {
                    model.IsiNvoice = info.IsiNvoice;
                }
                bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                bll.SaveChanges();
                t_CM_ItemOperationLog mo = new t_CM_ItemOperationLog();
                mo.UserID = CurrentUser.UserID;
                mo.CreatTime = DateTime.Now;
                mo.ItemID = model.ID;
                mo.Remarks = mo.CreatTime + "編輯_" + model.ID + "_" + model.Name + "_事項";
                AddOlog(mo);
            }
            else
            {
                if (info.Type == 3)
                {
                    for (var i = 0; i < info.period; i++)
                    {
                        t_ES_ContractTemplet model = new t_ES_ContractTemplet();
                        model.Name = info.Name;
                        model.StartTime = info.StartTime.Value.AddDays(i);
                        model.IsOk = info.IsOk;
                        model.PersonID = info.PersonID;
                        model.BeforDay = info.BeforDay;
                        model.EndTime = info.StartTime.Value.AddDays(i);
                        model.DefTempID = info.DefTempID;
                        model.CreatTime = DateTime.Now;
                        model.conid = info.conid;
                        model.Isemphasis = info.Isemphasis;
                        model.Type = info.Type;
                        model.Moneys = info.Moneys;
                        model.period = info.period;
                        model.emphasisName = info.emphasisName;
                        model.Subcontractors = info.Subcontractors;
                        model.PeopleCopied = info.PeopleCopied;
                        model.Reason = info.Reason;
                        model.TomorrowWork = info.TomorrowWork;
                        bll.t_ES_ContractTemplet.AddObject(model);
                        bll.SaveChanges();
                        t_CM_ItemOperationLog mo = new t_CM_ItemOperationLog();
                        mo.UserID = CurrentUser.UserID;
                        mo.CreatTime = DateTime.Now;
                        mo.ItemID = model.ID;
                        mo.Remarks = mo.CreatTime.ToString() + "添加_" + model.ID + "_" + model.Name + "_事項";
                        AddOlog(mo);
                    }
                }
                else
                {
                    t_ES_ContractTemplet model = new t_ES_ContractTemplet();
                    model.Name = info.Name;
                    model.StartTime = info.StartTime;
                    model.IsOk = info.IsOk;
                    model.PersonID = info.PersonID;
                    model.BeforDay = info.BeforDay;
                    model.EndTime = info.EndTime;
                    model.DefTempID = info.DefTempID;
                    model.CreatTime = DateTime.Now;
                    model.conid = info.conid;
                    model.Isemphasis = info.Isemphasis;
                    model.Type = info.Type;
                    model.Moneys = info.Moneys;
                    model.period = info.period;
                    model.emphasisName = info.emphasisName;
                    model.Subcontractors = info.Subcontractors;
                    model.PeopleCopied = info.PeopleCopied;
                    model.Reason = info.Reason;
                    model.TomorrowWork = info.TomorrowWork;
                    if (info.Type == 2)
                    {
                        model.IsiNvoice = info.IsiNvoice;
                    }
                    model.IsiNvoice = info.IsiNvoice;
                    bll.t_ES_ContractTemplet.AddObject(model);
                    bll.SaveChanges();
                    t_CM_ItemOperationLog mo = new t_CM_ItemOperationLog();
                    mo.UserID = CurrentUser.UserID;
                    mo.CreatTime = DateTime.Now;
                    mo.ItemID = model.ID;
                    mo.Remarks = mo.CreatTime.ToString() + "添加_" + model.ID + "_" + model.Name + "_事項";
                    AddOlog(mo);
                }
            }
            return Json("ok");
        }



        public ActionResult UpdateConTemp(t_ES_ContractTemplet info, string StartTime, string EndTime)
        {
            if (info.ID > 0)
            {
                try
                {
                    t_ES_ContractTemplet model = bll.t_ES_ContractTemplet.Where(p => p.ID == info.ID).FirstOrDefault();
                    model.StartTime = Convert.ToDateTime(StartTime);
                    model.EndTime = Convert.ToDateTime(EndTime);
                    model.numberConstruction = info.numberConstruction;
                    //model.TomorrowWork = info.TomorrowWork;
                    model.ConstructionContent = info.ConstructionContent;
                    bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                    bll.SaveChanges();
                    //t_CM_ItemOperationLog mo = new t_CM_ItemOperationLog();
                    //mo.UserID = CurrentUser.UserID;
                    //mo.CreatTime = DateTime.Now;
                    //mo.ItemID = info.ID;
                    //mo.Remarks = mo.CreatTime + "編輯_" + info.ID + "_" + info.Name + "_事項";
                    //AddOlog(mo);
                    return Json("ok", JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json("error" + ex.Message);
                }

            }
            else
            {
                return Json("No ID", JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UpdateEveningConTemp(t_ES_ContractTemplet info)
        {
            if (info.ID > 0)
            {
                t_ES_ContractTemplet model = bll.t_ES_ContractTemplet.Where(p => p.ID == info.ID).FirstOrDefault();

                model.TomorrowWork = info.TomorrowWork;
                model.IsOk = info.IsOk;
                if (model.IsOk != 4)
                {
                    model.Reason = info.Reason;
                }
                bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                bll.SaveChanges(); ;

                return Json("ok", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("No ID", JsonRequestBehavior.AllowGet);
            }
        }
        [Login]
        public ActionResult getTempDetail(int id)
        {
            string strJson = "";
            try
            {
                t_ES_ContractTemplet temp = bll.t_ES_ContractTemplet.Where(o => o.ID == id).FirstOrDefault();
                if (temp != null)
                {

                    t_CM_UserInfo user = bll.t_CM_UserInfo.Where(o => o.UserID == temp.PersonID).FirstOrDefault();


                    string secure = HttpContext.Request.ServerVariables["HTTPS"];
                    string httpProtocol = (secure == "on" ? "https://" : "http://");
                    // 服务器名称
                    string serverName = HttpContext.Request.ServerVariables["Server_Name"];
                    string port = HttpContext.Request.ServerVariables["SERVER_PORT"];
                    string url = HttpContext.Request.Url.Host;
                    //string serverName = HttpContext.Request.ServerVariables["Server_Name"];
                    // 应用服务名称
                    string applicationName = HttpContext.Request.ApplicationPath;
                    string path = httpProtocol + serverName + (port.Length > 0 ? ":" + port : string.Empty) + applicationName;


                    var filelist = bll.t_cm_files.Where(p => p.Fk_ID == id && p.Modules == "matter" && p.FSource == "web").ToList();
                    var filel = from i in filelist
                                select new
                                {
                                    ID = i.ID,
                                    FileName = i.FileName,
                                    FilePath = i.FilePath,
                                    FileType = i.FileType,
                                    FileSize = i.FileSize,
                                    FileExtension = i.FileExtension,
                                    Modules = i.Modules,
                                    Fk_ID = i.Fk_ID,
                                    FSource = i.FSource,
                                    CommitTime = i.CommitTime,
                                    Remark = i.Remark,
                                    CommitUser = i.CommitUser,
                                    absolutePath = path + i.FilePath.Replace("~/", "").Trim()
                                };
                    var imglist = bll.t_cm_files.Where(f => f.Modules == "matter" && f.Fk_ID == id && f.FSource == "wx").ToList();
                    var file2 = from i in imglist
                                select new
                                {
                                    ID = i.ID,
                                    FileName = i.FileName,
                                    FilePath = i.FilePath,
                                    FileType = i.FileType,
                                    FileSize = i.FileSize,
                                    FileExtension = i.FileExtension,
                                    Modules = i.Modules,
                                    Fk_ID = i.Fk_ID,
                                    FSource = i.FSource,
                                    CommitTime = i.CommitTime,
                                    Remark = i.Remark,
                                    CommitUser = i.CommitUser,
                                    absolutePath = path + i.FilePath.Replace("~/", "").Trim()
                                };
                    var shiftMeetingList = bll.t_cm_files.Where(f => f.Modules == "PreshiftMeeting" && f.Fk_ID == id && f.FSource == "wx").ToList();
                    var file3 = from i in shiftMeetingList
                                select new
                                {
                                    ID = i.ID,
                                    FileName = i.FileName,
                                    FilePath = i.FilePath,
                                    FileType = i.FileType,
                                    FileSize = i.FileSize,
                                    FileExtension = i.FileExtension,
                                    Modules = i.Modules,
                                    Fk_ID = i.Fk_ID,
                                    FSource = i.FSource,
                                    CommitTime = i.CommitTime,
                                    Remark = i.Remark,
                                    CommitUser = i.CommitUser,
                                    absolutePath = path + i.FilePath.Replace("~/", "").Trim()
                                };
                    var SceneList = bll.t_cm_files.Where(f => f.Modules == "Scene" && f.Fk_ID == id && f.FSource == "wx").ToList();
                    var file4 = from i in SceneList
                                select new
                                {
                                    ID = i.ID,
                                    FileName = i.FileName,
                                    FilePath = i.FilePath,
                                    FileType = i.FileType,
                                    FileSize = i.FileSize,
                                    FileExtension = i.FileExtension,
                                    Modules = i.Modules,
                                    Fk_ID = i.Fk_ID,
                                    FSource = i.FSource,
                                    CommitTime = i.CommitTime,
                                    Remark = i.Remark,
                                    CommitUser = i.CommitUser,
                                    absolutePath = path + i.FilePath.Replace("~/", "").Trim()
                                };
                    var ToolList = bll.t_cm_files.Where(f => f.Modules == "Tool" && f.Fk_ID == id && f.FSource == "wx").ToList();
                    var file5 = from i in ToolList
                                select new
                                {
                                    ID = i.ID,
                                    FileName = i.FileName,
                                    FilePath = i.FilePath,
                                    FileType = i.FileType,
                                    FileSize = i.FileSize,
                                    FileExtension = i.FileExtension,
                                    Modules = i.Modules,
                                    Fk_ID = i.Fk_ID,
                                    FSource = i.FSource,
                                    CommitTime = i.CommitTime,
                                    Remark = i.Remark,
                                    CommitUser = i.CommitUser,
                                    absolutePath = path + i.FilePath.Replace("~/", "").Trim()
                                };
                    var EveningList = bll.t_cm_files.Where(f => f.Modules == "Evening" && f.Fk_ID == id && f.FSource == "wx").ToList();
                    var file6 = from i in EveningList
                                select new
                                {
                                    ID = i.ID,
                                    FileName = i.FileName,
                                    FilePath = i.FilePath,
                                    FileType = i.FileType,
                                    FileSize = i.FileSize,
                                    FileExtension = i.FileExtension,
                                    Modules = i.Modules,
                                    Fk_ID = i.Fk_ID,
                                    FSource = i.FSource,
                                    CommitTime = i.CommitTime,
                                    Remark = i.Remark,
                                    CommitUser = i.CommitUser,
                                    absolutePath = path + i.FilePath.Replace("~/", "").Trim()
                                };
                    var EveningScene = bll.t_cm_files.Where(f => f.Modules == "EveningScene" && f.Fk_ID == id && f.FSource == "wx").ToList();
                    var file7 = from i in EveningScene
                                select new
                                {
                                    ID = i.ID,
                                    FileName = i.FileName,
                                    FilePath = i.FilePath,
                                    FileType = i.FileType,
                                    FileSize = i.FileSize,
                                    FileExtension = i.FileExtension,
                                    Modules = i.Modules,
                                    Fk_ID = i.Fk_ID,
                                    FSource = i.FSource,
                                    CommitTime = i.CommitTime,
                                    Remark = i.Remark,
                                    CommitUser = i.CommitUser,
                                    absolutePath = path + i.FilePath.Replace("~/", "").Trim()
                                };
                    var CourseList = bll.t_cm_files.Where(f => f.Modules == "Course" && f.Fk_ID == id && f.FSource == "wx").ToList();
                    var file8 = from i in CourseList
                                select new
                                {
                                    ID = i.ID,
                                    FileName = i.FileName,
                                    FilePath = i.FilePath,
                                    FileType = i.FileType,
                                    FileSize = i.FileSize,
                                    FileExtension = i.FileExtension,
                                    Modules = i.Modules,
                                    Fk_ID = i.Fk_ID,
                                    FSource = i.FSource,
                                    CommitTime = i.CommitTime,
                                    Remark = i.Remark,
                                    CommitUser = i.CommitUser,
                                    absolutePath = path + i.FilePath.Replace("~/", "").Trim()
                                };
                    var result = new
                    {
                        Name = temp.Name,
                        UserName = user.UserName,
                        StartTime = temp.StartTime.ToString(),
                        EndTime = temp.EndTime.ToString(),
                        Type = temp.Type,
                        CompleTime = temp.CompleTime.ToString(),
                        numberConstruction = temp.numberConstruction,
                        Reason = temp.Reason,
                        TomorrowWork = temp.TomorrowWork,
                        FistDate = temp.FistDate.ToString(),
                        ConstructionContent = temp.ConstructionContent,
                        Remark = temp.Remark,
                        ProjectName = bll.t_CM_Constract.Where(p => p.id == temp.conid).FirstOrDefault().ProjectName,
                        filelist = filel,
                        imglist = file2,
                        shiftMeetingList = file3,
                        SceneList = file4,
                        ToolList = file5,
                        EveningList = file6,
                        EveningScene = file7,
                        CourseList = file8
                    };
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                strJson = "";
            }

            return Content(strJson);
        }
        //上传事项文件；
        public ActionResult UploadFile(HttpPostedFileBase fileData, string Remark, int fk_id, string ctype = "file", string modules = "matter", string FSource = "web")
        {
            if (fileData != null)
            {
                try
                {
                    //备注
                    // string Remark = string.Empty;
                    //上传用户
                    string CommitUser = string.Empty;
                    //资料类型（图片，视频,文档）
                    string FileType = string.Empty;
                    //来源(web,app)

                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string url = "~/UploadFiles/YunYingConstract/";
                    string filePath = Server.MapPath(url);

                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = DateTime.Now.Ticks + fileExtension;
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";
                    //获取上传人
                    CommitUser = CurrentUser.UserName;
                    //资料类型（图片，视频,文档）
                    FileType = getFileType(fileExtension);

                    //所属模块:事项；
                    //保存到t_PM_EmergencyPlan表

                    //保存到资料库t_cm_files表
                    t_cm_files obj = new t_cm_files();
                    obj.CommitTime = DateTime.Now;
                    obj.CommitUser = CurrentUser.UserName;
                    obj.FileName = fileName;
                    obj.FilePath = url + saveName;
                    obj.FileExtension = fileExtension;
                    obj.FileSize = fSize;
                    obj.FileType = FileType;
                    obj.Fk_ID = fk_id;
                    obj.FSource = FSource;
                    obj.MaxTemp = 0;
                    obj.MinTemp = 0;
                    obj.Remark = Remark;
                    obj.Modules = modules;
                    bll.t_cm_files.AddObject(obj);
                    bll.SaveChanges();
                    if (FSource == "web")
                    {
                        return Json(obj, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Content("ok");
                    }
                }
                catch (Exception ex)
                {
                    return Content(ex.ToString());
                }
            }
            else
            {
                return Content("false");
            }
        }

        private static string getFileType(string fileExtension)
        {
            string FileType = "file";
            string LFE = fileExtension.ToLower();
            string[] wic = { ".doc", ".xls" };
            string[] pic = { ".jpg", ".jpeg", ".bmp", ".png", ".gif" };
            string[] ved = { ".avi", ".rmvb", ".mp4", ".flv", ".wmv", ".mkv", ".mpeg" };
            string[] voi = { ".wav", ".mp3", ".wma", ".ogg", ".ape", ".acc", ".3gp" };
            if (pic.Contains(LFE))
            {
                FileType = "image";
            }
            else if (ved.Contains(LFE))
            {
                FileType = "video";
            }
            else if (voi.Contains(LFE))
            {
                FileType = "voice";
            }
            else if (wic.Contains(LFE))
            {
                FileType = "doc";
            }
            return FileType;
        }
        /// <summary>
        /// 读文件字节流
        /// </summary>
        /// <param name="fileData"></param>
        /// <returns></returns>
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
        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult DeleteFileByID(int id)
        {
            t_cm_files m = bll.t_cm_files.Where(p => p.ID == id).FirstOrDefault();
            string path = Server.MapPath(m.FilePath);
            bll.t_cm_files.DeleteObject(m);
            bll.SaveChanges();
            return Json("ok");
        }
        /// <summary>
        /// 获取事项
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetTempByID(int id)
        {
            t_ES_ContractTemplet m = bll.t_ES_ContractTemplet.Where(p => p.ID == id).FirstOrDefault();
            return Json(m, JsonRequestBehavior.AllowGet);
        }


        public ActionResult saveConstract(t_CM_Constract info)
        {
            List<string> ids = new List<string>();
            if (info.personid > 0)
            {
                ids.Add(info.personid + "");
            }
            if (!string.IsNullOrEmpty(info.personids))
            {
                string[] iii = info.personids.Split(',');
                for (int i = 0; i < iii.Length; i++)
                {
                    if (!ids.Contains(iii[i]))
                    {
                        ids.Add(iii[i]);
                    }
                }
            }
            string strJson = "OK";
            try
            {
                t_CM_Constract constract;
                if (info.id > 0)
                {
                    constract = bll.t_CM_Constract.Where(c => c.id == info.id).First();
                    if (constract != null)
                    {
                        constract.id = info.id;
                        constract.CtrName = info.CtrName;
                        constract.CtrCom = CurrentUser.Company;
                        constract.CtrAdmin = info.CtrAdmin;
                        constract.CtrInfo = info.CtrInfo;
                        constract.start_time = info.start_time;
                        constract.end_time = info.end_time;
                        constract.personid = info.personid;
                        var user = bll.t_CM_UserInfo.Where(p => p.UserID == info.personid).FirstOrDefault();
                        if (user != null)
                            constract.person = user.UserName;
                        constract.personids = info.personids;
                        constract.dateFixCount = info.dateFixCount;
                        constract.testFixCount = info.testFixCount;
                        constract.UID = info.UID;
                        constract.Type = info.Type;
                        constract.ConType = 3;
                        constract.LinkMan = info.LinkMan;
                        constract.Tel = info.Tel;
                        constract.AddUserID = CurrentUser.UserID;
                        constract.UnitCity = info.UnitCity;
                        constract.UnitProvince = info.UnitProvince;

                        constract.ProjectName = info.ProjectName;
                        constract.Coordination = info.Coordination;
                        constract.Approvers = info.Approvers;
                        constract.ItemUsers = info.ItemUsers;
                        constract.ProjectManager = info.ProjectManager;
                        constract.BudgetUser = info.BudgetUser;

                        constract.ConMoneys = info.ConMoneys;

                        constract.ConNo = info.ConNo;
                        constract.Adress = info.Adress;
                        constract.Isaccomplish = info.Isaccomplish;
                        constract.AmountMoney = info.AmountMoney;
                        bll.ObjectStateManager.ChangeObjectState(constract, EntityState.Modified);
                        bll.SaveChanges();

                        strJson = "修改完成！";
                    }
                    else
                    {
                        constract = new t_CM_Constract();
                        constract.createDate = DateTime.Now;
                        constract.CtrName = info.CtrName;
                        constract.CtrCom = CurrentUser.Company;
                        constract.CtrAdmin = info.CtrAdmin;
                        constract.CtrInfo = info.CtrInfo;
                        constract.CtrPid = info.CtrPid;
                        constract.start_time = info.start_time;
                        constract.end_time = info.end_time;
                        constract.personid = info.personid;
                        var user = bll.t_CM_UserInfo.Where(p => p.UserID == info.personid).FirstOrDefault();
                        if (user != null)
                            constract.person = user.UserName;
                        constract.personids = info.personids;
                        constract.dateFixCount = info.dateFixCount;
                        constract.testFixCount = info.testFixCount;
                        constract.ConType = 3;
                        constract.LinkMan = info.LinkMan;

                        constract.Type = info.Type;
                        constract.Tel = info.Tel;

                        constract.AddUserID = CurrentUser.UserID;

                        constract.UnitCity = info.UnitCity;
                        constract.UnitProvince = info.UnitProvince;

                        constract.ProjectName = info.ProjectName;
                        constract.Coordination = info.Coordination;
                        constract.Approvers = info.Approvers;
                        constract.ItemUsers = info.ItemUsers;
                        constract.ProjectManager = info.ProjectManager;
                        constract.BudgetUser = info.BudgetUser;
                        constract.ConMoneys = info.ConMoneys;
                        constract.Adress = info.Adress;
                        constract.Isaccomplish = 0;

                        constract.ConNo = info.ConNo;

                        constract.AmountMoney = info.AmountMoney;
                        bll.t_CM_Constract.AddObject(constract);
                        bll.SaveChanges();
                        //t_CM_Constract con = bll.t_CM_Constract.Where(p => p.id == constract.id).FirstOrDefault();
                        //con.ConNo = GetConNo(con.Type, con.id.ToString());
                        //bll.ObjectStateManager.ChangeObjectState(con, EntityState.Modified);
                        //bll.SaveChanges();
                        strJson = "添加成功！";
                    }
                }
                else
                {
                    constract = new t_CM_Constract();
                    constract.createDate = DateTime.Now;
                    constract.CtrName = info.CtrName;
                    constract.CtrCom = CurrentUser.Company;
                    constract.CtrAdmin = info.CtrAdmin;
                    constract.CtrInfo = info.CtrInfo;
                    constract.CtrPid = info.CtrPid;
                    constract.start_time = info.start_time;
                    constract.end_time = info.end_time;
                    constract.personid = info.personid;
                    var user = bll.t_CM_UserInfo.Where(p => p.UserID == info.personid).FirstOrDefault();
                    if (user != null)
                        constract.person = user.UserName;
                    constract.personids = info.personids;
                    constract.dateFixCount = info.dateFixCount;
                    constract.testFixCount = info.testFixCount;
                    constract.UID = info.UID;
                    constract.ConType = 3;
                    constract.LinkMan = info.LinkMan;
                    constract.Tel = info.Tel;
                    constract.Type = info.Type;
                    constract.AddUserID = CurrentUser.UserID;
                    constract.UnitCity = info.UnitCity;
                    constract.UnitProvince = info.UnitProvince;
                    constract.ProjectName = info.ProjectName;
                    constract.Coordination = info.Coordination;
                    constract.Approvers = info.Approvers;
                    constract.ItemUsers = info.ItemUsers;
                    constract.ProjectManager = info.ProjectManager;
                    constract.BudgetUser = info.BudgetUser;

                    constract.ConMoneys = info.ConMoneys;
                    constract.ConNo = info.ConNo;
                    constract.Adress = info.Adress;
                    constract.Isaccomplish = 0;

                    constract.AmountMoney = info.AmountMoney;
                    bll.t_CM_Constract.AddObject(constract);

                    bll.SaveChanges();
                    //t_CM_Constract con = bll.t_CM_Constract.Where(p => p.id == constract.id).FirstOrDefault();
                    //con.ConNo = GetConNo(con.Type, con.id.ToString());
                    //bll.ObjectStateManager.ChangeObjectState(con, EntityState.Modified);
                    //bll.SaveChanges();
                    strJson = "添加成功！";
                }
                sendMsg(ids);
                return Content(strJson);
            }
            catch (Exception e)
            {
                return Content("处理失败！");
            }

        }
        private string GetConNo(int? type, string conid)
        {
            string res = string.Empty;
            string Contype;
            switch (type)
            {
                case 1:
                    Contype = "CB";
                    break;
                case 2:
                    Contype = "SJ";
                    break;
                case 3:
                    Contype = "CP";
                    break;
                case 4:
                    Contype = "YW";
                    break;
                case 5:
                    Contype = "GL";
                    break;
                case 6:
                    Contype = "SLGL";
                    break;
                default:
                    Contype = "YW";
                    break;

            }
            res = Contype + "-" + DateTime.Now.ToString("yy") + "-" + conid;
            return res;

        }
        //批量发送短信;
        public void sendMsg(List<string> personids)
        {
            string ids = "0";
            for (int i = 0; i < personids.Count; i++)
            {
                ids += ("," + personids[i]);
            }
            string sql = "SELECT * FROM t_CM_UserInfo WHERE UserID IN (" + ids + ")";
            List<t_CM_UserInfo> listPDRinfo = bll.ExecuteStoreQuery<t_CM_UserInfo>(sql).ToList();
            for (int i = 0; i < listPDRinfo.Count; i++)
            {
                UtilsSms.smsContractTemp(listPDRinfo[i].Mobilephone, "有合同事项");
            }
        }



        //加载合同信息；
        public ActionResult LoadConstractInfo(int id)
        {
            string sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID =t_CM_Unit.UnitID where t_CM_Constract.id=" + id;
            Constract listPDRinfo = bll.ExecuteStoreQuery<Constract>(sql).FirstOrDefault();
            return Json(listPDRinfo, JsonRequestBehavior.AllowGet);
        }
        public ActionResult LoadConstract()
        {


            //string str = HomeController.GetUserID();
            string str = "";

            var userlist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).Select(p => p.UserID).ToList().Distinct();
            foreach (var item in userlist)
            {
                str += item + ",";
            }
            if (string.IsNullOrEmpty(str))
            {
                return Content("");
            }
            str = str.Substring(0, str.Length - 1);
            string sql = "SELECT  a.ID,a.ProjectName,a.Type,a.Adress,a.Type,c.UserName as ProjectManager,a.Tel,b.UnitName as CtrPName,a.Coordination FROM  t_CM_Constract a inner join t_CM_Unit b on a.UID =b.UnitID inner join t_CM_UserInfo c on a.ProjectManager=c.UserID where a.AddUserID IN (" + str + ")";
            List<ProJectMap> listPDRinfo = bll.ExecuteStoreQuery<ProJectMap>(sql).ToList();
            return Json(listPDRinfo, JsonRequestBehavior.AllowGet);
        }

        public class ProJectMap
        {
            public int ID { get; set; }
            public string ProjectName { get; set; }
            public string Adress { get; set; }
            public string ProjectManager { get; set; }
            public string CtrPName { get; set; }
            public string Tel { get; set; }
            public string Coordination { get; set; }
            public int? Type { get; set; }
        }
        public ActionResult GetIsExaminationUser(int conid, int itemid = 0)
        {
            bool isItemAdminUser = false;
            bool isApproversUser = false;
            bool isPersonid = false;
            bool isCSPersonid = false;
            bool isFuZeUser = false;
            try
            {
                //var m = bll.t_ES_ContractTemplet.Where(p => p.ID == id).FirstOrDefault();
                var model = bll.t_CM_Constract.Where(p => p.id == conid).FirstOrDefault();
                if (model != null)
                {
                    //var model = bll.t_CM_Constract.Where(p => p.id == m.conid).FirstOrDefault();
                    List<string> uids = model.ItemUsers.Split(',').ToList();
                    if (uids.Contains(CurrentUser.UserID.ToString()))
                    {
                        isItemAdminUser = true;
                    }
                    List<string> Auids = model.Approvers.Split(',').ToList();
                    if (Auids.Contains(CurrentUser.UserID.ToString()))
                    {
                        isApproversUser = true;
                    }
                    List<string> Puids = model.personid.ToString().Split(',').ToList();
                    if (Puids.Contains(CurrentUser.UserID.ToString()))
                    {
                        isPersonid = true;
                    }
                    List<string> CSuids = model.personids.Split(',').ToList();
                    if (CSuids.Contains(CurrentUser.UserID.ToString()))
                    {
                        isCSPersonid = true;
                    }
                    if (itemid != 0)
                    {
                        var m = bll.t_ES_ContractTemplet.Where(p => p.ID == itemid).FirstOrDefault();
                        List<string> Fzuids = m.PersonID.ToString().Split(',').ToList();
                        if (Fzuids.Contains(CurrentUser.UserID.ToString()))
                        {
                            isFuZeUser = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json("Error" + ex.Message);
            }
            return Json(new { isItemAdminUser = isItemAdminUser, isApproversUser = isApproversUser, isPersonid = isPersonid, isCSPersonid = isCSPersonid, isFuZeUser = isFuZeUser });
        }

        public ActionResult UpdateState(int isok, string reason, int id)
        {
            try
            {
                var model = bll.t_ES_ContractTemplet.Where(p => p.ID == id).FirstOrDefault();
                model.IsOk = isok;
                if (isok == 5)
                {
                    model.Reason = reason;
                }
                if (model.Type == 2 && model.IsOk == 4)
                {
                    var conModel = bll.t_CM_Constract.Where(p => p.id == model.conid).FirstOrDefault();
                    conModel.ReturnedMoney = Math.Round((model.Moneys.Value / conModel.ConMoneys.Value * 100), 2);
                    bll.ObjectStateManager.ChangeObjectState(conModel, EntityState.Modified);
                    bll.SaveChanges();
                }
                bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                bll.SaveChanges();
                t_CM_ItemOperationLog mo = new t_CM_ItemOperationLog();
                mo.UserID = CurrentUser.UserID;
                mo.CreatTime = DateTime.Now;
                mo.ItemID = id;
                if (isok == 1)
                    mo.Remarks = mo.CreatTime.ToString() + "待处理" + model.ID + "_" + model.Name + "_事項";
                else if (isok == 2)
                    mo.Remarks = mo.CreatTime.ToString() + "已反馈" + model.ID + "_" + model.Name + "_事項";
                else if (isok == 3)
                    mo.Remarks = mo.CreatTime.ToString() + "待进场" + model.ID + "_" + model.Name + "_事項";
                else if (isok == 4)
                    mo.Remarks = mo.CreatTime.ToString() + "已完成" + model.ID + "_" + model.Name + "_事項";
                else if (isok == 5)
                    mo.Remarks = mo.CreatTime.ToString() + "已拒接" + model.ID + "_" + model.Name + "_事項";
                AddOlog(mo);
                return Json("ok");
            }
            catch (Exception ex)
            {
                return Json("Error" + ex.Message);
            }
        }
        public ActionResult AddLog(int id, string rearmks)
        {
            t_CM_ItemOperationLog mo = new t_CM_ItemOperationLog();
            mo.UserID = CurrentUser.UserID;
            mo.CreatTime = DateTime.Now;
            mo.ItemID = id;
            mo.Remarks = mo.CreatTime.ToString() + "：" + rearmks;
            AddOlog(mo);
            return Json("ok");
        }

        private void AddOlog(t_CM_ItemOperationLog model)
        {
            bll.t_CM_ItemOperationLog.AddObject(model);
            bll.SaveChanges();
        }

        public ActionResult GetLog(string username, string content, string time, int id = 0, int rows = 10, int page = 1)
        {
            try
            {

                string sql = "select c.UserName,a.CreatTime,a.Remarks from t_CM_ItemOperationLog a inner join t_ES_ContractTemplet b on a.ItemID=b.ID inner join t_CM_UserInfo c on a.UserID=c.UserID where 1=1";
                if (id != 0)
                {
                    sql += " and a.ItemID=" + id;
                }
                if (!string.IsNullOrEmpty(username))
                {
                    sql += " and c.UserName like '%" + username + "%'";
                }
                if (!string.IsNullOrEmpty(time))
                {
                    sql += " and  CONVERT(varchar(10),a.CreatTime, 120)='" + time + "'";
                }
                if (!string.IsNullOrEmpty(content))
                {
                    sql += " and a.Remarks like '%" + content + "%'";
                }
                sql += " order by CreatTime desc";
                var result = bll.ExecuteStoreQuery<LogView>(sql).Skip((page - 1) * rows).Take(rows).ToList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("Error" + ex.Message);
            }
        }
        public class LogView
        {
            public string UserName { get; set; }
            public DateTime? CreatTime { get; set; }
            public string Remarks { get; set; }
        }


        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult DeleteItem(int id)
        {
            t_ES_ContractTemplet m = bll.t_ES_ContractTemplet.Where(p => p.ID == id).FirstOrDefault();

            bll.t_ES_ContractTemplet.DeleteObject(m);
            bll.SaveChanges();
            return Json("ok");
        }


        //加载合同列表；
        public ActionResult LoadConstractDatas(string creatTime, int rows, int page, string proName, int type = 0, int areaid = 0)
        {
            try
            {
                string sql = "";
                if (CurrentUser.RoleID == 1)
                    sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID ORDER BY createDate DESC,id DESC";
                else
                {
                    string str = "";

                    var userlist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).Select(p => p.UserID).ToList().Distinct();
                    foreach (var item in userlist)
                    {
                        str += item + ",";
                    }
                    //if (Convert.ToBoolean(CurrentUser.IsAdmin))
                    //{
                    //    var Ulist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).ToList();
                    //    foreach (var item in Ulist)
                    //    {
                    //        if (!string.IsNullOrEmpty(item.UNITList))
                    //            str += item.UserID + ",";
                    //    }
                    //    if (!string.IsNullOrEmpty(str))
                    //        str = str.Substring(0, str.Length - 1);

                    //}
                    //else
                    //{
                    //    str = CurrentUser.UserID.ToString();
                    //}
                    if (string.IsNullOrEmpty(str))
                    {
                        return Content("");
                    }
                    str = str.Substring(0, str.Length - 1);
                    sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID where t_CM_Constract.AddUserID IN(" + str + ")  ORDER BY createDate DESC,id DESC";
                }
                List<Constract> list = bll.ExecuteStoreQuery<Constract>(sql).ToList();
                if (!string.IsNullOrEmpty(proName))
                {
                    list = list.Where(c => c.ProjectName.ToLower().Contains(proName.ToLower())).ToList();
                }
                if (type != 0)
                {
                    list = list.Where(c => c.Type == type).ToList();
                }
                if (areaid != 0)
                {
                    string a = areaid.ToString();
                    list = list.Where(c => c.UnitCity == a).ToList();
                }
                if (!string.IsNullOrEmpty(creatTime))
                {
                    DateTime d = Convert.ToDateTime(creatTime);
                    list = list.Where(c => c.createDate == d).ToList();
                }
                for (var i = 0; i < list.Count(); i++)
                {
                    if (IsAlarm(Convert.ToInt32(list[i].id)))
                    {
                        list[i].IsAlarm = "true";
                    }
                    else
                    {
                        list[i].IsAlarm = "false";
                    }
                }
                return Content(Common.List2Json(list, rows, page));
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        public bool IsAlarm(int id)
        {
            bool flag = false;
            List<t_ES_ContractTemplet> list = bll.t_ES_ContractTemplet.Where(p => p.conid == id && p.IsOk == 0).ToList();
            foreach (var item in list)
            {
                if (item.StartTime <= DateTime.Now.AddDays(Convert.ToDouble(item.BeforDay)))
                {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
        public JsonResult GetShopTruck()
        {
            try
            {
                if (CurrentUser != null)
                {
                    string str = HomeController.GetUID();
                    if (!string.IsNullOrEmpty(str))
                    {
                        string sql = "select a.*,b.UnitName,b.LinkAddress from t_CM_ShopTruck a inner join t_CM_Unit b on a.UID=b.UnitID Where UID IN (" + str + ")";
                        var result = bll.ExecuteStoreQuery<TruckView>(sql);
                        return Json(result, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json("No Data", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json("Please Log In", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json("Error" + ex.Message);
            }
        }
        public class TruckView : t_CM_ShopTruck
        {
            public string LinkAddress { get; set; }
            public string UnitName { get; set; }
        }


        public JsonResult GetItemList()
        {
            try
            {
                //string str = HomeController.GetUserID();
                //string sql = "select ID FROM t_CM_Constract WHERE AddUserID IN (" + str + ")";
                //List<int> conids = bll.ExecuteStoreQuery<int>(sql).ToList();

                // var rr = bll.t_ES_ContractTemplet.Where(p => p.Type == type).ToList();


                // var listUSERid = bll.t_ES_ContractTemplet.Where(p => CurrentUser.UserID.Contains(p.conid.Value)).Select(p => p.PersonID).Distinct().ToList();
                if (CurrentUser.RoleID == 1)
                {
                    var list = bll.t_ES_ContractTemplet.Where(p => p.IsOk < 4 || p.IsOk == 5).ToList();
                    var result = from n in list
                                 select new
                                 {
                                     id = n.ID,
                                     ProID = n.conid,
                                     Name = n.Name,
                                     EndTime = n.EndTime.ToString(),
                                     State = GetStateName(n.IsOk.Value),
                                     Type = n.Type,
                                     Adress = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().Adress,
                                     Coordination = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().Adress,
                                     person = bll.t_CM_UserInfo.Where(p => p.UserID == n.PersonID).FirstOrDefault().UserName,
                                     FistDate = n.FistDate.ToString(),
                                     ProjectName = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().ProjectName
                                 };

                    var list1 = bll.t_ES_ContractTemplet.Where(p => p.IsOk == 4).ToList();
                    var result1 = from n in list1
                                  select new
                                  {
                                      id = n.ID,
                                      ProID = n.conid,
                                      Name = n.Name,
                                      EndTime = n.EndTime.ToString(),
                                      State = GetStateName(n.IsOk.Value),
                                      Type = n.Type,
                                      Adress = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().Adress,
                                      Coordination = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().Adress,
                                      person = bll.t_CM_UserInfo.Where(p => p.UserID == n.PersonID).FirstOrDefault().UserName,
                                      FistDate = n.FistDate.ToString(),
                                      ProjectName = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().ProjectName
                                  };
                    return Json(new { fished_Item = result1, unfished_Item = result }, JsonRequestBehavior.AllowGet);

                }
                else
                {
                    var list = bll.t_ES_ContractTemplet.Where(p => CurrentUser.UserID == p.PersonID && (p.IsOk < 4 || p.IsOk == 5)).ToList();
                    var result = from n in list
                                 select new
                                 {
                                     id = n.ID,
                                     ProID = n.conid,
                                     Name = n.Name,
                                     EndTime = n.EndTime.ToString(),
                                     State = GetStateName(n.IsOk.Value),
                                     Type = n.Type,
                                     Adress = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().Adress,
                                     Coordination = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().Coordination,
                                     person = bll.t_CM_UserInfo.Where(p => p.UserID == n.PersonID).FirstOrDefault().UserName,
                                     FistDate = n.FistDate.ToString(),
                                     ProjectName = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().ProjectName
                                 };

                    var list1 = bll.t_ES_ContractTemplet.Where(p => CurrentUser.UserID == p.PersonID && p.IsOk == 4).ToList();
                    var result1 = from n in list1
                                  select new
                                  {
                                      id = n.ID,
                                      ProID = n.conid,
                                      Name = n.Name,
                                      EndTime = n.EndTime.ToString(),
                                      State = GetStateName(n.IsOk.Value),
                                      Type = n.Type,
                                      Adress = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().Adress,
                                      Coordination = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().Coordination,
                                      person = bll.t_CM_UserInfo.Where(p => p.UserID == n.PersonID).FirstOrDefault().UserName,
                                      FistDate = n.FistDate.ToString(),
                                      ProjectName = bll.t_CM_Constract.Where(p => p.id == n.conid).FirstOrDefault().ProjectName
                                  };
                    return Json(new { fished_Item = result1, unfished_Item = result }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json("Error" + ex.Message);
            }
        }
        public string GetStateName(int id)
        {
            string name = "待接收";
            switch (id)
            {
                case 0:
                    name = "待接收";
                    break;
                case 1:
                    name = "待处理";
                    break;
                case 2:
                    name = "已反馈";
                    break;
                case 3:
                    name = "待审核";
                    break;
                case 4:
                    name = "已完成";
                    break;
                case 5:
                    name = "未通过";
                    break;
                case 6:
                    name = "已逾期";
                    break;

            }
            return name;
        }

        public ActionResult updateArrivedTime(int ItemID, float distance)
        {

            string time = DateTime.Now.ToString();
            string DstsInfo;
            if (distance < 300)
                DstsInfo = "正常打卡，距离" + distance + "米";
            else
                DstsInfo = "异常打卡，距离" + distance + "米";
            //UPDATE t_PM_Order SET FistDate='2018-02-03 17:40:15.097',DstsInfo='正常打卡，距离100米' WHERE OrderID=39
            string sql = "UPDATE t_ES_ContractTemplet SET FistDate='" + time + "' WHERE ID=" + ItemID;
            bll.ExecuteStoreCommand(sql);
            return Content("{\"resultCode\": 0,\"results\":{\"FistDate\":\"" + time + "\"}}");

        }

        public ActionResult QueRenProject(int id)
        {
            try
            {
                var model = bll.t_CM_Constract.Where(p => p.id == id).FirstOrDefault();
                model.Isaccomplish = 1;
                bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                bll.SaveChanges();
                return Json("ok", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("error" + ex.Message);
            }
        }

        //public ActionResult GetHisData(int rows=10, int page=1)
        //{
        //    try
        //    {

        //        MongoHelper mon = new MongoHelper();
        //        FilterDefinitionBuilder<BsonDocument> builderFilter = Builders<BsonDocument>.Filter;
        //        FilterDefinition<BsonDocument> filter = builderFilter.Eq("TagID", 358);
        //        List<his> list= mon.Select<his>("t_SM_HisData_00001", filter, rows, page);
        //        return Json(list, JsonRequestBehavior.AllowGet);
        //    }
        //    catch(Exception ex)
        //    {
        //      string ss=  ex.Message;
        //    }
        //    return Json("ok",JsonRequestBehavior.AllowGet);
        //}
        



        public string SendHttpRequest(string requestURI, string requestMethod, PostData data)
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
        public class PostData
        {
            public string ak { get; set; }
            public int service_id { get; set; }
            public string entity_name { get; set; }
            public string entity_desc { get; set; }
            public double latitude { get; set; }
            public double longitude { get; set; }

            public string loc_time { get; set; }
            public string coord_type_input { get; set; }
        }
        #endregion
        #region PUE相关

        public JsonResult GetRealTimePUEData(int pid)
        {
            List<pueView> list_top = new List<pueView>();
            string uids = HomeController.GetUID();
            decimal RealValue = 0;
            DateTime time = DateTime.Now;
            List<pueView> list_le = new List<pueView>();
            if (!string.IsNullOrEmpty(uids))
            {
                var uidList = uids.Split(',').ToList().ConvertAll<int?>(p => int.Parse(p));
                var TopList = bll.t_EE_PUERealTime.Where(p => p.PID == pid && p.PUE != -1 && p.PUE != null && p.RecordTime.Value.Year == time.Year && p.RecordTime.Value.Month == time.Month && p.RecordTime.Value.Day == time.Day).OrderBy(p => p.RecordTime).ToList();
                var groupTopList = TopList.GroupBy(p => p.RecordTime);
                foreach (var item in groupTopList)
                {
                    pueView m = new pueView();
                    m.name = item.Key.ToString();
                    m.value = item.Sum(p => p.PUE);
                    list_top.Add(m);
                }
                var model = groupTopList.OrderByDescending(p => p.Key).FirstOrDefault();
                if (model != null)
                {
                    if (model.Sum(p => p.PUE) != null)
                        RealValue = model.Sum(p => p.PUE).Value;
                    else
                        RealValue = 0;
                }
                var cids = GetcidByPID("PUE能耗效率统计", pid);
                if (cids != "0")
                {
                    var cidList = cids.Split(',').ToList().ConvertAll<int>(p => Convert.ToInt32(p));
                    foreach (var cid in cidList)
                    {
                        pueView mm = new pueView();
                        string CName = "";
                        if (bll.t_DM_CircuitInfo.Where(p => p.CID == cid).FirstOrDefault() != null)
                        {
                            CName = bll.t_DM_CircuitInfo.Where(p => p.CID == cid).FirstOrDefault().CName;
                        }
                        mm.name = CName;
                        if (bll.t_EE_PowerQualityRealTime.Where(p => p.PID == pid && p.CID == cid && p.Power != -1 && p.Power != null && p.RecordTime.Value.Year == time.Year && p.RecordTime.Value.Month == time.Month && p.RecordTime.Value.Day == time.Day).Sum(p => p.Power) == null)
                            mm.value = 0;
                        else
                            mm.value = bll.t_EE_PowerQualityRealTime.Where(p => p.PID == pid && p.CID == cid && p.Power != -1 && p.Power != null && p.RecordTime.Value.Year == time.Year && p.RecordTime.Value.Month == time.Month && p.RecordTime.Value.Day == time.Day).Sum(p => p.Power);

                        list_le.Add(mm);
                    }

                }

            }
            return Json(new { list_top, RealValue, list_le = list_le.OrderBy(p => p.value) }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPUEDataByTime(int totaltype, string datestart, string dateend, int pid)
        {
            List<pueView> data = new List<pueView>();
            try
            {
                string tablename = "";
                switch (totaltype)
                {
                    case 1:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.ToString("yyyy-MM-dd 00:00:00");
                        break;
                    case 2:
                        tablename = "Monthly";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = TimeUtils.getThisMonthFirstDay(DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 3:
                        tablename = "Yearly";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = new DateTime(DateTime.Now.Year, 1, 1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 4:
                        tablename = "Daily";
                        break;
                }
                string tabname = "t_EE_PUE" + tablename;
                string strsql = "select * from " + tabname + "  where PUE is not null";
                if (!pid.Equals(""))
                {
                    strsql += " and PID=" + pid + "";
                }
                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsql += " and RecordTime >='" + datestart + "' and RecordTime <='" + dateend + "'";
                }
                strsql += "   ORDER BY RecordTime";
                List<PUEViewLine> list = bll.ExecuteStoreQuery<PUEViewLine>(strsql).ToList();
                foreach (var item in list.GroupBy(p => p.RecordTime))
                {
                    pueView m = new pueView();
                    m.name = item.Key.ToString();
                    m.value = Math.Round(item.Sum(p => p.PUE), 2);
                    data.Add(m);
                }
            }
            catch (Exception ex)
            {
                data = null;
            }
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public class PUEViewLine
        {
            public int ID { get; set; }
            public int UID { get; set; }
            public int PID { get; set; }
            public decimal PUE { get; set; }
            public decimal AllPower { get; set; }
            public decimal ITPower { get; set; }
            public DateTime RecordTime { get; set; }
        }
        private string GetcidByPID(string typename, int pid)
        {
            string cid = "0";
            using (var bll = new pdermsWebEntities())
            {

                t_EE_PowerConfigInfo model = bll.t_EE_PowerConfigInfo.Where(p => p.cid_type_name == typename).FirstOrDefault();
                if (model != null)
                {
                    var info = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == model.cid_type_id && p.pid == pid).FirstOrDefault();
                    if (info != null)
                    {
                        cid = info.cid;
                    }
                }
            }
            return cid;
        }
        public class pueView
        {
            public string name { get; set; }
            public decimal? value { get; set; }
        }
        #endregion

        #region 元器件
        public JsonResult GetElementList(string name,int pid=0,int did=0, int page=1, int rows=10)
        {
            IList<IDAO.Models.t_DM_ElementDevice> list = DAL.ElementDeviceDAL.getInstance().GetElementList(name,pid,did, page, rows);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddOrUpdateElement(IDAO.Models.t_DM_ElementDevice model)
        {
            int n = 0;
            if (model.ID > 0)
            {
                IDAO.Models.t_DM_ElementDevice info = DAL.ElementDeviceDAL.getInstance().GetModelByID(model.ID);
                info.DeviceCode = model.DeviceCode;
                info.DeviceModel = model.DeviceModel;
                info.DeviceName = model.DeviceName;
                info.DID = model.DID;
                info.DName = model.DName;
                info.Manufactor = model.Manufactor;
                info.PID = model.PID;
                info.PName = model.PName;
                n = DAL.ElementDeviceDAL.getInstance().Update(info);
            }
            else
            {
                IDAO.Models.t_DM_ElementDevice info = new IDAO.Models.t_DM_ElementDevice();
                info.DeviceCode = model.DeviceCode;
                info.DeviceModel = model.DeviceModel;
                info.DeviceName = model.DeviceName;
                info.DID = model.DID;
                info.DName = model.DName;
                info.Manufactor = model.Manufactor;
                info.PID = model.PID;
                info.PName = model.PName;
                n = DAL.ElementDeviceDAL.getInstance().Add(info);
            }
            if (n >0)
            {
                return Json("ok", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("修改失败，请联系管理员", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DeleteElementList(string id)
        {
            int n = DAL.ElementDeviceDAL.getInstance().Delete(id);
            if (n > 0)
            {
                return Json("ok", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("删除失败，请联系管理员", JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetElementModel(int id)
        {
            IDAO.Models.t_DM_ElementDevice info = DAL.ElementDeviceDAL.getInstance().GetModelByID(id);
            return Json(info, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}
