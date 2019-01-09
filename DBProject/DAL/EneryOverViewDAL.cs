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
    public class EneryOverViewDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static EneryOverViewDAL _DataDal;
        static readonly object _loker = new object();
        public static EneryOverViewDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EneryOverViewDAL();
                }
            }

            return _DataDal;
        }




        public IList<t_V_EneryView> GetEneryPowerOverview(int uid)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetEneryPowerOverview(uid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
        public IList<t_V_EneryView> GetEneryWaterOverview(int uid)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetEneryWaterOverview(uid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
        public IList<t_V_EneryView> GetEneryGasOverview(int uid)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetEneryGasOverview(uid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
    }
}
