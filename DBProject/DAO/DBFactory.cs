﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO;

namespace DAO
{
    public class DBFactory : IDAO.IDBFactory
    {
        public IHisData hisData =>  new HisDataDBContext();

        public IRoleRight roleRight =>  new RoleRightDBContext();

        public IDeviceType deviceType =>  new DeviceTypeDBContext();

        public IValueType valueType =>  new ValueTypeDBContext();

        public IVRealTimeData vRealTimeData =>  new VRealTimeDataDBContext();

        public IVHisData vHisData =>  new VHisDataDBContext();

        public IModule module =>  new ModuleDBContext();

        public IAlarmTable_en alarmTable_en =>  new AlarmTable_enDBContext();

        public IUserInfo userInf =>  new UserInfoDBContext();

        public IEnerUserProject enerUserProject =>  new EnerUserProjectDBContext();

        public IUnit unit => new UnitDBContext();

        public IVDeviceInfoState_PDR1 deviceInfoState_PDR1 => new VDeviceInfoState_PDR1DBContext();

		public IEnerUserType enerUserType => new EnerUserTypeDBContext();
        
        public IEneryOverview eneryOverView => new EneryOverviewDBContext();

        public IBudget budget => new BudgetDBContext();

        public IenTypeConfig typeconfig => new EnTypeConfigDBContext();

        public ICollecDevType collecdevtype => new CollecDevTypeDBContext();
        public IVEnerProjectType venerProjectType => new VEnerProjectTypeDBContext();

        public ICircuitInfo circuitinfo => new CircuitInfoDBContext();

        public IExEnergy exEnergy => new ExEnergyDBContext();

        public IYearBudget yearBudget => new YearBudgetDBContext();

        public ICollTypeBudget collecTypeBudget => new CollTypeBudgetDBContext();

        public IEneryUsreBudget eneryUserBudget => new EneryUsreBudgetDBContext();

        public IDepartmentalApportionment depar => new DepartmentalApportionmentContext();

        public IPDRInfo pdrInfo => new PDRInfoDBContext();

        public IPriceEnery priceEnery => new PriceEneryDBContext();

	    public IPointsInfo PointsInfo => new PointsInfoDBContext();

        public ILookEneryView LookEnery => new LookEneryViewDBContext();

        public IEnerySelectView enerySelectView => new EnerySelectViewDBContext();

        public IDeviceInfo deviceInfo => new DeviceInfoDBContext();

        public IElementDevice elementDevice => new ElementDeviceDBContext();

        public IEneryReportFrom eneryReportFrom => new EneryReportFromDBContext();

        public IAlarmConfig pueError => new AlarmConfigDBContext();
        public IEnergyAnnConfig energyAnnConfig => new EnergyAnnConfigDBContext();

        public IEPowerForeQuality powerForeQuality => new PowerForeQualityDBContext();

        public IElecPrice elecPrice => new ElecPriceDBContext();

        public IPowerFore powerFore => new PowerForeDBContext();
        public IWeather weather => new WeatherDBContext();

        public Isetting_cfg setting_Cfg => new setting_cfgDBContext();
    }
}
