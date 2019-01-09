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

        
      
        
        public IList<t_EE_EnerUserType> GetOrganizationList( int itemType)
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.GetOrganizationList(itemType);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }




        public int unpDateproject(int item_type, string Name, string Remarks)
        {
            int data = new int();
            try
            {
                data = _dbFactory.enerUserType.unpDateproject(item_type, Name, Remarks);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        public IList<t_EE_EnerUserType> GetComobxList()
        {
            IList<t_EE_EnerUserType> data = new List<t_EE_EnerUserType>();
            try
            {
                data = _dbFactory.enerUserType.GetComobxList();
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
    }
}