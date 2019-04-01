using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public partial class t_ES_ElecPrice
    {
        public int id { get; set; }
        public Nullable<int> indID { get; set; }
        public Nullable<int> BigIndTypeID { get; set; }
        public Nullable<int> VID { get; set; }
        public Nullable<int> FDRID { get; set; }
        public Nullable<int> PVFID { get; set; }
        public Nullable<decimal> ElecPrice { get; set; }
        public Nullable<decimal> WaterConstr { get; set; }
        public Nullable<decimal> FarmNet { get; set; }
        public Nullable<decimal> renewable { get; set; }
        public Nullable<decimal> reservoir { get; set; }
        public Nullable<decimal> Demand { get; set; }
        public Nullable<decimal> capacity { get; set; }
        public Nullable<int> UID { get; set; }
    }
    public partial class t_ES_ElecPrice_W:t_ES_ElecPrice
    {
        public string IndName { get; set; }
        public string VName { get; set; }
        public string FDRName { get; set; }
        public string PVFName { get; set; }
        public string BigIndTypeName { get; set; }
        public string UnitName { get; set; }
    }
}
