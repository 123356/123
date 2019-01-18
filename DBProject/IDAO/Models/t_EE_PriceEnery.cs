using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_EE_PriceEnery
    {
        public int ID { get; set; }
        public int UID { get; set; }
        public int CollTypeID { get; set; }
        public int Ladder { get; set; }
        public string LadderValue { get; set; }
        public decimal Price { get; set; }

        public string UnitName { get; set; }
        public string CollTypeName { get; set; }

    }
}
