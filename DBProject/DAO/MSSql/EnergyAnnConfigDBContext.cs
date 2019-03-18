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
    public class EnergyAnnConfigDBContext:DBContextBase, IEnergyAnnConfig
    {
        public EnergyAnnConfigDBContext()
           : base(ConnectBuild.GetConnect(typeof(EnergyAnnConfigDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EnergyAnnConfigDBContext>(null);
            modelBuilder.Entity<t_EE_EnergyAnnConfig>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public int Add(t_EE_EnergyAnnConfig model)
        {
            string sql = $@"INSERT INTO [dbo].[t_EE_EnergyAnnConfig]
           ([UID]
           ,[UserID]
           ,[EneryUserTypeID])
     VALUES
           ({model.UID}
           ,{model.UserID}
           ,'{model.EneryUserTypeID}')";
            return ExecuteSqlCommand(sql);
        }

        public int Delete(int id)
        {
            string sql = "delete from t_EE_EnergyAnnConfig where ID=" + id;
            return ExecuteSqlCommand(sql);
        }

        public t_EE_EnergyAnnConfig GetConfigByID(int id)
        {
            string sql = "select * from t_EE_EnergyAnnConfig where ID=" + id;
            return SQLQuery<t_EE_EnergyAnnConfig>(sql).FirstOrDefault();
        }

        public t_EE_EnergyAnnConfig GetConfigList(int uid, int userid)
        {
            string con1 = "";
            string con2 = "";
            if (uid != 0)
                con1 = " and UID=" + uid;
            if (userid != 0)
                con2 = " and UserID=" + userid;
            string sql = string.Format("select * from t_EE_EnergyAnnConfig where 1=1"
                + "{0}"
                + "{1}", con1, con2);
            return SQLQuery<t_EE_EnergyAnnConfig>(sql).FirstOrDefault();

        }

        public int Update(t_EE_EnergyAnnConfig model)
        {
            string sql = $@"UPDATE [dbo].[t_EE_EnergyAnnConfig]
   SET [UID] = {model.UID}
      ,[UserID] = {model.UserID}
      ,[EneryUserTypeID] = '{model.EneryUserTypeID}'
 WHERE ID={model.ID}";
            return ExecuteSqlCommand(sql);
        }
    }
}
