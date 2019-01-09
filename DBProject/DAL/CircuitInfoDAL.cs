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
    public class CircuitInfoDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static CircuitInfoDAL _DataDal;
        static readonly object _loker = new object();
        public static CircuitInfoDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new CircuitInfoDAL();
                }
            }

            return _DataDal;
        }
        public IList<t_DM_CircuitInfo> GetCID(string cids,int type)
        {
            IList<t_DM_CircuitInfo> data = new List<t_DM_CircuitInfo>();
            try
            {
                data = _dbFactory.circuitinfo.GetCID(cids, type);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
    }
}
