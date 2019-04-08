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







        public IList<t_V_DeviceInfoState_PDR1> GetCidTree(int UnitID, string UnitName, string PDRList)
        {
            string sql = $"SELECT c.PID,c.DID,c.CID,a.Name PName,b.DeviceName DName,c.CName CNAme FROM t_CM_PDRInfo a  " +
                        $"RIGHT JOIN t_DM_DeviceInfo b " +
                        $"ON a.PID=b.PID " +
                        $"RIGHT JOIN t_DM_CircuitInfo c " +
                        $"ON c.PID = a.PID AND  c.DID = b.DID " +
                        $"WHERE a.pid in({PDRList}) " +
                        $"ORDER BY  c.PID,c.DID,c.CID";
            return SQLQuery<t_V_DeviceInfoState_PDR1>(sql);
        }

        public DbSet<t_V_DeviceInfoState_PDR1> Datas { get; set; }
    }
}
