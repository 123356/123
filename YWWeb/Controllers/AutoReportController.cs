using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using YWWeb.PubClass;
using System.Data;
using System.Collections.Specialized;
using System.IO;
using System.Web.Hosting;
using Loger;
using System.Diagnostics;
using Newtonsoft.Json;

namespace YWWeb.Controllers
{
    public class AutoReportController : UserControllerBaseEx
    {
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        [Login]
        public string CurrentUserName()
        {
            string username = CurrentUser.UserName;
            string logurl = CurrentUser.LogUrl;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);   // update by zzz 20161124
            if (logurl == "" || logurl == null)//如果没有设置logo
                logurl = "logo.png";
            return username + "$" + logurl + "$" + pdrlist;
        }
        [Login]
        public ActionResult getReport(int pid, DateTime startdate)
        {
            //SELECT a.*,b.CName FROM t_EE_PowerQualityDaily a,t_DM_CircuitInfo b WHERE a.CID = b.CID and a.PID=138 AND a.RecordTime >'2018-04-28 00:00:00.000' ORDER BY a.CID,a.RecordTime
            if (startdate == null)
            {
                startdate = DateTime.Now;
            }
            List<t_EE_PowerReportConfig> config = bll.ExecuteStoreQuery<t_EE_PowerReportConfig>("SELECT * FROM t_EE_PowerReportConfig WHERE pid="+pid).ToList();
            string sql = "";
            if (config != null && config.Count > 0 && config.First().cid!="")
            {
                sql = "SELECT a.*,b.CName FROM t_EE_PowerQualityDaily a,t_DM_CircuitInfo b WHERE a.CID = b.CID and a.PID=" + pid + " AND b.PID="+pid+" AND a.CID IN ("+config.First().cid+")  AND a.RecordTime >='" + startdate.Date.ToString() + "' AND a.RecordTime <'" + startdate.AddDays(1).ToString() + "' ORDER BY a.CID,a.RecordTime";
            }
            else
            {
                 sql = "SELECT a.*,b.CName FROM t_EE_PowerQualityDaily a,t_DM_CircuitInfo b WHERE a.CID = b.CID and a.PID=" + pid + " AND b.PID="+pid+" AND a.RecordTime >='" + startdate.Date.ToString() + "' AND a.RecordTime <'" + startdate.AddDays(1).ToString() + "' ORDER BY a.CID,a.RecordTime";
            }
            //if (cid == null)
            //{
            //    if (config != null && config.Count > 0 && config.First().cid != "")
            //    {
            //        sql = "SELECT a.*,b.CName FROM t_EE_PowerQualityDaily a,t_DM_CircuitInfo b WHERE a.CID = b.CID and a.PID=" + pid + " AND b.PID=" + pid + " AND a.CID IN (" + config.First().cid + ")  AND a.RecordTime >='" + startdate.Date.ToString() + "' AND a.RecordTime <'" + startdate.AddDays(1).ToString() + "' ORDER BY a.CID,a.RecordTime";
            //    }
            //    else
            //    {
            //        sql = "SELECT a.*,b.CName FROM t_EE_PowerQualityDaily a,t_DM_CircuitInfo b WHERE a.CID = b.CID and a.PID=" + pid + " AND b.PID=" + pid + " AND a.RecordTime >='" + startdate.Date.ToString() + "' AND a.RecordTime <'" + startdate.AddDays(1).ToString() + "' ORDER BY a.CID,a.RecordTime";
            //    }
            //}
            //else
            //{
            //    if (config != null && config.Count > 0)
            //    {
            //        sql = "SELECT a.*,b.CName FROM t_EE_PowerQualityDaily a,t_DM_CircuitInfo b WHERE a.CID = b.CID and a.PID=" + pid + " AND b.PID=" + pid + " AND a.CID =" + cid + "  AND a.RecordTime >='" + startdate.Date.ToString() + "' AND a.RecordTime <'" + startdate.AddDays(1).ToString() + "' ORDER BY a.CID,a.RecordTime";
            //    }
            //    else
            //    {
            //        sql = "SELECT a.*,b.CName FROM t_EE_PowerQualityDaily a,t_DM_CircuitInfo b WHERE a.CID = b.CID and a.PID=" + pid + " AND b.PID=" + pid + " AND a.RecordTime >='" + startdate.Date.ToString() + "' AND a.RecordTime <'" + startdate.AddDays(1).ToString() + "' ORDER BY a.CID,a.RecordTime";
            //    }
            //}
            List<t_EE_PowerQualityDaily2> listPDRinfo = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily2>(sql).ToList();
            List<ReportInfo2> list2 = new List<ReportInfo2>();
             if (listPDRinfo != null && listPDRinfo.Count > 0)
             {
                 t_EE_PowerQualityDaily2 infoLast = listPDRinfo[0];
               List<ReportInfo> list = new List<ReportInfo>();
               int CID = (int)infoLast.CID;
               string CName = (string)infoLast.CName;
               string devicename = getDeviceName(infoLast);
               for (int i = 0; i < listPDRinfo.Count; i++)
               {
                   if (listPDRinfo[i].CID == CID)
                   {
                       list.Add(new ReportInfo((DateTime)listPDRinfo[i].RecordTime,(double)listPDRinfo[i].AVoltage,(double)listPDRinfo[i].BVoltage,(double)listPDRinfo[i].CVoltage,(double)listPDRinfo[i].ACurrent,(double)listPDRinfo[i].BCurrent,(double)listPDRinfo[i].CCurrent,(double)listPDRinfo[i].Factor,(double)listPDRinfo[i].UsePower));
                       if (i == listPDRinfo.Count - 1)
                       {
                           list2.Add(new ReportInfo2(devicename, CID, CName, list));
                       }
                   }
                   else
                   {
                       list2.Add(new ReportInfo2(devicename,CID, CName,list));
                       list = new List<ReportInfo>();
                       list.Add(new ReportInfo((DateTime)listPDRinfo[i].RecordTime, (double)listPDRinfo[i].AVoltage, (double)listPDRinfo[i].BVoltage, (double)listPDRinfo[i].CVoltage, (double)listPDRinfo[i].ACurrent, (double)listPDRinfo[i].BCurrent, (double)listPDRinfo[i].CCurrent, (double)listPDRinfo[i].Factor, (double)listPDRinfo[i].UsePower));
                       infoLast = listPDRinfo[i];
                       CID = (int)infoLast.CID;
                       CName = (string)infoLast.CName;
                       devicename = getDeviceName(infoLast);
                   }
               }     
             }
             string result = JsonConvert.SerializeObject(list2);
             return Content(result);
        }

        private string getDeviceName(t_EE_PowerQualityDaily2 PowerQuality)
        {
            if (PowerQuality.DID > 0)
            {
                int didd = (int)PowerQuality.DID;
            }
            string dname = "";
            List<t_DM_DeviceInfo> devices = bll.t_DM_DeviceInfo.Where(p => p.DID == PowerQuality.DID).ToList();
            if (devices != null && devices.Count > 0) dname = devices.First().DeviceName+" / ";
            return dname;
        }

        //public t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}    
    }
}
