using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IElecPrice:IDAOBase,IDisposable
    {
        IList<t_ES_ElecPrice_W> GetElecPriceList(int page, int rows, int indid, int vid, int fdrid, int pvfid, int bigindtypeid,out int total,int uid);
        int Add(t_ES_ElecPrice model);
        int Update(t_ES_ElecPrice model);
        int Delete(string id);
        t_ES_ElecPrice_W GetElecPriceByID(int id);
    }
}
