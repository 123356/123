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
    public partial class t_EE_EnerUserProject
    {
        public int parent_id { get; set; }
        public int child_id { get; set; }
        public int unit_id { get; set; }
        public string unit_head { get; set; }
        public string unit_note { get; set; }
        public string addCid { get; set; }
        public string delCid { get; set; }
        public int unit_area { get; set; }
        public int unit_people { get; set; }
    }

    public partial class t_EE_CircuitInfoEnerType
    {
        public int PID { get; set; }
        public int CID { get; set; }
        public string ener_use_type { get; set; }
        public string ener_use_type_area { get; set; }
    }
}
