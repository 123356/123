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


        public IList<t_V_EnerProjectType> UpdateRelationship(int child_id, int parent_id, int unit_id, string unit_head, string unit_note, string addCid, string delCid,int updateTypeID)

        {
            IList<t_V_EnerProjectType> data = new List<t_V_EnerProjectType>();
            try
            {
                data = _dbFactory.venerProjectType.UpdateRelationship(child_id, parent_id, unit_id, unit_head, unit_note, addCid, delCid, updateTypeID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

    }
}