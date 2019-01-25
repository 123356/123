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
    public class VDeviceInfoState_PDR1DBContext : DBContextBase, IVDeviceInfoState_PDR1
    {
        public VDeviceInfoState_PDR1DBContext()
            : base(ConnectBuild.GetConnect(typeof(VDeviceInfoState_PDR1DBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<VDeviceInfoState_PDR1DBContext>(null);
            modelBuilder.Entity<t_V_DeviceInfoState_PDR1>()
              .HasKey(t => new { t.CID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_DeviceInfoState_PDR1> GetCidTree(string unitID)
        {
            string sql = "SELECT a.PID,a.Name,b.DID,b.DeviceName,CID,CName from t_CM_PDRInfo a right JOIN t_DM_DeviceInfo b on a.PID=b.PID right join t_DM_CircuitInfo c on a.PID = c.PID and b.DID = c.DID where a.pid in("+ unitID + ") order by PID,DID,CID" ;
            return SQLQuery<t_V_DeviceInfoState_PDR1>(sql);
        }

        public DbSet<t_V_DeviceInfoState_PDR1> Datas { get; set; }
    }
}
