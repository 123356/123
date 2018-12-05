using IDAO.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace DAL.Models
{
   public class MenuInf
    {
        public t_CM_Module moduleParent { set; get; }
        public List<t_CM_Module> childern { set; get; }
        public List<t_CM_RoleRight> disenableModule { set; get; }
    }
    public class MenuInfAdapter
    {
        public DateTime dateTime { set; get; }
        public string menuInfJson { set; get; }
    }
}