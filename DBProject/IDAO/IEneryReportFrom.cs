using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IEneryReportFrom:IDAOBase,IDisposable
    {
        IList<t_V_EneryReportFrom> GetDayFormDatas(Dictionary<int, string> cpids, string startTime, string endTime);
        IList<t_V_EneryReportFrom> GetMonthFormDatas(Dictionary<int, string> cpids, string startTime, string endTime);
        IList<t_V_EneryReportFrom> GetYearFormDatas(Dictionary<int, string> cpids, string startTime, string endTime);
    }
}
