using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IDAOBase :IDBCURD
    {
        IList<T> SQLQuery<T>(string sql, params object[] parameters) where T : class;
    }
}
