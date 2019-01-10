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
        IList<t_DM_CircuitInfo> GetCID(string cids, int type);
    }
}
