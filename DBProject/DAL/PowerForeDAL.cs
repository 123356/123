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
    public class PowerForeDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
        static PowerForeDAL _DataDal;
        static readonly object _loker = new object();
        public static PowerForeDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new PowerForeDAL();
                }
            }
            return _DataDal;
        }
        public IList<t_V_PowerForeView> GetForeList(string pid, string cid,string startTime,string endTime,int type)
        {
            IList<t_V_PowerForeView> data = new List<t_V_PowerForeView>();
            try
            {
                data = _dbFactory.powerFore.GetForeList(pid, cid, startTime, endTime, type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;

        }
    }
}
