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
        public IList<t_V_EnerPower> GetElectricityToDay(string pid, string cid)
        {
            IList<t_V_EnerPower> data = new List<t_V_EnerPower>();
            try
            {
                data = _dbFactory.venerProjectType.GetElectricityToDay(pid, cid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        
        public IList<t_V_EnerPower> GetElectricityToMonth(string pid, string cid)
        {
            IList<t_V_EnerPower> data = new List<t_V_EnerPower>();
            try
            {
                data = _dbFactory.venerProjectType.GetElectricityToMonth(pid, cid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }







        public IList<t_V_EnerProjectType> PidCidGetArea(int pid, int cid)
        {
            IList<t_V_EnerProjectType> data = new List<t_V_EnerProjectType>();
            IList<t_V_EnerProjectType> res = new List<t_V_EnerProjectType>();
            try
            {
                data = _dbFactory.venerProjectType.PidCidGetArea(pid, cid);


                data.ToList().Sort(delegate (t_V_EnerProjectType x, t_V_EnerProjectType y)
                {
                    return y.addCid.Length.CompareTo(x.addCid.Length);
                });


                for (var a = 0; a < data.Count(); a++) {
                    var arr = data[a].addCid.Split(',');

                    for (var b = 0; b < arr.Count(); b++)
                    {
                        if (arr[b] == $"{pid}-{cid}") {
                            res.Add(data[a]);
                            return res;
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return res;
        }


    }
}