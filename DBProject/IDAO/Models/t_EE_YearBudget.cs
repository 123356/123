using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_EE_YearBudget
    {
        public int ID { get; set; }
        public int Year { get; set; }
        public decimal GeneralBudget { get; set; }
        public decimal BudgetBalance { get; set; }
        public int UID { get; set; }
        public string UnitName { get; set; }
    }
}
