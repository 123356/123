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
    public class ExEnergyDBContext : DBContextBase, IExEnergy
    {
        public ExEnergyDBContext()
           : base(ConnectBuild.GetConnect(typeof(ExEnergyDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<ExEnergyDBContext>(null);
            modelBuilder.Entity<t_EE_ExEnergy>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_EE_ExEnergy> GetExDatas(string pids)
        {
            string sql = $@"select a.*,b.Name EName,c.DeviceName,d.CName,e.Name as COName,f.Name as PName from t_EE_ExEnergy a join t_EE_EnerUserType b on a.enerUserTypeID=b.id join t_DM_DeviceInfo c on a.DID=c.DID
join t_DM_CircuitInfo d on a.CID = d.CID and a.PID=d.PID join t_DM_CollectDevType e on a.CODID = e.ID join t_CM_PDRInfo f on a.PID=F.PID where a.PID IN({pids}) order by Proportion desc";
            return SQLQuery<t_EE_ExEnergy>(sql);
        }

        public IList<t_EE_ExEnergy> GetExTable(string pids, string id)
        {
            string sql = $@"select a.*,b.Name EName,c.DeviceName,d.CName,e.Name as COName,f.Name as PName from t_EE_ExEnergy a join t_EE_EnerUserType b on a.enerUserTypeID=b.id join t_DM_DeviceInfo c on a.DID=c.DID
join t_DM_CircuitInfo d on a.CID = d.CID and a.PID=d.PID join t_DM_CollectDevType e on a.CODID = e.ID join t_CM_PDRInfo f on a.PID=F.PID where a.PID IN({pids}) and a.ID IN({id}) order by Proportion desc";
            return SQLQuery<t_EE_ExEnergy>(sql);
        }
    }
}
