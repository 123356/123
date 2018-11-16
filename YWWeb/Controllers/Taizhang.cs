using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class Taizhang
    {
        public t_DM_DeviceInfo t_DM_DeviceInfo;
        public List<t_PM_Order> repairList;

        public Taizhang(t_DM_DeviceInfo t_DM_DeviceInfo, List<t_PM_Order> repairList)
        {
            // TODO: Complete member initialization
            this.t_DM_DeviceInfo = t_DM_DeviceInfo;
            this.repairList = repairList;
        }
    }
}
