using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class LoginBean
    {
        public string sID;
        public t_CM_UserInfo t_CM_UserInfo;

        public LoginBean(string sID, t_CM_UserInfo t_CM_UserInfo)
        {
            // TODO: Complete member initialization
            this.sID = sID;
            this.t_CM_UserInfo = t_CM_UserInfo;
        }
    }
}
