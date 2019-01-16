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
        IList<t_EE_Budget> GetBudgetByID(int uid, int year = 0, int month = 0, int coTypeID=0);
        int AddBudGet(t_EE_Budget model);

        int UpdateBudGet(t_EE_Budget model);

        IList<t_EE_Budget> GetMonthBudgetByYearID(int yearid);

        t_EE_Budget GetMonthBudgetByID(int id);
    }
}
