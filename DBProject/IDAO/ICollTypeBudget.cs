using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface ICollTypeBudget:IDAOBase,IDisposable
    {
        IList<t_EE_CollTypeBudget> GetBudgetByID(int uid, int year = 0, int month = 0, int cotypeid =0);
        int AddBudGet(t_EE_CollTypeBudget model);

        int UpdateBudGet(t_EE_CollTypeBudget model);


        IList<t_EE_CollTypeBudget> GetColltypeBudgetByMonthID(int monthid);

        t_EE_CollTypeBudget GetColltypeBudgetByID(int id);
    }
}
