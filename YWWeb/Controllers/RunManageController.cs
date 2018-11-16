using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace S5001Web.Controllers
{
    public class RunManageController : Controller
    {
        //
        // GET: /RunManage/
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        [Login]
        public ActionResult BugList()
        {
            return View();
        }
    }
}
