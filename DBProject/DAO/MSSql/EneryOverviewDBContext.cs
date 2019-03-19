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
    public class EneryOverviewDBContext : DBContextBase, IEneryOverview
    {
        public EneryOverviewDBContext()
            : base(ConnectBuild.GetConnect(typeof(EneryOverviewDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EneryOverviewDBContext>(null);
            modelBuilder.Entity<t_V_EneryView>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_V_EneryView> GetDatas(string cids, string pids, string time)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName,a.CID,b.coolect_dev_type  from t_EE_PowerQualityMonthly a  join t_DM_CircuitInfo b  on a.CID=b.CID



where a.CID in({cids}) and a.PID in ({pids}) and CONVERT(varchar(7),RecordTime, 120)='{time}' and a.UserPowerRate is not null and UsePower is not null order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }


        public IList<t_V_EneryView> GetLookDatas(Dictionary<int,string> cpids, string time)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,a.CID,CONVERT(varchar(10),RecordTime, 120) as Name,CONVERT(varchar(10),RecordTime, 120) as CName,a.QID as coolect_dev_type  from t_EE_PowerQualityDaily a

where CONVERT(varchar(10),RecordTime, 120)='{time}' and a.UserPowerRate is not null and UsePower is not null";

            int i = 0;
            foreach (KeyValuePair<int, string> item in cpids)
            {
                if (i == 0)
                    sql += $" and (a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                else
                    sql += $" or a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                if (cpids.Count() == (i + 1))
                {
                    sql += ")";
                }
                i++;
            }
            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }


        public IList<t_V_EneryView> GetMonthDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName as Name,b.CName,a.CID,b.coolect_dev_type  from t_EE_PowerQualityMonthly a  join t_DM_CircuitInfo b  on a.CID=b.CID



where a.CID in({cids}) and a.PID in ({pids}) and RecordTime>='{startTime}' and RecordTime<='{endTime}'  and a.UserPowerRate is not null and UsePower is not null";
            if (type != 0)
                sql += $" and b.coolect_dev_type={type}";
            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetYearDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName as Name,b.CName,a.CID,b.coolect_dev_type  from t_EE_PowerQualityYearly a  join t_DM_CircuitInfo b  on a.CID=b.CID 



where a.CID in({cids}) and a.PID in ({pids}) and RecordTime>='{startTime}' and RecordTime<='{endTime}' and a.UserPowerRate is not null and UsePower is not null";
            if (type != 0)
                sql += $" and b.coolect_dev_type={type}";

            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetDayDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName as Name,b.CName,a.CID,b.coolect_dev_type  from t_EE_PowerQualityDaily a  join t_DM_CircuitInfo b  on a.CID=b.CID



where a.CID in({cids}) and a.PID in ({pids}) and RecordTime>='{startTime}' and RecordTime<='{endTime}' and a.UserPowerRate is not null and UsePower is not null";

            if (type != 0)
                sql += $" and b.coolect_dev_type={type}";

            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetDayDatasByTime(Dictionary<int, string> cpids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName as Name,b.CName,a.CID,b.coolect_dev_type  from t_EE_PowerQualityDaily a  join t_DM_CircuitInfo b  on a.CID=b.CID



where RecordTime>='{startTime}' and RecordTime<='{endTime}' and a.UserPowerRate is not null and UsePower is not null";

            int i = 0;
            foreach (KeyValuePair<int, string> item in cpids)
            {
                if (i == 0)
                    sql += $" and (a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                else
                    sql += $" or a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                if (cpids.Count() == (i + 1))
                {
                    sql += ")";
                }
                i++;
            }

            if (type != 0)
                sql += $" and b.coolect_dev_type={type}";

            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetMonthDatasByTime(Dictionary<int, string> cpids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName as Name,b.CName,a.CID,b.coolect_dev_type,b.coolect_dev_type  from t_EE_PowerQualityMonthly a  join t_DM_CircuitInfo b  on a.CID=b.CID



where RecordTime>='{startTime}' and RecordTime<='{endTime}' and a.UserPowerRate is not null and UsePower is not null";

            int i = 0;
            foreach (KeyValuePair<int, string> item in cpids)
            {
                if (i == 0)
                    sql += $" and (a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                else
                    sql += $" or a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                if (cpids.Count() == (i + 1))
                {
                    sql += ")";
                }
                i++;
            }

            if (type != 0)
                sql += $" and b.coolect_dev_type={type}";

            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetYearDatasByTime(Dictionary<int, string> cpids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName as Name,b.CName,a.CID,b.coolect_dev_type  from t_EE_PowerQualityYearly a  join t_DM_CircuitInfo b  on a.CID=b.CID



where RecordTime>='{startTime}' and RecordTime<='{endTime}' and a.UserPowerRate is not null and UsePower is not null";

            int i = 0;
            foreach (KeyValuePair<int, string> item in cpids)
            {
                if (i == 0)
                    sql += $" and (a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                else
                    sql += $" or a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                if (cpids.Count() == (i + 1))
                {
                    sql += ")";
                }
                i++;
            }

            if (type != 0)
                sql += $" and b.coolect_dev_type={type}";

            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetMonthDatas(Dictionary<int, string> cpids, string time)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName,a.CID,b.coolect_dev_type  from t_EE_PowerQualityMonthly a  join t_DM_CircuitInfo b  on a.CID=b.CID
where CONVERT(varchar(7),RecordTime, 120)='{time}' and a.UserPowerRate is not null and UsePower is not null";
            int i = 0;
            foreach (KeyValuePair<int, string> item in cpids)
            {
                if (i == 0)
                    sql += $" and (a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                else
                    sql += $" or a.CID in({ item.Value}) and a.PID in ({ item.Key})";
                if (cpids.Count() == (i + 1))
                {
                    sql += ")";
                }
                i++;
            }
            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }
        public IList<t_V_EneryView> GetYearBudgetDatas(string cids, string pids, string time)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName,a.CID,b.coolect_dev_type  from t_EE_PowerQualityMonthly a  join t_DM_CircuitInfo b  on a.CID=b.CID



where a.CID in({cids}) and a.PID in ({pids}) and CONVERT(varchar(4),RecordTime, 120)='{time}' and a.UserPowerRate is not null and UsePower is not null order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }
        public DbSet<t_V_EneryView> Datas { get; set; }
    }
}
