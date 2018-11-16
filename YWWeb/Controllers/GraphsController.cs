using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using Newtonsoft.Json;
using Hyman.DataUtility;
using System.Data;
using IDAO.Models;

namespace S5001Web.Controllers
{
    public class GraphsController : Controller
    {
        //
        // GET: /Graphs/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Index()
        {
            return View();
        }
        //获取设备测点数据列表
        public string PointsTimeValue(int pid, string tagid)
        {
            tagid = tagid.TrimEnd(',');
            string[] tagidlist = tagid.Split(',');
            string TimeSection = "";
            //加载设备测点和环境温度
            StringBuilder sbpoint = new StringBuilder();
            string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + " and DataTypeID!=23 and TagID in (" + tagid + ") " + TimeSection + " order by DataTypeID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            double maxpv1 = 0, maxpv2 = 0, minpv1 = 0, minpv2 = 0, currpv = 0;
            string typebefore = "", typecurr = "", type1 = "", type2 = "";
            int rowcount = 0;
            foreach (V_DeviceInfoState_PDR1 model in list)
            {
                typecurr = model.TypeName;
                currpv = (double)model.PV;
                double Alarm1 = 0.5, Alarm2 = 0.6, Alarm3 = 0.8, AlarmMax = 100 ,ProMax = 100,ProMin = 0;
                //如果类型相同
                List<t_CM_PointsInfo> Po = bll. t_CM_PointsInfo.Where(g => g.TagID == model.TagID).ToList();
                if(Po.Count > 0){
                    AlarmMax = (double)Po[0].报警上限3 * 1.3;
                    Alarm1 = (double)Po[0].报警上限1 / AlarmMax;
                    Alarm2 = (double)Po[0].报警上限2 / AlarmMax;
                    Alarm3 = (double)Po[0].报警上限3 / AlarmMax;
                    ProMax = (double)Po[0].工程上限;
                    ProMin = (double)Po[0].工程下限;
                }
                if (rowcount == 0)
                {
                    minpv1 = maxpv1 = currpv;
                    type1 = typecurr;
                }
                else if (!typecurr.Equals(typebefore))
                {
                    type2 = typecurr;
                    minpv2 = maxpv2 = currpv;
                }
                if (typecurr == type1)
                {
                    if (currpv > maxpv1)
                        maxpv1 = currpv;
                    else if (currpv < minpv1)
                        minpv1 = currpv;
                    sbpoint.Append(currpv + "|" + model.Remarks + "|" + model.Units + "|" + typecurr + "|min1|max1|" + Alarm1 + "|" + Alarm2 + "|" + Alarm3 + "|" + AlarmMax + "|" + ProMax + "|" + ProMin + "$");
                }
                else
                {
                    if (currpv > maxpv2)
                        maxpv2 = currpv;
                    else if (currpv < minpv2)
                        minpv2 = currpv;
                    sbpoint.Append(currpv + "|" + model.Remarks + "|" + model.Units + "|" + typecurr + "|min2|max2|" + Alarm1 + "|" + Alarm2 + "|" + Alarm3 + "|" + AlarmMax + "|" + ProMax + "|" + ProMin + "$");
                }

                typebefore = typecurr;
                rowcount++;
            }
            minpv1 = minpv1 - 10;
            maxpv2 = maxpv2 + 10;
            minpv2 = minpv2 - 10;
            maxpv1 = maxpv1 + 10;
            string result = sbpoint.ToString();
            result = result.TrimEnd('$').Replace("min1", minpv1 + "").Replace("max1", maxpv1 + "").Replace("min2", minpv2 + "").Replace("max2", maxpv2 + "");
            string strJson = JsonConvert.SerializeObject(result);
            return result;
        }
        //获取测点实时数据
        public string RealTimeData(int pid, string tagid)
        {
            tagid = tagid.TrimEnd(',');
            string strsql = "select * from V_DeviceInfoState_PDR1 where PID=" + pid + " and TagID in (" + tagid + ") order by DataTypeID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            string strResult = "";
            int ctype = 0, btype = 0, tag = 0, rowcount = 0;
            foreach (V_DeviceInfoState_PDR1 model in list)
            {
                ctype = (int)model.DataTypeID;
                if (ctype != btype && rowcount > 0)//如果数据类型不相同
                    tag = 1;
                strResult = strResult + tag + "_" + model.PV + ",";
                btype = ctype;
                rowcount++;
            }
            strResult = strResult.TrimEnd(',');
            return strResult;
        }
        // 获取测点历史数据
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
                double minTemp1 = 0, maxtemp1 = 0, lastmaxtemp1 = 0;
                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                string DateStart = "", DateEnd = "";
                string datatype = "", curdatatype = "";
                int typecount = 0; //数据类型的数目
                List<string> typeList = new List<string>(); //数据类型的列表
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
                        sql = "select 记录时间 Graphdate,测量值 Graphvalue,数据类型 Graphtype from  " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "'";
                    else
                        sql = "select 记录时间 Graphdate,测量值 Graphvalue,数据类型 Graphtype from ( select row_number() over(partition by grouprow order by 测量值 desc) as rownum , * from (select dateadd(mi,(datediff(mi,convert(varchar(10),dateadd(ss,0,记录时间),120),dateadd(ss,0,记录时间))/" + datediff + ")*" + datediff + ",convert(varchar(10),记录时间,120)) grouprow ,  * from  " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "'";
                }
                else//月数据
                {
                    sql = "select 记录时间 Graphdate,测量值 Graphvalue ,数据类型 Graphtype from (select row_number() over(partition by CONVERT(VARCHAR(7),记录时间,120) order by  测量值 desc ) as rownum , * from " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "'";

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
                        curdatatype = hisdata.Graphtype;
                        if (!datatype.Equals(curdatatype))
                        {   //出现不同类的数据类型是
                            datatype = curdatatype;            //记录当前的数据类型
                            typecount++;                      //增加数据类型的数目
                        }
                        if (typecount == 1)
                        {
                            if (hisdata.Graphvalue > maxtemp)
                            {
                                lastmaxtemp = maxtemp;
                                maxtemp = hisdata.Graphvalue;
                                maxIndex = Index - 1;
                            }
                        }
                        else if (typecount == 2)
                        {
                            if (hisdata.Graphvalue > maxtemp1)
                            {
                                lastmaxtemp = maxtemp1;
                                maxtemp1 = hisdata.Graphvalue;
                                maxIndex = Index - 1;
                            }
                        }

                        if (typecount == 1)
                        {
                            //最低温度为环境温度-10℃
                            minTemp = list.Where(s => s.Graphtype == curdatatype).OrderBy(p => p.Graphvalue).First().Graphvalue;
                        }
                        else if (typecount == 2)
                        {
                            minTemp1 = list.Where(s => s.Graphtype == curdatatype).OrderBy(p => p.Graphvalue).First().Graphvalue;
                        }


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
                maxtemp = maxtemp + 10;

                minTemp1 -= 10;
                maxtemp1 += 10;

                result = minTemp + "#" + minTemp1 + "|" + maxtemp + "#" + maxtemp1 + "|" + xTime[maxIndex] + "|" + revalue + "^" + PointsTimeValue(pid, tagid);

                return Content(result);
            }
            catch (Exception)
            {
                return Content("error");
            }
        }
        // 获取测点历史数据V2.0.4 
        public string HisGraphsGetPoints(int pid = 8, int selGraphtype = 1, string tagid = "", string startdatetime = "", string enddatetime = "", string ALine = "")
        {
            string sql = "";
            try
            {
                if (pid == 0)
                {
                    pid = 6;
                }
                double minTemp = 0, maxtemp = 0, lastmaxtemp = 0;
                double minTemp1 = 0, maxtemp1 = 0, lastmaxtemp1 = 0;
                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                string DateStart = "", DateEnd = "";
                string datatype = "", curdatatype = "";
                int typecount = 0; //数据类型的数目
                List<string> typeList = new List<string>(); //数据类型的列表
                //string sql = "";
                switch (selGraphtype)
                {
                    case 1:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 6:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 72:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 144:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 707:
                        DateEnd = Convert.ToDateTime(enddatetime).ToString("yyyy-MM-dd 23:59:59");
                        DateStart = startdatetime;
                        break;
                    case 616:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                }
                int diff1 = 10, diff2 = 10;//取值间隔的参数
                if (selGraphtype <= 6)//日曲线取值间隔10min
                {
                    diff1 = 5;
                    diff2 = 20;
                }
                else //其它曲线取值间隔60min
                {
                    diff1 = 15;
                    diff2 = 30;
                }
                sql = "select 记录时间 Graphdate,测量值 Graphvalue,数据类型 Graphtype from ( select row_number() over(partition by grouprow order by 测量值 desc) as rownum , * from (select dateadd(mi,(datediff(mi,convert(varchar(10),dateadd(ss,0,记录时间),120),dateadd(ss,0,记录时间))/" + diff1 + ")*" + diff2 + ",convert(varchar(10),记录时间,120)) grouprow ,  * from  " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "'";
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
                    //时日周月
                    strsql = sql + " and 测点编号=" + id + ") as b) as T where T.rownum = 1";
                    List<HisGraphsPoint> list = bll.ExecuteStoreQuery<HisGraphsPoint>(strsql).ToList();
                    //SQLHelper sqlexec = new SQLHelper();
                    //DataTable dt = sqlexec.ExecuteQueryBySql_DT(strsql, null);
                    //List<HisGraphsPoint> list = CommonData<HisGraphsPoint>.ConvertToList(dt);
                    list = list.OrderBy(l => l.Graphdate).ToList();
                    strTime = "";//当出现新的最大值时，清空时间轴并重新生成
                    foreach (HisGraphsPoint hisdata in list)
                    {
                        curdatatype = hisdata.Graphtype;
                        if (!datatype.Equals(curdatatype))
                        {   //出现不同类的数据类型是
                            datatype = curdatatype;            //记录当前的数据类型
                            typecount++;                      //增加数据类型的数目
                        }
                        if (typecount == 1)
                        {
                            if (hisdata.Graphvalue > maxtemp)
                            {
                                lastmaxtemp = maxtemp;
                                maxtemp = hisdata.Graphvalue;
                                maxIndex = Index - 1;
                            }
                        }
                        else if (typecount == 2)
                        {
                            if (hisdata.Graphvalue > maxtemp1)
                            {
                                lastmaxtemp = maxtemp1;
                                maxtemp1 = hisdata.Graphvalue;
                                maxIndex = Index - 1;
                            }
                        }

                        if (typecount == 1)
                        {
                            //最低温度为环境温度-10℃
                            minTemp = list.Where(s => s.Graphtype == curdatatype).OrderBy(p => p.Graphvalue).First().Graphvalue;
                        }
                        else if (typecount == 2)
                        {
                            minTemp1 = list.Where(s => s.Graphtype == curdatatype).OrderBy(p => p.Graphvalue).First().Graphvalue;
                        }


                        if (selGraphtype <= 6)
                            strTime += "'" + hisdata.Graphdate.ToString("HH:mm") + "',";
                        else
                            strTime += "'" + hisdata.Graphdate.ToString("MM:dd:HH") + "',";

                        strValue += hisdata.Graphvalue.ToString("yyyy/MM/dd HH:mm:ss") + ",";
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
                maxtemp = maxtemp + 10;

                minTemp1 -= 10;
                maxtemp1 += 10;

                minTemp1 -= 10;
                maxtemp1 += 10;


                string PointsInfo = PointsTimeValue(pid, tagid);
                if (!ALine.Equals("") && !PointsInfo.Equals(""))
                {
                    string[] aa = PointsInfo.Split('$')[0].Split('|');
                    double Amax = Convert.ToDouble(aa[0]);
                    string xTimek = "|[";
                    int AlarmXcount = xTime[maxIndex].Split(',').Count();
                    for (int i = 0; i < AlarmXcount; i++)
                    {
                        xTimek += Amax * 1.5 + ",";
                    }
                    xTimek = xTimek.TrimEnd(',') + "]";
                    revalue += xTimek;

                    PointsInfo += "$" + Amax + "|报警线|" + aa[2] + "|报警线|" + aa[4] + "|" + aa[5];
                    maxtemp = Amax * 1.9;
                    maxtemp1 = Amax * 1.9;
                }
                result = minTemp + "#" + minTemp1 + "|" + maxtemp + "#" + maxtemp1 + "|" + xTime[maxIndex] + "|" + revalue + "^" + PointsInfo;

                return result;
            }
            catch (Exception)
            {
                return "error";
            }
        }
        //获取所有TagID 列表
        public string getTagIDList(int pid, int did, int datatypeid)
        {
            string strsql = "SELECT STUFF((SELECT ','+CONVERT(varchar,TagID) FROM t_CM_PointsInfo where  PID=" + pid + " and did=" + did + " and DataTypeID=" + datatypeid + " FOR XML PATH('')),1,1,'') as TagID";
            List<string> tagidlist = bll.ExecuteStoreQuery<string>(strsql, null).ToList();
            if (tagidlist.Count > 0)
                return tagidlist[0];
            else
                return "";
        }
        //获取运行状态设备的相应测点曲线 2.0.4
        public string HisGraphsGetDeviceDetails(int pid, int did, int datatypeid, string Position, string ALine = "")
        {
            try
            {
                string Result1 = "null";
                if (pid == 0)
                    pid = 6;
                string strsql = "SELECT STUFF((SELECT ','+CONVERT(varchar,TagID) FROM t_CM_PointsInfo where  PID=" + pid + " and did=" + did + " and DataTypeID=" + datatypeid;
                if (!string.IsNullOrEmpty(Position))
                {
                    strsql += "and Position='" + Position + "' FOR XML PATH('')),1,1,'') as TagID";
                }
                else
                {
                    strsql += " FOR XML PATH('')),1,1,'') as TagID";
                }
                List<string> tagidlist = bll.ExecuteStoreQuery<string>(strsql, null).ToList();

                if (!string.IsNullOrEmpty(tagidlist[0]))
                {
                    Result1 = HisGraphsGetPoints(pid, 1, tagidlist[0], "", "", ALine); //测点温度+ 开启报警线
                }

                return Result1;
            }
            catch (Exception)
            {
                return "error";
            }
        }
        //获取运行状态设备的相应测点曲线 2.1.0
        public string GetGraphsInDev(int pid, int did, int datatypeid, string Position)
        {
            try
            {
                string Result1 = "null";
                if (pid == 0)
                    pid = 6;
                string strsql = "SELECT STUFF((SELECT ','+CONVERT(varchar,TagID) FROM t_CM_PointsInfo where  PID=" + pid + " and did=" + did + " and DataTypeID=" + datatypeid;
                if (!string.IsNullOrEmpty(Position))
                {
                    strsql += "and Position='" + Position + "' FOR XML PATH('')),1,1,'') as TagID";
                }
                else
                {
                    strsql += " FOR XML PATH('')),1,1,'') as TagID";
                }
                List<string> tagidlist = bll.ExecuteStoreQuery<string>(strsql, null).ToList();

                if (!string.IsNullOrEmpty(tagidlist[0]))
                {
                    Result1 = GetGraphs2(pid, tagidlist[0], 1, 0, "", ""); //1小时内的测点温度
                }

                return Result1;
            }
            catch (Exception)
            {
                return "error";
            }
        }
        //设备运行状态
        public string DeviceStates(int pid, int did, string datatypeid)
        {
            try
            {
                string Result1 = "";
                string strJson = "";
                if (pid == 0)
                    pid = 6;
                string strsql = "SELECT STUFF((SELECT ','+CONVERT(varchar,TagID) FROM t_CM_PointsInfo where  PID=" + pid + " and did=" + did + " and DataTypeID in (" + datatypeid + ")";
                strsql += " FOR XML PATH('')),1,1,'') as TagID";
                List<string> tagidlist = bll.ExecuteStoreQuery<string>(strsql, null).ToList();
                string[] Positions = { "上触头","下触头","电缆头"};
                string[] Types = { "Current", "Voltage", "ActivePower", "ReactivePower" };
                int[] DataTypes = { 2, 3, 45, 47 };
                if (!string.IsNullOrEmpty(tagidlist[0]))
                {
                    string Dsql = "SELECT * FROM V_DeviceInfoState_PDR1 WHERE TagID in (" + tagidlist[0] + ") order by DataTypeID";
                    List<V_DeviceInfoState_PDR1> List = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(Dsql).ToList();
                    string Psql = "SELECT * FROM t_CM_PointsInfo WHERE TagID in (" + tagidlist[0] + ") order by DataTypeID";
                    List<t_CM_PointsInfo> PoList = bll.ExecuteStoreQuery<t_CM_PointsInfo>(Psql).ToList();
                    //实时温度
                    List<V_DeviceInfoState_PDR1> List1 = List.Where(h => h.DataTypeID == 1).ToList();
                    if (List1.Count > 1)
                    {
                        for (int i = 0; i < 3; i++)
                        {
                            List<V_DeviceInfoState_PDR1> List1S = List1.Where(o => o.Position == Positions[i]).ToList();
                            strJson += "\"Position" + i + "\":[";
                            double value = 0, Min = 0, Max = 100, AValue = 1, Astate = 1;//当前值，最大，最小，报警值,报警状态
                            for (int j = 1; j < 4; j++)
                            {
                                List<V_DeviceInfoState_PDR1> List1D = List1S.Where(o => o.ABCID == j).ToList();
                                if (List1D.Count > 0)
                                {
                                    List<t_CM_PointsInfo> PoList1 = PoList.Where(o => o.TagID == List1D[0].TagID).ToList();
                                    if (PoList1.Count > 0)
                                    {
                                        if (PoList1[0].工程下限 < 0)
                                            Min = (double)List1D[0].PV * 2;
                                        else
                                            Min = (double)PoList1[0].工程下限;
                                        if (PoList1[0].工程上限 > 10000)
                                            Max = (double)List1D[0].PV * 2;
                                        else
                                        {
                                            Max = (double)PoList1[0].工程上限;
                                        }
                                        if (PoList1[0].报警上限3 < 10000)
                                        {
                                            AValue = (double)(PoList1[0].报警上限3 / Max);
                                        }
                                        //判断报警状态
                                        if (List1D[0].PV > PoList1[0].报警上限3) {
                                            Astate = 2;
                                        }
                                    }
                                    value = (double)List1D[0].PV;
                                }
                                strJson += "[" + Math.Round(value, 1) + "," + Math.Round(Min, 0) + "," + Math.Round(Max, 0) + "," + Math.Round(AValue, 2) + "," + Math.Round(Astate, 0) + "]" + ",";
                            }
                            strJson = strJson.TrimEnd(',') + "],";
                        }
                    }
                    else
                    {
                        strJson += "\"Position0\":[[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1]],\"Position1\":[[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1]],\"Position2\":[[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1]],";
                    }
                    for (int i = 0; i < 4; i++)
                    {
                        strJson += "\"" + Types[i] + "\":[";
                        List<V_DeviceInfoState_PDR1> List2 = List.Where(h => h.DataTypeID == DataTypes[i]).ToList();
                        for (int j = 1; j < 4; j++)
                        {
                            List<V_DeviceInfoState_PDR1> List2D = List2.Where(o => o.ABCID == j).ToList();
                            double value = 0, Min = 0, Max = 100, AValue = 1;
                            if (List2D.Count > 0)
                            {
                                value = (double)List2D[0].PV;

                                List<t_CM_PointsInfo> PoList1 = PoList.Where(o => o.TagID == List2D[0].TagID).ToList();
                                if (PoList1.Count > 0)
                                {
                                    if (PoList1[0].工程下限 < 0)
                                        Min = (double)(value * 2);
                                    else
                                        Min = (double)PoList1[0].工程下限;
                                    if (PoList1[0].工程上限 > 10000)
                                        Max = (double)(value * 2);
                                    else
                                        Max = (double)PoList1[0].工程上限;
                                    if (PoList1[0].报警上限3 < 10000)
                                    {
                                        AValue = (double)(PoList1[0].报警上限3 / Max);
                                    }
                                }
                            }
                            strJson += "[" + Math.Round(value, 1) + "," + Math.Round(Min,0) + "," + Math.Round(Max,0) + "," + Math.Round(AValue,1) + "]" + ",";
                        }
                        strJson = strJson.TrimEnd(',') + "],";
                    }
                    //环境温湿度相关，先查找本设备的环境温湿度测点，如果不存在，则查找站室温湿度测点
                    string temp = "0",  humi= "0";
                    string WSsql = "SELECT STUFF((SELECT ','+CONVERT(varchar,TagID) FROM t_CM_PointsInfo where  PID=" + pid + " and did=" + did + " and DataTypeID in (24,25) FOR XML PATH('')),1,1,'') as TagID";
                    List<string> wslist = bll.ExecuteStoreQuery<string>(WSsql, null).ToList();
                    if (!string.IsNullOrEmpty(wslist[0]))
                    {
                        string Dwsql = "SELECT * FROM V_DeviceInfoState_PDR1 WHERE TagID in (" + wslist[0] + ") order by DataTypeID";
                        List<V_DeviceInfoState_PDR1> wsPv = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(Dwsql).ToList();
                        List<V_DeviceInfoState_PDR1> tempPv = wsPv.Where(k => k.DataTypeID == 24).ToList();
                        if (tempPv.Count > 0)
                            temp = tempPv[0].PV.ToString();
                        List<V_DeviceInfoState_PDR1> humiPv = wsPv.Where(k => k.DataTypeID == 25).ToList();
                        if (tempPv.Count > 0)
                            humi = humiPv[0].PV.ToString();
                    }
                    else {
                        string WSpdrsql = "SELECT STUFF((SELECT ','+CONVERT(varchar,TagID) FROM t_CM_PointsInfo where  PID=" + pid + " and DataTypeID in (24,25) FOR XML PATH('')),1,1,'') as TagID";
                        List<string> wspdrlist = bll.ExecuteStoreQuery<string>(WSpdrsql, null).ToList();
                        if (!string.IsNullOrEmpty(wspdrlist[0]))
                        {
                            string PDRwsql = "SELECT * FROM V_DeviceInfoState_PDR1 WHERE TagID in (" + wspdrlist[0] + ") order by DataTypeID";
                            List<V_DeviceInfoState_PDR1> wsPv = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(PDRwsql).ToList();
                            List<V_DeviceInfoState_PDR1> tempPv = wsPv.Where(k => k.DataTypeID == 24).ToList();
                            if (tempPv.Count > 0)
                                temp = tempPv[0].PV.ToString();
                            List<V_DeviceInfoState_PDR1> humiPv = wsPv.Where(k => k.DataTypeID == 25).ToList();
                            if (tempPv.Count > 0)
                                humi = humiPv[0].PV.ToString();
                        }
                    }
                    strJson += "\"Temperature\":[" + temp + "],\"Humidity\":[" + humi + "]";
                }
                else {
                    strJson = "'Position0':[[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1]],'Position1':[[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1]],'Position2':[[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1]],'Current':[[0,0,100,1],[0,0,100,1],[0,0,100,1]],'Voltage':[[0,0,100,1],[0,0,100,1],[0,0,100,1]],'ActivePower':[[0,0,100,1],[0,0,100,1],[0,0,100,1]],'ReactivePower':[[0,0,100,1],[0,0,100,1],[0,0,100,1]],'Temperature':[0],'Humidity':[0]";
                }
                Result1 = "{" + strJson + "}";
                return Result1;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return "error";
            }
        }
        //仪表盘取数
        public string dashboard(int pid, int did)
        {
            try
            {
                if (pid == 0)
                    pid = 6;

                string tagid1 = getTagIDList(pid, did, 1); //测点温度tagid
                string tagid2 = getTagIDList(pid, did, 2); //相电流tagid
                int tagcount1 = 0;
                string Result = "", Result1 = "", Result2 = "";

                if (!string.IsNullOrEmpty(tagid1))
                {
                    Result1 = PointsTimeValue(pid, tagid1); //测点温度
                    Result += Result1 + "$";
                    tagcount1 += tagid1.Split(',').Length;
                }
                if (!string.IsNullOrEmpty(tagid2))
                {
                    Result2 = PointsTimeValue(pid, tagid2); //相电流
                    Result += Result2;
                    tagcount1 += tagid2.Split(',').Length;
                }

                return Result + "!" + tagcount1;
            }
            catch (Exception)
            {
                return "error";
            }
        }
        //历史曲线点取值
        public class HisGraphsPoint
        {
            public DateTime Graphdate { set; get; }
            public double Graphvalue { set; get; }
            public string Graphtype { set; get; }
        }
        // 获取测点历史数据V2.0.4.1
        public string GetGraphs(int pid, string TagIDs, int Graphtype, int PoinType = 0, string startdatetime = "", string enddatetime = "")
        {
            string SQL = "";
            string Graph = "[", DateStart = "", DateEnd = "";
            int diff1 = 10, diff2 = 10;//取值间隔的参数
            int xLength = 0, FlagPoint = 0;
            string[] Tags = TagIDs.TrimEnd(',').Split(',');
            double AlarmValue = 0, Max = -1000, Min = 1000, Pcount = Tags.Length;
            string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
            switch (Graphtype)
            {
                case 1:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 6:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 72:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 144:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 707:
                    DateEnd = Convert.ToDateTime(enddatetime).ToString("yyyy-MM-dd 23:59:59"); ;
                    DateStart = startdatetime;
                    break;
                case 616:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
            }
            List<t_CM_ValueType> vT = bll.t_CM_ValueType.ToList();
            for (int i = 0; i < Pcount; i++)
            {
                int TagID = Convert.ToInt32(Tags[i]);
                List<t_CM_PointsInfo> PointList = new List<t_CM_PointsInfo>();
                if (PoinType == 0)//日曲线取值间隔10min
                {
                    SQL = "select * from  " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "' and 测点编号=" + Tags[i];
                }
                else //其它曲线取值间隔60min
                {
                    //diff1 = 15;
                    //diff2 = 30;
                    diff1 = 60;
                    diff2 = 20;
                    SQL = "select * from ( select row_number() over(partition by grouprow order by 测量值 desc) as rownum , * from (select dateadd(mi,(datediff(mi,convert(varchar(10),dateadd(ss,0,记录时间),120),dateadd(ss,0,记录时间))/" + diff1 + ")*" + diff2 + ",convert(varchar(10),记录时间,120)) grouprow ,  * from  " + tablename + " where 记录时间>='" + DateStart + "' and 记录时间<='" + DateEnd + "' and 测点编号=" + Tags[i] + ") as b) as T where T.rownum = 1";
                }
                t_CM_PointsInfo Point = GetPoints(TagID, SQL);
                List<t_CM_ValueType> vTv = vT.Where(m => m.DataTypeID == Point.DataTypeID).ToList();
                if (Point.工程上限 > Max && !Point.工程上限.Equals(null))
                    Max = (double)Point.工程上限;
                if (Point.工程下限 < Min && !Point.工程下限.Equals(null))
                    Min = (double)Point.工程下限;
                if (i == 0 && !Point.报警下限1.Equals(null))
                    AlarmValue = (double)Point.报警上限1;
                if (vTv.Count > 0)
                {
                    Point.Position = vTv[0].Name;
                    Point.单位 = vTv[0].Units;
                }
                Graph += JsonConvert.SerializeObject(Point) + ",";
                int xl = 0;
                if (!string.IsNullOrEmpty(Point.置0说明))
                {
                    xl = Point.置0说明.Split(',').Length;
                    if (xl > xLength)
                    {
                        xLength = xl;
                        FlagPoint++;
                    }
                }
            }
            Graph = Graph.TrimEnd(',') + "]";
            string Result = "{\"Count\":" + Pcount + ",\"FlagPoint\":" + FlagPoint + ",\"xLength\":" + xLength + ",\"Max\":" + Max + ",\"Min\":" + Min + ",\"AlarmValue\":" + AlarmValue + ",\"Graph\":" + Graph + "}"; ;
            return Result;
        }
        // 获取测点历史数据V2.0.4.2
        public string GetGraphs2(int pid, string TagIDs, int Graphtype, int PoinType = 0, string startdatetime = "", string enddatetime = "")
        {
            string SQL = "";
            string Graph = "[", DateStart = "", DateEnd = "";
            int diff1 = 10, diff2 = 10;//取值间隔的参数
            int xLength = 0, FlagPoint = 0;
            string[] Tags = TagIDs.TrimEnd(',').Split(',');
            double Max = -1000, Min = 1000, Max1 = -1000, Min1 = 1000, Pcount = Tags.Length, TypeCount = 0;
            int currtype = 0;
            string AlarmValue = "", DataType = "";
            string tablename = "t_SM_HisData_" + pid.ToString("00000");
            switch (Graphtype)
            {
                case 1:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 6:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 72:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 144:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 707:
                    DateEnd = Convert.ToDateTime(enddatetime).ToString("yyyy-MM-dd 23:59:59"); ;
                    DateStart = startdatetime;
                    break;
                case 616:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
            }
            //获取测点类型
            List<t_CM_ValueType> vT = bll.t_CM_ValueType.ToList();
            //配置取样间隔
            if (PoinType == 0)//日曲线取值间隔5min
            {
                diff1 = 5;
                List<t_CM_PDRInfo> pl = bll.t_CM_PDRInfo.Where(c => c.PID == pid).ToList();
                if (pl.Count() > 0)
                {
                    t_CM_PDRInfo p = pl.First();
                    if (p.DataRate > 0)
                        diff1 = p.DataRate / 60;
                }
            }
            else //其它曲线取值间隔60min
            {
                diff1 = 60;
            }
            DateTime StartD = Convert.ToDateTime(DateStart), EndD = Convert.ToDateTime(DateEnd);
            TimeSpan TotalDiff = EndD - StartD;
            int diffCount = (int)TotalDiff.TotalMinutes / diff1;
            //SQL = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID in (" + TagIDs.TrimEnd(',') + ")";
            //List<t_SM_HisData_00001> Alllist = bll.ExecuteStoreQuery<t_SM_HisData_00001>(SQL).ToList();
            List<t_SM_HisData> Alllist = DAL.HisDataDAL.getInstance().GetHisData(pid, TagIDs, DateStart, DateEnd).ToList();
            if (Alllist.Count < 1)
                return "{\"Count\":0,\"xLength\":0}";
            string xAxis = "";
            for (int i = 0; i < Pcount; i++)
            {
                int TagID = Convert.ToInt32(Tags[i]);
                List<t_CM_PointsInfo> PointList = bll.t_CM_PointsInfo.Where(d => d.TagID == TagID).ToList();
                t_CM_PointsInfo Point = PointList[0];
                //SQL = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID=" + Tags[i];
                //List<t_SM_HisData_00001> list = bll.ExecuteStoreQuery<t_SM_HisData_00001>(SQL).ToList();
                List<t_SM_HisData> list = Alllist.Where(o => o.TagID == Convert.ToInt32(Tags[i])).ToList();
                List<double> PVs = new List<double>();
                string axisX = "", axisY = "";
                DateTime Start = Convert.ToDateTime(DateStart);
                DateTime End = Start.AddMinutes(diff1);
                if (list.Count > 0)
                {
                    for (int m = 0; m < diffCount; m++)
                    {
                        List<t_SM_HisData> Hislist = list.Where(n => n.RecTime >= Start && n.RecTime <= End.AddMinutes(3)).ToList();//z add 
                        if (Hislist.Count > 0)  //如果历史表中有数据，取历史数据
                        {
                            //t_SM_HisData_00001 mod = Hislist[0];
                            //double dPV=(double)mod.PV;
                            double dPV = (double)Hislist.Max(v => v.PV);
                            PVs.Add(dPV);

                            axisX += Hislist.Where(o => o.PV == dPV).First().RecTime.ToString("yyyy/MM/dd HH:mm:ss") + ",";
                            axisY += dPV;
                            if (m != diffCount - 1)
                                axisY += ",";
                        }
                        else
                        {
                            //string sql2 = "select * from  t_SM_RealTimeData_" + pid.ToString("00000") + " where RecTime>='" + Start + "' and RecTime<='" + End + "' and TagID =" + list[0].TagID;
                            //List<t_SM_RealTimeData_00001> RTlist = bll.ExecuteStoreQuery<t_SM_RealTimeData_00001>(sql2).ToList();
                            //if (RTlist.Count > 0) //如果历史表中无数据，取实时数据
                            //{
                            //    t_SM_RealTimeData_00001 mod = RTlist[0];
                            //    PVs.Add((double)mod.PV);
                            //    axisY += mod.PV;
                            //    if (m != diffCount - 1)
                            //        axisY += ",";
                            //}
                            //else //如果实时表中无数据，显示0
                            {
                                //历史表没有，要什么实时表？
                                PVs.Add(0);
                                if (m != diffCount - 1)
                                    axisY += ",";
                            }
                            axisX += End.ToString("yyyy/MM/dd HH:mm:ss") + ",";
                        }
                        Start = Start.AddMinutes(diff1);
                        End = End.AddMinutes(diff1);
                    }
                    //Point.置0说明 = axisX.TrimEnd(',');
                    Point.置1说明 = axisY;
                    //Point.工程上限 = PVs.Max();
                    //Point.工程下限 = PVs.Min();
                }
                //else 
                //{
                //    for (int m = 0; m < diffCount; m++)
                //    {
                //        axisX +=  End + ",";
                //        axisY += ",";
                //        Start = Start.AddMinutes(diff1);
                //        End = End.AddMinutes(diff1);
                //    }
                //    //Point.置0说明 = axisX.TrimEnd(',');
                //    Point.置1说明 = axisY.TrimEnd(',');
                //    Point.工程上限 = 10;
                //    Point.工程下限 = 0;
                //}
                List<t_CM_ValueType> vTv = vT.Where(m => m.DataTypeID == Point.DataTypeID).ToList();
                if (Point.DataTypeID != currtype && !Point.报警上限1.Equals(null))
                {
                    AlarmValue += Point.报警上限1 + ",";
                    currtype = Point.DataTypeID.Value;
                    DataType += "\"" + vTv[0].Name + "\",";
                    TypeCount++;
                }
                if (TypeCount == 1)
                {
                    if (PVs.Count > 0)
                    {
                        if (PVs.Max() > Max)
                            Max = PVs.Max();
                        if (PVs.Min() < Min)
                            Min = PVs.Min();
                    }
                    else
                    {
                        Max = 100;
                        Min = 0;
                    }
                }
                else if (TypeCount == 2)
                {
                    if (PVs.Count > 0)
                    {
                        if (PVs.Max() > Max1)
                            Max1 = PVs.Max();
                        if (PVs.Min() < Min1)
                            Min1 = PVs.Min();
                    }
                    else
                    {
                        Max1 = 100;
                        Min1 = 0;
                    }
                }
                //if (TypeCount == 1)
                //{
                //    if (Point.工程上限 > Max && !Point.工程上限.Equals(null))
                //    {
                //        Max = (double)Point.工程上限;
                //    }
                //    if (Point.工程下限 < Min && !Point.工程下限.Equals(null))
                //    {
                //        Min = (double)Point.工程下限;
                //    }
                //}
                //else if (TypeCount == 2)
                //{
                //    if (Point.工程上限 > Max1 && !Point.工程上限.Equals(null))
                //    {
                //        Max1 = (double)Point.工程上限;
                //    }
                //    if (Point.工程下限 < Min1 && !Point.工程下限.Equals(null))
                //    {
                //        Min1 = (double)Point.工程下限;
                //    }
                //}


                if (vTv.Count > 0)
                {
                    Point.Position = vTv[0].Name;
                    Point.单位 = vTv[0].Units;
                }
                Graph += JsonConvert.SerializeObject(Point) + ",";

                if (xAxis == "")
                    xAxis = axisX.TrimEnd(',');
                if (!string.IsNullOrEmpty(xAxis))
                {
                    xLength = xAxis.Split(',').Length;
                }
            }
            Graph = Graph.TrimEnd(',') + "]";
            string Result = "{\"Count\":" + Pcount + ",\"xLength\":" + xLength + ",\"xAxis\":\"" + xAxis + "\",\"Max\":[" + Max + "," + Max1 + "],\"Min\":[" + Min + "," + Min1 + "],\"DataType\":[" + DataType.TrimEnd(',') + "],\"AlarmValue\":[" + AlarmValue.TrimEnd(',') + "],\"Graph\":" + Graph + "}"; ;
            return Result;
        }
        #region 改获取方式20180906-jiang
        //public string GetGraphs2(int pid, string TagIDs, int Graphtype, int PoinType = 0, string startdatetime = "", string enddatetime = "")
        //{
        //    string SQL = "";
        //    string Graph = "[", DateStart = "", DateEnd = "";
        //    int diff1 = 10, diff2 = 10;//取值间隔的参数
        //    int xLength = 0, FlagPoint = 0;
        //    string[] Tags = TagIDs.TrimEnd(',').Split(',');
        //    double Max = -1000, Min = 1000, Max1 = -1000, Min1 = 1000, Pcount = Tags.Length, TypeCount = 0;
        //    int currtype = 0;
        //    string AlarmValue = "", DataType = "";
        //    string tablename = "t_SM_HisData_" + pid.ToString("00000");
        //    switch (Graphtype)
        //    {
        //        case 1:
        //            DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        //            DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
        //            break;
        //        case 6:
        //            DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        //            DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
        //            break;
        //        case 72:
        //            DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        //            DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
        //            break;
        //        case 144:
        //            DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        //            DateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
        //            break;
        //        case 707:
        //            DateEnd = Convert.ToDateTime(enddatetime).ToString("yyyy-MM-dd 23:59:59"); ;
        //            DateStart = startdatetime;
        //            break;
        //        case 616:
        //            DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        //            DateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
        //            break;
        //    }
        //    //获取测点类型
        //    List<t_CM_ValueType> vT = bll.t_CM_ValueType.ToList();
        //    //配置取样间隔
        //    if (PoinType == 0)//日曲线取值间隔5min
        //    {
        //        diff1 = 5;
        //        List<t_CM_PDRInfo> pl = bll.t_CM_PDRInfo.Where(c => c.PID == pid).ToList();
        //        if (pl.Count() > 0)
        //        {
        //            t_CM_PDRInfo p = pl.First();
        //            if (p.DataRate > 0)
        //                diff1 = p.DataRate.Value / 60;
        //        }
        //    }
        //    else //其它曲线取值间隔60min
        //    {
        //        diff1 = 60;
        //    }
        //    DateTime StartD = Convert.ToDateTime(DateStart), EndD = Convert.ToDateTime(DateEnd);
        //    TimeSpan TotalDiff = EndD - StartD;
        //    int diffCount = (int)TotalDiff.TotalMinutes / diff1;
        //    SQL = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID in (" + TagIDs.TrimEnd(',') + ")";
        //    List<t_SM_HisData_00001> Alllist = bll.ExecuteStoreQuery<t_SM_HisData_00001>(SQL).ToList();
        //    if (Alllist.Count < 1)
        //        return "{\"Count\":0,\"xLength\":0}";
        //    string xAxis = "";
        //    for (int i = 0; i < Pcount; i++)
        //    {
        //        int TagID = Convert.ToInt32(Tags[i]);
        //        List<t_CM_PointsInfo> PointList = bll.t_CM_PointsInfo.Where(d => d.TagID == TagID).ToList();
        //        t_CM_PointsInfo Point = PointList[0];
        //        //SQL = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID=" + Tags[i];
        //        //List<t_SM_HisData_00001> list = bll.ExecuteStoreQuery<t_SM_HisData_00001>(SQL).ToList();
        //        List<t_SM_HisData_00001> list = Alllist.Where(o => o.TagID == Convert.ToInt32(Tags[i])).ToList();
        //        List<double> PVs = new List<double>();
        //        string axisX = "", axisY = "";
        //        DateTime Start = Convert.ToDateTime(DateStart);
        //        DateTime End = Start.AddMinutes(diff1);
        //        if (list.Count > 0)
        //        {
        //            for (int m = 0; m < diffCount; m++)
        //            {
        //                List<t_SM_HisData_00001> Hislist = list.Where(n => n.RecTime >= Start && n.RecTime <= End.AddMinutes(3)).ToList();//z add 
        //                if (Hislist.Count > 0)  //如果历史表中有数据，取历史数据
        //                {
        //                    //t_SM_HisData_00001 mod = Hislist[0];
        //                    //double dPV=(double)mod.PV;
        //                    double dPV = (double)Hislist.Max(v => v.PV);
        //                    PVs.Add(dPV);

        //                    axisX += Hislist.Where(o=>o.PV==dPV).First().RecTime.ToString("yyyy/MM/dd HH:mm:ss") + ",";
        //                    axisY += dPV;
        //                    if (m != diffCount - 1)
        //                        axisY += ",";
        //                }
        //                else
        //                {
        //                    //string sql2 = "select * from  t_SM_RealTimeData_" + pid.ToString("00000") + " where RecTime>='" + Start + "' and RecTime<='" + End + "' and TagID =" + list[0].TagID;
        //                    //List<t_SM_RealTimeData_00001> RTlist = bll.ExecuteStoreQuery<t_SM_RealTimeData_00001>(sql2).ToList();
        //                    //if (RTlist.Count > 0) //如果历史表中无数据，取实时数据
        //                    //{
        //                    //    t_SM_RealTimeData_00001 mod = RTlist[0];
        //                    //    PVs.Add((double)mod.PV);
        //                    //    axisY += mod.PV;
        //                    //    if (m != diffCount - 1)
        //                    //        axisY += ",";
        //                    //}
        //                    //else //如果实时表中无数据，显示0
        //                    {
        //                        //历史表没有，要什么实时表？
        //                        PVs.Add(0);
        //                        if (m != diffCount - 1)
        //                            axisY += ",";
        //                    }
        //                    axisX += End.ToString("yyyy/MM/dd HH:mm:ss") + ",";
        //                }
        //                Start = Start.AddMinutes(diff1);
        //                End = End.AddMinutes(diff1);
        //            }
        //            //Point.置0说明 = axisX.TrimEnd(',');
        //            Point.置1说明 = axisY;
        //            //Point.工程上限 = PVs.Max();
        //            //Point.工程下限 = PVs.Min();
        //        }
        //        //else 
        //        //{
        //        //    for (int m = 0; m < diffCount; m++)
        //        //    {
        //        //        axisX +=  End + ",";
        //        //        axisY += ",";
        //        //        Start = Start.AddMinutes(diff1);
        //        //        End = End.AddMinutes(diff1);
        //        //    }
        //        //    //Point.置0说明 = axisX.TrimEnd(',');
        //        //    Point.置1说明 = axisY.TrimEnd(',');
        //        //    Point.工程上限 = 10;
        //        //    Point.工程下限 = 0;
        //        //}
        //        List<t_CM_ValueType> vTv = vT.Where(m => m.DataTypeID == Point.DataTypeID).ToList();
        //        if (Point.DataTypeID != currtype && !Point.报警上限1.Equals(null))
        //        {
        //            AlarmValue += Point.报警上限1 + ",";
        //            currtype = Point.DataTypeID.Value;
        //            DataType += "\"" + vTv[0].Name + "\",";
        //            TypeCount++;
        //        }
        //        if (TypeCount == 1)
        //        {
        //            if (PVs.Count > 0)
        //            {
        //                if (PVs.Max() > Max)
        //                    Max = PVs.Max();
        //                if (PVs.Min() < Min)
        //                    Min = PVs.Min();
        //            }
        //            else
        //            {
        //                Max = 100;
        //                Min = 0;
        //            }
        //        }
        //        else if (TypeCount == 2)
        //        {
        //            if (PVs.Count > 0)
        //            {
        //                if (PVs.Max() > Max1)
        //                    Max1 = PVs.Max();
        //                if (PVs.Min() < Min1)
        //                    Min1 = PVs.Min();
        //            }
        //            else
        //            {
        //                Max1 = 100;
        //                Min1 = 0;
        //            }
        //        }
        //        //if (TypeCount == 1)
        //        //{
        //        //    if (Point.工程上限 > Max && !Point.工程上限.Equals(null))
        //        //    {
        //        //        Max = (double)Point.工程上限;
        //        //    }
        //        //    if (Point.工程下限 < Min && !Point.工程下限.Equals(null))
        //        //    {
        //        //        Min = (double)Point.工程下限;
        //        //    }
        //        //}
        //        //else if (TypeCount == 2)
        //        //{
        //        //    if (Point.工程上限 > Max1 && !Point.工程上限.Equals(null))
        //        //    {
        //        //        Max1 = (double)Point.工程上限;
        //        //    }
        //        //    if (Point.工程下限 < Min1 && !Point.工程下限.Equals(null))
        //        //    {
        //        //        Min1 = (double)Point.工程下限;
        //        //    }
        //        //}


        //        if (vTv.Count > 0)
        //        {
        //            Point.Position = vTv[0].Name;
        //            Point.单位 = vTv[0].Units;
        //        }
        //        Graph += JsonConvert.SerializeObject(Point) + ",";

        //        if (xAxis == "")
        //            xAxis = axisX.TrimEnd(',');
        //        if (!string.IsNullOrEmpty(xAxis))
        //        {
        //            xLength = xAxis.Split(',').Length;
        //        }
        //    }
        //    Graph = Graph.TrimEnd(',') + "]";
        //    string Result = "{\"Count\":" + Pcount + ",\"xLength\":" + xLength + ",\"xAxis\":\"" + xAxis + "\",\"Max\":[" + Max + "," + Max1 + "],\"Min\":[" + Min + "," + Min1 + "],\"DataType\":[" + DataType.TrimEnd(',') + "],\"AlarmValue\":[" + AlarmValue.TrimEnd(',') + "],\"Graph\":" + Graph + "}"; ;
        //    return Result;
        //}
        #endregion
#region 原始保留方法20180703
        public string GetGraphs2_jiang(int pid, string TagIDs, int Graphtype, int PoinType = 0, string startdatetime = "", string enddatetime = "")
        {
            string SQL = "";
            string Graph = "[", DateStart = "", DateEnd = "";
            int diff1 = 10, diff2 = 10;//取值间隔的参数
            int xLength = 0, FlagPoint = 0;
            string[] Tags = TagIDs.TrimEnd(',').Split(',');
            double Max = -1000, Min = 1000, Max1 = -1000, Min1 = 1000, Pcount = Tags.Length, TypeCount = 0;
            int currtype = 0;
            string AlarmValue = "",DataType = "";
            string tablename = "t_SM_HisData_" + pid.ToString("00000");
            switch (Graphtype)
            {
                case 1:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 6:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 72:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 144:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 707:
                    DateEnd = Convert.ToDateTime(enddatetime).ToString("yyyy-MM-dd 23:59:59"); ;
                    DateStart = startdatetime;
                    break;
                case 616:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
            }
            //获取测点类型
            List<t_CM_ValueType> vT = bll.t_CM_ValueType.ToList();
            //配置取样间隔
            if (PoinType == 0)//日曲线取值间隔5min
            {
                diff1 = 5;
                List<t_CM_PDRInfo> pl = bll.t_CM_PDRInfo.Where(c => c.PID == pid).ToList();
                if(pl.Count()>0)
                {
                    t_CM_PDRInfo p = pl.First();
                    if (p.DataRate > 0)
                        diff1 = p.DataRate / 60;
                }
            }
            else //其它曲线取值间隔60min
            {
                diff1 = 60;
            }
            DateTime StartD = Convert.ToDateTime(DateStart) , EndD = Convert.ToDateTime(DateEnd);
            TimeSpan TotalDiff = EndD - StartD;
            int diffCount = (int)TotalDiff.TotalMinutes/diff1;
            SQL = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID in (" + TagIDs.TrimEnd(',') + ")";
            List<t_SM_HisData_00001> Alllist = bll.ExecuteStoreQuery<t_SM_HisData_00001>(SQL).ToList();
            if(Alllist.Count < 1)
                return  "{\"Count\":0,\"xLength\":0}"; 
            string xAxis = "";
            for (int i = 0; i < Pcount; i++)
            {
                int TagID = Convert.ToInt32(Tags[i]);
                List<t_CM_PointsInfo> PointList = bll.t_CM_PointsInfo.Where(d => d.TagID == TagID).ToList();
                t_CM_PointsInfo Point = PointList[0];
                //SQL = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID=" + Tags[i];
                //List<t_SM_HisData_00001> list = bll.ExecuteStoreQuery<t_SM_HisData_00001>(SQL).ToList();
                List<t_SM_HisData_00001> list = Alllist.Where(o => o.TagID ==  Convert.ToInt32(Tags[i])).ToList();
                List<double> PVs = new List<double>();
                string axisX = "", axisY = "";
                DateTime Start = Convert.ToDateTime(DateStart);
                DateTime End = Start.AddMinutes(diff1);
                if (list.Count > 0)
                {
                    for (int m = 0; m < diffCount; m++)
                    {
                        List<t_SM_HisData_00001> Hislist = list.Where(n => n.RecTime >= Start && n.RecTime <= End.AddMinutes(3)).ToList();//z add 
                        if (Hislist.Count > 0)  //如果历史表中有数据，取历史数据
                        {
                            t_SM_HisData_00001 mod = Hislist[0];
                            PVs.Add((double)mod.PV);
                            axisX += mod.RecTime.ToString("yyyy/MM/dd HH:mm:ss") + ",";
                            axisY += mod.PV;
                            if (m != diffCount - 1)
                                axisY += ",";
                        }
                        else
                        {
                            string sql2 = "select * from  t_SM_RealTimeData_" + pid.ToString("00000") + " where RecTime>='" + Start + "' and RecTime<='" + End + "' and TagID =" + list[0].TagID;
                            List<t_SM_RealTimeData_00001> RTlist = bll.ExecuteStoreQuery<t_SM_RealTimeData_00001>(sql2).ToList();
                            if (RTlist.Count > 0) //如果历史表中无数据，取实时数据
                            {
                                t_SM_RealTimeData_00001 mod = RTlist[0];
                                PVs.Add((double)mod.PV);
                                axisY += mod.PV;
                                if (m != diffCount-1)
                                axisY += ",";
                            }
                            else //如果实时表中无数据，显示0
                            {
                                PVs.Add(0);
                                if (m != diffCount-1)
                                axisY += ",";
                            }
                            axisX += End.ToString("yyyy/MM/dd HH:mm:ss") + ",";
                        }
                        Start = Start.AddMinutes(diff1);
                        End = End.AddMinutes(diff1);
                    }
                    //Point.置0说明 = axisX.TrimEnd(',');
                    Point.置1说明 = axisY;
                    //Point.工程上限 = PVs.Max();
                    //Point.工程下限 = PVs.Min();
                }
                //else 
                //{
                //    for (int m = 0; m < diffCount; m++)
                //    {
                //        axisX +=  End + ",";
                //        axisY += ",";
                //        Start = Start.AddMinutes(diff1);
                //        End = End.AddMinutes(diff1);
                //    }
                //    //Point.置0说明 = axisX.TrimEnd(',');
                //    Point.置1说明 = axisY.TrimEnd(',');
                //    Point.工程上限 = 10;
                //    Point.工程下限 = 0;
                //}
                List<t_CM_ValueType> vTv = vT.Where(m => m.DataTypeID == Point.DataTypeID).ToList();
                if (Point.DataTypeID != currtype && !Point.报警上限1.Equals(null))
                {
                    AlarmValue += Point.报警上限1 + ",";
                    currtype = Point.DataTypeID.Value;
                    DataType += "\"" + vTv[0].Name + "\",";
                    TypeCount++;
                }
                if (TypeCount == 1)
                {
                    if (PVs.Count > 0)
                    {
                        if (PVs.Max() > Max)
                            Max = PVs.Max();
                        if (PVs.Min() < Min)
                            Min = PVs.Min();
                    }
                    else
                    {
                        Max = 100;
                        Min = 0;
                    }
                }
                else if (TypeCount == 2)
                {
                    if (PVs.Count > 0)
                    {
                        if (PVs.Max() > Max1)
                            Max1 = PVs.Max();
                        if (PVs.Min() < Min1)
                            Min1 = PVs.Min();
                    }
                    else
                    {
                        Max1 = 100;
                        Min1 = 0;
                    }
                }
                //if (TypeCount == 1)
                //{
                //    if (Point.工程上限 > Max && !Point.工程上限.Equals(null))
                //    {
                //        Max = (double)Point.工程上限;
                //    }
                //    if (Point.工程下限 < Min && !Point.工程下限.Equals(null))
                //    {
                //        Min = (double)Point.工程下限;
                //    }
                //}
                //else if (TypeCount == 2)
                //{
                //    if (Point.工程上限 > Max1 && !Point.工程上限.Equals(null))
                //    {
                //        Max1 = (double)Point.工程上限;
                //    }
                //    if (Point.工程下限 < Min1 && !Point.工程下限.Equals(null))
                //    {
                //        Min1 = (double)Point.工程下限;
                //    }
                //}


                if (vTv.Count > 0)
                {
                    Point.Position = vTv[0].Name;
                    Point.单位 = vTv[0].Units;
                }
                Graph += JsonConvert.SerializeObject(Point) + ",";

                if(xAxis == "")
                    xAxis = axisX.TrimEnd(',');
                if (!string.IsNullOrEmpty(xAxis))
                {
                    xLength = xAxis.Split(',').Length;
                }
            }
            Graph = Graph.TrimEnd(',') + "]";
            string Result = "{\"Count\":" + Pcount + ",\"xLength\":" + xLength + ",\"xAxis\":\"" + xAxis + "\",\"Max\":[" + Max + "," + Max1 + "],\"Min\":[" + Min + "," + Min1 + "],\"DataType\":[" + DataType.TrimEnd(',') + "],\"AlarmValue\":[" + AlarmValue.TrimEnd(',') + "],\"Graph\":" + Graph + "}"; ;
            return Result;
        }

#endregion
        // 获取机械特性数据
        public string GetGraphsMP(int did, int Graphtype, int PoinType = 0, string startdatetime = "", string enddatetime = "")
        {
            string SQL = "";
            string Graph = "[", DateStart = "", DateEnd = "";
            int diff1 = 10, diff2 = 10;//取值间隔的参数
            string tablename = "t_DM_MechanicalProperties";
            switch (Graphtype)
            {
                case 1:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 6:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 72:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 144:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 707:
                    DateEnd = Convert.ToDateTime(enddatetime).ToString("yyyy-MM-dd 23:59:59"); ;
                    DateStart = startdatetime;
                    break;
                case 616:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
            }
            //获取测点类型
            List<t_CM_ValueType> vT = bll.t_CM_ValueType.ToList();
            //配置取样间隔
            if (PoinType == 0)//日曲线取值间隔5min
            {
                diff1 = 5;
            }
            else //其它曲线取值间隔60min
            {
                diff1 = 60;
            }
            DateTime StartD = Convert.ToDateTime(DateStart), EndD = Convert.ToDateTime(DateEnd);
            TimeSpan TotalDiff = EndD - StartD;
            int diffCount = (int)TotalDiff.TotalMinutes / diff1;
            SQL = "select * from  " + tablename + " where recTime>='" + DateStart + "' and recTime<='" + DateEnd + "' and DID=" + did;
            List<t_DM_MechanicalProperties> list = bll.ExecuteStoreQuery<t_DM_MechanicalProperties>(SQL).ToList();
            List<double> PVs = new List<double>();
            string axisX = "", displaceA = "", displaceB = "", displaceC = "", storedCurrent = "", coilCurrent ="";
            DateTime Start = Convert.ToDateTime(DateStart);
            DateTime End = Start.AddMinutes(diff1);
            if (list.Count > 0)
                {
                    for (int m = 0; m < diffCount; m++)
                    {
                        List<t_DM_MechanicalProperties> Hislist = list.Where(n => n.recTime >= Start && n.recTime <= End).ToList();
                        if (Hislist.Count > 0)  //如果历史表中有数据，取历史数据
                        {
                            t_DM_MechanicalProperties mod = Hislist[0];
                            //PVs.Add((double)mod.PV);
                            axisX += mod.recTime + ",";
                            displaceA += mod.displaceAOn + ",";
                            displaceB += mod.displaceBOn + ",";
                            displaceC += mod.displaceCOn + ",";
                            storedCurrent += mod.storedCurrentOn + ",";
                            coilCurrent += mod.coilCurrentOn + ",";
                        }
                        Start = Start.AddMinutes(diff1);
                        End = End.AddMinutes(diff1);
                    }
                }
            Graph = Graph.TrimEnd(',') + "]";
            string Result = "{\"axisX\":\"" + axisX.TrimEnd(',') + "\",\"displaceA\":[" + displaceA.TrimEnd(',') + "],\"displaceB\":[" + displaceB.TrimEnd(',') + "],\"displaceC\":[" + displaceC.TrimEnd(',') + "],\"storedCurrent\":[" + storedCurrent.TrimEnd(',') + "],\"coilCurrent\":[" + coilCurrent.TrimEnd(',') + "]}"; ;
            //string Result = "";
            return Result;
        }
        public t_CM_PointsInfo GetPoints(int TagID, string SqlString)
        {
            List<double> PVs = new List<double>();
            string axisX = "", axisY = "";
            List<t_CM_PointsInfo> PointList = bll.t_CM_PointsInfo.Where(d => d.TagID == TagID).ToList();
            t_CM_PointsInfo NeoPoint = new t_CM_PointsInfo();
            if (PointList.Count > 0)
            {
                NeoPoint = PointList[0];
                NeoPoint.工程上限 = 100;
                NeoPoint.工程下限 = 0;
                List<配电房_00001_历史数据表> list = bll.ExecuteStoreQuery<配电房_00001_历史数据表>(SqlString).ToList();
                if (list.Count > 0)
                {
                    foreach (配电房_00001_历史数据表 mod in list)
                    {
                        PVs.Add((double)mod.测量值);
                        axisX += mod.记录时间 + ",";
                        axisY += mod.测量值 + ",";
                    }
                    NeoPoint.置0说明 = axisX.TrimEnd(',');
                    NeoPoint.置1说明 = axisY.TrimEnd(',');
                    NeoPoint.工程上限 = PVs.Max();
                    NeoPoint.工程下限 = PVs.Min();
                }
            }

            return NeoPoint;
        }
        // 获取测点温升数据
        public string GetDiffGraphs(int pid, string TagIDs, int Graphtype, int PoinType = 5, string startdatetime = "", string enddatetime = "")
        {
            string SQL = "";
            string Graph = "[", DateStart = "", DateEnd = "";
            int diff1 = 10, diff2 = 10;//取值间隔的参数
            int xLength = 0, FlagPoint = 0;
            string[] Tags = TagIDs.TrimEnd(',').Split(',');
            double Max = -1000, Min = 1000, Max1 = -1000, Min1 = 1000, Pcount = Tags.Length, TypeCount = 0;
            int currtype = 0;
            string AlarmValue = "", DataType = "";
            string tablename = "t_SM_HisData_" + pid.ToString("00000");
            switch (Graphtype)
            {
                case 1:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 6:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 72:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 144:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
                case 707:
                    DateEnd = Convert.ToDateTime(enddatetime).ToString("yyyy-MM-dd 23:59:59"); ;
                    DateStart = startdatetime;
                    break;
                case 616:
                    DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    DateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                    break;
            }
            //获取测点类型
            List<t_CM_ValueType> vT = bll.t_CM_ValueType.ToList();
            //配置取样间隔
            if (PoinType == 0)//日曲线取值间隔5min
            {
                diff1 = PoinType;
            }
            DateTime StartD = Convert.ToDateTime(DateStart), EndD = Convert.ToDateTime(DateEnd);
            TimeSpan TotalDiff = EndD - StartD;
            int diffCount = (int)TotalDiff.TotalMinutes / diff1;
            string xAxis = "";

            string evTagID = "-1";
            //环境测点历史数据
            List<t_CM_PointsInfo> Plist = bll.t_CM_PointsInfo.Where(o => o.PID == pid && (o.DataTypeID == 12 ||  o.DataTypeID == 26)).ToList();
            if (Plist.Count > 0) {
                evTagID = Plist.First().TagID.ToString();
            }
            SQL = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID=" + evTagID;
            List<t_SM_HisData_00001> Evlist = bll.ExecuteStoreQuery<t_SM_HisData_00001>(SQL).ToList();      

            for (int i = 0; i < Pcount; i++)
            {
                int TagID = Convert.ToInt32(Tags[i]);
                List<t_CM_PointsInfo> PointList = bll.t_CM_PointsInfo.Where(d => d.TagID == TagID).ToList();
                t_CM_PointsInfo Point = PointList[0];
                //测点历史数据
                SQL = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID=" + Tags[i];
                List<t_SM_HisData_00001> list = bll.ExecuteStoreQuery<t_SM_HisData_00001>(SQL).ToList();
                List<double> PVs = new List<double>();
                string axisX = "", axisY = "",axisDiffY = "";
                DateTime Start = Convert.ToDateTime(DateStart);
                DateTime End = Start.AddMinutes(diff1);
                if (list.Count > 0)
                {
                    for (int m = 0; m < diffCount; m++)
                    {
                        List<t_SM_HisData_00001> Hislist = list.Where(n => n.RecTime >= Start && n.RecTime <= End).ToList();
                        List<t_SM_HisData_00001> evHislist = Evlist.Where(n => n.RecTime >= Start && n.RecTime <= End).ToList();

                        if (Hislist.Count > 0)  //如果历史表中有数据，取历史数据
                        {
                            t_SM_HisData_00001 mod = Hislist[0];
                            PVs.Add((double)mod.PV);
                            axisX += mod.RecTime.ToString("yyyy/MM/dd HH:mm:ss") + ",";
                            axisY += mod.PV;
                            if (m != diffCount - 1)
                                axisY += ",";
                            if (evHislist.Count > 0) {
                                double diff = (double)mod.PV - (double)evHislist.First().PV;
                                axisDiffY += diff;
                                if (m != diffCount - 1)
                                    axisDiffY += ",";
                            }
                        }
                        else
                        {
                            string sql2 = "select * from  t_SM_RealTimeData_" + pid.ToString("00000") + " where RecTime>='" + Start + "' and RecTime<='" + End + "' and TagID =" + list[0].TagID;
                            List<t_SM_RealTimeData_00001> RTlist = bll.ExecuteStoreQuery<t_SM_RealTimeData_00001>(sql2).ToList();
                            if (RTlist.Count > 0) //如果历史表中无数据，取实时数据
                            {
                                t_SM_RealTimeData_00001 mod = RTlist[0];
                                PVs.Add((double)mod.PV);
                                axisY += mod.PV;
                                if (m != diffCount - 1)
                                    axisY += ",";
                                if (evHislist.Count > 0)
                                {
                                    double diff = (double)mod.PV - (double)evHislist.First().PV;
                                    axisDiffY += diff;
                                    if (m != diffCount - 1)
                                        axisDiffY += ",";
                                }
                            }
                            else //如果实时表中无数据，显示0
                            {
                                PVs.Add(0);
                                if (m != diffCount - 1) 
                                {
                                    axisY += ",";
                                    axisDiffY += ",";
                                }
                            }
                            axisX += End.ToString("yyyy/MM/dd HH:mm:ss") + ",";
                        }
                        Start = Start.AddMinutes(diff1);
                        End = End.AddMinutes(diff1);
                    }
                    //Point.置0说明 = axisDiffY;
                    Point.置1说明 = axisDiffY;
                    Point.工程上限 = PVs.Max();
                    Point.工程下限 = PVs.Min();
                }
                //else 
                //{
                //    for (int m = 0; m < diffCount; m++)
                //    {
                //        axisX +=  End + ",";
                //        axisY += ",";
                //        Start = Start.AddMinutes(diff1);
                //        End = End.AddMinutes(diff1);
                //    }
                //    //Point.置0说明 = axisX.TrimEnd(',');
                //    Point.置1说明 = axisY.TrimEnd(',');
                //    Point.工程上限 = 10;
                //    Point.工程下限 = 0;
                //}
                List<t_CM_ValueType> vTv = vT.Where(m => m.DataTypeID == Point.DataTypeID).ToList();
                if (Point.DataTypeID != currtype && !Point.报警上限1.Equals(null))
                {
                    AlarmValue += Point.报警上限1 + ",";
                    currtype = Point.DataTypeID.Value;
                    DataType += "\"" + vTv[0].Name + "\",";
                    TypeCount++;
                }
                if (TypeCount == 1)
                {
                    if (Point.工程上限 > Max && !Point.工程上限.Equals(null))
                    {
                        Max = (double)Point.工程上限;
                    }
                    if (Point.工程下限 < Min && !Point.工程下限.Equals(null))
                    {
                        Min = (double)Point.工程下限;
                    }
                }
                else if (TypeCount == 2)
                {
                    if (Point.工程上限 > Max1 && !Point.工程上限.Equals(null))
                    {
                        Max1 = (double)Point.工程上限;
                    }
                    if (Point.工程下限 < Min1 && !Point.工程下限.Equals(null))
                    {
                        Min1 = (double)Point.工程下限;
                    }
                }


                if (vTv.Count > 0)
                {
                    Point.Position = vTv[0].Name;
                    Point.单位 = vTv[0].Units;
                }
                Graph += JsonConvert.SerializeObject(Point) + ",";

                if (xAxis == "")
                    xAxis = axisX.TrimEnd(',');
                if (!string.IsNullOrEmpty(xAxis))
                {
                    xLength = xAxis.Split(',').Length;
                }
            }
            Graph = Graph.TrimEnd(',') + "]";
            string Result = "{\"Count\":" + Pcount + ",\"xLength\":" + xLength + ",\"xAxis\":\"" + xAxis + "\",\"Max\":[" + Max + "," + Max1 + "],\"Min\":[" + Min + "," + Min1 + "],\"DataType\":[" + DataType.TrimEnd(',') + "],\"AlarmValue\":[" + AlarmValue.TrimEnd(',') + "],\"Graph\":" + Graph + "}"; ;
            return Result;
        }
    }
}
