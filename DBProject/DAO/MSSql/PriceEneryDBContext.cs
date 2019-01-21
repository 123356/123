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
    public class PriceEneryDBContext:DBContextBase, IPriceEnery
    {
        public PriceEneryDBContext()
          : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<PriceEneryDBContext>(null);
            modelBuilder.Entity<t_EE_PriceEnery>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_EE_PriceEnery> GetPriceEneryBy(int uid=0, int colltypeid=0,int level=0)
        {
            string sql = $@"select a.*,b.UnitName,c.Name as CollTypeName from t_EE_PriceEnery a 
       JOIN t_CM_Unit b on a.UID=b.UnitID 
     join t_DM_CollectDevType c on a.CollTypeID=c.ID where 1=1";
            if (uid != 0)
            {
                sql += $"  AND a.UID={uid}";
            }
            if (colltypeid != 0)
            {
                sql += $"  AND a.CollTypeID={colltypeid}";
            }
            if (level != 0)
            {
                sql += $"  AND a.Ladder={level}";
            }
            return SQLQuery<t_EE_PriceEnery>(sql);
        }

        public int InserPriceEnery(t_EE_PriceEnery model)
        {
            string sql = $@"INSERT INTO [dbo].[t_EE_PriceEnery]
           ([UID]
           ,[CollTypeID]
           ,[Ladder]
           ,[LadderValue]
           ,[Price])
     VALUES
           ({model.UID}
           ,{model.CollTypeID}
           ,{model.Ladder}
           ,'{model.LadderValue}'
           ,{model.Price})";
            return ExecuteSqlCommand(sql);
        }

        public int UpdatePriceEnery(t_EE_PriceEnery model)
        {
            string sql = $@"UPDATE [dbo].[t_EE_PriceEnery]
   SET [UID] = {model.UID}
      ,[CollTypeID] = {model.CollTypeID}
      ,[Ladder] = {model.Ladder}
      ,[LadderValue] = '{model.LadderValue}'
      ,[Price] = {model.Price}
 WHERE ID={model.ID}";
            return ExecuteSqlCommand(sql);
        }

        public int DeletePriceEnery(int id)
        {
            string sql = $@"DELETE FROM [dbo].[t_EE_PriceEnery]
      WHERE ID={id}";
            return ExecuteSqlCommand(sql);
        }

        public t_EE_PriceEnery GetPriceEneryByID(int id)
        {
            string sql = $@"select a.*,b.UnitName,c.Name as CollTypeName from t_EE_PriceEnery a 
       JOIN t_CM_Unit b on a.UID=b.UnitID 
     join t_DM_CollectDevType c on a.CollTypeID=c.ID where a.ID={id}";
            return SQLQuery<t_EE_PriceEnery>(sql).FirstOrDefault();
        }

        public DbSet<t_EE_PriceEnery> Datas { get; set; }
    }
}
