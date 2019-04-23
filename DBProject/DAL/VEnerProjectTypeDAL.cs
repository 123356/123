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
        public IList<t_V_EnerPower> GetElectricityToDay(string pid, string cid,DateTime time)
        {
            IList<t_V_EnerPower> data = new List<t_V_EnerPower>();
            try
            {
                data = _dbFactory.venerProjectType.GetElectricityToDay(pid, cid,time);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_V_EnerPower> GetElectricityToMonth(string pid, string cid,DateTime time)
        {
            IList<t_V_EnerPower> data = new List<t_V_EnerPower>();
            try
            {
                data = _dbFactory.venerProjectType.GetElectricityToMonth(pid, cid, time);
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
        public List<t_V_EnerProjectTypeTree> GetEnergyTreePower(int UnitID, int ItemType, string UnitName,DateTime time)
        {
            IList<t_V_EnerProjectType> list;

            List<t_V_EnerProjectTypeTree> tree = new List<t_V_EnerProjectTypeTree>();
            try
            {
                list = _dbFactory.venerProjectType.GetEnergyData(UnitID, ItemType, UnitName);

                string all = "";

                for (int a = 0; a < list.Count(); a++)
                {
                    if (!string.IsNullOrEmpty(list[a].addCid))
                        all += list[a].addCid + ",";
                    if (!string.IsNullOrEmpty(list[a].delCid))
                        all += list[a].delCid + ",";
                }

                if (all.Length > 1)
                {
                    all = all.Substring(0, all.Length - 1);
                }
                else
                {
                    return new List<t_V_EnerProjectTypeTree>();
                }

                string[] arr;
                string pid = "", cid = "";
                arr = all.Split(',');

                for (int a = 0; a < arr.Count(); a++)
                {
                    var arr1 = arr[a].Split('-');
                    pid += arr1[0] + ',';
                    cid += arr1[1] + ',';
                }

                pid = string.Join(",", pid.Substring(0, pid.Length - 1).Split(',').Distinct());
                cid = string.Join(",", cid.Substring(0, cid.Length - 1).Split(',').Distinct());

                IList<IDAO.Models.t_V_EnerPower> power = DAL.VEnerProjectTypeDAL.getInstance().GetElectricityToDay(pid, cid,time);

                for (int a = 0; a < list.Count(); a++)
                {
                    decimal use = 0;
                    decimal need = 0;
                    for (int b = 0; b < power.Count(); b++)
                    {
                        if (power[b].ener_use_type.Contains($",{list[a].child_id},"))
                        {
                            use += power[b].UsePower;
                            need += power[b].NeedPower;
                        }
                    }
                    list[a].UsePower = use;
                    list[a].NeedPower = need;
                }

                GetEnergyDataToTree(list, tree, 0);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return tree;
        }
        public IList<t_V_EnerProjectType> DefaultNode(int UnitID, int ItemType)
        {
            IList<t_V_EnerProjectType> data = new List<t_V_EnerProjectType>();
            try
            {
                data = _dbFactory.venerProjectType.DefaultNode(UnitID, ItemType);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        public void GetEnergyDataToTree(IList<t_V_EnerProjectType> list,List<t_V_EnerProjectTypeTree> Children,int child_id)
        {
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
    }
}