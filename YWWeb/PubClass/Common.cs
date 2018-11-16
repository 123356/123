using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Reflection;
using System.Data;
using System.Collections;

namespace S5001Web.PubClass
{
    public class Common
    {
        public static string ToJson<T>(IList<T> IL)
        {
            string jsonName = "hymannew";
            StringBuilder Json = new StringBuilder();
            Json.Append("{\"" + jsonName + "\":[");
            if (IL.Count > 0)
            {
                for (int i = 0; i < IL.Count; i++)
                {
                    T obj = Activator.CreateInstance<T>();
                    Type type = obj.GetType();
                    PropertyInfo[] pis = type.GetProperties();
                    Json.Append("{");
                    for (int j = 0; j < pis.Length; j++)
                    {
                        Json.Append("\"" + pis[j].Name.ToString() + "\":\"" + pis[j].GetValue(IL[i], null) + "\"");
                        if (j < pis.Length - 1)
                        {
                            Json.Append(",");
                        }
                    }
                    Json.Append("}");
                    if (i < IL.Count - 1)
                    {
                        Json.Append(",");
                    }
                }
            }
            Json.Append("]}");
            return Json.ToString();
        }

        public static string ComboboxToJson<T>(IList<T> IL)
        {
            StringBuilder Json = new StringBuilder();
            Json.Append("[");
            if (IL.Count > 0)
            {
                for (int i = 0; i < IL.Count; i++)
                {
                    T obj = Activator.CreateInstance<T>();
                    Type type = obj.GetType();
                    PropertyInfo[] pis = type.GetProperties();
                    Json.Append("{");
                    for (int j = 0; j < pis.Length; j++)
                    {
                        object val = pis[j].GetValue(IL[i], null);
                        string strval = "";
                        if (val != null)
                            strval = val.ToString().Replace(@"\", "\\\\");

                        Json.Append("\"" + pis[j].Name.ToString() + "\":\"" + strval.Trim() + "\"");
                        if (j < pis.Length - 1)
                        {
                            Json.Append(",");
                        }
                    }
                    Json.Append("}");
                    if (i < IL.Count - 1)
                    {
                        Json.Append(",");
                    }
                }
            }
            Json.Append("]");
            return Json.ToString();
        }

        public static string ComboboxToJsonAll<T>(IList<T> IL)
        {
            StringBuilder Json = new StringBuilder();
            Json.Append("[");
            if (IL.Count > 0)
            {
                Json.Append("{\"id\":\"0\",\"name\":\"全部\"},");
                for (int i = 0; i < IL.Count; i++)
                {
                    T obj = Activator.CreateInstance<T>();
                    Type type = obj.GetType();
                    PropertyInfo[] pis = type.GetProperties();
                    Json.Append("{");
                    for (int j = 0; j < pis.Length; j++)
                    {
                        Json.Append("\"" + pis[j].Name.ToString() + "\":\"" + pis[j].GetValue(IL[i], null) + "\"");
                        if (j < pis.Length - 1)
                        {
                            Json.Append(",");
                        }
                    }
                    Json.Append("}");
                    if (i < IL.Count - 1)
                    {
                        Json.Append(",");
                    }
                }
            }
            Json.Append("]");
            return Json.ToString();
        }
        /// <summary>
        /// 将List转为JSON数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list">List对象</param>
        /// <returns></returns>
        public static string List2Json<T>(IList<T> list)
        {
            StringBuilder json = new StringBuilder();
            //{"total":5,"rows":[  
            int total = list.Count;
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
        /// <summary>
        /// 将List转为JSON数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list">List对象</param>
        /// <returns></returns>
        public static string List2Json<T>(IList<T> list, int rows, int page)
        {
            int startrows = rows * (page - 1);
            StringBuilder json = new StringBuilder();
            //{"total":5,"rows":[  
            int total = list.Count;
            json.Append("{\"total\":");
            json.Append(total);
            json.Append(",\"rows\":[");
            list = list.Skip(startrows).Take(rows).ToList();
            for (int i = 0; i < list.Count; i++)
            {
                T obj = Activator.CreateInstance<T>();
                Type type = obj.GetType();
                PropertyInfo[] pis = type.GetProperties();
                json.Append("{");
                for (int j = 0; j < pis.Length; j++)
                {
                    object val = pis[j].GetValue(list[i], null);
                    string strval = "";
                    if (val != null)
                        strval = val.ToString().Replace(@"\", "\\\\");
                    json.Append("\"" + pis[j].Name.ToString() + "\":\"" + strval.Trim() + "\"");
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

        /// <summary>
        /// 将List转为JSON数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list">List对象</param>
        /// <param name="footerName">需要计算列的名称 多个的话，传递数组</param>
        /// <returns></returns>
        public static string List2Json<T>(IList<T> list, int rows, int page, string[] footerName)
        {
            int startrows = rows * (page - 1);
            StringBuilder json = new StringBuilder();
            //{"total":5,"rows":[  
            int total = list.Count;
            json.Append("{\"total\":");
            json.Append(total);
            json.Append(",\"rows\":[");
            list = list.Skip(startrows).Take(rows).ToList();
            for (int i = 0; i < list.Count; i++)
            {
                T obj = Activator.CreateInstance<T>();
                Type type = obj.GetType();
                PropertyInfo[] pis = type.GetProperties();
                json.Append("{");
                for (int j = 0; j < pis.Length; j++)
                {
                    object val = pis[j].GetValue(list[i], null);
                    string strval = "";
                    if (val != null)
                        strval = val.ToString().Replace(@"\", "\\\\");
                    json.Append("\"" + pis[j].Name.ToString() + "\":\"" + strval + "\"");
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
            json.Append("]");
            json.Append(",\"footer\":[");
            json.Append("{");
            List<decimal> val1 = new List<decimal>();
            List<decimal> val2 = new List<decimal>();
            decimal sumQu = 0;
            for (int x = 0; x < footerName.Length; x++)
            {

                decimal sum = 0;
                for (int i = 0; i < list.Count; i++)
                {
                    T obj = Activator.CreateInstance<T>();
                    Type type = obj.GetType();
                    PropertyInfo[] pis = type.GetProperties();
                    for (int j = 0; j < pis.Length; j++)
                    {
                        if (pis[j].Name.ToString() == footerName[x])
                        {
                            object val = pis[j].GetValue(list[i], null);

                            string strval = "";
                            if (val != null)
                                strval = val.ToString().Replace(@"\", "\\\\");

                            if (strval != "")
                            {
                                if (footerName[x] == "quantity")
                                {
                                    val1.Add(Convert.ToDecimal(strval));
                                }
                                if (footerName[x] == "trade_price")
                                {
                                    val2.Add(Convert.ToDecimal(strval));
                                }
                                sum += Convert.ToDecimal(strval);

                            }
                        }
                    }

                }
                if (footerName[x] == "trade_price")
                {
                    int index = 0;
                    decimal SumPrice = 0;
                    foreach (var item in val1)
                    {
                        SumPrice += item * val2[index];
                        index++;
                    }
                    if (sumQu != 0)
                    {
                        json.Append("\"" + footerName[x] + "\":\"平均：" + (Math.Round(SumPrice / sumQu, 1)) + "\"");
                    }
                    else
                    {
                        json.Append("\"" + footerName[x] + "\":\"平均：" + 0.0 + "\"");
                    }
                }
                else
                {
                    sumQu = sum;
                    json.Append("\"" + footerName[x] + "\":\"合计：" + sum + "\"");
                }

                if (x < footerName.Length - 1)
                {
                    json.Append(",");
                }

            }

            json.Append("}");
            json.Append("]}");
            return json.ToString();
        }
        /// <summary>
        /// 将List转为JSON数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list">List对象</param>
        /// <returns></returns>
        public static string List2Json<T>(IList<T> list, int total)
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
                string val;
                object objVal;
                for (int j = 0; j < pis.Length; j++)
                {
                    objVal=pis[j].GetValue(list[i], null);
                    val = (null == objVal) ? string.Empty : objVal.ToString().Trim();
                    json.Append("\"" + pis[j].Name.ToString() + "\":\"" +val + "\"");
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
        /// <summary>
        /// 记录日志
        /// </summary>
        /// <param name="logType">日志类型</param>
        /// <param name="username">操作人</param>
        /// <param name="contents">日志描述</param>
        public static void InsertLog(string logType, string username, string contents)
        {
            pdermsWebEntities bll = new pdermsWebEntities();
            t_CM_Log log = new t_CM_Log();
            log.LogDate = DateTime.Now;
            log.LogType = logType;
            log.UserName = username;
            log.Contents = contents;
            log.IPAddress = "";// GetIPAddress();
            bll.t_CM_Log.AddObject(log);
            bll.SaveChanges();
        }
        #region APP方法
        /// <summary>
        /// 单条数据详情
        /// </summary>
        /// <typeparam name="T">Type</typeparam>
        /// <param name="model">Entity</param>
        /// <returns></returns>
        public static string JsonDataInfo<T>(T model)
        {
            //string jsonName = "singer";
            StringBuilder Json = new StringBuilder();
            //Json.Append("{\"" + jsonName + "\":[");

            T obj = Activator.CreateInstance<T>();
            Type type = obj.GetType();
            PropertyInfo[] pis = type.GetProperties();
            Json.Append("{");
            for (int j = 0; j < pis.Length; j++)
            {
                Type typed = pis[j].PropertyType;
                string typename = typed.Name;
                if (typename.Equals("Int32"))
                    Json.Append("\"" + pis[j].Name.ToString() + "\":" + pis[j].GetValue(model, null));
                else
                    Json.Append("\"" + pis[j].Name.ToString() + "\":\"" + pis[j].GetValue(model, null) + "\"");
                if (j < pis.Length - 1)
                {
                    Json.Append(",");
                }
            }
            Json.Append("}");

            //Json.Append("]}");
            return Json.ToString();
        }
        /// <summary>
        /// 多条数据
        /// </summary>
        /// <typeparam name="T">Type</typeparam>
        /// <param name="IL">List</param>
        /// <returns></returns>
        public static string JsonDataList<T>(IList<T> IL)
        {
            string jsonName = "listmap";
            StringBuilder Json = new StringBuilder();
            Json.Append("{\"" + jsonName + "\":[");
            if (IL.Count > 0)
            {
                for (int i = 0; i < IL.Count; i++)
                {
                    T obj = Activator.CreateInstance<T>();
                    Type type = obj.GetType();
                    PropertyInfo[] pis = type.GetProperties();
                    Json.Append("{");
                    for (int j = 0; j < pis.Length; j++)
                    {
                        Type typed = pis[j].PropertyType;
                        string typename = typed.Name;
                        if (typename.Equals("Int32"))
                            Json.Append("\"" + pis[j].Name.ToString() + "\":" + pis[j].GetValue(IL[i], null));
                        else
                            Json.Append("\"" + pis[j].Name.ToString() + "\":\"" + pis[j].GetValue(IL[i], null) + "\"");
                        if (j < pis.Length - 1)
                        {
                            Json.Append(",");
                        }
                    }
                    Json.Append("}");
                    if (i < IL.Count - 1)
                    {
                        Json.Append(",");
                    }
                }
            }
            Json.Append("]}");
            return Json.ToString();
        }
        #endregion

        /// <summary>
        /// 替换回车符
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string ReplaceEnter(string str)
        {
            if (str != null)
            {
                if (str.Contains("\n"))
                    return str.Replace("\n", "<br>");
                else
                    return str;
            }
            else
                return "";
        }

        #region DataGrid
        //实例化树形
        public static string GetModuleTree(IList<t_CM_Module> list)
        {
            string result = "";
            foreach (t_CM_Module module in list)
            {
                result += Recursion(module) + ",";
            }
            return "[" + result.TrimEnd(',') + "]";
        }
        // 递归树形  
        public static string Recursion(t_CM_Module model)
        {
            pdermsWebEntities bll = new pdermsWebEntities();
            string res_s = "";
            //你想要在视图中得到的值
            string icon = "book_open.png";
            if (!string.IsNullOrEmpty(model.Icon))
                icon = model.Icon;
            res_s += "{\"ModuleID\":\"" + model.ModuleID + "\",\"ModuleName\":\"" + model.ModuleName + "\",\"ParentID\":\"" + model.ParentID + "\",\"Icon\":\"" + icon + "\",\"Location\":\"" + model.Location + "\"";

            IList<t_CM_Module> list = bll.t_CM_Module.Where(c => c.ParentID == model.ModuleID && c.ModuleType != 3).ToList();
            list = list.OrderBy(m => m.SN).ToList();
            if (list != null && list.Count > 0)
            {
                res_s += "," + "\"children\":[";
                for (int i = 0; i < list.Count; i++)
                {
                    if (i > 0)
                        res_s += ",";
                    res_s += Recursion(list[i]);
                }
                res_s += "]";
            };
            res_s += "}";
            return res_s;
        }
        #endregion
        #region DropDownList
        //实例化树形
        public static string GetModuleComboTree(IList<t_CM_Module> list)
        {
            string result = "";
            foreach (t_CM_Module module in list)
            {
                result += ComboRecursion(module) + ",";
            }
            return "[{\"id\":0,\"text\":\"巡检系统模块\",\"children\":[" + result.TrimEnd(',') + "]}]";
        }
        // 递归树形  
        public static string ComboRecursion(t_CM_Module model)
        {
            pdermsWebEntities bll = new pdermsWebEntities();
            string res_s = "";
            //你想要在视图中得到的值  
            res_s += "{\"id\":\"" + model.ModuleID + "\",\"text\":\"" + model.ModuleName + "\"";

            IList<t_CM_Module> list = bll.t_CM_Module.Where(c => c.ParentID == model.ModuleID && c.ModuleType != 3).ToList();
            if (list != null && list.Count > 0)
            {
                res_s += "," + "\"children\":[";
                for (int i = 0; i < list.Count; i++)
                {
                    if (i > 0)
                        res_s += ",";
                    res_s += ComboRecursion(list[i]);
                }
                res_s += "]";
            };
            res_s += "}";
            return res_s;
        }

        //实例化树形
        public static string GetPDRComboTree(IList<t_CM_PDRInfo> list)
        {
            string result = "";
            foreach (t_CM_PDRInfo pdr in list)
            {
                result += ComboPdrList(pdr) + ",";
            }
            return "[{\"id\":0,\"text\":\"全部站室\",\"children\":[" + result.TrimEnd(',') + "]}]";
        }
        // 递归树形  
        public static string ComboPdrList(t_CM_PDRInfo model)
        {
            pdermsWebEntities bll = new pdermsWebEntities();
            string res_s = "";
            //你想要在视图中得到的值  
            res_s += "{\"id\":\"" + model.PID + "\",\"text\":\"" + model.Name + "\"";

            IList<t_CM_PDRInfo> list = bll.t_CM_PDRInfo.Where(c => c.ParentID == model.PID).ToList();
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
        #endregion


        /// <summary>
        /// 转换成DataTable
        /// </summary>
        public static DataTable ToDataTable<T>(IEnumerable<T> collection)
        {
            var props = typeof(T).GetProperties();
            var dt = new DataTable();
            dt.Columns.AddRange(props.Select(p => new DataColumn(p.Name, p.PropertyType)).ToArray());
            if (collection.Count() > 0)
            {
                for (int i = 0; i < collection.Count(); i++)
                {
                    ArrayList tempList = new ArrayList();
                    foreach (PropertyInfo pi in props)
                    {
                        object obj = pi.GetValue(collection.ElementAt(i), null);
                        tempList.Add(obj);
                    }
                    object[] array = tempList.ToArray();
                    dt.LoadDataRow(array, true);
                }
            }
            return dt;
        }
    }
}