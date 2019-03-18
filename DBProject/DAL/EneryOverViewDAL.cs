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
    public class EneryOverViewDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static EneryOverViewDAL _DataDal;
        static readonly object _loker = new object();
        public static EneryOverViewDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EneryOverViewDAL();
                }
            }
            return _DataDal;
        }
        public IList<t_V_EneryView> GetDatas(string cids,string pids,string time)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetDatas(cids,pids, time);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryView> GetYearDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetYearDatasByTime(cids, pids, type,startTime,endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryView> GetMonthDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetMonthDatasByTime(cids, pids, type, startTime, endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryView> GetDayDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetDayDatasByTime(cids, pids, type, startTime, endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryView> GetDayDatasByTime(Dictionary<int,string> cpids, int type, string startTime, string endTime)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetDayDatasByTime(cpids, type, startTime, endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryView> GetMonthDatasByTime(Dictionary<int, string> cpids, int type, string startTime, string endTime)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetMonthDatasByTime(cpids,type, startTime, endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryView> GetYearDatasByTime(Dictionary<int, string> cpids, int type, string startTime, string endTime)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetYearDatasByTime(cpids, type, startTime, endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }


        public IList<t_V_EneryView> GetLookDatas(Dictionary<int,string> cpids, string time)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetLookDatas(cpids, time);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        public IList<t_V_EneryView> GetMonthDatas(Dictionary<int, string> cpids, string time)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetMonthDatas(cpids, time);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryView> GetYearBudgetDatas(string cids, string pids, string time)
        {
            IList<t_V_EneryView> data = new List<t_V_EneryView>();
            try
            {
                data = _dbFactory.eneryOverView.GetYearBudgetDatas(cids, pids, time);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
    }
}
