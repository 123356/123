using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YWWeb.PubClass
{
    public class ComboTree
    {

        //区域
        public static string GetPDRComboTree(IList<t_CM_Area> list)
        {
            string result = "";
            foreach (t_CM_Area model in list)
            {
                result += ComboPdrList(model) + ",";
            }
            return "[{\"id\":0,\"text\":\"请选择区域\",\"children\":[" + result.TrimEnd(',') + "]}]";
        }

        // 递归树形  
        public static string ComboPdrList(t_CM_Area model)
        {
            pdermsWebEntities bll = new pdermsWebEntities();
            string res_s = "";
            //你想要在视图中得到的值  
            res_s += "{\"id\":\"" + model.AreaID + "\",\"text\":\"" + model.AreaName + "\"";

            IList<t_CM_Area> list = bll.t_CM_Area.Where(c => c.ParentID == model.AreaID).ToList();
            if (list != null && list.Count > 0)
            {
                res_s += "," + "\"children\":[";
                for (int i = 0; i < list.Count; i++)
                {
                    if (i > 0)
                        res_s += ",";
                    res_s += ComboPdrList(list[i]);
                }
                res_s += "]";
            };
            res_s += "}";
            return res_s;
        }
        //实例化测点数据类型参数
        public static string GetDataTypeComboTree(IList<V_DeviceInfoState_PDR1> list)
        {
            string result = "";
            int perid = 0, curid = 0, rowcount = 0;//上一次ID，当前ID,记录数
            foreach (V_DeviceInfoState_PDR1 model in list)
            {
                curid = (int)model.DataTypeID;
                if (perid != curid)//如果数据类型不相同
                {
                    if (perid > 0)
                        result += "]},";
                    result += "{\"id\":\"" + curid + "\",\"text\":\"" + model.TypeName + "\"";
                    result += "," + "\"children\":[";
                    rowcount = 0;
                }
                if (rowcount > 0)
                    result += ",";
                result += "{\"id\":\""+curid+"_"+ model.TagID + "\",\"text\":\"" + model.Remarks + "\"}";//添加具体的测点
                perid = curid;
                rowcount++;
            }
            result += "]}";
            return "[" + result + "]";
        }
       public class V_DeviceInfoState
        {
            public int? tagID { set; get; }
            public int? CID { set; get; }
            public int? DID { set; get; }
            public int? PID { set; get; }
            public string PName { set; get; }
            public string DeviceName { set; get; }
        }
        //实例化配电房和设备数据类型参数
        public static string GetPdrDevComboTree(IList<V_DeviceInfoState> list)
        {
            string result = "";
            int perid = 0, curid = 0, rowcount = 0;//上一次ID，当前ID,记录数
            foreach (V_DeviceInfoState model in list)
            {
                if (model.PID != null) { 
                curid = (int)model.PID;
                if (perid != curid)//如果数据类型不相同
                {
                    if (perid > 0)
                        result += "]},";
                    result += "{\"id\":\"" + curid + "\",\"text\":\"" + model.PName + "\"";
                    result += "," + "\"children\":[";
                    rowcount = 0;
                }
                if (rowcount > 0)
                    result += ",";
                result += "{\"id\":\"" + curid + "_" + model.DID + "\",\"text\":\"" + model.DeviceName + "\"}";//添加具体的设备
                perid = curid;
                    rowcount++;
                }
                else
                {
                    continue;
                }
            }
            result += "]}";
            return "[" + result + "]";
        }
        public static string GetPdrDevComboTree(IList<V_DeviceInfoState_PDR1> list)
        {
            string result = "";
            int perid = 0, curid = 0, rowcount = 0;//上一次ID，当前ID,记录数
            foreach (V_DeviceInfoState_PDR1 model in list)
            {
                curid = (int)model.PID;
                if (perid != curid)//如果数据类型不相同
                {
                    if (perid > 0)
                        result += "]},";
                    result += "{\"id\":\"" + curid + "\",\"text\":\"" + model.PName + "\"";
                    result += "," + "\"children\":[";
                    rowcount = 0;
                }
                if (rowcount > 0)
                    result += ",";
                result += "{\"id\":\"" + curid + "_" + model.DID + "\",\"text\":\"" + model.DeviceName + "\"}";//添加具体的设备
                perid = curid;
                rowcount++;
            }
            result += "]}";
            return "[" + result + "]";
        }
        //实例化配电房和变压器数据类型参数
        public static string GetPdrTraComboTree(IList<V_DeviceDetail> list)
        {
            string result = "";
            int perid = 0, curid = 0, rowcount = 0;//上一次ID，当前ID,记录数
            foreach (V_DeviceDetail model in list)
            {
                curid = (int)model.PID;
                if (perid != curid)//如果数据类型不相同
                {
                    if (perid > 0)
                        result += "]},";
                    result += "{\"id\":\"" + curid + "\",\"text\":\"" + model.PName + "\"";
                    result += "," + "\"children\":[";
                    rowcount = 0;
                }
                if (rowcount > 0)
                    result += ",";
                result += "{\"id\":\"" + curid + "_" + model.B + "_" + model.DID + "\",\"text\":\"" + model.DeviceName + "\"}";//添加具体的设备
                perid = curid;
                rowcount++;
            }
            result += "]}";
            return "[" + result + "]";
        }
        //实例化配电房和设备数据类型参数
        public static string GetDevZoneComboTree(IList<t_cm_pointmapdts> list)
        {
            string result = "", result2 = "", result3 = "";
            int perid = 0, curid = 0, rowcount = 0;//上一次ID，当前ID,记录数
            int per2id = 0, cur2id = 0, row2count = 0;//上一次ID，当前ID,记录数
            int per3id = 0, cur3id = 0, row3count = 0;//上一次ID，当前ID,记录数
            foreach (t_cm_pointmapdts model in list)
            {
                curid = (int)model.devicesinfoid;
                if (perid != curid)//如果数据类型不相同
                {
                    perid = curid;
                    result2 = "";
                    List<t_cm_pointmapdts> neolist = list.Where(d => d.devicesinfoid == curid).ToList();
                    foreach (t_cm_pointmapdts neo in neolist)
                    {
                        cur2id = (int)neo.channelsinfoid;
                        if (per2id != cur2id)
                        {
                            per2id = cur2id;
                            result3 = "";
                            List<t_cm_pointmapdts> nelist = neolist.Where(d => d.channelsinfoid == cur2id).ToList();
                            foreach (t_cm_pointmapdts ne in nelist)
                            {
                                cur3id = (int)ne.zoneno;
                                if (per3id != cur3id)
                                {
                                    per3id = cur3id;
                                    result3 += "{\"id\":\"" + curid + "_" + cur2id + "_" + cur3id + "\",\"text\":\"" + ne.zonename + "\",\"pid\":\"" + ne.pid + "\",\"tagid\":\"" + ne.tagid + "\",\"tagname\":\"" + ne.tagname + "\",\"did\":\"" + ne.did + "\",\"devicesinfoid\":\"" + ne.devicesinfoid + "\",\"dname\":\"" + ne.dname + "\",\"channelsinfoid\":\"" + ne.channelsinfoid + "\",\"cname\":\"" + ne.cname + "\",\"zoneno\":\"" + ne.zoneno + "\",\"zonename\":\"" + ne.zonename + "\",\"parentid\":\"" + ne.parentid + "\"},";
                                }
                            }
                            result2 += "{\"id\":\"" + curid + "_" + cur2id + "\",\"text\":\"" + neo.cname + "\",\"children\":[ " + result3.TrimEnd(',') + "]},";
                        }
                    }
                    result += "{\"id\":\"" + curid + "\",\"text\":\"" + model.dname + "\",\"children\":[ " + result2.TrimEnd(',') + "]},";
                }
            }
            return "[" + result.TrimEnd(',') + "]";
        }
        //配电房回路测点树
        public static string GetDCTTree(IList<t_DM_CircuitInfo> list, IList<t_DM_ElectricMeterInfo> clist)
        {
             string  result = "",result2 = "";;
             foreach (t_DM_CircuitInfo module in list)
            {
                List<t_DM_ElectricMeterInfo> dclist = clist.Where(k => k.CID == module.CID).ToList();
                result2 = "";
                foreach (t_DM_ElectricMeterInfo cmodule in dclist)
                {
                    result2 += "{\"id\":\"" + module.CID + "_" + cmodule.EID + "\",\"text\":\"" + cmodule.EName + "\",\"did\":\"" + module.DID + "\",\"Etype\":\"" + cmodule.Etype + "\",\"IO\":\"" + cmodule.IO + "\",\"tagids\":\"" + cmodule.TagIDs + "\"},";
                 }
                result += "{\"id\":\"" + module.CID + "\",\"did\":\"" + module.DID + "\",\"text\":\"" + module.CName + "\",\"children\":[ " + result2.TrimEnd(',') + "]},";
            }
            return "[" + result.TrimEnd(',') + "]";
        }
        //实例化配电房和设备数据类型参数
        public static string GetPositionComboTree(IList<t_CM_PointsInfo> list)
        {
            string result = "";
            int perid = 0, curid = 0, rowcount = 0;//上一次ID，当前ID,记录数
            foreach (t_CM_PointsInfo model in list)
            {
                curid = (int)model.DataTypeID;
                if (perid != curid)//如果数据类型不相同
                {
                    if (perid > 0)
                        result += "]},";
                    string PositionStr = "";
                    if (curid == 1)
                        PositionStr = "温度";
                    else if (curid == 2)
                        PositionStr = "电流";
                    else if (curid == 3)
                        PositionStr = "电压";
                    else if (curid == 6)
                        PositionStr = "功率因数";
                    else
                        PositionStr = model.Position;
                    result += "{\"id\":\"" + curid + "_" + curid + "\",\"text\":\"" + PositionStr + "\"";
                    result += "," + "\"children\":[";
                    rowcount = 0;
                }
                if (rowcount > 0)
                    result += ",";
                result += "{\"id\":\"" + model.TagID + "\",\"text\":\"" + model.Remarks + "\"}";//添加具体的测点
                perid = curid;
                rowcount++;
            }
            result += "]}";
            return "[" + result + "]";
        }
    }
}