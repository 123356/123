using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IEneryOverview : IDAOBase, IDisposable
    {
        //IList<t_V_EneryView> GetEneryPowerOverview(int uid);

        //IList<t_V_EneryView> GetEneryWaterOverview(int uid);

        //IList<t_V_EneryView> GetEneryGasOverview(int uid);

        IList<t_V_EneryView> GetDatas(string cids, string pids,string month);
    }
}
