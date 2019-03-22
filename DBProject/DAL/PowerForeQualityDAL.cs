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
    public class PowerForeQualityDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static PowerForeQualityDAL _DataDal;
        static readonly object _loker = new object();
        public static PowerForeQualityDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new PowerForeQualityDAL();
                }
            }
            return _DataDal;
        }
  
        public IList<t_EE_PowerForeQuality> ForeThanQuality()
        {
            IList<t_EE_PowerForeQuality> data = new List<t_EE_PowerForeQuality>();
            try
            {
                data = _dbFactory.powerForeQuality.ForeThanQuality();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

    
    }
}