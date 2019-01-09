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
            string sql = $"insert into t_EE_enTypeConfig(UID,UserID,Type,DepartmentID) values({model.UID},{model.UserID},{model.Type},{model.DepartmentID})";
            return ExecuteSqlCommand(sql);
        }

        public int DeleteConfig(int id)
        {
            string sql = $"delete t_EE_enTypeConfig where ID={id}";
            return ExecuteSqlCommand(sql);
        }

        public IList<t_EE_enTypeConfig> GetenConig(int uid)
        {
            string sql = $"select * from t_EE_enTypeConfig where UID={uid}";
            return SQLQuery<t_EE_enTypeConfig>(sql);
        }

        public DbSet<t_EE_enTypeConfig> Datas { get; set; }
    }
}
