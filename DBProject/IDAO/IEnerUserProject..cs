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
        IList<t_EE_EnerUserProject> AddRelationship(int child_id, int parent_id,int unit_id,string unit_head,string unit_note, string addCid,string delCid);
        IList<t_EE_EnerUserProject> UpdateSupervisor(int oldId , int id, int unit_id);
        IList<t_EE_EnerUserProject> DeleteSupervisor(int parent_id, int child_id, int unit_id);
    }
}
