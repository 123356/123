using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using S5001Web.PubClass;
using System.Text;
using DAL;
using IDAO.Models;
using Newtonsoft.Json;


namespace S5001Web.Controllers
{
    public class BaseInfoController : Controller
    {
        //
        // GET: /BaseInfo/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Index()
        {
            return View();
        }

        //加载合同列表
        public ActionResult BindCtrContName(int showall = 0)
        {
            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            if (pdrlist == null)
                return Content("");
            List<int> resultlist = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));

            var query = from module in bll.t_CM_Constract where resultlist.Contains((int)module.CtrPid) select module;
            //var query = from module in bll.t_CM_PDRInfo select module;

            List<t_CM_Constract> list = query.ToList();
            string strJson = Common.ComboboxToJson(list);
            if (showall > 0)
            {
                strJson = AddShowAll(list.Count, strJson, "id", "CtrName");
            }
            return Content(strJson);
        }

        //加载配电房列表
        public ActionResult BindPDRInfo(int showall = 0)
        {
            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            if (pdrlist == null)
                return Content("");
            List<int> resultlist = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
            var query = from module in bll.t_CM_PDRInfo where resultlist.Contains(module.PID) && module.IsLast == 1 select module;
            //var query = from module in bll.t_CM_PDRInfo select module;

            List<t_CM_PDRInfo> list = query.ToList();
            string strJson = Common.ComboboxToJson(list);
            if (showall > 0)
            {
                if (showall == 6)//配电房编辑
                    strJson = strJson.Replace("[", "[{\"PID\":\"0\",\"Name\":\"==无==\"},");
                else if (showall == 7)////过滤非站点  added by zzz 2016年3月12日11:07:48
                {
                    list = query.Where(p => p.IsLast == 1).ToList();
                    strJson = Common.ComboboxToJson(list);
                }
                else
                {
                    list = query.Where(p => p.IsLast == 1).ToList();////过滤非站点  added by zzz 2016年3月12日11:07:48
                    strJson = Common.ComboboxToJson(list);
                    strJson = AddShowAll(list.Count, strJson, "PID", "Name");
                }
            }
            return Content(strJson);
        }
        //隐患列表BugInfo
        public ActionResult BindBugInfo(int showall = 0, int pid = 0)
        {
            string strsql = "select CONVERT(varchar(100),ReportDate,112)+' '+ PName +' '+ ISNULL(BugLocation,'') name,BugID id from t_CM_BugInfo where pid=" + pid + " and HandeSituation in ('日常巡检','应急抢修') order by ReportDate desc";

            List<DropDownInfo> list = bll.ExecuteStoreQuery<DropDownInfo>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            if (showall > 0)
            {
                if (showall == 6)//配电房编辑
                {
                    if (strJson != "[]")
                        strJson = strJson.Replace("[", "[{\"id\":\"0\",\"name\":\"==无==\"},");
                }
                else
                {
                    strJson = Common.ComboboxToJson(list);
                    strJson = AddShowAll(list.Count, strJson, "id", "name");
                }
            }
            return Content(strJson);
        }
        //测点类型列表
        public ActionResult BindValueType(int did = 0, int showall = 0, int pid = 8)
        {
            //string strsql = "select distinct DataTypeID,TypeName Name from V_DeviceInfoState_PDR1";
            //if (did > 0)
            //    strsql = strsql + " where did=" + did;
            //else if (pid > 0)
            //    strsql = strsql + " where pid=" + pid;
            //List<ComboboxInfo> list = bll.ExecuteStoreQuery<ComboboxInfo>(strsql).ToList();
            //string strJson = Common.ComboboxToJson(list);
            List<t_CM_DeviceTypeComBox> list = DeviceTypeDAL.getInstance().GetRealTimeComboxData(pid, did).ToList();
            string strJson = JsonConvert.SerializeObject(list);
            if (showall > 0)
            {
                strJson = AddShowAll(list.Count, strJson, "DataTypeID", "Name");
            }

            list.Clear();
            list = null;
            return Content(strJson);
        }
        //配电房设备列表
        public ActionResult BindDeviceInfo(int pid, int showall = 0)
        {
            List<t_DM_DeviceInfo> list = bll.t_DM_DeviceInfo.OrderBy(d => d.DeviceName).ToList();
            //if (pid > 0)
            list = list.Where(d => d.PID == pid).OrderBy(p => p.OrderBy).ToList();
            //string strJson = Common.ComboboxToJson(list);
            //if (showall > 0)
            //    strJson = AddShowAll(list.Count, strJson, "DID", "DeviceName");
            return Json(list);
        }

        //添加显示全部
        private string AddShowAll(int rowcount, string strJson, string dkey, string dvalue)
        {
            if (rowcount > 0)
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==全部==\"},");
            else
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==全部==\"}");
            return strJson;
        }
        //public class ComboboxInfo
        //{
        //    public int DataTypeID { get; set; }
        //    public string Name { get; set; }
        //}
        //设备类型列表
        //[Login]
        public ActionResult BindDeviceType()
        {
            List<t_CM_DeviceType> list = bll.t_CM_DeviceType.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
        //设备结构类型列表
        //[Login]
        public ActionResult BindDeviceStructureType()
        {
            List<t_CM_DeviceStructureType> list = bll.t_CM_DeviceStructureType.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
        //加载参数类型by回路
        [Login]
        public ActionResult DataTypeParamsByCircuit(int pid, int did, int cid, int DataType = 0)
        {
            string sqlstr = "";
            if (cid > 0)
                sqlstr = " and cid = " + cid;
            if (DataType > 0)
                sqlstr += " and DataTypeID = " + DataType;
            //string strsql = "select CID,Cname,DTID,DID,TagID,TagName,CateName,TypeName,PID,PName,DeviceName,PV,Position,cast(REPLACE(DataTypeID,24,1) as int) "
            //+"DataTypeID,AlarmStatus,Units,Remarks,DeviceTypeName,ABCID,OrderBy,RecTime,中文描述 from V_DeviceInfoState_PDR1 where pid=" + pid + " and did=" + did + sqlstr + "  and DataTypeID!=23  order by DataTypeID";

            string strsql = string.Format("select  TagID,TagName,PName,a.CID,b.CName,c.DID,c.PID,c.PName,c.DeviceName,a.DataTypeID,CateName"
            + ",c.OrderBy,ABCID,a.Remarks,a.Position,d.Name as TypeName,c.DTID,e.Name AS DeviceTypeName"
            + ",CAST(-9999.0 as float) as PV,'固定描述' as 中文描述,'--' as Units,'正常' as AlarmStatus,cast('1999-01-01' as datetime) as RecTime from ("
+ "(select tagID,TagName,CID,PID,cast(REPLACE(DataTypeID,24,1) as int) DataTypeID,ABCID,Remarks,Position from t_CM_PointsInfo where PID={0} and DataTypeID!=23 {1} ) a "
+ " left join t_DM_CircuitInfo b on a.PID=b.PID and a.CID=b.CID"
+ " left join t_DM_DeviceInfo c on b.DID=c.DID and c.PID=b.PID  "
+" left join t_CM_ValueType d on d.DataTypeID=a.DataTypeID "
+" left join t_CM_DeviceType e on c.DTID=e.DTID ) order by a.DataTypeID", pid, sqlstr);
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            string strJson = "";
            if (list.Count > 0)
            {
                strJson = ComboTree.GetDataTypeComboTree(list);
            }

            //strJson = "[{\"id\":2,\"text\":\"yundong\",\"children\":[{\"id\":3,\"text\":\"zuqiu\"},{\"id\":4,\"text\":\"lanqiu\"}]},{\"id\":7,\"text\":\"xueli\",\"children\":[{\"id\":8,\"text\":\"dazhuan\"},{\"id\":9,\"text\":\"benke\"}]}]";
            return Content(strJson);
        }
        //加载参数类型
        [Login]
        public ActionResult DataTypeParams(int pid, int did, int DataType = 0)
        {
            string sqlstr = "";
            if (DataType > 0)
                sqlstr = " and DataTypeID = " + DataType;
            string strsql = "select CID,Cname,DTID,DID,TagID,TagName,CateName,TypeName,PID,PName,DeviceName,PV,Position,cast(REPLACE(DataTypeID,24,1) as int) DataTypeID,AlarmStatus,Units,Remarks,DeviceTypeName,ABCID,OrderBy,RecTime,中文描述 from V_DeviceInfoState_PDR1 where pid=" + pid + " and did=" + did + sqlstr + " and DataTypeID!=23 order by DataTypeID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            string strJson = ComboTree.GetDataTypeComboTree(list);

            //strJson = "[{\"id\":2,\"text\":\"yundong\",\"children\":[{\"id\":3,\"text\":\"zuqiu\"},{\"id\":4,\"text\":\"lanqiu\"}]},{\"id\":7,\"text\":\"xueli\",\"children\":[{\"id\":8,\"text\":\"dazhuan\"},{\"id\":9,\"text\":\"benke\"}]}]";
            return Content(strJson);
        }
        //重要程度
        //[Login]
        public ActionResult BindMajorLevel()
        {
            List<t_CM_MajorLevel> list = bll.t_CM_MajorLevel.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        //区域列表 combotree
        public ActionResult AreaComboTreeMenu()
        {
            List<t_CM_Area> list2 = bll.t_CM_Area.Where(p => p.ParentID == 0).ToList();
            StringBuilder sbMenu = new StringBuilder();
            int count = 0, rowcount = 0;
            sbMenu.Append("[{\"id\":0,\"text\":\"请选择区域\",\"children\":[");

            foreach (var model2 in list2)
            {
                sbMenu.Append("{\"id\":" + model2.AreaID + ",\"text\":\"" + model2.AreaName + "\"");
                List<t_CM_Area> list = bll.t_CM_Area.Where(p => p.ParentID == model2.AreaID).OrderBy(d => d.Sort).ToList();
                if (list.Count > 0)
                {
                    sbMenu.Append(",\"children\":[");
                }
                foreach (t_CM_Area model in list)
                {
                    if (count > 0)
                        sbMenu.Append(",");
                    sbMenu.Append("{\"id\":" + model.AreaID + ",\"text\":\"" + model.AreaName + "\"}");
                    count++;
                }
                if (list.Count > 0)
                {
                    sbMenu.Append("]");
                }
                count = 0;
                rowcount++;
                sbMenu.Append("}");
                if (rowcount < list2.Count)
                {
                    sbMenu.Append(",");
                }
            }
            sbMenu.Append("]}]");
            string strjson = sbMenu.ToString();
            return Content(strjson);
        }

        //区域列表
        public ActionResult BindAreaInfo(int showall = 0)
        {
            List<t_CM_Area> list = bll.t_CM_Area.OrderBy(d => d.Sort).ToList();
            string strJson = Common.ComboboxToJson(list);
            if (showall > 0)
                strJson = AddShowAll(list.Count, strJson, "AreaID", "AreaName");
            return Content(strJson);
        }

        //站室分类列表
        public ActionResult BindPDRTypeInfo(int showall = 0)
        {
            List<t_CM_PDRType> list = bll.t_CM_PDRType.OrderBy(d => d.Sort).ToList();
            string strJson = Common.ComboboxToJson(list);
            if (showall > 0)
                strJson = AddShowAll(list.Count, strJson, "TypeID", "TypeName");
            return Content(strJson);
        }


        //行业列表
        public ActionResult GetIndustryName(int IndustryID)
        {
            string IndustryName = "";
            List<t_ES_Industry> list = bll.t_ES_Industry.Where(p => p.IndustryID == IndustryID).ToList();
            if (list.Count > 0)
                IndustryName = list.First().IndustryName;
            return Content(IndustryName);
        }

        //电价行业类型编码
        public ActionResult GetElecIndustryName(int IndID)
        {
            string IndName = "";
            List<t_ES_ElecIndustry> list = bll.t_ES_ElecIndustry.Where(p => p.IndID == IndID).ToList();
            if (list.Count > 0)
                IndName = list.First().IndName;
            return Content(IndName);
        }

        //电价电压等级编码
        public ActionResult GetElecVoltageName(int VID)
        {
            string VName = "";
            List<t_ES_ElecVoltage> list = bll.t_ES_ElecVoltage.Where(p => p.VID == VID).ToList();
            if (list.Count > 0)
                VName = list.First().VName;
            return Content(VName);
        }
        //电压等级编码
        public ActionResult GetElecVoltagesName(int VoltageID)
        {
            string VoltageName = "";
            List<t_ES_ElecVoltages> list = bll.t_ES_ElecVoltages.Where(p => p.VoltageID == VoltageID).ToList();
            if (list.Count > 0)
                VoltageName = list.First().VoltageName;
            return Content(VoltageName);
        }

        //电价大工业类型编码
        public ActionResult GetElecBigIndustryTypeName(int BigIndTypeID)
        {
            string BigIndTypeName = "";
            List<t_ES_ElecBigIndustryType> list = bll.t_ES_ElecBigIndustryType.Where(p => p.BigIndTypeID == BigIndTypeID).ToList();
            if (list.Count > 0)
                BigIndTypeName = list.First().BigIndTypeName;
            return Content(BigIndTypeName);
        }
        //获取电压等级编码
        public ActionResult BindElecVoltagesName()
        {
            string strsql = "select * from t_ES_ElecVoltages order by VoltageID desc";
            List<t_ES_ElecVoltages> list = bll.ExecuteStoreQuery<t_ES_ElecVoltages>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        //获取区域名称
        public ActionResult GetAreaName(int AreaID)
        {
            string AreaName = "";
            List<t_CM_Area> list = bll.t_CM_Area.Where(p => p.AreaID == AreaID).ToList();
            if (list.Count > 0)
                AreaName = list.First().AreaName;
            return Content(AreaName);
        }

        //获取站室分类名称
        public ActionResult GetTypeName(int TypeID)
        {
            string TypeName = "";
            List<t_CM_PDRType> list = bll.t_CM_PDRType.Where(p => p.TypeID == TypeID).ToList();
            if (list.Count > 0)
                TypeName = list.First().TypeName;
            return Content(TypeName);
        }

        //获取站室使用状态
        public ActionResult GetUseState(int UseState)
        {
            string UseStateNane = "";
            if (UseState == 0)
            {
                UseStateNane = "正常使用";
            }
            else
            {
                UseStateNane = "暂停使用";
            }
            return Content(UseStateNane);
        }

        //获取配电房环境温度TagID
        public ActionResult BindPDRTemp(int pid)
        {
            string strsql = "select * from t_CM_PointsInfo where (DataTypeID=12 or DataTypeID=24) and DID in (select DID from t_DM_DeviceInfo where PID=" + pid + ")";
            List<t_CM_PointsInfo> list = bll.ExecuteStoreQuery<t_CM_PointsInfo>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
        //加载用户列表《后期根据角色区分》
        [Login]
        public ActionResult BindUserInfo()
        {
            List<int?> unlist = new List<int?>();

            string str = HomeController.GetUserID();
            str.Split(',').ToList().ForEach(p =>
            {
                unlist.Add(Convert.ToInt32(p));
            });
            List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(p => unlist.Contains(p.UserID)).ToList();



            var result = from r in list
                         select new
                         {
                             UserID = r.UserID,
                             UserName = r.UserName
                         };
            return Json(result);
        }
        [Login]
        public ActionResult BindUserByPID(int pid)
        {

            List<int?> unlist = new List<int?>();

            string str = HomeController.GetUserID();
            str.Split(',').ToList().ForEach(p =>
            {
                unlist.Add(Convert.ToInt32(p));
            });
            List<t_CM_UserInfo> list = bll.t_CM_UserInfo.Where(p=>unlist.Contains(p.UserID)).ToList();
            var result = from r in list
                         select new
                         {
                             id = r.UserID,
                             name = r.UserName
                         };
            //string strsql = "select UserID id,UserName name from t_CM_UserInfo where ','+pdrlist+',' like '%," + pid + ",%'";
            //List<DropDownInfo> list = bll.ExecuteStoreQuery<DropDownInfo>(strsql).ToList();
            //string strJson = Common.ComboboxToJson(list);
            return Json(result);
        }
        //配电房与设备列表 combotree
        public ActionResult PdrDevComboTreeMenu()
        {
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            //string pdrlist = CurrentUser.PDRList;
            string strsql = "select * from ( select row_number() over(partition by did order by pid desc) as rownum , * from V_DeviceInfoState_PDR1 where DataTypeID!=23) as T where T.rownum = 1 order by pid";
            if (!pdrlist.Equals(""))
                strsql = "select * from ( select row_number() over(partition by did order by pid desc) as rownum , * from V_DeviceInfoState_PDR1 where DataTypeID!=23 and pid in (" + pdrlist + ")) as T where T.rownum = 1 order by pid";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            string strJson = ComboTree.GetPdrDevComboTree(list);

            return Content(strJson);
        }

        //配电房与设备列表 combotree
        public ActionResult PdrDevComboTreeMenuByPID(int pid = 0)
        {
            string strJson = "{ }";
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            if (!string.IsNullOrEmpty(pdrlist)&&!(pdrlist.Split(',')).Contains(pid.ToString()))
            {
                pid = -1;
            }
            //string pdrlist = CurrentUser.PDRList;
            //string strsql = "select * from ( select row_number() over(partition by did order by pid desc) as rownum , * from V_DeviceInfoState_PDR1 where DataTypeID!=23  and pid = " + pid + ") as T where T.rownum = 1 order by pid";
            //if (!pdrlist.Equals(""))
            //    strsql = "select * from ( select row_number() over(partition by did order by pid desc) as rownum , * from V_DeviceInfoState_PDR1 where DataTypeID!=23 and pid in (" + pdrlist + ") and pid = "+pid+") as T where T.rownum = 1 order by pid";
            if(pid>0)
            {
                string strsql = string.Format("select * from ("
                + "select row_number() over(partition by c.did order by c.pid desc) as rownum , a.tagID,a.CID,c.DID,c.PID,c.PName,c.DeviceName from "
                + " (select tagID,CID,PID from t_CM_PointsInfo where PID={0} and DataTypeID!=23) a "
                + " left join t_DM_CircuitInfo b on a.PID=b.PID and a.CID=b.CID "
                + " left join t_DM_DeviceInfo c on b.DID=c.DID and c.PID=b.PID ) as t"
                + " where t.rownum=1", pid);
                List<S5001Web.PubClass.ComboTree.V_DeviceInfoState> list = bll.ExecuteStoreQuery<S5001Web.PubClass.ComboTree.V_DeviceInfoState>(strsql).ToList();
                if (list.Count > 0)
                {
                    strJson = ComboTree.GetPdrDevComboTree(list);
                }
            }

            return Content(strJson);
        }

        //回路列表 combotree
        public ActionResult getCidByPID(int pid = 0,int did = 0,int showAll=0)
        {
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            //string pdrlist = CurrentUser.PDRList;
            string strsql = "select CID,CName from ( select row_number() over(partition by cid order by pid desc) as rownum , * from t_DM_CircuitInfo where  pid = " + pid + " and did=" + did + ") as T where T.rownum = 1 order by did";
            if (!pdrlist.Equals(""))
                strsql = "select CID,CName from ( select row_number() over(partition by cid order by pid desc) as rownum , * from t_DM_CircuitInfo where  pid in (" + pdrlist + ") and pid = " + pid + "and did=" + did + ") as T where T.rownum = 1 order by did";
            List<CircuitName> list = bll.ExecuteStoreQuery<CircuitName>(strsql).ToList();

            if (list.Count == 0&&0==showAll)
            {
                CircuitName nc = new CircuitName();
                nc.cid = 0;
                nc.cname = "全部";
                list.Insert(0, nc);
            }
            string strJson = JsonHelper.ToJson(list);

            return Content(strJson);
        }

        //配电房与变压器列表 combotree  //用于电能质量 
        public ActionResult PdrTraComboTreeMenu(int ShowAll = 0)
        {
            if (CurrentUser == null)
            {
                return Content("");
            }
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            //string pdrlist = CurrentUser.PDRList;
            string DT = " DTID = 3 ";
            if (ShowAll > 0)
            {
                DT = " 1=1 ";
            }
            string strsql = "SELECT * FROM V_DeviceDetail where " + DT + " order by pid";
            if (!pdrlist.Equals(""))
                strsql = "SELECT * FROM V_DeviceDetail where " + DT + " and pid in (" + pdrlist + ") order by pid";
            List<V_DeviceDetail> list = bll.ExecuteStoreQuery<V_DeviceDetail>(strsql).ToList();
            string strJson = ComboTree.GetPdrTraComboTree(list);

            return Content(strJson);
        }

        //获取站室公司名称
        [Login]
        public ActionResult BindPDRCompanyName()
        {
            string strsql = "select PID,CompanyName from ( select row_number() over(partition by CompanyName order by PID) as rownum , * from t_CM_PDRInfo) as T where T.rownum = 1 order by PID ";
            List<CompanyInfo> list = bll.ExecuteStoreQuery<CompanyInfo>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        //public ActionResult BindPDRIndustryName()
        //{
        //    string strsql = "select a.IndustryID,a.IndustryName,b.Name from t_ES_Industry a inner join t_CM_PDRInfo b on a.IndustryID=b.IndustryID";
        //    List<t_ES_Industry> list = bll.ExecuteStoreQuery<>
        //}

        //获取单位名称
        [Login]
        public ActionResult BindUnitName()
        {
            string strsql = "select * from  t_CM_Unit where UnitID IN (" + CurrentUser.UNITList + ") order by UnitID desc";
            List<t_CM_Unit> list = bll.ExecuteStoreQuery<t_CM_Unit>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        //获取行业名称
        public ActionResult BindIndustryName()
        {
            string strsql = "select * from t_ES_Industry order by IndustryID desc";
            List<t_ES_Industry> list = bll.ExecuteStoreQuery<t_ES_Industry>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        //获取电价行业类型编码
        public ActionResult BindElecIndustryName()
        {
            string strsql = "select * from t_ES_ElecIndustry order by IndID desc";
            List<t_ES_ElecIndustry> list = bll.ExecuteStoreQuery<t_ES_ElecIndustry>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        //获取电价电压等级编码
        public ActionResult BindElecVoltageName()
        {
            string strsql = "select * from t_ES_ElecVoltage order by VID desc";
            List<t_ES_ElecVoltage> list = bll.ExecuteStoreQuery<t_ES_ElecVoltage>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        //获取电价大工业类型编码
        public ActionResult BindElecBigIndustryTypeName()
        {
            string strsql = "select * from t_ES_ElecBigIndustryType order by BigIndTypeID desc";
            List<t_ES_ElecBigIndustryType> list = bll.ExecuteStoreQuery<t_ES_ElecBigIndustryType>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }

        //曲线报表默认加载设备参数
        public string SelectPoints(int pid, int did, int cid)
        {
            string res = "";
            string strsql = "select * from V_DeviceInfoState_PDR1 where pid=" + pid + " and did=" + did + " and cid = " + cid + " and DataTypeID!=23 order by DataTypeID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            List<V_DeviceInfoState_PDR1> Tinlist = list.Where(g => g.DataTypeID == 24).ToList();
            List<V_DeviceInfoState_PDR1> Toutlist = list.Where(g => g.DataTypeID == 12).ToList();
            //设备温度
            List<V_DeviceInfoState_PDR1> NTlist = list.Where(g => g.DataTypeID == 1).OrderByDescending(J => J.PV).ToList();
            if (NTlist.Count > 0)
            {
                V_DeviceInfoState_PDR1 jo = NTlist[0];
                List<V_DeviceInfoState_PDR1> NNTlist = NTlist.Where(k => k.Position == jo.Position).ToList();
                int Nc = NNTlist.Count;
                if (Nc > 3) Nc = 3;
                for (int i = 0; i < Nc; i++)
                {
                    V_DeviceInfoState_PDR1 dio = NNTlist[i];
                    res += dio.DataTypeID + "_" + dio.TagID + ",";
                }
            }
            //环境温度
            if (Tinlist.Count > 0)
            {
                foreach (V_DeviceInfoState_PDR1 dio in Tinlist)
                {
                    res += "24" + "_" + dio.TagID + ",";
                }
            }
            else if (Toutlist.Count > 0)
            {
                foreach (V_DeviceInfoState_PDR1 dio in Toutlist)
                {
                    res += "12" + "_" + dio.TagID + ",";
                }
            }
            //电流
            List<V_DeviceInfoState_PDR1> ETlist = list.Where(g => g.Position.Contains("电流")).ToList();
            if (ETlist.Count > 0)
            {
                V_DeviceInfoState_PDR1 jo = ETlist[0];
                List<V_DeviceInfoState_PDR1> EETlist = ETlist.Where(k => k.Position == jo.Position).ToList();
                foreach (V_DeviceInfoState_PDR1 dio in EETlist)
                {
                    res += dio.DataTypeID + "_" + dio.TagID + ",";
                }
            }
            //如果以上几个都没有数据，按顺序取3个点的数据
            if (list.Count > 0 && NTlist.Count <= 0 && Tinlist.Count <= 0 && Toutlist.Count <= 0 && ETlist.Count <= 0)
            {
                int count = list.Count;
                if (count > 2)
                    count = 2;
                for (int i = 0; i < count; i++)
                {
                    V_DeviceInfoState_PDR1 dio = list[i];
                    res += dio.DataTypeID + "_" + dio.TagID + ",";
                }
            }
            return res.TrimEnd(',');

        }
        //曲线报表默认加载设备参数
        public string SelectSinglePoint(int tagid)
        {
            string res = "";
            string strsql = "select * from V_DeviceInfoState_PDR1 where tagid=" + tagid + " and DataTypeID!=23 order by DataTypeID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            //设备温度
            if (list.Count > 0)
            {
                V_DeviceInfoState_PDR1 jo = list[0];
                res += jo.DataTypeID + "_" + jo.TagID + ",";
            }
            return res.TrimEnd(',');

        }
        [Login]
        //获取省份列表
        public ActionResult BindPromary()
        {
            List<t_Sys_Promary> list = bll.t_Sys_Promary.ToList();
            string strJson = "";
            if (list.Count > 0)
                strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }
        [Login]
        //获取城市列表
        public ActionResult BindCity(int proID)
        {
            List<t_Sys_City> list = bll.t_Sys_City.Where(c => c.proID == proID).ToList();
            string strJson = "";
            if (list.Count > 0)
                strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }
        //获取设备的测点列表
        public ActionResult BindPoints(int DID)
        {
            List<t_CM_PointsInfo> list = bll.t_CM_PointsInfo.Where(c => c.DID == DID).ToList();
            string strJson = "";
            if (list.Count > 0)
                strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }
        //获取变压器设备的回路列表 -电能质量用
        public ActionResult BindTransformerCircuit(int DID)
        {
            List<t_DM_DeviceInfo> DL = bll.t_DM_DeviceInfo.Where(o => o.DID == DID).ToList();
            List<t_DM_CircuitInfo> list = bll.t_DM_CircuitInfo.Where(c => c.DID == Convert.ToInt32(DL[0].B)).ToList();
            t_DM_CircuitInfo nc = new t_DM_CircuitInfo();
            nc.CID = 0;
            nc.DID = 0;
            nc.CName = "==全部==";
            list.Add(nc);
            list = list.OrderBy(m => m.CID).ToList();
            string strJson = "";
            if (list.Count > 0)
                strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }
        //获取工单列表
        public ActionResult BindOrderInfo(int showall = 0)
        {
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            //string pdrlist = CurrentUser.PDRList;
            List<int> resultlist = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
            var query = from module in bll.t_PM_Order where resultlist.Contains((int)module.PID) select module;
            //var query = from module in bll.t_CM_PDRInfo select module;

            List<t_PM_Order> list = query.ToList();
            string strJson = "[{\"OrderID\":\"0\",\"OrderName\":\"==无==\"}]";
            if (list.Count > 0)
            {
                strJson = Common.ComboboxToJson(list);
                if (showall > 0)
                {
                    if (showall == 6)//配电房编辑
                        strJson = strJson.Replace("[", "[{\"OrderID\":\"0\",\"OrderName\":\"==无==\"},");
                    else
                    {
                        strJson = Common.ComboboxToJson(list);
                        strJson = AddShowAll(list.Count, strJson, "OrderID", "OrderName");
                    }
                }
            }
            return Content(strJson);
        }
        //加载参数类型
        [Login]
        public ActionResult PositionParams(int did, string DataType = "")
        {
            if (!DataType.Equals(""))
                DataType = " AND DataTypeID in (" + DataType + ")";
            string strsql = "SELECT * FROM t_CM_PointsInfo WHERE DID =" + did + DataType + " ORDER BY DataTypeID desc";
            List<t_CM_PointsInfo> list = bll.ExecuteStoreQuery<t_CM_PointsInfo>(strsql).ToList();
            string strJson = ComboTree.GetPositionComboTree(list);

            //strJson = "[{\"id\":2,\"text\":\"yundong\",\"children\":[{\"id\":3,\"text\":\"zuqiu\"},{\"id\":4,\"text\":\"lanqiu\"}]},{\"id\":7,\"text\":\"xueli\",\"children\":[{\"id\":8,\"text\":\"dazhuan\"},{\"id\":9,\"text\":\"benke\"}]}]";
            return Content(strJson);
        }
        [Login]
        //获取备品备件列表
        public ActionResult BindSparePart()
        {
            List<t_CM_SparePartInfo> list = bll.t_CM_SparePartInfo.ToList();
            string strJson = "{}";
            if (list.Count > 0)
                strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }
        private t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
        //回路列表
        public ActionResult BindCircuit(int pid = 8, int did = 0, int showall = 0)
        {
            string strsql = "select * FROM  t_DM_CircuitInfo";
            if (did > 0 & showall == 0)
                strsql = strsql + " where did=" + did;
            else if (pid > 0 & showall == 0)
                strsql = strsql + " where pid=" + pid;
            List<t_DM_CircuitInfo> list = bll.ExecuteStoreQuery<t_DM_CircuitInfo>(strsql).ToList();
            t_DM_CircuitInfo nc = new t_DM_CircuitInfo();
            nc.CID = 0;
            nc.CName = "全部";
            list.Add(nc);
            list = list.OrderBy(c => c.CID).ToList();
            string strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }

        //回路Type 列表
        public class CircuitType
        {
            public int id { get; set; }
            public string name { get; set; }
        }

        /// <summary>
        /// 临时类型对象
        /// </summary>
        public class CircuitTypeTemp
        {
            public string name { get; set; }
        }

        //回路name 列表
        public class CircuitName
        {
            public int cid { get; set; }
            public string cname { get; set; }
        }

        //回路UserType 列表
        public ActionResult BindCircuitTypeByPID(int pid = 0, int iType = 0)
        {
            string sType = "";
            if (iType == 0)
            {
                sType = "UserType";
            }
            else if (iType == 1)
            {
                sType = "AreaType";
            }
            else if (iType == 2)
            {
                sType = "ItemType";
            }

            string strsql = "select distinct " + sType + " as name FROM  t_DM_CircuitInfo" + " where pid=" + pid + " order by " + sType;
            List<CircuitTypeTemp> listTemp = bll.ExecuteStoreQuery<CircuitTypeTemp>(strsql).ToList();

            List<CircuitType> list = new List<CircuitType>();
            CircuitType nc = new CircuitType();
            nc.id = 0;
            nc.name = "全部";
            list.Add(nc);

            for (int i = 0; i < listTemp.Count; i++)
            {
                CircuitType Tempnc = new CircuitType();
                Tempnc.id = i + 1;
                Tempnc.name = listTemp[i].name;
                list.Add(Tempnc);
            }

            //list = list.OrderBy(c => c.name).ToList();
            string strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }
        public ActionResult BindCircuitAreaTypeByPID(int pid = 0)
        {
            string strsql = "select ID,AreaType FROM  t_DM_CircuitInfo" + " where pid=" + pid + " order by AreaType";
            List<CircuitType> list = bll.ExecuteStoreQuery<CircuitType>(strsql).ToList();
            CircuitType nc = new CircuitType();
            //nc.id = 0;
            nc.name = "全部";
            list.Add(nc);
            list = list.OrderBy(c => c.name).ToList();
            string strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }
        public ActionResult BindCircuitItemTypeByPID(int pid = 0)
        {
            string strsql = "select ID,ItemType FROM  t_DM_CircuitInfo" + " where pid=" + pid + " order by ItemType";
            List<CircuitType> list = bll.ExecuteStoreQuery<CircuitType>(strsql).ToList();
            CircuitType nc = new CircuitType();
            //nc.id = 0;
            nc.name = "全部";
            list.Add(nc);
            list = list.OrderBy(c => c.name).ToList();
            string strJson = JsonHelper.ToJson(list);
            return Content(strJson);
        }

        //获取双视通道
        public ActionResult BindInfraredChannel(int pid)
        {
            string strsql = "select ChannelID id,ChannelName name from (select row_number() over(partition by channelid order by channelid) as rownum, * from t_SM_InfraredPic where PID=" + pid + ") as T where T.rownum = 1";
            List<DropDownInfo> list = bll.ExecuteStoreQuery<DropDownInfo>(strsql).ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
        //获取双视预置位
        public ActionResult BindInfraredPosition(int pid, int channelid)
        {
            string strsql = "select 4 id, positionname name from (select row_number() over(partition by positionname order by positionname) as rownum, * from t_SM_InfraredPic where PID=" + pid + " and ChannelID=" + channelid + " and positionname<>'') as T where T.rownum = 1";
            List<DropDownInfo> list = bll.ExecuteStoreQuery<DropDownInfo>(strsql).ToList();
            string strJson = Common.ComboboxToJsonAll(list);
            return Content(strJson);
        }
        //获取双视日期
        public ActionResult BindInfraredDate(int pid, int channelid)
        {
            string strsql = "select top 365 4 id,Convert(varchar(100),CommitTime,23) as name  from t_SM_InfraredPic where PID=" + pid + " and ChannelID=" + channelid + " and positionname<>'' group by  Convert(varchar(100),CommitTime,23) order by Convert(varchar(100),CommitTime,23) desc";
            List<DropDownInfo> list = bll.ExecuteStoreQuery<DropDownInfo>(strsql).ToList();
            string strJson = Common.ComboboxToJsonAll(list);
            return Content(strJson);
        }

        //数据类型
        public ActionResult BindtValueType()
        {
            List<t_CM_ValueType> list = bll.t_CM_ValueType.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
        //监测位置
        public ActionResult BindMonitorPosition()
        {
            List<t_CM_MonitorPosition> list = bll.t_CM_MonitorPosition.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
        //进出线
        public ActionResult BindPointIO()
        {
            List<t_CM_PointIO> list = bll.t_CM_PointIO.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
        //ABC
        public ActionResult BindABCPhase()
        {
            List<t_CM_ABCPhase> list = bll.t_CM_ABCPhase.ToList();
            string strJson = Common.ComboboxToJson(list);
            return Content(strJson);
        }
    }

    public class CompanyInfo
    {
        public int PID { get; set; }
        public string CompanyName { get; set; }
    }
    public class DropDownInfo
    {
        public int id { get; set; }
        public string name { get; set; }
    }
}
