﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_V_EneryView
    {
        public int ID { get; set; }
        public decimal Value { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }

        //public int Type { get; set; }

        //public string TypeName { get; set; }

        public DateTime RecordTime { get; set; }
    }
}