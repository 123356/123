﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_V_EneryReportFrom
    {
        public int ID { get; set; }
        public decimal Value { get; set; }
        public decimal Rate { get; set; }

        //public int Type { get; set; }
        public string TypeName { get; set; }

        public DateTime RecordTime { get; set; }

        public int CID { get; set; }

        public string CName { get; set; }
    }
}
