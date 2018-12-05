using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Text;
using YWWeb.PubClass;
using System.Data;

namespace YWWeb.Controllers
{
    public class AppPlanController : Controller
    {
        //
        // GET: /AppPlan/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult OneGraph(string id)
        {
            return View("OneGraph" + id);
        }
        public ActionResult PlanInfo(string id)
        {
            return View("PlanInfo" + id);
        }
    }
}
