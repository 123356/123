﻿using System;
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
    public class VEnerProjectTypeDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
        static VEnerProjectTypeDAL _DataDal;
        static readonly object _loker = new object();
        public static VEnerProjectTypeDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new VEnerProjectTypeDAL();
                }
            }
            return _DataDal;
        }
        public IList<t_V_EnerProjectType> GetTreeData(int unitID, int item_type)
        {
            IList<t_V_EnerProjectType> data = new List<t_V_EnerProjectType>();
            try
            {
                data = _dbFactory.venerProjectType.GetTreeData(unitID, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }


        public IList<t_V_EnerPower> GetTreeData1(int unitID, int item_type)
        {
            IList<t_V_EnerPower> data = new List<t_V_EnerPower>();
            try
            {
                data = _dbFactory.venerProjectType.GetTreeData1(unitID, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        

        public IList<t_V_EnerProjectTypePower> GetCidsToElectricity(string pids, string cids)
        {
            IList<t_V_EnerProjectTypePower> data = new List<t_V_EnerProjectTypePower>();
            try
            {
                data = _dbFactory.venerProjectType.GetCidsToElectricity(pids, cids);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        /// <summary>
        /// 查列历史分项列表
        /// </summary>
        /// <param name="unitID"></param>
        /// <param name="item_type"></param>
        /// <returns></returns>
        public IList<t_V_EnerProjectType> GetHistoryList(int unitID, int item_type)
        {
            IList<t_V_EnerProjectType> data = new List<t_V_EnerProjectType>();
            try
            {
                data = _dbFactory.venerProjectType.GetHistoryList(unitID, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EnerProjectType> UpdateRelationship(int child_id, int parent_id, int unit_id, string unit_head, string unit_note, string addCid, string delCid,int updateTypeID,int unit_area,int unit_people)
        {
            IList<t_V_EnerProjectType> data = new List<t_V_EnerProjectType>();
            try
            {
                data = _dbFactory.venerProjectType.UpdateRelationship(child_id, parent_id, unit_id, unit_head, unit_note, addCid, delCid, updateTypeID, unit_area, unit_people);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EnerProjectType> AddProjectTemplate(int unitID, int item_type)
        {
            IList<t_V_EnerProjectType> data = new List<t_V_EnerProjectType>();
            try
            {
                data = _dbFactory.venerProjectType.AddProjectTemplate(unitID, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EnerProjectTypePower> GetElectrMonth(string pid, string cid)
        {
            IList<t_V_EnerProjectTypePower> data = new List<t_V_EnerProjectTypePower>();
            try
            {
                data = _dbFactory.venerProjectType.GetElectrMonth(pid, cid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        



    }
}