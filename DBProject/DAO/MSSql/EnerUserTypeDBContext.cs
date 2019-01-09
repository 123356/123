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
    public class EnerUserTypeDBContext : DBContextBase, IEnerUserType
    {
        public EnerUserTypeDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EnerUserTypeDBContext>(null);
            modelBuilder.Entity<t_EE_EnerUserType>()
              .HasKey(t => new { t.id });
            base.OnModelCreating(modelBuilder);
        }
   

        public IList<t_EE_EnerUserType> CheckHistory(string Name,int item_type)
        {
            string sql = "select * from t_EE_EnerUserType where Name='"+ Name + "' and item_type="+ item_type;
            return SQLQuery<t_EE_EnerUserType>(sql);
        }

        public IList<t_EE_EnerUserType> AddHistory(string Name, int item_type)
        {
            string sql = "INSERT INTO t_EE_EnerUserType(Name,item_type) output inserted.* VALUES('"+ Name + "',"+ item_type + ")";
            return SQLQuery<t_EE_EnerUserType>(sql);
        }

        public IList<t_EE_EnerUserType> GetComobxList()
        {
            string sql = "select * from t_EE_EnerUserType";
            return SQLQuery<t_EE_EnerUserType>(sql);
        }

        public IList<t_EE_EnerUserType> GetHistoryList(int item_type)
        {
            string sql = "select * from t_EE_EnerUserType where item_type = "+ item_type;
            return SQLQuery<t_EE_EnerUserType>(sql);
        }
        public DbSet<t_EE_EnerUserType> Datas { get; set; }
    }
}
