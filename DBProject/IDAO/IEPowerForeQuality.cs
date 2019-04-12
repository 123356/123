using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IEPowerForeQuality : IDAOBase, IDisposable
    {
        IList<t_EE_PowerForeQuality> ForeThanQuality();
        IList<t_EE_PowerForeQuality> ForeThanQuality123(DateTime date);

    }
}
