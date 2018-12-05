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
    public class RoleRightDBContext : DBContextBase,IRoleRight
    {
        public RoleRightDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<RoleRightDBContext>(null);
            modelBuilder.Entity<t_CM_RoleRight>()
              .HasKey(t => new { t.RoleRightID });
            modelBuilder.Entity<IntegerValue>()
              .HasKey(t => new { t.IValue });
            base.OnModelCreating(modelBuilder);
        }

        public IList<IntegerValue> GetRoleID(int userid)
        {
            string query = "select ModuleID IValue from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + userid + ")";
            
             return SQLQuery<IntegerValue>(query);          
        }

        public IList<t_CM_RoleRight> GetRoles(int userid)
        {
            string query = "select * from t_CM_RoleRight where RoleID in (select RoleID from t_CM_UserRoles where UserID=" + userid + ")";

            return SQLQuery<t_CM_RoleRight>(query);
        }

        public DbSet<t_CM_RoleRight> Datas { get; set; }
        public DbSet<IntegerValue> RoleIDS { get; set; }
    }
}
