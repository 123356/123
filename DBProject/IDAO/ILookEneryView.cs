using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface ILookEneryView : IDAOBase, IDisposable
    {
        IList<t_V_LookEneryView> GetCIDByUID(int uid);
        IList<t_V_LookEneryView> GetCIDByID(string id,int uid);

    }
}
