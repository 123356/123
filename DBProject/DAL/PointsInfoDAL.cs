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
    public class PointsInfoDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
        static PointsInfoDAL _DataDal;
        static readonly object _loker = new object();
        public static PointsInfoDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new PointsInfoDAL();
                }
            }

            return _DataDal;
        }
        
        public IList<t_CM_PointsInfoBase1> GetTageID(int pid, int cid)
        {
            IList<t_CM_PointsInfoBase1> data = new List<t_CM_PointsInfoBase1>();
            try
            {
                data = _dbFactory.PointsInfo.GetTageID(pid,cid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
           
        }
    }
}