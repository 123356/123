var vm = new Vue({})
//权限操作按钮
function getUserBtnAPI(url) {
    return vm.$http({
        url: '/SysInfo/UserButtonList2',
        method: 'POST',
        body: {
            CurrUrl: url
        }
    })
}
//三级菜单
function getThirdMenuInfoAPI(data) {
    return vm.$http({
        url: '/Home/GetThirdMenuInfo2',
        method: 'POST',
        body: data
    })
}
//组织区域ItemType2/用电分项树ItemType1
function getEnergyTreeAPI(data) {
    return vm.$http({
        url: '/energyManage/EMSetting/GetEnergyTree',
        method: 'POST',
        body:data
    })
}
//标签下拉框
function getLabelListAPI(data) {
    return vm.$http({
        url: '/ReportForms/GetLabelList',
        method: 'POST',
        body: data
    })
}
//能源类型下拉框
function getCollectDevTypeListAPI() {
    return vm.$http({
        url: '/energyManage/EMHome/GetCollectDevTypeList',
        method: 'GET',
    })
}
//单位下拉框
function getUnitComobxListAPI() {
    return vm.$http({
        url: '/energyManage/EMHome/GetUnitComobxList',
        method: 'GET',
    })
}
//设备下拉框
function getDeviceComboxAPI(data) {
    return vm.$http({
        url: '/energyManage/EMHome/GetDeviceCombox',
        method: 'POST',
        body: data
    })
}
//站室下拉框
function getBindPDRInfoAPI() {
    return vm.$http({
        url: '/BaseInfo/BindPDRInfo?showall=',
        method: 'POST',
    })
}



//建筑能耗报表
function getBuildReportAPI(data) {
    return vm.$http({
        url: '/ReportForms/GetItemFrom',
        method: 'POST',
        body: data
    })
}
