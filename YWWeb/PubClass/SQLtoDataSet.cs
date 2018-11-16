using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;
using System.Configuration;

namespace S5001Web.PubClass
{
    public class SQLtoDataSet
    {
        /// <summary>
        /// 获取数据集
        /// </summary>
        /// <param name="strsql">查询语句</param>
        /// <returns></returns>
        public static DataSet GetReportSummary(string strsql)
        {
            DataSet ds = new DataSet();
            string connString = ConfigurationManager.ConnectionStrings["YWConnectionString"].ToString();
            using (SqlConnection connection = new SqlConnection(connString))
            {
                using (SqlCommand cmd = new SqlCommand(strsql, connection))
                {
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    //adapter.SelectCommand.CommandType = CommandType.StoredProcedure;//执行存储过程
                    //adapter.SelectCommand.Parameters.Add(new MySqlParameter("@ID", RecordID));//查询条件
                    adapter.Fill(ds);
                }
            }
            return ds;
        }

        public static List<DDLValue> GetMySqlList(string strsql)
        {
            DataSet ds = new DataSet();
            List<DDLValue> list = new List<DDLValue>();
            string connString = ConfigurationManager.ConnectionStrings["MySQLconnstr"].ToString();
            using (MySqlConnection connection = new MySqlConnection(connString))
            {
                connection.Open();
                using (MySqlCommand cmd = new MySqlCommand(strsql, connection))
                {
                    MySqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        DDLValue ddl = new DDLValue();
                        ddl.id = Convert.ToInt32(dr["id"]);
                        ddl.text = dr["text"].ToString();
                        list.Add(ddl);
                    }
                }
                connection.Close();
            }
            return list;
        }
        //光纤测温数据库访问
        public static DataSet GetMySqlData(string strsql)
        {
            DataSet ds = new DataSet();
            string connString = ConfigurationManager.ConnectionStrings["MySQLconnstr"].ToString();
            using (MySqlConnection connection = new MySqlConnection(connString))
            {
                using (MySqlCommand cmd = new MySqlCommand(strsql, connection))
                {
                    MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
                    //adapter.SelectCommand.CommandType = CommandType.StoredProcedure;//执行存储过程
                    //adapter.SelectCommand.Parameters.Add(new MySqlParameter("@ID", RecordID));//查询条件
                    adapter.Fill(ds);
                }
            }
            return ds;
        }

        public static List<T> SelectPageList<T>(string tbName, int pageIndex, int pagesize, string orderByField, ref int totalCount, int orderby, string strWhere, string SelectFieldName) where T : class
        {
            pdermsWebEntities bll = new pdermsWebEntities();
            SqlParameter[] spm = new SqlParameter[5];
            spm[0] = new SqlParameter("@tblName", tbName);
            spm[1] = new SqlParameter("@SelectFieldName", SelectFieldName);
            spm[2] = new SqlParameter("@strWhere", strWhere);
            spm[3] = new SqlParameter("@OrderFieldName", orderByField);
            spm[4] = new SqlParameter("@PageSize", pagesize);
            spm[5] = new SqlParameter("@PageIndex", pageIndex);
            spm[6] = new SqlParameter("@iRowCount", totalCount);
            spm[7] = new SqlParameter("@OrderType", orderby);

            spm[7].Direction = ParameterDirection.Output;
            var data = bll.ExecuteStoreQuery<T>("exec AspNetPage @tblName,@SelectFieldName,@strWhere,@OrderByField,@PageSize,@PageIndex,@iRowCount out,@OrderType", spm).ToList();
            totalCount = Convert.ToInt32(spm[4].Value.ToString());
            return data;
        }

        /// <summary>
        /// 获取传感器管理软件数据库中传感器信息数据集
        /// </summary>
        /// <param name="strsql">查询语句</param>
        /// <returns></returns>
        public static DataSet GetSensorListSummary(string strsql)
        {
            DataSet ds = new DataSet();
            string connString = ConfigurationManager.ConnectionStrings["SensorListconnectionstring"].ToString();
            using (SqlConnection connection = new SqlConnection(connString))
            {
                using (SqlCommand cmd = new SqlCommand(strsql, connection))
                {
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    //adapter.SelectCommand.CommandType = CommandType.StoredProcedure;//执行存储过程
                    //adapter.SelectCommand.Parameters.Add(new MySqlParameter("@ID", RecordID));//查询条件
                    adapter.Fill(ds);
                }
            }
            return ds;
        }

    }
}