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
    public class DepartmentalApportionmentContext : DBContextBase, IDepartmentalApportionment
    {
        public DepartmentalApportionmentContext()
         : base(ConnectBuild.GetConnect(typeof(DepartmentalApportionmentContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<DepartmentalApportionmentContext>(null);
            modelBuilder.Entity<t_EE_DepartmentalApportionment>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }

        public int AddBudGet(t_EE_DepartmentalApportionment model)
        {
            string sql = $@"insert into t_EE_DepartmentalApportionment(EneryUserID,CollTypeID,GeneralBudget) 
          values({model.EneryUserID},{model.CollTypeID},{model.GeneralBudget})";
            return ExecuteSqlCommand(sql);
        }

        public int UpdateBudGet(t_EE_DepartmentalApportionment model)
        {
            string sql = $@"update t_EE_DepartmentalApportionment set EneryUserID={model.EneryUserID},CollTypeID={model.CollTypeID},GeneralBudget={model.GeneralBudget} where ID={model.ID}";
            return ExecuteSqlCommand(sql);
        }

        public IList<t_EE_DepartmentalApportionment> GetenBudgetByYearID(int cotyid)
        {
            string sql = "select a.*, b.Name as EName from t_EE_DepartmentalApportionment a join t_EE_EnerUserType b on a.EneryUserID=b.ID where a.CollTypeID=" + cotyid;
            return SQLQuery<t_EE_DepartmentalApportionment>(sql);
        }

        public t_EE_DepartmentalApportionment GetenBudgetByID(int id)
        {
            string sql = "select a.*, b.Name as EName from t_EE_DepartmentalApportionment a join t_EE_EnerUserType b on a.EneryUserID=b.ID where a.ID=" + id;
            return SQLQuery<t_EE_DepartmentalApportionment>(sql).FirstOrDefault();
        }

        public t_EE_DepartmentalApportionment GetenBudgetByeneyidAndCoID(int cotyid, int eneryid)
        {
            string sql = $"select a.*, b.Name as EName from t_EE_DepartmentalApportionment a join t_EE_EnerUserType b on a.EneryUserID=b.ID where a.EneryUserID={eneryid} and a.CollTypeID={cotyid}";
            return SQLQuery<t_EE_DepartmentalApportionment>(sql).FirstOrDefault();
        }

        public int DeleEnBudgetByeneyidAndCoID(int cotyid, int eneryid)
        {
            string sql = $"delete from t_EE_DepartmentalApportionment  where EneryUserID={eneryid} and CollTypeID={cotyid}";
            return ExecuteSqlCommand(sql);
        }
    }
}
