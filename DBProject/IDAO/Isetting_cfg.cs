using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface Isetting_cfg : IDAOBase, IDisposable
    {
        IList<t_sys_setting_cfg> getSettingtList(int type, out int total, int rows, int page);
        int AddSetting(t_sys_setting_cfg model);
        int UpdateSetting(t_sys_setting_cfg model);
        int DeteleSetting(int id);
        t_sys_setting_cfg GetModelByID(int id);
        t_sys_setting_cfg GetModelByType(int type);

    }
}
