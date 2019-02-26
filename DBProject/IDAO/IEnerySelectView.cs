using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IEnerySelectView:IDAOBase,IDisposable
    {
        IList<t_V_EnerySelectView> GetDatas(string time, string cids,string pids, int did,  int cotypeid);
    }
}
