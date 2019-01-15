using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IExEnergy:IDAOBase,IDisposable
    {
        IList<t_EE_ExEnergy> GetExDatas(string pids);
        IList<t_EE_ExEnergy> GetExTable(string pids,string id);
    }
}
