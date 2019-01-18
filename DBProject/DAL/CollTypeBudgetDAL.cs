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
    public class CollTypeBudgetDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static CollTypeBudgetDAL _DataDal;
        static readonly object _loker = new object();
        public static CollTypeBudgetDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new CollTypeBudgetDAL();
                }
            }
            return _DataDal;
        }
        public IList<t_EE_CollTypeBudget> GetBudgetByID(int uid, int year = 0, int month = 0,int cotypeid=0)
        {
            IList<t_EE_CollTypeBudget> data = new List<t_EE_CollTypeBudget>();
            try
            {
                data = _dbFactory.collecTypeBudget.GetBudgetByID(uid, year, month, cotypeid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;
        }
        public int AddBudGet(t_EE_CollTypeBudget model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.collecTypeBudget.AddBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int UpdateBudGet(t_EE_CollTypeBudget model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.collecTypeBudget.UpdateBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }


        public IList<t_EE_CollTypeBudget> GetColltypeBudgetByMonthID(int monthid)
        {
            IList<t_EE_CollTypeBudget> data = new List<t_EE_CollTypeBudget>();
            try
            {
                data = _dbFactory.collecTypeBudget.GetColltypeBudgetByMonthID(monthid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;
        }
        public t_EE_CollTypeBudget GetColltypeBudgetByID(int id)
        {
            t_EE_CollTypeBudget data = new t_EE_CollTypeBudget();
            try
            {
                data = _dbFactory.collecTypeBudget.GetColltypeBudgetByID(id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;
        }
    }
}
