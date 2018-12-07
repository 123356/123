using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using YWWeb.Lib.Base;

namespace EnergyManage.Controllers
{
    public class EMHomeController : UserControllerBase
    {
        // GET: energyManage/Home
        public ActionResult Index()
        {
            return View();
        }
    }
}