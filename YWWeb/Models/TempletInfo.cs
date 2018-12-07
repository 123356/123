using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class TempletInfo
    {
        public t_ES_ContractTempletI templets;
        public List<t_cm_files> images;

        public TempletInfo(t_ES_ContractTempletI t_ES_ContractTempletI, List<t_cm_files> images)
        {
            // TODO: Complete member initialization
            this.templets = t_ES_ContractTempletI;
            this.images = images;
        }
    }
}
