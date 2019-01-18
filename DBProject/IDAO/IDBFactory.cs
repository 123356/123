using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IDBFactory
    {
        IHisData hisData { get; }
        IRoleRight roleRight { get; }
        IDeviceType deviceType { get; }
        IValueType valueType { get; }
        IVRealTimeData vRealTimeData { get; }
        IVHisData vHisData { get; }
        IModule module { get; }
        IAlarmTable_en alarmTable_en { get; }
        IUserInfo userInf { get; }
        IEnerUserProject enerUserProject { get; }
        IUnit unit { get; }
        IVDeviceInfoState_PDR1 deviceInfoState_PDR1 { get; }
		IEnerUserType enerUserType { get; }
        IEneryOverview eneryOverView { get; }
        IBudget budget { get; }
        IenTypeConfig typeconfig { get; }

        ICollecDevType collecdevtype { get; }

		IVEnerProjectType venerProjectType { get; }

        ICircuitInfo circuitinfo { get; }

        IExEnergy exEnergy { get; }

        IYearBudget yearBudget { get; }

        ICollTypeBudget collecTypeBudget { get; }

        IEneryUsreBudget eneryUserBudget { get; }

        IDepartmentalApportionment depar { get; }

        IPDRInfo pdrInfo { get; }

        IPriceEnery priceEnery { get; }
    }
}
