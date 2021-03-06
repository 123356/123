﻿using DAL;
using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace YWWeb.Lib.Base
{
    public class UserControllerBase : Controller
    {
        public t_CM_UserInfo CurrentUser
        {
            get { return (t_CM_UserInfo)System.Web.HttpContext.Current.Session["Huerinfo"]; }
            //set { System.Web.HttpContext.Current.Session["Huerinfo"] = value; }
        }
        public IList<t_CM_Unit> GetUnitComobox()
        {
            string unlist = string.Empty;
            IList<t_CM_UserInfo> userlist = DAL.UserInfoDAL.getInstance().GetUnitLIstByUserID(CurrentUser);
            foreach (var item in userlist)
            {
                if (!string.IsNullOrEmpty(item.UNITList))
                    unlist += item.UNITList.Trim() + ",";
            }
            if (!string.IsNullOrEmpty(unlist))
                unlist = unlist.Substring(0, unlist.Length - 1);

            IList<t_CM_Unit> unitlist = DAL.UnitDAL.getInstance().GetUnitList(unlist);
            return unitlist;
        }
        public string GetPIDs()
        {
            string pidList = string.Empty;
            string unlist = string.Empty;
            IList<t_CM_UserInfo> userlist = DAL.UserInfoDAL.getInstance().GetUnitLIstByUserID(CurrentUser);
            foreach (var item in userlist)
            {
                if (!string.IsNullOrEmpty(item.UNITList))
                    unlist += item.UNITList.Trim() + ",";
            }
            if (!string.IsNullOrEmpty(unlist))
                unlist = unlist.Substring(0, unlist.Length - 1);

            IList<t_CM_Unit> unitlist = DAL.UnitDAL.getInstance().GetUnitList(unlist);

            foreach (var item in unitlist)
            {
                if (!string.IsNullOrEmpty(item.PDRList))
                    pidList += item.PDRList.Trim() + ",";
            }
            if (!string.IsNullOrEmpty(unlist))
                pidList = pidList.Substring(0, pidList.Length - 1);

            return pidList;
        }
        public virtual void LogDebug(string msg)
        {
            System.Diagnostics.Debug.WriteLine(msg);
        }
        public virtual void LogException(Exception ex)
        {
            System.Diagnostics.Debug.WriteLine(ex);
        }
        public virtual void LogInfo(string msg)
        {
            System.Diagnostics.Debug.WriteLine(msg);

        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var noAuthorizeAttributes = filterContext.ActionDescriptor.GetCustomAttributes(typeof(AuthorizeIgnoreAttribute), false);
            if (noAuthorizeAttributes.Length > 0)//不需要登陆
                return;
            base.OnActionExecuting(filterContext);
            //LogHelper.Debug(filterContext.HttpContext.Timestamp.ToString());
            if (CurrentUser == null)
            {
                //获取页面设置的单点登录页面
                //if (ConfigurationManager.AppSettings["SSO"] != null)
                //{
                //    string url = ConfigurationManager.AppSettings["SSO"];

                //}
                //cookie 登陆
                try
                {

                    HttpCookie cookie = filterContext.HttpContext.Request.Cookies["myYWAppInf"];
                    if (null != cookie)
                    {
                        string username = Encrypt.MD5Decrypt2(cookie["appkey"]);
                        string MD5password = Encrypt.MD5Decrypt2(cookie["appu"]);
                        //List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.UserName == username && u.UserPassWord == MD5password).ToList();
                        //List<t_CM_UserInfo> list = UserInfoDAL.getInstance().GetUsers(username, MD5password) as List<t_CM_UserInfo>;
                        t_CM_UserInfo userInf = LoginManager.Login(username, MD5password, this.ControllerContext, out int errCode);
                        if (null!= userInf)//(list.Count > 0)
                        {
                           // filterContext.HttpContext.Session["Huerinfo"] = list[0];
                            //LogHelper.Debug(username + "--auto login");
                            LogDebug(username + "--auto login");
                            return;
                        }
                    }
                }
                catch (Exception ex)
                {
                    //LogHelper.Warn(ex);
                    LogInfo(ex.ToString());
                }
                filterContext.HttpContext.Session.RemoveAll();
                filterContext.HttpContext.Response.Write("<script language=javascript>top.location.href='/Home/Login';</script>");
                //filterContext.HttpContext.Response.Redirect("~/Home/Login");
                //filterContext.Result = RedirectToAction("Login", "Home", new { area = "" });
            }
            else
            {
                //string sid = filterContext.HttpContext.Session.SessionID;
                //string username = CurrentUser.UserName;
                //List<t_CM_UserLogin> listLogin = bll.t_CM_UserLogin.Where(l => l.UserName.ToLower() == username.ToLower()).ToList();
                //if (listLogin.Count > 0)
                //{
                //    if (sid != listLogin[0].SessionID)
                //    {
                //        filterContext.HttpContext.Response.Write("<script language=javascript>alert('此用户已在其他地方登录，请重新登录！');top.location.href='/Home/Login';</script>");
                //    }
                //}
            }
        }
    }
}
