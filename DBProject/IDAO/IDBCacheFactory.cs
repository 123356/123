using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO.InterfaceCache;
namespace IDAO
{
    public interface IDBCacheFactory
    {
        IDBCache DefautCache { get; }
        IDBCache GetCache(int index);
    }
}
