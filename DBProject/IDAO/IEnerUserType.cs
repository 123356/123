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
        
        //修改分类项  如果有就修改  没有就添加
        int unpDateproject(int item_type, string Name, string Remarks);

        IList<t_EE_EnerUserType> GetComobxList();
        IList<t_EE_EnerUserType> CheckHistory(string Name, int item_type);
        IList<t_EE_EnerUserType> AddHistory(string Name, int item_type);
        IList<t_EE_EnerUserType> GetHistoryList(int item_type);
        
    }
}
