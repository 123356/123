using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Text;
using YWWeb.PubClass;
using System.Data;
using System.Diagnostics;
using System.IO;
using IDAO.Models;
using DAL;

namespace YWWeb.Controllers
{
    public class PDRInfoController : UserControllerBaseEx
    {
        //
        // GET: /PDRInfo/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        [Login]
        public ActionResult PDRInfoList()
        {
            return View();
        }
        [Login]
        public ActionResult StationRoom()
        {
            return View();
        }
        [Login]
        public ActionResult StationInfo()
        {
            return View();
        }
        [Login]
        public ActionResult PlanInfo(string id)
        {
            return View("PlanInfo" + id);
        }
        
        [Login]
        public ActionResult OneGraphLow(string id)
        {
            return View("OneGraphLow" + id);
        }
        [Login]
        public ActionResult OneGraph(string id)
        {

            int[] pids = new int[] { 178,12 };


            if (id.Contains('_'))
            {
                string[] ids = id.Split('_');
                ViewData["pid"] = ids[0];
                ViewData["orderNo"] = ids[1];
                if (Array.IndexOf(pids, Convert.ToInt32(ids[0])) == -1)
                {
                    return View("OneGraph" + ids[0] + "_" + ids[1]);
                }else
                {
                    return View("OneGraphTopo");
                }
            }
            else
            {
                string[] ids = id.Split('_');
                ViewData["pid"] = ids[0];
                if (Array.IndexOf(pids,Convert.ToInt32( ids[0])) == -1)
                {
                    return View("OneGraph" + id);
                }else
                {
                    return View("OneGraphTopo");
                }
            }
        }
        [Login]
        public ActionResult RealTimePage()
        {
            return View();
        }
        public ActionResult RealTimeVideo()//视频详情
        {
            return View();
        }
        public ActionResult ConnectVideo()//视频详情
        {
            return View();
        }
        public ActionResult RealTempMap()
        {
            return View();
        }
        public ActionResult InfraredInfo()
        {
            return View();
        }
        [Login]
        public ActionResult PowerQuality()
        {
            return View();
        }

        //获取摄像头参数  //2016.6.15 HY
        [Login]
        public ActionResult GetMediaInfo(int Pid)
        {
            List<t_CM_CameraInfo> list = bll.t_CM_CameraInfo.Where(f => f.PID == Pid).ToList();
            string strjson = "null";
            if (list.Count > 0)
            {
                t_CM_CameraInfo Mod = list.First();
                strjson = JsonConvert.SerializeObject(Mod);
            }
            return Content(strjson);
        }
        //获取开关量状态

        public string getSwitchInfo(int pid)
        {
            string strsql = "select did from V_DeviceInfoState_PDR1 where PID=105 and DataTypeID=23 and PV=1";
            List<int> list = bll.ExecuteStoreQuery<int>(strsql).ToList();
            string strjson = JsonConvert.SerializeObject(list);
            return strjson;
        }

        /// <summary>
        /// 更新一次图开关状态
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        public string getSwitchInfo_kg(int pid)
        {
            string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + " and DataTypeID = 23 order by did,DataTypeID,TagID,ABCID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            var result = from m in list
                         select new
                         {
                             PV = m.PV,
                             TagID = m.TagID
                         };
            string strjson = JsonConvert.SerializeObject(result);
            return strjson;
        }

        //获取红外双视测点信息
        public ActionResult GetInfraredInfo(int pid = 0)
        {
            string strsql = "select * from V_DeviceInfoState_PDR1 where DataTypeID = 18 and PID=" + pid;
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            StringBuilder sbinfrared = new StringBuilder();
            sbinfrared.Append("<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"d_table\">");
            int icount = 0;
            foreach (V_DeviceInfoState_PDR1 model in list)
            {
                icount++;//记录不同分类的测点值
                if (icount == 1 || (icount - 1) % 2 == 0)
                    sbinfrared.Append("<tr>");
                string pv = model.PV.ToString();
                sbinfrared.Append("<td>" + model.Remarks + "</td><td>" + pv + "</td>");
                if (icount % 2 == 0)
                    sbinfrared.Append("</tr>");
            }
            if (icount % 2 != 0)
                sbinfrared.Append("<td></td><td></td></tr>");
            sbinfrared.Append("</table>");
            string result = sbinfrared.ToString();
            string strJson = JsonConvert.SerializeObject(result);
            return Content(strJson);
        }
        //获取站室最高温度及其他信息
        public ActionResult GetMaxTempInfo(int pid)
        {
            StringBuilder sbtitle = new StringBuilder();
            int maxdid = 0;
            sbtitle.Append("<div class=\"station_room_monitor_top\">");
            string strsql = "select top 1 AlarmAddress,AlarmArea,AlarmValue,ALarmType,t.AlarmState,Units,AlarmCate,t.DID from t_AlarmTable_en AS t INNER JOIN V_DeviceInfoState_PDR1 AS r ON t.TagID = r.TagID join t_CM_PDRInfo p on p.PID=t.PID where t.AlarmState>0 and (t.pid=" + pid + " or p.ParentID=" + pid + ") and AlarmCate <>'开关量' order by t.AlarmState desc,AlarmID desc";
            //判断是否存在报警数据
            string alarmcate = "报警值";
            List<AlarmInfo> alist = bll.ExecuteStoreQuery<AlarmInfo>(strsql).ToList();
            if (alist.Count > 0)
            {
                AlarmInfo alarm = alist.First();
                if (!alarm.AlarmCate.Equals(""))
                    alarmcate = alarm.AlarmCate;
                sbtitle.Append("<h2>" + alarm.ALarmType + "</h2>");
                sbtitle.Append("<span>设备运行状况</span></div>");
                maxdid = alarm.DID;
                sbtitle.Append("<div class=\"station_room_monitor_hr state_bg_" + alarm.AlarmState + "\"></div>");
                sbtitle.Append("<div class=\"station_room_monitor_content\"><strong>" + alarmcate + "：<h1 class=\"state_fc_" + alarm.AlarmState + "\">" + alarm.AlarmValue + alarm.Units + "</h1><br />" + alarm.AlarmArea + "<br />" + alarm.AlarmAddress + "</strong>");
            }
            else
            {
                //获取站室最高温度
                strsql = "select top 1 [中文描述] AlarmAddress,DeviceName AlarmArea,PV AlarmValue,'正常' ALarmType,0 AlarmState,Units,TypeName AlarmCate,DID  from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") and (DataTypeID=1 or DataTypeID=72) order by PV desc,TagID";                
                alist = bll.ExecuteStoreQuery<AlarmInfo>(strsql).ToList();
                string sTValue = "--";
                

                if (alist.Count > 0)
                {
                    AlarmInfo alarm = alist.First();
                    if (!alarm.AlarmCate.Equals(""))
                        alarmcate = alarm.AlarmCate;
                    maxdid = alarm.DID;
                    if (alarm.AlarmValue>0)
                    {
                        sTValue = alarm.AlarmValue.ToString();
                    }
                    sbtitle.Append("<h2>正常</h2>");
                    sbtitle.Append(" <span>设备运行状况</span></div>");
                    sbtitle.Append("<div class=\"station_room_monitor_hr\"></div>");
                    sbtitle.Append("<div class=\"station_room_monitor_content\"><strong>测点最高温度：<h1 class=\"state_fc_0\">" + sTValue + alarm.Units + "</h1><br />" + alarm.AlarmArea + "<br />" + alarm.AlarmAddress + "</strong>");
                }
                else
                {
                    sbtitle.Append("<h2>正常</h2>");
                    sbtitle.Append(" <span>设备运行状况</span></div>");
                    sbtitle.Append("<div class=\"station_room_monitor_hr\"></div>");
                    sbtitle.Append("<div class=\"station_room_monitor_content\"><strong>测点最高温度：<h1 class=\"state_fc_0\"> N/A</h1><br /></strong>");
                }
            }
            //获取室内环境温度12，室内环境湿度13，柜内环境温度24
            strsql = "select DataTypeID,PV from ( select row_number() over(partition by DataTypeID order by pv desc) as rownum , v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") and DataTypeID in (12)"
                + ") as T where T.rownum = 1 order by datatypeid desc";
            List<TempValue> listtemp = bll.ExecuteStoreQuery<TempValue>(strsql).ToList();
            int rowcount = listtemp.Count;
            double mintemp = 0, maxtemp = 0, humidity = 0;//柜内温度，室内温度，室内湿度
            double pv = 0;
            int dtid = 0;
            foreach (TempValue model in listtemp)
            {
                dtid = model.DataTypeID;
                pv = (double)model.PV;
                if (dtid == 12)
                    maxtemp = pv;
                else if (dtid == 13)
                    humidity = pv;
                //else if (dtid == 24)
                //    mintemp = pv;
            }

            string strtemp = "N/A", strhumidity = "N/A";
            if (humidity > 0)
                strhumidity = humidity + " %Rh";

            if (maxtemp > 0)
            {
                if (mintemp > 0)
                    strtemp = mintemp + " ℃~" + maxtemp + " ℃";
                else
                    strtemp = maxtemp + " ℃";
            }
            //sbtitle.Append("<span>站内湿度：" + strhumidity + "</span><span>站内温度：" + strtemp + "</span></div>");
            sbtitle.Append("<span>负荷：N/A</span><span>站内温度：" + strtemp + "</span></div>");
            string strRevalue = sbtitle.ToString();
            if (pid == 105)//
                strRevalue = strRevalue + "$" + maxdid;
            return Content(strRevalue);
        }
        public class TempValue
        {
            public int DataTypeID { get; set; }
            public double PV { get; set; }
        }
        //报警数据
        public class AlarmInfo
        {
            public string AlarmAddress { get; set; }
            public string AlarmArea { get; set; }
            public double AlarmValue { get; set; }
            public string ALarmType { get; set; }
            public int AlarmState { get; set; }
            public string Units { get; set; }
            public string AlarmCate { get; set; }
            public int DID { get; set; }
        }
        //测点类型单位转换
        private string DataUnitsReplace(string strunit)
        {
            if (strunit == "" || strunit == null)
                return "";
            else
                return "（" + strunit + "）";
        }
        //获取站室实时开关值
        public ActionResult getRealTimeSwitchDate(int pid, int sDeviceTypeID)
        {
            if(pid!=177)
            { 
            try
            {
                string InputValue;
                string strquery = "";
                int DataTypeID = 23;
                if (DataTypeID > 0)
                {
                    strquery += " and DataTypeID = " + DataTypeID.ToString() + " ";
                }
                if (sDeviceTypeID > 0)
                {
                    strquery += " and DTID=" + sDeviceTypeID.ToString() + " ";
                }

                string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery + " order by orderby,devicetypename,did,DataTypeID,TagID,ABCID";
                List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                StringBuilder sbtable = new StringBuilder();
                int icount = 0, tcount = 0;//计数器，添加换行计数器        
                string currname = "", beforename = "";
                string positionname = "", Remarks = "";
                DateTime newtime = Convert.ToDateTime("2014-06-08");
                int tagid = 0, did = 0;
                foreach (V_DeviceInfoState_PDR1 model in list)
                {
                    if (model.RecTime > newtime)
                        newtime = model.RecTime;
                    currname = model.DeviceName;//当前设备名称
                    tagid = model.TagID;
                    did = model.DID;

                    positionname = model.Position;// getPositionName(model.Position);

                    Remarks = model.Remarks;

                    InputValue = model.PV.ToString();


                    if (!currname.Equals(beforename))//如果设备名称不相同
                    {
                        tcount++;

                        if (icount != 0)
                        {
                            sbtable.Append("</div>");
                            sbtable.Append("</div>");

                            if (tcount == 7)
                            {
                                sbtable.Append("</div>");
                                sbtable.Append("</div>");
                                sbtable.Append("<div class=\"col-md-12 column\">");
                                sbtable.Append("<div class=\"row clearfix\">");

                                tcount = 1;
                            }
                        }
                        if (tcount == 1)
                        {
                            sbtable.Append("<div class=\"col-md-12 column\">");
                            sbtable.Append("<div class=\"row clearfix\">");
                        }


                        /*
                        <div class="col-md-2 column">
                        <div class="list-group">
                            <a href="#" class="list-group-item active">柜子名称</a>
                        */
                        sbtable.Append("<div class='col-md-2 column'>");
                        sbtable.Append("<div class='list-group'>");
                        sbtable.Append("<a href=\"#\" class=\"list-group-item active\">" + currname + "</a>");

                        string strTmp = "";
                        if (InputValue != null && InputValue.Equals("0"))
                        {
                            strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                        }
                        else if (InputValue != null && InputValue.Equals("1"))
                        {
                            strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                        }
                        else
                        {
                            strTmp = "<span class=\"badge\" style=\"background-color: #ffc000\">故障</span> ";
                        }

                            sbtable.Append("<div class=\"list-group-item\">");
                            var xx = strTmp + Remarks;
                            sbtable.Append(xx);

                            sbtable.Append("</div>");
                        
                      


                    }
                    else
                    {
                        string strTmp = "";
                        if (InputValue != null && InputValue.Equals("0"))
                        {
                            strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                        }
                        else if (InputValue != null && InputValue.Equals("1"))
                        {
                            strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                        }
                        else
                        {
                            strTmp = "<span class=\"badge\" style=\"background-color: #ffc000\">故障</span> ";
                        }

                            sbtable.Append("<div class=\"list-group-item\">");
                            var xx = strTmp + Remarks;
                            sbtable.Append(xx);

                            sbtable.Append("</div>");
                        
                    }



                    icount++;
                    beforename = currname;
                }
                if (icount > 0)
                {
                    sbtable.Append("</div>");
                    sbtable.Append("</div>");
                    sbtable.Insert(0, "<div class=\"col-md-12 column\">" + "<h4 class=\"text-center\">最新更新时间：" + newtime + "</h4>" + "</div>");
                }
                else
                {
                    sbtable.Append("<div class=\"col-md-12 column\">");
                    sbtable.Append("<h3 class=\"text-center\">无监测数据！</h3>");
                    sbtable.Append("</div>");
                }

                string result = sbtable.ToString();
                string strJson = JsonConvert.SerializeObject(result);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
            }
            else
            {

                try
                {
                    string InputValue;
                    string strquery = "";
                    int DataTypeID = 23;
                    if (DataTypeID > 0)
                    {
                        strquery += " and DataTypeID = " + DataTypeID.ToString() + " ";
                    }
                    if (sDeviceTypeID > 0)
                    {
                        strquery += " and DTID=" + sDeviceTypeID.ToString() + " ";
                    }

                    string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery + " order by orderby,devicetypename,did,DataTypeID,TagID,ABCID";
                    List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                    StringBuilder sbtable = new StringBuilder();
                    int icount = 0, tcount = 0;//计数器，添加换行计数器        
                    string currname = "", beforename = "";
                    string positionname = "", Remarks = "";
                    DateTime newtime = Convert.ToDateTime("2014-06-08");
                    int tagid = 0, did = 0;
                    foreach (V_DeviceInfoState_PDR1 model in list)
                    {
                        if (model.RecTime > newtime)
                            newtime = model.RecTime;
                        currname = model.DeviceName;//当前设备名称
                        tagid = model.TagID;
                        did = model.DID;

                        positionname = model.Position;// getPositionName(model.Position);

                        Remarks = model.Remarks;

                        InputValue = model.PV.ToString();


                        if (!currname.Equals(beforename))//如果设备名称不相同
                        {
                            tcount++;

                            if (icount != 0)
                            {
                                sbtable.Append("</div>");
                                sbtable.Append("</div>");

                                if (tcount == 7)
                                {
                                    sbtable.Append("</div>");
                                    sbtable.Append("</div>");
                                    sbtable.Append("<div class=\"col-md-12 column\">");
                                    sbtable.Append("<div class=\"row clearfix\">");

                                    tcount = 1;
                                }
                            }
                            if (tcount == 1)
                            {
                                sbtable.Append("<div class=\"col-md-12 column\">");
                                sbtable.Append("<div class=\"row clearfix\">");
                            }


                            /*
                            <div class="col-md-2 column">
                            <div class="list-group">
                                <a href="#" class="list-group-item active">柜子名称</a>
                            */
                            sbtable.Append("<div class='col-md-2 column'>");
                            sbtable.Append("<div class='list-group'>");
                            sbtable.Append("<a href=\"#\" class=\"list-group-item active\">" + currname + "</a>");

                            string strTmp = "";
                            if (InputValue != null && InputValue.Equals("0"))
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                            }
                            else if (InputValue != null && InputValue.Equals("1"))
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                            }
                            else
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #ffc000\">故障</span> ";
                            }

                            if (!(Remarks.Contains("_开关") || Remarks.Contains("_CLOSE") || Remarks.Contains("_OPEN") || Remarks.Contains("_LOCA") || Remarks.Contains("_SET")))
                            {
                                sbtable.Append("<div class=\"list-group-item\">");
                                var xx = strTmp + Remarks;
                                sbtable.Append(xx);

                                sbtable.Append("</div>");
                            }



                        }
                        else
                        {
                            string strTmp = "";
                            if (InputValue != null && InputValue.Equals("0"))
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                            }
                            else if (InputValue != null && InputValue.Equals("1"))
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                            }
                            else
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #ffc000\">故障</span> ";
                            }
                            if (!(Remarks.Contains("_开关") || Remarks.Contains("_CLOSE") || Remarks.Contains("_OPEN") || Remarks.Contains("_LOCA") || Remarks.Contains("_SET")))
                            {
                                sbtable.Append("<div class=\"list-group-item\">");
                                var xx = strTmp + Remarks;
                                sbtable.Append(xx);

                                sbtable.Append("</div>");
                            }
                        }



                        icount++;
                        beforename = currname;
                    }
                    if (icount > 0)
                    {
                        sbtable.Append("</div>");
                        sbtable.Append("</div>");
                        sbtable.Insert(0, "<div class=\"col-md-12 column\">" + "<h4 class=\"text-center\">最新更新时间：" + newtime + "</h4>" + "</div>");
                    }
                    else
                    {
                        sbtable.Append("<div class=\"col-md-12 column\">");
                        sbtable.Append("<h3 class=\"text-center\">无监测数据！</h3>");
                        sbtable.Append("</div>");
                    }

                    string result = sbtable.ToString();
                    string strJson = JsonConvert.SerializeObject(result);
                    return Content(strJson);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Content(error);
                }
            }
        }

        /// <summary>
        /// 取得所有实时数据
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="sDeviceTypeID"></param>
        /// <param name="DID"></param>
        /// <param name="DataTypeID"></param>
        /// <returns></returns>
        public ActionResult getRealTimeDateByDID(int pid,int DID = 0,int CID = 0)
        {
            try
            {
                string InputValue;
                string strquery = "";
                int DataTypeID = 0;

                if (DID > 0)
                {
                    strquery += " and did = " + DID.ToString() + " ";
                } 
                if (CID > 0)
                {
                    strquery += " and CID = " + CID.ToString() + " ";
                }
                if (DataTypeID > 0)
                {
                    strquery += " and DataTypeID = " + DataTypeID.ToString() + " ";
                }

                string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery + " order by CID,orderby,devicetypename,did,DataTypeID,TagID,ABCID";
                List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                StringBuilder sbtable = new StringBuilder();
                int icount = 0, tcount = 0;//计数器，添加换行计数器        
                string currname = "", beforename = "";
                string positionname = "", Remarks = "";
                DateTime newtime =  Convert.ToDateTime("2014-06-08");
                int tagid = 0, did = 0;
                foreach (V_DeviceInfoState_PDR1 model in list)
                {
                    newtime = model.RecTime;
                    currname = model.DeviceName;//当前回路
                    tagid = model.TagID;
                    did = model.DID;

                    positionname = model.Position;// getPositionName(model.Position);

                    Remarks = model.Remarks;

                    InputValue = model.PV.ToString();


                    if (!currname.Equals(beforename))//如果设备名称不相同
                    {
                        tcount++;

                        if (icount != 0)
                        {
                            sbtable.Append("</div>");
                            sbtable.Append("</div>");

                            if (tcount == 3)
                            {
                                sbtable.Append("</div>");
                                sbtable.Append("</div>");
                                sbtable.Append("<div class=\"col-md-12 column\">");
                                sbtable.Append("<div class=\"row clearfix\">");

                                tcount = 1;
                            }
                        }
                        if (tcount == 1)
                        {
                            sbtable.Append("<div class=\"col-md-12 column\">");
                            sbtable.Append("<div class=\"row clearfix\">");
                        }


                        /*
                        <div class="col-md-2 column">
                        <div class="list-group">
                            <a href="#" class="list-group-item active">柜子名称</a>
                        */
                        sbtable.Append("<div class='col-md-12 column'>");
                        sbtable.Append("<div class='list-group'>");
                        sbtable.Append("<a href=\"#\" class=\"list-group-item active\">" + currname + "</a>");

                        //处理开关
                        string strTmp = "";
                        if (model.DataTypeID == 23)
                        {
                            if (InputValue != null && InputValue.Equals("0"))
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">分闸</span> ";
                            }
                            else if (InputValue != null && InputValue.Equals("1"))
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #ff0000\">合闸</span> ";
                            }
                            else
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #ffc000\">故障</span> ";
                            }
                        }else if ((model.TypeName.Contains("温度") || model.TypeName.Contains("湿度")) && model.PV == 0)
                        {
                            InputValue = "--";
                        }
                        else if (model.DataTypeID == 51)
                        {
                            double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                            strCashAmt = Math.Round(strCashAmt, 2);//保留三位小数
                            InputValue = strCashAmt + "";
                        }
                        
                        sbtable.Append("<div class=\"list-group-item\">");
                        sbtable.Append(strTmp + Remarks);
                        sbtable.Append("</div>");


                    }
                    else
                    {
                        //处理开关
                        string strTmp = "";
                        if (model.DataTypeID == 23)
                        {
                            if (InputValue != null && InputValue.Equals("0"))
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">分闸</span> ";
                            }
                            else if (InputValue != null && InputValue.Equals("1"))
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #ff0000\">合闸</span> ";
                            }
                            else
                            {
                                strTmp = "<span class=\"badge\" style=\"background-color: #ffc000\">故障</span> ";
                            }
                        }
                        else
                        {
                            strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">" + InputValue + "</span> ";
                        }
                        sbtable.Append("<div class=\"list-group-item\">");
                        sbtable.Append(strTmp + Remarks);
                        sbtable.Append("</div>");
                    }



                    icount++;
                    beforename = currname;
                }
                if (icount > 0)
                {
                    sbtable.Append("</div>");
                    sbtable.Append("</div>");
                    sbtable.Insert(0, "<div class=\"col-md-12 column\">" + "<h4 class=\"text-center\">最新更新时间：" + newtime + "</h4>" + "</div>");
                }
                else
                {
                    sbtable.Append("<div class=\"col-md-12 column\">");
                    sbtable.Append("<h3 class=\"text-center\">无监测数据！</h3>");
                    sbtable.Append("</div>");
                }

                string result = sbtable.ToString();
                string strJson = JsonConvert.SerializeObject(result);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
        }
        //获取站室实时开关值
        public ActionResult RealTimeSignalScreen(int pid, int sDeviceTypeID)
        {
            try
            {
                if (sDeviceTypeID <= 0)
                {
                    return Content("");
                }
                string InputValue;
                string strquery = " and DataTypeID=23 and DTID=" + sDeviceTypeID.ToString() + " "; 
                string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery + " order by orderby,devicetypename,did,DataTypeID,TagID,ABCID";
                List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                StringBuilder sbtable = new StringBuilder();
                int icount = 0, tcount = 0, alarmCount = 0, okCount = 0, otherCount = 0;//计数器，添加换行计数器        
                string currname = "", beforename = "";
                string positionname = "", Remarks = ""; 
                DateTime newtime = Convert.ToDateTime("2014-06-08");
                int tagid = 0, did = 0;
                foreach (V_DeviceInfoState_PDR1 model in list)
                {
                    //根据大族项目定制，信息屏只显示采集个数
                    if (icount >= 128 && pid == 1)
                        break;
                    //根据大族项目定制
                    if (icount >= 57 && pid == 2)
                        break;
                    //根据大族项目定制
                    if (icount >= 73 && pid == 3)
                        break;
                    //根据大族项目定制
                    if (icount >= 39 && pid == 4)
                        break;
                    //根据大族项目定制
                    if (icount >= 50 && pid == 5)
                        break;
                    //根据大族项目定制
                    if (icount >= 31 && pid == 6)
                        break;
                    //if (pid >= 8 || pid <= 11)
                    //    break;

                    if (model.RecTime > newtime)
                        newtime = model.RecTime;
                    currname = model.Remarks;// model.DeviceName;//当前设备名称
                    tagid = model.TagID;
                    did = model.DID;
                    
                    positionname = model.Position;// getPositionName(model.Position);

                    Remarks = model.Remarks;

                    InputValue = model.PV.ToString();


                    if ((!currname.Equals(beforename)) && (!string.IsNullOrEmpty(Remarks)))//如果设备名称不相同
                    {                        
                        tcount++;

                        if (icount != 0)
                        {
                            sbtable.Append("</div>");
                            sbtable.Append("</div>");

                            if (tcount == 7)
                            {
                                sbtable.Append("</div>");
                                sbtable.Append("</div>");
                                sbtable.Append("<div class=\"col-md-12 column\">");
                                sbtable.Append("<div class=\"row clearfix\">");

                                tcount = 1;
                            }
                        }
                        if (tcount == 1)
                        {
                            sbtable.Append("<div class=\"col-md-12 column\">");
                            sbtable.Append("<div class=\"row clearfix\">");
                        }
                                               

                        /*
                        <div class="col-md-2 column">
                        <div class="list-group">
                            <a href="#" class="list-group-item active">柜子名称</a>
                        */
                        sbtable.Append("<div class='col-md-2 column'>");
                        sbtable.Append("<div class='list-group'>");
                        //sbtable.Append("<a href=\"#\" class=\"list-group-item active\">" + currname + "</a>");

                        string strTmp = "";
                        if (InputValue != null && InputValue.Equals("0"))
                        {
                            okCount++;
                            strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                        }
                        else if (InputValue != null && InputValue.Equals("1"))
                        {
                            alarmCount++;
                            strTmp = "<span class=\"badge\" style=\"background-color: #ff0000\">报警</span> ";
                        }
                        else
                        {
                            strTmp = "<span class=\"badge\" style=\"background-color: #ffc000\">故障</span> ";
                        }
                        sbtable.Append("<div class=\"list-group-item\">");
                        sbtable.Append(strTmp + Remarks);
                        sbtable.Append("</div>");
                        
                    }
                    else
                    {
                        string strTmp = "";
                        if (InputValue!=null&&InputValue.Equals("0"))
                        {
                            okCount++;
                            strTmp = "<span class=\"badge\" style=\"background-color: #39c000\">正常</span> ";
                        }
                        else if (InputValue != null && InputValue.Equals("1"))
                        {
                            alarmCount++;
                            strTmp = "<span class=\"badge\" style=\"background-color: #ff0000\">报警</span> ";
                        }
                        else
                        {
                            otherCount++;
                            strTmp = "<span class=\"badge\" style=\"background-color: #ffc000\">故障</span> ";
                        }

                        if (!string.IsNullOrEmpty(Remarks))
                        {
                            sbtable.Append("<div class=\"list-group-item\">");
                            sbtable.Append(strTmp + Remarks);
                            sbtable.Append("</div>");
                        }
                    }
                                                           
                    icount++;
                    beforename = Remarks;
                }
                if (icount > 0)
                {
                    sbtable.Append("</div>");
                    sbtable.Append("</div>");

                    sbtable.Insert(0, "<div class=\"col-md-12 column\">" + "<h4 class=\"text-center\">报警：" + alarmCount + "个，正常：" + okCount + "个，通讯故障：" + otherCount + "个,     最新更新时间：" + newtime + "</h4>" + "</div>");
                }
                else
                {
                    sbtable.Append("<div class=\"col-md-12 column\">");
                    sbtable.Append("<h3 class=\"text-center\">无监测数据！</h3>");
                    sbtable.Append("</div>");
                }

                string result = sbtable.ToString();
                string strJson = JsonConvert.SerializeObject(result);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
        }
        //获取站室实时温度值  
        //注释备用函数名称改为1
        public ActionResult RealTimeTemp1(int pid)
        {
            try
            {
                string InputValue;
                string strquery = " and DataTypeID!=23 ";// 不显示开关量
                //List<V_DeviceInfoState_PDR1> list = bll.V_DeviceInfoState_PDR1.Where(p => p.PID == pid).OrderBy(p => p.DataTypeID).ThenBy(p => p.DID).ToList();

                string strsql = "select v.* from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") " + strquery + " order by orderby,devicetypename,did,DataTypeID,TagID,ABCID";
                //if (pid != 6)
                //    strsql = "select * from V_DeviceI3    nfoState_PDR1 where pid=" + pid + strquery + " order by devicetypename,did,DataTypeID,Position,ABCID";
                //string strsql = "select * from V_DeviceInfoState_PDR1 where did in (265,246) and datatypeid>23 order by devicetypename,did,DataTypeID,ABCID";
                List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                StringBuilder sbtable = new StringBuilder();
                sbtable.Append("<table align=\"center\" class=\"bgw\" style=\"min-width:auto;\"><tbody align=\"center\" style=\"vertical-align: middle;\">");
                int icount = 0, typecount = 0, pointcount = 0, pcount = 0, tcount = 0;//计数器，分类设备总数，测点总数,测点数量计数器,添加换行计数器
                int tyc = 0;
                string currname = "", beforename = "", cdtypename = "", bdtypename = "", bcatename = "", ccatename = "";//当前设备名称，上一个设备名称，当前设备类型名称，上一个设备类型名称,上一测点类型名称，当前测点类型名称
                string positionname = "";
                string strcountsql = "",pointstatus="";
                string orlike = " abcid>0 ";
                DateTime newtime = Convert.ToDateTime("2015-04-07");
                int tagid = 0,did = 0;
                foreach (V_DeviceInfoState_PDR1 model in list)
                {
                    if (model.RecTime > newtime)
                        newtime = model.RecTime;
                    cdtypename = model.DeviceTypeName;//当前设备类型名称
                    currname = model.DeviceName;//当前设备名称
                    ccatename = model.TypeName;//当前测点类型名称
                    tagid = model.TagID;
                    did = model.DID;
                    pointstatus = loadAlarmStatus(tagid, model.AlarmStatus);//获取测点状态
                    positionname = model.Position;// getPositionName(model.Position);

                    if ((model.TypeName.Contains("温度") || model.TypeName.Contains("湿度")) && model.PV == 0)
                    {
                        InputValue = "--";
                    }
                    else if (model.DataTypeID == 51)//功率因素取绝对值
                    {
                        double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                        strCashAmt = Math.Round(strCashAmt, 3);//保留三位小数
                        InputValue = strCashAmt + "";
                    }
                    else if (model.DataTypeID == 21)//小气象 小雨、中雨、大雨、暴雨、大暴雨、特大暴雨
                    {
                        double PV = Convert.ToDouble(model.PV);
                        if (PV > 0 && PV < 10)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：小雨";
                        }
                        else if (PV >= 10 && PV <= 24.9)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：中雨";
                        }
                        else if (PV >= 25 && PV <= 49.9)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：大雨";
                        }
                        else if (PV > 50 && PV <= 99.9)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：暴雨";
                        }
                        else if (PV >= 100 && PV <= 149.9)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：大暴雨";
                        }
                        else if (PV >= 250)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：特大暴雨";
                        }
                        else
                        {
                            InputValue = "无雨";
                        }
                    }
                    else if (pid == 105 && model.DeviceTypeName.Equals("变压器") && model.PV == 0)
                        InputValue = "--";
                    else if (model.DID == 480 && model.PV == 0)//直流屏
                        InputValue = "--";
                    else
                        InputValue = model.PV.ToString();

                    if (!bdtypename.Equals(cdtypename))//如果设备类型不同
                    {
                        typecount = 0;
                        //三相总数
                        //strcountsql = "select COUNT(distinct REPLACE(REPLACE(REPLACE(tagname,'a',''),'b',''),'c','')) row_count from V_DeviceInfoState_PDR1 where pid=" + pid + " and devicetypename='" + cdtypename + "' and " + orlike;
                        strcountsql = "select top 1 COUNT(abcid) from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") and DeviceTypeName='" + model.DeviceTypeName + "'" + strquery + " and abcid>0 group by abcid order by COUNT(abcid) desc";
                        List<int> rowlist = bll.ExecuteStoreQuery<int>(strcountsql).ToList();
                        if (rowlist.Count > 0)
                            typecount = rowlist[0] + 1;

                        //tyc = typecount;

                        //包含三相的设备数
                        strcountsql = "select COUNT(distinct did) row_count from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ") and " + orlike + strquery + " and devicetypename='" + cdtypename + "'";
                        rowlist = bll.ExecuteStoreQuery<int>(strcountsql).ToList();
                        if (rowlist[0] > 1)
                            typecount = typecount + rowlist[0] - 1;

                        //List<V_DeviceInfoState_PDR1> DList = list.Where(o => o.PID == pid && o.DeviceTypeName == cdtypename && o.DataTypeID != 23 && o.ABCID > 0).ToList();
                        //var Dcount = from r in DList orderby r.DID descending group r by r.DID;
                        //int Dc = Dcount.Count();
                        //if (Dc > 1)
                        //    typecount = typecount + Dc - 1;

                        //不包含三相的设备数
                        typecount = typecount + list.Where(d => d.DeviceTypeName == cdtypename && d.ABCID == 0).Count();
                        //tyc = tyc + list.Where(d => d.DeviceTypeName == cdtypename && d.ABCID == 0).Count();
                        //设备总数
                        strcountsql = "select COUNT(distinct did) row_count from V_DeviceInfoState_PDR1 v join t_CM_PDRInfo p on p.PID=v.PID where (v.PID=" + pid + " or p.ParentID=" + pid + ")" + strquery + " and devicetypename='" + cdtypename + "'";
                        rowlist = bll.ExecuteStoreQuery<int>(strcountsql).ToList();
                        if (rowlist[0] > 1)
                            typecount = typecount + rowlist[0];

                        //DList = list.Where(o => o.PID == pid && o.DeviceTypeName == cdtypename && o.DataTypeID != 23).ToList();
                        //Dcount = from r in DList orderby r.DID descending group r by r.DID;
                        //Dc = Dcount.Count();
                        //if (Dc > 1)
                        //    typecount = typecount + Dc;



                        pointcount = 0;
                        int pc = 0;
                        //strcountsql = "select COUNT(distinct REPLACE(REPLACE(REPLACE(tagname,'a',''),'b',''),'c','')) row_count from V_DeviceInfoState_PDR1 where did=" + model.DID + " and " + orlike;
                        strcountsql = "select top 1 COUNT(abcid) from V_DeviceInfoState_PDR1 where did=" + model.DID + strquery + " and abcid>0 group by abcid order by COUNT(abcid) desc";
                        rowlist = bll.ExecuteStoreQuery<int>(strcountsql).ToList();
                        if (rowlist.Count > 0)
                            pointcount = rowlist[0] + 1;

                        pointcount = pointcount + list.Where(d => d.DID == model.DID && d.ABCID == 0).Count();
                        if (pcount == 1)
                            sbtable.Append("<td class=\"gs05\"></td><td class=\"gs05\"></td></tr>");
                        else if (pcount == 2)
                            sbtable.Append("<td class=\"gs05\"></td></tr>");
                        if (icount > 0)
                            sbtable.Append("<tr style=\"height: 10px\"></tr>");
                        sbtable.Append("<tr><td class=\"gs01\" style=\"width: 15%\" rowspan=\"" + typecount + "\">");
                        sbtable.Append(cdtypename + "</td>");
                        sbtable.Append("<td class=\"gs02\" style=\"width: 23%\" rowspan=\"" + pointcount + "\">");
                        sbtable.Append(currname + "</td>");

                        if (PositionHasABS(list, model.DID))
                        {
                            sbtable.Append("<th class=\"gs03\" style=\"width: 25%;\">");
                            sbtable.Append(model.TypeName + DataUnitsReplace(model.Units) + "</th>");
                            sbtable.Append("<th class=\"gs06\" style=\"width: 12%\">A</th><th class=\"gs07\" style=\"width: 12%\">B</th><th class=\"gs08\" style=\"width: 12%\">C</th>");
                            sbtable.Append("</tr>");
                        }
                        pcount = 0;
                        bcatename = "";
                        //else
                        //    sbtable.Append("<th class=\"gs05\" style=\"width: 36%\" colspan=\"3\"></th>");

                    }
                    else if (!currname.Equals(beforename))//如果设备名称不相同
                    {
                        pointcount = 0;
                        //strcountsql = "select COUNT(distinct REPLACE(REPLACE(REPLACE(tagname,'a',''),'b',''),'c','')) row_count from V_DeviceInfoState_PDR1 where did=" + model.DID + " and " + orlike;
                        strcountsql = "select top 1 COUNT(abcid) from V_DeviceInfoState_PDR1 where did=" + model.DID + strquery + " and abcid>0 group by abcid order by COUNT(abcid) desc";
                        List<int> rowlist = bll.ExecuteStoreQuery<int>(strcountsql).ToList();
                        if (rowlist.Count > 0)
                            pointcount = rowlist[0] + 1;
                        pointcount = pointcount + list.Where(d => d.DID == model.DID && d.ABCID == 0).Count();

                        if (pcount == 1)
                            sbtable.Append("<td class=\"gs05\"></td><td class=\"gs05\"></td></tr>");
                        else if (pcount == 2)
                            sbtable.Append("<td class=\"gs05\"></td></tr>");
                        if (icount > 0)
                            sbtable.Append("<tr style=\"height: 10px\"></tr>");
                        sbtable.Append("<tr><td class=\"gs02\" rowspan=\"" + pointcount + "\">");
                        sbtable.Append(currname + "</td>");

                        if (PositionHasABS(list, model.DID))
                        {
                            sbtable.Append("<th class=\"gs03\" style=\"width: 25%;\">");
                            sbtable.Append(model.TypeName + DataUnitsReplace(model.Units) + "</th>");
                            sbtable.Append("<th class=\"gs06\" style=\"width: 12%\">A</th><th class=\"gs07\" style=\"width: 12%\">B</th><th class=\"gs08\" style=\"width: 12%\">C</th>");
                            sbtable.Append("</tr>");
                        }
                        pcount = 0;
                        bcatename = "";
                    }
                    if (model.ABCID > 0)
                    {
                        if (tcount > 0)
                        {
                            pcount = tcount = 0;
                        }
                        if (model.ABCID == 1)
                        {
                            if (pcount == 1)
                                sbtable.Append("<td class=\"gs05\"></td><td class=\"gs05\"></td></tr>");
                            else if (pcount == 2)
                                sbtable.Append("<td class=\"gs05\"></td></tr>");
                            if ((ccatename.Equals(bcatename) || bcatename.Equals("")) && model.DataTypeID == 1)
                                sbtable.Append("<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>");
                            else
                                sbtable.Append("<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>");
                            pcount = 0;
                        }
                        else if (model.ABCID == 2)
                        {
                            if (pcount == 0)
                            {
                                if ((ccatename.Equals(bcatename) || bcatename.Equals("")) && model.DataTypeID == 1)
                                    sbtable.Append("<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>");
                                else
                                    sbtable.Append("<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>");
                                sbtable.Append("<td class=\"gs05\"></td>");
                            }
                            else if (pcount == 2)
                            {
                                sbtable.Append("<td class=\"gs05\"></td></tr>");
                                if ((ccatename.Equals(bcatename) || bcatename.Equals("")) && model.DataTypeID == 1)
                                    sbtable.Append("<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>");
                                else
                                    sbtable.Append("<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>");
                                sbtable.Append("<td class=\"gs05\"></td>");
                            }
                            pcount = 1;
                        }
                        else if (model.ABCID == 3)
                        {
                            if (pcount == 0)
                            {
                                if ((ccatename.Equals(bcatename) || bcatename.Equals("")) && model.DataTypeID == 1)
                                    sbtable.Append("<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>");
                                else
                                    sbtable.Append("<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>");
                                sbtable.Append("<td class=\"gs05\"></td><td class=\"gs05\"></td>");
                            }
                            else if (pcount == 1)
                                sbtable.Append("<td class=\"gs05\"></td>");
                            pcount = 2;
                        }
                        sbtable.Append("<td class=\"gs05\"><a  onclick = 'Hg(" + did + "," + tagid + ")'>" + InputValue + "</a></td>");
                        if (pcount == 2)
                        {
                            sbtable.Append("</tr>");
                            pcount = 0;
                        }
                        else
                            pcount++;
                    }
                    else
                    {
                        if (pcount == 0)
                        {
                            tcount++;
                        }
                        else
                        { //sbtable.Append("<tr>");

                            int needtd = 3 - pcount;
                            if (needtd > 0)
                            {
                                while (needtd > 0)
                                {
                                    sbtable.Append("<td class=\"gs05\"></td>");
                                    needtd--;
                                }
                                sbtable.Append("</tr>");
                            }
                        }
                        pcount = 0;
                        sbtable.Append("<td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "" + "</td><td class=\"gs05\" colspan=\"3\"><a onclick = 'Hg(" + did + "," + tagid + ")'>" + InputValue + "</a></tr>");
                    }
                    icount++;
                    beforename = currname;
                    bdtypename = cdtypename;
                    bcatename = ccatename;
                }
                if (pcount > 0)
                {
                    int addtd = 3 - pcount;
                    if (addtd > 0)
                    {
                        while (addtd > 0)
                        {
                            sbtable.Append("<td class=\"gs05\"></td>");
                            addtd--;
                        }
                        sbtable.Append("</tr>");
                    }
                }
                sbtable.Append("<tr><td colspan='6' class=\"gs02\" style=\"padding-right:20px;\">最新更新时间：" + newtime + "</td></tr>");
                sbtable.Append("</tbody></table>");
                string result = sbtable.ToString();
                string strJson = JsonConvert.SerializeObject(result);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(error);
            }
        }
        private bool PositionHasABSbyCid(List<V_DeviceInfoState_PDR1> list, int did)
        {
            list = list.Where(d => d.CID == did && d.ABCID > 0).ToList();
            if (list.Count > 0)
                return true;
            else
                return false;
        }
        //判断设备是否有三相数据
        private bool PositionHasABS(List<V_DeviceInfoState_PDR1> list, int did)
        {
            list = list.Where(d => d.DID == did && d.ABCID > 0).ToList();
            if (list.Count > 0)
                return true;
            else
                return false;
        }
        //获取设备报警状态
        private int getAlarmState(List<TempAlarm> list, int did)
        {
            int state = 0;
            list = list.Where(t => t.TID == did).ToList();
            if (list.Count > 0)
                state = list[0].StateID;
            return state;
        }
        private int getAlarmStateByCID(List<TempAlarm> list, int cid)
        {
            int state = 0;
            list = list.Where(t => t.TID == cid).ToList();
            if (list.Count > 0)
                state = list[0].StateID;
            return state;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="dids"></param>
        /// <returns></returns>
        public ActionResult GetMaxTempByCID(int pid = 0, string cids = "-1")
        {
            string InputValue, strAdd = " and cid is not null ";
            if (cids != "-1")
                strAdd += " and cid in (" + cids + ") ";
            //string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + " and (DataTypeID<30 and DataTypeID!=23) order by did,DataTypeID,Position,ABCID";
            string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + strAdd + " and DataTypeID!=23 order by cid,OrderNo,TagID,ABCID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            int currcid = 0, beforeCid = 0, icount = 0, pcount = 0, tcount = 0;//当前设备ID，上一个设备ID，最高温度,计数器
            string strtemp = "", strtable = "";//监测中,最高温度
            double maxtemp = 0, pv;
            string positionname = "", ctypename = "", btypename = "", strcountsql = "";
            int AlarmStatus = 0, stralarmtype = 0;//报警类型
            StringBuilder sbinfo = new StringBuilder();
            bool DevicehasABC = false;
            int dtcount = 0;//设备数据行数
            //获取所有报警列表
            strsql = "select CID TID,AlarmState StateID from (select row_number() over(partition by cid order by AlarmState desc) as rownum, * from t_AlarmTable_en where pid =" + pid + strAdd + " and AlarmState>0) t where t.rownum = 1";
            List<TempAlarm> alarmlist = bll.ExecuteStoreQuery<TempAlarm>(strsql).ToList();
            List<TempAlarm> listtemp = new List<TempAlarm>();
            foreach (V_DeviceInfoState_PDR1 model in list)
            {
                if (model.CID == null)
                {
                    currcid = 0;
                }
                else
                {
                    currcid = (int)model.CID;
                }
               
                ctypename = model.TypeName;
                positionname = model.Position;// getPositionName(model.Position);
                AlarmStatus = getAlarmStateByCID(alarmlist, currcid);
                if ((model.TypeName.Contains("温度") || model.TypeName.Contains("湿度")) && model.PV == 0)
                {
                    InputValue = "--";
                }
                else if (model.DataTypeID == 51)//功率因素取绝对值
                {
                    double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                    strCashAmt = Math.Round(strCashAmt, 3);//保留三位小数
                    InputValue = strCashAmt + "";
                }
                else
                    InputValue = model.PV.ToString();

                if (currcid != beforeCid)
                {
                    dtcount = 0;
                    //strcountsql = "select top 1 COUNT(abcid) from V_DeviceInfoState_PDR1 where cid=" + model.CID + " and DataTypeID!=23 and abcid>0 group by abcid order by COUNT(abcid) desc";
                    //List<int> rowlist = bll.ExecuteStoreQuery<int>(strcountsql).ToList();
                    //if (rowlist.Count > 0)
                    //    dtcount = rowlist[0] + 1;
                    dtcount = dtcount + list.Where(d => d.CID == model.CID && d.ABCID == 0).Count();

                    if (icount > 0)
                    {
                        if (pcount > 0)
                        {
                            int needtd = 3 - pcount;
                            if (needtd > 0)
                            {
                                while (needtd > 0)
                                {
                                    strtable = strtable + "<td class=\"gs05\"></td>";
                                    needtd--;
                                }
                                strtable = strtable + "</tr>";
                            }
                        }
                        strtable += "</tbody></table></span>";
                        if (maxtemp > 0)
                        {
                            strtemp = "<p class=\"p2\">" + maxtemp + "℃</p>";
                        }
                        sbinfo.Append(beforeCid + "|" + strtemp + "|" + strtable + "|" + stralarmtype + ",");
                    }
                    strtable = "<a class=\"tabletitle\">" + model.CName + "</a><span id=\"div" + model.CID + "\" style='display:block;'><table align=\"center\" class=\"bgw2\">";
                    strtable = strtable + "<tbody align=\"center\" style=\"vertical-align: middle;display:block;";
                    if (dtcount > 6)
                        strtable = strtable + "height:330px;overflow-y:scroll;overflow-x:hidden;";
                    strtable = strtable + "\" id=\"tbody" + model.CID + "\"><tr style=\"height: 10px\"></tr>";

                    DevicehasABC = false;
                    //如果包含三相，则添加标题
                    if (PositionHasABSbyCid(list, (int)model.CID))
                    {
                        strtable = strtable + "<tr><th class=\"gs03\" style=\"width: 40%;\"></th><th class=\"gs06\" style=\"width: 20%\">A</th><th class=\"gs07\" style=\"width: 20%\">B</th><th class=\"gs08\" style=\"width: 20%\">C</th></tr>";
                        DevicehasABC = true;
                    }
                    pcount = 0;
                    strtemp = "";
                    maxtemp = 0;
                    btypename = "";
                    stralarmtype = 0;
                }

                icount++;//记录不同分类的测点值
                pv = (double)model.PV;
                //报警仅仅针对温度报警
                //if (model.DataTypeID == 1 && pv > maxtemp)//记录最高温度值
                {
                    maxtemp = pv;
                    if (AlarmStatus > stralarmtype)
                        stralarmtype = AlarmStatus;// getAlarmIco(AlarmStatus);
                }
                if (model.ABCID > 0)
                {
                    if (tcount > 0)
                    {
                        pcount = tcount = 0;
                    }
                    if (model.ABCID == 1)
                    {
                        if (pcount == 1)
                            strtable = strtable + "<td class=\"gs05\"></td><td class=\"gs05\"></td></tr>";
                        else if (pcount == 2)
                            strtable = strtable + "<td class=\"gs05\"></td></tr>";
                        if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                            strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                        else
                            strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                        pcount = 0;
                    }
                    else if (model.ABCID == 2)
                    {
                        if (pcount == 0)
                        {
                            if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                            else
                                strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                            strtable = strtable + "<td class=\"gs05\"></td>";
                        }
                        else if (pcount == 2)
                        {
                            strtable = strtable + "<td class=\"gs05\"></td></tr>";
                            if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                            else
                                strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                            strtable = strtable + "<td class=\"gs05\"></td>";
                        }
                        pcount = 1;
                    }
                    else if (model.ABCID == 3)
                    {
                        if (pcount == 0)
                        {
                            if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                            else
                                strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                            strtable = strtable + "<td class=\"gs05\"></td><td class=\"gs05\"></td>";
                        }
                        else if (pcount == 1)
                            strtable = strtable + "<td class=\"gs05\"></td>";
                        pcount = 2;
                    }
                    strtable = strtable + "<td class=\"gs05\">" + InputValue + "</td>";
                    if (pcount == 2)
                    {
                        strtable = strtable + "</tr>";
                        pcount = 0;
                    }
                    else
                        pcount++;
                }
                else
                {
                    if (pcount == 0)
                    {
                        tcount++;
                    }
                    else
                    { //sbtable.Append("<tr>");

                        int needtd = 3 - pcount;
                        if (needtd > 0)
                        {
                            while (needtd > 0)
                            {
                                strtable = strtable + "<td class=\"gs05\"></td>";
                                needtd--;
                            }
                            strtable = strtable + "</tr>";
                        }
                    }
                    pcount = 0;
                    int defaultwith = 40;
                    if (!DevicehasABC)
                        defaultwith = 80;

                    strtable = strtable + "<tr><td class=\"gs03\" style=\"width: " + defaultwith + "%\">" + positionname + DataUnitsReplace(model.Units) + "" + "</td><td class=\"gs05\" colspan=\"3\">" + InputValue + "</td></tr>";
                }
                //添加收尾
                if (icount == list.Count)
                {

                    if (pcount > 0)
                    {
                        int addtd = 3 - pcount;
                        if (addtd > 0)
                        {
                            while (addtd > 0)
                            {
                                strtable = strtable + "<td class=\"gs05\"></td>";
                                addtd--;
                            }
                            strtable = strtable + "</tr>";
                        }
                    }
                    strtable += "</tbody></table></span>";
                    if (maxtemp > 0)
                    {
                        strtemp = "<p class=\"p2\">" + maxtemp + "℃</p>";
                    }
                    sbinfo.Append(beforeCid + "|" + strtemp + "|" + strtable + "|" + stralarmtype);
                }
                beforeCid = currcid;
                btypename = ctypename;
            }
            string stralarm = "";//报警列表
            if (listtemp.Count > 0)
            {
                var query = listtemp.GroupBy(x => x.TID).SelectMany(x => x.OrderByDescending(y => y.StateID).Take(1));
                listtemp = query.ToList();
                foreach (TempAlarm ta in listtemp)
                {
                    stralarm = stralarm + ta.TID + ":" + ta.StateID + ",";
                }
                stralarm = stralarm.TrimEnd(',');
            }
            //List<V_DeviceInfoState_PDR1> listu = list.Where(r => r.DID == 470 && r.DataTypeID == 3).ToList();//取电压
            //int rowcount = 0;
            string maxua = "0", maxub = "0", maxuc = "0", maxu = "";
            //foreach (V_DeviceInfoState_PDR1 model in listu)
            //{
            //    if (rowcount == 0 && model.ABCID == 1)
            //    {
            //        maxua = model.PV + "";
            //    }
            //    else if (rowcount == 1 && model.ABCID == 2)
            //    {
            //        maxub = model.PV + "";
            //    }
            //    else if (rowcount == 2 && model.ABCID == 3)
            //    {
            //        maxuc = model.PV + "";
            //        break;
            //    }
            //    rowcount++;
            //}
            //maxu = "<p>" + maxua + "</p><p>" + maxub + "</p><p>" + maxuc + "</p>";
            sbinfo.Append("$" + stralarm + "$" + maxu);
            string result = sbinfo.ToString();
            string strJson = JsonConvert.SerializeObject(result);
            return Content(strJson);
        }
        //获取设备的最高温度
        public ActionResult GetMaxTemp(int pid = 0, string dids = "-1")
        {
            DateTime DateTime1 = DateTime.Now;
            Debug.WriteLine("刚进来时间：" + DateTime1);
            string InputValue, strAdd = "";
            if (dids != "-1")
                strAdd = " and did in (" + dids + ")";
            //string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + " and (DataTypeID<30 and DataTypeID!=23) order by did,DataTypeID,Position,ABCID";
            string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + strAdd + " and DataTypeID!=23 order by did,DataTypeID,TagID,ABCID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();

            Debug.WriteLine("strsql,耗时：" + ((TimeSpan)(DateTime.Now - DateTime1)).TotalMilliseconds + "毫秒");

            int currdid = 0, beforedid = 0, icount = 0, pcount = 0, tcount = 0;//当前设备ID，上一个设备ID，最高温度,计数器
            string strtemp = "<p class=\"p2\">监测中</p>", strtable = "";//监测中,最高温度
            double maxtemp = 0, pv;
            string positionname = "", ctypename = "", btypename = "";
            int AlarmStatus = 0, stralarmtype = 0;//报警类型
            StringBuilder sbinfo = new StringBuilder();
            bool DevicehasABC = false;
            int dtcount = 0;//设备数据行数
            //获取所有报警列表
            strsql = "select DID TID,AlarmState StateID from (select row_number() over(partition by did order by AlarmState desc) as rownum, * from t_AlarmTable_en where pid =" + pid + strAdd + " and AlarmState>0) t where t.rownum = 1";
            List<TempAlarm> alarmlist = bll.ExecuteStoreQuery<TempAlarm>(strsql).ToList();
            Debug.WriteLine("报警列表,耗时：" + ((TimeSpan)(DateTime.Now - DateTime1)).TotalMilliseconds + "毫秒");
            List<TempAlarm> listtemp = new List<TempAlarm>();
            foreach (V_DeviceInfoState_PDR1 model in list)
            {
                currdid = model.DID;
                ctypename = model.TypeName;
                positionname = model.Position;// getPositionName(model.Position);
                AlarmStatus = getAlarmState(alarmlist, currdid);
                if ((model.TypeName.Contains("温度") || model.TypeName.Contains("湿度")) && model.PV == 0)
                {
                    InputValue = "--";
                }
                else if (model.DataTypeID == 51)//功率因素取绝对值
                {
                    double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                    strCashAmt = Math.Round(strCashAmt, 3);//保留三位小数
                    InputValue = strCashAmt + "";
                }
                else if (pid == 105 && model.DeviceTypeName.Equals("变压器") && model.PV == 0)
                    InputValue = "--";
                else if (model.DID == 480 && model.PV == 0)//直流屏
                    InputValue = "--";
                else
                    InputValue = model.PV.ToString();

                if (currdid != beforedid)
                {
                    dtcount = 0;
                    //strcountsql = "select top 1 COUNT(abcid) from V_DeviceInfoState_PDR1 where did=" + model.DID + " and DataTypeID!=23 and abcid>0 group by abcid order by COUNT(abcid) desc";
                   // List<int> rowlist = bll.ExecuteStoreQuery<int>(strcountsql).ToList();
                    Debug.WriteLine("strcountsql,耗时：" + ((TimeSpan)(DateTime.Now - DateTime1)).TotalMilliseconds + "毫秒");
                    //if (rowlist.Count > 0)
                    //    dtcount = rowlist[0] + 1;
                    dtcount = dtcount + list.Where(d => d.DID == model.DID && d.ABCID == 0).Count();

                    if (icount > 0)
                    {
                        if (pcount > 0)
                        {
                            int needtd = 3 - pcount;
                            if (needtd > 0)
                            {
                                while (needtd > 0)
                                {
                                    strtable = strtable + "<td class=\"gs05\"></td>";
                                    needtd--;
                                }
                                strtable = strtable + "</tr>";
                            }
                        }
                        strtable += "</tbody></table></span>";
                        if (maxtemp > 0)
                        {
                            strtemp = "<p class=\"p2\">" + maxtemp + "℃</p>";
                        }
                        sbinfo.Append(beforedid + "|" + strtemp + "|" + strtable + "|" + stralarmtype + ",");
                    }
                    strtable = "<a class=\"tabletitle\">" + model.DeviceName + "</a><span id=\"div" + model.DID + "\" style='display:block;'><table align=\"center\" class=\"bgw2\">";
                    strtable = strtable + "<tbody align=\"center\" style=\"vertical-align: middle;display:block;";
                    if (dtcount > 6)
                        strtable = strtable + "height:330px;overflow-y:scroll;overflow-x:hidden;";
                    strtable = strtable + "\" id=\"tbody" + model.DID + "\"><tr style=\"height: 10px\"></tr>";

                    DevicehasABC = false;
                    //如果包含三相，则添加标题
                    if (PositionHasABS(list, model.DID))
                    {
                        strtable = strtable + "<tr><th class=\"gs03\" style=\"width: 40%;\"></th><th class=\"gs06\" style=\"width: 20%\">A</th><th class=\"gs07\" style=\"width: 20%\">B</th><th class=\"gs08\" style=\"width: 20%\">C</th></tr>";
                        DevicehasABC = true;
                    }
                    pcount = 0;
                    strtemp = "<p class=\"p2\">采集中</p>";
                    maxtemp = 0;
                    btypename = "";
                    stralarmtype = 0;
                }

                icount++;//记录不同分类的测点值
                pv = (double)model.PV;
                //报警仅仅针对温度报警
                //if (model.DataTypeID == 1 && pv > maxtemp)//记录最高温度值
                {
                    maxtemp = pv;
                    if (AlarmStatus > stralarmtype)
                        stralarmtype = AlarmStatus;// getAlarmIco(AlarmStatus);
                }
                if (model.ABCID > 0)
                {
                    if (tcount > 0)
                    {
                        pcount = tcount = 0;
                    }
                    if (model.ABCID == 1)
                    {
                        if (pcount == 1)
                            strtable = strtable + "<td class=\"gs05\"></td><td class=\"gs05\"></td></tr>";
                        else if (pcount == 2)
                            strtable = strtable + "<td class=\"gs05\"></td></tr>";
                        if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                            strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                        else
                            strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                        pcount = 0;
                    }
                    else if (model.ABCID == 2)
                    {
                        if (pcount == 0)
                        {
                            if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                            else
                                strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                            strtable = strtable + "<td class=\"gs05\"></td>";
                        }
                        else if (pcount == 2)
                        {
                            strtable = strtable + "<td class=\"gs05\"></td></tr>";
                            if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                            else
                                strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                            strtable = strtable + "<td class=\"gs05\"></td>";
                        }
                        pcount = 1;
                    }
                    else if (model.ABCID == 3)
                    {
                        if (pcount == 0)
                        {
                            if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                            else
                                strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                            strtable = strtable + "<td class=\"gs05\"></td><td class=\"gs05\"></td>";
                        }
                        else if (pcount == 1)
                            strtable = strtable + "<td class=\"gs05\"></td>";
                        pcount = 2;
                    }
                    strtable = strtable + "<td class=\"gs05\">" + InputValue + "</td>";
                    if (pcount == 2)
                    {
                        strtable = strtable + "</tr>";
                        pcount = 0;
                    }
                    else
                        pcount++;
                }
                else
                {
                    if (pcount == 0)
                    {
                        tcount++;
                    }
                    else
                    { //sbtable.Append("<tr>");

                        int needtd = 3 - pcount;
                        if (needtd > 0)
                        {
                            while (needtd > 0)
                            {
                                strtable = strtable + "<td class=\"gs05\"></td>";
                                needtd--;
                            }
                            strtable = strtable + "</tr>";
                        }
                    }
                    pcount = 0;
                    int defaultwith = 40;
                    if (!DevicehasABC)
                        defaultwith = 80;

                    strtable = strtable + "<tr><td class=\"gs03\" style=\"width: " + defaultwith + "%\">" + positionname + DataUnitsReplace(model.Units) + "" + "</td><td class=\"gs05\" colspan=\"3\">" + InputValue + "</td></tr>";
                }
                //添加收尾
                if (icount == list.Count)
                {

                    if (pcount > 0)
                    {
                        int addtd = 3 - pcount;
                        if (addtd > 0)
                        {
                            while (addtd > 0)
                            {
                                strtable = strtable + "<td class=\"gs05\"></td>";
                                addtd--;
                            }
                            strtable = strtable + "</tr>";
                        }
                    }
                    strtable += "</tbody></table></span>";
                    if (maxtemp > 0)
                    {
                        strtemp = "<p class=\"p2\">" + maxtemp + "℃</p>";
                    }
                    sbinfo.Append(beforedid + "|" + strtemp + "|" + strtable + "|" + stralarmtype);
                }
                beforedid = currdid;
                btypename = ctypename;
            }
            string stralarm = "";//报警列表
            if (listtemp.Count > 0)
            {
                var query = listtemp.GroupBy(x => x.TID).SelectMany(x => x.OrderByDescending(y => y.StateID).Take(1));
                listtemp = query.ToList();
                foreach (TempAlarm ta in listtemp)
                {
                    stralarm = stralarm + ta.TID + ":" + ta.StateID + ",";
                }
                stralarm = stralarm.TrimEnd(',');
            }
            List<V_DeviceInfoState_PDR1> listu = list.Where(r => r.DID == 470 && r.DataTypeID == 3).ToList();//取电压
            Debug.WriteLine("取电压,耗时：" + ((TimeSpan)(DateTime.Now - DateTime1)).TotalMilliseconds + "毫秒");
            int rowcount = 0;
            string maxua = "0", maxub = "0", maxuc = "0", maxu = "";
            foreach (V_DeviceInfoState_PDR1 model in listu)
            {
                if (rowcount == 0 && model.ABCID == 1)
                {
                    maxua = model.PV + "";
                }
                else if (rowcount == 1 && model.ABCID == 2)
                {
                    maxub = model.PV + "";
                }
                else if (rowcount == 2 && model.ABCID == 3)
                {
                    maxuc = model.PV + "";
                    break;
                }
                rowcount++;
            }
            maxu = "<p>" + maxua + "</p><p>" + maxub + "</p><p>" + maxuc + "</p>";
            sbinfo.Append("$" + stralarm + "$" + maxu);
            string result = sbinfo.ToString();
            string strJson = JsonConvert.SerializeObject(result);
            DateTime DateTime2 = DateTime.Now;
            TimeSpan span = (TimeSpan)(DateTime2 - DateTime1);
            Debug.WriteLine("结束时间：" + DateTime2);
            Debug.WriteLine("总耗时：" + span.TotalMilliseconds + "毫秒");
            return Content(strJson);
        }
        private string getAlarmIco(string alarmstatus)
        {
            string reurl = "";
            if (alarmstatus.Equals("0"))
                reurl = "alarmico";
            else
                reurl = "alarmico_" + alarmstatus;
            return "/Content/yicitu/" + reurl + ".png";
        }
        public class TempAlarm
        {
            public int TID { get; set; }
            public int StateID { get; set; }
        }
        //获取设备所属变压器--支线
        private int GetTIDByDID(int did)
        {
            string strvalue = "," + did + ",";
            string t1 = ",348,349,401,402,363,364,365,366,339,";
            string t2 = ",367,368,369,403,404,350,340,";
            string t3 = ",346,347,405,406,407,354,355,356,357,408,341,";
            string t4 = ",409,358,359,360,410,361,362,411,412,345,342,";
            string t5 = ",351,353,413,414,370,371,372,373,343,";
            string t6 = ",374,415,375,376,377,378,379,416,417,352,344,";
            int reTid = 1;
            if (t1.Contains(strvalue))
                reTid = 1;
            else if (t2.Contains(strvalue))
                reTid = 2;
            else if (t3.Contains(strvalue))
                reTid = 3;
            else if (t4.Contains(strvalue))
                reTid = 4;
            else if (t5.Contains(strvalue))
                reTid = 5;
            else if (t6.Contains(strvalue))
                reTid = 6;
            return reTid;
        }
        //获取设备测点信息
        public ActionResult GetDeviceInfo(int did)
        {
            string InputValue;
            //string strsql = "select * from V_DeviceInfoState_PDR1 where did=" + did + " and (DataTypeID<30 and DataTypeID!=23) order by DataTypeID,Position,ABCID";
            string strsql = "select * from V_DeviceInfoState_PDR1 where did=" + did + " and DataTypeID!=23 order by cid,OrderNo,TagID,ABCID";
           
            int currdid = 0, beforedid = 0, icount = 0, pcount = 0, tcount = 0;//当前设备ID，上一个设备ID，最高温度,计数器
            string strtable = "";//设备测点详情
            string positionname = "", ctypename = "", btypename = "";
            int tagid = 0;
            string strcountsql = "", pointstatus = "";
            int currCid = 0, beforeCid = 0;
            try
            {
                List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
                List<t_DM_DeviceInfo> Dlist = bll.t_DM_DeviceInfo.Where(w => w.DID == did).ToList();
                
                if (Dlist.Count > 0)
                {
                    t_DM_DeviceInfo D = Dlist.First();
                    strtable = "<table align=\"center\" class=\"bgw2\"><tbody align=\"center\" style=\"vertical-align: middle;\">";
                    strtable = strtable + "<tr><td colspan=\"4\" style=\"background-color: #FFF\">" + D.DeviceName + "</td></tr>";
                }
                foreach (V_DeviceInfoState_PDR1 model in list)
                {
                    currdid = model.DID;
                    ctypename = model.TypeName;
                    tagid = model.TagID;
                    did = model.DID;

                    if (model.CID != null)
                    {
                        currCid = (int)model.CID;
                    }                    
                    pointstatus = loadAlarmStatus(tagid, model.AlarmStatus);//获取测点状态
                    if ((model.TypeName.Contains("温度") || model.TypeName.Contains("湿度")) && model.PV == 0)
                    {
                        InputValue = "--";
                    }
                    else if (model.DataTypeID == 51)//功率因素取绝对值
                    {
                        double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                        strCashAmt = Math.Round(strCashAmt, 3);//保留三位小数
                        InputValue = strCashAmt + "";
                    }
                    else if (model.DataTypeID == 21)//小气象 小雨、中雨、大雨、暴雨、大暴雨、特大暴雨
                    {
                        double PV = Convert.ToDouble(model.PV);
                        if (PV > 0 && PV < 10)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：小雨";
                        }
                        else if (PV >= 10 && PV <= 24.9)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：中雨";
                        }
                        else if (PV >= 25 && PV <= 49.9)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：大雨";
                        }
                        else if (PV > 50 && PV <= 99.9)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：暴雨";
                        }
                        else if (PV >= 100 && PV <= 149.9)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：大暴雨";
                        }
                        else if (PV >= 250)
                        {
                            InputValue = "当前雨量：" + PV + "mm/分钟，当前级别：特大暴雨";
                        }
                        else
                        {
                            InputValue = "无雨";
                        }
                    }
                    else if (model.PID == 105 && model.DeviceTypeName.Equals("变压器") && model.PV == 0)
                        InputValue = "--";
                    else if (model.DID == 480 && model.PV == 0)//直流屏
                        InputValue = "--";
                    else
                        InputValue = model.PV.ToString();

                    positionname = model.Position;// getPositionName(model.Position);

                    if (currdid != beforedid)
                    {
                        if (icount > 0)
                        {
                            strtable += "</table>";
                        }
                        strtable += "<tr style=\"height: 10px\"></tr>";
                        //如果包含三相，则添加标题
                        if (PositionHasABS(list, model.DID))
                            strtable = strtable + "<tr><th class=\"gs03\" style=\"width: 40%;\"></th><th class=\"gs06\" style=\"width: 20%\">A</th><th class=\"gs07\" style=\"width: 20%\">B</th><th class=\"gs08\" style=\"width: 20%\">C</th></tr>";
                        pcount = 0;
                        icount = 0;
                        btypename = "";
                    }

                    //增加回路
                    if (currCid != beforeCid)
                    {
                        strtable = strtable + "<tr><td colspan=\"4\" style=\"background-color: #DADADA\">" + model.CName + "</td></tr>";
                        beforeCid = currCid;
                    }

                    icount++;//记录不同分类的测点值
                    if (model.ABCID > 0)
                    {
                        if (tcount > 0)
                        {
                            pcount = tcount = 0;
                        }
                        if (model.ABCID == 1)
                        {
                            if (pcount == 1)
                                strtable = strtable + "<td class=\"gs05\"></td><td class=\"gs05\"></td></tr>";
                            else if (pcount == 2)
                                strtable = strtable + "<td class=\"gs05\"></td></tr>";
                            if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                            else
                                strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                            pcount = 0;
                        }
                        else if (model.ABCID == 2)
                        {
                            if (pcount == 0)
                            {
                                if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                    strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                                else
                                    strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                                strtable = strtable + "<td class=\"gs05\"></td>";
                            }
                            else if (pcount == 2)
                            {
                                strtable = strtable + "<td class=\"gs05\"></td></tr>";
                                if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                    strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                                else
                                    strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                                strtable = strtable + "<td class=\"gs05\"></td>";
                            }
                            pcount = 1;
                        }
                        else if (model.ABCID == 3)
                        {
                            if (pcount == 0)
                            {
                                if ((ctypename.Equals(btypename) || btypename.Equals("")) && model.DataTypeID == 1)
                                    strtable = strtable + "<tr> <td class=\"gs01\" style=\"width: 15%\">" + positionname + "</td>";
                                else
                                    strtable = strtable + "<tr> <td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "</td>";
                                strtable = strtable + "<td class=\"gs05\"></td><td class=\"gs05\"></td>";
                            }
                            else if (pcount == 1)
                                strtable = strtable + "<td class=\"gs05\"></td>";
                            pcount = 2;
                        }
                        strtable = strtable + "<td class=\"gs05\">" + InputValue + " </td>";
                        if (pcount == 2)
                        {
                            strtable = strtable + "</tr>";
                            pcount = 0;
                        }
                        else
                            pcount++;
                    }
                    else
                    {
                        if (pcount == 0)
                        {
                            tcount++;
                        }
                        else
                        { //sbtable.Append("<tr>");

                            int needtd = 3 - pcount;
                            if (needtd > 0)
                            {
                                while (needtd > 0)
                                {
                                    strtable = strtable + "<td class=\"gs05\"></td>";
                                    needtd--;
                                }
                                strtable = strtable + "</tr>";
                            }
                        }
                        pcount = 0;
                        strtable = strtable + "<td class=\"gs03\" style=\"width: 15%\">" + positionname + DataUnitsReplace(model.Units) + "" + "</td><td class=\"gs05\" colspan=\"3\">" + InputValue + " </tr>";

                    }
                    //添加收尾
                    if (icount == list.Count)
                    {
                        if (pcount > 0)
                        {
                            int addtd = 3 - pcount;
                            if (addtd > 0)
                            {
                                while (addtd > 0)
                                {
                                    strtable = strtable + "<td class=\"gs05\"></td>";
                                    addtd--;
                                }
                                strtable = strtable + "</tr>";
                            }
                        }
                        strtable += "</tbody></table>";
                    }
                    beforedid = currdid;
                    btypename = ctypename;
                }

            }
            catch (Exception ex)
            {
                //
            }
            string strJson = JsonConvert.SerializeObject(strtable);
            return Content(strJson);
        }
        #region 实时电力参数测点值
        //获取设备测点列表
        public ActionResult PointsInfo(int did, int pid = 0, int typeid = 0)
        {
            string addSql = "";
            if (pid == 0)
            {
                pid = Convert.ToInt32(HomeController.GetPID(CurrentUser.UNITList).Split(',')[0]);
                //pid = Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
            }
            if (typeid > 0)
                addSql = " and DataTypeID=" + typeid;
            addSql = addSql + " and (DID=" + did + " or (DataTypeID=12 and pv>0)) and DataTypeID!=23 ";// and (DataTypeID<30 and DataTypeID!=23)";

            //加载设备测点和环境温度
            string query = " where pid=" + pid + addSql;
            string strsql = "select * from V_DeviceInfoState_PDR1 " + query + " order by DataTypeID,Position,ABCID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            StringBuilder sbpoint = new StringBuilder();
            string TypeName = "", thisName = "";
            bool isSame = false;
            int count = 0, tcounts = 0, rowcounts = 0;
            sbpoint.Append("<table width=\"98%\" cellpadding=\"\" cellspacing=\"\" border=\"0\">");
            int rowspan = 0;
            int columns = 5, needadd = 0;
            foreach (V_DeviceInfoState_PDR1 points in list)
            {
                thisName = points.TypeName;
                if (TypeName.Equals(thisName))
                    isSame = true;
                else
                {
                    //tcounts = list.Where(p => p.TypeName == points.TypeName).ToList().Count;
                    //if (tcounts % columns == 0)
                    //    rowspan = tcounts / columns;
                    //else
                    //    rowspan = tcounts / columns + 1;
                    isSame = false;
                }
                if (!isSame)
                {
                    if (count > 0)
                    {
                        needadd = count % 5;
                        if (needadd > 0)
                        {
                            for (int i = 0; i < 5 - needadd; i++)
                            {
                                sbpoint.Append("<td></td>");
                            }
                        }
                        count = 0;
                        sbpoint.Append("</tr>");
                        sbpoint.Append("</tr></table></td></tr>");
                    }
                    sbpoint.Append("<tr><th style='text-align:right; width:100px;'>" + points.TypeName + "：</th><td><table><tr>");

                }
                if (count > 0 && count % 5 == 0)
                    sbpoint.Append("</tr><tr>");

                sbpoint.Append(string.Concat(new object[]
                {
                    "<td class = \"Gpoints\"><input id='ckb",
                        points.TagID+"' ",                       
                        " style='vertical-align: middle;margin-bottom:2px;' type=\"checkbox\" value=\"",  
                      points.TagID+"|"+points.Remarks+"|"+points.Units+"\"",  
                      DefaultChecked(rowcounts,(int)points.DataTypeID),
                       " name=\"checkbox\" />"}));

                sbpoint.Append(points.Remarks + "</td>");
                TypeName = thisName;
                count++;
                rowcounts++;
            }
            needadd = count % 5;
            if (needadd > 0)
            {
                for (int i = 0; i < 5 - needadd; i++)
                {
                    sbpoint.Append("<td></td>");
                }
            }
            sbpoint.Append("</tr></table></td>");
            sbpoint.Append("</tr></table>");
            mintemp = 0;
            maxtemp = 1;

            return Content(sbpoint.ToString());
        }
        //获取设备测点列表
        public ActionResult PointsValue(int pid, string tagid)
        {
            mintemp = 0;
            maxtemp = 0;
            maxs = new List<double>();
            mins = new List<double>();
            tagid = tagid.TrimEnd(',');
            string[] tagidlist = tagid.Split(',');
            //加载设备测点和环境温度
            StringBuilder sbpoint = new StringBuilder();
            for (int t = 0; t < tagidlist.Length; t++)
            {
                sbpoint.Append(string.Concat(new object[]
             {
                      tagidlist[t]+"|"+TagHisData(pid,Convert.ToInt32(tagidlist[t])) +"\""   //用历史数据填充初始曲线
             }));
            }
            double Rmintemp = -10;
            double Rmaxtemp = 10;
            if (mins.Count > 0)
                Rmintemp = mins.Min() - 10;
            if (maxs.Count > 0)
                Rmaxtemp = maxs.Max() + 10;
            string result = Rmintemp + "~" + Rmaxtemp + "~" + sbpoint.ToString();
            string strJson = JsonConvert.SerializeObject(result);
            return Content(result);
        }
        private string DefaultChecked(int counts, int datatypeid)
        {
            if (counts < 4 || datatypeid == 12)
                return " checked=\"checked\"";
            else
                return "";
        }
        double mintemp = 0, maxtemp = 0;
        List<double> maxs = new List<double>();
        List<double> mins = new List<double>();

        //获取测点类型单位列表    
        private string TagHisData(int PID, int TagID)
        {
            string tablename = "t_SM_HisData_" + PID.ToString("00000");
            string strsql = "select top 30 * from " + tablename + " where TagID=" + TagID + " order by RecTime desc";
            List<t_SM_HisData_00001> list = bll.ExecuteStoreQuery<t_SM_HisData_00001>(strsql).ToList();
            string strUnit = "[";
            int count = 0;
            double pv = 0;
            List<double> Hispoints = new List<double>();
            if (list.Count > 0)
            {
                foreach (t_SM_HisData_00001 hisdata in list)
                {
                    pv = (double)hisdata.PV;
                    strUnit += pv + ",";
                    count++;
                    Hispoints.Add(pv);
                }
                if (count < 100)
                {
                    int needadd = 100 - count;
                    for (int i = 0; i < needadd; i++)
                    {
                        strUnit += pv + ",";
                    }
                }
                maxs.Add(Hispoints.Max());
                mins.Add(Hispoints.Min());
            }
            strUnit = strUnit.TrimEnd(',') + "]";
            return strUnit;
        }
        //获取实时数据
        public ActionResult RealTimeData(string tagid, int pid)
        {
            string strTname = "t_SM_RealTimeData_" + pid.ToString("00000");
            tagid = tagid.TrimEnd(',');
            string[] idlist = tagid.Split(',');
            double? pv = 0;
            string result = "";
            int tid = 0;
            string strsql = "select * from " + strTname + " where TagID in (" + tagid + ")";
            List<t_SM_RealTimeData_00001> list = bll.ExecuteStoreQuery<t_SM_RealTimeData_00001>(strsql).ToList();
            foreach (string id in idlist)
            {
                tid = Convert.ToInt32(id);
                List<t_SM_RealTimeData_00001> listc = list.Where(p => p.TagID == tid).ToList();
                if (listc.Count > 0)
                {
                    pv = listc[0].PV;
                }
                result += pv + ",";
            }
            result = result.TrimEnd(',');
            return Content(result);
        }
        #endregion
        #region 历史电力参数测点值
        public ActionResult HisGraphsGetPoint(int pid = 8, int selGraphtype = 1, string tagid = "", string seldatetime = "")
        {
            string sql = "";
            try
            {
                if (pid == 0)
                {
                    pid = 6;
                }
                double minTemp = 0, maxtemp = 0, lastmaxtemp = 0;
                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                string DateStart = "", DateEnd = "";

                //string sql = "";
                if (!seldatetime.Equals(""))
                {
                    if (selGraphtype == 1)
                    {
                        DateTime timeNow = DateTime.Now;
                        DateEnd = Convert.ToDateTime(seldatetime).ToShortDateString();
                        DateStart = Convert.ToDateTime(seldatetime).AddHours(-1).ToShortDateString();
                    }
                    else if (selGraphtype == 6)
                    {
                        DateStart = Convert.ToDateTime(seldatetime).ToString("yyyy-MM-dd");
                        DateEnd = Convert.ToDateTime(seldatetime).AddDays(1).ToString("yyyy-MM-dd");
                    }
                    else if (selGraphtype == 72)//12小时，取周数据
                    {
                        int dayofweek = Convert.ToInt32(Convert.ToDateTime(seldatetime).DayOfWeek);
                        if (dayofweek == 0)
                        {
                            DateEnd = Convert.ToDateTime(seldatetime).AddDays(1).ToString("yyyy-MM-dd");
                            DateStart = Convert.ToDateTime(seldatetime).AddDays(-6).ToString("yyyy-MM-dd");
                        }
                        else
                        {
                            DateStart = Convert.ToDateTime(seldatetime).Date.AddDays(-dayofweek + 1).ToString("yyyy-MM-dd");
                            DateEnd = Convert.ToDateTime(seldatetime).Date.AddDays(7 - dayofweek + 1).ToString("yyyy-MM-dd");
                        }
                    }
                    else if (selGraphtype == 144)//1天取月数据
                    {
                        string yy, MM;
                        yy = seldatetime.Split('-')[0];
                        MM = seldatetime.Split('-')[1];
                        DateStart = yy + "-" + MM + "-1";
                        DateEnd = yy + "-" + (Convert.ToInt32(MM) + 1) + "-1";// Convert.ToDateTime(seldatetime + "-31 23:59:59");
                    }
                    else
                    {
                        DateStart = seldatetime.Substring(0, 4) + "-1-1";
                        DateEnd = seldatetime.Substring(0, 4) + "-12-31";
                    }
                }
                int diff = 10;//时间间隔。单位：分钟
                int datediff = selGraphtype * diff;//datatype 1=10分钟，6=小时，72=12小时，144=1天
                if (selGraphtype <= 144)
                {
                    if (selGraphtype == 6)//日曲线取当天所有数据
                        sql = "select 记录时间 Graphdate,测量值 Graphvalue from  " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "'";
                    else
                        sql = "select 记录时间 Graphdate,测量值 Graphvalue from ( select row_number() over(partition by grouprow order by 测量值 desc) as rownum , * from (select dateadd(mi,(datediff(mi,convert(varchar(10),dateadd(ss,0,记录时间),120),dateadd(ss,0,记录时间))/" + datediff + ")*" + datediff + ",convert(varchar(10),记录时间,120)) grouprow ,  * from  " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "'";
                }
                else//月数据
                {
                    sql = "select 记录时间 Graphdate,测量值 Graphvalue from (select row_number() over(partition by CONVERT(VARCHAR(7),记录时间,120) order by  测量值 desc ) as rownum , * from " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "'";

                }

                tagid = tagid.TrimEnd(',');
                string[] idlist = tagid.Split(',');
                string strTime = "", strValue = "", retime = "", revalue = "";
                string result = "", strsql = "";
                int count = 0, Index = 0, maxIndex = 0;
                List<string> xTime = new List<string>();
                foreach (string id in idlist)
                {
                    Index++;
                    //拼接查询结果
                    if (!revalue.Equals(""))
                    {
                        if (!strValue.Equals(""))
                        {
                            revalue = revalue + "|";
                            strValue = "";
                        }
                    }
                    //时日周月报
                    if (selGraphtype <= 144)
                    {
                        if (selGraphtype == 6)
                            strsql = sql + " and 测点编号=" + id;
                        else
                            strsql = sql + " and 测点编号=" + id + ") as b) as T where T.rownum = 1";
                    }
                    else//年报
                        strsql = sql + " and 测点编号=" + id + ") as T where T.rownum = 1";

                    List<HisGraphsPoint> list = bll.ExecuteStoreQuery<HisGraphsPoint>(strsql).ToList();

                    list = list.OrderBy(l => l.Graphdate).ToList();
                    strTime = "";//当出现新的最大值时，清空时间轴并重新生成
                    foreach (HisGraphsPoint hisdata in list)
                    {
                        if (hisdata.Graphvalue > maxtemp)
                        {
                            lastmaxtemp = maxtemp;
                            maxtemp = hisdata.Graphvalue;
                            maxIndex = Index - 1;
                        }

                        //最低温度为环境温度-10℃
                        minTemp = list.OrderBy(p => p.Graphvalue).First().Graphvalue;

                        if (selGraphtype == 1 || selGraphtype == 6)
                            strTime += "'" + hisdata.Graphdate.ToString("H时m分") + "',";
                        //else if (selGraphtype == 6)
                        //    strTime += "'" + hisdata.Graphdate.ToString("H点") + "',";
                        else if (selGraphtype == 72)
                            strTime += "'" + hisdata.Graphdate.ToString("d日H时") + "',";
                        else if (selGraphtype == 144)
                            strTime += "'" + hisdata.Graphdate.ToString("M月d日") + "',";
                        else
                            strTime += "'" + hisdata.Graphdate.ToString("M月") + "',";

                        strValue += hisdata.Graphvalue + ",";
                    }
                    if (!strTime.Equals(""))
                    {
                        retime = "[" + strTime.TrimEnd(',') + "]";
                        xTime.Add(retime);
                    }
                    else
                    {
                        retime = "[]";
                        xTime.Add(retime);
                    }
                    if (!strValue.Equals(""))
                        revalue = revalue + "[" + strValue.TrimEnd(',') + "]";
                    else
                    {
                        strValue = "[,]";
                        revalue = revalue + "[,]";
                    }
                    count++;
                }
                minTemp = minTemp - 10;
                //if (maxtemp > 85)
                maxtemp = maxtemp + 10;
                //else
                //    maxtemp = 95;
                result = minTemp + "|" + maxtemp + "|" + xTime[maxIndex] + "|" + revalue;

                return Content(result);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content(sql);
            }
        }
        //历史曲线点取值
        public class HisGraphsPoint
        {
            public DateTime Graphdate { set; get; }
            public double Graphvalue { set; get; }
        }
        #endregion

        //zzz added 2016年4月20日15:08:55
        //获取地图权限内站室列表
        #region
        [Login]
        public ActionResult getStationInfo()
        {
            try
            {
                //string stridlist = CurrentUser.PDRList;
                string uids = HomeController.GetUID();
                string pdrlist = HomeController.GetPID(uids);
                //List<int> resultlist = new List<string>(pid.Split(',')).ConvertAll(i => int.Parse(i));
                //var query = from module in bll.t_CM_PDRInfo where resultlist.Contains(module.PID) && module.ParentID > 0 && module.ParentID != null select module;
                string strsql = "select PID,Name,Coordination,Position,p.TypeID,TypeName,AreaName,CoordinationTime,i.IndustryName,v.VName,InstalledCapacity from t_CM_PDRInfo p join t_CM_PDRType pt  on p.TypeID=pt.TypeID join t_CM_Area a on p.AreaID=a.AreaID join t_ES_Industry i on p.IndID=i.IndustryID join t_ES_ElecVoltage v on p.VID=v.VID where islast=1 and pid in (" + pdrlist + ")";
                List<PDRInfo> list = bll.ExecuteStoreQuery<PDRInfo>(strsql).ToList();
                StringBuilder sbpdf = new StringBuilder();
                string strAdd = ",isOpen: 0, icon: { w: 27, h: 40, l: 0, t: 0, x: 6, lb: 5} }";
                int pid = 0;
                string strlocation = "";//当前位置
                if (list.Count > 0)
                {
                    foreach (PDRInfo model in list)
                    {
                        if (pid == 0)
                        {
                            pid = model.PID;
                            strlocation = "当前位置：首页 > 北京市 > " + model.AreaName + " > " + model.TypeName + " > " + model.Name;
                        }
                        sbpdf.Append(",{adress:\"" + model.Position + "\",pid :\"" + model.PID + "\",BigIndTypeName :\"" + model.BigIndTypeName + "\",VName :\"" + model.VName + "\",IndustryName :\"" + model.IndustryName + "\",title:\"" + model.Name + "\", content: \"" + model.PID + "\", position: \"" + model.TypeID + "\",InstalledCapacity:\"" + model.InstalledCapacity + "\", point: \"" + model.Coordination + "\",CoordinationTime:\"" + model.CoordinationTime + "\"" + strAdd);
                    }
                }
                string result = sbpdf.ToString();
                if (!result.Equals(""))
                    result = "[" + result.TrimStart(',') + "]$" + pdrlist;
                return Content(result);
            }
            catch (Exception ex)
            {
                return Content("");
            }
        }
        public class PDRInfo
        {
            public int PID { get; set; }
            public string Name { get; set; }
            public string Coordination { get; set; }
            public string Position { get; set; }
            public int TypeID { get; set; }
            public string TypeName { get; set; }
            public string AreaName { get; set; }
            public int IndustryID { get; set; }
            public string IndustryName { get; set; }
            public string VName { get; set; }
            public string BigIndTypeName { get; set; }
            public string InstalledCapacity { get; set; }
            public DateTime? CoordinationTime { get; set; }
        }
        //private t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}
        #endregion

        #region 显示地图上面站点信息
        //显示地图上面站点信息
        public ActionResult GetMapMessage()
        {
            string strJson = "";
            try
            {
                string strsql = "select a.CompanyName,a.Position,a.Vlevel,b.InstalledCapacity,c.category_name,d.[plan] from t_CM_PDRInfo a, t_CM_Unit b,t_ES_Category c,t_ES_UsePlan d where a.UnitID=b.UnitID and c.id=d.categoryID and d.unid=b.UnitID";
                var List = bll.ExecuteStoreQuery<Map>(strsql).ToList();
                strJson = Common.List2Json(List);
            }
            catch (Exception ex)
            {
                strJson = ex.ToString();
                strJson = "出错了！";
            }
            return Content(strJson);
        }

        public class Map
        {
            public string CompanyName { get; set; }
            public string Position { get; set; }
            public string Vlevel { get; set; }
            public string InstalledCapacity { get; set; }
            public string category_name { get; set; }
            public double plan { get; set; }

        }

        #endregion

        //获取站室信息
        [Login]
        public ActionResult PDRListData(int rows, int page, string prdname = "", string companyname = "")
        {
            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            List<int> resultlist = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
            //var query = from model in bll.t_CM_PDRInfo where resultlist.Contains((int)model.PID) && model.Name.Contains(prdname) && model.CompanyName.Contains(companyname) select model;
            //List<t_CM_PDRInfo> list = query.ToList();
            string strsql = "select *,t2.AreaName,t3.TypeName,t4.IndName,t5.VName,t6.BigIndTypeName from  t_CM_PDRInfo t1   "
           + " left join t_CM_Area t2 on t1.AreaID = t2.AreaID "
 + " left join t_CM_PDRType t3 on t3.TypeID=t1.TypeID "
 + " left join t_ES_ElecIndustry t4 on t4.IndID=t1.IndID "
 + " left join t_ES_ElecVoltage t5 on t5.VID=t1.VID "
 + " left join t_ES_ElecBigIndustryType t6 on t6.BigIndTypeID=t1.BigIndTypeID "
+ "  where  pid in(" + pdrlist + ") and t1.Name like '%"+prdname+"%' and t1.CompanyName like '%"+companyname+"%'";
            List<t_CM_PDRInfo_List> list = bll.ExecuteStoreQuery<t_CM_PDRInfo_List>(strsql).ToList();
            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }
        class t_CM_PDRInfo_List : t_CM_PDRInfo
        {
            public string AreaName { set; get; }
            public string TypeName { set; get; }
            public string IndName { set; get; }
            public string VName { set; get; }
            public string BigIndTypeName { set; get; }
        }
        public ActionResult Upload2(HttpPostedFileBase fileData, int fk_id, int i = 1, int pid = 1, string ctype = "file", string modules = "matter", string savePath = "~/Content/images/PDRPhoto/")
        //public ActionResult Upload2(HttpPostedFileBase fileData)
        {
            if (fileData != null)
            {
                //int fk_id=0;
                //int i=1;
                //string ctype = "file"; string modules = "matter"; string savePath = "~/UploadFiles/YunYingConstract/";
                try
                {
                    //备注
                    string Remark = string.Empty;
                    //上传用户
                    string CommitUser = string.Empty;
                    //资料类型（图片，视频,文档）
                    string FileType = string.Empty;
                    //来源(web,app)setAttribute
                    string FSource = string.Empty;

                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string filePath = Server.MapPath(savePath);

                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = "pdr" + pid + "_" + i + ".jpg";// Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = fileName;// "PDR" + fk_id + "_" + i + fileExtension;
                    //判断当前路径所指向的是否为文件
                    if (System.IO.File.Exists(@"" + filePath + saveName))
                    {
                        if ((System.IO.File.GetAttributes(filePath + saveName) & FileAttributes.ReadOnly) == FileAttributes.ReadOnly)
                        {
                            // 如果是将文件的属性设置为Normal
                            System.IO.File.SetAttributes(filePath + saveName, FileAttributes.Normal);
                        }
                        // 删除
                        System.IO.File.Delete(filePath + saveName);
                    }
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";
                    //获取上传人
                    //CommitUser = CurrentUser.UserName;
                    //资料类型（图片，视频,文档）
                    // FileType = ctype;
                    //来源(web,app)
                    //FSource = "web";

                    //所属模块:事项；

                    //保存到资料库t_cm_files表
                    //t_cm_files obj = new t_cm_files();
                    //obj.CommitTime = DateTime.Now;
                    //obj.CommitUser = CurrentUser.UserName;
                    //obj.FileName = fileName;
                    //obj.FilePath = savePath + saveName;
                    //obj.FileExtension = fileExtension;
                    //obj.FileSize = fSize;
                    //obj.FileType = FileType;
                    //obj.Fk_ID = fk_id;
                    //obj.FSource = FSource;
                    //obj.MaxTemp = 0;
                    //obj.MinTemp = 0;
                    //obj.Remark = Remark;
                    //obj.Modules = modules;
                    //bll.t_cm_files.AddObject(obj);
                    //bll.SaveChanges();
                    return Content(saveName);
                }
                catch (Exception ex)
                {
                    return Content(ex.ToString());
                }
            }
            else
            {
                return Content("false");
            }
        }

        private byte[] ReadFileBytes(HttpPostedFileBase fileData)
        {
            byte[] data;
            using (Stream inputStream = fileData.InputStream)
            {
                MemoryStream memoryStream = inputStream as MemoryStream;
                if (memoryStream == null)
                {
                    memoryStream = new MemoryStream();
                    inputStream.CopyTo(memoryStream);
                }
                data = memoryStream.ToArray();
            }
            return data;
        }
        //保存站室信息
        [Login]
        public ActionResult SavePDRInfo(t_CM_PDRInfo info)
        {
            string result = "OK";
            try
            {
                List<t_CM_PDRInfo> list = bll.t_CM_PDRInfo.Where(p => p.Name == info.Name && p.PID != info.PID).ToList();
                if (list.Count > 0)
                    result = "此站室已存在，请重新录入！ ";
                else
                {
                    if (info.PID > 0)
                    {
                        t_CM_PDRInfo pdrinfo = bll.t_CM_PDRInfo.Where(r => r.PID == info.PID).First();
                        pdrinfo.Name = info.Name;
                        pdrinfo.Position = info.Position;
                        pdrinfo.CompanyName = info.CompanyName;
                        //pdrinfo.LinkMan = info.LinkMan;
                        //pdrinfo.Mobile = info.Mobile;
                        pdrinfo.OperationMan = info.OperationMan;
                        pdrinfo.OperationTel = info.OperationTel;
                        if (info.Remarks != null)
                            pdrinfo.Remarks = Server.HtmlEncode(info.Remarks).Replace("\n", "<br>");
                        else
                            pdrinfo.Remarks = info.Remarks;
                        pdrinfo.UseState = info.UseState;
                        pdrinfo.Coordination = info.Coordination;
                        pdrinfo.ParentID = info.ParentID;
                        pdrinfo.AreaID = info.AreaID;
                        pdrinfo.TypeID = info.TypeID;
                        pdrinfo.IndID = info.IndID;
                        //pdrinfo.BigIndTypeID = info.BigIndTypeID;
                        pdrinfo.VID = info.VID;
                        pdrinfo.VoltageID = info.VoltageID;
                        pdrinfo.FamilyID = info.FamilyID;
                        pdrinfo.InstalledCapacity = info.InstalledCapacity;
                        pdrinfo.CBPeriodBegin = info.CBPeriodBegin;
                        pdrinfo.EleCalWay = info.EleCalWay;
                        pdrinfo.GovEleLevel = info.GovEleLevel;
                        pdrinfo.DeviationMode = info.DeviationMode;
                        pdrinfo.UnitID = info.UnitID;
                        pdrinfo.ApplcationTime = info.ApplcationTime;
                        bll.ObjectStateManager.ChangeObjectState(pdrinfo, EntityState.Modified);
                        bll.SaveChanges();
                        Common.InsertLog("站室管理", CurrentUser.UserName, "编辑站室信息[" + pdrinfo.Name + "]");
                        result = "OKedit";
                    }
                    else
                    {
                        info.AlarmState = 0;
                        info.ParentID = 0;
                        info.IsLast = 1;
                        if (info.Remarks != null)
                            info.Remarks = info.Remarks.Replace("\n", "<br>");
                        else
                            info.Remarks = info.Remarks;

                        if (info.ApplcationTime == null)
                        {
                            info.ApplcationTime = DateTime.Now;
                        }
                        bll.t_CM_PDRInfo.AddObject(info);
                        bll.SaveChanges();

                        //保存站室编码
                        t_CM_PDRInfo pdrinfo = bll.t_CM_PDRInfo.Where(r => r.Name == info.Name).First();
                        pdrinfo.EadoCode = "1" + pdrinfo.PID.ToString("000000000");
                        bll.ObjectStateManager.ChangeObjectState(pdrinfo, EntityState.Modified);
                        bll.SaveChanges();
                        if (CurrentUser.UID != null)
                        {
                            t_CM_Unit unit = bll.t_CM_Unit.Where(p => p.UnitID == CurrentUser.UID).FirstOrDefault();
                            if (!string.IsNullOrEmpty(unit.PDRList))
                            {
                                unit.PDRList = unit.PDRList + "," + pdrinfo.PID;
                            }
                            else
                            {
                                unit.PDRList = pdrinfo.PID.ToString();
                            }
                            bll.ObjectStateManager.ChangeObjectState(unit, EntityState.Modified);

                            int index = bll.SaveChanges();
                            if (index > 0)
                            {
                                string pid = info.PID + "";
                                int ss = 5 - pid.Length;
                                for (int i = 0; i < ss; i++)
                                {
                                    pid = "0" + pid;
                                }
                                string hisTableName = "t_SM_HisData_" + pid;
                                string sqlHistory = "CREATE TABLE [dbo].[" + hisTableName + "]([RecTime][datetime] NOT NULL,[TagID] [int] NOT NULL,[PID][int] NOT NULL,[PV] [float] NULL,[AlarmStatus][nvarchar](50) NULL,[AlarmLimits][float] NULL) ON[PRIMARY]";
                                bll.ExecuteStoreCommand(sqlHistory);

                                string ReatimeTableName = "t_SM_RealTimeData_" + pid;
                                string sqlReatime = @"CREATE TABLE[dbo].[" + ReatimeTableName + "]([RecTime][datetime] NOT NULL,[TagID] [int] NOT NULL,[PID] [int] NOT NULL,[PV] [float] NULL,[AlarmStatus][nvarchar](50) NULL,[AlarmLimits][float] NULL, CONSTRAINT[PK_t_SM_RealTimeData_"+pid+"] PRIMARY KEY CLUSTERED([RecTime] ASC,[TagID] ASC)WITH(PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON[PRIMARY]) ON[PRIMARY]";
                                bll.ExecuteStoreCommand(sqlReatime);

                                string reatimeErrorTableName = "t_SM_RealTimeData_ErrorData_" + pid;
                                string sqlerrorTime = @"CREATE TABLE [dbo].[" + reatimeErrorTableName + "]([RecTime][datetime] NOT NULL,[TagID] [int] NOT NULL,[PID] [int] NOT NULL,[PV] [float] NULL,[AlarmStatus][nvarchar](50) NULL,[AlarmLimits][float] NULL) ON[PRIMARY]";
                                bll.ExecuteStoreCommand(sqlerrorTime);

                                string pdfViewName = "[配电房_" + pid + "_历史数据表]";
                                string sqlPdfView = @"CREATE VIEW [dbo]." + pdfViewName + " AS ";
                                sqlPdfView += @"SELECT     t2.RecTime AS 记录时间, t2.PID AS 配电房编号, t2.TagID AS 测点编号, t2.TagName AS 测点名称, t2.PV AS 测量值, t2.单位名称 AS 安装地点,vt.Units AS 单位, vt.Name AS 数据类型, t2.测点位置, t2.监测位置, 
                      t2.设备名称, t2.DeviceCode AS 设备编码, t2.单位名称, t2.AlarmStatus AS 报警状态, t2.AlarmLimits AS 报警限值
FROM(SELECT     t1.RecTime, t1.PID, t1.TagID, t1.PV, t1.AlarmStatus, t1.AlarmLimits, t1.配电房名称, t1.单位名称, t1.配电房位置, t1.DataTypeID, t1.TagName, t1.测点位置, t1.DID, t1.MPID, t1.监测位置,
                                              dd.DeviceCode, dd.DeviceName AS 设备名称
                       FROM(SELECT     t30.RecTime, t30.PID, t30.TagID, t30.PV, t30.AlarmStatus, t30.AlarmLimits, t30.配电房名称, t30.单位名称, t30.配电房位置, t30.DataTypeID, t30.TagName, t30.测点位置, t30.DID,
                                                                      t30.MPID, mp.Name AS 监测位置
                                               FROM(SELECT     t20.RecTime, t20.PID, t20.TagID, t20.PV, t20.AlarmStatus, t20.AlarmLimits, t20.配电房名称, t20.单位名称, t20.配电房位置, poi.DataTypeID, poi.TagName,
                                                                                              poi.中文描述 AS 测点位置, poi.DID, poi.MPID
                                                                       FROM(SELECT     t10.RecTime, t10.PID, t10.TagID, t10.PV, t10.AlarmStatus, t10.AlarmLimits, p.Name AS 配电房名称, p.CompanyName AS 单位名称,
                                                                                                                      p.Position AS 配电房位置
                                                                                               FROM(SELECT     RecTime, PID, TagID, PV, AlarmStatus, AlarmLimits
                                                                                                                       FROM(SELECT     RecTime, PID, TagID, PV, AlarmStatus, AlarmLimits
                                                                                                                                               FROM          dbo.t_SM_HisData_" + pid + " AS h1) AS d) AS t10 LEFT OUTER JOIN";
                                sqlPdfView += @" dbo.t_CM_PDRInfo AS p ON t10.PID = p.PID) AS t20 LEFT OUTER JOIN
                                                                 dbo.t_CM_PointsInfo AS poi ON t20.TagID = poi.TagID) AS t30 LEFT OUTER JOIN
                                                                      dbo.t_CM_MonitorPosition AS mp ON t30.MPID = mp.MPID) AS t1 LEFT OUTER JOIN
                                              dbo.t_DM_DeviceInfo AS dd ON t1.DID = dd.DID) AS t2 LEFT OUTER JOIN
                      dbo.t_CM_ValueType AS vt ON t2.DataTypeID = vt.DataTypeID";

                                bll.ExecuteStoreCommand(sqlPdfView);
                            }
                            Common.InsertLog("站室管理", CurrentUser.UserName, "新增站室信息[" + info.Name + "]");
                            result = "OKadd";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            string js = "{\"PID\":\"" + info.PID + "\",\"result\":\"" + result + "\"}";
            return Content(js);

        }
        //删除站室信息
        [Login]
        public ActionResult DeletePDRInfo(string pid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(pid.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_PDRInfo> list = bll.t_CM_PDRInfo.Where(m => resultlist.Any(a => a == m.PID)).ToList();
                list.ForEach(i =>
                {
                    bll.t_CM_PDRInfo.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("站室管理", CurrentUser.UserName, "删除站室信息[" + pid + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        //获取当前测点的状态
        private string loadAlarmStatus(int tagid,string realstatus)
        {
            string status = "正常";
            string strsql = "select top 1 AlarmConfirm+ALarmType from t_AlarmTable_en  where  TagID=" + tagid + " and ALarmType<>'恢复' order by AlarmConfirm,AlarmState desc";
            List<string> list = bll.ExecuteStoreQuery<string>(strsql).ToList();
            if (list.Count() > 0)
            {
                string value = list[0];
                if (value.Contains("未确认"))
                {
                    status = value.Substring(3);
                }
                else
                    status = "已确认";
            }
            return realstatus+" "+status;
        }
        public int DeviceDTID(int did)
        {
            int dtid = 666;
            List<t_DM_DeviceInfo> dlist = bll.t_DM_DeviceInfo.Where(c => c.DID == did).ToList();
            if (dlist.Count > 0) { 
                    dtid = dlist.First().DSTID.Value;
            }
            return dtid;
        }

        public ActionResult getPDRInfoById(int PID/*,int UnitID*/)
        {
            string strJson = "";

            try{
                //t_CM_Unit unit = bll.t_CM_Unit.Where(u => u.UnitID == UnitID).First();
                t_CM_PDRInfo pdrInfo = bll.t_CM_PDRInfo.Where(o => o.PID == PID).First();

                if (pdrInfo != null)
                {

                    string sql = "SELECT TOP(1) * FROM t_CM_Constract a,t_CM_Unit b WHERE 1=1 and a.UID=b.UnitID and CtrPid =" + PID;

                    List<t_CM_Constract> listConstract = bll.ExecuteStoreQuery<t_CM_Constract>(sql).ToList();
                    t_CM_Constract c=null;
                    string Mobilephone="";
                    t_CM_Area area = null;
                    if (listConstract != null && listConstract.Count > 0)
                    {
                        c = listConstract.First();
                        List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(p => p.UserName == c.person).ToList();
                        if (list != null && list.Count > 0)
                        {
                            Mobilephone = list.First().Mobilephone;
                        }
                       
                    }
                    t_CM_Unit unit = bll.t_CM_Unit.Where(p => p.UnitID == pdrInfo.UnitID).FirstOrDefault();
                    t_ES_ElecVoltage vmodel = bll.t_ES_ElecVoltage.Where(p => p.VID == pdrInfo.VID).FirstOrDefault();
                    area = bll.t_CM_Area.Where(p => p.AreaID == pdrInfo.AreaID).FirstOrDefault();
                    t_ES_Industry ind = null;
                    if (unit != null)
                        ind = bll.t_ES_Industry.Where(p => p.IndustryID == unit.IndustryID).FirstOrDefault();

                    strJson = JsonConvert.SerializeObject(new PDRInfo2(pdrInfo, c, Mobilephone, area, vmodel,unit,ind));
                }

             }
            catch (Exception ex)
            {
                //result = "删除失败！";
            }
            return Content(strJson);
        }




        #region 一次图接口
        /// <summary>
        /// 保存一次图
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="orderby"></param>
        /// <param name="str"></param>
        /// <returns></returns>
        public ActionResult SaveOneView(int pid, int orderNo)
        {
            string result = "保存成功";
            try
            {
                //    HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", "*");
                ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                ControllerContext.HttpContext.Response.Charset = "UTF-8";
                string path = Server.MapPath("/DownLoad/OneGraph/");
                string saveName = pid + "_" + orderNo + "_" + "OneGraph.json";

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                if (System.IO.File.Exists(path + saveName))
                {
                    System.IO.File.Delete(path + saveName);
                }

                StreamWriter sr = System.IO.File.CreateText(path + saveName);


                //var sss = Request["data"];
                sr.WriteLine(Request["data"]);
                sr.Dispose();
                sr.Close();
                //string filePath = Server.MapPath("/DownLoad/OneGraph/");
                //DirectoryUtil.CreateDirectory(filePath);

                //string fileName = Path.GetFileName(data.FileName);      //原始文件名称
                //string saveName = pid + "_" + orderNo + "_" + "OneGraph.json";
                //data.SaveAs(filePath + saveName);
            }
            catch (Exception e)
            {
                result = "出现异常，请联系管理员" + e.Message;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取一次图
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="orderby"></param>
        /// <param name="str"></param>
        /// <returns></returns>
        /// 
        public ActionResult GetOneView(int pid, int orderNo)
        {
            string path = "";
            try
            {

                //HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", "*");

                string secure = HttpContext.Request.ServerVariables["HTTPS"];
                string httpProtocol = (secure == "on" ? "https://" : "http://");
                // 服务器名称
                string serverName = HttpContext.Request.ServerVariables["Server_Name"];
                string port = HttpContext.Request.ServerVariables["SERVER_PORT"];
                string url = HttpContext.Request.Url.Host;
                //string serverName = HttpContext.Request.ServerVariables["Server_Name"];
                // 应用服务名称
                string applicationName = HttpContext.Request.ApplicationPath;
                path = httpProtocol + serverName + (port.Length > 0 ? ":" + port : string.Empty) + applicationName;
                path += "DownLoad/OneGraph/" + pid + "_" + orderNo + "_" + "OneGraph.json";
            }
            catch (Exception ex)
            {
                path = "出现异常，请联系管理员";
            }
            return Content(path);
        }

        /// <summary>
        /// 一次图开关状态
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        public JsonResult GetOneGraph_kg(int pid)
        {
            //HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", "*");
            //string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + " and DataTypeID = 23 order by did,DataTypeID,TagID,ABCID";
            //List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            IList<t_V_RealTimeData1> list = VRealTimeDataDAL.getInstance().GetRealTimeData1(99999, 1, "23", false, pid, -1, -1, -1);

            Dictionary<int, sj> obj = new Dictionary<int, sj>();
            foreach (var item in list)
            {
                if (!obj.Keys.Contains(item.TagID))
                {
                    sj b = new sj();
                    b.PV = Convert.ToDecimal(item.PV);
                    b.Remarks = item.Remarks;
                    obj.Add(item.TagID, b);
                }
            }
            //var result = list.Select(p => new { p.TagID, p.PV, p.Remarks });
            //string strjson = JsonConvert.SerializeObject(result);
            return Json(JsonConvert.SerializeObject(obj));
        }

        public class sj
        {
            public decimal? PV { get; set; }
            public string Remarks { get; set; }
        }

#if !UseOld
         public JsonResult GetOneGraph_value(int pid, string cids = "-1")
        {
            //HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", "*");
            List<OneGraphView> re = new List<OneGraphView>();
            IList<t_V_RealTimeData1> listRealData = VRealTimeDataDAL.getInstance().GetRealTimeData1(99999,1,"23",true,pid,-1,-1,-1);
            foreach (var model in listRealData)
            {
                OneGraphView view = new OneGraphView();
                                               
                view.CID = model.CID;
                view.CName = model.CName;
                
                view.DValue = Convert.ToDecimal(model.PV);
              
                view.TagID = model.TagID;
                view.TagName = model.TagName;
               // view.CtypeName = model.TypeName;
                view.PositionName = model.Position;
                view.Units = DataUnitsReplace(model.Units);
                view.DataTypeID = model.DataTypeID;
                view.PID = model.PID;
                view.ABCID = model.ABCID;
                re.Add(view);
            }
            return Json(re, JsonRequestBehavior.AllowGet);
        }
#else
        /// <summary>
        /// 一次图数据
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        public JsonResult GetOneGraph_value(int pid, string cids = "-1")
        {
            //HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", "*");
            List<OneGraphView> re = new List<OneGraphView>();
            string InputValue, strAdd = " and cid is not null and cid!=0 ";
            if (cids != "-1")
                strAdd += " and cid in (" + cids + ") ";
            //string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + " and (DataTypeID<30 and DataTypeID!=23) order by did,DataTypeID,Position,ABCID";
            string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + strAdd + " and DataTypeID!=23 order by cid,DataTypeID,TagID,ABCID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            int currcid = 0, beforeCid = 0, icount = 0, pcount = 0, tcount = 0;//当前设备ID，上一个设备ID，最高温度,计数器
            string strtemp = "", strtable = "";//监测中,最高温度
            double maxtemp = 0, pv;
            string positionname = "", ctypename = "", btypename = "", strcountsql = "";
            int AlarmStatus = 0, stralarmtype = 0;//报警类型
            StringBuilder sbinfo = new StringBuilder();
            bool DevicehasABC = false;
            int dtcount = 0;//设备数据行数
            //获取所有报警列表
            strsql = "select CID TID,AlarmState StateID from (select row_number() over(partition by cid order by AlarmState desc) as rownum, * from t_AlarmTable_en where pid =" + pid + strAdd + " and AlarmState>0) t where t.rownum = 1";
            List<TempAlarm> alarmlist = bll.ExecuteStoreQuery<TempAlarm>(strsql).ToList();
            List<TempAlarm> listtemp = new List<TempAlarm>();
            var listTagid = list.Select(p => p.TagID).ToList();
            foreach (var m in listTagid)
            {
                var model = list.Where(p => p.TagID == m).ToList().FirstOrDefault();
                OneGraphView view = new OneGraphView();
                if (model.CID == null)
                {
                    currcid = 0;
                }
                else
                {
                    currcid = (int)model.CID;
                }

                ctypename = model.TypeName;
                positionname = model.Position;// getPositionName(model.Position);
                AlarmStatus = getAlarmStateByCID(alarmlist, currcid);
                if ((model.TypeName.Contains("温度") || model.TypeName.Contains("湿度")) && model.PV == 0)
                {
                    InputValue = "--";
                }
                else if (model.DataTypeID == 51)//功率因素取绝对值
                {
                    double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                    strCashAmt = Math.Round(strCashAmt, 3);//保留三位小数
                    InputValue = strCashAmt + "";

                }
                else
                    InputValue = model.PV.ToString();


                var a = bll.t_AlarmTable_en.Where(p => p.PID == model.PID && p.CID == p.CID && p.DID == model.DID && p.AlarmState != 0).FirstOrDefault();
                if (a != null)
                    view.AlarmStateID = a.AlarmState;
                else
                    view.AlarmStateID = 0;
                view.CID = model.CID;
                view.CName = model.CName;
                //如果包含三相，则添加标题
                //if (PositionHasABSbyCid(list, (int)model.CID))
                //{
                //    var xs = list.Where(p => p.CID == model.CID && p.DataTypeID == model.DataTypeID && p.PID == model.PID).ToList();
                //    int x = 0;
                //    view.DValue = new decimal?[xs.Count()];
                //    foreach (var item in xs)
                //    {
                //        view.DValue[x] = Convert.ToDecimal(item.PV);
                //        x++;
                //    }

                //}
                //else
                //{
                //    view.DValue = new decimal?[1];
                //    view.DValue[0] = Convert.ToDecimal(model.PV);
                //}
                icount++;//记录不同分类的测点值
                pv = (double)model.PV;
                view.DValue = Convert.ToDecimal(model.PV);
                //报警仅仅针对温度报警
                //if (model.DataTypeID == 1 && pv > maxtemp)//记录最高温度值
                {
                    maxtemp = pv;
                    view.MaxTemp = Convert.ToDecimal(pv);
                    if (AlarmStatus > stralarmtype)
                    {
                        stralarmtype = AlarmStatus;// getAlarmIco(AlarmStatus);
                        view.AlarmState = AlarmStatus;
                    }
                }
                view.TagID = model.TagID;
                view.TagName = model.TagName;
                view.CtypeName = model.TypeName;
                view.PositionName = model.Position;
                view.Units = DataUnitsReplace(model.Units);
                view.DataTypeID = model.DataTypeID;
                view.PID = model.PID;
                view.ABCID = model.ABCID;
                re.Add(view);
            }
            return Json(re, JsonRequestBehavior.AllowGet);
        }
#endif
        public class OneGraphView
        {
            public OneGraphView()
            {
                this.AlarmState = 0;
            }
            public string CName { get; set; }
            public int? CID { get; set; }
            public decimal? DValue { get; set; }
            public int? AlarmStateID { get; set; }
            public int AlarmState { get; set; }
            public decimal? MaxTemp { get; set; }
            public string CtypeName { get; set; }
            public string PositionName { get; set; }
            public string Units { get; set; }
            public int? DataTypeID { get; set; }
            public string TypeName { get; set; }
            public int TagID { get; set; }
            public string TagName { get; set; }
            public int? PID { get; set; }
            public int? ABCID { get; set; }


        }
        /// <summary>
        /// 获取did
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        public JsonResult GetDeviceByPID(int pid)
        {
            try
            {
                var list = bll.t_DM_DeviceInfo.Where(p => p.PID == pid).ToList();
                var result = from s in list
                             select new
                             {
                                 ID = s.DID,
                                 Name = s.DeviceName
                             };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }
        /// <summary>
        /// 获取CID
        /// </summary>
        /// <param name="did"></param>
        /// <param name="pid"></param>
        /// <returns></returns>
        public JsonResult GetCirByDID(int did, int pid)
        {
            try
            {
                var list = bll.t_DM_CircuitInfo.Where(p => p.DID == did && p.PID == pid).ToList();
                var result = from s in list
                             select new
                             {
                                 ID = s.CID,
                                 Name = s.CName
                             };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }





        // 通讯





        

        //改保存一次图接口
        public ActionResult SaveAttribute(int pid, int orderNo, string type, string IP, string port, string account, string password,string Name)
        {
            string result = "保存成功";
            try
            {
                // HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", "*");
                ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                ControllerContext.HttpContext.Response.Charset = "UTF-8";
                string road = "", fileName = "";
                if (type == "1")
                {
                    road = "/DownLoad/OneGraph/";
                    fileName = "OneGraph.json";

                }
                else if (type == "2")
                {
                    road = "/DownLoad/Communication/";
                    fileName = "Communication.json";
                }else if(type == "3")
                {
                    road = "/DownLoad/TreeData/";
                    fileName = "TreeData.json";
                }
                else { return Json("缺少文件类型"); }

                string filePath = Server.MapPath(road);
                string saveName = pid + "_" + orderNo + "_" + fileName;

                if (!Directory.Exists(filePath))
                {
                    Directory.CreateDirectory(filePath);
                }
                if (System.IO.File.Exists(filePath + saveName))
                {

                    string date = DateTime.Now.Year.ToString() + "__" + DateTime.Now.Month.ToString() + "__" + DateTime.Now.Day.ToString() + "__" + DateTime.Now.Hour.ToString() + "__" + DateTime.Now.Minute.ToString() + "__" + DateTime.Now.Second.ToString();
                    var path1 = filePath + date + "__" + +pid + "_" + orderNo + ".json";
                    System.IO.File.Move(filePath + saveName, path1);
                }
                StreamWriter sr = System.IO.File.CreateText(filePath + saveName);
                sr.WriteLine(Request["data"]);
                sr.Dispose();
                sr.Close();


                var sqlsle = "SELECT * FROM t_PM_OneGraph WHERE OrderNo = "+orderNo+ " and Type = "+type+ " and PID = " +pid;
                List<one> select = bll.ExecuteStoreQuery<one>(sqlsle).ToList();
                if (select.Count() >0 )
                {
                       var sqlupd = $"UPDATE t_PM_OneGraph SET  Path='{saveName}',IP='{IP}', Port ='{port}', Account ='{account}', Password ='{password}', Name ='{Name}'WHERE PID = {pid} and OrderNo = {orderNo} AND Type={type} ";
                    List<one> lsit = bll.ExecuteStoreQuery<one>(sqlupd).ToList();
                }
                else
                {
                    var sqlinse = $"INSERT INTO t_PM_OneGraph (PID, OrderNo,Type,Path,IP,Port,Account,Password,Name) VALUES ({pid},{orderNo},'{type}','{saveName}','{IP}','{port}','{account}','{password}','{Name}')";
                    List<one> lsit = bll.ExecuteStoreQuery<one>(sqlinse).ToList();
                }
            }
            catch (Exception e)
            {
                result = "出现异常，请联系管理员" + e.Message;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public class one {
            public int ID { get; set; }
            public int PID { get; set; }
            public int OrderNo { get; set; }
            public string Type { get; set; }
            public string Path { get; set; }
            public string IP { get; set; }
            public string Port { get; set; }
            public string Account { get; set; }
            public string Password { get; set; }
            public string Name { get; set; }
        }

        //获取数据
        public ActionResult GetAttribute(int pid, int orderNo, string type)
        {
            try
            {
                //HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", "*");
                var path = "";
                string secure = HttpContext.Request.ServerVariables["HTTPS"];
                string httpProtocol = (secure == "on" ? "https://" : "http://");
                // 服务器名称
                string serverName = HttpContext.Request.ServerVariables["Server_Name"];
                string port = HttpContext.Request.ServerVariables["SERVER_PORT"];
                string url = HttpContext.Request.Url.Host;
                //string serverName = HttpContext.Request.ServerVariables["Server_Name"];
                // 应用服务名称
                string applicationName = HttpContext.Request.ApplicationPath;
                path = httpProtocol + serverName + (port.Length > 0 ? ":" + port : string.Empty) + applicationName;
                if (type == "1")
                {
                    path += "DownLoad/OneGraph/";
                }
                else if(type == "2")
                {
                    path += "DownLoad/Communication/";
                }else if(type == "3")
                {
                    path += "DownLoad/TreeData/";
                }

                var sqlsle = "SELECT * FROM t_PM_OneGraph WHERE OrderNo = " + orderNo + " and Type = " + type + " and PID = " + pid;
                List<one> list = bll.ExecuteStoreQuery<one>(sqlsle).ToList();

                string strsql = $"SELECT OrderNo,Path,Name FROM t_PM_OneGraph WHERE PID ={pid}  and Type='{type}'";
                List<OrderNos> OrderNos = bll.ExecuteStoreQuery<OrderNos>(strsql).ToList();
                
                var result = from s in list
                             select new
                             {
                                 OrderNo = s.OrderNo,
                                 url = path,
                                 Path = s.Path,
                                 IP = s.IP,
                                 Port = s.Port,
                                 Account = s.Account,
                                 Password = s.Password,
                                 OrderNoList= OrderNos,
                                 Name = s.Name
                             };
                return Json(result);
            }
            catch (Exception ex)
            {
                return Content("出现异常，请联系管理员");
            }

        }


        // 查站室通讯状态
        public ActionResult GetExceptionStatus(int pid)
        {
            try
            {

                List<t_DM_CircuitInfo> clist = bll.t_DM_CircuitInfo.Where(d => d.PID == pid).ToList();
                List<t_SM_StationStatusRealTime> plist = bll.t_SM_StationStatusRealTime.Where(p => p.PID == pid).ToList();

                Dictionary<int, txsj> cobj = new Dictionary<int, txsj>(), pobj = new Dictionary<int, txsj>();

                foreach (var item in clist)
                {
                    txsj b = new txsj();
                    b.State = item.State;
                    if (b.State != null)
                    {
                        cobj.Add(item.CID, b);
                    }
                }



                txsj psj = new txsj();
                psj.State = plist[0].State;
                if (psj.State != null)
                {
                    pobj.Add((int)plist[0].PID, psj);
                }

                tsj data = new tsj();
                data.PID = pobj;
                data.CID = cobj;
                return Json(JsonConvert.SerializeObject(data));
            }
            catch (Exception ex)
            {
                return Content("出现异常，请联系管理员");
            }
        }

        public class OrderNos {
            public int OrderNo { get; set; }
            public string Path { get; set; }
            public string Name { get; set; }
        }

        public class txsj
        {
            public int? State { get; set; }
        }


        public class tsj
        {
            public Object PID { get; set; }
            public Object CID { get; set; }
            public Object DID { get; set; }
        }

#endregion
    }
}
