using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IAlarmTable_en : IDAOBase, IDisposable
    {
        IList<AlarmCount> GetAlarmCount();
        IList<t_AlarmTable_en> GetAlarm_enInf(int minAlarmstate,DateTime ?AlarmDateTimeBegin, DateTime ?AlarmDateTimeEnd,IList<OrderByCondtion> orderByColumns);
    }
}
