﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;

namespace DAO
{
    public class VRealTimeDataDBContext:DBContextBase,IVRealTimeData
    {
        public VRealTimeDataDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<HisDataDBContext>(null);
            modelBuilder.Entity<t_V_RealTimeData>()
              .HasKey(t => new { t.TagID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_V_RealTimeData> GetRealTimeData(int pageSize, int nPage, int pid, int cid, int tdid, int did)
        {
            string condition1 = "", condition2 = "", condition3 = "", condition4 = "";
            if (pid > 0)
                condition1 = " and PID=" + pid;
            if (cid > 0)
                condition2 = " and e.CID=" + cid;
            if (tdid > 0)
                condition3 = " and b.DTID=" + tdid;
            if (did > 0)
                condition4 = " and b.DID=" + did;

            string tablename = GetTableName(pid);// "t_SM_ReallTimeData_" + pid.ToString("00000");
            string query = string.Format("select top {0} a.TagID, d.Name DeviceTypeName, DeviceName,中文描述 Position,f.Units Units,PV,RecTime,CName,b.OrderBy from "
+ "(select  ROW_NUMBER () OVER (ORDER BY TagID) RowNumber,TagID,PID,DID,CID,中文描述,单位,DataTypeID  from t_CM_PointsInfo  where DataTypeID!=23 and DataTypeID!=82 {1}) a"
+ " left join  t_DM_DeviceInfo b on a.DID=b.DID and a.PID=b.PID "
+ " left join {2} c on a.TagID= c.TagID "
+ " left join t_CM_DeviceType d on b.DTID=d.DTID  "
+ " left join t_CM_ValueType f on a.DataTypeID=f.DataTypeID "
+ " left join t_DM_CircuitInfo e on a.CID= e.CID and a.PID=e.PID "
+ " where a.RowNumber>{3} {4} {5} {6}"
+ " order by OrderBy", pageSize, condition1, tablename, pageSize * (nPage - 1), condition2, condition3, condition4);
            return SQLQuery<t_V_RealTimeData>(query);
        }
        string GetTableName(int pid)
        {
            return "t_SM_RealTimeData_" + pid.ToString("00000");
        }
        public DbSet<t_V_RealTimeData> Datas { get; set; }
    }
}