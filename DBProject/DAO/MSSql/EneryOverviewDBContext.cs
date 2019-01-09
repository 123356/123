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
    public class EneryOverviewDBContext : DBContextBase, IEneryOverview
    {
        public EneryOverviewDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EneryOverviewDBContext>(null);
            modelBuilder.Entity<t_V_EneryView>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_EneryView> GetEneryPowerOverview(int uid)
        {
            string sql = "select SumUsePower as Value,UserPowerRate as Rate,UUPID as ID,RecordTime, from t_ES_UserUsePowerMonthly where UID=" + uid;
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetEneryWaterOverview(int uid)
        {
            string sql = "select SumUseWater as Value,SumUseWaterRate as Rate,ID,RecordTime from t_ES_UserUseWaterMonthly where UID=" + uid;
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetEneryGasOverview(int uid)
        {
            string sql = "SELECT ID, SumUseGas as Value,SumUseGasRate as Rate,ID,RecordTime FROM t_ES_UserUseGasMonthly where UID=" + uid;
            return SQLQuery<t_V_EneryView>(sql);
        }
        public DbSet<t_V_EneryView> Datas { get; set; }
    }
}
