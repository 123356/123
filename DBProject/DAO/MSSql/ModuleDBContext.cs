using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;

namespace DAO
{
    public class ModuleDBContext:DBContextBase, IModule
    {
        public ModuleDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<ModuleDBContext>(null);
            modelBuilder.Entity<t_CM_Module>()
              .HasKey(t => new { t.ModuleID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_CM_Module> GetModules(string moduleIDS)
        {
            string query = "select * from  t_CM_Module  where ModuleID in(" + moduleIDS + ");";

            return SQLQuery<t_CM_Module>(query);

        }

        public DbSet<t_CM_Module> Datas { get; set; }
    }
}
