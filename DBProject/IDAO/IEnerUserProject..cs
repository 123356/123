using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IEnerUserProject : IDAOBase, IDisposable
    {
        IList<t_EE_EnerUserProject> GetOrganizationTree(int unitId, int itemType);
    }
}
