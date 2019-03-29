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
    public class ElecPriceDBContext : DBContextBase, IElecPrice
    {
        public ElecPriceDBContext()
          : base(ConnectBuild.GetConnect(typeof(ElecPriceDBContext).Name))
        {
        }

        public int Add(t_ES_ElecPrice model)
        {
            string sql = string.Format(@"INSERT INTO [dbo].[t_ES_ElecPrice]
           ([IndID]
           ,[BigIndTypeID]
           ,[VID]
           ,[FDRID]
           ,[PVFID]
           ,[ElecPrice]
           ,[WaterConstr]
           ,[FarmNet]
           ,[renewable]
           ,[reservoir]
           ,[Demand]
           ,[capacity])
     VALUES
           ({0}
           ,{1}
           ,{2}
           ,{3}
           ,{4}
           ,{5}
           ,{6}
           ,{7}
           ,{8}
           ,{9}
           ,{10}
           ,{11})", model.indID, model.BigIndTypeID==null?0:model.BigIndTypeID, model.VID, model.FDRID, model.PVFID, model.ElecPrice, model.WaterConstr==null?0:model.WaterConstr, model.FarmNet==null?0:model.FarmNet, model.renewable==null?0:model.renewable, model.reservoir==null?0:model.reservoir, model.Demand==null?0:model.Demand, model.capacity == null ? 0 : model.capacity);
            return ExecuteSqlCommand(sql);
        }

        public int Delete(string id)
        {
            string sql = string.Format(@"DELETE FROM [dbo].[t_ES_ElecPrice]
      WHERE id IN({0})", id);
            return ExecuteSqlCommand(sql);

        }

        public t_ES_ElecPrice_W GetElecPriceByID(int id)
        {
            string sql = $@"select top 10 a.*, b.IndustryName,c.VName,d.FDRName,e.PVFName,f.BigIndTypeName  from ( select ROW_NUMBER () OVER (ORDER BY id desc) RowNumber,* from [t_ES_ElecPrice]) a 
left join t_ES_Industry b on a.IndID=b.IndustryID 
left join t_ES_ElecVoltage c on a.VID=c.VID
left join t_ES_ElecFlatDryRich d on a.FDRID=d.FDRID
left join t_ES_ElecPeakValleyFlat e on a.PVFID=e.PVFID
left join t_ES_ElecBigIndustryType f on a.BigIndTypeID=f.BigIndTypeID where id={id}";
            return SQLQuery<t_ES_ElecPrice_W>(sql).FirstOrDefault();
        }

        public IList<t_ES_ElecPrice_W> GetElecPriceList(int page,int rows,int indid,int vid,int fdrid,int pvfid,int bigindtypeid)
        {
            string sql = $@"select top {rows} a.*, b.IndName,c.VName,d.FDRName,e.PVFName,f.BigIndTypeName  from ( select ROW_NUMBER () OVER (ORDER BY id desc) RowNumber,* from [t_ES_ElecPrice]) a 
left join t_ES_ElecIndustry b on a.IndID=b.IndID 
left join t_ES_ElecVoltage c on a.VID=c.VID
left join t_ES_ElecFlatDryRich d on a.FDRID=d.FDRID
left join t_ES_ElecPeakValleyFlat e on a.PVFID=e.PVFID
left join t_ES_ElecBigIndustryType f on a.BigIndTypeID=f.BigIndTypeID where a.RowNumber>{(page - 1) * rows}";
            if (indid != 0)
                sql += " and a.IndID=" + indid;
            if (vid != 0)
                sql += " and a.VID=" + vid;
            if (fdrid != 0)
                sql += " and a.FDRID=" + fdrid;
            if (pvfid != 0)
                sql += " and a.PVFID=" + pvfid;
            if (bigindtypeid != 0)
                sql += " and a.BigIndTypeID=" + bigindtypeid;
            return SQLQuery<t_ES_ElecPrice_W>(sql);
        }

        public int Update(t_ES_ElecPrice model)
        {
            string sql = $@"UPDATE [dbo].[t_ES_ElecPrice]
   SET [IndID] = {model.indID}
      ,[BigIndTypeID] = {(model.BigIndTypeID == null ? 0 : model.BigIndTypeID)}
      ,[VID] = {model.VID}
      ,[FDRID] = {model.FDRID}
      ,[PVFID] = {model.PVFID}
      ,[ElecPrice] = {model.ElecPrice}
      ,[WaterConstr] = {(model.WaterConstr == null ? 0 : model.WaterConstr)}
      ,[FarmNet] = {(model.FarmNet == null ? 0 : model.FarmNet)}
      ,[renewable] = {(model.renewable == null ? 0 : model.renewable)}
      ,[reservoir] = {(model.reservoir == null ? 0 : model.reservoir)}
      ,[Demand] = {(model.Demand == null ? 0 : model.Demand)}
      ,[capacity] = {(model.capacity == null ? 0 : model.capacity)}
 WHERE id={model.id}";
            return ExecuteSqlCommand(sql);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<ElecPriceDBContext>(null);
            modelBuilder.Entity<t_ES_ElecPrice>()
              .HasKey(t => new { t.id });
            base.OnModelCreating(modelBuilder);
        }
    }
}
