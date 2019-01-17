using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IDepartmentalApportionment:IDAOBase,IDisposable
    {
        int AddBudGet(t_EE_DepartmentalApportionment model);
        int UpdateBudGet(t_EE_DepartmentalApportionment model);

        IList<t_EE_DepartmentalApportionment> GetenBudgetByYearID(int cotyid);

        t_EE_DepartmentalApportionment GetenBudgetByID(int id);

        t_EE_DepartmentalApportionment GetenBudgetByeneyidAndCoID(int cotyid, int eneryid);
        int DeleEnBudgetByeneyidAndCoID(int cotyid, int eneryid);
    }
}
