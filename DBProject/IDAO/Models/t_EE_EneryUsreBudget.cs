using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_EE_EneryUsreBudget
    {
        public int ID { get; set; }
        public int EneryUserID { get; set; }
        public int CollTypeID { get; set; }
        public decimal GeneralBudget { get; set; }
        public string EName { get; set; }
    }
}
