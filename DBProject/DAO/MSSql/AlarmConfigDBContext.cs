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
    public class AlarmConfigDBContext : DBContextBase, IAlarmConfig
    {
        public AlarmConfigDBContext()
            : base(ConnectBuild.GetConnect(typeof(AlarmConfigDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<AlarmConfigDBContext>(null);
            modelBuilder.Entity<t_EE_AlarmConfig>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_EE_AlarmConfig> GetPueAlarm(int pid)
        {
            string sql = "";
            if (pid == -1){
                sql = "select * from t_EE_AlarmConfig a LEFT JOIN t_EE_AlarmType b on a.TypeId = b.TypeID where 1 = 1";
            }
            else{
                sql = $"select * from t_EE_AlarmConfig a LEFT JOIN t_EE_AlarmType b on a.TypeId = b.TypeID where 1 = 1 and a.PID = {pid}";
            }
            return SQLQuery<t_EE_AlarmConfig>(sql);
        }



        public IList<t_EE_AlarmType> GetAlarmType()
        {
            string sql  = "SELECT * FROM t_EE_AlarmType";
            return SQLQuery<t_EE_AlarmType>(sql);
        }


        

        public DbSet<t_EE_AlarmConfig> Datas { get; set; }
    }
}
