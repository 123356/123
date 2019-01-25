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
    public class EneryUsreBudgetDBContext : DBContextBase, IEneryUsreBudget
    {
        public EneryUsreBudgetDBContext()
          : base(ConnectBuild.GetConnect(typeof(EneryUsreBudgetDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EneryUsreBudgetDBContext>(null);
            modelBuilder.Entity<t_EE_EneryUsreBudget>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_EE_EneryUsreBudget> GetBudgetByID(int uid, int year = 0, int month = 0, int coTypeID = 0)
        {
            string sql = $@"
select a.*,c.Month,d.Year,e.UnitName,F.Name as CollTypeName,g.Name as EName from t_EE_EneryUsreBudget a 
join t_EE_CollTypeBudget b on a.CollTypeID=b.ID
join t_EE_Budget c on b.MonthID=c.ID
 join t_EE_YearBudget d on c.YearID=d.ID 
 join t_CM_Unit e on d.UID=e.UnitID
 join t_DM_CollectDevType f on b.CollTypeID=f.ID 
 join t_EE_EnerUserType g on a.EneryUserID=g.id where d.UID={uid} and d.Year={year} and c.Month={month} and a.CollTypeID={coTypeID}";
            return SQLQuery<t_EE_EneryUsreBudget>(sql);
        }

        public int AddBudGet(t_EE_EneryUsreBudget model)
        {
            string sql = $@"insert into t_EE_EneryUsreBudget(EneryUserID,CollTypeID,GeneralBudget) 
          values({model.EneryUserID},{model.CollTypeID},{model.GeneralBudget})";
            return ExecuteSqlCommand(sql);
        }

        public int UpdateBudGet(t_EE_EneryUsreBudget model)
        {
            string sql = $@"update t_EE_EneryUsreBudget set EneryUserID={model.EneryUserID},CollTypeID={model.CollTypeID},GeneralBudget={model.GeneralBudget} where ID={model.ID}";
            return ExecuteSqlCommand(sql);
        }

        public IList<t_EE_EneryUsreBudget> GetenBudgetByYearID(int cotyid)
        {
            string sql = "select a.*, b.Name as EName from t_EE_EneryUsreBudget a join t_EE_EnerUserType b on a.EneryUserID=b.ID where a.CollTypeID=" + cotyid;
            return SQLQuery<t_EE_EneryUsreBudget>(sql);
        }

        public t_EE_EneryUsreBudget GetenBudgetByID(int id)
        {
            string sql = "select a.*, b.Name as EName from t_EE_EneryUsreBudget a join t_EE_EnerUserType b on a.EneryUserID=b.ID where a.ID=" + id;
            return SQLQuery<t_EE_EneryUsreBudget>(sql).FirstOrDefault();
        }

        public t_EE_EneryUsreBudget GetenBudgetByeneyidAndCoID(int cotyid, int eneryid)
        {
            string sql = $"select a.*, b.Name as EName from t_EE_EneryUsreBudget a join t_EE_EnerUserType b on a.EneryUserID=b.ID where a.EneryUserID={eneryid} and a.CollTypeID={cotyid}";
            return SQLQuery<t_EE_EneryUsreBudget>(sql).FirstOrDefault();
        }

        public int DeleEnBudgetByeneyidAndCoID(int cotyid, int eneryid)
        {
            string sql = $"delete from t_EE_EneryUsreBudget  where EneryUserID={eneryid} and CollTypeID={cotyid}";
            return ExecuteSqlCommand(sql);
        }
    }
}
