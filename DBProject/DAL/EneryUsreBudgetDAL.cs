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
    public class EneryUsreBudgetDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static EneryUsreBudgetDAL _DataDal;
        static readonly object _loker = new object();
        public static EneryUsreBudgetDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EneryUsreBudgetDAL();
                }
            }

            return _DataDal;
        }
        public IList<t_EE_EneryUsreBudget> GetBudgetByID(int uid, int year = 0, int month = 0,int id=0)
        {
            IList<t_EE_EneryUsreBudget> data = new List<t_EE_EneryUsreBudget>();
            try
            {
                data = _dbFactory.eneryUserBudget.GetBudgetByID(uid, year, month,id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
        public int AddBudGet(t_EE_EneryUsreBudget model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.eneryUserBudget.AddBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int UpdateBudGet(t_EE_EneryUsreBudget model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.eneryUserBudget.UpdateBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }

        public IList<t_EE_EneryUsreBudget> GetenBudgetByYearID(int coid)
        {
            IList<t_EE_EneryUsreBudget> data = new List<t_EE_EneryUsreBudget>();
            try
            {
                data = _dbFactory.eneryUserBudget.GetenBudgetByYearID(coid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
        public t_EE_EneryUsreBudget GetenBudgetByID(int id)
        {
            t_EE_EneryUsreBudget data = new t_EE_EneryUsreBudget();
            try
            {
                data = _dbFactory.eneryUserBudget.GetenBudgetByID(id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }

        public t_EE_EneryUsreBudget GetenBudgetByeneyidAndCoID(int cotyid,int eneryid)
        {
            t_EE_EneryUsreBudget data = new t_EE_EneryUsreBudget();
            try
            {
                data = _dbFactory.eneryUserBudget.GetenBudgetByeneyidAndCoID(cotyid, eneryid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
        public int DeleEnBudgetByeneyidAndCoID(int cotyid, int eneryid)
        {
            int data = 0;
            try
            {
                data = _dbFactory.eneryUserBudget.DeleEnBudgetByeneyidAndCoID(cotyid, eneryid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }

    }
}
