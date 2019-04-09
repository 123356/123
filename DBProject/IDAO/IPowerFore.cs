using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IPowerFore:IDAOBase,IDisposable
    {
        IList<t_V_PowerForeView> GetForeList(string pid, string cid, string startTime, string endTime, int type);
    }
}
