using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IEnergyAnnConfig:IDAOBase,IDisposable
    {
        t_EE_EnergyAnnConfig GetConfigList(int uid,int userid);
        t_EE_EnergyAnnConfig GetConfigByID(int id);
        int Add(t_EE_EnergyAnnConfig model);
        int Update(t_EE_EnergyAnnConfig model);
        int Delete(int id);

    }
}
