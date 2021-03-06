﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO;
using DAO;
using IDAO.Models;

namespace DAL
{
    public class VRealTimeDataDAL
    {

        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static VRealTimeDataDAL _DataDal;
        static readonly object _loker = new object();
        public static VRealTimeDataDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                    {
                        _DataDal = new VRealTimeDataDAL();
                    }
                }
            }
            return _DataDal;
        }

              
       
        public IList<t_V_RealTimeTab> GetTagIdDetail(int pageSize, int nPage, int pid, int cid, int tdid, int did)
        {
            IList<t_V_RealTimeTab> data = new List<t_V_RealTimeTab>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            try
            {
                data = _dbFactory.vRealTimeData.GetTagIdDetail(pageSize, nPage, pid, cid, tdid, did);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }


        public IList<t_V_RealTimePV> GetTagIdPV(int pid, string tages)
        {
            IList<t_V_RealTimePV> data = new List<t_V_RealTimePV>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            try
            {
                data = _dbFactory.vRealTimeData.GetTagIdPV(pid, tages);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }


        public IList<t_V_RealTimeData1> GetRealTimeData1(int pageSize, int nPage,string dataTypeIDs,bool dataTypeInvert, int pid, int cid, int tdid, int did)
        {
            IList<t_V_RealTimeData1> data = new List<t_V_RealTimeData1>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            try
            {
                data = _dbFactory.vRealTimeData.GetRealTimeData1(pageSize, nPage, pid,dataTypeIDs,dataTypeInvert, cid, tdid, did);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_RealTimeData> GetRealTimeData_linq(int pageSize, int nPage, int pid, int cid, int tdid, int did)
        {
            IList<t_V_RealTimeData> data = new List<t_V_RealTimeData>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            try
            {
                data = _dbFactory.vRealTimeData.GetRealTimeData_linq(pageSize, nPage, pid, cid, tdid, did);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

    }
}