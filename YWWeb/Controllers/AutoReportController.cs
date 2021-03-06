﻿using System;
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
            string Unit = "kV";
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
            try
            {
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
                            ReportInfo m = new ReportInfo(
                                (DateTime)listPDRinfo[i].RecordTime,
                                 listPDRinfo[i].AVoltage == null ? 0 : Convert.ToDouble(listPDRinfo[i].AVoltage),
                                listPDRinfo[i].BVoltage == null ? 0 : Convert.ToDouble(listPDRinfo[i].BVoltage),
                                listPDRinfo[i].CVoltage == null ? 0 : Convert.ToDouble(listPDRinfo[i].CVoltage),
                                 listPDRinfo[i].ACurrent == null ? 0 : Convert.ToDouble(listPDRinfo[i].ACurrent),
                                listPDRinfo[i].BCurrent == null ? 0 : Convert.ToDouble(listPDRinfo[i].BCurrent),
                                listPDRinfo[i].CCurrent == null ? 0 : Convert.ToDouble(listPDRinfo[i].CCurrent),
                                listPDRinfo[i].Factor == null ? 0 : Convert.ToDouble(listPDRinfo[i].Factor),
                                listPDRinfo[i].UsePower == null ? 0 : Convert.ToDouble(listPDRinfo[i].UsePower));
                            list.Add(m);
                            if (i == listPDRinfo.Count - 1)
                            {
                                list2.Add(new ReportInfo2(devicename, CID, CName, list));
                            }
                        }
                        else
                        {
                            list2.Add(new ReportInfo2(devicename, CID, CName, list));
                            list = new List<ReportInfo>();
                            ReportInfo m = new ReportInfo(
                                (DateTime)listPDRinfo[i].RecordTime,
                                 listPDRinfo[i].AVoltage == null ? 0 : Convert.ToDouble(listPDRinfo[i].AVoltage),
                                listPDRinfo[i].BVoltage == null ? 0 : Convert.ToDouble(listPDRinfo[i].BVoltage),
                                listPDRinfo[i].CVoltage == null ? 0 : Convert.ToDouble(listPDRinfo[i].CVoltage),
                                 listPDRinfo[i].ACurrent == null ? 0 : Convert.ToDouble(listPDRinfo[i].ACurrent),
                                listPDRinfo[i].BCurrent == null ? 0 : Convert.ToDouble(listPDRinfo[i].BCurrent),
                                listPDRinfo[i].CCurrent == null ? 0 : Convert.ToDouble(listPDRinfo[i].CCurrent),
                                listPDRinfo[i].Factor == null ? 0 : Convert.ToDouble(listPDRinfo[i].Factor),
                                listPDRinfo[i].UsePower == null ? 0 : Convert.ToDouble(listPDRinfo[i].UsePower));
                            list.Add(m);
                            infoLast = listPDRinfo[i];
                            CID = (int)infoLast.CID;
                            CName = (string)infoLast.CName;
                            devicename = getDeviceName(infoLast);
                        }
                    }
                }

                
                    string sqlU = "select d.Units as unit from  t_EE_PowerQualityDaily a,t_DM_CircuitInfo b,t_CM_PointsInfo c,t_CM_ValueType d where 1 = 1 and a.CID=c.CID and a.PID=c.PID and a.CID = b.cid and a.AVoltage is not null and c.DataTypeID=d.DataTypeID";
                    sqlU += " and a.RecordTime >='" + startdate.Date.ToString() + "' and a.RecordTime <='" + startdate.AddDays(1).ToString() + "'";
                    sqlU += " and c.DataTypeID IN (3,56)";
                    if (!pid.Equals(""))
                    {
                        sqlU += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                    }
                    var mV = bll.ExecuteStoreQuery<antisUnit>(sqlU).FirstOrDefault();
                    if (mV != null)
                        Unit = mV.unit;

                //string result = JsonConvert.SerializeObject(list2);
                return Json(new { list=list2, Unit });
            }
            catch(Exception ex)
            {
                throw ex;
            }
            
        }
        public class antisUnit
        {
            public string unit { get; set; }
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
