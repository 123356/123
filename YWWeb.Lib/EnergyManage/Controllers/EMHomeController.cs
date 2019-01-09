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
        public JsonResult GetEneryOverView(int uid)
        {
            IList<IDAO.Models.t_V_EneryView> list_w = DAL.EneryOverViewDAL.getInstance().GetEneryWaterOverview(uid);

            IList<IDAO.Models.t_V_EneryView> list_p = DAL.EneryOverViewDAL.getInstance().GetEneryPowerOverview(uid);

            IList<IDAO.Models.t_V_EneryView> list_g = DAL.EneryOverViewDAL.getInstance().GetEneryGasOverview(uid);

            decimal waterRate = list_w.Sum(p => p.Rate);

            decimal powerRate = list_p.Sum(p => p.Rate);

            decimal gasRate = list_g.Sum(p => p.Rate);

            decimal sumRate = waterRate + powerRate + gasRate;

            IList<IDAO.Models.t_EE_Budget> list_b = DAL.BudgetDAL.getInstance().GetBudgetByID(uid);

            decimal waterBudget = list_b.Where(p => p.EnergyTypeID == 1).Sum(p => p.GeneralBudget);

            decimal powerBudget = list_b.Where(p => p.EnergyTypeID == 2).Sum(p => p.GeneralBudget);

            decimal gasBudget = list_b.Where(p => p.EnergyTypeID == 3).Sum(p => p.GeneralBudget);

            decimal sumBudget = waterBudget + powerBudget + gasBudget;
            List<Dictionary<string, decimal>> w_keyValuePairs = new List<Dictionary<string, decimal>>();
            var water_pie = list_w.GroupBy(p => p.TypeName);
            foreach (var item in water_pie)
            {
                Dictionary<string, decimal> it = new Dictionary<string, decimal>();
                it.Add(item.Key, item.Sum(p => p.Value));
                w_keyValuePairs.Add(it);
            }
            List<Dictionary<string, decimal>> p_keyValuePairs = new List<Dictionary<string, decimal>>();
            var power_pie = list_p.GroupBy(p => p.TypeName);
            foreach (var item in power_pie)
            {
                Dictionary<string, decimal> it = new Dictionary<string, decimal>();
                it.Add(item.Key, item.Sum(p => p.Value));
                p_keyValuePairs.Add(it);
            }

            List<Dictionary<string, decimal>> g_keyValuePairs = new List<Dictionary<string, decimal>>();
            var gas_pie = list_g.GroupBy(p => p.TypeName);
            foreach (var item in gas_pie)
            {
                Dictionary<string, decimal> it = new Dictionary<string, decimal>();
                it.Add(item.Key, item.Sum(p => p.Value));
                g_keyValuePairs.Add(it);
            }

            List<Dictionary<string, decimal>> w_keyValuePairs_time = new List<Dictionary<string, decimal>>();
            var water_pie_time = list_w.GroupBy(p => p.RecordTime);
            foreach (var item in water_pie_time)
            {
                Dictionary<string, decimal> it = new Dictionary<string, decimal>();
                it.Add(item.Key.ToString("dd"), item.Sum(p => p.Value));
                w_keyValuePairs_time.Add(it);
            }

            List<Dictionary<string, decimal>> p_keyValuePairs_time = new List<Dictionary<string, decimal>>();
            var power_pie_time = list_p.GroupBy(p => p.RecordTime);
            foreach (var item in power_pie_time)
            {
                Dictionary<string, decimal> it = new Dictionary<string, decimal>();
                it.Add(item.Key.ToString("dd"), item.Sum(p => p.Value));
                p_keyValuePairs_time.Add(it);
            }

            List<Dictionary<string, decimal>> g_keyValuePairs_time = new List<Dictionary<string, decimal>>();
            var gas_pie_time = list_g.GroupBy(p => p.RecordTime);
            foreach (var item in gas_pie_time)
            {
                Dictionary<string, decimal> it = new Dictionary<string, decimal>();
                it.Add(item.Key.ToString("dd"), item.Sum(p => p.Value));
                g_keyValuePairs_time.Add(it);
            }
            decimal water_en = list_w.Sum(p => p.Value);

            decimal power_en = list_p.Sum(p => p.Value);

            decimal gas_en = list_g.Sum(p => p.Value);
           

            var sum_pie = new
            {
                sumBudget,
                sumRate,
            };
            string[] names_right = new[] { "水", "电", "气" };
            List<Dictionary<string, decimal>>[] keyValuePairsS = new List<Dictionary<string, decimal>>[] { w_keyValuePairs, p_keyValuePairs, g_keyValuePairs };
            List<Dictionary<string, decimal>>[] keyValuePairs_TimeS = new List<Dictionary<string, decimal>>[] { w_keyValuePairs_time, p_keyValuePairs_time, g_keyValuePairs_time };
            decimal[] rates = new[] { waterRate, powerRate, gasRate };
            decimal[] energyConsumptions = new[] { water_en, power_en, gas_en };
            decimal[] budgets = new[] { waterBudget, powerBudget, gasBudget };
            List<rightView> listright = new List<rightView>();
            for (int i = 0; i < names_right.Length; i++)
            {
                rightView rightview = new rightView();
                rightview.name = names_right[i];
                rightview.keyValuePairs = keyValuePairsS[i];
                rightview.keyValuePairs_Time = keyValuePairs_TimeS[i];
                rightview.rate = rates[i];
                rightview.energyConsumption = energyConsumptions[i];
                rightview.budget = budgets[i];
                listright.Add(rightview);
            }

            string[] names = new[] { "水", "电", "气" };
            decimal[] values = new[] { waterRate, powerRate, gasRate };
            List<overView> item_list = new List<overView>();
            for (int i = 0; i < values.Length; i++)
            {
                overView item_pie = new overView();
                item_pie.name = names[i];
                item_pie.value = values[i];
                item_list.Add(item_pie);
            }


            var result = new { sum_pie = sum_pie, item_list = item_list, listright = listright };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public class overView
        {
            public string name { get; set; }
            public decimal value { get; set; }
        }

        public class rightView
        {
            public string name { get; set; }
            public List<Dictionary<string, decimal>> keyValuePairs { get; set; }
            public List<Dictionary<string, decimal>> keyValuePairs_Time { get; set; }
            public decimal rate { get; set; }
            public decimal energyConsumption { get; set; }
            public decimal budget { get; set; }

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
            return Json(list);
        }
        #endregion
    }
}