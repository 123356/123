using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IPriceEnery:IDAOBase,IDisposable
    {
        IList<t_EE_PriceEnery> GetPriceEneryBy(int uid, int colltypeid, int level = 0,int page=1,int rows=15);
        int InserPriceEnery(t_EE_PriceEnery model);
        int UpdatePriceEnery(t_EE_PriceEnery model);

        int DeletePriceEnery(int id);

        t_EE_PriceEnery GetPriceEneryByID(int id);
    }
}
