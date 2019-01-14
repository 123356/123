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
        IList<t_EE_ExEnergy> GetExDatas();
        IList<t_EE_ExEnergy> GetExTable(string id);
    }
}
