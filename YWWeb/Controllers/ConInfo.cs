using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class ConInfo
    {
        public List<t_ES_ContractTempletI> list;
        public List<t_cm_files> files;

        public ConInfo(List<t_ES_ContractTempletI> list, List<t_cm_files> files )
        {
            // TODO: Complete member initialization
            this.list = list;
            this.files = files;
        }
    }
}
