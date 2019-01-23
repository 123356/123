using System;
using IDAO;
using IDAO.InterfaceCache;

namespace DAOMongoDB
{
    public class DBFactory : IDAO.IDBFactory
    {
        public IHisData hisData => throw new NotImplementedException();

        public IRoleRight roleRight => throw new NotImplementedException();

        public IDeviceType deviceType => throw new NotImplementedException();

        public IValueType valueType => throw new NotImplementedException();

        public IVRealTimeData vRealTimeData => throw new NotImplementedException();

        public IVHisData vHisData => throw new NotImplementedException();

        public IModule module => throw new NotImplementedException();

        public IAlarmTable_en alarmTable_en => throw new NotImplementedException();

        public IUserInfo userInf => throw new NotImplementedException();

        public IEnerUserProject enerUserProject => throw new NotImplementedException();

        public IUnit unit => throw new NotImplementedException();

        public IVDeviceInfoState_PDR1 deviceInfoState_PDR1 => throw new NotImplementedException();

        public IEnerUserType enerUserType => throw new NotImplementedException();

        public IEneryOverview eneryOverView => throw new NotImplementedException();

        public IBudget budget => throw new NotImplementedException();

        public IenTypeConfig typeconfig => throw new NotImplementedException();

        public ICollecDevType collecdevtype => throw new NotImplementedException();

        public IVEnerProjectType venerProjectType => throw new NotImplementedException();

        public ICircuitInfo circuitinfo => throw new NotImplementedException();

        public IExEnergy exEnergy => throw new NotImplementedException();

        public IYearBudget yearBudget => throw new NotImplementedException();

        public ICollTypeBudget collecTypeBudget => throw new NotImplementedException();

        public IEneryUsreBudget eneryUserBudget => throw new NotImplementedException();

        public IDepartmentalApportionment depar => throw new NotImplementedException();

        public IPDRInfo pdrInfo => throw new NotImplementedException();

        public IPriceEnery priceEnery => throw new NotImplementedException();
    }
}
