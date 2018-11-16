using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Data.Objects;
using System.Data.Objects.SqlClient;
using System.Data.SqlClient;
using S5001Web.PubClass;

namespace S5001Web.Controllers
{
    /// <summary>
    /// 供应商管理
    /// </summary>
    public class SupplierManageController : Controller
    {
        pdermsWebEntities bll = new pdermsWebEntities();

        LoginAttribute loginbll = new LoginAttribute();

        /// <summary>
        /// 当前属性
        /// </summary>
        private t_CM_UserInfo CurrentUser
        {
            get
            {
                return loginbll.CurrentUser;
            }
        }

        /// <summary>
        /// 供应商列表
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult SupplierList()
        {
            return View();
        }

        /// <summary>
        /// 供应商编辑
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult SupplierEdits()
        {
            return View();
        }

        /// <summary>
        /// 日常营业
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult DailyBusiness()
        {
            return View();
        }

        /// <summary>
        /// 缴费页面
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult PayTheFees()
        {
            return View();
        }

        /// <summary>
        /// 追补售电
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult MakeUpPower()
        {
            return View();
        }

        /// <summary>
        /// 注销售电
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult LogOutPower()
        {
            return View();
        }

        /// <summary>
        /// 电量找补
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult EleMake()
        {
            return View();
        }

        /// <summary>
        /// 销户
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult AccountCancellation()
        {
            return View();
        }

        /// <summary>
        /// 费用结算
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult CostClose()
        {
            return View();
        }

        /// <summary>
        /// 统计分析
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult StatisticAnalysis()
        {
            return View();
        }

        /// <summary>
        /// 住户用量查询
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult UserEleInfo()
        {
            return View();
        }

        /// <summary>
        /// 住户缴费查询
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult UserPayTheFees()
        {
            return View();
        }

        /// <summary>
        /// 抄表明细查询
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult MeterReading()
        {
            return View();
        }

        /// <summary>
        /// 住户欠费查询
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult UserArrearage()
        {
            return View();
        }

        /// <summary>
        /// 账户收支查询
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult IncomeExpenses()
        {
            return View();
        }

        /// <summary>
        /// 图表统计分析
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult ChartStatistic()
        {
            return View();
        }

        /// <summary>
        /// 找补电量记录查询
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult ChangeLog()
        {
            return View();
        }

        /// <summary>
        /// 异常预警记录查询
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult EarlyWarningLog()
        {
            return View();
        }

        /// <summary>
        /// 营业员收费统计
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult AssistantCharge()
        {
            return View();
        }

        /// <summary>
        /// 档案管理
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult Archives()
        {
            return View();
        }

        /// <summary>
        /// 终端档案
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult TerminalFile()
        {
            return View();
        }

        /// <summary>
        /// 表计档案
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult MeterFile()
        {
            return View();
        }

        /// <summary>
        /// 住户档案
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult UserFile()
        {
            return View();
        }

        /// <summary>
        /// 数据采集
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult DataCollection()
        {
            return View();
        }

        /// <summary>
        /// 远程抄电表
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult DistanceMeterReading()
        {
            return View();
        }

        /// <summary>
        /// 抄表数据录入
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult MeterReadingData()
        {
            return View();
        }

        /// <summary>
        /// 抄表数据批量导入
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult MeterReadings()
        {
            return View();
        }

        /// <summary>
        /// 手持终端上传
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult HandTerminalUpload()
        {
            return View();
        }

            
        /// <summary>
        /// 获取供应商列表
        /// </summary>
        /// <param name="rows"></param>
        /// <param name="page"></param>
        /// <param name="DeviceName"></param>
        /// <param name="MFactory"></param>
        /// <param name="pid"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SupplierInfoData(int rows, int page, string SupplierName = "", string Contacter = "", string MobilePhone = "", int pid = 0)
        {
            List<t_CM_SupplierInfo> list = null;
            if (pid == 0)
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                List<int> resultlist = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));

                string strsql = "select *  from t_CM_SupplierInfo where 1=1 ";
                if (!SupplierName.Equals(""))
                {
                    strsql += string.Format(" and SupplierName like '%{0}%'", SupplierName);
                }

                if (!Contacter.Equals(""))
                {
                    strsql += string.Format(" and Contacter like '%{0}%'", Contacter);
                }

                if (!MobilePhone.Equals(""))
                {
                    strsql += string.Format(" and MobilePhone like '%{0}%'", MobilePhone);
                }
                strsql += " order by SupplierID ";

                list = bll.ExecuteStoreQuery<t_CM_SupplierInfo>(strsql).ToList();
            }

            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }

        /// <summary>
        /// 供应商详细信息
        /// </summary>
        /// <param name="did"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SupplierInfoDetail(int supplierid)
        {
            string strJson = "";
            List<t_CM_SupplierInfo> list = bll.t_CM_SupplierInfo.Where(d => d.SupplierID == supplierid).ToList();
            if (list.Count > 0)
            {
                t_CM_SupplierInfo info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }

        /// <summary>
        /// 保存供应商信息
        /// </summary>
        /// <param name="supplier"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SaveSupplierInfo(t_CM_SupplierInfo supplier)
        {
            string result = "0";
            try
            {
                List<t_CM_SupplierInfo> list = bll.t_CM_SupplierInfo.Where(d => (d.SupplierCode == supplier.SupplierCode || d.SupplierName == supplier.SupplierName) && d.SupplierID != supplier.SupplierID).ToList();
                if (list.Count > 0)
                    result = "此供应商名称或编码已存在，请重新录入！";
                else
                {
                    //编辑
                    if (supplier.SupplierID > 0)
                    {
                        t_CM_SupplierInfo info = bll.t_CM_SupplierInfo.Where(d => d.SupplierID == supplier.SupplierID).First();
                        info.SupplierID = supplier.SupplierID;
                        info.SupplierCode = supplier.SupplierCode;
                        info.SupplierName = supplier.SupplierName;
                        info.Contacter = supplier.Contacter;
                        info.MobilePhone = supplier.MobilePhone;
                        info.Telephone = supplier.Telephone;
                        info.SupplierAddress = supplier.SupplierAddress;
                        info.UseState = supplier.UseState;
                        if (supplier.Remarks != null)
                        {
                            info.Remarks = supplier.Remarks.Replace("\n", "<br>");
                        }
                        else
                        {
                            info.Remarks = supplier.Remarks;
                        }

                        bll.ObjectStateManager.ChangeObjectState(info, EntityState.Modified);
                        bll.SaveChanges();
                        result = "ok1";
                        Common.InsertLog("供应商管理", CurrentUser.UserName, "编辑供应商信息[" + info.SupplierName + "(" + info.SupplierCode + ")_" + info.SupplierID + "]");
                    }
                    else
                    {
                        //新增
                        if (supplier.Remarks != null)
                        {
                            supplier.Remarks = supplier.Remarks.Replace("\n", "<br>");
                        }
                        else
                        {
                            supplier.Remarks = supplier.Remarks;
                        }

                        bll.t_CM_SupplierInfo.AddObject(supplier);
                        bll.SaveChanges();

                        result = "ok2";
                        Common.InsertLog("供应商管理", CurrentUser.UserName, "新增供应商信息[" + supplier.SupplierName + "(" + supplier.SupplierCode + ")]");
                    }
                }

                return Content(result);
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }

        /// <summary>
        /// 删除供应商信息
        /// </summary>
        /// <param name="did"></param>
        /// <returns></returns>
        [Login]
        public ActionResult DeleteSupplierInfo(string supplierid)
        {
            string result = "OK";
            try
            {
                string strsql = "delete  from t_CM_SupplierInfo  where supplierid in (" + supplierid + ")";
                bll.ExecuteStoreCommand(strsql, null);
                Common.InsertLog("供应商管理", CurrentUser.UserName, "删除供应商信息[" + supplierid + "]");
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult BindSupplierInfo()
        {
            List<t_CM_SupplierInfo> list = bll.t_CM_SupplierInfo.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
    }
}
