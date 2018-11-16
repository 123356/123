using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO.Models;
using System.Linq.Expressions;

namespace IDAO
{
    public interface IVHisData:IDAOBase,IDisposable
    {
        IList<t_V_HisData> GetHisData(int rows, int page, DateTime startdate, DateTime enddate, int pid = 0, string dname = "", string cname = "", string typename = "", string sort = "记录时间", string order = "asc");
        IList<T> FindAllByPage<T, S>(Expression<Func<T, bool>> conditions, Expression<Func<T, S>> orderBy, int pageSize, int pageIndex) where T : class;
   }
}
