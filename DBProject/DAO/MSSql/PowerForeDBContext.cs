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
    public class PowerForeDBContext:DBContextBase, IPowerFore
    {
        public PowerForeDBContext()
           : base(ConnectBuild.GetConnect(typeof(PowerForeDBContext).Name))
        {
        }

       

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<CollTypeBudgetDBContext>(null);
            modelBuilder.Entity<t_V_PowerForeView>()
              .HasKey(t => new { t.FID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_PowerForeView> GetForeList(string pid, string cid, string startTime, string endTime,int type)
        {
            string tableName = "t_EE_PowerForeDaily";
            switch (type)
            {
                case 1:
                    tableName = "t_EE_PowerForeDaily";
                    break;
                case 2:
                    tableName = "t_EE_PowerForeMonthly";
                    break;
                case 3:
                    tableName = "t_EE_PowerForeYearly";
                    break;
            }
            string sql = "select * from " + tableName + $" where RecordTime>='{startTime}' and RecordTime<='{endTime}'";
            if (!string.IsNullOrEmpty(pid))
            {
                sql += " and PID IN (" + pid + ")";
            }
            if (!string.IsNullOrEmpty(pid))
            {
                sql += " and CID IN(" + cid + ")";
            }
            return SQLQuery<t_V_PowerForeView>(sql);
        }
        public DbSet<t_V_PowerForeView> Datas { get; set; }
    }
}
