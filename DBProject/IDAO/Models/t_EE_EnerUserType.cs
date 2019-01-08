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
    public partial class t_EE_EnerUserType
    {
        public int id { get; set; }
        public string Name { get; set; }
        public int item_type { get; set; }
    }
}
