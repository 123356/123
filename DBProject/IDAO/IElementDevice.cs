using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IElementDevice:IDAOBase,IDisposable
    {
        IList<t_DM_ElementDevice> GetElementList(string name,int pid,int page,int rows);
        int Add(t_DM_ElementDevice model);
        int Update(t_DM_ElementDevice model);
        int Delete(string id);
        t_DM_ElementDevice GetModelByID(int id);
    }
}
