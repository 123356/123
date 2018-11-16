using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;

namespace S5001Web.Controllers
{
    public class EnergyController : Controller
    {
        //
        // GET: /Energy/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult testcolor()
        {
            return View();
        }
        //取数1BB1低压受总柜
        public string EntryTable()
        {
            string strsql = "select top 15 * from V_DeviceInfoState_PDR1 where pid=105 and DID=470 and DataTypeID in (2,3,45,47,51) order by DataTypeID";
            List<V_DeviceInfoState_PDR1> list = bll.ExecuteStoreQuery<V_DeviceInfoState_PDR1>(strsql).ToList();
            StringBuilder sblist = new StringBuilder();
            string pv = "";
            int typeid = 0, typeid1 = 0;//当前分类ID,上一次分类id
            sblist.Append("<tr><td colspan=\"4\" class=\"energy_table_title defect_charttitle\"><i></i>1BB1低压受总柜</td></tr>");
            foreach (V_DeviceInfoState_PDR1 model in list)
            {
                pv = model.PV + model.Units;
                if (model.DataTypeID == 51)//功率因素取绝对值
                {
                    double strCashAmt = System.Math.Abs((double)model.PV);//取绝对值
                    strCashAmt = Math.Round(strCashAmt, 3);//保留三位小数
                    pv = strCashAmt + "";
                }
                typeid = (int)model.DataTypeID;
                if (typeid != typeid1)
                {
                    if (typeid1 > 0)
                        sblist.Append("</tr>");
                    sblist.Append("<tr><th>" + model.TypeName + "</th>");
                }
                sblist.Append("<td>" + pv + "</td>");
                typeid1 = typeid;
            }
            sblist.Append("</tr>");
            return sblist.ToString();
        }
    }
}
