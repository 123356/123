﻿using DAO.MSSql;
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
    public class EnerySelectViewDBContext : DBContextBase, IEnerySelectView
    {
        public EnerySelectViewDBContext()
          : base(ConnectBuild.GetConnect(typeof(EnerySelectViewDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EnerySelectViewDBContext>(null);
            modelBuilder.Entity<t_V_EnerySelectView>()
              .HasKey(t => new { t.QID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_EnerySelectView> GetDatas(string time, string cids, string pids, int did, int cotypeid)
        {
            string sql = $@"select a.RecordTime,d.DeviceName,c.Name,a.QID,a.UserPowerRate from t_EE_PowerQualityMonthly a 
join t_DM_CircuitInfo b on a.CID = b.CID
join t_DM_CollectDevType c on b.coolect_dev_type = c.ID
join t_DM_DeviceInfo d on b.DID = d.DID
where a.UserPowerRate is not null and a.UserPowerRate!=0";
            if (!string.IsNullOrEmpty(time))
            {
                sql += $" and a.RecordTime='{time}'";
            }
            if (!string.IsNullOrEmpty( cids))
            {
                sql += $" and a.CID IN ({cids})";
            }
            if (!string.IsNullOrEmpty(cids))
            {
                sql += $" and a.PID IN ({pids})";
            }
            if (did != 0)
            {
                sql += $" and b.DID={did}";
            }
            if (cotypeid != 0)
            {
                sql += $" and c.ID={cotypeid}";
            }
            return SQLQuery<t_V_EnerySelectView>(sql);
        }
    }
}