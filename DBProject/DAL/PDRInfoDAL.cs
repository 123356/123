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
    public class PDRInfoDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static PDRInfoDAL _DataDal;
        static readonly object _loker = new object();
        public static PDRInfoDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new PDRInfoDAL();
                }
            }

            return _DataDal;
        }

        public IList<t_CM_PDRInfo> GetPDRList(string pids)
        {
            try
            {
                return _dbFactory.pdrInfo.GetPDRList(pids);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
