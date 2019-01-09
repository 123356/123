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
        /// <summary>
        /// 返回树
        /// </summary>
        IList<t_EE_EnerUserType> GetOrganizationList(int item_type);

        //修改分类项  如果有就修改  没有就添加
        int unpDateproject(int item_type, string Name, string Remarks);

        IList<t_EE_EnerUserType> GetComobxList();
    }
}
