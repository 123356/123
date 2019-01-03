﻿using System;
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

        public DbSet<t_CM_UserInfo> Datas { get; set; }
    }
}
