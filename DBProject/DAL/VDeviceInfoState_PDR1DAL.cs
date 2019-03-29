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
    public class VDeviceInfoState_PDR1DAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
  

        static VDeviceInfoState_PDR1DAL _DataDal;
        static readonly object _loker = new object();

        public static VDeviceInfoState_PDR1DAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new VDeviceInfoState_PDR1DAL();
                }
            }

            return _DataDal;
        }

        
        public IList<t_V_CIDTree> GetCidTree(int UnitID,string UnitName, string PDRList)
        {
            IList<t_V_DeviceInfoState_PDR1> list = new List<t_V_DeviceInfoState_PDR1>();

            IList<t_V_CIDTree> tree = new List<t_V_CIDTree>();

            try
            {
                list = _dbFactory.deviceInfoState_PDR1.GetCidTree(UnitID, UnitName, PDRList);
                int pid = -1, cid = -1, did = -1;
                string uid = "0";

                if (PDRList.Contains(',')) {
                    uid = UnitID + "_u";
                    t_V_CIDTree u = new t_V_CIDTree();
                    u.pId = "0";
                    u.id = uid;
                    u.name = UnitName;
                    tree.Add(u);
                }

                for (var a= 0; a < list.Count(); a++)
                {
                    if (pid != list[a].PID) {
                        pid = list[a].PID;
                        t_V_CIDTree t = new t_V_CIDTree();
                        t.pId = uid;
                        t.id = list[a].PID+"_p";
                        t.name = list[a].PName;
                        tree.Add(t);
                    }
                    if (list[a].DID != did)
                    {
                        did = list[a].DID;
                        t_V_CIDTree t = new t_V_CIDTree();
                        t.pId = list[a].PID + "_p";
                        t.id = list[a].DID + "_d";
                        t.name = list[a].DName;
                        tree.Add(t);
                    }else  if (list[a].CID != cid)
                    {
                        cid = list[a].CID;
                        t_V_CIDTree t = new t_V_CIDTree();
                        t.pId = list[a].DID + "_d";
                        t.id = list[a].CID + "_c";
                        t.name = list[a].CName;
                        tree.Add(t);
                    }



                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return tree;
           
        }
    }
}