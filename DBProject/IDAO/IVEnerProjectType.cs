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
        IList<t_V_EnerProjectType> GetEnergyData(int UnitID, int ItemType,string UnitName);
        IList<t_V_EnerProjectType> DefaultNode(int unitID, int item_type);
        IList<t_V_EnerPower> GetElectricityToDay(string pid, string cid,DateTime time);
        IList<t_V_EnerPower> GetElectricityToMonth(string pid, string cid,DateTime time);
        IList<t_V_EnerProjectType> PidCidGetArea(int pid, int cid);
    }
}
