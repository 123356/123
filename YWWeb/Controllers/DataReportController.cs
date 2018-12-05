using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;
using System.Text;
//using System.Data.Objects;
//using System.Data.Objects.SqlClient;
using System.Data.SqlClient;
using YWWeb.PubClass;
using DAL;
using IDAO.Models;
using System.Reflection;

namespace YWWeb.Controllers
{
    public class DataReportController : Controller
    {
        //数据报表
        // GET: /DataReport/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        [Login]
        public ActionResult HistoryData()
        {
            return View();
        }
        [Login]
        public ActionResult GraphData()
        {
            return View();
        }
        [Login]
        public ActionResult GraphWindow()
        {
            return View();
        }
        [Login]
        public ActionResult DiffGraph()
        {
            return View();
        }
        [Login]
        public ActionResult GraphWindowDetail()
        {
            return View();
        }
        //历史数据查询
        //[Login]
        public ActionResult HisData(int rows, int page, int pid = 0, int CID = 0, string dname = "", string cname = "", string startdate = "", string enddate = "", string typename = "", string sort = "记录时间", string order = "asc")
        {
            string strJson = "{\"total\":0,\"rows\":[]}";
            int rowcount;
            int nDataType = ("" == typename) ? 0 : Convert.ToInt32(typename);
            //取tagid
            List<t_CM_PointsInfo> listPoint = bll.t_CM_PointsInfo.Where(o => o.CID == CID && o.PID == pid && !o.Position.Equals("备用01") && o.TagName.Contains(cname)).ToList();
            string tagIDS = string.Join(",", listPoint.Select(c => c.TagID).ToArray());
            List<t_SM_HisData> list = HisDataDAL.getInstance().GetHisData(out rowcount, rows, page, pid, tagIDS,
                dname, cname, startdate, enddate, typename, sort, order).ToList();
            strJson = List2Json(list, rowcount, listPoint);
            list.Clear();
            list = null;
            return Content(strJson);
            //try
            //{
            //    if (pid != 0)
            //    {
            //        // Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
            //        string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
            //        string query = GetHisQuery(dname, cname, startdate, enddate, typename);
            //        var rowcounts = bll.P_HisDataCount(tablename, query).ToList();
            //         rowcount = rowcounts[0].Value;
            //        //列表排序属性
            //        bool ordertype = true;
            //        if (order.Equals("asc"))
            //            ordertype = false;
            //        List<配电房_00001_历史数据表> list = bll.P_HisData(tablename, "*", sort, rows, page, ordertype, query).ToList();
            //        strJson = Common.List2Json(list, rowcount);
            //    }
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}
            //return Content(strJson);
        }
        public static string List2Json<T>(IList<T> list, int total,List<t_CM_PointsInfo> listPar)
        {
            StringBuilder json = new StringBuilder();
            //{"total":5,"rows":[  
            //int total = list.Count;
            json.Append("{\"total\":");
            json.Append(total);
            json.Append(",\"rows\":[");
            for (int i = 0; i < list.Count; i++)
            {
                T obj = Activator.CreateInstance<T>();
                Type type = obj.GetType();
                PropertyInfo[] pis = type.GetProperties();
                json.Append("{");
               
                for (int j = 0; j < pis.Length; j++)
                {
                    json.Append("\"" + pis[j].Name.ToString() + "\":\"" + pis[j].GetValue(list[i], null) + "\"");
                    if("TagID"==pis[j].Name.ToString())
                    {
                        int tagid=Convert.ToInt32(pis[j].GetValue(list[i], null));
                        var pointInf = listPar.Where(o => o.TagID == tagid);
                        if (pointInf.Count() > 0)
                        {
                            t_CM_PointsInfo poinf = pointInf.First();
                            json.Append(",");
                            json.Append("\"" + "TagName" + "\":\"" + poinf.TagName + "\"");
                            json.Append(",");
                            json.Append("\"" + "Remarks" + "\":\"" + poinf.Remarks + "\"");
                        }
                    }
                    if (j < pis.Length - 1)
                    {
                        json.Append(",");
                    }
                    
                }
                json.Append("}");
                if (i < list.Count - 1)
                {
                    json.Append(",");
                }
            }
            json.Append("]}");
            return json.ToString();
        }
        //获取历史数据查询条件
        string GetHisQuery(string dname = "", string cname = "", string startdate = "", string enddate = "", string typename = "")
        {
            string DateStart = DateTime.Now.AddYears(-5).ToString("yyyy-MM-dd");
            string DateEnd = DateTime.Now.ToString("yyyy-MM-dd"); ;
            string query = " 1=1";
            if (!dname.Equals("==全部=="))
                query = query + " and 设备名称 = '" + dname + "'";
            query = query + " and 测点位置<>'备用01' and (测点名称 like '%" + cname + "%' or 测点位置 like '%" + cname + "%')";
            if (!typename.Equals(""))
                query = query + " and 数据类型='" + typename + "'";
            if (!startdate.Equals(""))
            {
                DateStart = Convert.ToDateTime(startdate).ToString("yyyy-MM-dd");
                query = query + " and 记录时间>='" + startdate + "'";
            }
            if (!enddate.Equals(""))
            {
                DateEnd = Convert.ToDateTime(enddate).AddDays(1).ToString("yyyy-MM-dd");
                query = query + " and 记录时间<='" + DateEnd + "'";
            }
            return query;
        }
        //导出历史数据查询
        public string ExportHisData(int pid, string dname = "", string cname = "", string startdate = "", string enddate = "", string typename = "温度")
        {
            try
            {
                if (pid == 0)
                {
                    pid =Convert.ToInt32( HomeController.GetPID(CurrentUser.UNITList).Split(',')[0]);
                    //pid = Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
                }
                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                string strsql = "SELECT  设备名称,设备编码,测点名称,测点编号,监测位置,测量值,报警状态,记录时间 监测时间 FROM " + tablename;
                string query = GetHisQuery(dname, cname, startdate, enddate, typename);
                strsql = strsql + " where " + query + " order by 记录时间 desc ";
                //string strPath = Server.MapPath("~/Download/");
                //string strExport = "历史数据导出_" + DateTime.Now.ToString("yyyy-MM-dd HH_mm_ss") + ".csv";
                //string strFullExport = strPath + strExport;
                //List<配电房_00001_历史数据表> list = bll.ExecuteStoreQuery<配电房_00001_历史数据表>(strFullSql).ToList();
                //ExportCSV(strFullExport, list);
                DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
                ExportExcel.doExport2003(ds, "~/DownLoad/historydata.xls");
                return "/DownLoad/historydata.xls";
            }
            catch (Exception ex)
            {
                return "Fail:" + ex.Message;
            }
            return "Fail";
        }
        //确认所有配电房的报警
        public ActionResult DelAllPAlarm()
        {
            try
            {
                List<string> sPDRNameOkList = getPDRNameOkList();//权限过滤
                string sWhere = "";
                string sSql = "";
                foreach (string sPDRName in sPDRNameOkList)
                {
                    if (sWhere.Equals(""))
                        sWhere = " where AlarmState != 0 and (Company = '" + sPDRName + "'";
                    else
                        sWhere = sWhere + " or " + " Company = '" + sPDRName + "' ";

                }
                if (!sWhere.Equals(""))
                {
                    sWhere = sWhere + ")";

                    //循环插入每条记录对应的 确认 记录；
                    var query = from module in bll.t_AlarmTable_en where sPDRNameOkList.Contains(module.Company) && module.AlarmState != 0 select module;
                    List<t_AlarmTable_en> list = query.ToList();
                    foreach (t_AlarmTable_en module in list)
                    {
                        sSql = "update [t_AlarmTable_en] set AlarmConfirm='确认',UserName='" + CurrentUser.UserName + "',ConfirmDate='" + DateTime.Now + "' where ALarmID=" + module.AlarmID;
                        bll.ExecuteStoreCommand(sSql);
                    }

                    //
                    sSql = "update  t_AlarmTable_en set  AlarmState = 0 " + sWhere;
                    bll.ExecuteStoreCommand(sSql);

                    //sSql = "INSERT INTO [t_AlarmTable_en] (AlarmDate,AlarmTime,Company,AlarmConfirm,UserName)  VALUES (CONVERT(varchar(12) , getdate(), 111 ) ,CONVERT(varchar(12) , getdate(), 108 ),'确认','" + CurrentUser.UserName + "_" + CurrentUser.Company + "') ";
                    //bll.ExecuteStoreCommand(sSql);
                    return Content("报警已全部确认！");
                }
                else
                {
                    return Content("没有权限，报警未确认！");
                }
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("报警确认失败！");
            }
        }
        List<string> getPDRNameOkList()
        {
            try
            {
                List<string> sPDRNameOkList = new List<string>();
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                sPDRNameOkList.Clear();
                if (pdrlist != null && !pdrlist.Equals(""))
                {
                    List<int> listid = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
                    var query = from module in bll.t_CM_PDRInfo where listid.Contains(module.PID) select module;
                    List<t_CM_PDRInfo> list = query.ToList();
                    foreach (t_CM_PDRInfo module in list)
                    {
                        sPDRNameOkList.Add(module.Name);
                    }
                }
                return sPDRNameOkList;

            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return null;
            }
        }


        /// <summary>
        /// 分析报告查询
        /// </summary>
        /// <returns></returns>
        public ActionResult ReportInfoList(int rows, int page, int pid = 0, string rtype = "", string reportdate = "")
        {
            string query = "1=1";
            if (pid > 0)
                query += " and PID= " + pid;
            if (!string.IsNullOrEmpty(rtype))
                query += " and rtype='" + rtype + "'";
            if (!string.IsNullOrEmpty(reportdate))
                query += " and convert(varchar(100), creatdate, 23)='" + reportdate + "'";

            string strsql = "select * from t_PM_ReportInfo where " + query + " order by creatdate desc";
            List<t_PM_ReportInfo> list = bll.ExecuteStoreQuery<t_PM_ReportInfo>(strsql).ToList();

            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }

        /// <summary>
        /// 运行监测报告曲线图
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult RunData(int pid, string ReportStartDate, string ReportEndDate)
        {
            string strJson = "";
            try
            {
                string dids = "";
                if (pid > 0)
                    dids = PubClass.Exportdoc.GetDeviceDID(pid);

                string query = "select * from t_EE_PowerQualityDaily where did in (" + dids + ") and RecordTime >='" + ReportStartDate + "' and RecordTime <='" + ReportEndDate + "' order by recordtime";
                List<t_EE_PowerQualityDaily> list = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(query).ToList();

                double fpycurrent = 0, fpyvoltage = 0;//合格率
                double maxpower = 0, minpower = 0;//负荷
                double maxtemperature = 0, mintemperature = 0;//温度
                double maxfactor = 0, minfactor = 0;//功率因数

                List<string> listx = new List<string>();
                List<float> listpower = new List<float>();
                List<float> listtemperature = new List<float>();
                List<float> listfactor = new List<float>();
                List<float> listcurrentmax = new List<float>();
                List<float> listcurrentmin = new List<float>();
                List<float> listvoltagemax = new List<float>();
                List<float> listvoltagemin = new List<float>();

                if (list.Count > 0)
                {
                    var result = from p in list.AsEnumerable() group p by p.RecordTime into g select new { g.Key, SumPower = g.Sum(p => p.Power), MaxPower = g.Max(p => p.Power), MaxTemperature = g.Max(p => p.MaxTemperature), FactorMax = g.Max(p => p.AFactor) };
                    foreach (var model in result)
                    {
                        //x轴坐标
                        listx.Add(Convert.ToDateTime(model.Key).ToString("yyyy-MM--dd HH:mm"));
                        listpower.Add(model.SumPower == null ? 0 : (float)model.SumPower);
                        listtemperature.Add(model.MaxTemperature == null ? 0 : (float)model.MaxTemperature);
                        listfactor.Add(model.FactorMax == null ? 0 : (float)model.FactorMax);
                    }
                    fpycurrent = Math.Round((float)list.Count(p => p.ACurrent > 30) / list.Count * 100, 2);
                    fpyvoltage = Math.Round((float)list.Count(p => p.AVoltage > 30) / list.Count * 100, 2);
                }

                //负荷
                maxpower = Math.Ceiling(listpower.Max() * 1.01);
                minpower = Math.Floor(listpower.Min() * 0.99);
                //温度
                maxtemperature = Math.Ceiling(listtemperature.Max() * 1.01);
                mintemperature = Math.Floor(listtemperature.Min() * 0.99);
                //功率因数
                maxfactor = Math.Ceiling(listfactor.Max() * 1.01);
                minfactor = Math.Floor(listfactor.Min() * 0.99);

                strJson = JsonConvert.SerializeObject(listx) + "$" +
                               JsonConvert.SerializeObject(listpower) + "$" + JsonConvert.SerializeObject(minpower) + "$" + JsonConvert.SerializeObject(maxpower) + "$" +
                               JsonConvert.SerializeObject(listtemperature) + "$" + JsonConvert.SerializeObject(mintemperature) + "$" + JsonConvert.SerializeObject(maxtemperature) + "$" +
                               JsonConvert.SerializeObject(listfactor) + "$" + JsonConvert.SerializeObject(minfactor) + "$" + JsonConvert.SerializeObject(maxfactor) + "$" +
                               JsonConvert.SerializeObject(fpycurrent) + "$" +
                               JsonConvert.SerializeObject(fpyvoltage);

            }
            catch (Exception ex)
            {
                strJson = ex.ToString();
                strJson = "异常！";
            }
            return Content(strJson);
        }
        //运行监测报告
        public ActionResult ExportRunDoc(string Img2, string Img3, string Img4, string Img5, string Img6, int PID, string ReportStartDate, string ReportEndDate)
        {
            try
            {
                if (Img2 != "")
                    SaveImage(PID, 2, Img2);
                if (Img3 != "")
                    SaveImage(PID, 3, Img3);
                if (Img4 != "")
                    SaveImage(PID, 4, Img4);
                if (Img5 != "")
                    SaveImage(PID, 5, Img5);
                if (Img6 != "")
                    SaveImage(PID, 6, Img6);
                PubClass.Exportdoc.ExportWordFromRun(Img2, Img3, Img4, Img5, Img6, PID, ReportStartDate, ReportEndDate);
                string fileName = "/DownLoad/run/run" + PID + ".doc";

                return Content(fileName);
            }
            catch (Exception)
            {
                return Content("运行监测报告异常！");
            }
        }
        public string SaveImage(int pid, int index, string IS)
        {
            string re = "";
            try
            {
                string ImageSend = Server.UrlDecode(IS);
                string[] url = ImageSend.Split(',');
                string u = url[1].Replace(' ', '+');
                string pathForSaving = Server.MapPath("~/UploadFiles/temp/" + CurrentUser.UserID + "_" + pid + "_" + index + ".png");
                byte[] byteImage = Convert.FromBase64String(u);
                //string createFileFullPath = "E:\\12.png";
                System.IO.File.WriteAllBytes(pathForSaving, byteImage);
                re = "0";
            }
            catch (Exception ex)
            {
                re = "1";
            }
            return re;
        }
        //维护检修报告
        public ActionResult ExportRepairDoc(int pid, string ReportStartDate, string ReportEndDate)
        {
            PubClass.Exportdoc.ExportWordFromBO(pid, ReportStartDate, ReportEndDate);
            string fileName = "/DownLoad/repair/repair" + pid + ".doc";

            return Content(fileName);
        }

        private t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
    }
}
