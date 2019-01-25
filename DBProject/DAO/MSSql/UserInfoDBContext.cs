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
    public class UserInfoDBContext : DBContextBase, IUserInfo
    {
        public UserInfoDBContext()
            : base(ConnectBuild.GetConnect(typeof(UserInfoDBContext).Name))
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

        public IList<t_CM_UserInfo> GetUsers(string userName, string password)
        {
            //this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            return Datas.Where(u => u.UserName == userName && u.UserPassWord == password).ToList();
        }

        public IList<t_CM_UserInfo> GetUsers(string mobile)
        {
            return Datas.Where(u => u.Mobilephone == mobile).ToList();
        }

        public IList<t_CM_UserInfo> GetWxUsers(string openid)
        {
            return Datas.Where(u => u.openid2 == openid).ToList();
        }
        public int UpdateUnitList(int userID, string unitList)
        {
            string sql = $"update t_CM_UserInfo set UNITList= '{unitList}' where UserID={userID}";
            return ExecuteSqlCommand(sql);
        }


        public IList<t_CM_UserInfo> GetUnitLIstByUserID(t_CM_UserInfo user)
        {
            string sql = "";
            if (user.RoleID == 1)
                sql = "select * from t_CM_UserInfo";
            else if (Convert.ToBoolean(user.IsAdmin))
                sql = $"select * from t_CM_UserInfo where UID = {user.UID} AND RoleID!= 1";
            else
                sql = $"select * from t_CM_UserInfo where UserID={user.UserID}";

            return SQLQuery<t_CM_UserInfo>(sql);
        }
        public DbSet<t_CM_UserInfo> Datas { get; set; }
    }
}
