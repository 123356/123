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
    public class PointsInfoDBContext : DBContextBase, IPointsInfo
    {
        public PointsInfoDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<PointsInfoDBContext>(null);
            modelBuilder.Entity<t_CM_PointsInfoBase1>()
              .HasKey(t => new { t.TagID });
            modelBuilder.Entity<t_CM_PointsInfo>()
              .HasKey(t => new { t.TagID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_CM_PointsInfoBase1> GetTageID(int pid, int cid)
        {
            string query = "select * from  t_CM_PointsInfo  where cid = " + cid + " and pid  =" + pid;
            return SQLQuery<t_CM_PointsInfoBase1>(query);
        }

        public DbSet<t_CM_PointsInfo> Datas { get; set; }
    }
}
