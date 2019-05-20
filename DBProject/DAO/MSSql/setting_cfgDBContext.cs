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
    public class setting_cfgDBContext : DBContextBase, Isetting_cfg
    {
        public setting_cfgDBContext()
           : base(ConnectBuild.GetConnect(typeof(setting_cfgDBContext).Name))
        {
        }

        public int AddSetting(t_sys_setting_cfg model)
        {
            string sql = $@"INSERT INTO [dbo].[t_sys_setting_cfg]
           ([cfg_id]
           ,[cfg_info]
           ,[cfg_modify_time]
           ,[remark])
     VALUES
           ({model.cfg_id}
           ,'{model.cfg_info}'
           ,'{model.cfg_modify_time}'
           ,'{model.remark}')";
            return ExecuteSqlCommand(sql);
        }

        public int DeteleSetting(int id)
        {
            string sql = $"DELETE FROM [dbo].[t_sys_setting_cfg] where ID={id}";
            return ExecuteSqlCommand(sql);
        }

        public t_sys_setting_cfg GetModelByID(int id)
        {
            string sql = $@"SELECT [ID]
      ,[cfg_id]
      ,[cfg_info]
      ,[cfg_modify_time]
      ,[remark]
  FROM[dbo].[t_sys_setting_cfg] where ID={id}";
            return SQLQuery<t_sys_setting_cfg>(sql).FirstOrDefault();
        }

        public t_sys_setting_cfg GetModelByType(int type)
        {
            string sql = $@"SELECT [ID]
      ,[cfg_id]
      ,[cfg_info]
      ,[cfg_modify_time]
      ,[remark]
  FROM[dbo].[t_sys_setting_cfg] where cfg_id={type}";
            return SQLQuery<t_sys_setting_cfg>(sql).FirstOrDefault();
        }

        public IList<t_sys_setting_cfg> getSettingtList(int type,out int total,int rows,int page)
        {
            string sql = $@"SELECT top {rows} [ID]
      ,[cfg_id]
      ,[cfg_info]
      ,[cfg_modify_time]
      ,[remark]
  FROM  (select ROW_NUMBER () OVER (ORDER BY ID) RowNumber,* from [dbo].[t_sys_setting_cfg]) a where RowNumber>{rows * (page - 1)} ";
            if (type != 0)
            {
                sql += $" and cfg_id={type}";
            }
            string sqlcount = @"SELECT [ID]
      ,[cfg_id]
      ,[cfg_info]
      ,[cfg_modify_time]
      ,[remark]
  FROM[dbo].[t_sys_setting_cfg] where 1=1";
            if (type != 0)
            {
                sql += $" and cfg_id={type}";
            }
            total = SQLQuery<t_sys_setting_cfg>(sqlcount).Count();
            return SQLQuery<t_sys_setting_cfg>(sql);
        }

        public int UpdateSetting(t_sys_setting_cfg model)
        {
            string sql = $@"UPDATE [dbo].[t_sys_setting_cfg]
   SET [cfg_id] = {model.cfg_id}
      ,[cfg_info] = '{model.cfg_info}'
      ,[cfg_modify_time] = '{model.cfg_modify_time}'
      ,[remark] = '{model.remark}' where ID={model.ID}";
            return ExecuteSqlCommand(sql);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<UnitDBContext>(null);
            modelBuilder.Entity<t_sys_setting_cfg>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
    }
}
