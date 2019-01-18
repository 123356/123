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
        public IList<t_EE_Budget> GetBudgetByID(int uid, int year = 0, int month = 0,int CollTypeID=0)
        {
            IList<t_EE_Budget> data = new List<t_EE_Budget>();
            try
            {
                data = _dbFactory.budget.GetBudgetByID(uid, year, month, CollTypeID);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;
        }
        public int AddBudGet(t_EE_Budget model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.budget.AddBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int UpdateBudGet(t_EE_Budget model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.budget.UpdateBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }


        public IList<t_EE_Budget> GetMonthBudgetByYearID(int yearid)
        {
            IList<t_EE_Budget> data = new List<t_EE_Budget>();
            try
            {
                data = _dbFactory.budget.GetMonthBudgetByYearID(yearid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;
        }

        public t_EE_Budget GetMonthBudgetByID(int id)
        {
            t_EE_Budget  data = new t_EE_Budget();
            try
            {
                data = _dbFactory.budget.GetMonthBudgetByID(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

    }
}
