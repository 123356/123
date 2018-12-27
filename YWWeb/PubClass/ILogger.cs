using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YWWeb.PubClass
{
    public interface ILogger
    {
        void WriteError(string title, string function, string message);
    }
}
