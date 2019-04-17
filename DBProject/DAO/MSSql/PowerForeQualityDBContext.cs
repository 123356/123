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
            string star = startTime.ToString("yyyy-MM-dd HH:00:00");
            startTime = startTime.AddHours(-1);
            string end = startTime.ToString("yyyy-MM-dd HH:00:00");



            string sql = $"SELECT  b.*,a.UsePower " +
                        $" FROM t_EE_PowerQualityDaily a " +
                        $" INNER JOIN t_EE_PowerForeDaily b " +
                        $" ON a.PID = b.PID  and a.CID = b.CID AND a.RecordTime = b.RecordTime" +
                        $" where a.RecordTime <= '{star}' and a.RecordTime >= '{end}' ";
            return SQLQuery<t_EE_PowerForeQuality>(sql);
        }


        public IList<t_EE_PowerForeQuality> ForeThanQuality123(DateTime date)
        {

            string d = date.ToString("yyyy-MM-dd HH:00:00");
            string sql = $"SELECT  b.*,a.UsePower " +
                        $" FROM t_EE_PowerQualityDaily a " +
                        $" INNER JOIN t_EE_PowerForeDaily b " +
                        $" ON a.PID = b.PID  and a.CID = b.CID AND a.RecordTime = b.RecordTime" +
                        $" where a.RecordTime = '{d}' ";
            return SQLQuery<t_EE_PowerForeQuality>(sql);
        }



        public DbSet<t_EE_PowerForeQuality> Datas { get; set; }
    }
}
