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
    public class BudgetDBContext : DBContextBase, IBudget
    {
        public BudgetDBContext()
             : base(ConnectBuild.GetConnect(typeof(BudgetDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<BudgetDBContext>(null);
            modelBuilder.Entity<t_EE_Budget>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_EE_Budget> GetBudgetByID(int uid, int year = 0, int month = 0,int coTypeID=0)
        {
            string sql = $@"select a.*,b.Year,f.UnitName from t_EE_Budget a 
join t_EE_YearBudget b on a.YearID=b.ID 
join t_CM_Unit f on b.UID = f.UnitID where b.UID={uid} and b.Year={year}";

            if (month != 0)
            {
                sql += $" and a.Month={month}";
            }
            return SQLQuery<t_EE_Budget>(sql);
        }

        public int AddBudGet(t_EE_Budget model)
        {
            string sql = $@"insert into t_EE_Budget(YearID,MonthBudget,Month) 
          values({model.YearID},{model.MonthBudget},{model.Month})";
            return ExecuteSqlCommand(sql);
        }

        public int UpdateBudGet(t_EE_Budget model)
        {
            string sql = $@"update t_EE_Budget set YearID={model.YearID},MonthBudget={model.MonthBudget},Month={model.Month} where ID={model.ID}";
            return ExecuteSqlCommand(sql);
        }

        public IList<t_EE_Budget> GetMonthBudgetByYearID(int yearid)
        {
            string sql = $@"select * from t_EE_Budget where YearID={yearid}";
            return SQLQuery<t_EE_Budget>(sql);
        }

        public t_EE_Budget GetMonthBudgetByID(int id)
        {
            string sql = $@"select * from t_EE_Budget where ID={id}";
            return SQLQuery<t_EE_Budget>(sql).FirstOrDefault();
        }
    }
}
