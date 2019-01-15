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

        public int UID { get; set; }
        public string Year { get; set; }
        public decimal GeneralBudget { get; set; }

        public decimal BudgetBalance { get; set; }

        public decimal ActualBudget { get; set; }

        public decimal MonthBudget { get; set; }
        public decimal CollTypeID { get; set; }

        public decimal SubtypeBudget { get; set; }

        public decimal SubsectorGate { get; set; }

        public decimal DepartmentalApportionment { get; set; }

        public string Name { get; set; }
    }
}
