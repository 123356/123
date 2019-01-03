using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Hosting;
using YWWeb.Import;
using DAL;
using System.Web.Mvc;
using System.Web;
using Loger;

namespace YWWeb.Lib.Base
{
    public class LoginManager
    {
        public static t_CM_UserInfo Login(string username, string password,ControllerContext actionContext, out int ErrCode)
        {
            ErrCode = 0;
            t_CM_UserInfo userInf = null;
            if (!GetLicense())
            {
                ErrCode = -1;
                return userInf;
            }

            string MD5password = Lib.Base.Encrypt.MD5Encrypt(password);
            //List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(u => u.UserName == username && u.UserPassWord == MD5password).ToList();
            IList<IDAO.Models.t_CM_UserInfo> list = UserInfoDAL.getInstance().GetUsers(username, MD5password);
            if (list.Count > 0)
            {
                actionContext.HttpContext.Session["Huerinfo"] = userInf=list[0];
                try
                {
                    HttpCookie cookie = new HttpCookie("myYWAppInf");
                    //cookie.Expires = DateTime.Now.AddYears(20);
                    cookie.Values.Set("appkey", Lib.Base.Encrypt.MD5Encrypt2(username));
                    cookie.Values.Add("appu", Lib.Base.Encrypt.MD5Encrypt2(password));
                    actionContext.HttpContext.Response.SetCookie(cookie);
                    actionContext.HttpContext.Response.Cookies.Add(cookie);
                }
                catch (Exception ex)
                {
                    LogHelper.Warn(ex);
                }
            }

            return userInf;
        }
        public static t_CM_UserInfo Login(string mobile, ControllerContext actionContext, out int ErrCode)
        {
            ErrCode = 0;
            t_CM_UserInfo userInf = null;
            if (!GetLicense())
            {
                ErrCode = -1;
                return userInf;
            }
            IList<IDAO.Models.t_CM_UserInfo> list = UserInfoDAL.getInstance().GetUsers(mobile);
            if (list.Count > 0)
            {
                actionContext.HttpContext.Session["Huerinfo"] = userInf = list[0];
            }

            return userInf;
        }
        public static t_CM_UserInfo WxLogin(string openid, ControllerContext actionContext, out int ErrCode)
        {
            ErrCode = 0;
            t_CM_UserInfo userInf = null;
            if (!GetLicense())
            {
                ErrCode = -1;
                return userInf;
            }
            IList<IDAO.Models.t_CM_UserInfo> list = UserInfoDAL.getInstance().GetWxUsers(openid);
            if (list.Count > 0)
            {
                actionContext.HttpContext.Session["Huerinfo"] = userInf = list[0];
            }

            return userInf;
        }


        private static DateTime m_dtLicense = DateTime.Now.AddDays(-1);
        private static bool GetLicense()
        {
            if (DateTime.Now > m_dtLicense)
            {
                var root = "~/bin/";
                StringBuilder sbPath = new StringBuilder(HostingEnvironment.MapPath(root));
                int nRet = LibLicenseEx.SetLicensePath(sbPath, sbPath.Capacity);
                StringBuilder sb = new StringBuilder(250);
                LibLicenseEx.SDK_GetLicenseFile(sb, sb.Capacity);
                StringBuilder sbmsg = new StringBuilder(50);
                int nb = LibLicenseEx.SDK_CheckLicense(sbmsg, sbmsg.Capacity);
                bool b = nb > 0 ? true : false;
                if (b)
                { m_dtLicense = DateTime.Now.AddMinutes(1); }
                else
                {
                    return false;
                }
            }

            return true;

        }
    }
}
