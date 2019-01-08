using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO;
using DAO;
using IDAO.Models;
using DAL.Models;
using Newtonsoft.Json;
using IDAO.InterfaceCache;

namespace DAL
{
    public class EnerUserTypeDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
      
        static EnerUserTypeDAL _DataDal;
        static readonly object _loker = new object();
        public static EnerUserTypeDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EnerUserTypeDAL();
                }
            }

            return _DataDal;
        }

        public IList<t_EE_EnerUserType> CheckHistory(string Name, int item_type)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.CheckHistory(Name, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        public IList<t_EE_EnerUserType> AddHistory(string Name, int item_type)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.AddHistory(Name, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }



        public IList<t_EE_EnerUserType> GetHistoryList(int item_type)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.GetHistoryList(item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
    }
}