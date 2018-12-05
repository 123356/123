using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace YWWeb.Controllers
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
