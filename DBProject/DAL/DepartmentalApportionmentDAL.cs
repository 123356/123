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
    public class DepartmentalApportionmentDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static DepartmentalApportionmentDAL _DataDal;
        static readonly object _loker = new object();
        public static DepartmentalApportionmentDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new DepartmentalApportionmentDAL();
                }
            }

            return _DataDal;
        }
        public int AddBudGet(t_EE_DepartmentalApportionment model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.depar.AddBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int UpdateBudGet(t_EE_DepartmentalApportionment model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.depar.UpdateBudGet(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }

        public IList<t_EE_DepartmentalApportionment> GetenBudgetByYearID(int coid)
        {
            IList<t_EE_DepartmentalApportionment> data = new List<t_EE_DepartmentalApportionment>();
            try
            {
                data = _dbFactory.depar.GetenBudgetByYearID(coid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
        public t_EE_DepartmentalApportionment GetenBudgetByID(int id)
        {
            t_EE_DepartmentalApportionment data = new t_EE_DepartmentalApportionment();
            try
            {
                data = _dbFactory.depar.GetenBudgetByID(id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }

        public t_EE_DepartmentalApportionment GetenBudgetByeneyidAndCoID(int cotyid, int eneryid)
        {
            t_EE_DepartmentalApportionment data = new t_EE_DepartmentalApportionment();
            try
            {
                data = _dbFactory.depar.GetenBudgetByeneyidAndCoID(cotyid, eneryid);
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
                data = _dbFactory.depar.DeleEnBudgetByeneyidAndCoID(cotyid, eneryid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
    }
}
