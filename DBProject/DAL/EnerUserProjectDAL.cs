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
        public IList<t_EE_EnerUserProject> AddRelationship(int child_id, int parent_id, int unit_id, string unit_head, string unit_note, string addCid, string delCid)

        {
            IList<t_EE_EnerUserProject> data = new List<t_EE_EnerUserProject>();
            try
            {
                data = _dbFactory.enerUserProject.AddRelationship(child_id, parent_id, unit_id, unit_head, unit_note, addCid, delCid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }





        public IList<t_EE_EnerUserProject> UpdateSupervisor(int oldId, int id, int unit_id)

        {
            IList<t_EE_EnerUserProject> data = new List<t_EE_EnerUserProject>();
            try
            {
                data = _dbFactory.enerUserProject.UpdateSupervisor(oldId, id, unit_id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
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
    }
}