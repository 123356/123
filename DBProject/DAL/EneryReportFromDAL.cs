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
    public class EneryReportFromDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static EneryReportFromDAL _DataDal;
        static readonly object _loker = new object();
        public static EneryReportFromDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EneryReportFromDAL();
                }
            }
            return _DataDal;
        }
        public IList<t_V_EneryReportFrom> GetDayFormDatas(Dictionary<int, string> cpids, string startTime, string endTime)
        {
            IList<t_V_EneryReportFrom> data = new List<t_V_EneryReportFrom>();
            try
            {
                data = _dbFactory.eneryReportFrom.GetDayFormDatas(cpids, startTime, endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryReportFrom> GetMonthFormDatas(Dictionary<int, string> cpids, string startTime, string endTime)
        {
            IList<t_V_EneryReportFrom> data = new List<t_V_EneryReportFrom>();
            try
            {
                data = _dbFactory.eneryReportFrom.GetMonthFormDatas(cpids, startTime, endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EneryReportFrom> GetDatGetYearFormDatasas(Dictionary<int, string> cpids, string startTime, string endTime)
        {
            IList<t_V_EneryReportFrom> data = new List<t_V_EneryReportFrom>();
            try
            {
                data = _dbFactory.eneryReportFrom.GetYearFormDatas(cpids, startTime,endTime);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
    }
}
