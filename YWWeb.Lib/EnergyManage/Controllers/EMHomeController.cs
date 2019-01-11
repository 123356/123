using IDAO.Models;
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
        #region 能源总览
        public JsonResult GetEneryOverView(int uid, string time)
        {
            List<overView> left_view = new List<overView>();
            List<rightView> list = new List<rightView>();
            decimal zongRate = 0;
            //根据权限读取PID;
            string pids = GetPIDs();
            IList<t_EE_Budget> list_budgets = DAL.BudgetDAL.getInstance().GetBudgetByID(uid);

            IList<t_EE_enTypeConfig> list_peizhi = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid);
            foreach (var item_peizhi in list_peizhi)
            {
                decimal rate = 0;
                decimal energyConsumption = 0;
                decimal budget = 0;
                rightView view = new rightView();
                view.name = item_peizhi.Name;
                view.ID = item_peizhi.ID;
                budget = list_budgets.Where(p => p.EnergyTypeID == item_peizhi.Type).Sum(p => p.GeneralBudget);
                view.budget = budget;
                IList<t_EE_EnerUserProject> list_userP = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, item_peizhi.DepartmentID);
                foreach (var item_userP in list_userP)
                {
                    IList<t_DM_CircuitInfo> list_cir = DAL.CircuitInfoDAL.getInstance().GetCID(item_userP.addCid, item_peizhi.Type);
                    string cids = "";
                    foreach (var item_cir in list_cir)
                    {


                        cids += item_cir.CID + ",";

                    }
                    if (cids != "")
                        cids = cids.Substring(0, cids.Length - 1);
                    else
                        cids = "0";
                    IList<t_V_EneryView> list_data = DAL.EneryOverViewDAL.getInstance().GetDatas(cids, pids, time);
                    rate = list_data.Sum(p => p.Rate);
                    energyConsumption = list_data.Sum(p => p.Value);
                    zongRate += rate;
                    var group_list = list_data.GroupBy(p => p.Name);
                    //List<overView> group_data = new List<overView>();
                    foreach (var item_group in group_list)
                    {
                        overView group_i = new overView();
                        group_i.name = item_group.Key;
                        group_i.value = item_group.Sum(p => p.Rate);
                        view.keyValuePairs.Add(group_i);
                    }
                    //view.keyValuePairs.Add(group_data);

                    var group_list_time = list_data.GroupBy(p => p.RecordTime);
                    //List<overView> group_data_time = new List<overView>();
                    foreach (var item_group in group_list_time)
                    {
                        overView group_i = new overView();
                        group_i.name = item_group.Key.ToString();
                        group_i.value = item_group.Sum(p => p.Rate);
                        view.keyValuePairs_Time.Add(group_i);
                    }
                    //view.keyValuePairs_Time.Add(group_data_time);
                }
                view.rate = rate;
                view.energyConsumption = energyConsumption;
                list.Add(view);

                overView oview = new overView();
                oview.name = item_peizhi.Name;
                oview.value = rate;
                left_view.Add(oview);

            }
            decimal zongBudget = list_budgets.Sum(p => p.GeneralBudget);
            var list_zong = new
            {
                zongRate,
                zongBudget
            };
            return Json(new { list_zong, left_view, list }, JsonRequestBehavior.AllowGet);
        }

        public class overView
        {
            public string name { get; set; }
            public decimal value { get; set; }
        }

        public class rightView
        {
            public rightView()
            {
                keyValuePairs =new  List<overView>();
                keyValuePairs_Time =new List<overView>();
            }
            public string name { get; set; }
            public List<overView> keyValuePairs { get; set; }
            public List<overView> keyValuePairs_Time { get; set; }
            public decimal rate { get; set; }
            public decimal energyConsumption { get; set; }
            public decimal budget { get; set; }

            public int ID { get; set; }

        }
        public JsonResult AddConfig(t_EE_enTypeConfig model)
        {
            model.UserID = CurrentUser.UserID;
            int n = DAL.EnTypeConfigDAL.getInstance().AddConfig(model);
            return Json(n, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteConfig(int id)
        {
            int n = DAL.EnTypeConfigDAL.getInstance().DeleteConfig(id);
            return Json(n, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCollectDevTypeList()
        {
            IList<t_DM_CollectDevType> list = DAL.CollecDevTypeDAL.getInstance().GetCollectDevTypeList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetComobxList()
        {
            IList<t_EE_EnerUserType> list = DAL.EnerUserTypeDAL.getInstance().GetComobxList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUnitComobxList()
        {
            IList<t_CM_Unit> list = GetUnitComobox();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region 能源分析

        public JsonResult GetEneryAnalysis(int uid, int DepartmentID, string time = "2018-11")
        {
            List<overView> list = new List<overView>();
           
            //根据权限读取PID;
            string pids = GetPIDs();
            IList<t_EE_Budget> list_budgets = DAL.BudgetDAL.getInstance().GetBudgetByID(uid);

            IList<t_EE_enTypeConfig> list_peizhi = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid, DepartmentID+"");
            foreach (var item_peizhi in list_peizhi)
            {
                decimal rate = 0;
                rightView view = new rightView();
                view.name = item_peizhi.Name;
                IList<t_EE_EnerUserProject> list_userP = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, DepartmentID);
                foreach (var item_userP in list_userP)
                {
                    IList<t_DM_CircuitInfo> list_cir = DAL.CircuitInfoDAL.getInstance().GetCID(item_userP.addCid, item_peizhi.Type);
                    string cids = "";
                    foreach (var item_cir in list_cir)
                    {
                        cids += item_cir.CID + ",";
                    }
                    if (cids != "")
                        cids = cids.Substring(0, cids.Length - 1);
                    else
                        cids = "0";
                    IList<t_V_EneryView> list_data = DAL.EneryOverViewDAL.getInstance().GetDatas(cids, pids, time);
                    rate = list_data.Sum(p => p.Rate);
                }
                view.rate = rate;
                overView oview = new overView();
                oview.name = item_peizhi.Name;
                oview.value = rate;
                list.Add(oview);
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEneryTable(int uid, int DepartmentID, string time = "2018-11")
        {
            List<table> table = new List<table>();
            string pids = GetPIDs();
            IList<t_EE_EnerUserProject> list_userP = DAL.EnerUserProjectDAL.getInstance().GetDepIDByParID(uid, DepartmentID);
            string childs = "";
            string cidss = "";
            IList<t_EE_EnerUserType> list_keshi = DAL.EnerUserTypeDAL.getInstance().GetComobxList();

            foreach (var item in list_userP)
            {
                    childs += item.child_id + ",";
                if (!string.IsNullOrEmpty(item.addCid))
                    cidss += item.addCid + ",";
            }
            //if (!string.IsNullOrEmpty(childs))
            //{
                childs = childs.Substring(0, childs.Length - 1);
                cidss = cidss.Substring(0, cidss.Length - 1);
                IList<t_EE_enTypeConfig> listconfig = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid, childs);

                 IList < t_V_EneryView > list_data_z = DAL.EneryOverViewDAL.getInstance().GetDatas(cidss, pids, time);

                var zv = list_data_z.Sum(p => p.Rate);
                var TitleList = listconfig.Select(p => new { p.Type, p.Name }).Distinct().ToList();
                foreach (var item_p in list_userP)
                {
                    table t = new table();
                var sss = list_keshi.Where(p => p.id == item_p.child_id).FirstOrDefault();
                string keshiNmae = "";
                if (sss!=null)
                    keshiNmae = sss.Name;
                

                t.value.Add(keshiNmae);
                    foreach (var item in TitleList)
                    {
                        IList<t_DM_CircuitInfo> list_cir = DAL.CircuitInfoDAL.getInstance().GetCID(item_p.addCid, item.Type);
                        string cids = "";
                        foreach (var item_cir in list_cir)
                        {
                            cids += item_cir.CID + ",";
                        }
                        if (cids != "")
                            cids = cids.Substring(0, cids.Length - 1);
                        else
                            cids = "0";
                        IList<t_V_EneryView> list_data = DAL.EneryOverViewDAL.getInstance().GetDatas(cids, pids, time);
                        decimal v = list_data.Sum(p => p.Rate);
                        if (zv != 0)
                            v = Math.Round(v / zv, 2) * 100;
                        else
                            v = 0;

                       t.value.Add(v + "");
                        
                    }
                    table.Add(t);
                }
           // }
            return Json(new { TitleList, table });
        }

        public class table
        {
            public table()
            {
                value = new List<string>();
            }
            public List<string> value; 
        }
        #endregion
    }
}