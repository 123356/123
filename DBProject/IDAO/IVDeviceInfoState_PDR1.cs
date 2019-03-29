using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IVDeviceInfoState_PDR1 : IDAOBase, IDisposable
    {
        IList<t_V_DeviceInfoState_PDR1> GetCidTree(string pdrlist);
    }
}
