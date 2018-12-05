using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class ItemNode
    {
        public int cid;
        public string cname;
        public ItemNode(V_DeviceInfoState_PDR1 info)
        {
            this.cid = (int)info.CID;
            this.cname = info.CName;
        }
    }
}
