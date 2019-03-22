using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.Text;
using YWWeb.PubClass;
using System.Collections.Specialized;
using YWWeb;

namespace YWWeb.Controllers
{
    //售电模块Controller
    public class EsController : UserControllerBaseEx
    {
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        private string getSessionID()
        {


            string sessionid = "";
            if (Request.Headers["Cookie"] != null)
            {
                sessionid = Request.Headers["Cookie"].ToString();
                sessionid = sessionid.Replace(';', '&').Replace(" ", "");
                NameValueCollection query = HttpUtility.ParseQueryString(sessionid, Encoding.GetEncoding("gb2312"));
                sessionid = query["ASP.NET_SessionId"];
            }
            return sessionid;
        }


        [Login]
        public ActionResult Overview()//总览
        {
            return View();
        }

        [Login]
        public ActionResult OverviewInput()//总览信息录入
        {
            return View();
        }


        [Login]
        public ActionResult EsDecisionMaking()//售电辅助决策
        {
            return View();
        }

        [Login]
        public ActionResult FormulaEdit()//公式编辑
        {
            return View();
        }

        [Login]
        public ActionResult ElectricMeter()//电表配置工具
        {
            return View();
        }

        [Login]
        public ActionResult ElectricityPriceAnalysis()//电价对比分析
        {
            return View();
        }

        [Login]
        public ActionResult ElectricityPriceInput()//录入交易电价
        {
            return View();
        }


        [Login]
        public ActionResult RecordingWave()//故障录波
        {
            return View();
        }

        [Login]
        public ActionResult EnergyContract()//能源托管合同
        {
            return View();
        }
        //添加/编辑合同
        [Login]
        public ActionResult ConstractEdit()
        {
            return View();
        }
        //查看合同
        [Login]
        public ActionResult ConstractView()
        {
            return View();
        }
        [Login]
        public ActionResult ElectricQuantityAnalysis()//电量对比分析
        {
            return View();
        }

        [Login]
        public ActionResult NeedAnalysis()//最大需量分析
        {
            return View();
        }
        [Login]
        public ActionResult OverviewPurchaseRecord()//录入够电量
        {
            return View();
        }
        [Login]
        public ActionResult UpPlan()//上报计划
        {
            return View();
        }
        [Login]
        public ActionResult PurchasingCharts()//购电总览
        {
            return View();
        }
        [Login]
        public ActionResult StationTemp()//站监测项管理
        {
            return View();
        }
        public ActionResult UserView()//用户总览
        {
            return View();
        }
        public ActionResult Score()//用户总览
        {
            return View();
        }
        public ActionResult UserView2()//用户总览
        {
            return View();
        }
        public ActionResult PowerPurchaseContract()
        {
            return View();
        }
        public ActionResult CategoryView()
        {
            return View();
        }
        public ActionResult TransferTransactionView()
        {
            return View();
        }
        public ActionResult UserPlanLog()
        {
            return View();
        }
        
        #region 年度计划用电量录入相关方法
        /// <summary>
        /// 加载年度计划用电
        /// </summary>
        /// <param name="rows"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [Login]
        public ActionResult GetUserPlanList(int rows, int page, int pz, int unit, int year, int mon = 0, int wx = 0)
        {
            string ustr = HomeController.GetUID();

            if (string.IsNullOrEmpty(ustr))
                return Content("");
            string strsql = @"select a.id, a.year,a.month,a.[plan],a.readed,a.trade_price,b.category_name,a.extraTradePrice,b.id as categoryID,c.UnitID as unid,a.create_time,a.remark,
                            a.daily_average,c.UnitName as Name from t_ES_UsePlan a inner join
                            t_ES_Category b on a.categoryID=b.id inner join
                            t_CM_Unit c on a.unid=c.UnitID where a.unid in (" + ustr + ")";
            if (pz != 0)
            {
                strsql += " and b.id = " + pz.ToString() + " ";
            }
            if (unit != 0)
            {
                strsql += " and c.UnitID=" + unit.ToString() + " ";
            }
            if (year != 0)
            {
                strsql += " and a.year=" + year.ToString() + " ";
            }
            if (mon != 0)
            {
                if (wx == 1) strsql += " and a.month>=" + mon + " and a.month<=" + (mon + 1);
                else strsql += " and a.month=" + mon + " ";
            }
            string[] fot = { "plan" };
            var Blist = bll.ExecuteStoreQuery<UserPlanView>(strsql).OrderByDescending(p => p.create_time).ToList();
            string strJson = Common.List2Json(Blist, rows, page, fot);
            return Content(strJson);
        }
        [Login]
        public ActionResult GetPlanView()
        {
            string ustr = HomeController.GetUID();

            if (string.IsNullOrEmpty(ustr))
                return Content("");
            string strsql = @"select a.id, a.year,a.month,a.[plan],a.readed,a.trade_price,b.category_name,a.extraTradePrice,b.id as categoryID,c.UnitID as unid,a.create_time,a.remark,
                            a.daily_average,c.UnitName as Name from t_ES_UsePlan a inner join
                            t_ES_Category b on a.categoryID=b.id inner join
                            t_CM_Unit c on a.unid=c.UnitID where a.unid in (" + ustr + ")";


            var xlist = bll.ExecuteStoreQuery<UserPlanView>(strsql).ToList();
            var Blist = xlist.GroupBy(p => p.Name).ToList();
            List<Planview> list = new List<Planview>();
            foreach (var item in Blist)
            {
                decimal? plan = 0;
                Planview m = new Planview();
                m.UnitName = item.Key;
                t_CM_Unit unit = bll.t_CM_Unit.Where(p => p.UnitName == item.Key).FirstOrDefault();
                t_ES_UserUsePowerMonthly xx = bll.t_ES_UserUsePowerMonthly.Where(p => p.UID == unit.UnitID && p.UsePower != null && p.UsePower != 0).OrderByDescending(p => p.RecordTime).FirstOrDefault();
                if (xx != null)
                    m.pianchalv = xx.AllDeviationRate;

                foreach (var ii in item)
                {
                    plan += ii.plan;
                }

                foreach (var iii in bll.t_ES_Category.OrderBy(p => p.orderNumber).ToList())
                {
                    UserPlanView mm = new UserPlanView();
                    decimal? plan1 = 0;
                    mm.category_name = iii.category_name;
                    var ss = item.Where(p => p.categoryID == iii.id).ToList();
                    foreach (var iiii in ss)
                    {
                        plan1 += iiii.plan;
                    }
                    mm.plan = plan1;
                    m.list.Add(mm);
                    t_ES_UserUsePowerMonthly c = bll.t_ES_UserUsePowerMonthly.Where(p => p.UID == unit.UnitID && p.categoryID == iii.id && p.UsePower != null && p.UsePower != 0).OrderByDescending(p => p.RecordTime).FirstOrDefault();
                    xxx x = new xxx();
                    x.plan = plan1 * (1 + m.pianchalv);
                    m.tiaopian.Add(x);
                    //已购电量
                    PurchaseView goudian = new PurchaseView();
                    goudian.quantity = bll.t_ES_Purchase.Where(p => p.categoryID == iii.id).Sum(p => p.quantity) == null ? 0 : bll.t_ES_Purchase.Where(p => p.categoryID == iii.id).Sum(p => p.quantity);
                    goudian.category_name = iii.category_name;
                    m.goudian.Add(goudian);
                    PurchaseView yinggou = new PurchaseView();
                    yinggou.quantity = x.plan - goudian.quantity;
                    yinggou.category_name = iii.category_name;
                    m.yinggou.Add(yinggou);
                }
                m.MonthPlan = plan;
                list.Add(m);
            }
            var pzlist = bll.t_ES_Category.OrderBy(p => p.orderNumber).ToList();
            return Json(new { list = list, pzlist = pzlist });
        }
        public class Planview
        {
            public Planview()
            {
                list = new List<UserPlanView>();
                tiaopian = new List<xxx>();
                SumPz = new List<m>();
                SumTiaoPian = new List<m1>();
                pianchalv = 0;
                goudian = new List<PurchaseView>();
                yinggou = new List<PurchaseView>();
            }
            public string UnitName { get; set; }
            public decimal? MonthPlan { get; set; }

            public decimal? pianchalv { get; set; }
            public List<UserPlanView> list { get; set; }
            public List<xxx> tiaopian { get; set; }
            public List<m> SumPz { get; set; }
            public List<m1> SumTiaoPian { get; set; }
            public List<PurchaseView> goudian { get; set; }
            public List<PurchaseView> yinggou { get; set; }
        }
        public class xxx
        {
            public xxx()
            {
                plan = 0;
            }
            public decimal? plan { get; set; }
            public string category_name { get; set; }
        }
        public class m
        {
            public m()
            {
                plan = 0;
            }
            public decimal? plan { get; set; }
        }
        public class m1
        {
            public m1()
            {
                plan = 0;
            }
            public decimal? plan { get; set; }
        }
        /// <summary>
        /// 添加(编辑)计划用电
        /// </summary>
        /// <param name="userPlan"></param>
        /// <returns></returns>
        [Login]
        public ActionResult Save(t_ES_UsePlan userPlan)
        {
            string result = "OK";
            {
                if (userPlan.id < 1)
                {
                    userPlan.remark = JsonHelper.ToJsonString(userPlan.remark);
                    userPlan.create_time = DateTime.Now;
                    userPlan.daily_average = GetDaysInMonth(userPlan.year, userPlan.month, userPlan.plan);
                    bll.t_ES_UsePlan.AddObject(userPlan);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + userPlan.id + "]");
                }
                else
                {
                    t_ES_UsePlan userPlaninfo = bll.t_ES_UsePlan.Where(r => r.id == userPlan.id).First();
                    userPlaninfo.month = userPlan.month;
                    userPlaninfo.year = userPlan.year;
                    userPlaninfo.unid = userPlan.unid;
                    userPlaninfo.categoryID = userPlan.categoryID;
                    userPlaninfo.plan = userPlan.plan;
                    userPlaninfo.trade_price = userPlan.trade_price;
                    userPlaninfo.extraTradePrice = userPlan.extraTradePrice;
                    userPlaninfo.daily_average = GetDaysInMonth(userPlan.year, userPlan.month, userPlan.plan);
                    userPlaninfo.remark = JsonHelper.ToJsonString(userPlan.remark);
                    bll.ObjectStateManager.ChangeObjectState(userPlaninfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + userPlan.id + "]");
                }

                return Content(result);
            }
        }
        /// <summary>
        /// 配电房列表
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult PDRComboData()
        {
            string pstr = HomeController.GetPID(CurrentUser.UNITList);
            if (string.IsNullOrEmpty(pstr))
                return Content("");

            string sql = "select* from t_CM_PDRInfo where PID IN (" + pstr + ")";
            List<t_CM_PDRInfo> list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(sql).ToList();
            var result = from r in list
                         select new
                         {
                             PID = r.PID,
                             Name = r.Name
                         };
            return Json(result);
        }
      
        /// <summary>
        /// 品种下拉框
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="showall"></param>
        /// <returns></returns>
        public ActionResult BindCategory(bool isall)
        {
            List<t_ES_Category> list = bll.t_ES_Category.OrderBy(d => d.category_name).ToList();

            string strJson = Common.ComboboxToJson(list);
            if (isall)
            {
                strJson = AddShowAll(1, strJson, "id", "category_name");
            }
            return Content(strJson);
        }
        //删除
        [Login]
        public ActionResult DeleteUserPlan(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_ES_UsePlan> list = bll.t_ES_UsePlan.Where(m => resultlist.Contains(m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.t_ES_UsePlan.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("电力交易", CurrentUser.UserName, "删除计划[用户ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        private string AddShowAll(int rowcount, string strJson, string dkey, string dvalue)
        {
            if (rowcount > 0)
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==全部==\"},");
            else
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==全部==\"}");
            return strJson;
        }

        //public t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}
        public class UserPlanView
        {
            public int id { get; set; }
            public int year { get; set; }
            public int month { get; set; }
            public decimal? plan { get; set; }
            public string category_name { get; set; }
            public string remark { get; set; }
            public decimal? daily_average { get; set; }
            public string Name { get; set; }
            public DateTime create_time { get; set; }
            public int categoryID { get; set; }
            public int pid { get; set; }
            public int unid { get; set; }
            public decimal? trade_price { get; set; }
            public int? readed { get; set; }
            public decimal? extraTradePrice { get; set; }
        }
        public decimal GetDaysInMonth(int? year, int? month, decimal? plan)
        {
            int y;
            int m;
            int.TryParse(year.ToString(), out y);
            int.TryParse(month.ToString(), out m);
            int days = DateTime.DaysInMonth(y, m);
            decimal p;
            decimal.TryParse(plan.ToString(), out p);
            decimal reslut = Math.Round(p / days, 2);
            return reslut;
        }
        #endregion

        #region 录入交易电价相关方法
        [Login]
        public ActionResult GetTradePriceList(int rows, int page, int unit, DateTime? startTime, DateTime? endTime)
        {
            string strsql = @"select a.id,a.unid, a.save_cost,a.catalog_price,a.trade_time,a.pc_save_cost,a.trade_num,a.All_cost,a.trade_price,b.UnitName as Name from 
                              t_ES_TradePrice a inner join t_CM_Unit b on a.unid=b.UnitID";
            if (startTime != null)
            {
                strsql += " and a.trade_time> = '" + startTime + "' ";
            }
            if (unit != 0)
            {
                strsql += " and a.unid=" + unit.ToString() + " ";
            }
            if (endTime != null)
            {
                strsql += " and a.trade_time<='" + endTime + "' ";
            }
            strsql += " ORDER BY trade_time";
            var Blist = bll.ExecuteStoreQuery<TradePriceView>(strsql).ToList();
            string strJson = Common.List2Json(Blist, rows, page);
            return Content(strJson);
        }
        /// <summary>
        /// 添加(编辑)交易电价
        /// </summary>
        /// <param name="userPlan"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SaveTradePrice(t_ES_TradePrice tradePrice)
        {
            string result = "OK";
            {
                if (tradePrice.id < 1)
                {
                    //目录电价
                    //tradePrice.catalog_price = GetMuLuPrice(tradePrice.unid, tradePrice.trade_time);
                    //节省电费
                    tradePrice.save_cost = GetJieShengdianfei(tradePrice.trade_num, tradePrice.catalog_price, tradePrice.trade_price);
                    tradePrice.All_cost = GetJieShengdianfei(tradePrice.trade_num, tradePrice.catalog_price, tradePrice.trade_price) + tradePrice.pc_save_cost;
                    bll.t_ES_TradePrice.AddObject(tradePrice);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + tradePrice.id + "]");
                }
                else
                {
                    t_ES_TradePrice tradePriceinfo = bll.t_ES_TradePrice.Where(r => r.id == tradePrice.id).First();
                    tradePriceinfo.trade_price = tradePrice.trade_price;
                    tradePriceinfo.trade_num = tradePrice.trade_num;
                    tradePriceinfo.catalog_price = tradePrice.catalog_price;
                    tradePriceinfo.pc_save_cost = tradePrice.pc_save_cost;
                    tradePriceinfo.save_cost = GetJieShengdianfei(tradePrice.trade_num, tradePrice.catalog_price, tradePrice.trade_price);
                    tradePriceinfo.All_cost = GetJieShengdianfei(tradePrice.trade_num, tradePrice.catalog_price, tradePrice.trade_price) + tradePrice.pc_save_cost;
                    tradePriceinfo.unid = tradePrice.unid;
                    bll.ObjectStateManager.ChangeObjectState(tradePriceinfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + tradePrice.id + "]");
                }
                return Content(result);
            }
        }

        //获取目录电价
        private decimal? GetMuLuPrice(int? uid, DateTime? time)
        {
            decimal? price = 0;
            string month = time.Value.Month.ToString();
            string year = time.Value.Year.ToString();
            if (uid != 0)
            {
                string sql = @"select a.UsePower,a.UserPowerRate from  t_ES_UserUsePowerYearly a where a.UID=" + uid + " and  Year(a.RecordTime)=" + year + " and MONTH(a.RecordTime)=" + month + "";

                jiaoyi reslut = bll.ExecuteStoreQuery<jiaoyi>(sql).FirstOrDefault();
                if (reslut != null)
                {
                    if (reslut.UsePower != 0)
                    {
                        price = Convert.ToDecimal(reslut.UserPowerRate) / Convert.ToDecimal(reslut.UserPowerRate);
                    }
                }
                ///var m = bll.t_ES_UserUsePowerYearly.Where(p => p.UID == uid && p.RecordTime == time).FirstOrDefault();

                //t_CM_Unit model = bll.t_CM_Unit.Where(p => p.UnitID == unid).FirstOrDefault();
                //var Pmodel = bll.t_ES_ElecPrice.Where(p => p.IndID == model.IndID && p.BigIndTypeID == model.BigIndTypeID && p.VID == model.VID).ToList();
                //if (Pmodel.Count() != 0)
                //{
                //    foreach (var item in Pmodel)
                //    {
                //        var Emoel = bll.t_ES_ElecFlatDryRich.Where(p => p.FDRID == item.FDRID).FirstOrDefault();
                //        if (Emoel != null)
                //        {
                //            List<string> mlist = Emoel.month.Split(',').ToList();
                //            if (mlist.Contains(month))
                //            {
                //                price = item.ElecPrice;
                //                break;
                //            }
                //        }
                //    }
                //}
                //else
                //{

                //    var Psmodel = bll.t_ES_ElecPrice.Where(p => p.IndID == model.IndID && p.BigIndTypeID == model.BigIndTypeID && p.VID == model.VID && p.FDRID == 1).FirstOrDefault();
                //    if (Psmodel != null)
                //        price = Psmodel.ElecPrice;
                //}


            }
            return price;
        }
        public class jiaoyi
        {
            public decimal? UsePower { get; set; }
            public decimal? UserPowerRate { get; set; }

        }
        /// <summary>
        /// 节省电费
        /// </summary>
        /// <param name="unit"></param>
        /// <returns></returns>
        public decimal? GetJieShengdianfei(decimal? qu, decimal? mulu, decimal? jiaoyi)
        {
            decimal? price = 0;
            //decimal? ydl = 0;
            //if (m != null)
            //{
            //    ydl = Convert.ToDecimal(m.UsePower);
            //}
            price = (mulu - jiaoyi) * qu;
            return price;
        }
        //删除
        [Login]
        public ActionResult DeleteTradePrice(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_ES_TradePrice> list = bll.t_ES_TradePrice.Where(m => resultlist.Any(a => a == m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.t_ES_TradePrice.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("电力交易", CurrentUser.UserName, "删除交易电价[用户ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        public class TradePriceView
        {
            public int? id { get; set; }
            public decimal? save_cost { get; set; }
            public decimal? catalog_price { get; set; }
            public decimal? trade_num { get; set; }
            public decimal? trade_price { get; set; }
            public string Name { get; set; }
            public string daily_average { get; set; }
            public DateTime? trade_time { get; set; }
            public int unid { get; set; }
            public decimal? pc_save_cost { get; set; }
            public decimal? All_cost { get; set; }
        }


        [Login]
        public ActionResult GetMuDianjia()
        {
            //string strsql = @"select a.id,a.unid, a.save_cost,a.catalog_price,a.trade_time,a.trade_num,a.trade_price,b.UnitName as Name from 
            //                  t_ES_TradePrice a inner join t_CM_Unit b on a.unid=b.UnitID";

            //var r = bll.t_ES_ElecFlatDryRich.ToList();
            //var r1 = bll.t_ES_ElecPeakValleyFlat);
            var r1 = bll.t_ES_ElecPrice.Where(p => p.FDRID == 1 && p.PVFID == 3).ToList();


            var r2 = bll.t_ES_ElecPrice.Where(p => p.FDRID == 1 && p.PVFID == 2).ToList();

            var r3 = bll.t_ES_ElecPrice.Where(p => p.FDRID == 1 && p.PVFID == 1).ToList();
            List<shuju> list = new List<shuju>();
            int i = 0;

            shuju model1 = new shuju();
            foreach (var item in r1)
            {

                list.Add(model1);
            }
            return Json(list);
        }
        public class shuju
        {
            public decimal? shuju1 { get; set; }

            public decimal? shuju2 { get; set; }

            public decimal? shuju3 { get; set; }

            public decimal? shuju4 { get; set; }

            public decimal? shuju5 { get; set; }

            public decimal? shuju6 { get; set; }

            public decimal? shuju7 { get; set; }

            public decimal? shuju8 { get; set; }

            public decimal? shuju9 { get; set; }
        }
        #endregion

        #region 购电量记录录入相关方法

        //用户更改计划列表
        [Login]
        public ActionResult GetPlanChangeList(int year, int month, int UnitID)
        {
            string strsql = "SELECT * FROM t_ES_UsePlanChange WHERE [year]=" + year + " AND [month]=" + month + " AND UnitID=" + UnitID + " ORDER BY id DESC";
            var Blist = bll.ExecuteStoreQuery<t_ES_UsePlanChange>(strsql).ToList();
            return Content(JsonConvert.SerializeObject(Blist));
        }

        //用户确认已读通知；
        [Login]
        public ActionResult confirmReaded(List<string> ids)
        {
            try
            {
                if (ids != null && ids.Count > 0)
                {
                    string sql = "UPDATE t_ES_UsePlan SET readed=0 WHERE 1!=1 ";
                    foreach (var id in ids)
                    {
                        sql += " OR id=" + id;
                    }
                    bll.ExecuteStoreCommand(sql);
                    return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, "确认成功")));
                }
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "未能确认")));
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "发生错误")));
            }
        }

        //获取最后一条用户计划修改记录；
        [Login]
        public ActionResult getLastConfirm(int id, int UnitID, int year, int month, string planStr, string pzid)
        {
            try
            {
                List<t_ES_UsePlanChange> list = bll.t_ES_UsePlanChange.Where(p => p.UnitID == UnitID && p.year == year && p.month == month).ToList();
                if (list == null || list.Count < 1) return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "没有提交的修改计划")));
                t_ES_UsePlanChange change = list.Last();
                if (change.confirm_wx == 1)
                {
                    if (!string.IsNullOrEmpty(planStr))
                    {
                        string[] pzPlan = planStr.Split(',');
                        string[] pzs = pzid.Split(',');
                        for (int i = 0; i < pzs.Length; i++)
                        {
                            int? pz = Convert.ToInt32(pzs[i]);
                            t_ES_UsePlan model = bll.t_ES_UsePlan.Where(p => p.unid == UnitID && p.year == year && p.month == month && p.categoryID == pz).FirstOrDefault();
                            if (model != null)
                            {
                                model.plan = Convert.ToDecimal(pzPlan[i]);
                                model.daily_average = GetDaysInMonth(year, month, Convert.ToDecimal(pzPlan[i]));
                                model.create_time = DateTime.Now;
                                model.readed = 1;
                                change.confirm_web = 1;
                                bll.ObjectStateManager.ChangeObjectState(change, EntityState.Modified);
                                bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                            }
                            else
                            {
                                t_ES_UsePlan m = bll.t_ES_UsePlan.Where(p => p.unid == UnitID && p.year == year && p.month == month).FirstOrDefault();
                                t_ES_UsePlan model2 = new t_ES_UsePlan
                                {
                                    unid = UnitID,
                                    year = year,
                                    month = month,
                                    plan = Convert.ToDecimal(pzPlan[i]),
                                    categoryID = pz,
                                    readed = 1,
                                    create_time = DateTime.Now,
                                    daily_average = GetDaysInMonth(year, month, Convert.ToDecimal(pzPlan[i])),
                                    trade_price = m.trade_price
                                };
                                bll.t_ES_UsePlan.AddObject(model2);
                            }

                        }




                        bll.SaveChanges();
                        string mobile = bll.t_CM_Unit.Where(p => p.UnitID == UnitID).Select(p => p.LinkMobile).FirstOrDefault();
                        UtilsSms.smsInform(mobile, year, month);
                    }
                    return Content(JsonConvert.SerializeObject(new ReturnBean<t_ES_UsePlanChange>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, change)));
                }
                else
                {
                    return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "最新的修改计划未经客户确认")));
                }
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "未能获取")));
            }
        }


        //插入一条用户计划修改记录；
        [Login]
        public ActionResult savePlanChangeRecord(int UnitID, int year, int month, string changgui, string fuyu, string change_remark, string web_remark, decimal change_plan = 0, int confirm_web = 0, int confirm_wx = 0)
        {
            try
            {
                DateTime now = DateTime.Now;
                t_ES_UsePlanChange change = new t_ES_UsePlanChange();
                change.UnitID = UnitID;
                change.year = year;
                change.month = month;
                change.change_plan = change_plan;
                if (string.IsNullOrEmpty(change_remark))
                {
                    change.first_week = change_plan / 4;
                    change.second_week = change_plan / 4;
                    change.third_week = change_plan / 4;
                    change.fourth_week = change_plan / 4;
                }
                change.change_remark = change_remark;
                change.web_remark = web_remark;
                if (confirm_wx == 1)//来自小程序；
                {
                    change.change_time = now;
                }
                else//来自web确认；
                {
                    change.web_time = now;
                }
                change.confirm_web = confirm_web;
                change.confirm_wx = confirm_wx;

                bll.t_ES_UsePlanChange.AddObject(change);
                bll.SaveChanges();
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_SUCCESS, Cons.MSG_SUCCESS, "提交成功")));
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ReturnBean<string>(Cons.CODE_EX, Cons.MSG_EX, "提交失败:" + e.Message)));
            }
        }

        [Login]
        public ActionResult GetPurchaseList(int rows, int page, int pz, int ly, int month)
        {
            string ustr = HomeController.GetUID();


            if (string.IsNullOrEmpty(ustr))
                return Content("");



            string strsql = @"select a.id,a.categoryID,a.Indexweek,a.TradeTime,a.quantity,a.year,a.month,a.company,a.trade_price,a.CreateTime,a.TradeSourceID,b.category_name,c.UnitName from t_ES_Purchase a inner join 
                              t_ES_Category b on a.categoryID=b.id left join t_CM_Unit c on a.UID=c.UnitID where a.UID IN (" + ustr + ")";

            if (pz != 0)
            {
                strsql += " and a.categoryID=" + pz + " ";
            }
            if (ly != 0)
            {
                strsql += " and a.TradeSourceID =" + ly + " ";
            }
            if (month != 0)
            {
                strsql += " and a.month=" + month + " ";
            }
            var Blist = bll.ExecuteStoreQuery<PurchaseView>(strsql).OrderByDescending(p => p.CreateTime).ToList();

            string[] fot = { "quantity", "trade_price" };
            string strJson = Common.List2Json(Blist, rows, page, fot);
            return Content(strJson);
        }


        /// <summary>
        /// 客户列表
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult UnitComboData(bool isall)
        {
            string ustr = HomeController.GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");

            string sql = "SELECT * FROM t_CM_Unit WHERE UnitID IN(" + ustr + ")";
            List<t_CM_Unit> list = bll.ExecuteStoreQuery<t_CM_Unit>(sql).ToList();
            string strJson = Common.ComboboxToJson(list);
            if (isall)
            {
                strJson = AddShowAll(1, strJson, "UnitID", "UnitName");

            }
            else
                return Content(strJson);
            //var result = from r in list
            //             select new
            //             {
            //                 UnitID = r.UnitID,
            //                 UnitName = r.UnitName
            //             };
            return Content(strJson);
        }
        /// <summary>
        /// 添加(编辑)购电记录
        /// </summary>
        /// <param name="userPlan"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SavePurchase(t_ES_Purchase purchase)
        {
            string result = "OK";
            {
                if (purchase.id < 1)
                {
                    purchase.CreateTime = DateTime.Now;
                    purchase.UID = CurrentUser.UID;
                    bll.t_ES_Purchase.AddObject(purchase);
                    bll.SaveChanges();
                    Common.InsertLog("购电量记录", CurrentUser.UserName, "购电量[ID:" + purchase.id + "]");
                }
                else
                {
                    t_ES_Purchase purchaseinfo = bll.t_ES_Purchase.Where(r => r.id == purchase.id).First();
                    purchaseinfo.categoryID = purchase.categoryID;
                    purchaseinfo.company = purchase.company;
                    purchaseinfo.quantity = purchase.quantity;
                    purchaseinfo.trade_price = purchase.trade_price;
                    purchaseinfo.month = purchase.month;
                    purchaseinfo.year = purchase.year;
                    purchaseinfo.Indexweek = purchase.Indexweek;
                    purchaseinfo.TradeTime = purchase.TradeTime;
                    purchaseinfo.UID = CurrentUser.UID;
                    purchaseinfo.TradeSourceID = purchase.TradeSourceID;
                    bll.ObjectStateManager.ChangeObjectState(purchaseinfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("购电量记录", CurrentUser.UserName, "购电量[ID:" + purchase.id + "]");
                }

                return Content(result);
            }
        }

        //删除
        [Login]
        public ActionResult DeletePurchase(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_ES_Purchase> list = bll.t_ES_Purchase.Where(m => resultlist.Contains(m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.t_ES_Purchase.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("购电量记录", CurrentUser.UserName, "删除购电量记录[用户ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        public class PurchaseView
        {
            public int? id { get; set; }
            public decimal? quantity { get; set; }
            public string company { get; set; }
            public string category_name { get; set; }
            public DateTime? CreateTime { get; set; }
            public int categoryID { get; set; }
            public decimal? trade_price { get; set; }
            public int? year { get; set; }
            public int? month { get; set; }
            public int? Indexweek { get; set; }
            public DateTime? TradeTime { get; set; }
            public string UnitName { get; set; }
            public short? TradeSourceID { get; set; }
        }
        #endregion


        #region 总览相关方法
        /// <summary>
        /// 客户分析 1---按行业2---按地区
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public string getKeHuData_FX(int type)
        {
            string result = "";
            try
            {
                string ustr = "";
                //string ustr = HomeController.GetUID();
                //if (string.IsNullOrEmpty(ustr))
                //    return "";

                string strsql = "";

                string str = "";
                if (Convert.ToBoolean(CurrentUser.IsAdmin))
                {
                    var Ulist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).ToList();
                    foreach (var item in Ulist)
                    {
                        if (!string.IsNullOrEmpty(item.UNITList))
                            str += item.UserID + ",";
                    }
                    if (!string.IsNullOrEmpty(str))
                        str = str.Substring(0, str.Length - 1);

                }
                else
                {
                    str = CurrentUser.UserID.ToString();
                }
                if (string.IsNullOrEmpty(str))
                {
                    return "";
                }
                string sql1 = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID where t_CM_Constract.Type=2 and t_CM_Constract.AddUserID IN(" + str + ")  ORDER BY createDate DESC,id DESC";
                var u = bll.ExecuteStoreQuery<Constract>(sql1).Select(p => p.UID).Distinct().ToList();
                if (u != null)
                {
                    foreach (var item in u)
                    {
                        if (item != null)
                            ustr += item + ",";
                    }
                    if (!string.IsNullOrEmpty(ustr))
                        ustr = ustr.Substring(0, ustr.Length - 1);
                }
                if (string.IsNullOrEmpty(ustr))
                    return "";
                if (type == 1)
                {
                    strsql = "select COUNT(*) as shuliang, b.IndustryName as keyName from t_CM_Unit a inner join t_ES_Industry b on a.IndustryID = b.IndustryID where a.UnitID IN (" + ustr + ")  group by b.IndustryName";
                }
                else if (type == 2)
                {
                    strsql = "select COUNT(*) as shuliang,b.cityName as keyName from t_CM_Unit a inner join t_Sys_City b on a.UnitCity=b.cityID  where a.UnitID IN (" + ustr + ")  group by b.cityName";
                }
                var list = bll.ExecuteStoreQuery<Anwis>(strsql).ToList();
                string yAxis = "", series1 = "";
                double dbTotal = 0;

                foreach (var item in list)
                {
                    yAxis += "'" + item.keyName + "',";
                    series1 += "{\"value\": " + item.shuliang + ",\"name\": \"" + item.keyName + "\"},";
                    dbTotal += item.shuliang;
                }


                result = "{\"yAxis\":\"[" + yAxis.TrimEnd(',') + "]\",\"series1\":[" + series1.TrimEnd(',') + "],\"total\":[" + dbTotal.ToString() + "]}";

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return result;
        }
        /// <summary>
        /// 用电分析 1--总计划 2--实际用电 3--剩余电量
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public string getPlanData_FX(int type)
        {
            string result = "";
            List<Anwis> list = new List<Anwis>();
            try
            {
                string ustr = HomeController.GetUID();
                if (string.IsNullOrEmpty(ustr))
                    return "";
                string strsql = "";
                if (type == 1)
                {

                    strsql = "select SUM(a.[plan]) as Sumplan, b.category_name as keyName from t_ES_ContractUsePlan a inner join t_ES_Category b on a.categoryID=b.id  where a.unid IN (" + ustr + ") group by b.category_name";
                    list = bll.ExecuteStoreQuery<Anwis>(strsql).ToList();
                }
                else if (type == 2)
                {
                    strsql = "select sum(a.SumUsePower) as Sumplan,b.category_name as keyName from t_ES_UserUsePowerYearly a inner join t_ES_Category b on a.categoryID=b.id where a.UID IN (" + ustr + ") group by b.category_name";
                    list = bll.ExecuteStoreQuery<Anwis>(strsql).ToList();
                }
                else if (type == 3)
                {
                    int y = DateTime.Now.Year;
                    int m = DateTime.Now.Month;

                    string sql1 = "select (SUM(a.[plan])) as Sumplan,b.category_name as keyName from t_ES_ContractUsePlan a inner join t_ES_Category b on a.categoryID=b.id where a.unid in (" + ustr + ") and a.month>" + m + " and a.year=" + y + "  group by  b.category_name";
                    //string sql2 = "select (SUM(a.SumUsePower)) as Sumplan,b.category_name as keyName from t_ES_UserUsePowerYearly a inner join t_ES_Category b on a.categoryID=b.id where a.UID IN (" + ustr + ")  group by  b.category_name";
                    //var list1 = bll.ExecuteStoreQuery<Anwis>(sql2).ToList();
                    foreach (var item1 in bll.ExecuteStoreQuery<Anwis>(sql1).ToList())
                    {
                        //var s = list1.Where(p => p.keyName == item1.keyName).FirstOrDefault();
                        Anwis mm = new Anwis();
                        mm.keyName = item1.keyName;
                        mm.Sumplan = item1.Sumplan;
                        //if (s != null)
                        //{
                        //    m.Sumplan = item1.Sumplan - s.Sumplan;
                        //}
                        //else
                        //{
                        //    m.Sumplan = item1.Sumplan;
                        //}
                        list.Add(mm);
                    }
                    //strsql = @"select (SUM(b.[plan])-sum(a.SumUsePower)) as Sumplan,c.category_name as keyName from t_ES_UserUsePowerYearly a inner join t_ES_UsePlan b on a.categoryID=b.categoryID
                    //         left join t_ES_Category c on a.categoryID = c.id group by c.category_name";
                }
                string yAxis = "", series1 = "", xAxis = "";
                decimal dbTotal = 0;

                foreach (var item in list)
                {
                    yAxis += "'" + item.keyName + "',";
                    xAxis += "'" + item.XTime + ";',";
                    series1 += "{\"value\": " + item.Sumplan + ",\"name\": \"" + item.keyName + "\"},";
                    dbTotal += item.Sumplan;
                }


                result = "{\"yAxis\":\"[" + yAxis.TrimEnd(',') + "]\",\"xAxis\":\"" + xAxis.TrimEnd(',') + "\",\"series1\":[" + series1.TrimEnd(',') + "],\"total\":[" + dbTotal.ToString() + "]}";

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return result;
        }



        /// <summary>
        /// 购电量分析
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public JsonResult getPurchaseData_FX()
        {
            string result = "";
            List<zhuxing> lists = new List<zhuxing>();
            string ustr = HomeController.GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");
            try
            {

                string strsql = "select a.quantity as SumCount,a.company as keyName,b.category_name from t_ES_ContractPurchase a inner join t_ES_Category b on a.categoryID=b.id where a.UID IN (" + ustr + ")";

                var list = bll.ExecuteStoreQuery<Anwis>(strsql).ToList();

                var hangyelist = list.Select(p => p.category_name).Distinct().ToList();

                var cpmlist = list.GroupBy(p => p.keyName);
                double dbTotal = 0;

                decimal vals = 0;

                foreach (var hangye in hangyelist)
                {



                    foreach (var item in cpmlist)
                    {
                        vals = 0;
                        zhuxing model = new zhuxing();
                        model.name = hangye;
                        //y轴
                        model.yAxis = item.Key;

                        var ss = item.Where(p => p.category_name == hangye).Count();
                        if (ss != 0)
                        {

                            foreach (var item1 in item.Where(p => p.category_name == hangye))
                            {
                                vals += item1.SumCount;

                            }
                            valdata mo = new valdata();
                            mo.val = vals;
                            model.data.Add(mo);
                        }
                        else
                        {
                            valdata mo = new valdata();
                            mo.val = 0;
                            model.data.Add(mo);
                        }


                        lists.Add(model);

                    }

                }
                //var han = 
                //result = "{\"yAxis\":\"" + yAxis.TrimEnd(',') + "\",\"series1\":\"" + series1.TrimEnd(',') + "\"}";

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return Json(lists.GroupBy(p => p.name));
        }






        /// <summary>
        /// 实际购电量
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public JsonResult getPurchaseData_FXS()
        {
            string ustr = HomeController.GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");
            try
            {
                var startDate = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-01")).AddYears(-1).AddMonths(1);
                var endDate = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-01"));

                var dateList = new List<DateTime>();
                {

                    var currDate = startDate;
                    while (currDate <= endDate)
                    {
                        dateList.Add(currDate);
                        currDate = currDate.AddMonths(1);
                    }
                }

                //var typeoIdList = db.GetTpyeIdList();
                var typeIdList = bll.ExecuteStoreQuery<cateGoryKeyValue>("select id as [Key], category_name as [Value] from t_ES_Category").ToList();

                var dataList = bll.ExecuteStoreQuery<Anwiss>("select a.[plan], a.categoryID, a.create_time from t_ES_UsePlanLog as a WHERE a.create_time BETWEEN '" + startDate.ToString("yyyy-MM-dd") + "' AND '" + endDate.ToString("yyyy-MM-dd") + "' and a.unid IN (" + ustr + ")").ToList();

                var dataDic = new Dictionary<KeyValuePair<int, string>, Dictionary<DateTime, decimal>>();
                foreach (var item in typeIdList)
                {
                    var list = new Dictionary<DateTime, decimal>();
                    foreach (var dateItem in dateList)
                    {
                        list.Add(dateItem, 0);
                    }
                    dataDic.Add(new KeyValuePair<int, string>(item.Key, item.Value), list);
                }


                foreach (var item in dataList)
                {
                    var yz = dataDic.Keys.First(x => x.Key == item.categoryID);
                    var xz = DateTime.Parse(item.create_time.ToString("yyyy-MM-01"));

                    dataDic[yz][xz] += item.plan ?? 0;
                }
                var data = new ArrayList();
                data.AddRange(dataDic.Select(x => new
                {
                    name = x.Key.Value,
                    data = x.Value.Select(o => o.Value),
                    type = "bar",
                    stack = "总量"
                }).ToList());
                var returnData = new
                {
                    xz = dateList.Select(x => x.ToString("yyyy-MM")),
                    yz = typeIdList.Select(x => x.Value),
                    data = data
                };
                return Json(returnData);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    msg = ex.ToString()
                });
            }
        }







        /// <summary>
        /// 购电量分析年度
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public JsonResult getPurchaseDataYear_FX(int pz)
        {
            string result = "";
            List<Yearshoudian> list = new List<Yearshoudian>();
            string ustr = HomeController.GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");
            try
            {
                int year = DateTime.Now.Year;
                string strsql = string.Empty;
                if (pz == 0)
                {
                    strsql = "select sum(a.quantity) as SumCount,avg(a.trade_price) as trade_price,a.month as keyName from t_ES_ContractPurchase a where year=" + year + " and a.UID IN (" + ustr + ") group by a.month";
                }
                else
                {
                    strsql = "select sum(a.quantity) as SumCount,avg(a.trade_price) as trade_price,a.month as keyName from t_ES_ContractPurchase a where year=" + year + " and categoryID=" + pz + " and a.UID IN (" + ustr + ") group by a.month";
                }
                list = bll.ExecuteStoreQuery<Yearshoudian>(strsql).ToList();



            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return Json(list);
        }
        public class Yearshoudian
        {
            public decimal SumCount { get; set; }
            public int keyName { get; set; }
            public decimal? trade_price { get; set; }
        }
        public class Anwis
        {
            public int shuliang { get; set; }
            public decimal Sumplan { get; set; }
            public string keyName { get; set; }
            public decimal SumCount { get; set; }
            public string category_name { get; set; }
            public string XTime { get; set; }
            public int? key { get; set; }
        }
        public class Anwiss
        {
            public decimal? plan { get; set; }
            public int? categoryID { get; set; }
            public DateTime create_time { get; set; }
        }
        public class cateGoryKeyValue
        {
            public int Key { get; set; }
            public string Value { get; set; }
        }
        public class zhuxing
        {
            public zhuxing()
            {
                data = new List<valdata>();

            }
            public string name { get; set; }
            public double da { get; set; }
            public List<valdata> data { get; set; }
            public string yAxis { get; set; }

            public string canName { get; set; }
        }
        public class valdata
        {
            public decimal val { get; set; }
        }


        public ActionResult getPianChaFenPz()
        {
            string result = "";
            List<zhuxing> lists = new List<zhuxing>();
            string ustr = HomeController.GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");
            try
            {
                int y = DateTime.Now.Year;
                string strsql = "select a.quantity as SumCount,a.month as [key],b.category_name from t_ES_ContractPurchase a inner join t_ES_Category b on a.categoryID=b.id where a.UID IN (" + ustr + ") and a.year=" + y + "";

                var list = bll.ExecuteStoreQuery<Anwis>(strsql).ToList();

                var hangyelist = bll.t_ES_Category.OrderBy(p => p.orderNumber).Select(p => p.category_name).ToList();

                var cpmlist = list.GroupBy(p => p.key);
                double dbTotal = 0;

                decimal vals = 0;

                foreach (var hangye in hangyelist)
                {



                    foreach (var item in cpmlist)
                    {
                        vals = 0;
                        zhuxing model = new zhuxing();
                        model.name = hangye;
                        //y轴
                        model.yAxis = item.Key + "月";

                        var ss = item.Where(p => p.category_name == hangye).Count();
                        if (ss != 0)
                        {

                            foreach (var item1 in item.Where(p => p.category_name == hangye))
                            {
                                vals += item1.SumCount;

                            }
                            var mm = bll.t_ES_Category.Where(p => p.category_name == hangye).FirstOrDefault();
                            decimal Sumshoudian = 0;
                            if (mm != null)
                            {
                                Sumshoudian = Convert.ToDecimal(bll.t_ES_ContractUsePlan.Where(p => p.categoryID == mm.id && p.month == item.Key && p.year == y).Sum(p => p.plan));
                            }
                            valdata mo = new valdata();
                            if (Sumshoudian != 0)
                            {
                                mo.val = Math.Round((Sumshoudian - vals) / vals, 2);
                            }
                            else
                            {
                                mo.val = 0;
                            }
                            model.data.Add(mo);
                        }
                        else
                        {
                            valdata mo = new valdata();
                            mo.val = 0;
                            model.data.Add(mo);
                        }


                        lists.Add(model);

                    }

                }
                //var han = 
                //result = "{\"yAxis\":\"" + yAxis.TrimEnd(',') + "\",\"series1\":\"" + series1.TrimEnd(',') + "\"}";

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return Json(lists.GroupBy(p => p.name));
        }
        #endregion

        #region 获取最大需量


        /// <summary>
        /// 客户列表
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult UnitComboDatas(bool isall)
        {
            string ustr = HomeController.GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");
            string sql = "SELECT * FROM t_CM_Unit WHERE UnitID IN(" + ustr + ")";
            List<t_CM_Unit> list = bll.ExecuteStoreQuery<t_CM_Unit>(sql).ToList();
            string strJson = Common.ComboboxToJson(list);
            if (isall)
            {
                strJson = AddShowAll(1, strJson, "UnitID", "UnitName");
            }
            else
                return Content(strJson);
            return Content(strJson);
        }



        /// <summary>
        /// 客户列表
        /// </summary>
        /// <returns></returns>
        [Login]
        public string UnitComboDatas2(string id)
        {
            string sql = "";
            if (id == "0")
            {
                sql = "SELECT * FROM t_CM_Unit ";
            }
            else
            {
                sql = "SELECT * FROM t_CM_Unit WHERE UnitID IN(" + id + ")";
            }
            List<t_CM_Unit> list = bll.ExecuteStoreQuery<t_CM_Unit>(sql).ToList();

            string strJson = Common.ComboboxToJson(list);
            strJson = AddShowAll(1, strJson, "UnitID", "UnitName");
            return strJson;
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="NeedPower">最大需量</param>
        /// <param name="pid">站室ID</param>
        /// <param name="dateend">结束时间</param>
        /// <param name="totaltype">统计类型：Daily,Monthly,Yearly</param>
        /// <param name="datestart">自定义统计：起始时间</param>
        /// <returns></returns>
        public string GetNeedPowerDataMonthly(int cid, int unit, string dateend, int totaltype, string datestart)
        {

            string result = "";
            try
            {
                //int? pid = bll.t_EE_PowerReportConfig.Where(p => p.cid_type == 4).Select(p=>p.pid).FirstOrDefault();
                List<int> pid = bll.t_CM_PDRInfo.Where(p => p.UnitID == unit || unit == 0).Select(p => p.PID).ToList();
                string tablename = "";
                switch (totaltype)
                {
                    case 0:
                        tablename = "Monthly";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 1:
                        tablename = "Yearly";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddMonths(-12).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                }
                string tabname = "t_EE_PowerQuality" + tablename;//t_EE_PowerQuality为通用名称，totaltype为统计类型

                string sqlstr = "select a.RecordTime,sum(a.NeedPower) as NeedPower from " + tabname + " a inner join t_DM_CircuitInfo b on a.CID = b.cid  where 1=1";
                string strsqlm = "", strsqly = "";
                if (!cid.Equals("") && !cid.Equals(0))
                {
                    sqlstr += " and b.cid=" + cid;
                }
                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsqlm = sqlstr + "and RecordTime >='" + Convert.ToDateTime(datestart).AddMonths(-1) + "' and RecordTime <='" + Convert.ToDateTime(dateend).AddMonths(-1) + "'";
                    strsqly = sqlstr + "and RecordTime >='" + Convert.ToDateTime(datestart).AddYears(-1) + "' and RecordTime <='" + Convert.ToDateTime(dateend).AddYears(-1) + "'";
                    sqlstr += " and RecordTime >='" + datestart + "' and RecordTime <='" + dateend + "'";
                }
                int index = 0;
                int inn = 0;
                if (pid != null)
                {
                    foreach (var item in pid)
                    {
                        if (index == 0)
                        {
                            sqlstr += " and(b.pid=" + item;
                        }
                        else
                        {
                            sqlstr += " or b.pid=" + item;
                        }
                        index++;
                        // sqlstr += " or b.pid=" + item;
                    }
                    sqlstr += ")";
                    foreach (var item in pid)
                    {
                        if (inn == 0)
                        {
                            sqlstr += " and(a.pid=" + item;
                        }
                        else
                        {
                            sqlstr += " or a.pid=" + item;
                        }
                        inn++;
                        // sqlstr += " or b.pid=" + item;
                    }
                    sqlstr += ")";

                }
                int ind = 0;
                foreach (var item in pid)
                {
                    //sqlstr = addCidsLimit(4, sqlstr, item,ind);

                    List<t_EE_PowerReportConfig> config = bll.ExecuteStoreQuery<t_EE_PowerReportConfig>("SELECT * FROM t_EE_PowerReportConfig WHERE pid=" + item + " AND cid_type_id=" + 4).ToList();
                    if (config != null && config.Count > 0 && config.First().cid != null && config.First().cid != "")
                    {
                        if (ind == 0)
                        {
                            sqlstr += " AND (b.CID IN (" + config.First().cid + ") ";
                        }
                        else
                        {
                            sqlstr += " or b.CID IN (" + config.First().cid + ") ";
                        }

                        ind++;
                    }
                }

                sqlstr += ")";


                if (cid.Equals("") || cid.Equals(0))
                {
                    sqlstr += "   Group BY RecordTime";
                    strsqlm += " ORDER BY a.CID,RecordTime";
                    strsqly += "  ORDER BY a.CID,RecordTime";
                }


                List<PowerData> list = bll.ExecuteStoreQuery<PowerData>(sqlstr).ToList();
                string xAxis = "", yAxis = "", series1 = "", CName = "", yData = "";

                List<int> litCid = new List<int>();
                List<string> litTime = new List<string>();
                //list1.IndexOf()

                foreach (PowerData mod in list)
                {
                    if (xAxis.Contains(mod.RecordTime.ToString("MM-dd")) == false)
                    {
                        xAxis += mod.RecordTime.ToString("MM-dd") + ",";
                        litTime.Add(mod.RecordTime.ToString("MM-dd"));
                    }
                    if (litCid.Contains(Convert.ToInt32(mod.CID)) == false)
                    {
                        //限制最多10个回路显示
                        if (litCid.Count() > 10)
                            break;

                        CName += "\"" + mod.CName + "\",";
                        litCid.Add(Convert.ToInt32(mod.CID));

                    }
                }

                //Hashtable hashYData = new Hashtable();
                //foreach (string modTime in litTime)
                //{
                //    foreach (int modCid in litCid)
                //    {
                //        List<PowerData> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd").Equals(modTime) && m.CID == modCid).ToList();
                //        string sVal = "";
                //        if (ListTemp.Count > 0)
                //        {
                //            sVal = ListTemp[0].NeedPower.ToString();
                //        }
                //        if (hashYData.Contains(modCid))
                //        {
                //            hashYData[modCid] += "," + sVal;
                //        }
                //        else
                //        {
                //            hashYData.Add(modCid, sVal);
                //        }
                //    }
                //}

                //for (int i = 0; i < litCid.Count; i++)
                //{
                //    if (i < (litCid.Count - 1))
                //    {
                //        yData += hashYData[litCid[i]].ToString().TrimEnd(',') + "\",\"";
                //    }
                //    else
                //    {
                //        yData += hashYData[litCid[i]].ToString().TrimEnd(',');
                //    }
                //}

                for (int i = 0; i < list.Count; i++)
                {
                    if (i < (litCid.Count - 1))
                    {
                        yData += list[i].NeedPower.ToString().TrimEnd(',') + "\",\"";
                    }
                    else
                    {
                        yData += list[i].NeedPower.ToString().TrimEnd(',') + ",";
                    }
                }



                result = "{\"CName\":[" + CName.TrimEnd(',') + "],\"xAxis\":\"" + xAxis.TrimEnd(',') + "\",\"yData\":[\"" + yData.TrimEnd(',') + "\"]}";



            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }

            return result;
        }

        public class PowerData
        {
            public DateTime RecordTime { get; set; }
            public int? CID { get; set; }
            public string CName { get; set; }
            public decimal? NeedPower { get; set; }
            public int InstalledCapacitys { get; set; }
        }

        /// <param name="typecids">回路组类型：1.总用电趋势回路组;2.昨天总用电回路组;3.昨天用电分项排名回路组</param>
        ///0：自动抄表回路组
        ///1：总用电趋势回路组
        ///2：昨天总用电回路组
        ///3：昨天用电分项排名回路组
        //private string addCidsLimit(int cid_type, string strsql, int? pid,int ind)
        //{
        //    List<t_EE_PowerReportConfig> config = bll.ExecuteStoreQuery<t_EE_PowerReportConfig>("SELECT * FROM t_EE_PowerReportConfig WHERE pid=" + pid + " AND cid_type_id=" + cid_type).ToList();
        //    if (config != null && config.Count > 0 && config.First().cid != null && config.First().cid != "")
        //    {
        //        if (ind == 0)
        //        {
        //            strsql += " AND (b.CID IN (" + config.First().cid + ") ";
        //        }else
        //        {
        //            strsql += " or b.CID IN (" + config.First().cid + ") ";

        //        }
        //    } 





        //    return strsql;
        //}
        #endregion

        //获取电表列表；
        [Login]
        public ActionResult EmListData(int pid, string cname, string usertype, int rows, int page)
        {
            try
            {
                //SELECT * FROM t_DM_CircuitInfo WHERE PID=12 AND CName LIKE '%南%' AND UserType LIKE '%商%'

                // string pdrlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                string query = "select * from  t_DM_CircuitInfo where 1=1";
                if (pid > 0)
                    query = query + " and PID=" + pid;
                if (!string.IsNullOrEmpty(cname))
                    query = query + " and CName like '%" + cname + "%'";
                if (!string.IsNullOrEmpty(usertype))
                    query = query + " and UserType like '%" + usertype + "%'";
                List<t_DM_CircuitInfo> list = bll.ExecuteStoreQuery<t_DM_CircuitInfo>(query).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        //保存电表信息
        [Login]
        public ActionResult SaveEm(t_DM_CircuitInfo info)
        {
            string result = "OK";
            try
            {
                //List<t_DM_CircuitInfo> list = bll.t_DM_CircuitInfo.Where(p => p.CName == info.CName && p.UserType == info.UserType && p.ItemType == info.ItemType && p.AreaType == info.AreaType).ToList();
                //if (list.Count > 0)
                //    result = "此电表已存在，请重新录入！ ";
                //else
                if (bll.t_DM_CircuitInfo.Where(r => r.CID == info.CID && r.PID == info.PID && r.ID != info.ID).Count() > 0)
                {
                    result = "回路ID不能重复.";
                }
                else
                {
                    if (info.ID > 0)
                    {
                        t_DM_CircuitInfo circuitInfo = bll.t_DM_CircuitInfo.Where(r => r.ID == info.ID).First();
                        circuitInfo.CName = info.CName;
                        circuitInfo.CID = info.CID;
                        circuitInfo.UserType = info.UserType;
                        circuitInfo.AreaType = info.AreaType;
                        circuitInfo.ItemType = info.ItemType;
                        circuitInfo.MetersID = info.MetersID;
                        circuitInfo.collect_port = info.collect_port;
                        circuitInfo.collect_jzqno = info.collect_jzqno;
                        circuitInfo.collect_gy = info.collect_gy;
                        circuitInfo.collect_baud = info.collect_baud;
                        circuitInfo.collect_cjq = info.collect_cjq;
                        circuitInfo.collect_period = info.collect_period;
                        circuitInfo.MultipleRate = info.MultipleRate;
                        circuitInfo.collect_cld = info.collect_cld;
                        circuitInfo.Label = info.Label;
                        bll.ObjectStateManager.ChangeObjectState(circuitInfo, EntityState.Modified);
                        bll.SaveChanges();
                        Common.InsertLog("电表管理", CurrentUser.UserName, "编辑电表信息[" + circuitInfo.CName + "]");
                        result = "OKedit";
                    }
                    else
                    {
                        bll.t_DM_CircuitInfo.AddObject(info);
                        bll.SaveChanges();
                        Common.InsertLog("点表管理", CurrentUser.UserName, "新增点表信息[" + info.CName + "]");
                        result = "OKadd" + "," + info.CID + "。";
                    }
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return Content(result);
        }
        [Login]
        public ActionResult DeleteEM(string IDS)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(IDS.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_DM_CircuitInfo> Elist = bll.t_DM_CircuitInfo.Where(m => resultlist.Any(a => a == m.ID)).ToList();
                Elist.ForEach(j =>
                {
                    bll.t_DM_CircuitInfo.DeleteObject(j);
                    bll.SaveChanges();
                });

                Common.InsertLog("回路管理", CurrentUser.UserName, "删除回路表信息[" + IDS + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        #region  需量显示相关方法

        public ActionResult GetNeedPowerList(int UnitID)
        {
            string strJson = "";
            //List<t_CM_PDRInfo> config = bll.ExecuteStoreQuery<t_CM_PDRInfo>("select * from t_CM_PDRInfo where UnitID="+UnitID+"").ToList();
            List<int> pid = bll.t_CM_PDRInfo.Where(p => p.UnitID == UnitID).Select(p => p.PID).ToList();

            string sqlstr = @"select distinct(a.RecordTime),a.UsePower,a.NeedPower,a.NeedPowerTime,c.CompanyName from t_EE_PowerQualityYearly a,t_DM_CircuitInfo b,t_CM_PDRInfo c where 1=1 and a.CID = b.cid and a.PID=c.PID";
            int index = 0;
            if (pid != null)
            {
                foreach (var item in pid)
                {
                    if (index == 0)
                    {
                        sqlstr += " and(b.pid=" + item;
                    }
                    else
                    {
                        sqlstr += " or b.pid=" + item;
                    }
                    index++;
                    // sqlstr += " or b.pid=" + item;
                }
                sqlstr += ")";
            }
            int ind = 0;
            foreach (var item in pid)
            {
                //sqlstr = addCidsLimit(4, sqlstr, item,ind);

                List<t_EE_PowerReportConfig> config = bll.ExecuteStoreQuery<t_EE_PowerReportConfig>("SELECT * FROM t_EE_PowerReportConfig WHERE pid=" + item + " AND cid_type_id=" + 4).ToList();
                if (config != null && config.Count > 0 && config.First().cid != null && config.First().cid != "")
                {
                    if (ind == 0)
                    {
                        sqlstr += " AND (b.CID IN (" + config.First().cid + ") ";
                    }
                    else
                    {
                        sqlstr += " or b.CID IN (" + config.First().cid + ") ";
                    }

                    ind++;
                }

            }
            if (ind == 0)
            {
                strJson = "";
                return Content(strJson);
            }
            else
            {
                sqlstr += ")";
            }
            var List = bll.ExecuteStoreQuery<NeedPowerData>(sqlstr).ToList();
            strJson = Common.List2Json(List);
            return Content(strJson);
        }

        public class NeedPowerData
        {
            public string CompanyName { get; set; }
            public DateTime RecordTime { get; set; }
            public decimal UsePower { get; set; }
            public decimal? NeedPower { get; set; }
            public DateTime NeedPowerTime { get; set; }
        }


        #endregion
        #region 能源托管合同相关方法

        //加载合同列表；
        public ActionResult LoadConstractDatas(string CtrName, int rows, int page, int contype = 0)
        {
            try
            {
                List<Constract> list = new List<Constract>();
                string sql = "";
                if (CurrentUser.RoleID == 1)
                    sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID where t_CM_Constract.Type=2 and t_CM_Constract.ConType=" + contype + " ORDER BY createDate DESC,id DESC";
                else
                {
                    string str = "";
                    if (Convert.ToBoolean(CurrentUser.IsAdmin))
                    {
                        var Ulist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).ToList();
                        foreach (var item in Ulist)
                        {
                            if (!string.IsNullOrEmpty(item.UNITList))
                                str += item.UserID + ",";
                        }
                        if (!string.IsNullOrEmpty(str))
                            str = str.Substring(0, str.Length - 1);

                    }
                    else
                    {
                        str = CurrentUser.UserID.ToString();
                    }
                    if (string.IsNullOrEmpty(str))
                    {
                        return Content("");
                    }
                    sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID= t_CM_Unit.UnitID where t_CM_Constract.Type=2 and t_CM_Constract.ConType=" + contype + "and t_CM_Constract.AddUserID IN(" + str + ")  ORDER BY createDate DESC,id DESC";
                }

                list = bll.ExecuteStoreQuery<Constract>(sql).ToList();
                if (!string.IsNullOrEmpty(CtrName))
                {
                    list = list.Where(c => c.CtrName.ToLower().Contains(CtrName.ToLower())).ToList();
                }
                return Content(Common.List2Json(list, rows, page));
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        private static string makeTimesStr(List<CstrOrder> tci)
        {
            string times = "";
            for (int j = 0; j < tci.Count; j++)
            {
                string time = tci[j].PlanDate.ToString();
                if (times.Length > 1)
                    times = times + "<br>" + time.Substring(0, time.IndexOf(' '));
                else
                    times = time.Substring(0, time.IndexOf(' '));
            }
            return times;
        }
        public ActionResult saveConstract(t_CM_Constract info, string str1, string str2, string str3, string str4, string str5, string str6)
        {
            string strJson = "OK";
            try
            {
                t_CM_Constract constract;
                if (info.id > 0)
                {
                    constract = bll.t_CM_Constract.Where(c => c.id == info.id).First();
                    if (constract != null)
                    {
                        constract.id = info.id;
                        constract.CtrName = info.CtrName;
                        constract.CtrCom = CurrentUser.Company;
                        constract.CtrAdmin = info.CtrAdmin;
                        constract.CtrInfo = info.CtrInfo;
                        constract.start_time = info.start_time;
                        constract.end_time = info.end_time;
                        constract.person = info.person;
                        constract.dateFixCount = info.dateFixCount;
                        constract.testFixCount = info.testFixCount;
                        constract.UID = info.UID;
                        constract.Type = 2;
                        constract.ConType = info.ConType;
                        constract.LinkMan = info.LinkMan;
                        constract.Tel = info.Tel;
                        constract.ConNo = info.ConNo;
                        constract.AddUserID = CurrentUser.UserID;
                        bll.ObjectStateManager.ChangeObjectState(constract, EntityState.Modified);
                        bll.SaveChanges();
                        List<t_ES_ContractTemplet> lisrCon = bll.t_ES_ContractTemplet.Where(p => p.conid == info.id && p.IsOk == 0).ToList();
                        lisrCon.ForEach(i =>
                        {
                            bll.t_ES_ContractTemplet.DeleteObject(i);
                        });
                        bll.SaveChanges();
                        addConstractInfo(constract, str1, str2, str3, str4, str5, str6);


                        strJson = "修改完成！";
                    }
                    else
                    {
                        constract = new t_CM_Constract();
                        constract.createDate = DateTime.Now;
                        constract.CtrName = info.CtrName;
                        constract.CtrCom = CurrentUser.Company;
                        constract.CtrAdmin = info.CtrAdmin;
                        constract.CtrInfo = info.CtrInfo;
                        constract.CtrPid = info.CtrPid;
                        constract.start_time = info.start_time;
                        constract.end_time = info.end_time;
                        constract.person = info.person;
                        constract.dateFixCount = info.dateFixCount;
                        constract.testFixCount = info.testFixCount;
                        constract.ConType = info.ConType;
                        constract.LinkMan = info.LinkMan;
                        constract.Type = 2;
                        constract.Tel = info.Tel;
                        constract.ConNo = info.ConNo;
                        constract.AddUserID = CurrentUser.UserID;
                        bll.t_CM_Constract.AddObject(constract);
                        bll.SaveChanges();
                        List<t_CM_Constract> dd = bll.t_CM_Constract.Where(c => c.CtrName == info.CtrName).ToList();
                        addConstractInfo(dd.Last(), str1, str2, str3, str4, str5, str6);
                        strJson = "添加成功！";
                    }
                }
                else
                {
                    constract = new t_CM_Constract();
                    constract.createDate = DateTime.Now;
                    constract.CtrName = info.CtrName;
                    constract.CtrCom = CurrentUser.Company;
                    constract.CtrAdmin = info.CtrAdmin;
                    constract.CtrInfo = info.CtrInfo;
                    constract.CtrPid = info.CtrPid;
                    constract.start_time = info.start_time;
                    constract.end_time = info.end_time;
                    constract.person = info.person;
                    constract.dateFixCount = info.dateFixCount;
                    constract.testFixCount = info.testFixCount;
                    constract.UID = info.UID;
                    constract.ConType = info.ConType;
                    constract.LinkMan = info.LinkMan;
                    constract.Tel = info.Tel;
                    constract.Type = 2;
                    constract.ConNo = info.ConNo;
                    constract.AddUserID = CurrentUser.UserID;
                    bll.t_CM_Constract.AddObject(constract);
                    bll.SaveChanges();
                    List<t_CM_Constract> dd = bll.t_CM_Constract.Where(c => c.CtrName == info.CtrName).ToList();
                    addConstractInfo(dd.Last(), str1, str2, str3, str4, str5, str6);
                    strJson = "添加成功！";
                }
                return Content(strJson);
            }
            catch (Exception e)
            {
                return Content("处理失败！");
            }

        }
        private void addConstractInfo(t_CM_Constract info, string str1, string str2, string str3, string str4, string str5, string str6)
        {
            string[] strArr1 = str1.Split(',');
            string[] strArr2 = str2.Split(',');
            string[] strArr3 = str3.Split(',');
            string[] strArr4 = str4.Split(',');
            string[] strArr5 = str5.Split(',');
            string[] strArr6 = str6.Split(',');
            for (var i = 0; i < strArr1.Length; i++)
            {
                if (strArr6[i] == "未完成")
                {
                    t_ES_ContractTemplet model = new t_ES_ContractTemplet();
                    model.Name = strArr2[i];
                    model.StartTime = Convert.ToDateTime(strArr3[i]);
                    model.IsOk = Convert.ToInt32(strArr6[i]);
                    model.PersonID = Convert.ToInt32(strArr4[i]);
                    model.BeforDay = Convert.ToInt32(strArr5[i]);
                    model.CreatTime = DateTime.Now;
                    model.conid = info.id;
                    bll.t_ES_ContractTemplet.AddObject(model);
                }
            }
            bll.SaveChanges();
        }

        private void addCInfo(t_CM_Constract info, string constractInfo, string orderType, string templateIds, string orderTimes)
        {
            string name = "";
            string value = "";
            if (!string.IsNullOrEmpty(templateIds))
            {
                name = name + "," + "TemplateIds";
                value = value + ",'" + templateIds + "'";
            }
            if (!string.IsNullOrEmpty(orderTimes))
            {
                name = name + "," + "orderTimes";
                value = value + ",'" + orderTimes + "'";
            }
            string sql = "INSERT INTO t_CM_ConstractInfo(constractId,constractInfo,orderType" + name + ") VALUES (" + info.id + ",'" + constractInfo + "','" + orderType + "'" + value + ")";
            bll.ExecuteStoreCommand(sql);
        }

        //编辑合同，加载合同信息；
        public ActionResult LoadConstractInfo(int id)
        {
            //SELECT t_CM_Constract.* ,t_CM_PDRInfo.Name as CtrPName FROM  t_CM_Constract,t_CM_PDRInfo WHERE t_CM_Constract.CtrPid =t_CM_PDRInfo.PID AND t_CM_Constract.id=1
            string strJson = "";
            string sql = "SELECT t_CM_Constract.* ,t_CM_Unit.UnitName as CtrPName FROM  t_CM_Constract left join t_CM_Unit on t_CM_Constract.UID =t_CM_Unit.UnitID where t_CM_Constract.id=" + id;
            Constract listPDRinfo = bll.ExecuteStoreQuery<Constract>(sql).FirstOrDefault();
            List<t_ES_ContractUsePlan> planList = new List<t_ES_ContractUsePlan>();
            List<t_ES_ContractPurchase> urc = new List<t_ES_ContractPurchase>();
            List<Contemp> contemp = new List<Contemp>();
            string sqlVal = "";
            if (listPDRinfo != null)
            {
                if (listPDRinfo.ConType == 1)
                {
                    sqlVal = @"select b.[plan] as val,c.category_name,b.month,b.trade_price as price,b.year from 
                             t_CM_Constract a inner join t_ES_ContractUsePlan b on a.id=b.conid inner join t_ES_Category c on b.categoryID=c.id where b.conid=" + listPDRinfo.id + "";
                    //planList = bll.t_ES_UsePlan.Where(p => p.conid == listPDRinfo.id).OrderBy(p => p.month).ToList();
                }
                else
                {
                    sqlVal = @"select b.quantity as val,c.category_name,b.month,b.month,b.trade_price as price,b.year
                                from t_CM_Constract a inner join t_ES_ContractPurchase b on a.id=b.conid inner join t_ES_Category c on b.categoryID=c.id where b.conid=" + listPDRinfo.id + "";
                    //urc = bll.t_ES_Purchase.Where(p => p.conid == listPDRinfo.id).OrderBy(p => p.month).ToList();
                }
                string st = @"select a.ID, a.Name,a.CompleTime,a.StartTime,a.BeforDay,a.IsOk,a.Remark,a.PersonID,c.UserName from t_ES_ContractTemplet a 
                             inner join t_CM_Constract b on a.conid=b.id inner join t_CM_UserInfo c on a.PersonID=c.UserID where a.conid=" + listPDRinfo.id + "";
                contemp = bll.ExecuteStoreQuery<Contemp>(st).ToList();

            }

            var result = bll.ExecuteStoreQuery<valCon>(sqlVal).ToList();
            return Json(new { listPDRinfo = listPDRinfo, result = result.GroupBy(p => p.category_name), contemp = contemp }, JsonRequestBehavior.AllowGet);
        }

        //确认合同项
        [Login]
        public ActionResult UpdateContrc(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_ES_ContractTemplet> list = bll.t_ES_ContractTemplet.Where(m => resultlist.Contains(m.ID)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    i.IsOk = 1;
                    i.CompleTime = DateTime.Now;
                    bll.ObjectStateManager.ChangeObjectState(i, EntityState.Modified);
                });
                bll.SaveChanges();
                Common.InsertLog("确认合同项", CurrentUser.UserName, "确认成功[用户ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        public class valCon
        {
            public int? month { get; set; }
            public decimal? val { get; set; }
            public string category_name { get; set; }
            public decimal? price { get; set; }
            public int? year { get; set; }
        }
        public class Contemp
        {
            public int ID { get; set; }
            public string Name { get; set; }
            public DateTime? StartTime { get; set; }
            public int? BeforDay { get; set; }
            public string Remark { get; set; }
            public int? PersonID { get; set; }
            public string UserName { get; set; }
            public int? IsOk { get; set; }
            public DateTime? CompleTime { get; set; }
        }
        public ActionResult DeleteConstract(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_Constract> list = bll.t_CM_Constract.Where(m => resultlist.Contains(m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.DeleteObject(i);
                    bll.t_ES_ContractTemplet.Where(p => p.conid == i.id).ToList().ForEach(index =>
                    {
                        bll.DeleteObject(index);
                    });
                });
                bll.SaveChanges();
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }

        /// <summary>
        /// 根据用户获取每个月计划用电
        /// </summary>
        /// <param name="unit"></param>
        /// <returns></returns>
        public ActionResult GetPlanByMonth(int id)
        {
            List<t_ES_UsePlan> list = new List<t_ES_UsePlan>();
            using (pdermsWebEntities bll = new pdermsWebEntities())
            {
                //t_CM_Constract m=bll.t_CM_Constract.Where(p=>p.)

            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public bool IsAlarm(int id)
        {
            bool flag = false;
            List<t_ES_ContractTemplet> list = bll.t_ES_ContractTemplet.Where(p => p.conid == id && p.IsOk == 0).ToList();
            foreach (var item in list)
            {
                if (item.StartTime <= DateTime.Now.AddDays(Convert.ToDouble(item.BeforDay)))
                {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
        [Login]
        public ActionResult SavePurchase1(t_ES_ContractPurchase purchase, string planstr, string dianjiastr)
        {
            string result = "OK";
            {
                if (purchase.id < 1)
                {

                    string[] planarr = planstr.Split(',');
                    string[] dianjiarr = dianjiastr.Split(',');
                    for (var i = 0; i < planarr.Length; i++)
                    {
                        t_ES_ContractPurchase plan = new t_ES_ContractPurchase();
                        plan.CreateTime = DateTime.Now;
                        plan.categoryID = purchase.categoryID;
                        plan.company = purchase.company;
                        plan.month = i + 1;
                        plan.year = purchase.year;
                        if (planarr[i] != "")
                        {
                            plan.quantity = Convert.ToDecimal(planarr[i]);
                        }
                        else
                        {
                            plan.quantity = 0;
                        }
                        if (dianjiarr[i] != "")
                        {
                            plan.trade_price = Convert.ToDecimal(dianjiarr[i]);
                        }
                        else
                        {
                            plan.trade_price = 0;
                        }
                        plan.conid = purchase.conid;
                        plan.UID = CurrentUser.UID;
                        //userPlan.month = i + 1;
                        //userPlan.remark = JsonHelper.ToJsonString(userPlan.remark);
                        //userPlan.create_time = DateTime.Now;
                        //userPlan.daily_average = GetDaysInMonth(userPlan.year, userPlan.month, userPlan.plan);

                        //plan = userPlan;
                        bll.t_ES_ContractPurchase.AddObject(plan);
                    }

                    bll.SaveChanges();


                    //bll.t_ES_Purchase.AddObject(purchase);
                    //bll.SaveChanges();
                    Common.InsertLog("购电量记录", CurrentUser.UserName, "购电量[ID:" + purchase.id + "]");
                }
                else
                {
                    t_ES_ContractPurchase purchaseinfo = bll.t_ES_ContractPurchase.Where(r => r.id == purchase.id).First();
                    purchaseinfo.categoryID = purchase.categoryID;
                    purchaseinfo.company = purchase.company;
                    purchaseinfo.quantity = purchase.quantity;
                    purchaseinfo.UID = purchase.UID;
                    bll.ObjectStateManager.ChangeObjectState(purchaseinfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("购电量记录", CurrentUser.UserName, "购电量[ID:" + purchase.id + "]");
                }

                return Content(result);
            }
        }

        /// <summary>
        /// 添加(编辑)计划用电
        /// </summary>
        /// <param name="userPlan"></param>
        /// <returns></returns>
        [Login]
        public ActionResult Save1(t_ES_ContractUsePlan userPlan, string planstr, string dianjiastr, string wdianjiastr)
        {
            string result = "OK";
            {
                if (userPlan.id < 1)
                {

                    string[] planarr = planstr.Split(',');
                    string[] dianjiarr = dianjiastr.Split(',');
                    string[] wstr = wdianjiastr.Split(',');
                    for (var i = 0; i < planarr.Length; i++)
                    {
                        t_ES_ContractUsePlan plan = new t_ES_ContractUsePlan();
                        plan.categoryID = userPlan.categoryID;
                        plan.create_time = DateTime.Now;

                        plan.month = i + 1;
                        plan.year = userPlan.year;
                        plan.remark = JsonHelper.ToJsonString(userPlan.remark);
                        plan.unid = userPlan.unid;
                        if (planarr[i] != "")
                        {
                            plan.plan = Convert.ToDecimal(planarr[i]);
                        }
                        else
                        {
                            plan.plan = 0;
                        }
                        if (dianjiarr[i] != "")
                        {
                            plan.trade_price = Convert.ToDecimal(dianjiarr[i]);
                        }
                        else
                        {
                            plan.trade_price = 0;
                        }
                        if (wstr[i] != "")
                        {
                            plan.extraTradePrice = Convert.ToDecimal(wstr[i]);
                        }
                        else
                        {
                            plan.extraTradePrice = 0;
                        }
                        plan.conid = userPlan.conid;
                        plan.daily_average = GetDaysInMonth(plan.year, plan.month, plan.plan);
                        //userPlan.month = i + 1;
                        //userPlan.remark = JsonHelper.ToJsonString(userPlan.remark);
                        //userPlan.create_time = DateTime.Now;
                        //userPlan.daily_average = GetDaysInMonth(userPlan.year, userPlan.month, userPlan.plan);

                        //plan = userPlan;
                        bll.t_ES_ContractUsePlan.AddObject(plan);
                    }

                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + userPlan.id + "]");
                }
                else
                {
                    t_ES_ContractUsePlan userPlaninfo = bll.t_ES_ContractUsePlan.Where(r => r.id == userPlan.id).First();
                    userPlaninfo.month = userPlan.month;
                    userPlaninfo.year = userPlan.year;
                    userPlaninfo.unid = userPlan.unid;
                    userPlaninfo.categoryID = userPlan.categoryID;
                    userPlaninfo.plan = userPlan.plan;
                    userPlaninfo.daily_average = GetDaysInMonth(userPlan.year, userPlan.month, userPlan.plan);
                    userPlaninfo.remark = JsonHelper.ToJsonString(userPlan.remark);
                    bll.ObjectStateManager.ChangeObjectState(userPlaninfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + userPlan.id + "]");
                }

                return Content(result);
            }
        }
        #endregion

        #region 公式编辑模块

        [Login]
        public ActionResult GetGs(int rows, int page, int pdf)
        {

            string strsql = @"SELECT a.id,a.pid,a.cid,a.cid_type_id,c.cid_type_name,a.subtractCid, b.Name from t_EE_PowerReportConfig a INNER JOIN t_CM_PDRInfo b on a.pid=b.PID
                             inner join t_EE_PowerConfigInfo c on a.cid_type_id=c.cid_type_id where 1=1";

            if (pdf != 0)
            {
                strsql += " and a.pid=" + pdf.ToString() + " ";
            }

            var Blist = bll.ExecuteStoreQuery<GsView>(strsql).OrderByDescending(p => p.pid).ToList();
            List<GsView> list = new List<GsView>();
            foreach (var item in Blist)
            {

                List<int> intList = new List<int>();
                if (item.cid != null)
                {
                    foreach (var item1 in item.cid.Split(','))
                    {
                        intList.Add(Convert.ToInt32(item1));
                    }
                    foreach (var item2 in bll.t_DM_CircuitInfo.Where(p => intList.Contains(p.CID) && p.PID == item.pid).Select(p => p.CName).ToList())
                    {
                        item.jiashu += item2 + "、";
                    }
                    item.jiashu = item.jiashu.Substring(0, item.jiashu.Length - 1);
                }
                List<int> intList1 = new List<int>();
                if (item.subtractCid != null)
                {
                    foreach (var item1 in item.subtractCid.Split(','))
                    {
                        intList1.Add(Convert.ToInt32(item1));
                    }
                    foreach (var item2 in bll.t_DM_CircuitInfo.Where(p => intList1.Contains(p.CID) && p.PID == item.pid).Select(p => p.CName).ToList())
                    {
                        item.jianshu += item2 + "、";
                    }
                    item.jianshu = item.jianshu.Substring(0, item.jianshu.Length - 1);
                }

                if (item.isUpload == 1)
                {
                    item.remarks = "是";
                }else
                {
                    item.remarks = "否";
                }
                list.Add(item);
            }

            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }
        //cid列表
        [Login]
        public ActionResult CIDComboData(int pid)
        {
            List<t_DM_CircuitInfo> list = bll.t_DM_CircuitInfo.Where(p => p.PID == pid).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
        //cid列表
        [Login]
        public ActionResult GsNameComboData()
        {
            List<t_EE_PowerConfigInfo> list = bll.t_EE_PowerConfigInfo.ToList();
            string strJson = Common.ComboboxToJson(list);
            //strJson = AddShowAll(0, strJson, "cid_type_id", "cid_type_name");
            return Content(strJson);
        }
        public class GsView
        {
            public int? id { get; set; }
            public int? pid { get; set; }
            public string cid { get; set; }
            public int? cid_type_id { get; set; }
            public string cid_type_name { get; set; }
            public string subtractCid { get; set; }
            public string name { get; set; }
            public string jiashu { get; set; }
            public string jianshu { get; set; }
            public int? isUpload { get; set; }
            public string remarks { get; set; }
        }
        [Login]
        public ActionResult SaveGs(t_EE_PowerReportConfig model)
        {
            string result = "OK";
            {
                if (model.id < 1)
                {
                    bll.t_EE_PowerReportConfig.AddObject(model);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + model.id + "]");
                }
                else
                {
                    t_EE_PowerReportConfig info = bll.t_EE_PowerReportConfig.Where(r => r.id == model.id).First();
                    info.pid = model.pid;
                    info.cid = model.cid;
                    info.subtractCid = model.subtractCid;
                    //info.cid_type_name = model.cid_type_name;
                    info.did = model.did;
                    info.cid_type_id = model.cid_type_id;
                    //info.isUpload = model.isUpload;
                    //info.cid_type = model.cid_type;
                    bll.ObjectStateManager.ChangeObjectState(info, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + model.id + "]");
                }

                return Content(result);
            }
        }
        public ActionResult  SaveisJisuan(int pid,int isUpload)
        {
            string result = "保存成功";
            try
            {
                var re = bll.t_CM_PDRInfo.Where(p => p.PID == pid).FirstOrDefault();
                re.isUpload = isUpload;
                bll.SaveChanges();
            }catch(Exception e)
            {
                result = "保存失败，请联系管理员";
            }
            return Content(result);
        }
        public ActionResult GetJisuan(int pid)
        {
            int? result =0;
            try
            {
                var re = bll.t_CM_PDRInfo.Where(p => p.PID == pid).FirstOrDefault();
                if (re != null)
                {
                    result = re.isUpload;
                }
            }
            catch (Exception e)
            {
                result = 0;
            }
            return Content(result.ToString());
        }
        //删除
        [Login]
        public ActionResult DeleteGs(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_EE_PowerReportConfig> list = bll.t_EE_PowerReportConfig.Where(m => resultlist.Contains(m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.t_EE_PowerReportConfig.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("公式编辑", CurrentUser.UserName, "删除公式[公式ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        #endregion


        #region 站监测项管理

        [Login]
        public ActionResult GetStationTemp(int rows, int page, int pdf)
        {

            string strsql = @"select a.id,a.pid,a.contentId,b.TypeName,b.score,c.Name  from t_CM_InstallRecord a INNER JOIN t_CM_InstallType b 
                              on a.contentId=b.id inner join t_CM_PDRInfo c on a.pid=c.pid where 1=1";

            if (pdf != 0)
            {
                strsql += " and a.pid=" + pdf.ToString() + " ";
            }

            var list = bll.ExecuteStoreQuery<StationView>(strsql).OrderByDescending(p => p.pid).ToList();


            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }

        public class StationView
        {
            public int? id { get; set; }
            public int? pid { get; set; }
            public int? contentId { get; set; }
            public string TypeName { get; set; }
            public int? score { get; set; }
            public string Name { get; set; }
        }
        [Login]
        public ActionResult SaveStation(t_CM_InstallRecord model)
        {
            string result = "OK";
            {
                if (model.id < 1)
                {
                    bll.t_CM_InstallRecord.AddObject(model);
                    bll.SaveChanges();
                    Common.InsertLog("站监测项管理", CurrentUser.UserName, "站监测项[ID:" + model.id + "]");
                }
                else
                {
                    t_CM_InstallRecord info = bll.t_CM_InstallRecord.Where(r => r.id == model.id).First();
                    info.pid = model.pid;
                    info.contentId = model.contentId;
                    bll.ObjectStateManager.ChangeObjectState(info, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("站监测项管理", CurrentUser.UserName, "站监测项[ID:" + model.id + "]");
                }

                return Content(result);
            }
        }
        //删除
        [Login]
        public ActionResult DeleteStation(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_InstallRecord> list = bll.t_CM_InstallRecord.Where(m => resultlist.Contains(m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.t_CM_InstallRecord.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("站监测项管理", CurrentUser.UserName, "删除站监测项[ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }


        /// <summary>
        /// 站项
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult PDFtempComboData(bool isall)
        {
            List<t_CM_InstallType> list = bll.t_CM_InstallType.ToList();
            string strJson = Common.ComboboxToJson(list);
            if (isall)
            {
                strJson = AddShowAll(1, strJson, "id", "TypeName");
            }
            return Content(strJson);
        }
        #endregion

        #region 售电辅助决策
        public ActionResult getJueCeData_FX(int type, int uid, int pz)
        {
            string result = "";
            List<FuZhuChart> soure = new List<FuZhuChart>();
            string m = string.Empty;
            string time = DateTime.Now.ToString("yyyy-MM-dd");
            DateTime dt = DateTime.Now;
            FuZhuChart model = new FuZhuChart();
            List<Anwis> goudian = new List<Anwis>();

            string d;
            string y;
            string dd;
            string chaobiao = "";
            string sql = "";
            string sql1 = "";
            string ustr = HomeController.GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");
            try
            {
                if (type == 1)
                {
                    List<int?> uids = bll.t_ES_UserUsePowerMonthly.Where(p => p.RecordTime <= dt).Select(p => p.UID).Distinct().ToList();
                    t_CM_PDRInfo chaobiaomodel = bll.t_CM_PDRInfo.Where(p => uids.Contains(p.UnitID)).OrderBy(p => p.CBPeriodBegin).FirstOrDefault();
                    if (chaobiaomodel != null)
                        chaobiao = chaobiaomodel.CBPeriodBegin.ToString();
                    if (string.IsNullOrEmpty(chaobiao))
                        chaobiao = "1";

                    m = DateTime.Now.AddDays(-30).Month.ToString();
                    y = DateTime.Now.AddDays(-30).Year.ToString();
                    d = Convert.ToDateTime(y + "-" + m + "-" + chaobiao).ToString("yyyy-MM-dd");
                    dd = Convert.ToDateTime(DateTime.Now.Month.ToString() + "-" + DateTime.Now.Year.ToString() + "-" + chaobiao).ToString("yyyy-MM-dd");
                }
                else
                {
                    List<int?> uids = bll.t_ES_UserUsePowerMonthly.Where(p => p.RecordTime <= dt).Select(p => p.UID).Distinct().ToList();
                    t_CM_PDRInfo chaobiaomodel = bll.t_CM_PDRInfo.Where(p => uids.Contains(p.UnitID)).OrderBy(p => p.CBPeriodBegin).FirstOrDefault();
                    if (chaobiaomodel != null)
                        chaobiao = chaobiaomodel.CBPeriodBegin.ToString();
                    if (string.IsNullOrEmpty(chaobiao))
                        chaobiao = "1";

                    y = DateTime.Now.Year.ToString();
                    m = DateTime.Now.Month.ToString();
                    d = Convert.ToDateTime(y + "-" + m + "-" + (Convert.ToInt32(chaobiao) + 1).ToString()).ToString("yyyy-MM-dd");
                    dd = DateTime.Now.ToString("yyyy-MM-dd");
                }

                int days = DateTime.DaysInMonth(Convert.ToInt32(y), Convert.ToInt32(m));
                sql1 = "select( sum(quantity)/" + days + ") as Sumplan from t_ES_Purchase where month=" + m + " and  categoryID=" + pz + " and UID in (" + ustr + ") group by month";
                if (uid == 0)
                {
                    sql = @"select SUM(UsePower) as UsePower, SUM(PlanUsePower) as PlanUsePower,
                       SUM(DeviationRate) as DeviationRate, SUM(SumUsePower) as SumUsePower, SUM(SumPlanUsePower) as SumPlanUsePower, SUM(AllDeviationRate) as AllDeviationRate,sum(CompletionRate) as CompletionRate, RecordTime
                       from t_ES_UserUsePowerMonthly a where a.UID IN (" + ustr + ") AND a.categoryID=" + pz + " and a.RecordTime >= '" + d + "' and  a.RecordTime <= '" + dd + "' group by a.RecordTime";


                }
                else
                {
                    sql = @"select SUM(UsePower) as UsePower, SUM(PlanUsePower) as PlanUsePower,
                       SUM(DeviationRate) as DeviationRate, SUM(SumUsePower) as SumUsePower, SUM(SumPlanUsePower) as SumPlanUsePower, SUM(AllDeviationRate) as AllDeviationRate,sum(CompletionRate) as CompletionRate, RecordTime
                       from t_ES_UserUsePowerMonthly a where a.UID in (" + ustr + ") and a.UID=" + uid + " and a.categoryID=" + pz + " and a.RecordTime >= '" + d + "' and a.RecordTime <= '" + dd + "' group by a.RecordTime";
                }


                goudian = bll.ExecuteStoreQuery<Anwis>(sql1).ToList();
                soure = bll.ExecuteStoreQuery<FuZhuChart>(sql).ToList();
                // soure = bll.t_ES_UserUsePowerMonthly.Where(p => p.RecordTime >= d && p.RecordTime <= dt).ToList();
                model = soure.OrderByDescending(p => p.RecordTime).FirstOrDefault();

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return Json(new { soure = soure, month = Convert.ToInt32(m) + 1, table = model, goudian = goudian });
        }
        public class FuZhuChart
        {
            public decimal UsePower { get; set; }
            public decimal PlanUsePower { get; set; }
            public decimal DeviationRate { get; set; }
            public decimal SumUsePower { get; set; }
            public decimal SumPlanUsePower { get; set; }
            public decimal AllDeviationRate { get; set; }
            public decimal CompletionRate { get; set; }
            public DateTime RecordTime { get; set; }
        }

        public JsonResult GetUnitPlan()
        {
            string ustr = HomeController.GetUID();
            if (string.IsNullOrEmpty(ustr))
                return Json("");
            int m = DateTime.Now.Month;
            string sql = "select a.UnitID,a.change_remark,b.UnitName from t_ES_UsePlanChange a inner join t_CM_Unit b on a.UnitID=b.UnitID where a.month=" + m + " AND a.UnitID IN (" + ustr + ") ";
            var r = bll.ExecuteStoreQuery<UnitPlan>(sql).ToList();
            var reslut = r.GroupBy(p => p.UnitName);
            return Json(reslut);
        }
        public class UnitPlan
        {
            public int UnitID { get; set; }
            public string change_remark { get; set; }
            public string UnitName { get; set; }
        }
        #endregion

        #region 品种维护
        //删除
        [Login]
        public ActionResult DeletePz(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_ES_Category> list = bll.t_ES_Category.Where(m => resultlist.Contains(m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.t_ES_Category.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("品种维护", CurrentUser.UserName, "删除品种记录[用户ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        /// <summary>
        /// 添加(编辑)计划用电
        /// </summary>
        /// <param name="userPlan"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SavePz(t_ES_Category model)
        {
            string result = "OK";
            {
                if (model.id < 1)
                {
                    bll.t_ES_Category.AddObject(model);
                    bll.SaveChanges();
                    Common.InsertLog("品种维护", CurrentUser.UserName, "品种[ID:" + model.id + "]");
                }
                else
                {
                    t_ES_Category m = bll.t_ES_Category.Where(r => r.id == model.id).FirstOrDefault();
                    m.category_name = model.category_name;
                    m.orderNumber = model.orderNumber;
                    bll.ObjectStateManager.ChangeObjectState(m, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("品种维护", CurrentUser.UserName, "品种[ID:" + model.id + "]");
                }

                return Content(result);
            }
        }
        public ActionResult GetPzList(int rows, int page)
        {
            try
            {
                List<t_ES_Category> list = bll.t_ES_Category.OrderBy(p => p.orderNumber).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                return Json("");
            }
        }
        #endregion


        #region 年度计划用电量录入相关方法
        /// <summary>
        /// 加载年度计划用电
        /// </summary>
        /// <param name="rows"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [Login]
        public ActionResult GetUserPlanLogList(int rows, int page, int pz, int unit, int year, int mon = 0, int wx = 0)
        {
            string ustr = HomeController.GetUID();

            if (string.IsNullOrEmpty(ustr))
                return Content("");
            string strsql = @"select a.id, a.year,a.month,a.[plan],a.readed,a.trade_price,b.category_name,a.extraTradePrice,b.id as categoryID,c.UnitID as unid,a.create_time,a.remark,
                            a.daily_average,c.UnitName as Name from t_ES_UsePlanLog a inner join
                            t_ES_Category b on a.categoryID=b.id inner join
                            t_CM_Unit c on a.unid=c.UnitID where a.unid in (" + ustr + ")";
            if (pz != 0)
            {
                strsql += " and b.id = " + pz.ToString() + " ";
            }
            if (unit != 0)
            {
                strsql += " and c.UnitID=" + unit.ToString() + " ";
            }
            if (year != 0)
            {
                strsql += " and a.year=" + year.ToString() + " ";
            }
            if (mon != 0)
            {
                if (wx == 1) strsql += " and a.month>=" + mon + " and a.month<=" + (mon + 1);
                else strsql += " and a.month=" + mon + " ";
            }
            string[] fot = { "plan" };
            var Blist = bll.ExecuteStoreQuery<UserPlanView>(strsql).OrderByDescending(p => p.create_time).ToList();
            string strJson = Common.List2Json(Blist, rows, page, fot);
            return Content(strJson);
        }


        /// <summary>
        /// 添加(编辑)计划用电
        /// </summary>
        /// <param name="userPlan"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SaveLOG(t_ES_UsePlanLog userPlan)
        {
            string result = "OK";
            {
                if (userPlan.id < 1)
                {
                    userPlan.remark = JsonHelper.ToJsonString(userPlan.remark);
                    userPlan.create_time = DateTime.Now;
                    userPlan.daily_average = GetDaysInMonth(userPlan.year, userPlan.month, userPlan.plan);
                    bll.t_ES_UsePlanLog.AddObject(userPlan);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + userPlan.id + "]");

                }
                else
                {
                    t_ES_UsePlanLog userPlaninfo = bll.t_ES_UsePlanLog.Where(r => r.id == userPlan.id).First();
                    userPlaninfo.month = userPlan.month;
                    userPlaninfo.year = userPlan.year;
                    userPlaninfo.unid = userPlan.unid;
                    userPlaninfo.categoryID = userPlan.categoryID;
                    userPlaninfo.plan = userPlan.plan;
                    userPlaninfo.trade_price = userPlan.trade_price;
                    userPlaninfo.extraTradePrice = userPlan.extraTradePrice;
                    userPlaninfo.daily_average = GetDaysInMonth(userPlan.year, userPlan.month, userPlan.plan);
                    userPlaninfo.remark = JsonHelper.ToJsonString(userPlan.remark);
                    bll.ObjectStateManager.ChangeObjectState(userPlaninfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("年度计划用电", CurrentUser.UserName, "年度计划用电[ID:" + userPlan.id + "]");
                }
                return Content(result);
            }
        }


        //删除
        [Login]
        public ActionResult DeleteUserPlanLog(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_ES_UsePlanLog> list = bll.t_ES_UsePlanLog.Where(m => resultlist.Contains(m.id)).ToList();
                int count = 0;
                list.ForEach(i =>
                {
                    bll.t_ES_UsePlanLog.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("电力交易", CurrentUser.UserName, "删除计划[用户ID:" + id + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }

        #endregion
    }
}
