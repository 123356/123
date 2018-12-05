using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IVRealTimeData : IDAOBase, IDisposable
    {
        IList<t_V_RealTimeData> GetRealTimeData(int pageSize, int nPage, int pid, int cid, int tdid, int did);
    }
}
