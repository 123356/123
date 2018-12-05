using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace YWWeb.Controllers
{
    public class SearchController : Controller
    {
        //网站查询
        // GET: /Search/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        //获取数据生成json文件
        public ActionResult CreateSearchJson()
        {
            //string strpdrlist = CurrentUser.PDRList;
            string strsql = "select * from t_DM_DeviceInfo";
            List<t_DM_DeviceInfo> list = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(strsql).ToList();
            string path = Server.MapPath("/json/search.js");
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }

            StreamWriter sr = System.IO.File.CreateText(path);
            sr.WriteLine("[");
            int count = list.Count(), len = 0;
            foreach (t_DM_DeviceInfo model in list)
            {
                len++;
                sr.WriteLine("{");
                sr.WriteLine("\"name\":" + "\"" + model.EadoCode+" " + model.DeviceName + " " + model.PName + "\",");
                sr.WriteLine("\"code\":" + "\"" + model.EadoCode + "\",");
                sr.WriteLine("\"type\":" + "\"1\",");
                sr.WriteLine("\"did\":" + "\"" + model.DID + "\",");
                sr.WriteLine("\"pid\":" + "\"" + model.PID + "\"");
                if (len == count)
                    sr.WriteLine("}");
                else
                    sr.WriteLine("},");
            }
            sr.WriteLine("]");
            sr.Close();
            return Content("JS已经成功生成！");
        }
        //获取
        public t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
    }
}
