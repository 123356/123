using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IModule : IDAOBase, IDisposable
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="moduleIDS">1,2,3,4...</param>
        /// <returns></returns>
        IList<t_CM_Module> GetModules(string moduleIDS);
    }
}
