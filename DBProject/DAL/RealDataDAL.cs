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
    public class RealDataDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
        static readonly string FirstKeyFormat = "real_data_{0}";
        static readonly object _loker = new object();
        static RealDataDAL _DataDal;
        public static RealDataDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                    {
                        _DataDal = new RealDataDAL();
                        
                    }
                }
            }
            return _DataDal;
        }






        public IList<t_SM_HisData> GetDatas(int pid)
        {
            IDBCache dbCache = _dbCacheFactory.DefautCache;
            IList<t_SM_HisData> data = new List<t_SM_HisData>();
            try
            {
                string key = string.Format(FirstKeyFormat, pid);
                if (dbCache.KeyExists(key))
                {
                    string json = dbCache.StringGet(key);
                    if (!string.IsNullOrEmpty(json))
                    {
                        data = JsonConvert.DeserializeObject(json) as List<t_SM_HisData>;
                    }
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;
        }
       
    }
}