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
    public class YearBudgetDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static YearBudgetDAL _DataDal;
        static readonly object _loker = new object();
        public static YearBudgetDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new YearBudgetDAL();
                }
            }

            return _DataDal;
        }
        public IList<t_EE_YearBudget> GetYearBudgetByID(int uid, int year)
        {
            IList<t_EE_YearBudget> data = new List<t_EE_YearBudget>();
            try
            {
                data = _dbFactory.yearBudget.GetYearBudgetByID(uid, year);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }

        public int AddYearBudGet(t_EE_YearBudget model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.yearBudget.AddYearBudGet(model);
            }catch(Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int UpdateYearBudGet(t_EE_YearBudget model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.yearBudget.UpdateYearBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
    }
}
