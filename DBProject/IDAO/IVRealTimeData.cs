using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IVRealTimeData : IDAOBase, IDisposable
    {
        IList<t_V_RealTimeTab> GetTagIdDetail(int pageSize, int nPage, int pid, int cid, int tdid, int did);
        IList<t_V_RealTimeData1> GetRealTimeData1(int pageSize, int nPage, int pid,string DataTypeIDS,bool DataTypeInvert, int cid, int tdid, int did);
        IList<t_V_RealTimeData> GetRealTimeData_linq(int pageSize, int nPage, int pid, int cid, int tdid, int did);
        IList<t_V_RealTimePV> GetTagIdPV(int pid, string tages);



    }
}
