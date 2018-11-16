using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;

namespace DAO
{
    public class VRealTimeDataDBContext:DBContextBase,IVRealTimeData
    {
        public VRealTimeDataDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<HisDataDBContext>(null);
            modelBuilder.Entity<t_V_RealTimeData>()
              .HasKey(t => new { t.TagID });
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<t_V_RealTimeData> Datas { get; set; }
    }
}
