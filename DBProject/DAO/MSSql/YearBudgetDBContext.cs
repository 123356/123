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
    public class YearBudgetDBContext:DBContextBase, IYearBudget
    {
        public YearBudgetDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<BudgetDBContext>(null);
            modelBuilder.Entity<t_EE_YearBudget>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_EE_YearBudget> GetYearBudgetByID(int uid, int year)
        {
            string sql = $"select a.*,b.UnitName from t_EE_YearBudget a join t_CM_Unit b on a.UID=B.UnitID where UID={uid} and Year={year}";
            return SQLQuery<t_EE_YearBudget>(sql);
        }

        public int AddYearBudGet(t_EE_YearBudget model)
        {
            string sql = $"insert into t_EE_YearBudget(Year,GeneralBudget,BudgetBalance,UID) values({model.Year},{model.GeneralBudget},{model.BudgetBalance},{model.UID}) ";
            return ExecuteSqlCommand(sql);
        }

        public int UpdateYearBudGet(t_EE_YearBudget model)
        {
            string sql = $"update t_EE_YearBudget set Year={model.Year},GeneralBudget={model.GeneralBudget},BudgetBalance={model.BudgetBalance},UID={model.UID} WHERE UID={model.UID} AND Year={model.Year}";
            return ExecuteSqlCommand(sql);
        }

        public DbSet<t_EE_YearBudget> Datas { get; set; }
    }
}
