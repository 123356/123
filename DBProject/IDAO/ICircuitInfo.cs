using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface ICircuitInfo:IDAOBase,IDisposable
    {
        IList<t_DM_CircuitInfo> GetCID(Dictionary<int, string> cpids, int type);

        IList<t_DM_CircuitInfo> GetCIDByCIDS(string cids);
    }
}
