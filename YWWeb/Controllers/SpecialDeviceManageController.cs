using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Text;
using YWWeb.PubClass;
using System.Data;

namespace YWWeb.Controllers
{
    public class SpecialDeviceManageController : Controller
    {
        //
        // GET: /SpeciallDeviceManage/ 此控制器目前仅为 -竖井 提供算法。 2018年6月16日13:41:00 
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        //获取竖井最高温度  //
        public string GetMaxTempByDID()
        {
            StringBuilder sbtitle = new StringBuilder();
            sbtitle.Append("<div class=\"station_room_monitor_top\">");
            string strsql = "select top 1 AlarmAddress,AlarmArea,AlarmValue,ALarmType,AlarmState from t_AlarmTable_en where AlarmState>0 and (did >= 422 and did <= 437 or did = 397) order by AlarmState desc,AlarmValue desc";
            //判断是否存在报警数据
            List<AlarmInfo> alist = bll.ExecuteStoreQuery<AlarmInfo>(strsql).ToList();
            if (alist.Count > 0)
            {
                AlarmInfo alarm = alist.First();
                sbtitle.Append("<h2>" + alarm.ALarmType + "</h2>");
                sbtitle.Append("<span>设备运行状况</span></div>");

                sbtitle.Append("<div class=\"station_room_monitor_hr state_bg_" + alarm.AlarmState + "\"></div>");
                sbtitle.Append("<div class=\"station_room_monitor_content\"><strong>HT:<h1 class=\"state_fc_" + alarm.AlarmState + "\">" + alarm.AlarmValue + "℃</h1><br />" + alarm.AlarmArea + "<br />" + alarm.AlarmAddress + "</strong>");
            }
            else
            {
                //获取配电房最高温度
                strsql = "select top 1 Position AlarmAddress,DeviceName AlarmArea,PV AlarmValue,'正常' ALarmType,0 AlarmState  from V_DeviceInfoState_PDR1 where (did >= 422 and did <= 437 or did = 397) and DataTypeID=1 order by PV desc,TagID";
                alist = bll.ExecuteStoreQuery<AlarmInfo>(strsql).ToList();
                if (alist.Count > 0)
                {
                    AlarmInfo alarm = alist.First();
                    sbtitle.Append("<h2>正常</h2>");
                    sbtitle.Append(" <span>设备运行状况</span></div>");
                    sbtitle.Append("<div class=\"station_room_monitor_hr\"></div>");
                    sbtitle.Append("<div class=\"station_room_monitor_content\"><strong>HT:<h1 class=\"state_fc_0\">" + alarm.AlarmValue + "℃</h1><br />" + alarm.AlarmArea + "<br />" + alarm.AlarmAddress + "</strong>");
                }
                else
                {
                    sbtitle.Append("<h2>正常</h2>");
                    sbtitle.Append(" <span>设备运行状况</span></div>");
                    sbtitle.Append("<div class=\"station_room_monitor_hr\"></div>");
                    sbtitle.Append("<div class=\"station_room_monitor_content\"><strong>HT:<h1 class=\"state_fc_0\"> N/A</h1><br /></strong>");
                }
            }
            //获取室内环境温度
            strsql = "select top 1 Position AlarmAddress,DeviceName AlarmArea,PV AlarmValue,'正常' ALarmType,0 AlarmState from V_DeviceInfoState_PDR1 where (did >= 422 and did <= 437 or did = 397) and DataTypeID=12 order by PV desc,TagID";
            alist = bll.ExecuteStoreQuery<AlarmInfo>(strsql).ToList();
            if (alist.Count > 0)
            {
                AlarmInfo alarm = alist.First();
                sbtitle.Append("<span>负荷：N/A</span> <span>环境温度：" + alarm.AlarmValue + "℃</span></div>");
            }
            else
            {
                sbtitle.Append("<span>负荷：N/A</span> <span>环境温度：N/A</span></div>");
            }
            sbtitle.Append("</div></div>");
            return sbtitle.ToString();
        }
        //电缆最高温楼层的实时图示 // 20160321 by 
        public string GetMaxTempViewByDID()
        {
            StringBuilder sbtitle = new StringBuilder();
            //StringBuilder nbtitle = new StringBuilder();
            string strsql = "select top 1 AlarmAddress,AlarmArea,AlarmValue,ALarmType,AlarmState from t_AlarmTable_en where AlarmState>0 and (did >= 422 and did <= 437 or did = 397) order by AlarmState desc,AlarmValue desc";
            string alarmAreas = "";
            List<AlarmInfo> alist = bll.ExecuteStoreQuery<AlarmInfo>(strsql).ToList();
            if (alist.Count > 0)
            {
                //如果有报警，则取报警的设备
                strsql = "select * from V_DeviceInfoState_PDR1 where did in (select top 1 DID  from t_AlarmTable_en where (did >= 422 and did <= 437 or did = 397) and DataTypeID=1 order by PV desc,TagID)";//选择报警表中报警值最高的设备
                foreach (AlarmInfo AI in alist)
                {
                    alarmAreas += AI.AlarmArea + ",";
                }
            }
            else
            {
                //如果无报警，获取最高温度的竖井楼层的测点信息，并动态生成示意图
                strsql = "select * from V_DeviceInfoState_PDR1 where did in (select top 1 DID  from V_DeviceInfoState_PDR1 where (did >= 422 and did <= 437 or did = 397) and DataTypeID=1 order by PV desc,TagID)";//选择设备表中报警值最高的设备
            }

            //配置对应状态的电缆贴图
            sbtitle.Append("<div class=\"ShowIt\"><div class=\"sjcontent\">");
            List<V_DeviceInfoState_PDR1> Plist = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            string[] Dlcss = new string[] { "a", "b", "c", "n" };
            int i = 0;
            //string[] As = new string[]{};

            foreach (V_DeviceInfoState_PDR1 P in Plist)
            {
                if (P.AlarmStatus == "关注")
                {
                    sbtitle.Append("<div class=\"sjdl" + Dlcss[i] + "_1\"></div>");
                    i++;
                }
                else if (P.AlarmStatus == "预警")
                {
                    sbtitle.Append("<div class=\"sjdl" + Dlcss[i] + "_2\"></div>");
                    i++;
                }
                else if (P.AlarmStatus == "报警")
                {
                    sbtitle.Append("<div class=\"sjdl" + Dlcss[i] + "_3\"></div>");
                    i++;
                }
                else
                {
                    sbtitle.Append("<div class=\"sjdl" + Dlcss[i] + "\"></div>");
                    i++;
                }
            }
            sbtitle.Append("</div></div>");
            //配置对应的设备参数
            string[] Al = new string[] { "A", "B", "C", "N" };
            V_DeviceInfoState_PDR1 Po = Plist.First();
            sbtitle.Append("<div id = \"RealTimeInfo\"><span style=\"font-weight:bold;font-size:20px;\">" + Po.DeviceName + "</span>&nbsp");
            //string[] As = new string[]{};
            int j = 0;
            foreach (V_DeviceInfoState_PDR1 P in Plist)
            {

                if (P.AlarmStatus == "正常")
                {
                    sbtitle.Append("<span style=\"color:black\">" + Al[j] + ":" + P.PV + P.Units + "&nbsp</span>&nbsp");
                    j++;
                }
                else if (P.AlarmStatus == "关注")
                {
                    sbtitle.Append("<span style=\"color:yellow\">" + Al[j] + ":" + P.PV + P.Units + "&nbsp</span>&nbsp");
                    j++;
                }
                else if (P.AlarmStatus == "预警")
                {
                    sbtitle.Append("<span style=\"color:origin\">" + Al[j] + ":" + P.PV + P.Units + "&nbsp</span>&nbsp");
                    j++;
                }
                else if (P.AlarmStatus == "报警")
                {
                    sbtitle.Append("<span style=\"color:red\">" + Al[j] + ":" + P.PV + P.Units + "&nbsp</span>&nbsp");
                    j++;
                }
                else
                {
                    sbtitle.Append("<span>" + Al[j] + ":" + P.PV + P.Units + "&nbsp</span>&nbsp");
                    j++;
                }
            }
            sbtitle.Append("</div>");
            return sbtitle.ToString();
        }
        //电缆竖井每层取TagID
        public string GetTagIDByDID(int did)
        {
            string query = " where DID=" + did + " or (pid =104 and DataTypeID=12 and pv>0)";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>("select * from V_DeviceInfoState_PDR1 " + query + " order by DataTypeID").ToList();
            StringBuilder sbpoint = new StringBuilder();

            foreach (V_DeviceInfoState_PDR1 points in list)
            {
                sbpoint.Append(string.Concat(new object[]
                {

                       points.TagID+"|"+points.Remarks+"|"+points.Units+"|$"
                }));
            }
            //同时获取温度的最大最小值

            //以~号标记最大最小值
            string strJson = sbpoint.ToString();
            string result =strJson.TrimEnd(',');
            return result.TrimEnd('$');
        }
        //报警数据
        public class AlarmInfo
        {
            public string AlarmAddress { get; set; }
            public string AlarmArea { get; set; }
            public double AlarmValue { get; set; }
            public string ALarmType { get; set; }
            public int AlarmState { get; set; }
        }

    }
}
