using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IDeviceInfo:IDAOBase,IDisposable
    {
        IList<t_DM_DeviceInfo> GetDeviceCombox(string pids);
    }
}
