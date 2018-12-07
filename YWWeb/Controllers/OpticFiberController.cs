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
    public class OpticFiberController : UserControllerBaseEx
    {
        //
        // GET: /OpticFiber/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        [Login]
        public ActionResult Edit()
        {
            return View();
        }
        //[Login]
        public ActionResult Transient()
        {
            return View();
        }
        [Login]
        public ActionResult LocateList()
        {
            return View();
        }
        [Login]
        public ActionResult LocateEdit()
        {
            return View();
        }
        //获取测点列表
        [Login]
        public ActionResult ListData(int pid, int did, string tagname, int rows, int page)
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                string query = " parentid=0";
                if (pid > 0)
                    query = query + " and pid=" + pid;
                if (did > 0)
                    query = query + " and did=" + did;
                if (!tagname.Equals(""))
                    query = query + " and tagname like '%" + tagname + "%'";

                string strsql = "select * from t_cm_pointmapdts where" + query;
                List<t_cm_pointmapdts> list = bll.ExecuteStoreQuery<t_cm_pointmapdts>(strsql).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        //获取测点详情
        [Login]
        public ActionResult GetPointsInfo(int tagid)
        {
            string strJson = "";
            List<t_cm_pointmapdts> list = bll.t_cm_pointmapdts.Where(p => p.tagid == tagid).ToList();
            if (list.Count > 0)
            {
                t_cm_pointmapdts info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }
        //获取光纤设备
        public ActionResult GetDevicesinfo()
        {
            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string query = "1=1";// devicesinfoid in (" + pdrlist + ")";
            string strsql = " select devicesinfoid id,dname text from t_dts_bi_devicesinfo where " + query;
            List<DDLValue> list = SQLtoDataSet.GetMySqlList(strsql);
            string strJson = Common.ComboboxToJson(list);

            return Content(strJson);
        }
        //获取光纤通道
        public ActionResult Getchannelsinfo(int pid = 1, int showall = 0)
        {
            string strsql = " select channelsinfoid id,cname text from t_dts_bi_channelsinfo where devicesinfoid=" + pid;
            List<DDLValue> list = SQLtoDataSet.GetMySqlList(strsql);
            string strJson = Common.ComboboxToJson(list);
            if (showall > 0)
            {
                strJson = AddShowAll(list.Count, strJson, "id", "text");
            }
            return Content(strJson);
        }
        //获取光纤通道分区
        public ActionResult Getchannelzone(int pid = 1, int did = 1, int showall = 0)
        {
            string strsql = " select zoneno id,zonename text from t_dts_bi_channelzone where channelsinfoid=" + did + " and devicesinfoid=" + pid;
            List<DDLValue> list = SQLtoDataSet.GetMySqlList(strsql);
            string strJson = Common.ComboboxToJson(list);
            if (showall > 0)
            {
                strJson = AddShowAll(list.Count, strJson, "id", "text");
            }
            return Content(strJson);
        }
        //获取光纤实时数据--生成暂态曲线
        public ActionResult Getrtmdatatemp(int did, DateTime rectime)
        {
            try
            {
                string tabname = "t_dts_sm_hisdata_tempdata_" + did.ToString("0000");
                string strsql = " select channelsinfoid id,pv text from " + tabname + " where rectime<='" + rectime + "' order by rectime desc LIMIT 0,1";
                List<DDLValue> list = SQLtoDataSet.GetMySqlList(strsql);
                string strTemp = "", strJson = "";
                int count = 0, startpoint = 0;
                if (list.Count > 0)
                {
                    strTemp = list[0].text;
                    //strTemp = GZipCompressHelper.Decompress(strTemp).TrimEnd(',');
                }
                if (!strTemp.Equals(""))
                {
                    strsql = "select czwidth+cbwidth-1 id,'' text from t_dts_bi_channelsinfo where channelsinfoid=" + did;
                    list = SQLtoDataSet.GetMySqlList(strsql);
                    if (list.Count() > 0)
                        startpoint = list[0].id;
                    //点数
                    strJson = strTemp.Substring(0, strTemp.IndexOf(','));
                    count = Convert.ToInt32(strJson) - startpoint;
                    //点数+通道+时间
                    strTemp = strTemp.Substring(27);
                }
                //起点|长度|值
                return Content(startpoint + "|" + count + "|" + strTemp);
            }
            catch (Exception ex)
            {
                return Content("error");
            }
        }
        //获取光纤设备名称
        public ActionResult GetDeviceName(int pid)
        {
            string strsql = " select devicesinfoid id,dname text from t_dts_bi_devicesinfo where devicesinfoid=" + pid;
            List<DDLValue> list = SQLtoDataSet.GetMySqlList(strsql);
            string dname = "";
            if (list.Count > 0)
                dname = list[0].text;
            return Content(dname);
        }
        //获取channelsinfoid
        public int GetChannelsInfoID(int did)
        {
            List<t_cm_pointmapdts> list = bll.t_cm_pointmapdts.Where(p => p.did == did).ToList();
            int channelsinfoid = 0;
            if (list.Count > 0)
                channelsinfoid = list[0].channelsinfoid == null ? 0 : (int)list[0].channelsinfoid;
            return channelsinfoid;
        }
        //保存测点对照表
        public ActionResult SavePointmapdts(t_cm_pointmapdts model)
        {
            string result = "OK", strsql = "";

            //新增
            try
            {
                List<t_cm_pointmapdts> list2 = bll.t_cm_pointmapdts.Where(p => p.devicesinfoid == model.devicesinfoid && p.channelsinfoid == model.channelsinfoid && p.zoneno == model.zoneno && p.parentid == 0).ToList();
                if (list2.Count == 0 || list2[0].tagid == model.tagid)//判断纤分区已分配是否已经分配
                {
                    List<t_cm_pointmapdts> list = bll.t_cm_pointmapdts.Where(p => p.tagid == model.tagid).ToList();
                    if (list.Count > 0)//修改
                    {
                        strsql = " select beginIndex id,endIndex  text from t_dts_bi_channelzone where zoneno=" + model.zoneno + " and channelsinfoid=" + model.channelsinfoid + " and devicesinfoid=" + model.devicesinfoid;
                        List<DDLValue> listzone = SQLtoDataSet.GetMySqlList(strsql);
                        int startPt = 0, endPt = 0;
                        if (listzone.Count > 0)
                        {
                            startPt = listzone[0].id;
                            endPt = Convert.ToInt32(listzone[0].text);
                        }

                        strsql = "update t_cm_pointmapdts set startPt=" + startPt + ",endPt=" + endPt + ",devicesinfoid=" + model.devicesinfoid + ", dname='" + model.dname + "',channelsinfoid=" + model.channelsinfoid + ",cname='" + model.cname + "',zonename='" + model.zonename + "',zoneno=" + model.zoneno + " where tagid=" + model.tagid;
                        bll.ExecuteStoreCommand(strsql, null);
                        Common.InsertLog("光纤分区对照管理", CurrentUser.UserName, "修改光纤分区对照[测点ID:" + model.tagid + "]");
                    }
                    else
                    {
                        strsql = "insert into t_cm_pointmapdts values(" + model.pid + "," + model.did + "," + model.tagid + "," + model.devicesinfoid + ",'" + model.dname + "'," + model.channelsinfoid + ",'" + model.cname + "'," + model.zoneno + ",'" + model.zonename + "')";
                        bll.ExecuteStoreCommand(strsql, null);
                        Common.InsertLog("光纤分区对照管理", CurrentUser.UserName, "新增光纤分区对照[定位点ID:" + model.tagid + "]");
                    }
                }
                else
                {
                    result = "该光纤分区已分配，请从新分配！";
                }
            }
            catch (Exception ex)
            {
                result = strsql;
            }
            return Content(result);
        }

        //添加显示全部
        private string AddShowAll(int rowcount, string strJson, string dkey, string dvalue)
        {
            if (rowcount > 0)
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==请选择==\"},");
            else
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==请选择==\"}");
            return strJson;
        }
        [Login]
        //获取定位点列表
        public ActionResult OpticFiberData(string locatename, int rows, int page)
        {
            try
            {
                //string pdrlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                string strsql = "select * from t_cm_pointmapdts where pid in (" + pdrlist + ") and parentid > 0 and tagname like '%" + locatename + "%'";
                List<t_cm_pointmapdts> list = bll.ExecuteStoreQuery<t_cm_pointmapdts>(strsql).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //获取定位点详情
        [Login]
        public ActionResult GetLocateInfo(int LocateID)
        {
            string strJson = "";
            List<t_cm_pointmapdts> list = bll.t_cm_pointmapdts.Where(p => p.tagid == LocateID).ToList();
            if (list.Count > 0)
            {
                t_cm_pointmapdts info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }
        //删除
        [Login]
        public ActionResult DeleteLocate(string locateid)
        {
            string result = "OK";
            try
            {
                string strsql = "delete from t_cm_pointmapdts where tagid in (" + locateid + ")";
                bll.ExecuteStoreCommand(strsql, null);
                Common.InsertLog("定位点管理", CurrentUser.UserName, "删除定位点[定位点ID:" + locateid + "]");
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        //保存定位点
        [Login]
        public ActionResult SaveLocate(t_cm_pointmapdts locate)
        {
            List<t_cm_pointmapdts> list = bll.t_cm_pointmapdts.ToList();
            int locateid = locate.tagid;
            string result = "OK";
            //新增
            try
            {
                if (locateid < 1)
                {
                    list = list.Where(s => s.tagname == locate.tagname).ToList();

                    if (list.Count > 0)
                    {
                        result = "此定位点已存在，请设置其他定位点！";
                    }
                    else
                    {
                        bll.t_cm_pointmapdts.AddObject(locate);
                        bll.SaveChanges();
                        locateid = locate.tagid;
                        Common.InsertLog("定位点管理", CurrentUser.UserName, "新增定位点[定位点ID:" + locateid + "_" + locate.tagname + "]");
                    }
                }
                else//修改
                {
                    t_cm_pointmapdts model = bll.t_cm_pointmapdts.Where(l => l.tagid == locateid).First();
                    model.tagname = locate.tagname;
                    model.pid = locate.pid;
                    model.did = locate.did;
                    model.devicesinfoid = locate.devicesinfoid;
                    model.dname = locate.dname;
                    model.channelsinfoid = locate.channelsinfoid;
                    model.cname = locate.cname;
                    model.zoneno = locate.zoneno;
                    model.zonename = locate.zonename;
                    model.parentid = locate.parentid;
                    model.startPt = locate.startPt;
                    model.endPt = locate.endPt;
                    bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("定位点管理", CurrentUser.UserName, "修改定位点[定位点ID:" + locateid + "_" + locate.tagname + "]");
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        //public t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}
        [Login]
        //获取光纤通道 （定位点管理）
        public ActionResult GetOpticFiberinfo()
        {
            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string query = "1=1 and pid in (" + pdrlist + ")";// devicesinfoid in (" + pdrlist + ")";
            string strsql = " select devicesinfoid id,dname text from t_cm_pointmapdts where " + query;
            List<DDLValue> list = bll.ExecuteStoreQuery<DDLValue>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);

            return Content(strJson);
        }
        //获取光纤通道分区
        public ActionResult GetOpticFiberZone(int did = 1, int showall = 0)
        {
            string strsql = " select * from t_cm_pointmapdts where devicesinfoid=" + did;
            List<t_cm_pointmapdts> list = bll.ExecuteStoreQuery<t_cm_pointmapdts>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            if (showall > 0)
            {
                strJson = AddShowAll(list.Count, strJson, "id", "text");
            }
            return Content(strJson);
        }
        //获取光纤平面图实时数据
        public ActionResult OpticFiberRealtimeData(int pid, string did)
        {
            string strsql = "select * from V_RealTimeData_dts where pid=" + pid + " and did in (" + did + ")";
            List<V_RealTimeData_dts> list = bll.ExecuteStoreQuery<V_RealTimeData_dts>(strsql).ToList();
            //获取分区最高温度
            List<V_RealTimeData_dts> alist = list.Where(d => d.parentid == 0).ToList();
            //获取定位点列表
            List<V_RealTimeData_dts> blist;
            //获取分区最高温度所在地位点
            int vaindex, vtagid, tagid, len, docunt;//最大值所在绝对索引,最大值所在定位点,定位点ID
            double vmax;

            string strMaxInfo = "", strLocateInfo = "", strvmax = "";//分区最高信息，定位点数据
            string htstype = "top";
            foreach (V_RealTimeData_dts model in alist)
            {
                docunt = 0;
                vaindex = (int)model.vaindex;
                tagid = model.tagid;
                vmax = (double)model.vmax;
                vtagid = GetTagIDByHT(list, tagid, vmax);
                if (!strMaxInfo.Equals(""))
                    strMaxInfo = strMaxInfo + "|";
                len = (int)model.endPt - (int)model.startPt;
                blist = list.Where(d => d.parentid == tagid).ToList();
                strLocateInfo = GetLocateInfo(blist, tagid, len, model.PStyle, vtagid, docunt);//获取分区对应的定位点信息
                if (model.PStyle.Equals("width"))
                    htstype = "left";
                else
                    htstype = "top";
                strvmax = vmax + "℃（" + model.vaindex + "m）";
                strMaxInfo = strMaxInfo + tagid + "," + htstype + "," + strvmax + "," + strLocateInfo;//分区ID，分区最高温度所在定位点ID，最高温度值,定位点信息,最高值所在位置
                docunt++;
            }

            //返回光纤平面图所需数据
            return Content(strMaxInfo);

        }
        //获取分区定位信息
        private string GetLocateInfo(List<V_RealTimeData_dts> list, int tagid, int leng, string pstyle, int vtagid, int docunt)
        {
            if (docunt == 0 || pstyle.Equals("height"))
                list = list.OrderBy(d => d.tagid).ToList();
            else
                list = list.OrderByDescending(d => d.tagid).ToList();
            StringBuilder sb = new StringBuilder();
            int currlen = 0, currnum = 1;
            int currpercent = 0, subpercent = 0, htprecent = 0;
            string showtype = "l";
            //获取定位点实时数据
            foreach (V_RealTimeData_dts model in list)
            {
                if (model.tagid == vtagid)
                    htprecent = subpercent;
                if (currnum < list.Count())
                {
                    currlen = (int)model.endPt - (int)model.startPt;
                    currpercent = currlen * 100 / leng;
                    if (currpercent < 1)
                        currpercent = 1;
                    subpercent = subpercent + currpercent;
                }//如果是最后一段，则相减
                else
                {
                    currpercent = 100 - subpercent;
                    subpercent = 100;
                }

                if (pstyle.Equals("width"))
                    showtype = "b";
                sb.Append("<a href=\"javascript:;\" class=\"status_0\" style=\"" + pstyle + ":" + currpercent + "%;\" id=\"l" + model.tagid + "\"><i class=\"i_" + showtype + "\"><h4>" + model.tagname + "</h4><strong class=\"hover_" + showtype + "\">HT:" + model.vmax + "℃</strong></i><b></b></a>");
                currnum++;
            }
            return sb.ToString() + "," + htprecent + "%";
        }
        //根据分区最高温度获取所在定位点
        private int GetTagIDByHT(List<V_RealTimeData_dts> list, int tagid, double vmax)
        {
            List<V_RealTimeData_dts> mlist = list.Where(d => d.parentid == tagid && d.vmax == vmax).ToList();
            int vtagid = 0;
            if (mlist.Count > 0)
            {
                vtagid = mlist[0].tagid;
            }
            return vtagid;
        }
        [Login]
        //获取光纤测温报警信息
        public ActionResult OpticFiberAlarm(int pid, string did)
        {
            //获取报警列表
            string strsql = "SELECT *  FROM t_AlarmTable_en WHERE TagID > 0 and pid=" + pid + " and did in (" + did + ") and AlarmState>0 and AlarmAddress<300";
            List<t_AlarmTable_en> list = bll.ExecuteStoreQuery<t_AlarmTable_en>(strsql).ToList();
            int alarmindex = 0, alarmstate = 0;//报警位置，报警状态
            string stralarminfo = "", strtagid = "", strpalarm = "";//报警信息，报警分区ID，分区报警信息
            if (list.Count() > 0)
            {
                //获取定位点列表
                List<int> listid = new List<string>(did.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_cm_pointmapdts> listpoints = bll.t_cm_pointmapdts.Where(p => p.pid == pid && p.parentid > 0 && listid.Contains((int)p.did)).ToList();
                // List<t_cm_pointmapdts> listpoints = bll.ExecuteStoreQuery<t_cm_pointmapdts>(strsql).ToList();

                foreach (t_AlarmTable_en model in list)
                {
                    alarmindex = Convert.ToInt32(model.AlarmAddress);
                    alarmstate = (int)model.AlarmState;
                    //分区报警信息
                    if (!strpalarm.Contains(model.TagID + ","))
                    {
                        if (!strpalarm.Equals(""))
                            strpalarm = strpalarm + "|";
                        strpalarm = strpalarm + model.TagID + "," + alarmstate;
                    }
                    //定位点报警信息   
                    if (!stralarminfo.Equals(""))
                        stralarminfo = stralarminfo + "|";
                    //获取定位点信息
                    strtagid = AlarmTag(listpoints, alarmindex);
                    stralarminfo = stralarminfo + strtagid + "," + model.AlarmState;
                }
            }
            stralarminfo = strpalarm + "$" + stralarminfo;
            return Content(stralarminfo);
        }
        //根据报警位置获取对应的定位点ID
        private string AlarmTag(List<t_cm_pointmapdts> list, int alarmindex)
        {
            string tagid = "";
            list = list.Where(p => p.endPt <= alarmindex).OrderByDescending(p => p.endPt).ToList();
            if (list.Count() > 0)
                tagid = list[0].tagid.ToString();
            return tagid;
        }
        //设备、通道、分区树 combotree
        public ActionResult DevChaZonParams()
        {
            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string strsql = "select * from t_cm_pointmapdts where pid in (" + pdrlist + ") and parentid = 0 order by did";
            List<t_cm_pointmapdts> list = bll.ExecuteStoreQuery<t_cm_pointmapdts>(strsql).ToList();
            string strJson = ComboTree.GetDevZoneComboTree(list);

            return Content(strJson);
        }
    }
}
