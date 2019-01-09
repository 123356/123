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
    public class CollecDevTypeDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static CollecDevTypeDAL _DataDal;
        static readonly object _loker = new object();
        public static CollecDevTypeDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new CollecDevTypeDAL();
                }
            }

            return _DataDal;
        }
        public IList<t_DM_CollectDevType> GetCollectDevTypeList()
        {
            IList<t_DM_CollectDevType> data = new List<t_DM_CollectDevType>();
            try
            {
                data = _dbFactory.collecdevtype.GetCollectDevTypeList();
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
    }
}
