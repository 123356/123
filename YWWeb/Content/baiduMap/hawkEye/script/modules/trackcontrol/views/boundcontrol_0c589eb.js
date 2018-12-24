define('script/modules/trackcontrol/views/boundcontrol', function(require, exports, module) {

  /**
   * @file 控制是否按范围显示entity的控件 Reflux View
   * @author 崔健 cuijian03@baidu.com 2017.03.18
   */
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
      value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _react = require('components/react/react');
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reactDom = require('components/react-dom/react-dom');
  
  var _storesTrackStore = require('script/modules/trackcontrol/stores/trackStore');
  
  var _storesTrackStore2 = _interopRequireDefault(_storesTrackStore);
  
  var _actionsTrackAction = require('script/modules/trackcontrol/actions/trackAction');
  
  var _actionsTrackAction2 = _interopRequireDefault(_actionsTrackAction);
  
  var _commonStoresCommonStore = require('script/modules/common/stores/commonStore');
  
  var _commonStoresCommonStore2 = _interopRequireDefault(_commonStoresCommonStore);
  
  var Boundcontrol = _react2['default'].createClass({
      displayName: 'Boundcontrol',
  
      getInitialState: function getInitialState() {
          return {
              // 页签编码 0为实时监控 1为轨迹查询
              tabIndex: 0,
              // 父容器可见性
              parentVisible: {},
              // 是否开启
              boundSwitch: 'boundOff',
              // 当前视野设备的数量
              boundTotal: 0,
              // 文字描述
              describe: '当前视野设备数'
          };
      },
      componentDidMount: function componentDidMount() {
          _storesTrackStore2['default'].listen(this.onStatusChange);
          _commonStoresCommonStore2['default'].listen(this.onStatusChange);
      },
      onStatusChange: function onStatusChange(type, data) {
          switch (type) {
              case 'switchmanagetab':
                  this.listenSwitchmanageTab(data);
                  break;
              case 'switchtab':
                  this.listenSwitchTab(data);
                  break;
              case 'boundsearchentitytotal':
                  this.listenBoundSearchEntityTotal(data);
                  break;
              case 'boundsearchDec':
                  this.listenBoundsearchDec(data);
                  break;
          }
      },
  
      /**
       * 响应Store boundsearchDec事件，设置蚊子描述
       *
       * @param {string} data 文字描述
       */
      listenBoundsearchDec: function listenBoundsearchDec(data) {
          this.setState({ describe: data });
      },
  
      /**
       * 响应Store boundsearchentitytotal事件，设置当前视野entity数量
       *
       * @param {number} data entity total数量
       */
      listenBoundSearchEntityTotal: function listenBoundSearchEntityTotal(data) {
          this.setState({ boundTotal: data });
      },
  
      /**
       * 响应Store switchmanagetab事件，设置标签页
       *
       * @param {number} data 标签页标识
       */
      listenSwitchmanageTab: function listenSwitchmanageTab(data) {
          this.setState({ tabIndex: data });
      },
  
      /**
       * 响应Store list事件，设置标签页
       *
       * @param {nubmer} data 标签页标识
       */
      listenSwitchTab: function listenSwitchTab(data) {
          if (data === 0) {
              this.setState({ parentVisible: {} });
          } else {
              this.setState({ parentVisible: { visibility: 'inherit' } });
          }
      },
  
      /**
       * DOM操作回调，切换设备bound展示的开关
       *
       * @param {Object} event 事件对象
       */
      handleBoundSwitch: function handleBoundSwitch(event) {
          var that = this;
          if (that.state.boundSwitch === 'boundOn') {
              that.setState({ boundSwitch: 'boundOff' });
              _actionsTrackAction2['default'].switchboundsearch(false);
          } else {
              that.setState({ boundSwitch: 'boundOn' });
              _actionsTrackAction2['default'].switchboundsearch(true);
          }
      },
  
      render: function render() {
          var tabIndex = this.state.tabIndex;
          var parentVisible = this.state.parentVisible;
          var boundSwitch = this.state.boundSwitch;
          var handleBoundSwitch = this.handleBoundSwitch;
          var boundTotal = this.state.boundTotal;
          var describe = this.state.describe;
          return _react2['default'].createElement(
              'div',
              { className: tabIndex === 1 ? 'boundcontrol hidden' : 'boundcontrol visible', style: parentVisible },
              _react2['default'].createElement(
                  'div',
                  { className: 'boundsearch_title' },
                  '全部显示'
              ),
              _react2['default'].createElement('div', { className: boundSwitch, onClick: handleBoundSwitch }),
              _react2['default'].createElement(
                  'div',
                  { className: 'boundsearch_total' },
                  describe,
                  ':',
                  boundTotal
              )
          );
      }
  });
  
  exports['default'] = Boundcontrol;
  module.exports = exports['default'];
  //# sourceMappingURL=/script/modules/trackcontrol/views/boundcontrol.js.map
  

});
