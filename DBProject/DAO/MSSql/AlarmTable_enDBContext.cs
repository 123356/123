using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;
using DAO.Public;
using DAO.MSSql;

namespace DAO
{
    public class AlarmTable_enDBContext:DBContextBase, IAlarmTable_en
    {
        public AlarmTable_enDBContext()
            : base(ConnectBuild.GetConnect(typeof(AlarmTable_enDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<AlarmTable_enDBContext>(null);
            modelBuilder.Entity<t_AlarmTable_en>()
              .HasKey(t => new { t.AlarmID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<AlarmCount> GetAlarmCount()
        {
            string query = "select COUNT(*) Count, pid from t_AlarmTable_en where AlarmState>0  group by pid ;";//全部更新
            return SQLQuery<AlarmCount>(query);
        }

        public IList<t_AlarmTable_en> GetAlarm_enInf(int minAlarmstate, DateTime? AlarmDateTimeBegin, DateTime ?AlarmDateTimeEnd, IList<OrderByCondtion> orderByColumns)
        {
            string timeCondBegin="";
            string timeCondEnd ="";
            string stateCond="";
            List<string> orderbyCond=new List<string>();
            stateCond = " AlarmState >=" + minAlarmstate ;
            string sql = "SELECT AlarmID,ALarmType,AlarmState,Company,AlarmDateTime,PID,DID,CID,AlarmCate,AlarmValue FROM t_AlarmTable_en WHERE " + stateCond;
            if (null!=AlarmDateTimeBegin)
            {
                timeCondBegin += " AlarmDateTime>='"+AlarmDateTimeBegin+"' ";
                sql += " and " + timeCondBegin;
            }
            if (null != AlarmDateTimeEnd)
            {
                timeCondEnd += " AlarmDateTime<='" + AlarmDateTimeEnd + "' ";
                sql += " and " + timeCondEnd;
            }
            foreach(var v in orderByColumns)
            {
                orderbyCond.Add(v.ColumnName + " " + CommandFunc.ConvertToString(v.orderType));
            }
            if (orderbyCond.Count()>0)
            {
                sql +=" order by " +String.Join(",",orderbyCond);
            }

            return SQLQuery<t_AlarmTable_en>(sql);
        }

        public DbSet<t_AlarmTable_en> Datas { get; set; }
    }
}
