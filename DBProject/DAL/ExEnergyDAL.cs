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
    public class ExEnergyDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static ExEnergyDAL _DataDal;
        static readonly object _loker = new object();
        public static ExEnergyDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new ExEnergyDAL();
                }
            }
            return _DataDal;
        }

        public IList<t_EE_ExEnergy> GetExDatas(string pids)
        {
            try
            {
                return _dbFactory.exEnergy.GetExDatas(pids);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public IList<t_EE_ExEnergy> GetExTable(string pids,string id)
        {
            try
            {
                return _dbFactory.exEnergy.GetExTable(pids,id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
