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
        public List<t_V_EnerProjectTypeTree> GetEnergyTree(int UnitID, int ItemType,string UnitName)
        {
            IList<t_V_EnerProjectType> list = new List<t_V_EnerProjectType>();


            List<t_V_EnerProjectTypeTree> tree = new List<t_V_EnerProjectTypeTree>();

            try
            {
                list = _dbFactory.venerProjectType.GetEnergyData(UnitID, ItemType, UnitName);
                GetEnergyDataToTree(list,tree,0);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return tree;
        }
        public void GetEnergyDataToTree(IList<t_V_EnerProjectType> list,List<t_V_EnerProjectTypeTree> Children,int child_id)
        {
           // IList<t_V_EnerProjectType>  list1 = list.Where(o => o.parent_id == 0).ToList();
            for (var a = 0; a < list.Count(); a++)
            {
                if (list[a].parent_id == child_id)
                {
                    t_V_EnerProjectTypeTree node = new t_V_EnerProjectTypeTree(list[a]);
                    node.Children = new List<t_V_EnerProjectTypeTree>();
                    Children.Add(node);
                    GetEnergyDataToTree(list, node.Children, list[a].child_id);
                }
            }

        }




        public IList<t_V_EnerProjectType> GetTreeData(int unitId, int item_type)
        {

            IList<t_V_EnerProjectType> list = new List<t_V_EnerProjectType>();
            try
            {
                list = _dbFactory.venerProjectType.GetTreeData(unitId, item_type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return list;
        }

        public IList<t_V_EnerProjectType> SetEnergyTree(int UnitID, int ItemType, string UnitName)
        {
            IList<t_V_EnerProjectType> list = new List<t_V_EnerProjectType>();
            try
            {
                list = _dbFactory.venerProjectType.GetEnergyData(UnitID, ItemType, UnitName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return list;
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


                var dd = data.ToList();
                dd.Sort( ( x,  y)=>
                {
                    if (x.addCid.Length > y.addCid.Length)
                    {
                        return 1;
                    }
                    else if (x.addCid.Length < y.addCid.Length)
                    {
                        return -1;
                    }
                    else {
                        return 0;

                    }
                });

                for (var a = 0; a < dd.Count(); a++) {
                    var arr = dd[a].addCid.Split(',');
                    for (var b = 0; b < arr.Count(); b++)
                    {
                        if (arr[b] == $"{pid}-{cid}") {
                            res.Add(dd[a]);
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