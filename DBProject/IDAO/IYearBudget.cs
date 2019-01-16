using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IYearBudget:IDAOBase,IDisposable
    {
        IList<t_EE_YearBudget> GetYearBudgetByID(int uid, int year);

        int AddYearBudGet(t_EE_YearBudget model);

        int UpdateYearBudGet(t_EE_YearBudget model);
    }
}
