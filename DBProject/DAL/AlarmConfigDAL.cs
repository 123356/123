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
    public class AlarmConfigDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
        static AlarmConfigDAL _DataDal;
        static readonly object _loker = new object();
        public static AlarmConfigDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new AlarmConfigDAL();
                }
            }
            return _DataDal;
        }








        //增
        public IList<t_EE_AlarmConfig> AppendAlarm(t_EE_AlarmConfig alarm)
        {
                {
                IList<t_EE_AlarmConfig> data = new List<t_EE_AlarmConfig>();
                try
                {
                    data = _dbFactory.pueError.AppendAlarm(alarm);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return data;
            }
        }


        //删

        public IList<t_EE_AlarmConfig> DeleteAlarm (t_EE_AlarmConfig alarm)
            {
            IList<t_EE_AlarmConfig> data = new List<t_EE_AlarmConfig>();
            try
            {
                data = _dbFactory.pueError.DeleteAlarm(alarm);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        //改
        public IList<t_EE_AlarmConfig> UpdataeAlarm(t_EE_AlarmConfig alarm)
        {
            IList<t_EE_AlarmConfig> data = new List<t_EE_AlarmConfig>();
            try
            {
                data = _dbFactory.pueError.UpdataeAlarm(alarm);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        //查
        public IList<t_EE_AlarmConfig> GetPueAlarm(int pid)
        {
            IList<t_EE_AlarmConfig> data = new List<t_EE_AlarmConfig>();
            try
            {
                data = _dbFactory.pueError.GetPueAlarm(pid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        //查类型
        public IList<t_EE_AlarmType> GetAlarmType()
        {
            IList<t_EE_AlarmType> data = new List<t_EE_AlarmType>();
            try
            {
                data = _dbFactory.pueError.GetAlarmType();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }




        public IList<t_EE_AlarmConfig> GetPueAlarmAfter(t_EE_AlarmConfig alarm)
        {
            IList<t_EE_AlarmConfig> data = new List<t_EE_AlarmConfig>();
            try
            {
                data = _dbFactory.pueError.GetPueAlarmAfter(alarm);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }


      

    }
}