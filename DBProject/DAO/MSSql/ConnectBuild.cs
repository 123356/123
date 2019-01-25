using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.MSSql
{
    public class ConnectBuild
    {
        public static string GetConnect(string name)
        {
            string connetStr = "name = YWConnectionString";
            if (string.IsNullOrEmpty(name))
                return connetStr;
            string conKey = name.Replace("DBContext", "")+"Constr";
            if (null!= ConfigurationManager.ConnectionStrings[conKey]
                &&!string.IsNullOrEmpty(ConfigurationManager.ConnectionStrings[conKey].ConnectionString))
            {
                connetStr = "name = "+conKey;
            }
            return connetStr;
        }
    }
}
