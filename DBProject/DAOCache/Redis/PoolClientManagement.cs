using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Redis
{
    public class PoolClientManagement : IDisposable
    {
        public static IConnectionMultiplexer GetClient()
        {
            return GetClient();
        }
        public static IConnectionMultiplexer GetClient(string ip,int port,string passwd)
        {
            try
            {
                return ConnectionMultiplexer.Connect(ip+":"+port);
            }catch(Exception e)
            { throw e; }
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}
