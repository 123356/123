﻿using IDAO;
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
            : base("name=YWConnectionStringHis")
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
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,c.Name,b.CName,a.CID  from t_EE_PowerQualityMonthly a  join t_DM_CircuitInfo b  on a.CID=b.CID join t_EE_EnerUserProject d 

on  CONVERT(varchar(5), b.CID)=d.addCid join

 t_EE_EnerUserType c on d.child_id=c.id

where a.CID in({cids}) and a.PID in ({pids}) and CONVERT(varchar(7),RecordTime, 120)='{time}' and a.UserPowerRate is not null and UsePower is not null order by RecordTime";
            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetMonthDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,c.Name,b.CName,a.CID  from t_EE_PowerQualityMonthly a  join t_DM_CircuitInfo b  on a.CID=b.CID join t_EE_EnerUserProject d 

on  CONVERT(varchar(5), b.CID)=d.addCid join

 t_EE_EnerUserType c on d.child_id=c.id

where a.CID in({cids}) and a.PID in ({pids}) and RecordTime>='{startTime}' and RecordTime<='{endTime}' and b.coolect_dev_type={type} and a.UserPowerRate is not null and UsePower is not null order by RecordTime";

            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetYearDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,c.Name,b.CName,a.CID  from t_EE_PowerQualityYearly a  join t_DM_CircuitInfo b  on a.CID=b.CIDjoin t_EE_EnerUserProject d 

on  CONVERT(varchar(5), b.CID)=d.addCid join

 t_EE_EnerUserType c on d.child_id=c.id

where a.CID in({cids}) and a.PID in ({pids}) and RecordTime>='{startTime}' and RecordTime<='{endTime}' and b.coolect_dev_type={type} and a.UserPowerRate is not null and UsePower is not null order by RecordTime";

            return SQLQuery<t_V_EneryView>(sql);
        }

        public IList<t_V_EneryView> GetDayDatasByTime(string cids, string pids, int type, string startTime, string endTime)
        {
            string sql = $@"select QID as ID,UsePower as Value,UserPowerRate as Rate,RecordTime,c.Name,b.CName,a.CID  from t_EE_PowerQualityDaily a  join t_DM_CircuitInfo b  on a.CID=b.CID join t_EE_EnerUserProject d 

on  CONVERT(varchar(5), b.CID)=d.addCid join

 t_EE_EnerUserType c on d.child_id=c.id

where a.CID in({cids}) and a.PID in ({pids}) and RecordTime>='{startTime}' and RecordTime<='{endTime}' and b.coolect_dev_type={type} and a.UserPowerRate is not null and UsePower is not null order by RecordTime";

            return SQLQuery<t_V_EneryView>(sql);
        }
        public DbSet<t_V_EneryView> Datas { get; set; }
    }
}
