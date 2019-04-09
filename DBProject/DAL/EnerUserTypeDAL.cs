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

        public IList<t_EE_EnerUserType> GetEnerTypeToID(string Name, int item_type)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.GetEnerTypeToID(Name, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        public IList<t_EE_EnerUserType> GetEnerTypeToName(int ID, int item_type)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.GetEnerTypeToName(ID, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
   

        public IList<t_EE_EnerUserType> AddEnerNameType(string Name, int item_type)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.AddEnerNameType(Name, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        public IList<t_EE_EnerUserType> GetComobxList(int itemType)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.GetComobxList(itemType);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_EE_EnerUserType> GetItemName(string addcid)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.GetItemName(addcid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
    }
}