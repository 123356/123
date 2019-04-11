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


        public IList<t_DM_CircuitInfoEnergy> getCircuitInfo(int pid, int cid, DateTime time)
        {
            string date = time.ToString("yyyy-MM-dd HH:ff:mm.000");
            string sql = $"SELECT TOP 1 a.DID DID,isnull(a.cName ,0) Purpose, isnull(a.coolect_dev_type ,0) CODID,b.ThisTemperatureValue Temperature FROM t_DM_CircuitInfo a " +
                        $" JOIN t_EE_WeatherDaily b on 1 = 1" +
                        $" WHERE a.pid = {pid} and a.cid = {cid}  AND b.CityName = '北京'" ;
            return SQLQuery<t_DM_CircuitInfoEnergy>(sql);
        }





        public IList<t_EE_ExEnergy1> InExDeviate(t_EE_ExEnergy1 ex)
        {
            string sql = $"DELETE FROM t_EE_ExEnergy WHERE PID = {ex.PID} AND CID = {ex.CID}; INSERT INTO t_EE_ExEnergy(DID,PID,enerUserTypeID, CID, BudgetEnergy, ActualEnergy, Proportion, ProportionValue, People, Area, CODID, Purpose, Temperature, RecordTime,Conclusion) output inserted.*" +
                        $" VALUES({ex.DID},{ex.PID},{ex.enerUserTypeID},{ex.CID},{ex.BudgetEnergy},{ex.ActualEnergy},{ex.Proportion},{ex.ProportionValue},{ex.People},{ex.Area},{ex.CODID},'{ex.Purpose}','{ex.Temperature}','{ex.RecordTime}','');";
            return SQLQuery<t_EE_ExEnergy1>(sql);
        }


        








    }
}
