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
        public string Name { get; set; }
        public string Remarks { get; set; }
        public int item_type { get; set; }
        
    }
}
