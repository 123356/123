using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class AddAll
    {
        public string dayAll;
        public string monAll;

        public AddAll(double dayAll, double monAll)
        {
            // TODO: Complete member initialization
            if (dayAll > 0)
            {
                this.dayAll = dayAll+"";
            }
            else
            {
                this.dayAll =  "--";
            }

            if (monAll > 0)
            {
                this.monAll = monAll+"";
            }
            else
            {
                this.monAll = "--";
            }
        }
    }
}
