using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class TempInfo
    {
        public DevicePowerInfo powerInfo;
        public string temp;
        public string humidity;

        public string maxtDiviceTemp;
        public string addr;

        public TempInfo(DevicePowerInfo powerInfo, string temp, string humidity, string maxtDiviceTemp, string addr)
        {
            this.powerInfo = powerInfo;
            this.temp = temp;
            this.humidity = humidity;
            this.maxtDiviceTemp = maxtDiviceTemp;
            this.addr = addr;
        }
    }
}
