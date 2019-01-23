using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IPointsInfo : IDAOBase, IDisposable
    {
        IList<t_CM_PointsInfoBase1> GetTageID(int pid,int cid);
    }
}
