using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    /// <summary>
    /// 返回节点树
    /// </summary>
    public interface IEnerUserType : IDAOBase, IDisposable
    {
        IList<t_EE_EnerUserType> GetComobxList(int itemType);
        IList<t_EE_EnerUserType> GetEnerTypeToID(string Name, int item_type);
        IList<t_EE_EnerUserType> GetEnerTypeToName(int ID, int item_type);
        IList<t_EE_EnerUserType> AddEnerNameType(string Name, int item_type,string icon);
        IList<t_EE_EnerUserType> GetItemName(string addcid);
        IList<t_EE_EnerUserType> GetEnerName(int ID,string Name, int item_type);
    }
}
