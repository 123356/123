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


        //增
        public IList<t_EE_AlarmConfig> AppendAlarm(t_EE_AlarmConfig alarm)
        {
            string sql = $"INSERT INTO t_EE_AlarmConfig(UID,PID,TypeId,LimitH1,LimitH2,LimitH3,LimitL1,LimitL2,LimitL3) output inserted.*,null TypeName  VALUES({alarm.UID},{alarm.PID},{alarm.TypeId},{alarm.LimitH1},{alarm.LimitH2},{alarm.LimitH3},{alarm.LimitL1},{alarm.LimitL2},{alarm.LimitL3}) ";
            return SQLQuery<t_EE_AlarmConfig>(sql);
        }
        //删
        public IList<t_EE_AlarmConfig> DeleteAlarm(t_EE_AlarmConfig alarm)
        {
            string sql = $" DELETE FROM t_EE_AlarmConfig OUTPUT deleted.*,null TypeName   WHERE PID = {alarm.PID} AND TypeId={alarm.TypeId}";
            return SQLQuery<t_EE_AlarmConfig>(sql);
        }

        //改
        public IList<t_EE_AlarmConfig> UpdataeAlarm(t_EE_AlarmConfig alarm)
        {
            string sql = $" UPDATE t_EE_AlarmConfig  SET TypeId = {alarm.TypeId},LimitH1={alarm.LimitH1},LimitH2={alarm.LimitH2},LimitH3={alarm.LimitH3},LimitL1={alarm.LimitL1},LimitL2={alarm.LimitL2}, LimitL3={alarm.LimitL3} OUTPUT Inserted.*,null TypeName   WHERE PID = {alarm.PID} AND TypeId={alarm.TypeId}";
            return SQLQuery<t_EE_AlarmConfig>(sql);
        }

    //查
        public IList<t_EE_AlarmConfig> GetPueAlarm(int pid)
        {
            string sql = $"select * from t_EE_AlarmConfig a LEFT JOIN t_EE_AlarmType b on a.TypeId = b.TypeID where 1 = 1 and a.PID = {pid}";
            return SQLQuery<t_EE_AlarmConfig>(sql);
        }




        //查找报警类型
        public IList<t_EE_AlarmType> GetAlarmType()
        {
            string sql  = $"SELECT * FROM t_EE_AlarmType";
            return SQLQuery<t_EE_AlarmType>(sql);
        }



        public IList<t_EE_AlarmConfig> GetPueAlarmAfter(t_EE_AlarmConfig alarm)
        {
            string sql = "";
            if (alarm.TypeId != null) {
                 sql = $"SELECT *,null TypeName FROM t_EE_AlarmConfig WHERE PID={alarm.PID} AND TypeId={alarm.TypeId}";
            } else if (alarm.TypeName != "") {
                sql = $"SELECT* FROM t_EE_AlarmConfig a  INNER JOIN t_EE_AlarmType b" +
                    $" ON a.TypeId = b.TypeId" +
                    $" WHERE a.PID = {alarm.PID} AND b.TypeName = '{alarm.TypeName}'";
            }
            return SQLQuery<t_EE_AlarmConfig>(sql);
        }

     




        public DbSet<t_EE_AlarmConfig> Datas { get; set; }
    }
}
