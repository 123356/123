using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;
using DAO.MSSql;

namespace DAO
{
    public class PowerForeQualityDBContext : DBContextBase, IEPowerForeQuality
    {
        public PowerForeQualityDBContext()
            : base(ConnectBuild.GetConnect(typeof(PowerForeQualityDBContext).Name))
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<PowerForeQualityDBContext>(null);
            modelBuilder.Entity<t_EE_PowerForeQuality>()
              .HasKey(t => new { t.FID});
            base.OnModelCreating(modelBuilder);
        }


        public IList<t_EE_PowerForeQuality> ForeThanQuality()
        {

            DateTime startTime = DateTime.Now;
            startTime = startTime.AddMinutes(-5);
            string star = startTime.ToString("yyyy-MM-dd hh:mm:ss.000");
            startTime = startTime.AddMinutes(10);
            string end = startTime.ToString("yyyy-MM-dd hh:mm:ss.000");

            string sql = $"SELECT TOP 1  b.*,a.UsePower " +
                        $" FROM t_EE_PowerQualityDaily a " +
                        $" INNER JOIN t_EE_PowerForeDaily b " +
                        $" ON a.PID = b.PID  and a.CID = b.CID " +
                    //    $" where a.RecordTime >= '{star}' AND a.RecordTime <= '{end}'" +
                        $" order by RecordTime desc";
            return SQLQuery<t_EE_PowerForeQuality>(sql);
        }


        public DbSet<t_EE_PowerForeQuality> Datas { get; set; }
    }
}
