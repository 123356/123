using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Public
{
    public class CommandFunc
    {
        static public string ConvertToString(OrderByType t)
        {
            switch(t)
            {
                case OrderByType.DESC:
                    return "desc";
                default:
                    return "asc";
            }
        }
    }
}
