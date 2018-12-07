using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO;
using DAO;
using IDAO.Models;

namespace DAL
{
    public class RoleRightDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static readonly object _loker = new object();
        static RoleRightDAL _DataDal;
        public static RoleRightDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new RoleRightDAL();
                }
            }

            return _DataDal;
        }


        class rowCount
        {
            public int nTotal { set; get; }
        }

        //实时数据项包含的类型
        public IList<int> GetRoleID(int userid)
        {
            IList<IntegerValue> data = new List<IntegerValue>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            try
            {
                //string query = "select ModuleID from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID="+userid+")";
                //using (IRoleRight _hisDataDao = new RoleRightDBContext())
                //{
                //    data = (_hisDataDao as IDAOBase).SQLQuery<IntegerValue>(query);
                //}
                data = _dbFactory.roleRight.GetRoleID(userid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data.Select(t => t.IValue).ToList<int>();
        }
        public IList<t_CM_RoleRight> GetRoles(int userid)
        {
            IList<t_CM_RoleRight> data = new List<t_CM_RoleRight>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            try
            {
                //string query = "select * from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + userid + ")";
                //using (IRoleRight _hisDataDao = new RoleRightDBContext())
                //{
                //    data = (_hisDataDao as IDAOBase).SQLQuery<t_CM_RoleRight>(query);
                //}
                data = _dbFactory.roleRight.GetRoles(userid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

    }
}