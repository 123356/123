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
    public class WeatherDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static WeatherDAL _DataDal;
        static readonly object _loker = new object();
        public static WeatherDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new WeatherDAL();
                }
            }
            return _DataDal;
        }



        public IList<t_V_WeatherView> GetWeatherList(string CityName, string startTime, string endTime, int type)
        {
            IList<t_V_WeatherView> data = new List<t_V_WeatherView>();
            try
            {
                data = _dbFactory.weather.GetWeatherList(CityName, startTime, endTime, type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
    }
}
