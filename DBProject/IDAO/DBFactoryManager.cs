using IDAO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DAO
{
    public class DBFactoryManager:IDisposable
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["DBFactoryInfo"].ConnectionString;

        static private readonly string DefaultKey = "DefaltDB";
       static Dictionary<string, IDBFactory> m_dbFactoryMgr = new Dictionary<string, IDBFactory>();
        public static IDBFactory GetDBFactory() {
            return GetDBFactory(DefaultKey);
        }
        public static IDBFactory GetDBFactory(string dbInf)
        {
            if (DefaultKey.Equals(dbInf))
            {
                lock (m_dbFactoryMgr)
                {
                    if (!m_dbFactoryMgr.ContainsKey(DefaultKey))
                    {
                        m_dbFactoryMgr.Add(DefaultKey, BuildDBFactory());
                    }
                }
                return m_dbFactoryMgr[DefaultKey];
            }
            else
            {
                throw new NotImplementedException();
            }
        }
        public static IDBFactory BuildDBFactory(){
            //return new DBFactory();
            string[]inf=ConnectionString.Split(',');
            if (inf.Length < 1)
                throw new Exception("数据库集配置错误.");
            return Instance<IDBFactory>(inf[0], inf[1]);
        }
        public static T Instance<T>(string assembly, string type)
        {
            if (string.IsNullOrEmpty(type)) throw new ArgumentException("type:参数不能为空!");

            string path = AppDomain.CurrentDomain.BaseDirectory+"bin\\";
            //1、获取有效的程序集
            Assembly mAssembly = string.IsNullOrEmpty(assembly) ? Assembly.GetCallingAssembly() : Assembly.Load(assembly);
            var t = (T)mAssembly.CreateInstance(type);
            return t;
        }
        public void Dispose()
        {
            lock (m_dbFactoryMgr)
            {
                foreach(var v in m_dbFactoryMgr)
                {
                    m_dbFactoryMgr[ v.Key] = null;
                }
                m_dbFactoryMgr.Clear();
            }
        }
    }
}
