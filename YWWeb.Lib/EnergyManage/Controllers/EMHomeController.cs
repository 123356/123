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

        public JsonResult GetZongData(int uid, string time)
        {
            decimal zongRate = 0;
            decimal lasrRate = 0;
            decimal mianji = 0;
            decimal peos = 0;
            int year = Convert.ToDateTime(time).Year;
            int month = Convert.ToDateTime(time).Month;
            string lastTime = Convert.ToDateTime(time).AddYears(-1).ToString();
            var DepList = DAL.EnerUserProjectDAL.getInstance().GetDepIDByParID(uid, 0);
            string cids = "";
            foreach (var dep in DepList)
            {
                if (dep.addCid != null && !string.IsNullOrEmpty(dep.addCid.Trim()))
                    cids += dep.addCid + ",";
            }
            if (cids != "")
                cids = cids.Trim(',');
            Dictionary<int, string> cpids = GetCId(cids);

            var data = DAL.EneryOverViewDAL.getInstance().GetMonthDatas(cpids, Convert.ToDateTime(time).ToString("yyyy-MM"));
            if (data.Count() != 0)
            {
                zongRate = Math.Round(data.Sum(p => p.Rate) / 10000, 5);
            }
            var dataLast = DAL.EneryOverViewDAL.getInstance().GetMonthDatas(cpids, Convert.ToDateTime(lastTime).ToString("yyyy-MM"));
            if (dataLast.Count() != 0)
            {
                lasrRate = Math.Round(dataLast.Sum(p => p.Rate) / 10000, 5);
            }
            decimal zduibi = 0;
            if (lasrRate != 0)
                zduibi = Math.Round(zongRate / lasrRate, 2) * 100;
            IList<t_EE_CollTypeBudget> list_budgets = DAL.CollTypeBudgetDAL.getInstance().GetBudgetByID(uid, year, month);
            decimal zongBudget = list_budgets.Sum(p => p.GeneralBudget);
            var list_zong = new
            {
                zongRate,
                zongBudget,
                zduibi
            };
            List<overView> left_view = new List<overView>();
            var TypeList = DAL.CollecDevTypeDAL.getInstance().GetCollectDevTypeList();
            foreach (var item in data.Where(p => p.coolect_dev_type != null).GroupBy(p => p.coolect_dev_type))
            {
                overView m = new overView();
                m.name = TypeList.Where(p => p.ID == item.Key).FirstOrDefault().Name;
                m.value = Math.Round(item.Sum(p => p.Rate) / 10000, 5);
                left_view.Add(m);
            }

            t_CM_Unit unit = DAL.UnitDAL.getInstance().GetUnitModelByID(uid);
            if (unit != null)
            {
                mianji = Convert.ToDecimal(unit.ArchitectureArea);
            }
            peos = DepList.Sum(p => p.unit_people);
            decimal Peozhanbi = 0;
            decimal LPeozhanbi = 0;
            if (mianji != 0)
            {
                Peozhanbi = Math.Round(zongRate * 10000 / mianji, 2);
                LPeozhanbi = Math.Round(lasrRate * 10000 / mianji, 2);
            }
            var list_bottom = new
            {
                Peozhanbi,
                LPeozhanbi,
                zongBudget
            };
            return Json(new { list_zong, left_view, list_bottom }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetEneryOverView(int uid, string time)
        {
            List<rightView> list = new List<rightView>();
            int year = Convert.ToDateTime(time).Year;
            int month = Convert.ToDateTime(time).Month;
            try
            {
                IList<t_EE_enTypeConfig> list_peizhi = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid);
                foreach (var item_peizhi in list_peizhi)
                {
                    decimal rate = 0;
                    decimal energyConsumption = 0;
                    decimal budget = 0;
                    rightView view = new rightView();
                    view.name = item_peizhi.Name;
                    view.ID = item_peizhi.ID;
                    view.DepName = item_peizhi.DepName;
                    budget = FindNode(uid, item_peizhi.EnerUserTypeID, Convert.ToDateTime(time), 0);
                    view.budget = budget;
                    IList<t_EE_EnerUserProject> list_userP = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, item_peizhi.EnerUserTypeID);

                    string lastTime = Convert.ToDateTime(time).AddYears(-1).ToString();
                    foreach (var item_userP in list_userP)
                    {
                        if (!string.IsNullOrEmpty(item_userP.addCid.Trim()))
                        {
                            Dictionary<int, string> cpids = GetCId(item_userP.addCid);
                            IList<t_DM_CircuitInfo> list_cir = DAL.CircuitInfoDAL.getInstance().GetCID(cpids, item_peizhi.CollTypeID);
                            if (cpids.Count != 0)
                            {
                                var data=  DAL.EneryOverViewDAL.getInstance().GetFirstPageDatas(cpids, Convert.ToDateTime(time).ToString("yyyy-MM"));
                                energyConsumption += data.Sum(p => p.Value);
                                foreach (var item in data.GroupBy(p => p.CName))
                                {
                                    overView group_i = new overView();
                                    group_i.name = item.Key;
                                    group_i.value = Math.Round(item.Sum(p => p.Rate) / 10000, 5);
                                    view.keyValuePairs.Add(group_i);
                                    rate += item.Sum(p => p.Rate);
                                }
                                foreach (var item_group in data.GroupBy(p=>p.RecordTime))
                                {
                                    overView group_i = new overView();
                                    group_i.name = item_group.Key.ToString();
                                    group_i.value = Math.Round(item_group.Sum(p => p.Rate), 2);
                                    view.keyValuePairs_Time.Add(group_i);
                                }
                            }
                        }
                        view.rate = Math.Round(rate / 10000, 5);
                        view.energyConsumption = Math.Round(energyConsumption, 5);
                        list.Add(view);
                    }
                }
                return Json(new {list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }

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
            public string DepName { get; set; }

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
            IList<t_EE_EnerUserType> list = DAL.EnerUserTypeDAL.getInstance().GetComobxList(2);
            return Json(list, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetUnitComobxList()
        {
            IList<t_CM_Unit> list = GetUnitComobox();
            return Json(list, JsonRequestBehavior.AllowGet);

        }

        #endregion

        #region 能源分析

        public JsonResult GetEneryAnalysis(int uid, int DepartmentID, DateTime time)
        {
            List<overView> list = new List<overView>();
            string cids = "";
            string t1 = time.AddDays(1 - time.Day).ToString();
            string t2 = time.AddDays(1 - time.Day).AddMonths(1).AddDays(-1).ToString();
            IList<t_EE_EnerUserProject> list_userP = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, DepartmentID);
            foreach (var item_userP in list_userP)
            {
                if (!string.IsNullOrEmpty(item_userP.addCid.Trim()))
                {
                    cids += item_userP.addCid + ",";
                    if (cids != "")
                        cids = cids.Substring(0, cids.Length - 1);
                }
            }
            Dictionary<int, string> cpids = GetCId(cids);
            if (cpids.Count != 0)
            {
                var data = DAL.EneryReportFromDAL.getInstance().GetMonthFormDatas(cpids, t1, t2);
                foreach (var item in data.GroupBy(p => p.TypeName))
                {
                    overView oview = new overView();
                    oview.name = item.Key;
                    oview.value = Math.Round(item.Sum(p => p.Rate), 2);
                    list.Add(oview);
                }
            }
            decimal DepBudget = 0;


            DepBudget += FindNode(uid, DepartmentID, Convert.ToDateTime(time), DepBudget);


            return Json(new { list, DepBudget }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEneryTable(int uid, int DepartmentID = 0, string time = "2018-11")
        {
            List<table> table = new List<table>();
            List<title> TitleList = new List<title>();
            try
            {
                string pids = GetPIDs();

                IList<t_EE_EnerUserProject> list_userP;
                list_userP = DAL.EnerUserProjectDAL.getInstance().GetDepIDByParID(uid, DepartmentID);
                if (list_userP.Count == 0)
                    list_userP = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, DepartmentID);
                IList<t_EE_EnerUserType> list_keshi = DAL.EnerUserTypeDAL.getInstance().GetComobxList(2);
                var TypeList = DAL.CollecDevTypeDAL.getInstance().GetCollectDevTypeList();
                foreach (var item in list_userP)
                {
                    table t = new table();
                    var sss = list_keshi.Where(p => p.id == item.child_id).FirstOrDefault();
                    string keshiNmae = "";
                    if (sss != null)
                        keshiNmae = sss.Name;
                    t.value.Add("ID", item.child_id + "");
                    t.value.Add("Name", keshiNmae);
                    Dictionary<int, string> cpids = GetCId(item.addCid);
                    var data = DAL.EneryOverViewDAL.getInstance().GetMonthDatas(cpids, Convert.ToDateTime(time).ToString("yyyy-MM"));
                    foreach (var dd in data.Where(p => p.coolect_dev_type != null).GroupBy(p => p.coolect_dev_type))
                    {
                        t.value.Add(dd.Key + "", Math.Round(dd.Sum(p => p.Rate), 2) + "");
                        title ttt = new title();
                        ttt.Type = dd.Key.Value + "";
                        ttt.Name = TypeList.Where(p => p.ID == dd.Key).FirstOrDefault().Name;
                        if (!TitleList.Select(p => p.Type).Contains(ttt.Type))
                            TitleList.Add(ttt);

                    }
                    table.Add(t);
                }
                return Json(new { TitleList, table });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private decimal FindNode(int uid, int depid, DateTime time, decimal DepBudget)
        {
            var m = DAL.EnerUserProjectDAL.getInstance().GetDepIDByParID(uid, depid);
            if (m.Count != 0)
            {
                foreach (var item in m)
                {
                    DepBudget = FindNode(uid, item.child_id, time, DepBudget);
                }
            }
            else
            {
                var yearBuget = DAL.YearBudgetDAL.getInstance().GetYearBudgetByID(uid, time.Year);
                if (yearBuget.Count() != 0)
                {
                    var yearb = yearBuget[0].ID;
                    var month = DAL.BudgetDAL.getInstance().GetMonthBudgetByYearID(yearb);
                    if (month.Count() != 0)
                    {
                        var monthb = month.Where(p => p.Month == time.Month).FirstOrDefault();
                        if (monthb != null)
                        {
                            var monthid = monthb.ID;
                            var cotype = DAL.CollTypeBudgetDAL.getInstance().GetColltypeBudgetByMonthID(monthid);
                            if (cotype.Count() != 0)
                            {
                                var coid = cotype.Select(p => p.ID).ToList();
                                foreach (var item in coid)
                                {
                                    var depB = DAL.EneryUsreBudgetDAL.getInstance().GetenBudgetByeneyidAndCoID(item, depid);
                                    if (depB != null)
                                    {
                                        DepBudget += depB.GeneralBudget;
                                    }

                                }
                            }
                        }

                    }
                }
            }
            return DepBudget;
        }


        public class title
        {

            public string Type { get; set; }
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
            IList<t_EE_EnerUserType> list_keshi = DAL.EnerUserTypeDAL.getInstance().GetComobxList(2);
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
                DateTime time_test = DateTime.Now;
                Dictionary<int, string> cpids = GetCId(cidss);
                if (!string.IsNullOrEmpty(cidss.Trim()))
                {
                    if (TypeTime == 1)
                    {

                        string t1 = time_test.ToString("yyyy-MM-dd 00:00:00");
                        string t2 = time_test.ToString("yyyy-MM-dd 23:59:59");
                        for (var i = 0; i < 24; i++)
                        {
                            x.Add(Convert.ToDateTime(t1).AddHours(i).ToString("yyyy-MM-dd HH:mm:ss"));
                        }
                        list_this = DAL.EneryOverViewDAL.getInstance().GetDayDatasByTime(cpids, type, t1, t2);
                        string t3 = time_test.AddDays(-1).ToString("yyyy-MM-dd 00:00:00");
                        string t4 = time_test.AddDays(-1).ToString("yyyy-MM-dd 23:59:59");

                        for (var i = 0; i < 24; i++)
                        {
                            x2.Add(Convert.ToDateTime(t3).AddHours(i).ToString("yyyy-MM-dd HH:mm:ss"));
                        }
                        list_last = DAL.EneryOverViewDAL.getInstance().GetDayDatasByTime(cpids, type, t3, t4);
                    }
                    else if (TypeTime == 2)
                    {

                        string t1 = time_test.AddDays(1 - time_test.Day).ToString();
                        string t2 = time_test.AddDays(1 - time_test.Day).AddMonths(1).AddDays(-1).ToString();
                        for (var i = 0; i < 31; i++)
                        {
                            x.Add(Convert.ToDateTime(t1).AddDays(i).ToString("yyyy-MM-dd"));
                        }
                        list_this = DAL.EneryOverViewDAL.getInstance().GetMonthDatasByTime(cpids, type, t1, t2);
                        string t3 = time_test.AddDays(1 - time_test.Day).AddMonths(-1).ToString();
                        string t4 = time_test.AddDays(1 - time_test.Day).AddMonths(1).AddDays(-1).AddMonths(-1).ToString();
                        for (var i = 0; i < 31; i++)
                        {
                            x2.Add(Convert.ToDateTime(t3).AddDays(i).ToString("yyyy-MM-dd"));
                        }

                        list_last = DAL.EneryOverViewDAL.getInstance().GetMonthDatasByTime(cpids, type, t3, t4);
                    }
                    else if (TypeTime == 3)
                    {
                        for (var i = 0; i < 12; i++)
                        {
                            x.Add(new DateTime(DateTime.Now.Year, 1, 1).AddMonths(i).ToString());
                        }
                        string t1 = new DateTime(DateTime.Now.Year, 1, 1).ToString();
                        string t2 = new DateTime(DateTime.Now.Year, 12, 31).ToString();
                        list_this = DAL.EneryOverViewDAL.getInstance().GetYearDatasByTime(cpids, type, t1, t2);

                        for (var i = 0; i < 12; i++)
                        {
                            x2.Add(new DateTime(DateTime.Now.Year - 1, 1, 1).AddMonths(i).ToString());
                        }
                        string t3 = new DateTime(DateTime.Now.Year - 1, 1, 1).ToString();
                        string t4 = new DateTime(DateTime.Now.Year - 1, 12, 31).ToString();
                        list_last = DAL.EneryOverViewDAL.getInstance().GetYearDatasByTime(cpids, type, t3, t4);
                    }
                }
                foreach (var item in x)
                {

                    overView m = new overView();
                    m.name = item;
                    DateTime d = Convert.ToDateTime(item);
                    m.value = Math.Round(list_this.Where(p => p.RecordTime == d).Sum(p => p.Rate), 2);
                    list_r.list_this.Add(m);


                }
                foreach (var item in x2)
                {

                    overView m = new overView();
                    m.name = item;
                    DateTime d = Convert.ToDateTime(item);
                    m.value = Math.Round(list_last.Where(p => p.RecordTime == d).Sum(p => p.Rate), 2);
                    list_r.list_last.Add(m);
                }
            }


            return Json(new { list_r, x }, JsonRequestBehavior.AllowGet);
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
            string cidss = "";
            IList<t_EE_EnerUserType> list_keshi = DAL.EnerUserTypeDAL.getInstance().GetComobxList(2);
            var TypeList = DAL.CollecDevTypeDAL.getInstance().GetCollectDevTypeList();
            decimal mianji = 0;
            decimal renliu = 0;
            foreach (var item in list_userP)
            {
                if (!string.IsNullOrEmpty(item.addCid))
                    cidss += item.addCid + ",";
                mianji += item.unit_area;
                renliu += item.unit_people;
            }
            if (!string.IsNullOrEmpty(cidss))
            {
                cidss = cidss.Substring(0, cidss.Length - 1);
                Dictionary<int, string> cpids = GetCId(cidss);



                if (!string.IsNullOrEmpty(cidss.Trim()))
                {
                    IList<t_V_EneryView> list_data_z = DAL.EneryOverViewDAL.getInstance().GetMonthDatas(cpids, Convert.ToDateTime(time).ToString("yyyy-MM"));

                    foreach (var item in list_data_z.OrderByDescending(p => p.RecordTime).Where(p => p.coolect_dev_type != null).GroupBy(p => p.RecordTime))
                    {
                        table t = new table();
                        t.value.Add("time", item.Key.ToString());

                        foreach (var it in item.OrderBy(p => p.coolect_dev_type).GroupBy(p => p.coolect_dev_type))
                        {
                            decimal v = 0;
                            //string t1 = item.Key.ToString("yyyy-MM-dd 00:00:00");
                            //string t2 = item.Key.ToString("yyyy-MM-dd 23:59:59");
                            //IList<t_V_EneryView> list_this = DAL.EneryOverViewDAL.getInstance().GetDayDatasByTime(cpids, it.Key.Value, t1, t2);

                            v = Math.Round(it.Sum(p => p.Rate), 2);
                            t.value.Add(it.Key + "", v + "");
                            title ttt = new title();
                            ttt.Type = it.Key.Value + "";
                            ttt.Name = TypeList.Where(p => p.ID == it.Key).FirstOrDefault().Name;
                            if (!TitleList.Select(p => p.Type).Contains(ttt.Type))
                            {
                                TitleList.Add(ttt);

                                title ttt1 = new title();
                                ttt1.Type = it.Key.Value + "d";
                                ttt1.Name = TypeList.Where(p => p.ID == it.Key).FirstOrDefault().Name + "(元/平米)";
                                TitleList.Add(ttt1);
                                title ttt2 = new title();
                                ttt2.Type = it.Key.Value + "L";
                                ttt2.Name = TypeList.Where(p => p.ID == it.Key).FirstOrDefault().Name + "(元/人)";
                                TitleList.Add(ttt2);
                            }
                            if (mianji != 0)
                            {
                                t.value.Add(it.Key + "d", Math.Round(v / mianji, 2) + "");

                            }
                            else
                            {
                                t.value.Add(it.Key + "d", 0.00 + "");
                            }
                            if (renliu != 0)
                            {
                                t.value.Add(it.Key + "L", Math.Round(v / renliu, 2) + "");

                            }
                            else
                            {
                                t.value.Add(it.Key + "L", 0.00 + "");
                            }
                        }
                        t.value.Add("area", mianji + "");
                        t.value.Add("people", renliu + "");
                        table.Add(t);
                    }
                }
            }
            return Json(new { TitleList, table });







        }
        #endregion

        #region 能源异常

        public JsonResult GetExTable(int uid)
        {
            var model = DAL.UnitDAL.getInstance().GetUnitModelByID(uid);
            if (model != null)
            {
                IList<t_EE_ExEnergy> list = DAL.ExEnergyDAL.getInstance().GetExDatas(model.PDRList);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("No Data", JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetExData(string cids, int type, int TypeTime, string time, int uid)
        {
            try
            {
                string pids = "0";
                var unit = DAL.UnitDAL.getInstance().GetUnitList(uid + "").FirstOrDefault();
                if (unit != null && !string.IsNullOrEmpty(unit.PDRList))
                    pids = unit.PDRList;

                IList<t_V_EneryView> list_this = null;
                if (TypeTime == 1)
                {
                    DateTime time_test = Convert.ToDateTime(time);
                    string t1 = time_test.ToString("yyyy-MM-dd 00:00:00");
                    string t2 = time_test.ToString("yyyy-MM-dd 23:59:59");
                    list_this = DAL.EneryOverViewDAL.getInstance().GetDayDatasByTime(cids, pids, type, t1, t2);
                }
                else if (TypeTime == 2)
                {
                    DateTime time_test = Convert.ToDateTime(time);
                    string t1 = time_test.AddDays(1 - time_test.Day).ToString();
                    string t2 = time_test.AddDays(1 - time_test.Day).AddMonths(1).AddDays(-1).ToString();
                    list_this = DAL.EneryOverViewDAL.getInstance().GetMonthDatasByTime(cids, pids, type, t1, t2);
                }
                else if (TypeTime == 3)
                {

                    string t1 = new DateTime(Convert.ToInt32(time), 1, 1).ToString();
                    string t2 = new DateTime(Convert.ToInt32(time), 12, 31).ToString();
                    list_this = DAL.EneryOverViewDAL.getInstance().GetYearDatasByTime(cids, pids, type, t1, t2);
                }

                List<view> list_line = new List<view>();
                List<string> x = new List<string>();

                List<string> name = new List<string>();

                foreach (var item in list_this.GroupBy(p => p.RecordTime))
                {
                    x.Add(item.Key.ToString());
                }

                foreach (var item in list_this.GroupBy(p => p.CName))
                {
                    view m = new view();
                    name.Add(item.Key);
                    m.name = item.Key;
                    foreach (var itemf in x)
                    {

                        overView mx = new overView();
                        DateTime d = Convert.ToDateTime(itemf);
                        mx.value = item.Where(p => p.RecordTime == d).Sum(p => p.Value);
                        m.list.Add(mx);
                    }
                    list_line.Add(m);
                }
                List<string> tianqi = new List<string>();
                return Json(new { name, x, list_line, tianqi }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public class view
        {
            public view()
            {
                list = new List<overView>();
            }
            public string name { get; set; }
            public List<overView> list { get; set; }
        }
        public JsonResult GetBudgetData(string cids)
        {
            string pids = GetPIDs();
            IList<t_V_EneryView> list_this = null;
            DateTime time_test = Convert.ToDateTime(DateTime.Now);
            List<string> x = new List<string>();
            List<string> budgetList = new List<string>();
            List<string> shijivalue = new List<string>();
            string t1 = time_test.ToString("yyyy-MM-dd 00:00:00");
            string t2 = time_test.ToString("yyyy-MM-dd 23:59:59");
            list_this = DAL.EneryOverViewDAL.getInstance().GetDayDatasByTime(cids, pids, 0, t1, t2);
            for (var i = 0; i < 24; i++)
            {
                x.Add(Convert.ToDateTime(t1).AddHours(i).ToString("yyyy-MM-dd HH:mm:ss"));
            }
            List<overView> list_shiji = new List<overView>();
            foreach (var item in x)
            {
                DateTime d = Convert.ToDateTime(item);
                shijivalue.Add(list_this.Where(p => p.RecordTime == d).Sum(p => p.Value).ToString());
            }

            return Json(new { x, shijivalue, budgetList }, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetbugTable(string id)
        {
            string pids = GetPIDs();
            IList<t_EE_ExEnergy> list = DAL.ExEnergyDAL.getInstance().GetExTable(pids, id);

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 预算管理
        public JsonResult GetYearbugGetData(int uid, int year)
        {
            var list = DAL.YearBudgetDAL.getInstance().GetYearBudgetByID(uid, year).FirstOrDefault();
            if (list != null)
            {
                decimal SurplusValue = list.GeneralBudget - list.BudgetBalance;
                var left_list = new
                {
                    list.UnitName,
                    list.ID,
                    list.GeneralBudget,
                    list.BudgetBalance,
                    SurplusValue,
                };
                return Json(left_list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("no Data", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetMonthBugGetbyYearID(int yearid)
        {
            var list = DAL.BudgetDAL.getInstance().GetMonthBudgetByYearID(yearid);

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetYearBugGetDataByMonth(int monthid)
        {
            IList<t_EE_CollTypeBudget> list = DAL.CollTypeBudgetDAL.getInstance().GetColltypeBudgetByMonthID(monthid);

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRightData(int uid, int year, int month = 1)
        {
            string pids = GetPIDs();
            IList<t_EE_enTypeConfig> list_peizhi = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid);

            var time = new DateTime(year - 1, month, 1).ToString("yyyy-MM");
            var TypeList = DAL.CollecDevTypeDAL.getInstance().GetCollectDevTypeList();
            List<overView> list = new List<overView>();


            IList<t_EE_EnerUserProject> list_userP = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, 0);
            string cids = "";
            foreach (var item_userP in list_userP)
            {
                if (!string.IsNullOrEmpty(item_userP.addCid.Trim()))
                    cids += item_userP.addCid + ",";

            }
            if (!string.IsNullOrEmpty(cids))
            {
                cids = cids.TrimEnd(',');
                Dictionary<int, string> cpids = GetCId(cids);
                //IList<t_DM_CircuitInfo> list_cir = DAL.CircuitInfoDAL.getInstance().GetCID(cpids, item_peizhi.CollTypeID);
                //string cids = "";
                //foreach (var item_cir in list_cir)
                //{
                //    cids += item_cir.CID + ",";
                //}
                //if (cids != "")
                //    cids = cids.Substring(0, cids.Length - 1);
                //else
                //    cids = "0";
                IList<t_V_EneryView> list_data = DAL.EneryOverViewDAL.getInstance().GetMonthDatas(cpids, time);
                foreach (var item in list_data.Where(p => p.coolect_dev_type != null).GroupBy(p => p.coolect_dev_type))
                {
                    overView group_i = new overView();
                    if (TypeList.Where(p => p.ID == item.Key).FirstOrDefault() != null)
                        group_i.name = TypeList.Where(p => p.ID == item.Key).FirstOrDefault().Name;
                    else
                        group_i.name = "";
                    group_i.value = item.Sum(p => p.Rate);
                    list.Add(group_i);
                }
            }





            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetLastYearArea(int uid, int year)
        {
            var list_dep = DAL.EnerUserProjectDAL.getInstance().GetDepIDByParID(uid, 0);
            decimal rate = 0;

            string t1 = new DateTime(year, 1, 1).ToString("yyyy-MM-dd");
            string t2 = new DateTime(year, 12, 31).ToString("yyyy-MM-dd");
            string cids = "";
            foreach (var item in list_dep)
            {
                if (!string.IsNullOrEmpty(item.addCid.Trim()))
                    cids += item.addCid + ",";
            }
            if (!string.IsNullOrEmpty(cids))
            {
                cids = cids.TrimEnd(',');
                Dictionary<int, string> cpids = GetCId(cids);

                if (cpids.Count != 0)
                {
                    var data = DAL.EneryOverViewDAL.getInstance().GetMonthDatasByTime(cpids, 0, t1, t2);
                    rate = data.Sum(p => p.Rate);
                }
            }

            t_CM_Unit unit = DAL.UnitDAL.getInstance().GetUnitModelByID(uid);
            decimal mianji = 0;
            if (unit != null)
                mianji = Convert.ToDecimal(unit.ArchitectureArea);
            decimal bili = 0;
            if (mianji != 0)
                bili = Math.Round(rate / mianji, 2);
            var top = new
            {
                Area = mianji,
                Bili = bili
            };
            return Json(top, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetYearBugGetDataByType(int coid)
        {
            IList<t_EE_EneryUsreBudget> list = DAL.EneryUsreBudgetDAL.getInstance().GetenBudgetByYearID(coid);

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetYearBugGetDataBydepar(int coid)
        {
            IList<t_EE_DepartmentalApportionment> list = DAL.DepartmentalApportionmentDAL.getInstance().GetenBudgetByYearID(coid);

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public class BudgetView
        {
            public string Name { get; set; }
            public string Value { get; set; }
            public int ID { get; set; }
            public string Value2 { get; set; }
        }

        public JsonResult UpdateYearBudGet(decimal BudgetBalance, decimal GeneralBudget, int year, int uid)
        {
            int count = DAL.YearBudgetDAL.getInstance().GetYearBudgetByID(uid, year).Count();
            IList<t_DM_CollectDevType> list_co = DAL.CollecDevTypeDAL.getInstance().GetCollectDevTypeList();
            if (count > 0)
            {
                var mmm = DAL.YearBudgetDAL.getInstance().GetYearBudgetByID(uid, year).FirstOrDefault();
                mmm.BudgetBalance = BudgetBalance;
                mmm.GeneralBudget = GeneralBudget;
                mmm.Year = year;
                mmm.UID = uid;
                int n = DAL.YearBudgetDAL.getInstance().UpdateYearBudGet(mmm);
            }
            else
            {
                //添加
                t_EE_YearBudget model = new t_EE_YearBudget();
                model.BudgetBalance = BudgetBalance;
                model.GeneralBudget = GeneralBudget;
                model.Year = year;
                model.UID = uid;
                int n = DAL.YearBudgetDAL.getInstance().AddYearBudGet(model);
                if (n > 0)
                {
                    var m = DAL.YearBudgetDAL.getInstance().GetYearBudgetByID(uid, year).FirstOrDefault();
                    var vv = m.GeneralBudget - m.BudgetBalance;
                    vv = vv / 12;
                    for (int i = 1; i <= 12; i++)
                    {
                        var mm = DAL.BudgetDAL.getInstance().GetBudgetByID(m.UID, m.Year, i);
                        if (mm.Count() == 0)
                        {
                            t_EE_Budget bm = new t_EE_Budget();
                            bm.Month = i;
                            bm.MonthBudget = vv;
                            bm.YearID = m.ID;
                            DAL.BudgetDAL.getInstance().AddBudGet(bm);

                            foreach (var item in list_co)
                            {
                                var mmm = DAL.BudgetDAL.getInstance().GetBudgetByID(m.UID, m.Year, i).FirstOrDefault();
                                if (mmm != null)
                                {
                                    t_EE_CollTypeBudget mmmmm = new t_EE_CollTypeBudget();
                                    mmmmm.CollTypeID = item.ID;
                                    mmmmm.MonthID = mmm.ID;
                                    mmmmm.GeneralBudget = mmm.MonthBudget / list_co.Count();
                                    DAL.CollTypeBudgetDAL.getInstance().AddBudGet(mmmmm);
                                }
                            }
                        }

                    }
                }
            }
            return Json("ok");
        }

        public JsonResult UpdateMonthBudget(int id, decimal value, int month, int yearid)
        {
            var model = DAL.BudgetDAL.getInstance().GetMonthBudgetByID(id);
            if (model != null)
            {
                model.MonthBudget = value;
                DAL.BudgetDAL.getInstance().UpdateBudGet(model);
            }
            else
            {
                t_EE_Budget bm = new t_EE_Budget();
                bm.Month = month;
                bm.MonthBudget = value;
                bm.YearID = yearid;
                DAL.BudgetDAL.getInstance().AddBudGet(bm);
            }
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateContypeBudget(int id, decimal value, int monthid, int cotypeid)
        {
            var model = DAL.CollTypeBudgetDAL.getInstance().GetColltypeBudgetByID(id);
            if (model != null)
            {
                model.GeneralBudget = value;
                DAL.CollTypeBudgetDAL.getInstance().UpdateBudGet(model);
            }
            else
            {
                t_EE_CollTypeBudget bm = new t_EE_CollTypeBudget();
                bm.GeneralBudget = value;
                bm.MonthID = monthid;
                bm.CollTypeID = cotypeid;
                DAL.CollTypeBudgetDAL.getInstance().AddBudGet(bm);
            }
            return Json("ok");
        }


        public JsonResult UpdateEnUserBudget(int id, decimal value, int cotypeid, int eneruserid)
        {
            var model = DAL.EneryUsreBudgetDAL.getInstance().GetenBudgetByID(id);
            if (model != null)
            {
                model.GeneralBudget = value;
                DAL.EneryUsreBudgetDAL.getInstance().UpdateBudGet(model);
            }
            else
            {
                t_EE_EneryUsreBudget bm = new t_EE_EneryUsreBudget();
                bm.GeneralBudget = value;
                bm.EneryUserID = eneruserid;
                bm.CollTypeID = cotypeid;
                DAL.EneryUsreBudgetDAL.getInstance().AddBudGet(bm);
            }
            return Json("ok");
        }

        public JsonResult UpdateDepEnUserBudget(int id, decimal value, int cotypeid, int eneruserid)
        {
            var model = DAL.DepartmentalApportionmentDAL.getInstance().GetenBudgetByID(id);
            if (model != null)
            {
                model.GeneralBudget = value;
                DAL.DepartmentalApportionmentDAL.getInstance().UpdateBudGet(model);
            }
            else
            {
                t_EE_DepartmentalApportionment bm = new t_EE_DepartmentalApportionment();
                bm.GeneralBudget = value;
                bm.EneryUserID = eneruserid;
                bm.CollTypeID = cotypeid;
                DAL.DepartmentalApportionmentDAL.getInstance().AddBudGet(bm);
            }
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddEnUserBudget(int cotypeid, string eneryids)
        {
            if (!string.IsNullOrEmpty(eneryids))
            {
                var s = eneryids.Split(',').ToList();

                var mm = DAL.EneryUsreBudgetDAL.getInstance().GetenBudgetByYearID(cotypeid).Select(p => p.EneryUserID).ToList();

                foreach (var item in mm)
                {
                    if (!s.Contains(item + ""))
                    {
                        DAL.EneryUsreBudgetDAL.getInstance().DeleEnBudgetByeneyidAndCoID(cotypeid, Convert.ToInt32(item));
                    }
                }

                foreach (var item in s)
                {


                    var m = DAL.EneryUsreBudgetDAL.getInstance().GetenBudgetByeneyidAndCoID(cotypeid, Convert.ToInt32(item));
                    if (m != null)
                    {

                    }
                    else
                    {
                        t_EE_EneryUsreBudget bm = new t_EE_EneryUsreBudget();
                        bm.EneryUserID = Convert.ToInt32(item);
                        bm.CollTypeID = cotypeid;
                        DAL.EneryUsreBudgetDAL.getInstance().AddBudGet(bm);
                    }
                }


                var mmm = DAL.DepartmentalApportionmentDAL.getInstance().GetenBudgetByYearID(cotypeid).Select(p => p.EneryUserID).ToList();

                foreach (var item in mmm)
                {
                    if (!s.Contains(item + ""))
                    {
                        DAL.DepartmentalApportionmentDAL.getInstance().DeleEnBudgetByeneyidAndCoID(cotypeid, Convert.ToInt32(item));
                    }
                }

                foreach (var item in s)
                {


                    var m = DAL.DepartmentalApportionmentDAL.getInstance().GetenBudgetByeneyidAndCoID(cotypeid, Convert.ToInt32(item));
                    if (m != null)
                    {

                    }
                    else
                    {
                        t_EE_DepartmentalApportionment bm = new t_EE_DepartmentalApportionment();
                        bm.EneryUserID = Convert.ToInt32(item);
                        bm.CollTypeID = cotypeid;
                        DAL.DepartmentalApportionmentDAL.getInstance().AddBudGet(bm);
                    }
                }
            }

            return Json("ok");
        }

        public class UpdateBudGet
        {
            public int UID { get; set; }
            public int year { get; set; }
            public int month { get; set; }
            public int typeid { get; set; }
            public int depid { get; set; }
            public decimal GeneralBudget { get; set; }
            public decimal BudgetBalance { get; set; }
            public decimal MonthBudget { get; set; }
            public decimal SubsectorGate { get; set; }
            public decimal SubtypeBudget { get; set; }
            public decimal DepartmentalApportionment { get; set; }

        }
        #endregion

        #region 能源单价
        public JsonResult AddEneryPrice(t_EE_PriceEnery model)
        {
            int n = 0;
            if (model.ID <= 0)
            {
                int total = 0;
                IList<t_EE_PriceEnery> list = DAL.PriceEneryDAL.getInstance().GetPriceEneryBy(out total, model.UID, model.CollTypeID, model.Ladder, 1, 1);
                if (total > 0)
                {
                    t_EE_PriceEnery m = list[0];
                    m.UID = model.UID;
                    m.CollTypeID = model.CollTypeID;
                    m.Ladder = model.Ladder;
                    m.LadderValue = model.LadderValue;
                    m.Price = model.Price;
                    n = DAL.PriceEneryDAL.getInstance().UpdatePriceEnery(m);
                }
                else
                {
                    n = DAL.PriceEneryDAL.getInstance().InserPriceEnery(model);
                }
            }
            else
            {
                t_EE_PriceEnery m = DAL.PriceEneryDAL.getInstance().GetPriceEneryByID(model.ID);
                m.UID = model.UID;
                m.CollTypeID = model.CollTypeID;
                m.Ladder = model.Ladder;
                m.LadderValue = model.LadderValue;
                m.Price = model.Price;
                n = DAL.PriceEneryDAL.getInstance().UpdatePriceEnery(m);
            }
            return Json(n, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPriceListModel(int uid = 0, int colltypeid = 0, int level = 0, int page = 1, int rows = 15)
        {
            int total = 0;
            IList<t_EE_PriceEnery> list = DAL.PriceEneryDAL.getInstance().GetPriceEneryBy(out total, uid, colltypeid, level, page, rows);
            if (total > 0)
            {
                return Json("yes", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("no", JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult DeleteEneryPrice(int ID)
        {
            int n = DAL.PriceEneryDAL.getInstance().DeletePriceEnery(ID);
            return Json(n, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetEneryPriceList(int uid = 0, int colltypeid = 0, int level = 0, int page = 1, int rows = 15)
        {
            int total = 0;
            IList<t_EE_PriceEnery> list = DAL.PriceEneryDAL.getInstance().GetPriceEneryBy(out total, uid, colltypeid, level, page, rows);
            return Json(new { total, list }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 能源公示
        public JsonResult GetEneryView(string depids, int uid = 0, string time = "2018-11-25")
        {
            List<LookView> lookList = new List<LookView>();
            try
            {
                string pids = GetPIDs();

                //var list_config = DAL.EnergyAnnConfigDAL.getInstance().GetenConig(uid, CurrentUser.UserID);
                var deps = depids.Split(',');
                if (deps.Count() != 0)
                {
                    foreach (var ittt in deps)
                    {
                        IList<t_V_LookEneryView> list = DAL.LookEneryViewDAL.getInstance().GetCIDByID(ittt, uid);
                        foreach (var item in list)
                        {
                            if (!string.IsNullOrEmpty(item.cids.Trim()))
                            {
                                Dictionary<int, string> cpids = GetCId(item.cids);
                                var v = DAL.EneryOverViewDAL.getInstance().GetLookDatas(cpids, Convert.ToDateTime(time).ToString("yyyy-MM-dd"));
                                LookView m = new LookView();
                                m.Name = item.Name;
                                m.DValue = Math.Round(v.Sum(p => p.Rate), 2);
                                m.unit_area = item.unit_area;
                                m.unit_people = item.unit_people;
                                if (item.unit_people != 0)
                                    m.avgV = m.DValue / item.unit_people;

                                lookList.Add(m);
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(lookList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddOrUpdateLookConfig(t_EE_EnergyAnnConfig model)
        {
            try
            {
                int n = 0;
                var info = DAL.EnergyAnnConfigDAL.getInstance().GetenConig(model.UID, CurrentUser.UserID);
                if (info != null)
                {
                    info.UID = model.UID;
                    info.UserID = CurrentUser.UserID;
                    info.EneryUserTypeID = model.EneryUserTypeID;
                    n = DAL.EnergyAnnConfigDAL.getInstance().UpdateConfig(info);
                }
                else
                {
                    model.UserID = CurrentUser.UserID;
                    n = DAL.EnergyAnnConfigDAL.getInstance().AddConfig(model);
                }
                if (n > 0)
                {
                    return Json("ok", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("Error", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public JsonResult GetLookEneryConfig(int uid)
        {
            try
            {
                var info = DAL.EnergyAnnConfigDAL.getInstance().GetenConig(uid, CurrentUser.UserID);
                return Json(info, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public class LookView
        {
            public string Name { get; set; }
            public decimal DValue { get; set; }
            public int unit_area { get; set; }
            public int unit_people { get; set; }
            public decimal avgV { get; set; } = 0;
        }

        #endregion

        #region 能源查询
        public JsonResult GetEneryList(string time, string ksid, int uid = 0, int did = 0, int cotypeid = 0, int page = 1, int rows = 10)
        {
            List<enview> datas = new List<enview>();
            try
            {
                string pids = GetPIDs();
                IList<t_V_LookEneryView> list = DAL.LookEneryViewDAL.getInstance().GetCIDByID(ksid, uid);
                foreach (var item in list)
                {
                    if (item.cids != null && !string.IsNullOrEmpty(item.cids.Trim()))
                    {
                        Dictionary<int, string> cpids = GetCId(item.cids);
                        IList<t_V_EnerySelectView> list_data = DAL.EnerySelectViewDAL.getInstance().GetDatas(time, cpids, did, cotypeid);

                        foreach (var it in list_data.GroupBy(p => p.RecordTime))
                        {
                            foreach (var ix in it.GroupBy(p => p.PName))
                            {
                                foreach (var ixx in ix.GroupBy(p => p.CName))
                                {
                                    foreach (var i in ixx.GroupBy(p => p.DeviceName))
                                    {
                                        foreach (var ii in i.GroupBy(p => p.Name))
                                        {
                                            enview m = new enview();
                                            m.RecordTime = it.Key.ToString();
                                            m.DeviceName = ix.Key + "_" + ixx.Key + "_" + i.Key;
                                            m.TypeName = ii.Key;
                                            m.DValue = Math.Round(ii.Sum(p => p.UserPowerRate), 2);
                                            m.Name = item.Name;
                                            datas.Add(m);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(new { datas = datas.Skip((page - 1) * rows).Take(rows), total = datas.Count }, JsonRequestBehavior.AllowGet);
        }
        public class enview
        {
            public string RecordTime { get; set; }
            public string Name { get; set; }
            public decimal DValue { get; set; }
            public string TypeName { get; set; }
            public string DeviceName { get; set; }

        }
        public JsonResult GetDeviceCombox(int uid)
        {
            // string pids = GetPIDs();
            var model = DAL.UnitDAL.getInstance().GetUnitModelByID(uid);
            if (model != null)
            {
                IList<t_DM_DeviceInfo> list = DAL.DeviceInfoDAL.getInstance().GetDeviceCombox(model.PDRList);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("No Data", JsonRequestBehavior.AllowGet);
            }
        }
        #endregion
        #region 能源报告
        public JsonResult GetEnFromData(int type, string time, int uid, int DepartmentID = 0, int page = 1, int rows = 10)
        {
            List<table> table = new List<table>();
            Dictionary<string, string> TitleName = new Dictionary<string, string>();
            TitleName.Add("Time", "日期");
            try
            {
                IList<t_EE_EnerUserType> list_keshi = DAL.EnerUserTypeDAL.getInstance().GetComobxList(2);
                string pids = GetPIDs();
                var config = DAL.EnTypeConfigDAL.getInstance().GetenConig(uid, DepartmentID + "");
                if (type == 1)
                {
                    string t1 = Convert.ToDateTime(time).ToString("yyyy-MM-dd 00:00:00");
                    string t2 = Convert.ToDateTime(time).ToString("yyyy-MM-dd 23:59:59");
                    string t3 = Convert.ToDateTime(time).AddMonths(-1).ToString("yyyy-MM-dd 00:00:00");
                    string t4 = Convert.ToDateTime(time).AddMonths(-1).ToString("yyyy-MM-dd 23:59:59");
                    string cidss = "";
                    var cidList = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, DepartmentID);
                    foreach (var item in cidList)
                    {
                        if (!string.IsNullOrEmpty(item.addCid))
                            cidss += item.addCid + ",";
                    }

                    Dictionary<int, string> cpids = GetCId(cidss.TrimEnd(','));
                    // if (!string.IsNullOrEmpty(cidss))
                    {
                        var data = DAL.EneryReportFromDAL.getInstance().GetDayFormDatas(cpids, t1, t2);
                        var LastData = DAL.EneryReportFromDAL.getInstance().GetDayFormDatas(cpids, t3, t4);
                        foreach (var xi in data.GroupBy(p => p.RecordTime))
                        {
                            table t = new table();
                            t.value.Add("Time", xi.Key.ToString());
                            int i = 0;
                            foreach (var xt in xi.GroupBy(p => p.TypeName))
                            {
                                if (!TitleName.Keys.Contains("thisData" + i))
                                {
                                    TitleName.Add("thisData" + i, "用" + xt.Key + "量");
                                }

                                t.value.Add("thisData" + i, xi.Sum(p => p.Value) + "");
                                if (!TitleName.Keys.Contains("LastMonthData" + i))
                                {
                                    TitleName.Add("LastMonthData" + i, "上月同比" + xt.Key);
                                }
                                t.value.Add("LastMonthData" + i, LastData.Where(p => p.RecordTime == xi.Key && p.TypeName == xt.Key).Sum(p => p.Value) + "");
                                i++;
                            }

                            t.value.Add("SumRate", xi.Sum(p => p.Value) + "");
                            t.value.Add("SumBiLi", LastData.Where(p => p.RecordTime == xi.Key).Sum(p => p.Value) + "");
                            table.Add(t);
                        }
                    }
                }

                else if (type == 2)
                {

                    string t1 = Convert.ToDateTime(time).AddDays(1 - Convert.ToDateTime(time).Day).ToString();
                    string t2 = Convert.ToDateTime(time).AddDays(1 - Convert.ToDateTime(time).Day).AddMonths(1).AddDays(-1).ToString();
                    string t3 = Convert.ToDateTime(time).AddDays(1 - Convert.ToDateTime(time).Day).AddYears(-1).ToString();
                    string t4 = Convert.ToDateTime(time).AddDays(1 - Convert.ToDateTime(time).Day).AddMonths(1).AddDays(-1).AddYears(-1).ToString();

                    string cidss = "";
                    var cidList = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, DepartmentID);
                    foreach (var item in cidList)
                    {
                        if (!string.IsNullOrEmpty(item.addCid))
                            cidss += item.addCid + ",";
                    }
                    Dictionary<int, string> cpids = GetCId(cidss.TrimEnd(','));


                    var data = DAL.EneryReportFromDAL.getInstance().GetMonthFormDatas(cpids, t1, t2);
                    var LastData = DAL.EneryReportFromDAL.getInstance().GetMonthFormDatas(cpids, t3, t4);
                    foreach (var xi in data.GroupBy(p => p.RecordTime))
                    {
                        table t = new table();
                        t.value.Add("Time", xi.Key.ToString());
                        int i = 0;
                        foreach (var xt in xi.GroupBy(p => p.TypeName))
                        {
                            if (!TitleName.Keys.Contains("thisData" + i))
                            {
                                TitleName.Add("thisData" + i, "用" + xt.Key + "量");
                            }

                            t.value.Add("thisData" + i, xi.Sum(p => p.Value) + "");
                            if (!TitleName.Keys.Contains("LastMonthData" + i))
                            {
                                TitleName.Add("LastMonthData" + i, "上月同比" + xt.Key);
                            }
                            t.value.Add("LastMonthData" + i, LastData.Where(p => p.RecordTime == xi.Key && p.TypeName == xt.Key).Sum(p => p.Value) + "");
                            i++;
                        }

                        t.value.Add("SumRate", xi.Sum(p => p.Value) + "");
                        t.value.Add("SumBiLi", LastData.Where(p => p.RecordTime == xi.Key).Sum(p => p.Value) + "");
                        table.Add(t);
                    }


                }
                else if (type == 3)
                {

                    string t1 = new DateTime(Convert.ToInt32(time), 1, 1).ToString("yyyy-01-01");
                    string t2 = new DateTime(Convert.ToInt32(time), 12, 31).ToString("yyyy-12-31");
                    string t3 = new DateTime(Convert.ToInt32(time), 1, 1).AddYears(-1).ToString("yyyy-01-01");
                    string t4 = new DateTime(Convert.ToInt32(time), 12, 31).AddYears(-1).ToString("yyyy-12-31");

                    string cidss = "";
                    var cidList = DAL.EnerUserProjectDAL.getInstance().GetCidByUidAndIDepID(uid, DepartmentID);
                    foreach (var item in cidList)
                    {
                        if (!string.IsNullOrEmpty(item.addCid))
                            cidss += item.addCid + ",";
                    }
                    Dictionary<int, string> cpids = GetCId(cidss.TrimEnd(','));


                    var data = DAL.EneryReportFromDAL.getInstance().GetDatGetYearFormDatasas(cpids, t1, t2);
                    var LastData = DAL.EneryReportFromDAL.getInstance().GetDatGetYearFormDatasas(cpids, t3, t4);
                    foreach (var xi in data.GroupBy(p => p.RecordTime))
                    {
                        table t = new table();
                        t.value.Add("Time", xi.Key.ToString());
                        int i = 0;
                        foreach (var xt in xi.GroupBy(p => p.TypeName))
                        {
                            if (!TitleName.Keys.Contains("thisData" + i))
                            {
                                TitleName.Add("thisData" + i, "用" + xt.Key + "量");
                            }

                            t.value.Add("thisData" + i, xi.Sum(p => p.Value) + "");
                            if (!TitleName.Keys.Contains("LastMonthData" + i))
                            {
                                TitleName.Add("LastMonthData" + i, "上月同比" + xt.Key);
                            }
                            t.value.Add("LastMonthData" + i, LastData.Where(p => p.RecordTime == xi.Key.AddYears(-1) && p.TypeName == xt.Key).Sum(p => p.Value) + "");
                            i++;
                        }

                        t.value.Add("SumRate", xi.Sum(p => p.Value) + "");
                        t.value.Add("SumBiLi", LastData.Where(p => p.RecordTime == xi.Key).Sum(p => p.Value) + "");
                        table.Add(t);
                    }

                }
                TitleName.Add("SumRate", "总费用");
                TitleName.Add("SumBiLi", "总同比");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(new { TitleName, table }, JsonRequestBehavior.AllowGet);
        }

        public Dictionary<int, string> GetCId(string stringCid)
        {

            Dictionary<int, string> data = new Dictionary<int, string>();
            try
            {
                string cids = string.Empty;
                string pids = string.Empty;
                if (!string.IsNullOrEmpty(stringCid))
                {
                    if (!string.IsNullOrEmpty(stringCid.Trim()))
                    {
                        var s = stringCid.Split(',');
                        foreach (var i in s)
                        {
                            var x = i.Split('-');
                            List<string> cidList = new List<string>();
                            if (data.Keys.Contains(Convert.ToInt32(x[0])))
                            {
                                data[Convert.ToInt32(x[0])] = data[Convert.ToInt32(x[0])] + "," + x[1];
                            }
                            else
                            {
                                data.Add(Convert.ToInt32(x[0]), x[1]);
                            }
                        }
                    }
                }
                return data;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public class jichu
        {

        }
        #endregion
    }
}