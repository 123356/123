using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IUserInfo : IDAOBase, IDisposable
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="moduleIDS">1,2,3,4...</param>
        /// <returns></returns>
        IList<t_CM_UserInfo> GetUsers(int pid);
        IList<t_CM_UserInfo> GetUsers(string userName, string password);
        IList<t_CM_UserInfo> GetUsers(string mobile);
        IList<t_CM_UserInfo> GetWxUsers(string openid);
        int UpdateUnitList(int userID, string unitList);
        IList<t_CM_UserInfo> GetUnitLIstByUserID(t_CM_UserInfo user);
        IList<t_CM_UserInfo> GetUsersByUnits(string uids);
    }
}
