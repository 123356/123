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
    public class PDRInfoDBContext:DBContextBase,IPDRInfo
    {
        public PDRInfoDBContext()
          : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<PDRInfoDBContext>(null);
            modelBuilder.Entity<t_CM_PDRInfo>()
              .HasKey(t => new { t.PID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_CM_PDRInfo> GetPDRList(string pids)
        {
            string query = "select PID,Name,Position,build_area from  t_CM_PDRInfo  where PID in(" + pids + ") and build_area is not null";
            return SQLQuery<t_CM_PDRInfo>(query);
        }
        public DbSet<t_CM_PDRInfo> Datas { get; set; }
    }
}
