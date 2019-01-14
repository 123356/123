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
    public class ExEnergyDBContext : DBContextBase, IExEnergy
    {
        public ExEnergyDBContext()
           : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<ExEnergyDBContext>(null);
            modelBuilder.Entity<t_EE_ExEnergy>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_EE_ExEnergy> GetExDatas()
        {
            string sql = @"select a.*,b.Name EName,c.DeviceName,d.CName,e.Name as COName from t_EE_ExEnergy a join t_EE_EnerUserType b on a.enerUserTypeID=b.id join t_DM_DeviceInfo c on a.DID=c.DID
join t_DM_CircuitInfo d on a.CID = d.CID join t_DM_CollectDevType e on a.CODID = e.ID order by Proportion desc";
            return SQLQuery<t_EE_ExEnergy>(sql);
        }
    }
}
