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


        public IList<t_V_DeviceInfoState_PDR1> GetCidData(int UnitID, string UnitName, string PDRList) {

            IList<t_V_DeviceInfoState_PDR1> list ;
            try
            {
                list = _dbFactory.deviceInfoState_PDR1.GetCidTree(UnitID, UnitName, PDRList);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return list;
        }
        

        public IList<t_V_CidTree> GetCidTree(int UnitID,string UnitName, string PDRList)
        {
            IList<t_V_DeviceInfoState_PDR1> list = new List<t_V_DeviceInfoState_PDR1>();

            IList<t_V_CidTree> tree = new List<t_V_CidTree>();

            try
            {
                int id = 0;
                list = _dbFactory.deviceInfoState_PDR1.GetCidTree(UnitID, UnitName, PDRList);
                IList<t_V_CidTree> obj ;
                if (PDRList.Contains(','))
                {
                    t_V_CidTree o = new t_V_CidTree();
                    o.name = UnitName;
                    o.Children = new List<t_V_CidTree>();
                    o.id = ""+id++;
                    tree.Add(o);
                    obj = o.Children;
                }
                else
                {
                     obj = tree;
                }
                string pids = "", cids = "", dids = "";

                for (int a = 0; a < list.Count(); a++)
                {

                    if (!pids.Contains($",{ list[a].PID},"))
                    {
                        pids += $",{ list[a].PID},";
                        t_V_CidTree p = new t_V_CidTree();
                        p.PID = list[a].PID;
                        p.name = list[a].PName;
                        p.Children = new List<t_V_CidTree>();
                        p.id = "" + id++;
                        obj.Add(p);


                        for (int b = 0; b < list.Count(); b++)
                        {
                            if (list[a].PID == list[b].PID &&  !dids.Contains($",{list[a].PID}-{list[b].DID},"))
                            {
                                dids += $",{list[a].PID}-{list[b].DID},";
                                t_V_CidTree d = new t_V_CidTree();
                                d.PID = list[b].PID;
                                d.DID = list[b].DID;
                                d.name = list[b].DName;
                                d.Children = new List<t_V_CidTree>();
                                d.id = ""+id++;

                                p.Children.Add(d);




                                for (int c = 0; c < list.Count(); c++)
                                {
                                    if (list[c].PID == list[a].PID && list[c].DID == list[b].DID && !cids.Contains($",{list[b].PID}-{list[b].DID}-{list[c].CID}," ))
                                    {
                                        cids += $",{list[b].PID}-{list[b].DID}-{list[c].CID},";
                                        t_V_CidTree cc = new t_V_CidTree();
                                        cc.PID = list[c].PID;
                                        cc.DID = list[c].DID;
                                        cc.CID = list[c].CID;
                                        cc.name = list[c].CName;
                                        cc.id = $"{list[c].PID}-{list[c].CID}";
                                        d.Children.Add(cc);

                                    }
                                }
                            }
                        }
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