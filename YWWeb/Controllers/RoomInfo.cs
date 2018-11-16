using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class RoomInfo
    {
        public AlarmInfo alarm;
        public TempInfo tempInfo;

        public RoomInfo(AlarmInfo alarm, TempInfo tempInfo)
        {
            // TODO: Complete member initialization
            this.alarm = alarm;
            this.tempInfo = tempInfo;
        }
    }
}
