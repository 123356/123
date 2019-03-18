using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IAlarmConfig : IDAOBase, IDisposable
    {
        IList<t_EE_AlarmConfig> GetPueAlarm(int pid);

        IList<t_EE_AlarmType> GetAlarmType();



    }
}
