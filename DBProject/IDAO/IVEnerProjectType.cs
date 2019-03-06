using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IVEnerProjectType : IDAOBase, IDisposable
    {
        IList<t_V_EnerProjectType> GetTreeData(int unitID, int item_type);

        IList<t_V_EnerPower> GetTreeData1(int unitID, int item_type);
        IList<t_V_EnerProjectType> UpdateRelationship(int child_id, int parent_id, int unit_id, string unit_head, string unit_note, string addCid, string delCid,int updateTypeID,int unit_area,int unit_people);
        IList<t_V_EnerProjectType> AddProjectTemplate(int unitID, int item_type);
        IList<t_V_EnerProjectType> GetHistoryList(int unitID, int item_type);
        IList<t_V_EnerProjectTypePower> GetCidsToElectricity(string pids, string cids);
        IList<t_V_EnerProjectTypePower> GetElectrMonth(string pid, string cid);
    }
}
