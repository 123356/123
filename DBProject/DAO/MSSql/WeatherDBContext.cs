using DAO.MSSql;
using IDAO;
using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO
{
    public class WeatherDBContext : DBContextBase, IWeather
    {
        public WeatherDBContext()
           : base(ConnectBuild.GetConnect(typeof(WeatherDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<WeatherDBContext>(null);
            modelBuilder.Entity<t_V_WeatherView>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_WeatherView> GetWeatherList(string CityName, string startTime, string endTime, int type)
        {
            string tableName = "t_EE_WeatherDaily";
            switch (type)
            {
                case 1:
                    tableName = "t_EE_WeatherDaily";
                    break;
                case 2:
                    tableName = "t_EE_WeatherMonthly";
                    break;
                case 3:
                    tableName = "t_EE_WeatherYearly";
                    break;
            }
            string sql = "select * from " + tableName + $" where RecordTime>='{startTime}' and RecordTime<='{endTime}'";
            if (!string.IsNullOrEmpty(CityName))
            {
                sql += " and CityName='" + CityName + "'";
            }
            return SQLQuery<t_V_WeatherView>(sql);
        }
    }
}
