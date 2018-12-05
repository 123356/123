using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Text;

namespace YWWeb.PubClass
{
    public static class JsonHelper
    {
        public static object ToJson(this string Json)
        {
            return JsonConvert.DeserializeObject(Json);
        }
        public static string ToJson(this object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
        public static DataTable JsonToDataTable(this string strJson)
        {
            #region
            DataTable tb = null;
            //获取数据  
            Regex rg = new Regex(@"(?<={)[^}]+(?=})");
            MatchCollection mc = rg.Matches(strJson);
            for (int i = 0; i < mc.Count; i++)
            {
                string strRow = mc[i].Value;
                string[] strRows = strRow.Split(',');
                //创建表  
                if (tb == null)
                {
                    tb = new DataTable();
                    tb.TableName = "Table";
                    foreach (string str in strRows)
                    {
                        DataColumn dc = new DataColumn();
                        string[] strCell = str.Split(':');
                        dc.DataType = typeof(String);
                        dc.ColumnName = strCell[0].ToString().Replace("\"", "").Trim();
                        tb.Columns.Add(dc);
                    }
                    tb.AcceptChanges();
                }
                //增加内容  
                DataRow dr = tb.NewRow();
                for (int r = 0; r < strRows.Length; r++)
                {
                    object strText = strRows[r].Split(':')[1].Trim().Replace("，", ",").Replace("：", ":").Replace("/", "").Replace("\"", "").Trim();
                    if (strText.ToString().Length >= 5)
                    {
                        if (strText.ToString().Substring(0, 5) == "Date(")//判断是否JSON日期格式
                        {
                            strText = CommonHelper.JsonToDateTime(strText.ToString()).ToString("yyyy-MM-dd HH:mm:ss");
                        }
                    }
                    dr[r] = strText;
                }
                tb.Rows.Add(dr);
                tb.AcceptChanges();
            }
            return tb;
            #endregion
        }
        public static List<T> JonsToList<T>(this string Json)
        {
            return JsonConvert.DeserializeObject<List<T>>(Json);
        }
        public static T JsonToEntity<T>(this string Json)
        {
            return JsonConvert.DeserializeObject<T>(Json);
        }

        //替换特殊字符
        public static string ToJsonString(string str)
        {

            StringBuilder sb = new StringBuilder();
            if (str != null && str.Length > 0)
            {
                for (int i = 0; i < str.Length; i++)
                {

                    char c = str.ToCharArray()[i];

                    switch (c)
                    {

                        case '\"': sb.Append("\\\""); break;

                        case '\\': sb.Append("\\\\"); break;

                        case '/': sb.Append("\\/"); break;

                        case '\b': sb.Append("\\b"); break;

                        case '\f': sb.Append("\\f"); break;

                        case '\n': sb.Append("\\n"); break;

                        case '\r': sb.Append("\\r"); break;

                        case '\t': sb.Append("\\t"); break;

                        default: sb.Append(c); break;

                    }

                }
            }
            return sb.ToString();

        }

    }
}