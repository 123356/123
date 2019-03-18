using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;
    [Serializable]
    public partial class t_EE_AlarmType
    {
        public int TypeId { get; set; }
        public string TypeName { get; set; }
    }

    public partial class t_EE_AlarmConfig : t_EE_AlarmType
    {
        public int ID { get; set; }
        public int UID { get; set; }
        public int PID { get; set; }
        public decimal? LimitH1 { get; set; }
        public decimal? LimitH2 { get; set; }
        public decimal? LimitH3 { get; set; }
        public decimal? LimitL1 { get; set; }
        public decimal? LimitL2 { get; set; }
        public decimal? LimitL3 { get; set; }
    }


}
