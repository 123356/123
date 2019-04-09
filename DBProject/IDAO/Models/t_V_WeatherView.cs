using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    [Serializable]
    public class t_V_WeatherView
    {
        public int ID { get; set; }
        public DateTime RecordTime { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public string MaxTemperatureValue { get; set; }
        public string MinTemperatureValue { get; set; }
        public string ThisTemperatureValue { get; set; }
        public string MaxHumidityValue { get; set; }
        public string MinHumidityValue { get; set; }
        public string ThisHumidityValue { get; set; }
    }
}
