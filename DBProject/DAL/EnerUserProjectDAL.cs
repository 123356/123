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
        public IList<t_EE_EnerUserProject> DeleteEnergyNode(int parent_id, int child_id, int unit_id)

        {
            IList<t_EE_EnerUserProject> data = new List<t_EE_EnerUserProject>();
            try
            {
                data = _dbFactory.enerUserProject.DeleteEnergyNode(parent_id, child_id, unit_id);
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

        public IList<t_EE_CircuitInfoEnerType> setCidEneeruseType(t_V_EnerProjectType data)

        {
            IList<t_EE_CircuitInfoEnerType> list = new List<t_EE_CircuitInfoEnerType>();
            if (data.addCid == null ) {
                return list;
            }
            try
            {
                list = _dbFactory.enerUserProject.getCidEneeruseType(data);

                var add = data.addCid.Split(',');
                string addcid = $",{data.addCid},";
                if (data.item_type == 1)
                {
                    for (int a = 0; a < list.Count(); a++)
                    {
                        if (addcid.Contains($",{list[a].PID}-{list[a].CID},"))
                        {
                            //该电表没有这个区域ID
                            if (list[a].ener_use_type == null || !list[a].ener_use_type.Contains($",{data.ID},"))
                            {
                                list[a].ener_use_type += $",{data.ID},";
                            }
                        }
                        else
                        {
                            //该点表有区域ID  但是未绑定电表
                            if (list[a].ener_use_type != null && list[a].ener_use_type.Contains($",{data.ID},"))
                            {
                                var str = $",{data.ID},";
                                //list[a].ener_use_type = list[a].ener_use_type.Remove(list[a].ener_use_type.IndexOf(str), str.Length);
                            }
                        }
                    }
                }
                else
                {
                    for (int a = 0; a < list.Count(); a++)
                    {
                        if (addcid.Contains($",{list[a].PID}-{list[a].CID},"))
                        {
                            //该电表没有这个区域ID
                            if (list[a].ener_use_type_area == null || !list[a].ener_use_type_area.Contains($",{data.ID},"))
                            {
                                list[a].ener_use_type_area += $",{data.ID},";
                            }
                        }
                        else
                        {
                            //该点表有区域ID  但是未绑定电表
                            if (list[a].ener_use_type_area != null && list[a].ener_use_type_area.Contains($",{data.ID},"))
                            {
                                var str = $",{data.ID},";
                                //list[a].ener_use_type = list[a].ener_use_type.Remove(list[a].ener_use_type.IndexOf(str), str.Length);
                            }
                        }
                    }
                }

                list = _dbFactory.enerUserProject.setCidEneeruseType(list);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return list;
        }


    }
}