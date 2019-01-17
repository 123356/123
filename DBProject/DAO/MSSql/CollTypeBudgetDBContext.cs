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
    public class CollTypeBudgetDBContext:DBContextBase, ICollTypeBudget
    {
        public CollTypeBudgetDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<CollTypeBudgetDBContext>(null);
            modelBuilder.Entity<t_EE_CollTypeBudget>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_EE_CollTypeBudget> GetBudgetByID(int uid, int year = 0, int month = 0, int cotypeid=0)
        {
            string sql = $@"
select a.*,b.Month,c.Year,d.UnitName,e.Name as CollTypeName from t_EE_CollTypeBudget a 
join t_EE_Budget b on a.MonthID=b.ID 
join t_EE_YearBudget c on b.YearID=c.ID 
join t_CM_Unit d on c.UID=d.UnitID 
join t_DM_CollectDevType e on a.CollTypeID=e.ID where c.UID={uid} AND c.Year={year} AND b.Month={month}";
            if (cotypeid != 0)
            {
                sql += " and a.CollTypeID=" + cotypeid;
            }
            return SQLQuery<t_EE_CollTypeBudget>(sql);
        }

        public int AddBudGet(t_EE_CollTypeBudget model)
        {
            string sql = $@"insert into t_EE_CollTypeBudget(MonthID,CollTypeID,GeneralBudget) 
          values({model.MonthID},{model.CollTypeID},{model.GeneralBudget})";
            return ExecuteSqlCommand(sql);
        }

        public int UpdateBudGet(t_EE_CollTypeBudget model)
        {
            string sql = $@"update t_EE_CollTypeBudget set MonthID={model.MonthID},CollTypeID={model.CollTypeID},GeneralBudget={model.GeneralBudget} where ID={model.ID}";
            return ExecuteSqlCommand(sql);
        }

        public IList<t_EE_CollTypeBudget> GetColltypeBudgetByMonthID(int monthid)
        {
            string sql = $"select a.*,b.Name as CollTypeName from t_EE_CollTypeBudget a join t_DM_CollectDevType b on a.CollTypeID=b.ID where MonthID={monthid}";
            return SQLQuery<t_EE_CollTypeBudget>(sql);
        }

        public t_EE_CollTypeBudget GetColltypeBudgetByID(int id)
        {
            string sql = $"select a.*,b.Name as CollTypeName from t_EE_CollTypeBudget a join t_DM_CollectDevType b on a.CollTypeID=b.ID where a.ID={id}";
            return SQLQuery<t_EE_CollTypeBudget>(sql).FirstOrDefault();
        }
    }
}
