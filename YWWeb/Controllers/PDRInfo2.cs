using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class PDRInfo2
    {
        public t_CM_PDRInfo pdrInfo;
        public t_CM_Constract constract;
        public string Mobilephone;
        public t_CM_Area area;
        public t_ES_ElecVoltage vmodel;
        public t_CM_Unit unit;
        public t_ES_Industry ind;

        public PDRInfo2(t_CM_PDRInfo pdrInfo, t_CM_Constract constract, string Mobilephone,t_CM_Area area,t_ES_ElecVoltage vmodel, t_CM_Unit unit, t_ES_Industry ind)
        {
            // TODO: Complete member initialization
            this.pdrInfo = pdrInfo;
            this.constract = constract;
            this.Mobilephone = Mobilephone;
            this.area = area;
            this.vmodel = vmodel;
            this.unit = unit;
            this.ind = ind;
        }
    }
}
