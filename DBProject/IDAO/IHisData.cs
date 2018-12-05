using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IHisData : IDAOBase, IDisposable
    {
        IList<t_SM_HisData> GetHisData(int pid, string TagIDs, string DateStart, string DateEnd);
        long GetHisDataCount(int pid = 0, string tagIDS = "", string startdate = "", string enddate = "", string typename = "", string dname = "", string cname = "");
        IList<t_SM_HisData> GetHisDataPage(int rows, int page, int pid = 0, string startdate = "", string enddate = "", string tagIDS = "", string dname = "", string cname = "", string typename = "", string sort = "记录时间", string order = "asc");
    }
}
