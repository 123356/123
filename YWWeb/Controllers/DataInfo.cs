using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class DataInfo
    {
        public Boolean open = true;
        public ItemNode name;
        public List<V_DeviceInfoState_PDR1> values;

        public DataInfo(ItemNode inode, List<V_DeviceInfoState_PDR1> datas)
        {
            this.name = inode;
            this.values = datas;
        }
    }
}
