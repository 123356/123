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
        int UpdateUnitList(int userID, string unitList);
    }
}
