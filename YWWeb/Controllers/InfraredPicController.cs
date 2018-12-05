using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using YWWeb.PubClass;
using YWWeb;

namespace YWWeb.Controllers
{
    public class InfraredPicController : Controller
    {
        //
        // GET: /InfraredPic/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Index()
        {
            return View();
        }
        //获取json数据
        public ActionResult LoadInfraredPic(int pid, int ChannelID, string PositionName, string CDate)
        {
            string strsql = "select * from t_SM_InfraredPic where pid=" + pid + " and channelid=" + ChannelID + " and ImgPath<>''";
            if (!PositionName.Equals("全部"))
                strsql = strsql + " and PositionName='" + PositionName + "'";
            if (!CDate.Equals("") && !CDate.Equals("全部"))
                strsql = strsql + " and committime >='" + CDate + "' and committime<='" + CDate + " 23:59:59'";
            List<t_SM_InfraredPic> list = bll.ExecuteStoreQuery<t_SM_InfraredPic>(strsql).OrderByDescending(p => p.CommitTime).ToList();
            string strJson = Common.ToJson(list);
            return Content(strJson);
        }
    }
}
