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
        static AlarmTable_enDAL _DataDal;
        public static AlarmTable_enDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                _DataDal = new AlarmTable_enDAL();
                _DataDal.userQueryAlarmCountInf = new QueryAlarmCount(_DataDal.queryAlarmCountInf);
            }

            return _DataDal;
        }



        delegate int QueryAlarmCount(/*string pdrlist*/);
        QueryAlarmCount userQueryAlarmCountInf;
        DateTime m_dtAlarmCount ;
        private int queryAlarmCountInf(/*string pdrlist*/)
        {
            if (null != m_dtAlarmCount && (DateTime.Now - m_dtAlarmCount).TotalSeconds < 1)
                return 0;

            m_dtAlarmCount = DateTime.Now;
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
                    List<int> listPid = dbCache.HashKeys<int>(FirstKey);
                    bool containted = false;
                    foreach (var kPid in listPid)//删除没有报警的
                    {
                        containted = false;
                        foreach (AlarmCount model in data)
                        {
                            if (model.PID == kPid)
                            {
                                containted = true;
                                break;
                            }
                        }
                        if (containted)
                        {
                            continue;
                        }
                        else
                        {
                            dbCache.HashDelete(FirstKey, kPid.ToString());
                        }

                    }
                    foreach (AlarmCount model in data)
                    {
                        dbCache.HashSet(FirstKey, model.PID.ToString(), model.Count);
                        //if (pdrIDS.Contains(model.PID))
                        //    total += model.Count;
                    }
                }
                else
                {
                    dbCache.KeyDelete(FirstKey);
                }

                dbCache = null;

                data.Clear();
                data = null;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
            }
            return total;
        }
        //实时数据项包含的类型
        public int GetAlarmCount(string pdrList)
        {
            IDBCache dbCache = _dbCacheFactory.DefautCache;

            try
            {
                int total = 0;
                if (dbCache.KeyExists(FirstKey))
                {
                    string[] pids = pdrList.Split(',');
                    IList<string> fields = dbCache.HashKeys<string>(FirstKey);
                    var fks = fields.Where(t => pids.Contains(t));
                    IList<int> alarmCount = dbCache.HashGet<int>(FirstKey, fks.ToList<string>());
                    total=alarmCount.Sum();
                    //foreach (var v in pids)
                    //{
                    //    if (dbCache.HashExists(FirstKey, v))
                    //        total += dbCache.HashGet<int>(FirstKey, v);
                    //}
                }
                userQueryAlarmCountInf.BeginInvoke( null, null);

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