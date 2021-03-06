﻿using System;
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
    public class ValueTypeDBContext:DBContextBase,IValueType
    {
        public ValueTypeDBContext()
            : base(ConnectBuild.GetConnect(typeof(ValueTypeDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<HisDataDBContext>(null);
            modelBuilder.Entity<t_CM_ValueType>()
              .HasKey(t => new { t.DataTypeID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_CM_ValueTypeComBox> GetRealTimeComboxData(int pid, int DID = -1)
        {
            string tablename = "t_SM_HisData_" + pid.ToString("00000");
            string query = "select * from  " + tablename + " where RecTime>='";
            return SQLQuery<t_CM_ValueTypeComBox>(query);
        }

        public DbSet<t_CM_ValueType> Datas { get; set; }
      
    }
}
