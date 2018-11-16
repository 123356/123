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
    public class HisDataDBContext:DBContextBase,IHisData
    {
        public HisDataDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<HisDataDBContext>(null);
            modelBuilder.Entity<t_SM_HisData>()
              .HasKey(t => new { t.RecTime, t.TagID });
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<t_SM_HisData> Datas { get; set; }
    }
}
