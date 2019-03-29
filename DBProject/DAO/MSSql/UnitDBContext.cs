using System;
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
    public class UnitDBContext : DBContextBase, IUnit
    {
        public UnitDBContext()
            : base(ConnectBuild.GetConnect(typeof(UnitDBContext).Name))
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<UnitDBContext>(null);
            modelBuilder.Entity<t_CM_Unit>()
              .HasKey(t => new { t.UnitID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_CM_Unit> GetUnitList(string UNITList)
        {
            string sql = "select UnitID,UnitName,PDRList,ArchitectureArea from t_CM_Unit where t_CM_Unit.UnitID in(" + UNITList + ") and PDRList != ''";
            return SQLQuery<t_CM_Unit>(sql);
        }

        public IList<t_CM_Unit> GetUnitListByPID(int pid)
        {
            string sql = "SELECT UnitID,UnitName,PDRList,ArchitectureArea FROM t_CM_Unit WHERE(PDRList LIKE '" + pid + ",%' OR PDRList = '%," + pid + "' OR PDRList LIKE '%," + pid + ",%' OR PDRList = '" + pid + "')";
            return SQLQuery<t_CM_Unit>(sql);
        }

        public t_CM_Unit GetUnitModelByID(int uid)
        {
            string sql = "select UnitID,UnitName,PDRList,ArchitectureArea from t_CM_Unit where t_CM_Unit.UnitID=" + uid;
            return SQLQuery<t_CM_Unit>(sql).FirstOrDefault();
        }

        public DbSet<t_CM_Unit> Datas { get; set; }
    }
}
