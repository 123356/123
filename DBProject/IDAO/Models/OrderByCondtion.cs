using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class OrderByCondtion
    {
        public string ColumnName { set; get; }
        public OrderByType orderType { get; set; }
    }
    public enum OrderByType
    {
        ASC,
        DESC,
    }
}
