using IDAO.InterfaceCache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RedisHelp;
using StackExchange.Redis;

namespace DAOCache
{
   public class DBCacheContext:IDBCache
    {
        RedisHelper redis;
       public DBCacheContext(int dbIndex=0)
        {
            redis = new RedisHelper(dbIndex);
        }

        public double HashDecrement(string key, string dataKey, double val = 1)
        {
            return redis.HashDecrement(key, dataKey, val);
        }

        public bool HashDelete(string key, string dataKey)
        {
            return redis.HashDelete(key, dataKey);
        }

        public long HashDelete(string key, List<object> dataKeys)
        {
            List<RedisValue> DK = new List<RedisValue>();
            DK.AddRange(dataKeys.Select(t=> (RedisValue)t));
            return redis.HashDelete(key, DK);
        }

        public bool HashExists(string key, string dataKey)
        {
            return redis.HashExists(key, dataKey);
        }

        public T HashGet<T>(string key, string dataKey)
        {
            return redis.HashGet<T>(key, dataKey);
        }

        public double HashIncrement(string key, string dataKey, double val = 1)
        {
            return redis.HashIncrement(key, dataKey, val);
        }

        public List<T> HashKeys<T>(string key)
        {
            return redis.HashKeys<T>(key);
        }

        public bool HashSet<T>(string key, string dataKey, T t)
        {
            return redis.HashSet<T>(key,dataKey,t);
        }

        public bool KeyDelete(string key)
        {
            return redis.KeyDelete(key);
        }

        public long KeyDelete(List<string> keys)
        {
            return redis.KeyDelete(keys);
        }

        public bool KeyExists(string key)
        {
            return redis.KeyExists(key);
        }

        public bool KeyExpire(string key, TimeSpan? expiry = null)
        {
            return redis.KeyExpire(key,expiry);
        }

        public bool KeyRename(string key, string newKey)
        {
            return redis.KeyRename(key, newKey);
        }

        public double StringDecrement(string key, double val = 1)
        {
            return redis.StringDecrement(key, val);
        }

        public string StringGet(string key)
        {
            return redis.StringGet(key);
        }
        
        public IList<string> StringGet<T>(List<string> listKey)
        {
            return redis.StringGet(listKey).Select(t => t.ToString()).ToList();
        }
        public T StringGet<T>(string key)
        {
            return redis.StringGet<T>(key);
        }

       

        public double StringIncrement(string key, double val = 1)
        {
            return redis.StringIncrement(key,val);
        }

        public bool StringSet(string key, string value, TimeSpan? expiry = null)
        {
            return redis.StringSet(key, value,expiry);
        }

        public bool StringSet(List<KeyValuePair<object, object>> keyValues)
        {
            List<KeyValuePair<RedisKey, RedisValue>> KV = new List<KeyValuePair<RedisKey, RedisValue>>();
            KV.AddRange(keyValues.Select(t => new KeyValuePair<RedisKey, RedisValue>((RedisKey)t.Key,(RedisValue)t.Value)));
            return redis.StringSet(KV);
        }

        public bool StringSet<T>(string key, T obj, TimeSpan? expiry = null)
        {
            return redis.StringSet<T>(key,obj,expiry);
        }
    }
}
