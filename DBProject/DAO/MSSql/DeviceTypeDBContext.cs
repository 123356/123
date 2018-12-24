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

        public IList<t_CM_DeviceTypeComBox> GetRealTimeComboxData(int pid, int DID = -1)
        {
            string query = "select  DTID,Name  from t_CM_DeviceType where DTID in (select distinct DTID from t_DM_DeviceInfo WHERE 1=1" ;
            if (pid>0)
            {
                query += " and PID=" + pid;
            }
           
            if (DID > 0)
            {
                query += " and DID=" + DID;
            }
            query += " )";

            return SQLQuery<t_CM_DeviceTypeComBox>(query);

        }

        public DbSet<t_CM_DeviceTypeComBox> ComboxDatas { get; set; }
    }
}
