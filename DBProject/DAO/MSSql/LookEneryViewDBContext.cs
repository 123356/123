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
    public class LookEneryViewDBContext : DBContextBase, ILookEneryView
    {
        public LookEneryViewDBContext()
          : base(ConnectBuild.GetConnect(typeof(LookEneryViewDBContext).Name))
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<LookEneryViewDBContext>(null);
            modelBuilder.Entity<t_V_LookEneryView>()
              .HasKey(t => new { t.Name });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_LookEneryView> GetCIDByUID(int uid)
        {
            string sql = $"select b.Name,a.addCid as cids,a.unit_area,a.unit_people from t_EE_EnerUserProject a join t_EE_EnerUserType b on a.child_id=b.id where  b.item_type=2 and a.unit_id={uid}";
            return SQLQuery<t_V_LookEneryView>(sql);
        }
    }
}
