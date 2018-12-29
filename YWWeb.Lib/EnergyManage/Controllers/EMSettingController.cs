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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="item_type">类型</param>
        /// <param name="Name">节点名称</param>
        /// <param name="Remarks">描述</param>
        /// <param name="parentID">父节点ID</param>
        /// <param name="unit_note"></param>
        /// <param name="parent_id"></param>
        /// <returns></returns>
        public JsonResult addTreeNode(int item_type, string Name, string Remarks, int parentID,int unit_note,int parent_id)
        {
            //查表中 是否有这段数据  如果有就修改  没有就添加  返回id
            int id = DAL.EnerUserTypeDAL.getInstance().unpDateproject(item_type, Name, Remarks);
            //通过id 去关系表中查  是否有 父级关系 如果parentID是null 则为新建根节点  childID  为添加的id


            // child_id unit_head unit_note Name Remarksitem_type


            return Json(id);
        }


        #endregion



    }
}