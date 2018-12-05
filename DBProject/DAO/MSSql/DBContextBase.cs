using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace DAO
{
    public class DBContextBase : DbContext
    {
        public DBContextBase(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }

        public IList<T> SQLQuery<T>(string sql, params object[] parameters) where T : class
        {
           return this.Database.SqlQuery<T>(sql, parameters).ToList();
        }
    }
}
