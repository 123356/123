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
    public class EneryReportFromDBContext:DBContextBase,IEneryReportFrom
    {
        public EneryReportFromDBContext()
           : base(ConnectBuild.GetConnect(typeof(EnerUserProjectDBContext).Name))
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EneryReportFromDBContext>(null);
            modelBuilder.Entity<t_V_EneryReportFrom>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_EneryReportFrom> GetMonthFormDatas(Dictionary<int, string> cpids, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName,a.CID,e.Name as TypeName  from 
t_EE_PowerQualityMonthly a  join t_DM_CircuitInfo b  on a.CID=b.CID
join t_DM_CollectDevType e on e.ID=b.coolect_dev_type
where RecordTime>='{startTime}' and RecordTime<='{endTime}'  and a.UserPowerRate is not null and UsePower is not null";

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
            return SQLQuery<t_V_EneryReportFrom>(sql);
        }

        public IList<t_V_EneryReportFrom> GetYearFormDatas(Dictionary<int, string> cpids, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName,a.CID,e.Name as TypeName   
from t_EE_PowerQualityYearly a join t_DM_CircuitInfo b  on a.CID=b.CID 
join t_DM_CollectDevType e on e.ID=b.coolect_dev_type
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
            sql += " order by RecordTime";
            return SQLQuery<t_V_EneryReportFrom>(sql);
        }

        public IList<t_V_EneryReportFrom> GetDayFormDatas(Dictionary<int,string> cpids, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,b.CName,a.CID,e.Name as TypeName  
from t_EE_PowerQualityDaily a  join t_DM_CircuitInfo b  on a.CID=b.CID 
join t_DM_CollectDevType e on e.ID=b.coolect_dev_type
where RecordTime>='{startTime}' and RecordTime<='{endTime}' and a.UserPowerRate is not null and UsePower is not null ";

            int i = 0;
            foreach(KeyValuePair<int,string> item in cpids)
            {
                if(i==0)
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
            return SQLQuery<t_V_EneryReportFrom>(sql);
        }
    }
}
