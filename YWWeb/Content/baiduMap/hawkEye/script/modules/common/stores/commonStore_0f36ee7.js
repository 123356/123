define('script/modules/common/stores/commonStore', function(require, exports, module) {

  /**
   * @file 公共Reflux Store
   * @author 崔健 cuijian03@baidu.com 2016.08.20
   */
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
      value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _actionsCommonAction = require('script/modules/common/actions/commonAction');
  
  var _actionsCommonAction2 = _interopRequireDefault(_actionsCommonAction);
  
  var _commonUrls = require('script/common/urls');
  
  var _commonUrls2 = _interopRequireDefault(_commonUrls);
  
  var CommonStore = Reflux.createStore({
      listenables: [_actionsCommonAction2['default']],
      data: {
          // 当前标签页 0为轨迹监控，1为终端管理
          currentIndex: 0
      },
      /**
       * 响应Action switchtab，变更页签
       *
       * @param {number} index 要变更到的tab
       */
      onSwitchtab: function onSwitchtab(index) {
          this.trigger('switchtab', index);
      }
  });
  
  exports['default'] = CommonStore;
  module.exports = exports['default'];
  //# sourceMappingURL=/script/modules/common/stores/commonStore.js.map
  

});
