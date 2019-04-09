using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IWeather:IDAOBase,IDisposable
    {
        IList<t_V_WeatherView> GetWeatherList(string CityName, string startTime, string endTime, int type);
    }
}
