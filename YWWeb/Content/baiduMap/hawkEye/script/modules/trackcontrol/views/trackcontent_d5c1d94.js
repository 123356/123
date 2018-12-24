define('script/modules/trackcontrol/views/trackcontent', function(require, exports, module) {

  /* globals map */
  /* globals BMap */
  /* globals Reflux */
  /* globals Commonfun */
  /* globals mapControl */
  /* eslint-disable fecs-camelcase */
  /* eslint-disable max-len */
  /**
   * @file 轨迹列表和绘制轨迹 Reflux View
   * @author 崔健 cuijian03@baidu.com 2016.08.29
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
  
  var _commonStoresCommonStore = require('script/modules/common/stores/commonStore');
  
  var _commonStoresCommonStore2 = _interopRequireDefault(_commonStoresCommonStore);
  
  var _actionsTrackAction = require('script/modules/trackcontrol/actions/trackAction');
  
  var _actionsTrackAction2 = _interopRequireDefault(_actionsTrackAction);
  
  var _trackpages = require('script/modules/trackcontrol/views/trackpages');
  
  var _trackpages2 = _interopRequireDefault(_trackpages);
  
  var _commonCommonfun = require('script/common/commonfun');
  
  var _commonCommonfun2 = _interopRequireDefault(_commonCommonfun);
  
  var Trackcontent = _react2['default'].createClass({
      displayName: 'Trackcontent',
  
      getInitialState: function getInitialState() {
          return {
              // 轨迹列表
              trackList: [],
              // 当前选中轨迹
              currentTrack: {},
              // 空白entity列表，占位用
              blankEntityList: [],
              // 当前选择的entity名
              currentEntityName: '',
              // 当前选中的entity显示的内容
              currentEntityPrint: '',
              // 是否是第一次点击绘制
              first: true,
              // 当前选中的track的全天完整数据
              currentTrackData: []
          };
      },
      componentDidMount: function componentDidMount() {
          _storesTrackStore2['default'].listen(this.onStatusChange);
          _actionsTrackAction2['default'].tracklist(1);
      },
      onStatusChange: function onStatusChange(type, data) {
          switch (type) {
              case 'tracklist':
                  this.listenTrackList(data);
                  break;
              case 'trackroute':
                  this.listenTrackRoute(data);
                  break;
              case 'trackroutefirst':
                  this.listenTrackRouteFirst(data);
                  break;
              case 'changeTimeline':
                  this.listenChangeTimeLine(data);
                  break;
              case 'getaddress':
                  this.listenGetaddress(data);
                  break;
              case 'triggerselecttrack':
                  this.listenTriggerSelectTrack();
                  break;
  
          }
      },
  
      /**
       * 响应store triggerselecttrack 自动触发点击第一条记录
       *
       */
      listenTriggerSelectTrack: function listenTriggerSelectTrack() {
          var entity_name = this.state.trackList[0].name;
          var entity_print = this.state.trackList[0].print;
          var entity_id = this.state.trackList[0].entity_id;
          this.setState({ currentEntityName: entity_name });
          this.setState({ currentEntityPrint: entity_print });
          _actionsTrackAction2['default'].selecttrack(entity_name, entity_id);
      },
  
      /**
       * 响应Store tracklist事件，初始化历史轨迹列表
       *
       * @param {Object} data 轨迹数据
       */
      listenGetaddress: function listenGetaddress(data) {
          mapControl.setTrackInfoBox(data);
      },
  
      /**
       * 响应store，判断是否是第一次绘制轨迹
       *
       * @param {bool} data 是否第一次绘制
       */
      listenTrackRouteFirst: function listenTrackRouteFirst(data) {
          this.state.first = data;
      },
  
      /**
       * 响应Store tracklist事件，初始化历史轨迹列表
       *
       * @param {Array} data 轨迹数据
       */
      listenTrackList: function listenTrackList(data) {
          this.setState({ trackList: data });
          var tempArray = new Array(10 - data.length);
          tempArray.fill(1);
          this.setState({ blankEntityList: tempArray });
      },
      /**
       * 监听Store trackroute事件，绘制轨迹
       *
       * @param {Array} data 轨迹数据
       */
      listenTrackRoute: function listenTrackRoute(data) {
          var that = this;
          that.setState({
              currentTrackData: data
          });
          that.drawTrack(data);
      },
  
      /**
       * 监听Store changeTimeline事件，修改绘制卡尺事件
       *
       * @param {Object} data 开始和结束时间
       */
      listenChangeTimeLine: function listenChangeTimeLine(data) {
          this.drawTrack(null, data.starttime, data.endtime);
      },
  
      /**
       * view内部，绘制轨迹线路
       *
       * @param {Array} data 轨迹数据 可选
       * @param {number} starttime 时间区间起点 可选
       * @param {number} endtime 时间区间终点 可选
       */
      drawTrack: function drawTrack(data, starttime, endtime) {
          if (!data) {
              data = this.state.currentTrackData;
          }
          var that = this;
          var totalPoints = [];
          var viewportPoints = [];
  
          if (data.length === 0) {
              return;
          }
          if (!starttime) {
              starttime = data[0].loc_time;
          }
          if (!endtime) {
              endtime = data[data.length - 1].loc_time;
          }
          for (var i = 0; i < data.length; i++) {
              if (data[i].loc_time >= starttime && data[i].loc_time <= endtime) {
                  var tempPoint = new BMap.Point(data[i].longitude, data[i].latitude);
                  tempPoint.speed = data[i].speed ? data[i].speed : 0;
                  tempPoint.loc_time = data[i].loc_time;
                  tempPoint.height = data[i].height;
                  tempPoint.radius = data[i].radius;
                  tempPoint.print = that.state.currentEntityPrint;
                  tempPoint.printTime = _commonCommonfun2['default'].getLocalTime(data[i].loc_time);
                  tempPoint.printSpeed = _commonCommonfun2['default'].getSpeed(data[i].speed);
                  tempPoint.lnglat = data[i].longitude.toFixed(2) + ',' + data[i].latitude.toFixed(2);
                  totalPoints.push(tempPoint);
              }
          }
          if (that.state.first) {
              map.setViewport(totalPoints, { margins: [80, 0, 0, 200] });
          }
  
          var updatePointer = function updatePointer() {
              var nextArray = [];
              var ctx = this.canvas.getContext('2d');
              if (!ctx) {
                  return;
              }
              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
              if (totalPoints.length !== 0) {
                  var lines = 1;
                  var lineObj = {};
                  var pixelPart = 0;
                  var pixelPartUnit = 40;
                  for (var i = 0, len = totalPoints.length; i < len - 1; i = i + 1) {
                      var pixel = map.pointToPixel(totalPoints[i]);
                      var nextPixel = map.pointToPixel(totalPoints[i + 1]);
                      pixelPart = pixelPart + Math.pow(Math.pow(nextPixel.x - pixel.x, 2) + Math.pow(nextPixel.y - pixel.y, 2), 0.5);
                      if (pixelPart <= pixelPartUnit) {
                          continue;
                      }
                      pixelPart = 0;
                      ctx.beginPath();
  
                      if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
                          // 箭头一共需要5个点：起点、终点、中心点、箭头端点1、箭头端点2
  
                          var midPixel = new BMap.Pixel((pixel.x + nextPixel.x) / 2, (pixel.y + nextPixel.y) / 2);
  
                          // 起点终点距离
                          var distance = Math.pow(Math.pow(nextPixel.x - pixel.x, 2) + Math.pow(nextPixel.y - pixel.y, 2), 0.5);
                          // 箭头长度
                          var pointerLong = 4;
                          var aPixel = {};
                          var bPixel = {};
                          if (nextPixel.x - pixel.x === 0) {
                              if (nextPixel.y - pixel.y > 0) {
                                  aPixel.x = midPixel.x - pointerLong * Math.pow(0.5, 0.5);
                                  aPixel.y = midPixel.y - pointerLong * Math.pow(0.5, 0.5);
                                  bPixel.x = midPixel.x + pointerLong * Math.pow(0.5, 0.5);
                                  bPixel.y = midPixel.y - pointerLong * Math.pow(0.5, 0.5);
                              } else if (nextPixel.y - pixel.y < 0) {
                                  aPixel.x = midPixel.x - pointerLong * Math.pow(0.5, 0.5);
                                  aPixel.y = midPixel.y + pointerLong * Math.pow(0.5, 0.5);
                                  bPixel.x = midPixel.x + pointerLong * Math.pow(0.5, 0.5);
                                  bPixel.y = midPixel.y + pointerLong * Math.pow(0.5, 0.5);
                              } else {
                                  continue;
                              }
                          } else {
                              var k0 = (-Math.pow(2, 0.5) * distance * pointerLong + 2 * (nextPixel.y - pixel.y) * midPixel.y) / (2 * (nextPixel.x - pixel.x)) + midPixel.x;
                              var k1 = -((nextPixel.y - pixel.y) / (nextPixel.x - pixel.x));
                              var a = Math.pow(k1, 2) + 1;
                              var b = 2 * k1 * (k0 - midPixel.x) - 2 * midPixel.y;
                              var c = Math.pow(k0 - midPixel.x, 2) + Math.pow(midPixel.y, 2) - Math.pow(pointerLong, 2);
  
                              aPixel.y = (-b + Math.pow(b * b - 4 * a * c, 0.5)) / (2 * a);
                              bPixel.y = (-b - Math.pow(b * b - 4 * a * c, 0.5)) / (2 * a);
                              aPixel.x = k1 * aPixel.y + k0;
                              bPixel.x = k1 * bPixel.y + k0;
                          }
                          ctx.moveTo(aPixel.x, aPixel.y);
                          ctx.lineWidth = 2;
                          ctx.strokeStyle = '#eee';
                          ctx.lineTo(midPixel.x, midPixel.y);
                          ctx.lineTo(bPixel.x, bPixel.y);
                          ctx.lineCap = 'round';
                      }
                      if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
                          ctx.stroke();
                      }
                  }
              }
          };
          var updateBack = function updateBack() {
              var nextArray = [];
              var ctx = this.canvas.getContext('2d');
              if (!ctx) {
                  return;
              }
              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
              if (totalPoints.length !== 0) {
                  var lines = 1;
                  var lineObj = {};
  
                  for (var i = 0, len = totalPoints.length; i < len - 1; i++) {
  
                      var pixel = map.pointToPixel(totalPoints[i]);
                      var nextPixel = map.pointToPixel(totalPoints[i + 1]);
                      ctx.beginPath();
  
                      ctx.moveTo(pixel.x, pixel.y);
                      if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
                          // 绘制轨迹的时候绘制两次line，一次是底色，一次是带速度颜色的。目的是实现边框效果
                          ctx.lineWidth = 10;
                          ctx.strokeStyle = '#8b8b89';
                          ctx.lineTo(nextPixel.x, nextPixel.y);
                          ctx.lineCap = 'round';
                      } else {
                          lines = lines + 1;
                          var lineNum = lines;
                          nextArray.push([pixel, nextPixel]);
                      }
                      if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
                          ctx.stroke();
                      }
                  }
              }
          };
          var update = function update() {
              var nextArray = [];
              var ctx = this.canvas.getContext('2d');
              if (!ctx) {
                  return;
              }
              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
              if (totalPoints.length !== 0) {
                  var lines = 1;
                  var lineObj = {};
                  for (var i = 0, len = totalPoints.length; i < len - 1; i++) {
  
                      var pixel = map.pointToPixel(totalPoints[i]);
                      var nextPixel = map.pointToPixel(totalPoints[i + 1]);
                      ctx.beginPath();
                      ctx.moveTo(pixel.x, pixel.y);
                      if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
                          // 绘制带速度颜色的轨迹
                          ctx.lineCap = 'round';
                          ctx.lineWidth = 8;
                          var grd = ctx.createLinearGradient(pixel.x, pixel.y, nextPixel.x, nextPixel.y);
                          var speed = totalPoints[i].speed;
                          var speedNext = totalPoints[i + 1].speed;
                          grd.addColorStop(0, that.getColorBySpeed(speed));
                          grd.addColorStop(1, that.getColorBySpeed(speedNext));
                          ctx.strokeStyle = grd;
                          ctx.lineTo(nextPixel.x, nextPixel.y);
                      } else {
                          (function () {
                              lines = lines + 1;
                              var lineNum = lines;
                              nextArray.push([pixel, nextPixel]);
                              if (totalPoints[i + 1].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
                                  (function () {
                                      var partImgStart = new Image();
                                      partImgStart.src = 'static/images/startpoint_72bcf14.png';
                                      var next = nextPixel;
                                      partImgStart.onload = function () {
                                          var width = [4, 8];
                                          ctx.drawImage(partImgStart, next.x - 10, next.y - 30);
                                          ctx.font = 'lighter 14px arial';
                                          ctx.fillStyle = 'white';
                                          ctx.fillText(lineNum, next.x - width[lineNum >= 10 ? 1 : 0], next.y - 15);
                                      };
                                  })();
                              }
                              if (totalPoints[i].loc_time >= starttime && totalPoints[i].loc_time <= endtime) {
                                  (function () {
                                      var current = pixel;
                                      var partImgEnd = new Image();
                                      partImgEnd.src = 'static/images/endpoint_1a825d7.png';
                                      partImgEnd.onload = function () {
                                          var width = [4, 8];
                                          ctx.drawImage(partImgEnd, current.x - 10, current.y - 30);
                                          ctx.font = 'lighter 14px arial';
                                          ctx.fillStyle = 'white';
                                          ctx.fillText(lineNum - 1, current.x - width[lineNum >= 10 ? 1 : 0], current.y - 15);
                                      };
                                  })();
                              }
                          })();
                      }
                      if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
                          ctx.stroke();
                      }
                  }
              }
  
              if (totalPoints[0].loc_time >= starttime) {
                  (function () {
                      var imgStart = new Image();
                      imgStart.src = 'static/images/startpoint_72bcf14.png';
                      imgStart.onload = function () {
                          var width = [4, 8];
                          ctx.drawImage(imgStart, map.pointToPixel(totalPoints[0]).x - 10, map.pointToPixel(totalPoints[0]).y - 30);
                          ctx.font = 'lighter 14px arial';
                          ctx.fillStyle = 'white';
                          ctx.fillText('1', map.pointToPixel(totalPoints[0]).x - width[lines >= 10 ? 1 : 0], map.pointToPixel(totalPoints[0]).y - 15);
                      };
                  })();
              }
              if (totalPoints[totalPoints.length - 1].loc_time <= endtime) {
                  (function () {
                      var imgEnd = new Image();
                      imgEnd.src = 'static/images/endpoint_1a825d7.png';
                      imgEnd.onload = function () {
                          var width = [4, 8];
                          ctx.drawImage(imgEnd, map.pointToPixel(totalPoints[totalPoints.length - 1]).x - 10, map.pointToPixel(totalPoints[totalPoints.length - 1]).y - 30);
                          ctx.font = 'lighter 14px arial';
                          ctx.fillStyle = 'white';
                          ctx.fillText(lines, map.pointToPixel(totalPoints[totalPoints.length - 1]).x - width[lines >= 10 ? 1 : 0], map.pointToPixel(totalPoints[totalPoints.length - 1]).y - 15);
                      };
                  })();
              }
          };
          if (totalPoints.length > 0) {
              if (typeof canvasLayer !== 'undefined' || typeof canvasLayerBack !== 'undefined' || typeof CanvasLayerPointer !== 'undefined') {
                  map.removeOverlay(CanvasLayerPointer);
                  map.removeOverlay(canvasLayer);
                  map.removeOverlay(canvasLayerBack);
              }
              window.canvasLayerBack = new CanvasLayer({
                  map: map,
                  update: updateBack
              });
              window.canvasLayer = new CanvasLayer({
                  map: map,
                  update: update
              });
              window.CanvasLayerPointer = new CanvasLayer({
                  map: map,
                  update: updatePointer
              });
          }
          mapControl.removeBehaviorOverlay();
          _actionsTrackAction2['default'].behavioranalysis();
          _actionsTrackAction2['default'].getstaypoint();
  
          if (typeof pointCollection !== 'undefined') {
              map.removeOverlay(pointCollection);
          }
          var options = {
              size: BMAP_POINT_SIZE_HUGE,
              shape: BMAP_POINT_SHAPE_CIRCLE,
              color: 'rgba(0, 0, 0, 0)'
          };
          window.pointCollection = new BMap.PointCollection(totalPoints, options); // 初始化PointCollection
          pointCollection.addEventListener('mouseover', function (e) {
              mapControl.addTrackPointOverlay(e.point, 'trackpointOverlay');
          });
          pointCollection.addEventListener('mouseout', function (e) {
              mapControl.removeTrackPointOverlay('trackpointOverlay');
          });
          pointCollection.addEventListener('click', function (e) {
              mapControl.removeTrackInfoBox();
              _actionsTrackAction2['default'].getaddress(e.point);
              mapControl.removeTrackPointOverlay('trackpointonOverlay');
              mapControl.addTrackPointOverlay(e.point, 'trackpointonOverlay');
          });
          map.addOverlay(pointCollection); // 添加Overlay
      },
      /**
       * view内部方法，根据速度获取对应的轨迹绘制颜色
       * 
       * @param {number} speed 速度
       *
       * @return {string} 颜色RGB字符串
       */
      getColorBySpeed: function getColorBySpeed(speed) {
          var color = '';
          var red = 0;
          var green = 0;
          var blue = 0;
          speed = speed > 100 ? 100 : speed;
          switch (Math.floor(speed / 25)) {
              case 0:
                  red = 187;
                  green = 0;
                  blue = 0;
                  break;
              case 1:
                  speed = speed - 25;
                  red = 187 + Math.ceil((241 - 187) / 25 * speed);
                  green = 0 + Math.ceil((48 - 0) / 25 * speed);
                  blue = 0 + Math.ceil((48 - 0) / 25 * speed);
                  break;
              case 2:
                  speed = speed - 50;
                  red = 241 + Math.ceil((255 - 241) / 25 * speed);
                  green = 48 + Math.ceil((200 - 48) / 25 * speed);
                  blue = 48 + Math.ceil((0 - 48) / 25 * speed);
                  break;
              case 3:
                  speed = speed - 75;
                  red = 255 + Math.ceil((22 - 255) / 25 * speed);
                  green = 200 + Math.ceil((191 - 200) / 25 * speed);
                  blue = 0 + Math.ceil((43 - 0) / 25 * speed);
                  break;
              case 4:
                  red = 22;
                  green = 191;
                  blue = 43;
                  break;
          }
  
          red = red.toString(16).length === 1 ? '0' + red.toString(16) : red.toString(16);
          green = green.toString(16).length === 1 ? '0' + green.toString(16) : green.toString(16);
          blue = blue.toString(16).length === 1 ? '0' + blue.toString(16) : blue.toString(16);
          color = '#' + red + green + blue;
          return color;
      },
      /**
       * DOM事件回掉，处理点击选中某条历史轨迹
       *
       * @param {object} event 事件对象
       */
      handleSelectTrack: function handleSelectTrack(event) {
          var realTarget = event.target;
          if (event.target.parentElement.className.indexOf('monitorListItem') > -1) {
              realTarget = event.target.parentElement;
          }
          if (event.target.parentElement.parentElement.className.indexOf('monitorListItem') > -1) {
              realTarget = event.target.parentElement.parentElement;
          }
          var entity_name = realTarget.getAttribute('data-entity_name');
          var entity_id = realTarget.getAttribute('data-entity_id');
          var entity_print = realTarget.getAttribute('data-entity_print');
          this.setState({ currentEntityName: entity_name });
          this.setState({ currentEntityPrint: entity_print });
          _actionsTrackAction2['default'].selecttrack(entity_name, entity_id);
      },
      render: function render() {
          var trackList = this.state.trackList;
          var currentTrack = this.state.currentTrack;
          var handleSelectTrack = this.handleSelectTrack;
          var blankEntityList = this.state.blankEntityList;
          var currentEntityName = this.state.currentEntityName;
          return _react2['default'].createElement(
              'div',
              { className: 'trackContent' },
              _react2['default'].createElement(
                  'div',
                  { className: 'monitorFrame' },
                  trackList.map(function (item, key) {
                      return _react2['default'].createElement(
                          'div',
                          { className: 'monitorListItem' + item.style + (currentEntityName === item.name ? ' monitorSelect' : ''), key: key, 'data-entity_name': item.name, 'data-entity_print': item.print, 'data-entity_id': item.entity_id, onClick: handleSelectTrack },
                          _react2['default'].createElement(
                              'div',
                              { className: 'monitorListItemName' },
                              _react2['default'].createElement(
                                  'abbr',
                                  { title: item.print },
                                  item.print
                              )
                          ),
                          _react2['default'].createElement(
                              'div',
                              { className: 'monitorListItemSpeed' },
                              item.distance >= 0 ? item.distance + ' km' : _react2['default'].createElement('div', { className: 'loading' })
                          )
                      );
                  }),
                  blankEntityList.map(function (item, key) {
                      return _react2['default'].createElement(
                          'div',
                          { className: 'monitorListItem', key: key },
                          _react2['default'].createElement('div', { className: 'monitorListItemName' }),
                          _react2['default'].createElement('div', { className: 'monitorListItemSpeed' })
                      );
                  })
              ),
              _react2['default'].createElement(_trackpages2['default'], null)
          );
      }
  });
  
  exports['default'] = Trackcontent;
  module.exports = exports['default'];

});
