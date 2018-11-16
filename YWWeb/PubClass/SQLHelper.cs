using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hyman.DataUtility
{
    public class SQLHelper : IDisposable
    {
        #region 接口对象
        /// <summary>
        /// 接口对象
        /// </summary>
        public void Dispose()
        {
            if (SqlCon.State == ConnectionState.Open || SqlCon.State == ConnectionState.Broken)
            {
                SqlCon.Close();
            }
        }
        #endregion

        #region 构造函数
        /// <summary>
        /// 空构造函数
        /// </summary>
        public SQLHelper() { }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="connectionStrName">数据库连接对象名称</param>
        public SQLHelper(string connectionStrName)
        {
            SqlCon = new SqlConnection(ConfigurationManager.ConnectionStrings[connectionStrName].ToString());
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="sqlTran">事务对象</param>
        public SQLHelper(SqlTransaction sqlTran)
        {
            SqlCon = sqlTran.Connection;
            SqlTran = sqlTran;
            SqlTransactionFlag = true;
        }
        #endregion

        #region 属性
        /// <summary>
        /// 初始化数据连接对象
        /// </summary>
        public static readonly string SqlConnectionStr = "Data Source=113.106.105.211;Initial Catalog=pdermsWeb;Persist Security Info=True;User ID=sa;Password=2014_svn;";

        private SqlCommand _sqlCmd;
        /// <summary>
        /// 数据库命令对象
        /// </summary>
        public SqlCommand SqlCmd
        {
            get { return _sqlCmd; }
            set { _sqlCmd = value; }
        }

        private SqlConnection _sqlCon;
        /// <summary>
        /// 数据库连接对象
        /// </summary>
        public SqlConnection SqlCon
        {
            get
            {
                if (_sqlCon == null || _sqlCon.ConnectionString == "")
                {
                    if (!string.IsNullOrEmpty(SqlConnectionStr))
                        _sqlCon = new SqlConnection(SqlConnectionStr);
                    else
                        throw new Exception("数据源初始化失败! 未提供连接字符串!");
                }
                return _sqlCon;
            }
            set
            {
                _sqlCon = value;
            }
        }

        private SqlTransaction _sqlTran;
        /// <summary>
        /// 数据库事务对象
        /// </summary>
        public SqlTransaction SqlTran
        {
            get { return _sqlTran; }
            set { _sqlTran = value; }
        }

        private bool _sqlTransactionFlag = false;
        /// <summary>
        /// 是否使用事务
        /// </summary>
        public bool SqlTransactionFlag
        {
            get { return _sqlTransactionFlag; }
            set { _sqlTransactionFlag = value; }
        }
        #endregion

        #region 存储过程操作数据库
        /// <summary>
        /// 执行查询存储过程，返回DataSet
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="parms">参数集合</param>
        /// <returns>返回DataSet</returns>
        public DataSet ExecuteQuery_DS(string procName, SqlParameter[] parms = null)
        {
            SqlDataAdapter da = new SqlDataAdapter();
            try
            {
                DataSet ds = new DataSet();
                if (SqlCon.State != ConnectionState.Open)
                    SqlCon.Open();
                SqlCmd = SqlTransactionFlag ? new SqlCommand(procName, SqlCon, SqlTran) : new SqlCommand(procName, SqlCon);
                SqlCmd.CommandType = CommandType.StoredProcedure;
                if (parms != null)
                    AddParameters(parms);
                da.SelectCommand = SqlCmd;
                da.Fill(ds);
                return ds;
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                da.Dispose();
                SqlCmd.Dispose();
                if (!SqlTransactionFlag)
                {
                    SqlCon.Close();
                    SqlCon.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行查询存储过程，返回DataTable
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="parms">参数集合</param>
        /// <returns>返回DataTable</returns>
        public DataTable ExecuteQuery_DT(string procName, SqlParameter[] parms = null)
        {
            try
            {
                return ExecuteQuery_DS(procName, parms).Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 执行非查询存储过程，返回受影响的行数
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="parms">参数集合</param>
        /// <returns>返回受影响的行数</returns>
        public int ExectueNonQuery(string procName, SqlParameter[] parms = null)
        {
            try
            {
                if (SqlCon.State != ConnectionState.Open)
                    SqlCon.Open();
                SqlCmd = SqlTransactionFlag ? new SqlCommand(procName, SqlCon, SqlTran) : new SqlCommand(procName, SqlCon);
                SqlCmd.CommandType = CommandType.StoredProcedure;
                if (parms != null)
                    AddParameters(parms);
                return SqlCmd.ExecuteNonQuery();
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                SqlCmd.Dispose();
                if (!SqlTransactionFlag)
                {
                    SqlCon.Close();
                    SqlCon.Dispose();
                }
            }
        }
        #endregion

        #region SQL语句操作数据库
        /// <summary>
        /// 执行SQL语句，返回第一行
        /// </summary>
        /// <param name="sql">SQL语句</param>
        /// <param name="parms">参数集合</param>
        /// <returns>返回 第一行</returns>
        public Object ExecuteScalar(string sql, SqlParameter[] parms = null)
        {
            try
            {
                if (SqlCon.State != ConnectionState.Open)
                    SqlCon.Open();
                SqlCmd = SqlTransactionFlag ? new SqlCommand(sql, SqlCon, SqlTran) : new SqlCommand(sql, SqlCon);
                SqlCmd.CommandType = CommandType.Text;
                if (parms != null)
                    AddParameters(parms);
                return SqlCmd.ExecuteScalar();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                SqlCmd.Dispose();
                if (!SqlTransactionFlag)
                {
                    SqlCon.Close();
                    SqlCon.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行查询SQL语句，返回DataSet
        /// </summary>
        /// <param name="sql">SQL语句</param>
        /// <param name="parms">参数集合</param>
        /// <returns>返回 DataSet</returns>
        public DataSet ExecuteQueryBySql_DS(string sql, SqlParameter[] parms = null)
        {
            SqlDataAdapter da = new SqlDataAdapter();
            try
            {
                DataSet ds = new DataSet();
                if (SqlCon.State != ConnectionState.Open)
                    SqlCon.Open();
                SqlCmd = new SqlCommand(sql, SqlCon);
                AddParameters(parms);
                SqlCmd.CommandType = CommandType.Text;
                da.SelectCommand = SqlCmd;
                da.Fill(ds);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                da.Dispose();
                SqlCmd.Dispose();
                SqlCon.Close();
                SqlCon.Dispose();
            }
        }

        /// <summary>
        /// 执行查询SQL语句，返回DataTable
        /// </summary>
        /// <param name="sql">SQL语句</param>
        /// <param name="parms">参数集合</param>
        /// <returns>返回 DataTable</returns>
        public DataTable ExecuteQueryBySql_DT(string sql, SqlParameter[] parms = null)
        {
            try
            {
                return ExecuteQueryBySql_DS(sql, parms).Tables[0];
            }
            catch (Exception ex)
            {
               throw ex;
            }
        }

        /// <summary>
        /// 执行SQL语句操作(Update,Delete,Insert)，返回受影响的行数
        /// </summary>
        /// <param name="sql">SQL语句</param>
        /// <param name="parms">参数集合</param>
        /// <returns>受影响的行数</returns>
        public int ExectueNonQueryBySql(string sql, SqlParameter[] parms = null)
        {
            try
            {
                if (SqlCon.State != ConnectionState.Open)
                    SqlCon.Open();
                SqlCmd = SqlTransactionFlag ? new SqlCommand(sql, SqlCon, SqlTran) : new SqlCommand(sql, SqlCon);
                SqlCmd.CommandType = CommandType.Text;
                if (parms != null)
                    AddParameters(parms);
                return SqlCmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                SqlCmd.Dispose();
                if (!SqlTransactionFlag)
                {
                    SqlCon.Close();
                    SqlCon.Dispose();
                }
            }
        }
        #endregion

        #region 事务操作
        /// <summary>
        /// 开启事务
        /// </summary>
        public void BeginTrans()
        {
            try
            {
                if (SqlCon.State != ConnectionState.Open)
                {
                    SqlCon.Open();
                }
                SqlTran = SqlCon.BeginTransaction();
                SqlTransactionFlag = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 提交事务
        /// </summary>
        public void Commit()
        {
            try
            {
                if (SqlTran != null)
                {
                    SqlTran.Commit();
                    SqlTransactionFlag = false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                SqlCon.Close();
                SqlCon.Dispose();
            }
        }

        /// <summary>
        /// 事务回滚
        /// </summary>
        public void RollBack()
        {
            try
            {
                SqlTran.Rollback();
                SqlTransactionFlag = false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                SqlCon.Close();
                SqlCon.Dispose();
            }
        }
        #endregion

        #region 其他方法
        /// <summary>
        /// 添加参数
        /// </summary>
        /// <param name="parms">有添加的对象</param>
        private void AddParameters(SqlParameter[] parms)
        {
            try
            {
                if (parms != null)
                {
                    for (int i = 0; i < parms.Length; i++)
                    {
                        SqlCmd.Parameters.Add(parms[i]);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}
