using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class ReportInfo2
    {
        public int CID;
        public string CName;
        public string DeviceName;
        public List<ReportInfo> list;

        public ReportInfo2(string DeviceName,int CID,string CName, List<ReportInfo> list)
        {
            // TODO: Complete member initialization
            this.CID = CID;
            this.CName = CName;
            this.list = list;
            this.DeviceName = DeviceName;
        }

    }
}
