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
    public class ElementDeviceDBContext:DBContextBase, IElementDevice
    {
        public ElementDeviceDBContext()
            : base(ConnectBuild.GetConnect(typeof(ElementDeviceDBContext).Name))
        {
        }

        public int Add(t_DM_ElementDevice model)
        {
            string sql = $@"INSERT INTO [dbo].[t_DM_ElementDevice]
           ([DeviceCode]
           ,[DeviceName]
           ,[DeviceModel]
           ,[Manufactor]
           ,[DID]
           ,[PID])
     VALUES
           ('{model.DeviceCode}','{model.DeviceName}','{model.DeviceModel}','{model.Manufactor}',{model.DID},{model.PID})";
            return ExecuteSqlCommand(sql);
        }

        public int Delete(string id)
        {
            string sql = $"DELETE FROM[dbo].[t_DM_ElementDevice] WHERE ID IN({id})";
            return ExecuteSqlCommand(sql);
        }

        public IList<t_DM_ElementDevice> GetElementList(string name,int pid,int page,int rows)
        {
            string sql = $@"select top {rows} a.*,b.DeviceName DName,c.Name PName from (select ROW_NUMBER () OVER (ORDER BY ID) RowNumber,* from t_DM_ElementDevice) a 

join t_DM_DeviceInfo b on a.DID=b.DID join	t_CM_PDRInfo c on a.PID=c.PID 

where a.RowNumber>{(page - 1) * rows}";
            if (!string.IsNullOrEmpty(name))
                sql += " and a.DeviceName like '%" + name + "%'";
            if (pid != 0)
                sql += $" and a.PID ={pid}";
            return SQLQuery<t_DM_ElementDevice>(sql);
        }

        public t_DM_ElementDevice GetModelByID(int id)
        {
            string sql = @"select a.*,b.DeviceName DName,c.Name PName from t_DM_ElementDevice a 

join t_DM_DeviceInfo b on a.DID = b.DID join t_CM_PDRInfo c on a.PID = c.PID where a.ID=" + id;
            return SQLQuery<t_DM_ElementDevice>(sql).FirstOrDefault();
        }

        public int Update(t_DM_ElementDevice model)
        {
            string sql = $@"UPDATE [dbo].[t_DM_ElementDevice]
   SET [DeviceCode] = '{model.DeviceCode}'
      ,[DeviceName] = '{model.DeviceName}'
      ,[DeviceModel] = '{model.DeviceModel}'
      ,[Manufactor] = '{model.Manufactor}'
      ,[DID] = {model.DID}
      ,[PID] = {model.PID}
 WHERE ID={model.ID}";
            return ExecuteSqlCommand(sql);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<ElementDeviceDBContext>(null);
            modelBuilder.Entity<t_DM_ElementDevice>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
    }
}
