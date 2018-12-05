using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IRoleRight : IDAOBase, IDisposable
    {
        IList<IntegerValue> GetRoleID(int userid);
        IList<t_CM_RoleRight> GetRoles(int userid);
    }
}
