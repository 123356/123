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
    public class EnerUserProjectDBContext : DBContextBase, IEnerUserProject
    {
        public EnerUserProjectDBContext()
            : base("name=YWConnectionStringHis")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EnerUserProjectDBContext>(null);
            modelBuilder.Entity<t_EE_EnerUserProject>()
              .HasKey(t => new { t.parent_id });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_EE_EnerUserProject> GetOrganizationTree(int unitId, int itemType)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            //  string sql = "SELECT t_EE_EnerUserProject.parent_id,t_EE_EnerUserProject.child_id FROM t_EE_EnerUserType,t_EE_EnerUserProject WHERE t_EE_EnerUserType.item_type = 1 AND t_EE_EnerUserType.id =t_EE_EnerUserProject.parent_id";
            string sql = "SELECT t_EE_EnerUserProject.parent_id,t_EE_EnerUserProject.child_id FROM t_EE_EnerUserType join t_EE_EnerUserProject on t_EE_EnerUserType.id =t_EE_EnerUserProject.parent_id WHERE t_EE_EnerUserType.item_type = 1 ";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }
        public DbSet<t_EE_EnerUserProject> Datas { get; set; }
    }
}
