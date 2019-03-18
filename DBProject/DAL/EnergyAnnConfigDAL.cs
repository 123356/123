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
    public class EnergyAnnConfigDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static EnergyAnnConfigDAL _DataDal;
        static readonly object _loker = new object();
        public static EnergyAnnConfigDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EnergyAnnConfigDAL();
                }
            }
            return _DataDal;
        }
        public int AddConfig(t_EE_EnergyAnnConfig model)
        {
            try
            {
                return _dbFactory.energyAnnConfig.Add(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int UpdateConfig(t_EE_EnergyAnnConfig model)
        {
            try
            {
                return _dbFactory.energyAnnConfig.Update(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int DeleteConfig(int id)
        {
            try
            {
                return _dbFactory.energyAnnConfig.Delete(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public t_EE_EnergyAnnConfig GetenConig(int uid,int userid)
        {
            try
            {
                return _dbFactory.energyAnnConfig.GetConfigList(uid, userid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public t_EE_EnergyAnnConfig GetConfigByID(int id)
        {
            try
            {
                return _dbFactory.energyAnnConfig.GetConfigByID(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
