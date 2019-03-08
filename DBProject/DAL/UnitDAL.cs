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
    public class UnitDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
      
        static UnitDAL _DataDal;
        static readonly object _loker = new object();
        public static UnitDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new UnitDAL();
                }
            }

            return _DataDal;
        }

        
      

        public IList<t_CM_Unit> GetUnitList(string pids)
        {
            IList<t_CM_Unit> data = new List<t_CM_Unit>();
            try
            {
                data = _dbFactory.unit.GetUnitList(pids);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
           
        }
        public IList<t_CM_Unit> GetUnitListByPID(int pid)
        {
            IList<t_CM_Unit> data = new List<t_CM_Unit>();
            try
            {
                data = _dbFactory.unit.GetUnitListByPID(pid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;

        }
    }
}