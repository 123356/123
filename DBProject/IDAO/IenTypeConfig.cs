using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IenTypeConfig:IDAOBase, IDisposable
    {
        int AddConfig(t_EE_enTypeConfig model);
        int DeleteConfig(int id);
        IList<t_EE_enTypeConfig> GetenConig(int uid,int depid=0);
    }
}
