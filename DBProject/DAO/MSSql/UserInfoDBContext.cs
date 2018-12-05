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
    public class UserInfoDBContext : DBContextBase, IUserInfo
    {
        public UserInfoDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<UserInfoDBContext>(null);
            modelBuilder.Entity<t_CM_UserInfo>()
              .HasKey(t => new { t.UserID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_CM_UserInfo> GetUsers(int pid)
        {
            string sql = "SELECT * FROM t_CM_UserInfo WHERE (UNITList LIKE '" + pid + ",%' OR UNITList = '%," + pid + "' OR UNITList LIKE '%," + pid + ",%' OR UNITList = '" + pid + "')";
            return SQLQuery<t_CM_UserInfo>(sql);
        }

        public DbSet<t_CM_UserInfo> Datas { get; set; }
    }
}
