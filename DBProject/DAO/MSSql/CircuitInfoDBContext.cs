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
    public class CircuitInfoDBContext : DBContextBase, ICircuitInfo
    {
        public CircuitInfoDBContext()
             : base(ConnectBuild.GetConnect(typeof(CircuitInfoDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<CircuitInfoDBContext>(null);
            modelBuilder.Entity<t_DM_CircuitInfo>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_DM_CircuitInfo> GetCID(Dictionary<int,string> cpids, int type)
        {
            string sql = $@"select c.ID, CID from (select a.ID,CID,a.coolect_dev_type,a.PID from [t_DM_CircuitInfo] a) as c 
                        where coolect_dev_type={type}";
            int i = 0;
            foreach (KeyValuePair<int, string> item in cpids)
            {
                if (i == 0)
                    sql += $" and ((c.CID in({ item.Value}) and c.PID in ({ item.Key}))";
                else
                    sql += $" or (c.CID in({ item.Value}) and c.PID in ({ item.Key}))";
                if (cpids.Count() == (i + 1))
                {
                    sql += ")";
                }
                i++;
            }
            return SQLQuery<t_DM_CircuitInfo>(sql);
        }

        public IList<t_DM_CircuitInfo> GetCIDByCIDS(string cids)
        {
            string sql = $@"select c.ID, CID,c.Name from (select a.ID,CID,b.Name,a.coolect_dev_type from [t_DM_CircuitInfo] a join t_DM_CollectDevType b on a.coolect_dev_type=b.id) as c 
                        where c.CID in({cids}) ";
            return SQLQuery<t_DM_CircuitInfo>(sql);
        }
    }
}
