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
    public class EnTypeConfigDBContext : DBContextBase, IenTypeConfig
    {
        public EnTypeConfigDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EnTypeConfigDBContext>(null);
            modelBuilder.Entity<t_EE_enTypeConfig>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }

        public int AddConfig(t_EE_enTypeConfig model)
        {
            string sql = $"insert into t_EE_enTypeConfig(UID,UserID,CollTypeID,EnerUserTypeID) values({model.UID},{model.UserID},{model.CollTypeID},{model.EnerUserTypeID})";
            return ExecuteSqlCommand(sql);
        }

        public int DeleteConfig(int id)
        {
            string sql = $"delete t_EE_enTypeConfig where ID={id}";
            return ExecuteSqlCommand(sql);
        }

        public IList<t_EE_enTypeConfig> GetenConig(int uid,string depid="0")
        {
            string sql = $"select a.*,b.Name from t_EE_enTypeConfig a join t_DM_CollectDevType b on a.CollTypeID=b.ID  where UID={uid}";
            if (depid != "0")
                sql += $" and EnerUserTypeID in({depid})";

            return SQLQuery<t_EE_enTypeConfig>(sql);
        }

        public DbSet<t_EE_enTypeConfig> Datas { get; set; }
    }
}
