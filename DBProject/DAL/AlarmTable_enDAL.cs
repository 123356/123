using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO;
using DAO;
using IDAO.Models;
using DAL.Models;
using Newtonsoft.Json;
using IDAO.InterfaceCache;

namespace DAL
{
    public class AlarmTable_enDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
        static readonly string FirstKey = "alarm_en_count";
        static readonly object _loker = new object();
        static AlarmTable_enDAL _DataDal;
        public static AlarmTable_enDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                    {
                        _DataDal = new AlarmTable_enDAL();
                        _DataDal.userQueryAlarmCountInf = new QueryAlarmCount(_DataDal.queryAlarmCountInf);
                    }
                }
            }
            return _DataDal;
        }



        delegate int QueryAlarmCount(/*string pdrlist*/);
        QueryAlarmCount userQueryAlarmCountInf;
        DateTime m_dtAlarmCount ;
        private bool m_queryed=false;
        //object _redisLoker = new object();
        private int queryAlarmCountInf(/*string pdrlist*/)
        {
            if (null != m_dtAlarmCount && (DateTime.Now - m_dtAlarmCount).TotalSeconds < 1)
                return 0;
            if (m_queryed)
                return 0;
            m_queryed = true;
            m_dtAlarmCount = DateTime.Now;
            //Loger.LogHelper.Info("queryAlarmCountInf: begin");
            int total = 0;
            //List<int> pdrIDS = new List<int>();
            //if(!string.IsNullOrEmpty(pdrlist))
            //    pdrIDS=pdrlist.Split(',').Select<string, int>(x => Convert.ToInt32(x)).ToList();
            try
            {
                IList<AlarmCount> data;
                //string query = "select COUNT(*) Count, pid from t_AlarmTable_en where AlarmState>0  group by pid ;";//全部更新
                //using (IAlarmTable_en _hisDataDao = new AlarmTable_enDBContext())
                //{
                //    data = (_hisDataDao as IDAOBase).SQLQuery<AlarmCount>(query);
                //}
                data = _dbFactory.alarmTable_en.GetAlarmCount();
                IDBCache dbCache = _dbCacheFactory.DefautCache;
                if (data.Count > 0)
                {
                    //List<int> listPid = null;
                    //lock (_redisLoker)
                    //{
                    //   listPid = dbCache.HashKeys<int>(FirstKey);

                    //}
                    Dictionary<object, object> fields = new Dictionary<object, object>();
                    //bool containted = false;
                    //foreach (var kPid in listPid)//删除没有报警的
                    //{
                    //    containted = false;
                    //    foreach (AlarmCount model in data)
                    //    {
                    //        if (model.PID == kPid)
                    //        {
                    //            containted = true;
                    //            break;
                    //        }
                    //    }
                    //    if (containted)
                    //    {
                    //        continue;
                    //    }
                    //    else
                    //    {
                    //        //dbCache.HashDelete(FirstKey, kPid.ToString());
                    //        //dbCache.HashSet(FirstKey, kPid.ToString(), 0);//不删除，防止读取异常
                    //        fields.Add(kPid, 0);
                    //    }

                    //}
                    foreach (AlarmCount model in data)
                    {
                        //dbCache.HashSet(FirstKey, model.PID.ToString(), model.Count);
                        //if (pdrIDS.Contains(model.PID))
                        //    total += model.Count;
                        fields.Add(model.PID, model.Count);
                    }
                    if (fields.Count > 0)
                    {
                        //lock (_redisLoker)
                        {
                            //dbCache.HashSet(FirstKey, fields);
                            string json = JsonConvert.SerializeObject(fields);
                            dbCache.StringSet(FirstKey,json);
                        }
                    }
                }
                else
                {
                    //dbCache.KeyDelete(FirstKey);
                    Loger.LogHelper.Debug("GetAlarmCount() data.Count():"+ data.Count());
                }

                dbCache = null;

                data.Clear();
                data = null;

            }
            catch (Exception ex)
            {
                //throw ex;
                Loger.LogHelper.Error(ex);
            }
            finally
            {
                m_queryed = false;
            }
            return total;
        }
        //实时数据项包含的类型
        public int GetAlarmCount(string pdrList)
        {
            IDBCache dbCache = _dbCacheFactory.DefautCache;
            userQueryAlarmCountInf.BeginInvoke(null, null);//放前面防止出错后被跳过

            try
            {
                int total = 0;
                //if (dbCache.KeyExists(FirstKey))
                //{
                string[] pids = pdrList.Split(',');
                //IList<string> fields = dbCache.HashKeys<string>(FirstKey);
                //var fks = fields.Where(t => pids.Contains(t));
                //IList<string> alarmCount1 = null;
                //lock (_redisLoker)
                //{
                //    alarmCount1 = dbCache.HashGet<string>(FirstKey, pids.ToList<string>());
                //}
                //IList<int> alarmCount = alarmCount1.Where(t => !string.IsNullOrEmpty(t)).Select(t => Convert.ToInt32(t)).ToList();
                //total = alarmCount.Sum();
                string json =dbCache.StringGet(FirstKey);
                Dictionary<int,int> result=JsonConvert.DeserializeObject<Dictionary<int, int>>(json);
                IList<int> alarmCount = result.Where(t => pids.Contains(t.Key.ToString())).Select(t=> t.Value ).ToList<int>();
                total = alarmCount.Sum();
                //foreach (var v in pids)
                //{
                //    if (dbCache.HashExists(FirstKey, v))
                //        total += dbCache.HashGet<int>(FirstKey, v);
                //}
                //}
                //else
                //{
                //    System.Diagnostics.Debug.WriteLine("dbCache.KeyExists(FirstKey)");
                //}

               return total;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

        public IList<t_AlarmTable_en> GetAlarm_enInf(int minAlarmstate, DateTime? AlarmDateTimeBegin, DateTime? AlarmDateTimeEnd, IList<OrderByCondtion> orderByColumns)
        {
            return _dbFactory.alarmTable_en.GetAlarm_enInf(minAlarmstate,AlarmDateTimeBegin,AlarmDateTimeEnd,orderByColumns);
        }
       
    }
}