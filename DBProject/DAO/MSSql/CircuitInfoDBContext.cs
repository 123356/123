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
    public class CircuitInfoDBContext : DBContextBase, ICircuitInfo
    {
        public CircuitInfoDBContext()
             : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<CircuitInfoDBContext>(null);
            modelBuilder.Entity<t_DM_CircuitInfo>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_DM_CircuitInfo> GetCID(string cids, int type)
        {
            string sql = $@"select c.ID, CID,c.Name from (select a.ID,CID,b.Name,a.coolect_dev_type from [t_DM_CircuitInfo] a join [t_EE_EnerUserType] b on a.ener_use_type=b.id) as c 
                        where c.CID in({cids}) and coolect_dev_type={type}";
            return SQLQuery<t_DM_CircuitInfo>(sql);
        }
    }
}
