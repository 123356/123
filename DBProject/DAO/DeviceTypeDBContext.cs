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
    public class DeviceTypeDBContext:DBContextBase,IDeviceType
    {
        public DeviceTypeDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<HisDataDBContext>(null);
            modelBuilder.Entity<t_CM_DeviceTypeComBox>()
              .HasKey(t => new { t.DTID });
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<t_CM_DeviceTypeComBox> ComboxDatas { get; set; }
    }
}
