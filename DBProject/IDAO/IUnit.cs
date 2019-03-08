using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IUnit : IDAOBase, IDisposable
    {
        IList<t_CM_Unit> GetUnitList(string unitList);

        IList<t_CM_Unit> GetUnitListByPID(int pid);
    }
}
