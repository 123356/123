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
    public class LookEneryViewDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static LookEneryViewDAL _DataDal;
        static readonly object _loker = new object();
        public static LookEneryViewDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new LookEneryViewDAL();
                }
            }
            return _DataDal;
        }

        public IList<t_V_LookEneryView> GetCIDByUID(int uid)
        {
            try
            {
                return _dbFactory.LookEnery.GetCIDByUID(uid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public IList<t_V_LookEneryView> GetCIDByID(string id,int uid)
        {
            try
            {
                return _dbFactory.LookEnery.GetCIDByID(id, uid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
