using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    using System;
    using System.Collections.Generic;

    public partial class t_SM_HisData
    {
        public virtual System.DateTime RecTime { get; set; }
        public virtual int TagID { get; set; }
        public virtual int PID { get; set; }
        public virtual Nullable<double> PV { get; set; }
        public virtual string AlarmStatus { get; set; }
        public virtual Nullable<double> AlarmLimits { get; set; }
    }
}
