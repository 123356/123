using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;

namespace DAO
{
    public class ValueTypeDBContext:DBContextBase,IValueType
    {
        public ValueTypeDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<HisDataDBContext>(null);
            modelBuilder.Entity<t_CM_ValueType>()
              .HasKey(t => new { t.DataTypeID });
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<t_CM_ValueType> Datas { get; set; }
        public DbSet<t_CM_ValueTypeComBox> ComboxDatas { get; set; }
    }
}
