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
            decimal lasrRate = 0;
            decimal mianji = 0;
            decimal peos = 0;
            //根据权限读取PID;
            string pids = GetPIDs();
            IList<t_EE_Budget> list_budgets = DAL.BudgetDAL.getInstance().GetBudgetByID(uid);

            IList<t_EE_enTypeConfig> list_peizhi = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid);
            foreach (var item_peizhi in list_peizhi)
            {
                decimal rate = 0;
                decimal lasRate = 0;
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

                    string lastTime = Convert.ToDateTime(time).AddYears(-1).ToString();
                    IList<t_V_EneryView> list_data_last = DAL.EneryOverViewDAL.getInstance().GetDatas(cids, pids, lastTime);
                    lasRate = list_data_last.Sum(p => p.Rate);
                    lasrRate += lasRate;
                    energyConsumption = list_data.Sum(p => p.Value);
                    zongRate += rate;
                    var group_list = list_data.GroupBy(p => p.Name);
                    foreach (var item_group in group_list)
                    {
                        overView group_i = new overView();
                        group_i.name = item_group.Key;
                        group_i.value = item_group.Sum(p => p.Rate);
                        view.keyValuePairs.Add(group_i);
                    }
                    var group_list_time = list_data.GroupBy(p => p.RecordTime);
                    foreach (var item_group in group_list_time)
                    {
                        overView group_i = new overView();
                        group_i.name = item_group.Key.ToString();
                        group_i.value = item_group.Sum(p => p.Rate);
                        view.keyValuePairs_Time.Add(group_i);
                    }

                    mianji += item_userP.unit_area;
                    peos += item_userP.unit_people;

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
            decimal zduibi = 0;
            if (lasrRate != 0)
                zduibi = Math.Round(zongRate / lasrRate, 2) * 100;
            var list_zong = new
            {
                zongRate,
                zongBudget,
                zduibi
            };
            decimal Peozhanbi = 0;
            decimal LPeozhanbi = 0;
            if (mianji * peos != 0)
            {
                Peozhanbi = zongRate / (mianji * peos);
                LPeozhanbi = lasrRate / (mianji * peos);
            }
            var list_bottom = new
            {
                Peozhanbi,
                LPeozhanbi,
                zongBudget
            };
            return Json(new { list_zong, left_view, list,list_bottom }, JsonRequestBehavior.AllowGet);
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
                keyValuePairs = new List<overView>();
                keyValuePairs_Time = new List<overView>();
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

            IList<t_EE_enTypeConfig> list_peizhi = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid, DepartmentID + "");
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
            List<title> TitleList = new List<title>();
            IList<t_EE_enTypeConfig> listconfig = null;
            if (!string.IsNullOrEmpty(childs))
            {
                childs = childs.Substring(0, childs.Length - 1);
                listconfig = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid, childs);
                IList<t_V_EneryView> list_data_z = null;
                decimal zv = 0;
                if (!string.IsNullOrEmpty(cidss))
                {
                    cidss = cidss.Substring(0, cidss.Length - 1);
                    list_data_z = DAL.EneryOverViewDAL.getInstance().GetDatas(cidss, pids, time);
                    zv = list_data_z.Sum(p => p.Rate);
                    TitleList = listconfig.Select(p => new title { Type = p.Type, Name = p.Name }).Distinct().ToList();
                    foreach (var item_p in list_userP)
                    {
                        table t = new table();

                        var sss = list_keshi.Where(p => p.id == item_p.child_id).FirstOrDefault();
                        string keshiNmae = "";
                        if (sss != null)
                            keshiNmae = sss.Name;

                        t.value.Add("ID", item_p.child_id + "");
                        t.value.Add("Name", keshiNmae);
                        foreach (var item in TitleList)
                        {
                            if (!string.IsNullOrEmpty(item_p.addCid))
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
                                if (!string.IsNullOrEmpty(cids))
                                {
                                    IList<t_V_EneryView> list_data = DAL.EneryOverViewDAL.getInstance().GetDatas(cids, pids, time);
                                    decimal v = list_data.Sum(p => p.Rate);
                                    if (zv != 0)
                                        v = Math.Round(v / zv, 2) * 100;
                                    else
                                        v = 0;

                                    t.value.Add(item.Type+"",v + "");
                                }
                                else
                                {
                                    t.value.Add(item.Type + "","0");
                                }
                            }
                            else
                            {
                                t.value.Add(item.Type + "","0");
                            }
                        }
                        table.Add(t);
                    }
                }
               
            }
            return Json(new { TitleList, table });
        }

        public class title
        {
            public int Type { get; set; }
            public string Name { get; set; }
        }
        public class table
        {
            public table()
            {
                value = new Dictionary<string, string>();
            }
            public Dictionary<string, string> value { get; set; }
        }

        public JsonResult GetEneryLine(int uid, int DepartmentID, int type, int TypeTime, string time = "2018-11")
        {
            duibiView list_r = new duibiView();

            List<string> x = new List<string>();
            List<string> x2 = new List<string>();
            string pids = GetPIDs();
            IList<t_EE_EnerUserProject> list_userP = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, DepartmentID);
            IList<t_EE_EnerUserType> list_keshi = DAL.EnerUserTypeDAL.getInstance().GetComobxList();
            string cidss = "";
            foreach (var item in list_userP)
            {
                if (!string.IsNullOrEmpty(item.addCid))
                    cidss += item.addCid + ",";
            }
            if (!string.IsNullOrEmpty(cidss))
            {
                cidss = cidss.Substring(0, cidss.Length - 1);
                IList<t_V_EneryView> list_this = null;
                IList<t_V_EneryView> list_last = null;
                DateTime time_test = Convert.ToDateTime("2018-11-20");
                if (TypeTime == 1)
                {
                   
                    for (var i = 0; i < 24; i++)
                    {
                        x.Add(time_test.AddHours(i).ToString("yyyy-MM-dd HH:mm:ss"));
                    }
                    string t1 = time_test.ToString("yyyy-MM-dd 00:00:00");
                    string t2 = time_test.ToString("yyyy-MM-dd 23:59:59");
                    list_this = DAL.EneryOverViewDAL.getInstance().GetDayDatasByTime(cidss, pids, type, t1, t2);
                    string t3 = time_test.AddDays(-1).ToString("yyyy-MM-dd 00:00:00");
                    string t4 = time_test.AddDays(-1).ToString("yyyy-MM-dd 23:59:59");
                    for (var i = 0; i < 24; i++)
                    {
                        x2.Add(Convert.ToDateTime(t3).AddHours(i).ToString("yyyy-MM-dd HH:mm:ss"));
                    }
                    list_last = DAL.EneryOverViewDAL.getInstance().GetDayDatasByTime(cidss, pids, type, t3, t4);
                }
                else if (TypeTime == 2)
                {
                    for (var i = 0; i < 31; i++)
                    {
                        x.Add(time_test.AddDays(1 - time_test.Day).AddDays(i).ToString());
                    }
                    string t1 = time_test.AddDays(1 - time_test.Day).ToString();
                    string t2 = time_test.AddDays(1 - time_test.Day).AddMonths(1).AddDays(-1).ToString();
                    list_this = DAL.EneryOverViewDAL.getInstance().GetMonthDatasByTime(cidss, pids, type, t1, t2);
                    string t3 = time_test.AddDays(1 - time_test.Day).AddMonths(-1).ToString();
                    for (var i = 0; i < 31; i++)
                    {
                        x2.Add(Convert.ToDateTime(t3).AddDays(i).ToString());
                    }
                    string t4 = time_test.AddDays(1 - time_test.Day).AddMonths(1).AddDays(-1).AddDays(-1).AddMonths(-1).ToString();
                    list_last = DAL.EneryOverViewDAL.getInstance().GetMonthDatasByTime(cidss, pids, type, t3, t4);
                }
                else if (TypeTime == 3)
                {
                    for (var i = 0; i < 12; i++)
                    {
                        x.Add(new DateTime(2018, 1, 1).AddMonths(i).ToString());
                    }
                    string t1 = new DateTime(2018, 1, 1).ToString();
                    string t2 = new DateTime(2018, 12, 31).ToString();
                    list_this = DAL.EneryOverViewDAL.getInstance().GetYearDatasByTime(cidss, pids, type, t1, t2);

                    for (var i = 0; i < 12; i++)
                    {
                        x2.Add(new DateTime(2017, 1, 1).AddMonths(i).ToString());
                    }
                    string t3 = new DateTime(2017, 1, 1).ToString();
                    string t4 = new DateTime(2017, 12, 31).ToString();
                    list_last = DAL.EneryOverViewDAL.getInstance().GetYearDatasByTime(cidss, pids, type, t3, t4);
                }
               
                
                foreach (var item in x)
                {
                    
                        overView m = new overView();
                        m.name = item;
                        DateTime d = Convert.ToDateTime(item);
                        m.value = list_this.Where(p=>p.RecordTime==d).Sum(p => p.Rate);
                        list_r.list_this.Add(m);
                   
                    
                }
                foreach (var item in x2)
                {

                    overView m = new overView();
                    m.name = item;
                    DateTime d = Convert.ToDateTime(item);
                    m.value = list_last.Where(p => p.RecordTime == d).Sum(p => p.Rate);
                    list_r.list_last.Add(m);
                }
            }
           

            return Json(new { list_r ,x}, JsonRequestBehavior.AllowGet);
        }

        public class duibiView
        {
            public duibiView()
            {
                list_this = new List<overView>();
                list_last = new List<overView>();
            }
            public List<overView> list_this { get; set; }
            public List<overView> list_last { get; set; }
        }


        public JsonResult GetChildItemData(int uid, int DepartmentID, string time = "2018-11")
        {
            List<table> table = new List<table>();
            List<title> TitleList = new List<title>();
            string pids = GetPIDs();
            IList<t_EE_EnerUserProject> list_userP = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, DepartmentID);
            string childs = "";
            string cidss = "";
            IList<t_EE_EnerUserType> list_keshi = DAL.EnerUserTypeDAL.getInstance().GetComobxList();

            foreach (var item in list_userP)
            {
                if (!string.IsNullOrEmpty(item.addCid))
                    cidss += item.addCid + ",";
            }
            if (!string.IsNullOrEmpty(cidss))
            {
                cidss = cidss.Substring(0, cidss.Length - 1);
                IList<t_EE_enTypeConfig> listconfig = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid, DepartmentID + "");

                IList<t_V_EneryView> list_data_z = DAL.EneryOverViewDAL.getInstance().GetDatas(cidss, pids, time);

                TitleList = listconfig.Select(p => new title { Type = p.Type, Name = p.Name }).Distinct().ToList();

                foreach (var item in list_data_z.GroupBy(p => p.RecordTime))
                {
                    table t = new table();
                    t.value.Add("time", item.Key.ToString());
                    decimal mianji = 0;
                    decimal renliu = 0;



                    foreach (var it in TitleList)
                    {
                        decimal v = 0;
                        string t1 = item.Key.ToString("yyyy-MM-dd 00:00:00");
                        string t2 = item.Key.ToString("yyyy-MM-dd 23:59:59");
                        IList<t_V_EneryView> list_this = DAL.EneryOverViewDAL.getInstance().GetDayDatasByTime(cidss, pids, it.Type, t1, t2);
                        v = list_this.Sum(p => p.Value);
                        t.value.Add(it.Type + "", v + "");

                    }
                    t.value.Add("area", mianji + "");
                    t.value.Add("people", renliu + "");
                    table.Add(t);
                }
            }
            return Json(new { TitleList, table });
        }
        #endregion

        #region 能源异常

        public JsonResult GetExTable()
        {
            IList<t_EE_ExEnergy> list = DAL.ExEnergyDAL.getInstance().GetExDatas();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}