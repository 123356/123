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
    public class BudgetDBContext : DBContextBase, IBudget
    {
        public BudgetDBContext()
             : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<BudgetDBContext>(null);
            modelBuilder.Entity<t_EE_Budget>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_EE_Budget> GetBudgetByID(int uid)
        {
            string sql = "select a.*,b.Name from t_EE_Budget a join t_DM_CollectDevType b on a.CollTypeID=b.ID where UID=" + uid;
            return SQLQuery<t_EE_Budget>(sql);
        }
    }
}
