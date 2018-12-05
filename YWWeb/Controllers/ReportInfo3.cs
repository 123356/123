using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class ReportInfo3
    {
        private int DID;
        private List<ReportInfo2> list2;

        public ReportInfo3(int lastDID, List<ReportInfo2> list2)
        {
            // TODO: Complete member initialization
            this.DID = lastDID;
            this.list2 = list2;
        }
    }
}
