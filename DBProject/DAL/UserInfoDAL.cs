using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO;
using DAO;
using IDAO.Models;
using DAL.Models;
using Newtonsoft.Json;
using IDAO.InterfaceCache;

namespace DAL
{
    public class UserInfoDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
      
        static UserInfoDAL _DataDal;
        static readonly object _loker = new object();
        public static UserInfoDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new UserInfoDAL();
                }
            }

            return _DataDal;
        }

        
      
        /// <summary>
        /// 获取拥有PID 权限的用户
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        public IList<t_CM_UserInfo> GetUsers(int pid)
        {
            IList<t_CM_UserInfo> data = new List<t_CM_UserInfo>();
            try
            {

                data = _dbFactory.userInf.GetUsers(pid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;
           
        }
        public IList<t_CM_UserInfo> GetUsers(string userName,string password)
        {
            IList<t_CM_UserInfo> data = new List<t_CM_UserInfo>();
            try
            {

                data = _dbFactory.userInf.GetUsers(userName,password);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
        public IList<t_CM_UserInfo> GetUsers(string mobile)
        {
            IList<t_CM_UserInfo> data = new List<t_CM_UserInfo>();
            try
            {

                data = _dbFactory.userInf.GetUsers(mobile);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }
        public IList<t_CM_UserInfo> GetWxUsers(string openid)
        {
            IList<t_CM_UserInfo> data = new List<t_CM_UserInfo>();
            try
            {

                data = _dbFactory.userInf.GetWxUsers(openid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return data;

        }

    }
}