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
    public partial class t_EE_Budget
    {
        public int ID { get; set; }

        public int YearID { get; set; }
        
        public decimal MonthBudget { get; set; }

        public int Month { get; set; }
    }
}
