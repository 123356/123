using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class DeviceInfo
    {
        public int DID;
        public string PName;
        public string DeviceName;

        public DeviceInfo(int DID, string PName, string DeviceName)
        {
            // TODO: Complete member initialization
            this.DID = DID;
            this.PName = PName;
            this.DeviceName = DeviceName;
        }
    }
}
