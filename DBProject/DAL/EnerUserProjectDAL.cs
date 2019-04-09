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
    public class EnerUserProjectDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
        static EnerUserProjectDAL _DataDal;
        static readonly object _loker = new object();
        public static EnerUserProjectDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EnerUserProjectDAL();
                }
            }
            return _DataDal;
        }
        public IList<t_EE_EnerUserProject> addTreeNode(t_V_EnerProjectType data)

        {
            IList<t_EE_EnerUserProject> list = new List<t_EE_EnerUserProject>();
            try
            {
                list = _dbFactory.enerUserProject.addTreeNode(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return list;
        }
        public IList<t_EE_EnerUserProject> updataTreeNode(t_V_EnerProjectType data)

        {
            IList<t_EE_EnerUserProject> list = new List<t_EE_EnerUserProject>();
            try
            {
                list = _dbFactory.enerUserProject.updataTreeNode(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return list;
        }
        public IList<t_EE_EnerUserProject> updataTreeNodeId(t_V_EnerProjectType data)

        {
            IList<t_EE_EnerUserProject> list = new List<t_EE_EnerUserProject>();
            try
            {
                list = _dbFactory.enerUserProject.updataTreeNodeId(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return list;
        }
        public IList<t_EE_EnerUserProject> DeleteSupervisor(int parent_id, int child_id, int unit_id)

        {
            IList<t_EE_EnerUserProject> data = new List<t_EE_EnerUserProject>();
            try
            {
                data = _dbFactory.enerUserProject.DeleteSupervisor(parent_id, child_id, unit_id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_EE_EnerUserProject> GetCidByUidAndIDepID(int uid, int depid)
        {
            IList<t_EE_EnerUserProject> data = new List<t_EE_EnerUserProject>();
            try
            {
                data = _dbFactory.enerUserProject.GetCidByUidAndIDepID(uid, depid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_EE_EnerUserProject> GetDepIDByParID(int uid, int parid,int isP)
        {
            IList<t_EE_EnerUserProject> data = new List<t_EE_EnerUserProject>();
            try
            {
                data = _dbFactory.enerUserProject.GetDepIDByParID(uid, parid, isP);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
    }
}