using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;
using DAO.MSSql;

namespace DAO
{
    public class EnerUserTypeDBContext : DBContextBase, IEnerUserType
    {
        public EnerUserTypeDBContext()
            : base(ConnectBuild.GetConnect(typeof(EnerUserTypeDBContext).Name))
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

        public IList<t_EE_EnerUserType> GetComobxList(int itemType)
        {
            string sql = "select * from t_EE_EnerUserType where item_type=" + itemType;
            return SQLQuery<t_EE_EnerUserType>(sql);
        }

        public IList<t_EE_EnerUserType> GetItemName(string addcid)
        {
            string sql = $"select Name,a.id,item_type from t_EE_EnerUserProject a join t_EE_EnerUserType b on a.child_id=b.id where  (a.addCid LIKE '{ addcid},%' OR addCid = '%,{ addcid}' OR addCid LIKE '%,{addcid},%' OR addCid = '{addcid}') and b.item_type=1";
            return SQLQuery<t_EE_EnerUserType>(sql);
        }

        public DbSet<t_EE_EnerUserType> Datas { get; set; }
    }
}
