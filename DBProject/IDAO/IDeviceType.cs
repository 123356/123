using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IDeviceType : IDAOBase, IDisposable
    {
        IList<t_CM_DeviceTypeComBox> GetRealTimeComboxData(int pid, int DID = -1);
    }
}
