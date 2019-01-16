using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IEneryUsreBudget : IDAOBase, IDisposable
    {
        IList<t_EE_EneryUsreBudget> GetBudgetByID(int uid, int year = 0, int month = 0, int coTypeID = 0);
        int AddBudGet(t_EE_EneryUsreBudget model);
        int UpdateBudGet(t_EE_EneryUsreBudget model);

        IList<t_EE_EneryUsreBudget> GetenBudgetByYearID(int cotyid);

        t_EE_EneryUsreBudget GetenBudgetByID(int id);
    }
}
