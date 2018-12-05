using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IDBFactory
    {
        IHisData hisData { get; }
        IRoleRight roleRight { get; }
        IDeviceType deviceType { get; }
        IValueType valueType { get; }
        IVRealTimeData vRealTimeData { get; }
        IVHisData vHisData { get; }
        IModule module { get; }
        IAlarmTable_en alarmTable_en { get; }
        IUserInfo userInf { get; }
    }
}
