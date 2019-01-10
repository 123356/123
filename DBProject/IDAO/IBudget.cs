using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IBudget:IDAOBase,IDisposable
    {
        IList<t_EE_Budget> GetBudgetByID(int uid,int depid=0);
        
    }
}
