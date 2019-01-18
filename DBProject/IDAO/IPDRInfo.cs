﻿using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IPDRInfo:IDAOBase,IDisposable
    {
        IList<t_CM_PDRInfo> GetPDRList(string pids);
    }
}
