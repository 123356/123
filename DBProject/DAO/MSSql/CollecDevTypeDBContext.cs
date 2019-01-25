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
    public class CollecDevTypeDBContext : DBContextBase, ICollecDevType
    {
        public CollecDevTypeDBContext()
           : base(ConnectBuild.GetConnect(typeof(CollecDevTypeDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<CollecDevTypeDBContext>(null);
            modelBuilder.Entity<t_DM_CollectDevType>()
              .HasKey(t => new { t.ID });
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_DM_CollectDevType> GetCollectDevTypeList()
        {
            return Datas.ToList();
        }
        public DbSet<t_DM_CollectDevType> Datas { get; set; }
    }
}
