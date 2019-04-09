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
        IList<t_EE_EnerUserProject> GetCidByUidAndIDepID(int uid, int depid);
        IList<t_EE_EnerUserProject> addTreeNode(t_V_EnerProjectType data);
        IList<t_EE_EnerUserProject> updataTreeNode(t_V_EnerProjectType data);
        IList<t_EE_EnerUserProject> updataTreeNodeId(t_V_EnerProjectType data);
        IList<t_EE_EnerUserProject> DeleteSupervisor(int parent_id, int child_id, int unit_id);
        IList<t_EE_EnerUserProject> GetDepIDByParID(int uid, int parid, int isP);
        IList<t_EE_EnerUserProject> UpdatEnerNode(t_V_EnerProjectType data);
    }
}
