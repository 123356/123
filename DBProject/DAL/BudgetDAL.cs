using DAO;
using IDAO;
using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class BudgetDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static BudgetDAL _DataDal;
        static readonly object _loker = new object();
        public static BudgetDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new BudgetDAL();
                }
            }

            return _DataDal;
        }
        public IList<t_EE_Budget> GetBudgetByID(int uid)
        {
            IList<t_EE_Budget> data = new List<t_EE_Budget>();
            try
            {
                data = _dbFactory.budget.GetBudgetByID(uid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
    }
}
