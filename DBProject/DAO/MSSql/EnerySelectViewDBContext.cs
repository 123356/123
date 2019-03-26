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
    public class EnerySelectViewDBContext : DBContextBase, IEnerySelectView
    {
        public EnerySelectViewDBContext()
          : base(ConnectBuild.GetConnect(typeof(EnerySelectViewDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EnerySelectViewDBContext>(null);
            modelBuilder.Entity<t_V_EnerySelectView>()
              .HasKey(t => new { t.QID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_EnerySelectView> GetDatas(string time, Dictionary<int, string> cpids, int did, int cotypeid)
        {
            string sql = $@"select a.RecordTime,d.DeviceName,c.Name,a.QID,a.UserPowerRate,b.CName,e.Name as PName from t_EE_PowerQualityMonthly a 
join t_DM_CircuitInfo b on (a.CID = b.CID and a.PID=b.PID)
join t_DM_CollectDevType c on b.coolect_dev_type = c.ID
join t_DM_DeviceInfo d on b.DID = d.DID
join t_CM_PDRInfo e on a.PID = e.PID
where a.UserPowerRate is not null and a.UsePower!=0";
            if (!string.IsNullOrEmpty(time))
            {
                sql += $" and a.RecordTime='{Convert.ToDateTime(time).ToString("yyyy-MM-dd")}'";
            }
            int i = 0;
            foreach (KeyValuePair<int, string> item in cpids)
            {
                if (i == 0)
                    sql += $" and (a.CID in({ item.Value}) and a.PID in ({ item.Key}) and b.PID={item.Key}";
                else
                    sql += $" or (a.CID in({ item.Value}) and a.PID in ({ item.Key}) and b.PID={item.Key})";
                if (cpids.Count() == (i + 1))
                {
                    sql += ")";
                }
                i++;
            }
            if (did != 0)
            {
                sql += $" and b.DID={did}";
            }
            if (cotypeid != 0)
            {
                sql += $" and c.ID={cotypeid}";
            }
            sql += " order by RecordTime desc";
            return SQLQuery<t_V_EnerySelectView>(sql);
        }
    }
}
