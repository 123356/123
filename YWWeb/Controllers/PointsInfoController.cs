using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using YWWeb.PubClass;
using Newtonsoft.Json;
using System.Data;
using System.Data.OleDb;
using System.Text;

namespace YWWeb.Controllers
{
    public class PointsInfoController : UserControllerBaseEx
    {
        //
        // GET: /PointsInfo/
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
        public ActionResult SensorList()
        {
            return View();
        }
        public ActionResult PointsList()
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
                string query = " 1=1";
                if (pid > 0)
                    query = query + " and pid=" + pid;
                if (did > 0)
                    query = query + " and did=" + did;
                if (!tagname.Equals(""))
                    query = query + " and tagname like '%" + tagname + "%'";


                var rowcounts = bll.P_HisDataCount("V_Points_Contrast", query).ToList();
                int rowcount = rowcounts[0].Value;
                List<t_CM_PointsInfo> list = bll.P_PointsInfo("V_Points_Contrast", "*", "tagid", rows, page, true, query).ToList();
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
            List<V_Points_Contrast> list = bll.V_Points_Contrast.Where(p => p.TagID == tagid).ToList();
            if (list.Count > 0)
            {
                V_Points_Contrast info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }
        //获取光纤设备
        public ActionResult GetDevicesinfo()
        {
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            //string pdrlist = CurrentUser.PDRList;
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
                if (list.Count > 0)
                {
                    strTemp = list[0].text;
                    //strTemp = GZipCompressHelper.Decompress(strTemp).TrimEnd(',');
                }
                if (!strTemp.Equals(""))
                {
                    //点数
                    strJson = strTemp.Substring(0, strTemp.IndexOf(','));
                    //点数+通道+时间
                    strTemp = strTemp.Substring(27);
                }
                return Content(strJson + "|" + strTemp);
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
        //保存测点对照表
        public ActionResult SavePointmapdts(t_cm_pointmapdts model)
        {
            string result = "OK";
            //新增
            try
            {
                List<t_cm_pointmapdts> list = bll.t_cm_pointmapdts.Where(p => p.tagid == model.tagid).ToList();
                if (list.Count > 0)//修改
                {
                    string strsql = "update t_cm_pointmapdts set dname='" + model.dname + "',channelsinfoid=" + model.channelsinfoid + ",cname='" + model.cname + "',zonename='" + model.zonename + "',zoneno=" + model.zoneno + " where tagid=" + model.tagid;
                    bll.ExecuteStoreCommand(strsql, null);
                    Common.InsertLog("光纤分区对照管理", CurrentUser.UserName, "修改光纤分区对照[测点ID:" + model.tagid + "]");
                }
                else
                {
                    bll.t_cm_pointmapdts.AddObject(model);
                    bll.SaveChanges();
                    Common.InsertLog("光纤分区对照管理", CurrentUser.UserName, "新增光纤分区对照[定位点ID:" + model.tagid + "]");
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
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
        //public t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}

        #region "传感器信息模块"
        /// <summary>
        /// 获取传感器信息
        /// </summary>
        /// <param name="SN">传感器编码</param>
        /// <param name="SType">传感器类型</param>
        /// <returns></returns>
        private DataSet GetSensorInfoBySN(string SNS, string SType)
        {
            DataSet ds = new DataSet();
            try
            {
                string sqlStr = string.Empty;
                if (string.IsNullOrEmpty(SNS))
                {
                    //返回为空
                }
                else
                {
                    if (string.IsNullOrEmpty(SType))
                    {
                        sqlStr = string.Format("select sv.SN, sv.DevName, sv.DevModel, st.Enable, st.InstallTime  from v_BaseProductOrder sv left join t_InstallInfo st on  sv.ProductID = st.ProductID where sv.SN in ( {0} );", SNS);
                        ds = SQLtoDataSet.GetSensorListSummary(sqlStr);
                    }
                    else
                    {
                        sqlStr = string.Format("select sv.SN, sv.DevName, sv.DevModel, st.Enable, st.InstallTime  from v_BaseProductOrder sv left join t_InstallInfo st on  sv.ProductID = st.ProductID where sv.SN in ( {0} ) and sv.DevModel like '%{1}%';", SNS, SType);
                        ds = SQLtoDataSet.GetSensorListSummary(sqlStr);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        /// <summary>
        /// 获取点表的信息
        /// </summary>
        /// <param name="did">设备编号</param>
        /// <param name="CPositin">监测位置</param>
        /// <returns></returns>
        private DataSet GetPointInfoByDid(string did, string CPositin)
        {
            DataSet ds = new DataSet();
            try
            {
                string sqlStr = string.Empty;
                if (string.IsNullOrEmpty(did))
                {
                    //返回为空
                }
                else
                {
                    if (string.IsNullOrEmpty(CPositin))
                    {
                        sqlStr = string.Format("select p.TagID,  p.传感器SN编码, p.Position, d.DeviceName, d.PName,  pdr.Position as pAddr    from   t_cm_PointsInfo p  left join  t_DM_DeviceInfo d on  p.DID = d.DID  left join  t_CM_PDRInfo  pdr  on  d.PID = pdr.PID  where p.DiD in (  {0}  );", did);
                        ds = SQLtoDataSet.GetReportSummary(sqlStr);
                    }
                    else
                    {
                        sqlStr = string.Format("select  p.TagID,  p.传感器SN编码, p.Position, d.DeviceName, d.PName,  pdr.Position as pAddr    from   t_cm_PointsInfo p  left join  t_DM_DeviceInfo d on  p.DID = d.DID  left join  t_CM_PDRInfo  pdr  on  d.PID = pdr.PID  where p.DiD in (  {0}  ) and p.Position like '%{1}%';", did, CPositin);
                        ds = SQLtoDataSet.GetReportSummary(sqlStr);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        /// <summary>
        ///  获取全部传感器列表需要显示的Json信息
        /// </summary>
        /// <param name="did">设备编号</param>
        /// <param name="SType">传感器类型</param>
        /// <param name="CPositin">监测位置</param>
        /// <returns></returns>
        private string GetAllShownSensorInfo(int rows, int page, string did, string SType, string CPositin)
        {
            string Json = string.Empty;
            try
            {
                string SNs = string.Empty;
                DataSet PDataSet = new DataSet();
                DataSet SDataSet = new DataSet();
                SNs = GetSNsByDid(did);
                SNs = SNs.TrimEnd(',');
                SDataSet = GetSensorInfoBySN(SNs, SType);
                PDataSet = GetPointInfoByDid(did, CPositin);
                if (PDataSet != null && PDataSet.Tables.Count > 0 && PDataSet.Tables[0].Rows.Count > 0)
                {
                    Json = "{ \"" + "total" + "\":" + PDataSet.Tables[0].Rows.Count.ToString() + "," + "\"" + "rows\"" + ":[";
                    for (int i = 0; i < PDataSet.Tables[0].Rows.Count; i++)
                    {
                        if (i < rows * (page - 1))
                        {
                            continue;
                        }
                        else
                        {
                            Json = Json + "{";
                            Json = Json + "\"TagID\": \"" + PDataSet.Tables[0].Rows[i]["TagID"].ToString() + "\",";
                            Json = Json + "\"传感器SN编码\": \"" + PDataSet.Tables[0].Rows[i]["传感器SN编码"].ToString() + "\",";
                            Json = Json + "\"PName\": \"" + PDataSet.Tables[0].Rows[i]["PName"].ToString() + "\",";
                            Json = Json + "\"DeviceName\": \"" + PDataSet.Tables[0].Rows[i]["DeviceName"].ToString() + "\",";
                            Json = Json + "\"Position\": \"" + PDataSet.Tables[0].Rows[i]["Position"].ToString() + "\",";
                            Json = Json + "\"pAddr\": \"" + PDataSet.Tables[0].Rows[i]["pAddr"].ToString() + "\",";

                            if (SDataSet != null && SDataSet.Tables.Count > 0 && SDataSet.Tables[0].Rows.Count > 0)
                            {
                                //标志
                                bool flag = true;
                                for (int j = 0; j < SDataSet.Tables[0].Rows.Count; j++)
                                {
                                    if (PDataSet.Tables[0].Rows[i]["传感器SN编码"].ToString().Trim().Equals(SDataSet.Tables[0].Rows[j]["SN"].ToString().Trim()))
                                    {
                                        Json = Json + "\"DevName\": \"" + SDataSet.Tables[0].Rows[j]["DevName"].ToString() + "\",";
                                        Json = Json + "\"DevModel\": \"" + SDataSet.Tables[0].Rows[j]["DevModel"].ToString() + "\",";
                                        Json = Json + "\"InstallTime\": \"" + SDataSet.Tables[0].Rows[j]["InstallTime"].ToString() + "\",";
                                        Json = Json + "\"Enable\": \"" + SDataSet.Tables[0].Rows[j]["Enable"].ToString().ToLower() + "\",";
                                        flag = false;
                                        break;
                                    }
                                }
                                if (flag)
                                {
                                    //传感器表里面没有查到匹配的基础信息
                                    Json = Json + "\"DevName\": \"" + "" + "\",";
                                    Json = Json + "\"DevModel\": \"" + "" + "\",";
                                    Json = Json + "\"InstallTime\": \"" + "" + "\",";
                                    Json = Json + "\"Enable\": \"" + "" + "\",";
                                }
                                else
                                {
                                }
                            }
                            else
                            {
                                //传感器表里面没有查到基础信息
                                Json = Json + "\"DevName\": \"" + "" + "\",";
                                Json = Json + "\"DevModel\": \"" + "" + "\",";
                                Json = Json + "\"InstallTime\": \"" + "" + "\",";
                                Json = Json + "\"Enable\": \"" + "" + "\",";
                            }
                            Json = Json.TrimEnd(',');
                            Json = Json + "},";
                        }
                        if (i >= rows * page - 1)
                        {
                            break;
                        }
                        else
                        { }
                    }
                    Json = Json.TrimEnd(',');
                    Json = Json + "]}";
                }
                else
                {
                    Json = Json + "{\"total\":0,\"rows\":[]}";
                }
            }
            catch (Exception ex)
            {
                //throw ex;

                Json = Json + "{\"total\":0,\"rows\":[]}";
                return Json;
            }
            return Json;
        }
        /// <summary>
        /// 获取SN编码序列
        /// </summary>
        /// <param name="did">设备编号</param>
        /// <returns></returns>
        private string GetSNsByDid(string did)
        {
            string SNs = string.Empty;
            try
            {
                if (string.IsNullOrEmpty(did))
                {
                    SNs = string.Empty;
                }
                else
                {
                    string sqlStr = string.Format("select  p.传感器SN编码 from t_cm_PointsInfo p where p.DiD in (  {0}  );", did);
                    DataSet ds = new DataSet();
                    ds = SQLtoDataSet.GetReportSummary(sqlStr);
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                        {
                            if (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["传感器SN编码"].ToString()))
                            {
                                //当前传感器SN编码为空
                            }
                            else
                            {
                                SNs += ds.Tables[0].Rows[i]["传感器SN编码"].ToString() + ",";
                            }
                        }
                    }
                    else
                    {
                        SNs = string.Empty;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return SNs;
        }

        /// <summary>
        /// 传感器信息显示
        /// </summary>
        /// <param name="rows"></param>
        /// <param name="page"></param>
        /// <param name="did"></param>
        /// <param name="SType"></param>
        /// <param name="CPositin"></param>
        /// <returns></returns>
        public ActionResult ShownSensorInfo(int rows, int page, string did = "", string SType = "", string CPositin = "")
        {
            string strJson = string.Empty;

            strJson = GetAllShownSensorInfo(rows, page, did, SType, CPositin);

            return Content(strJson);
        }
        #endregion


        #region 点表管理

        /// <summary>
        /// 点表管理查询
        /// </summary>
        [Login]
        public ActionResult PointsListData(int pid, string tagname, string chinesedesc, int rows, int page)
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                string query = "select * from  t_CM_PointsInfo where 1=1";
                if (pid > 0)
                    query = query + " and pid=" + pid;
                if (!tagname.Equals(""))
                    query = query + " and tagid like '%" + tagname + "%'";
                if (!chinesedesc.Equals(""))
                    query = query + " and 中文描述 like '%" + chinesedesc + "%'";

                //List<t_CM_PointsInfo> list = bll.P_PointsInfo("t_CM_PointsInfo", "*", "tagid", rows, page, true, query).ToList();
                List<t_CM_PointsInfo> list = bll.ExecuteStoreQuery<t_CM_PointsInfo>(query).OrderByDescending(p => p.TagID).ToList();
                string strJson = Common.List2Json(list, rows, page);

                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }


        /// <summary>
        /// 点表管理
        /// </summary>
        [Login]
        public ActionResult PointsListDatas(int pid)
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                string query = "select * from  t_CM_PointsInfo where PID=" + pid + "";
                List<t_CM_PointsInfo> list = bll.ExecuteStoreQuery<t_CM_PointsInfo>(query).OrderByDescending(p => p.TagID).ToList();
                var min = list.Min(x => x.报警上限1) / 1000;
                var max = list.Max(x => x.报警下限1) / 1000;
                // 这里就获取到了最大值和最小值了

                var result = new
                {
                    list,
                    max,
                    min
                };
                string strJson = result.ToJson();
                return new ContentResult()
                {
                    Content = strJson,
                    ContentEncoding = Encoding.UTF8,
                    ContentType = "application/json"
                };
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        //保存点表信息
        [Login]
        public ActionResult SavePointsInfo(t_CM_PointsInfo info)
        {
            string result = "OK";
            try
            {
                List<t_CM_PointsInfo> list = bll.t_CM_PointsInfo.Where(p => p.TagName == info.TagName && p.TagID != info.TagID && p.PID == info.PID).ToList();
                if (list.Count > 0)
                    result = "此测点已存在，请重新录入！ ";
                else
                {
                    info.Remarks = info.Remarks.Trim();
                    info.TagName = info.TagName.Trim();
                    if (info.TagID > 0)
                    {
                        t_CM_PointsInfo pointsinfo = bll.t_CM_PointsInfo.Where(r => r.TagID == info.TagID).First();
                        pointsinfo.ABCID = info.ABCID;
                        pointsinfo.DataTypeID = info.DataTypeID;
                        pointsinfo.DID = info.DID;
                        pointsinfo.MPID = info.MPID;
                        pointsinfo.PIOID = info.PIOID;
                        pointsinfo.PID = info.PID;
                        pointsinfo.CID = info.CID;
                        pointsinfo.Position = info.Position;
                        pointsinfo.TagName = info.TagName;
                        pointsinfo.报警上限1 = info.报警上限1;
                        pointsinfo.报警上限2 = info.报警上限2;
                        pointsinfo.报警上限3 = info.报警上限3;
                        //pointsinfo.报警死区 = info.报警死区;
                        pointsinfo.传感器SN编码 = info.传感器SN编码;
                        pointsinfo.工程上限 = info.工程上限;
                        pointsinfo.工程下限 = info.工程下限;
                        pointsinfo.实时库索引 = info.实时库索引;
                        pointsinfo.数据类型 = info.数据类型;
                        pointsinfo.通信地址 = info.通信地址;
                        pointsinfo.中文描述 = info.中文描述;
                        pointsinfo.变比 = info.变比;
                        pointsinfo.系数 = info.系数;

                        pointsinfo.报警下限1 = info.报警下限1;
                        pointsinfo.报警下限2 = info.报警下限2;
                        pointsinfo.报警下限3 = info.报警下限3;
                        //pointsinfo.站内点号 = info.站内点号;
                        //pointsinfo.置0说明 = info.置0说明;
                        //pointsinfo.置1说明 = info.置1说明;
                        //pointsinfo.初始值 = info.初始值;
                        //pointsinfo.单位 = info.单位;
                        //pointsinfo.例外报告死区 = info.例外报告死区;
                        //pointsinfo.码值上限 = info.码值上限;
                        //pointsinfo.码值下限 = info.码值下限;
                        //pointsinfo.远动数据类型 = info.远动数据类型;
                        //pointsinfo.报警定义 = info.报警定义;
                        //pointsinfo.分组 = info.分组;                         
                        //pointsinfo.最大间隔时间 = info.最大间隔时间;
                        //pointsinfo.小信号切除值 = info.小信号切除值;
                        //pointsinfo.报警级别 = info.报警级别;
                        //pointsinfo.报警方式 = info.报警方式;
                        //pointsinfo.速率报警限制 = info.速率报警限制;
                        //pointsinfo.UseState = info.UseState;
                        //pointsinfo.设备点名 = info.设备点名;

                        if (info.Remarks != null)
                            pointsinfo.Remarks = Server.HtmlEncode(info.Remarks).Replace("\n", "<br>");
                        else
                            pointsinfo.Remarks = info.Remarks;

                        bll.ObjectStateManager.ChangeObjectState(pointsinfo, EntityState.Modified);
                        bll.SaveChanges();
                        Common.InsertLog("点表管理", CurrentUser.UserName, "编辑点表信息[" + pointsinfo.TagName + "]");
                        result = "OKedit";
                    }
                    else
                    {
                        //int realtimeindex = (int)bll.t_CM_PointsInfo.Max(r => r.实时库索引);//博高不需要
                        info.实时库索引 = 0;//realtimeindex + 1;
                        info.例外报告死区 = 0.1;
                        info.码值下限 = 0;
                        info.码值上限 = 125;
                        //info.远动数据类型 = "UI";
                        //info.报警下限1 = -999000;
                        //info.报警下限2 = -999000;
                        //info.报警下限3 = -999000;
                        info.报警定义 = 1;
                        info.分组 = 1;
                        info.初始值 = 0;
                        info.最大间隔时间 = 30;
                        info.小信号切除值 = 0;
                        info.报警级别 = 0;
                        info.报警方式 = 1;
                        info.速率报警限制 = 0;
                        info.UseState = 0;
                        if (info.Remarks != null)
                            info.Remarks = info.Remarks.Replace("\n", "<br>");
                        else
                            info.Remarks = info.Remarks;
                        bll.t_CM_PointsInfo.AddObject(info);
                        bll.SaveChanges();

                        Common.InsertLog("点表管理", CurrentUser.UserName, "新增点表信息[" + info.TagName + "]");
                        result = "OKadd" + "," + info.TagID;// +"," + info.实时库索引;
                    }
                    updatePointStatu((int)info.PID);
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return Content(result);
        }
        void updatePointStatu(int PID)
        {
            string strsql = "delete from t_CM_PDRPointStatu where PID =" + PID;
            strsql += string.Format(" insert into t_CM_PDRPointStatu(PID,statu,changedTime) values({0},{1},'{2}')", PID, 1, DateTime.Now.ToString());
            int docount = bll.ExecuteStoreCommand(strsql, null);
        }
        [Login]
        public ActionResult DeletePoints(int PID, int[] tagIDS)
        {
            string result = "OK";
            try
            {
                if (tagIDS.Length > 0)
                {
                    string ids = tagIDS[0].ToString();
                    for (int i = 1; i < tagIDS.Length; i++)
                        ids += "," + tagIDS[i].ToString();
                    string strsql = "delete from t_CM_PointsInfo where TagID in (" + ids + ")";
                    int docount = bll.ExecuteStoreCommand(strsql, null);
                    string userName = "错误用户？";
                    if (null != CurrentUser)
                        userName = CurrentUser.UserName;

                    //删除实时表中相应的点
                    string tablename = "t_SM_RealTimeData_" + PID.ToString("00000");
                    strsql = "delete from "+ tablename + " where TagID in (" + ids + ")";
                    bll.ExecuteStoreCommand(strsql, null);
                    //
                    Common.InsertLog("点表管理", userName, "删除点表信息[" + ids + "]");
                    updatePointStatu(PID);
                    result = "OK";
                }

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return Content(result);
        }
        //导出点表信息
        [Login]
        public ActionResult ExportPointsInfoData(int pid, string tagname, string chinesedesc)
        {
            //string pdrlist = CurrentUser.PDRList;

            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string query = " where 1=1";
            if (pid > 0)
                query = query + " and pid=" + pid;
            if (!tagname.Equals(""))
                query = query + " and tagname like '%" + tagname + "%'";
            if (!chinesedesc.Equals(""))
                query = query + " and 中文描述 like '%" + chinesedesc + "%'";

            string strsql = "select 数据类型,中文描述,TagName as 测点名称,站内点号,TagID as 点编号,实时库索引,PID as 站编 ,通信地址,例外报告死区,工程下限,工程上限,码值下限,码值上限,远动数据类型,报警下限1,报警上限1,报警定义,置0说明,置1说明,单位,分组,初始值,最大间隔时间,小信号切除值,报警下限2,报警上限2,报警下限3,报警上限3,报警死区,报警级别,报警方式,速率报警限制,DID as 所属设备号,DataTypeID as 数据类型ID,Position as 测点位置,MPID as 监测位置,UseState as 使用状态,PIOID as 进出线ID,ABCID as ABC相ID,Remarks as 备注,设备点名,传感器SN编码  from  t_CM_PointsInfo " + query + " order by TagID desc";
            DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
            ExportExcel.doExport2003(ds, "~/DownLoad/pointsinfodata.xls");
            return Content("/DownLoad/pointsinfodata.xls");
        }
        #endregion

        [Login]
        public string PostExcelData(string FilePath, string ExcelVer, int Mode = 0)
        {
            string Result;
            try
            {
                // 连接字符串            
                string xlsPath = Server.MapPath(FilePath); // 绝对物理路径
                string connStr = "Provider=Microsoft.Jet.OLEDB.4.0;" +
                                "Extended Properties=Excel 8.0;" +
                                "data source=" + xlsPath;
                if (ExcelVer == "xls")
                {
                    connStr = "Provider=Microsoft.Jet.OLEDB.4.0;" +
                                    "Extended Properties=Excel 8.0;" +
                                    "data source=" + xlsPath;
                }
                else
                {
                    connStr = "Provider=Microsoft.ACE.OLEDB.12.0;" +
                                    "Extended Properties=Excel 12.0;" +
                                    "data source=" + xlsPath;
                }

                OleDbConnection conn = new OleDbConnection(connStr);
                conn.Open();
                OleDbDataAdapter myCommand = null;
                DataSet ds = null;

                //返回Excel的架构，包括各个sheet表的名称,类型，创建时间和修改时间等  
                DataTable dtSheetName = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, new object[] { null, null, null, "Table" });
                //包含excel中表名的字符串数组
                string[] SheetName = new string[dtSheetName.Rows.Count];
                for (int k = 0; k < dtSheetName.Rows.Count; k++)
                {
                    SheetName[k] = dtSheetName.Rows[k]["TABLE_NAME"].ToString();
                }

                // 查询语句
                string sql = "SELECT * FROM [" + SheetName[0] + "]";
                myCommand = new OleDbDataAdapter(sql, connStr);
                ds = new DataSet();
                myCommand.Fill(ds, SheetName[0]);
                //创建新导入日志
                //往日志内导入数据
                string InportResult = ExportExcel.doImport2003(ds, Mode);
                if (InportResult == "OK")
                {
                    //log
                    Common.InsertLog("测点管理", CurrentUser.UserName, "导入测点列表[" + FilePath + "]");
                    Result = "OK";
                }
                else
                {
                    Result = InportResult;
                }
                return Result;
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return "导入失败！";
            }
        }
    }
}
