using EnergyManage.PubClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using YWWeb.Lib.Base;

namespace EnergyManage.Controllers
{
    public class EMSettingController : UserControllerBaseEx
    {
        // GET: energyManage/Home
        public ActionResult Index()
        {
            return View();
        }
        //组织区域管理编辑工具
        public ActionResult OrganizeAreaTreeEdit()
        {
            
            return View();
        }
        #region 


        //返回树
        public JsonResult GetTree(int pid, int itemType)
        {
            IList<IDAO.Models.t_EE_EnerUserProject> list = DAL.EnerUserProjectDAL.getInstance().GetOrganizationTree(pid, itemType);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回单位列表
        public JsonResult GetUnitList()
        {
            IList<IDAO.Models.t_CM_Unit> list = DAL.UnitDAL.getInstance().GetUnitList(CurrentUser.UNITList);
            return Json(list, JsonRequestBehavior.AllowGet);
        }




        public JsonResult getPDCTree(string unitID)
        {
            IList<IDAO.Models.t_V_DeviceInfoState_PDR1> list = DAL.VDeviceInfoState_PDR1DAL.getInstance().getPDCTree(unitID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }




        public JsonResult GetOrganizationList(int type)
        {
            IList<IDAO.Models.t_EE_EnerUserType> list = DAL.EnerUserTypeDAL.getInstance().GetOrganizationList(type);
            return Json(list, JsonRequestBehavior.AllowGet);
        }





        #endregion



    }
}