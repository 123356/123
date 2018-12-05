using System;
using IDAO;
using IDAO.InterfaceCache;

namespace DAOCache
{
    public class DBCacheFactory : IDAO.IDBCacheFactory
    {
        public IDBCache DefautCache => GetCache();

        public IDBCache GetCache(int index=0)
        {
            return new DBCacheContext(index);
        }
    }
}
