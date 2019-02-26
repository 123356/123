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
    public class EnerySelectViewDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static EnerySelectViewDAL _DataDal;
        static readonly object _loker = new object();
        public static EnerySelectViewDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EnerySelectViewDAL();
                }
            }
            return _DataDal;
        }
        public IList<t_V_EnerySelectView> GetDatas(string time, string cids,string pids, int did = 0, int cotypeid = 0)
        {
            IList<t_V_EnerySelectView> data = new List<t_V_EnerySelectView>();
            try
            {
                data = _dbFactory.enerySelectView.GetDatas(time, cids, pids, did, cotypeid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;
        }
    }
}
