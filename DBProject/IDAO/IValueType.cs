using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IValueType : IDAOBase, IDisposable
    {
        IList<t_CM_ValueTypeComBox> GetRealTimeComboxData(int pid, int DID = -1);
    }
}
