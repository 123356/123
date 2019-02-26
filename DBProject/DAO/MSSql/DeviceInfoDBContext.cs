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
    public class DeviceInfoDBContext:DBContextBase, IDeviceInfo
    {
        public DeviceInfoDBContext()
           : base(ConnectBuild.GetConnect(typeof(DeviceInfoDBContext).Name))
        {
        }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<DeviceInfoDBContext>(null);
            modelBuilder.Entity<t_DM_DeviceInfo>()
              .HasKey(t => new { t.DID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_DM_DeviceInfo> GetDeviceCombox(string pids)
        {
            string sql = "select top 50 DID,DeviceName from t_DM_DeviceInfo where 1=1";
            if (!string.IsNullOrEmpty(pids))
            {
                sql += " and PID IN (" + pids + ")";
            }
            return SQLQuery<t_DM_DeviceInfo>(sql);
        }
    }
}
