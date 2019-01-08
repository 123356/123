using System.Web.Mvc;

namespace EnergyManage
{
    public class EnergyManageAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "energyManage";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "energyManage_default",
                "energyManage/{controller}/{action}/{id}",
                new {  action = "Index", id = UrlParameter.Optional },
                namespaces: new[] { "EnergyManage.Controllers" }
            );
        }
    }
}