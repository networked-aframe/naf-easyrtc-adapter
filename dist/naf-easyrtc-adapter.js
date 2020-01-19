/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global NAF */

var EasyRtcAdapter = function () {
  function EasyRtcAdapter(easyrtc) {
    _classCallCheck(this, EasyRtcAdapter);

    this.easyrtc = easyrtc || window.easyrtc;
    this.app = "default";
    this.room = "default";

    this.audioStreams = {};
    this.pendingAudioRequest = {};

    this.serverTimeRequests = 0;
    this.timeOffsets = [];
    this.avgTimeOffset = 0;
  }

  _createClass(EasyRtcAdapter, [{
    key: "setServerUrl",
    value: function setServerUrl(url) {
      this.easyrtc.setSocketUrl(url);
    }
  }, {
    key: "setApp",
    value: function setApp(appName) {
      this.app = appName;
    }
  }, {
    key: "setRoom",
    value: function setRoom(roomName) {
      this.room = roomName;
      this.easyrtc.joinRoom(roomName, null);
    }

    // options: { datachannel: bool, audio: bool }

  }, {
    key: "setWebRtcOptions",
    value: function setWebRtcOptions(options) {
      // this.easyrtc.enableDebug(true);
      this.easyrtc.enableDataChannels(options.datachannel);

      this.easyrtc.enableVideo(false);
      this.easyrtc.enableAudio(options.audio);

      this.easyrtc.enableVideoReceive(false);
      this.easyrtc.enableAudioReceive(true);
    }
  }, {
    key: "setServerConnectListeners",
    value: function setServerConnectListeners(successListener, failureListener) {
      this.connectSuccess = successListener;
      this.connectFailure = failureListener;
    }
  }, {
    key: "setRoomOccupantListener",
    value: function setRoomOccupantListener(occupantListener) {
      this.easyrtc.setRoomOccupantListener(function (roomName, occupants, primary) {
        occupantListener(occupants);
      });
    }
  }, {
    key: "setDataChannelListeners",
    value: function setDataChannelListeners(openListener, closedListener, messageListener) {
      this.easyrtc.setDataChannelOpenListener(openListener);
      this.easyrtc.setDataChannelCloseListener(closedListener);
      this.easyrtc.setPeerListener(messageListener);
    }
  }, {
    key: "updateTimeOffset",
    value: function updateTimeOffset() {
      var _this = this;

      var clientSentTime = Date.now() + this.avgTimeOffset;

      return fetch(document.location.href, { method: "HEAD", cache: "no-cache" }).then(function (res) {
        var precision = 1000;
        var serverReceivedTime = new Date(res.headers.get("Date")).getTime() + precision / 2;
        var clientReceivedTime = Date.now();
        var serverTime = serverReceivedTime + (clientReceivedTime - clientSentTime) / 2;
        var timeOffset = serverTime - clientReceivedTime;

        _this.serverTimeRequests++;

        if (_this.serverTimeRequests <= 10) {
          _this.timeOffsets.push(timeOffset);
        } else {
          _this.timeOffsets[_this.serverTimeRequests % 10] = timeOffset;
        }

        _this.avgTimeOffset = _this.timeOffsets.reduce(function (acc, offset) {
          return acc += offset;
        }, 0) / _this.timeOffsets.length;

        if (_this.serverTimeRequests > 10) {
          setTimeout(function () {
            return _this.updateTimeOffset();
          }, 5 * 60 * 1000); // Sync clock every 5 minutes.
        } else {
          _this.updateTimeOffset();
        }
      });
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;

      Promise.all([this.updateTimeOffset(), new Promise(function (resolve, reject) {
        _this2._connect(_this2.easyrtc.audioEnabled, resolve, reject);
      })]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            _ = _ref2[0],
            clientId = _ref2[1];

        _this2._storeAudioStream(_this2.easyrtc.myEasyrtcid, _this2.easyrtc.getLocalStream());

        _this2._myRoomJoinTime = _this2._getRoomJoinTime(clientId);
        _this2.connectSuccess(clientId);
      }).catch(this.connectFailure);
    }
  }, {
    key: "shouldStartConnectionTo",
    value: function shouldStartConnectionTo(client) {
      return this._myRoomJoinTime <= client.roomJoinTime;
    }
  }, {
    key: "startStreamConnection",
    value: function startStreamConnection(clientId) {
      this.easyrtc.call(clientId, function (caller, media) {
        if (media === "datachannel") {
          NAF.log.write("Successfully started datachannel to ", caller);
        }
      }, function (errorCode, errorText) {
        NAF.log.error(errorCode, errorText);
      }, function (wasAccepted) {
        // console.log("was accepted=" + wasAccepted);
      });
    }
  }, {
    key: "closeStreamConnection",
    value: function closeStreamConnection(clientId) {
      // Handled by easyrtc
    }
  }, {
    key: "sendData",
    value: function sendData(clientId, dataType, data) {
      // send via webrtc otherwise fallback to websockets
      this.easyrtc.sendData(clientId, dataType, data);
    }
  }, {
    key: "sendDataGuaranteed",
    value: function sendDataGuaranteed(clientId, dataType, data) {
      this.easyrtc.sendDataWS(clientId, dataType, data);
    }
  }, {
    key: "broadcastData",
    value: function broadcastData(dataType, data) {
      var roomOccupants = this.easyrtc.getRoomOccupantsAsMap(this.room);

      // Iterate over the keys of the easyrtc room occupants map.
      // getRoomOccupantsAsArray uses Object.keys which allocates memory.
      for (var roomOccupant in roomOccupants) {
        if (roomOccupants[roomOccupant] && roomOccupant !== this.easyrtc.myEasyrtcid) {
          // send via webrtc otherwise fallback to websockets
          this.easyrtc.sendData(roomOccupant, dataType, data);
        }
      }
    }
  }, {
    key: "broadcastDataGuaranteed",
    value: function broadcastDataGuaranteed(dataType, data) {
      var destination = { targetRoom: this.room };
      this.easyrtc.sendDataWS(destination, dataType, data);
    }
  }, {
    key: "getConnectStatus",
    value: function getConnectStatus(clientId) {
      var status = this.easyrtc.getConnectStatus(clientId);

      if (status == this.easyrtc.IS_CONNECTED) {
        return NAF.adapters.IS_CONNECTED;
      } else if (status == this.easyrtc.NOT_CONNECTED) {
        return NAF.adapters.NOT_CONNECTED;
      } else {
        return NAF.adapters.CONNECTING;
      }
    }
  }, {
    key: "getMediaStream",
    value: function getMediaStream(clientId) {
      var that = this;
      if (this.audioStreams[clientId]) {
        NAF.log.write("Already had audio for " + clientId);
        return Promise.resolve(this.audioStreams[clientId]);
      } else {
        NAF.log.write("Waiting on audio for " + clientId);
        return new Promise(function (resolve) {
          that.pendingAudioRequest[clientId] = resolve;
        });
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.easyrtc.disconnect();
    }

    /**
     * Privates
     */

  }, {
    key: "_storeAudioStream",
    value: function _storeAudioStream(easyrtcid, stream) {
      this.audioStreams[easyrtcid] = stream;
      if (this.pendingAudioRequest[easyrtcid]) {
        NAF.log.write("got pending audio for " + easyrtcid);
        this.pendingAudioRequest[easyrtcid](stream);
        delete this.pendingAudioRequest[easyrtcid](stream);
      }
    }
  }, {
    key: "_connect",
    value: function _connect(audioEnabled, connectSuccess, connectFailure) {
      var that = this;

      this.easyrtc.setStreamAcceptor(this._storeAudioStream.bind(this));

      this.easyrtc.setOnStreamClosed(function (easyrtcid) {
        delete that.audioStreams[easyrtcid];
      });

      if (audioEnabled) {
        this.easyrtc.initMediaSource(function () {
          that.easyrtc.connect(that.app, connectSuccess, connectFailure);
        }, function (errorCode, errmesg) {
          NAF.log.error(errorCode, errmesg);
        });
      } else {
        that.easyrtc.connect(that.app, connectSuccess, connectFailure);
      }
    }
  }, {
    key: "_getRoomJoinTime",
    value: function _getRoomJoinTime(clientId) {
      var myRoomId = NAF.room;
      var joinTime = this.easyrtc.getRoomOccupantsAsMap(myRoomId)[clientId].roomJoinTime;
      return joinTime;
    }
  }, {
    key: "getServerTime",
    value: function getServerTime() {
      return Date.now() + this.avgTimeOffset;
    }
  }]);

  return EasyRtcAdapter;
}();

NAF.adapters.register("easyrtc", EasyRtcAdapter);

module.exports = EasyRtcAdapter;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmYxNTNhZjUwNjg1MmU1MTkyZDYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIkVhc3lSdGNBZGFwdGVyIiwiZWFzeXJ0YyIsIndpbmRvdyIsImFwcCIsInJvb20iLCJhdWRpb1N0cmVhbXMiLCJwZW5kaW5nQXVkaW9SZXF1ZXN0Iiwic2VydmVyVGltZVJlcXVlc3RzIiwidGltZU9mZnNldHMiLCJhdmdUaW1lT2Zmc2V0IiwidXJsIiwic2V0U29ja2V0VXJsIiwiYXBwTmFtZSIsInJvb21OYW1lIiwiam9pblJvb20iLCJvcHRpb25zIiwiZW5hYmxlRGF0YUNoYW5uZWxzIiwiZGF0YWNoYW5uZWwiLCJlbmFibGVWaWRlbyIsImVuYWJsZUF1ZGlvIiwiYXVkaW8iLCJlbmFibGVWaWRlb1JlY2VpdmUiLCJlbmFibGVBdWRpb1JlY2VpdmUiLCJzdWNjZXNzTGlzdGVuZXIiLCJmYWlsdXJlTGlzdGVuZXIiLCJjb25uZWN0U3VjY2VzcyIsImNvbm5lY3RGYWlsdXJlIiwib2NjdXBhbnRMaXN0ZW5lciIsInNldFJvb21PY2N1cGFudExpc3RlbmVyIiwib2NjdXBhbnRzIiwicHJpbWFyeSIsIm9wZW5MaXN0ZW5lciIsImNsb3NlZExpc3RlbmVyIiwibWVzc2FnZUxpc3RlbmVyIiwic2V0RGF0YUNoYW5uZWxPcGVuTGlzdGVuZXIiLCJzZXREYXRhQ2hhbm5lbENsb3NlTGlzdGVuZXIiLCJzZXRQZWVyTGlzdGVuZXIiLCJjbGllbnRTZW50VGltZSIsIkRhdGUiLCJub3ciLCJmZXRjaCIsImRvY3VtZW50IiwibG9jYXRpb24iLCJocmVmIiwibWV0aG9kIiwiY2FjaGUiLCJ0aGVuIiwicHJlY2lzaW9uIiwic2VydmVyUmVjZWl2ZWRUaW1lIiwicmVzIiwiaGVhZGVycyIsImdldCIsImdldFRpbWUiLCJjbGllbnRSZWNlaXZlZFRpbWUiLCJzZXJ2ZXJUaW1lIiwidGltZU9mZnNldCIsInB1c2giLCJyZWR1Y2UiLCJhY2MiLCJvZmZzZXQiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwidXBkYXRlVGltZU9mZnNldCIsIlByb21pc2UiLCJhbGwiLCJyZXNvbHZlIiwicmVqZWN0IiwiX2Nvbm5lY3QiLCJhdWRpb0VuYWJsZWQiLCJfIiwiY2xpZW50SWQiLCJfc3RvcmVBdWRpb1N0cmVhbSIsIm15RWFzeXJ0Y2lkIiwiZ2V0TG9jYWxTdHJlYW0iLCJfbXlSb29tSm9pblRpbWUiLCJfZ2V0Um9vbUpvaW5UaW1lIiwiY2F0Y2giLCJjbGllbnQiLCJyb29tSm9pblRpbWUiLCJjYWxsIiwiY2FsbGVyIiwibWVkaWEiLCJOQUYiLCJsb2ciLCJ3cml0ZSIsImVycm9yQ29kZSIsImVycm9yVGV4dCIsImVycm9yIiwid2FzQWNjZXB0ZWQiLCJkYXRhVHlwZSIsImRhdGEiLCJzZW5kRGF0YSIsInNlbmREYXRhV1MiLCJyb29tT2NjdXBhbnRzIiwiZ2V0Um9vbU9jY3VwYW50c0FzTWFwIiwicm9vbU9jY3VwYW50IiwiZGVzdGluYXRpb24iLCJ0YXJnZXRSb29tIiwic3RhdHVzIiwiZ2V0Q29ubmVjdFN0YXR1cyIsIklTX0NPTk5FQ1RFRCIsImFkYXB0ZXJzIiwiTk9UX0NPTk5FQ1RFRCIsIkNPTk5FQ1RJTkciLCJ0aGF0IiwiZGlzY29ubmVjdCIsImVhc3lydGNpZCIsInN0cmVhbSIsInNldFN0cmVhbUFjY2VwdG9yIiwiYmluZCIsInNldE9uU3RyZWFtQ2xvc2VkIiwiaW5pdE1lZGlhU291cmNlIiwiY29ubmVjdCIsImVycm1lc2ciLCJteVJvb21JZCIsImpvaW5UaW1lIiwicmVnaXN0ZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOztRQUVBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7O0lBRU1BLGM7QUFFSiwwQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNuQixTQUFLQSxPQUFMLEdBQWVBLFdBQVdDLE9BQU9ELE9BQWpDO0FBQ0EsU0FBS0UsR0FBTCxHQUFXLFNBQVg7QUFDQSxTQUFLQyxJQUFMLEdBQVksU0FBWjs7QUFFQSxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0MsbUJBQUwsR0FBMkIsRUFBM0I7O0FBRUEsU0FBS0Msa0JBQUwsR0FBMEIsQ0FBMUI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixDQUFyQjtBQUNEOzs7O2lDQUVZQyxHLEVBQUs7QUFDaEIsV0FBS1QsT0FBTCxDQUFhVSxZQUFiLENBQTBCRCxHQUExQjtBQUNEOzs7MkJBRU1FLE8sRUFBUztBQUNkLFdBQUtULEdBQUwsR0FBV1MsT0FBWDtBQUNEOzs7NEJBRU9DLFEsRUFBVTtBQUNoQixXQUFLVCxJQUFMLEdBQVlTLFFBQVo7QUFDQSxXQUFLWixPQUFMLENBQWFhLFFBQWIsQ0FBc0JELFFBQXRCLEVBQWdDLElBQWhDO0FBQ0Q7O0FBRUQ7Ozs7cUNBQ2lCRSxPLEVBQVM7QUFDeEI7QUFDQSxXQUFLZCxPQUFMLENBQWFlLGtCQUFiLENBQWdDRCxRQUFRRSxXQUF4Qzs7QUFFQSxXQUFLaEIsT0FBTCxDQUFhaUIsV0FBYixDQUF5QixLQUF6QjtBQUNBLFdBQUtqQixPQUFMLENBQWFrQixXQUFiLENBQXlCSixRQUFRSyxLQUFqQzs7QUFFQSxXQUFLbkIsT0FBTCxDQUFhb0Isa0JBQWIsQ0FBZ0MsS0FBaEM7QUFDQSxXQUFLcEIsT0FBTCxDQUFhcUIsa0JBQWIsQ0FBZ0MsSUFBaEM7QUFDRDs7OzhDQUV5QkMsZSxFQUFpQkMsZSxFQUFpQjtBQUMxRCxXQUFLQyxjQUFMLEdBQXNCRixlQUF0QjtBQUNBLFdBQUtHLGNBQUwsR0FBc0JGLGVBQXRCO0FBQ0Q7Ozs0Q0FFdUJHLGdCLEVBQWtCO0FBQ3hDLFdBQUsxQixPQUFMLENBQWEyQix1QkFBYixDQUFxQyxVQUNuQ2YsUUFEbUMsRUFFbkNnQixTQUZtQyxFQUduQ0MsT0FIbUMsRUFJbkM7QUFDQUgseUJBQWlCRSxTQUFqQjtBQUNELE9BTkQ7QUFPRDs7OzRDQUV1QkUsWSxFQUFjQyxjLEVBQWdCQyxlLEVBQWlCO0FBQ3JFLFdBQUtoQyxPQUFMLENBQWFpQywwQkFBYixDQUF3Q0gsWUFBeEM7QUFDQSxXQUFLOUIsT0FBTCxDQUFha0MsMkJBQWIsQ0FBeUNILGNBQXpDO0FBQ0EsV0FBSy9CLE9BQUwsQ0FBYW1DLGVBQWIsQ0FBNkJILGVBQTdCO0FBQ0Q7Ozt1Q0FFa0I7QUFBQTs7QUFDakIsVUFBTUksaUJBQWlCQyxLQUFLQyxHQUFMLEtBQWEsS0FBSzlCLGFBQXpDOztBQUVBLGFBQU8rQixNQUFNQyxTQUFTQyxRQUFULENBQWtCQyxJQUF4QixFQUE4QixFQUFFQyxRQUFRLE1BQVYsRUFBa0JDLE9BQU8sVUFBekIsRUFBOUIsRUFDSkMsSUFESSxDQUNDLGVBQU87QUFDWCxZQUFJQyxZQUFZLElBQWhCO0FBQ0EsWUFBSUMscUJBQXFCLElBQUlWLElBQUosQ0FBU1csSUFBSUMsT0FBSixDQUFZQyxHQUFaLENBQWdCLE1BQWhCLENBQVQsRUFBa0NDLE9BQWxDLEtBQStDTCxZQUFZLENBQXBGO0FBQ0EsWUFBSU0scUJBQXFCZixLQUFLQyxHQUFMLEVBQXpCO0FBQ0EsWUFBSWUsYUFBYU4scUJBQXNCLENBQUNLLHFCQUFxQmhCLGNBQXRCLElBQXdDLENBQS9FO0FBQ0EsWUFBSWtCLGFBQWFELGFBQWFELGtCQUE5Qjs7QUFFQSxjQUFLOUMsa0JBQUw7O0FBRUEsWUFBSSxNQUFLQSxrQkFBTCxJQUEyQixFQUEvQixFQUFtQztBQUNqQyxnQkFBS0MsV0FBTCxDQUFpQmdELElBQWpCLENBQXNCRCxVQUF0QjtBQUNELFNBRkQsTUFFTztBQUNMLGdCQUFLL0MsV0FBTCxDQUFpQixNQUFLRCxrQkFBTCxHQUEwQixFQUEzQyxJQUFpRGdELFVBQWpEO0FBQ0Q7O0FBRUQsY0FBSzlDLGFBQUwsR0FBcUIsTUFBS0QsV0FBTCxDQUFpQmlELE1BQWpCLENBQXdCLFVBQUNDLEdBQUQsRUFBTUMsTUFBTjtBQUFBLGlCQUFpQkQsT0FBT0MsTUFBeEI7QUFBQSxTQUF4QixFQUF3RCxDQUF4RCxJQUE2RCxNQUFLbkQsV0FBTCxDQUFpQm9ELE1BQW5HOztBQUVBLFlBQUksTUFBS3JELGtCQUFMLEdBQTBCLEVBQTlCLEVBQWtDO0FBQ2hDc0QscUJBQVc7QUFBQSxtQkFBTSxNQUFLQyxnQkFBTCxFQUFOO0FBQUEsV0FBWCxFQUEwQyxJQUFJLEVBQUosR0FBUyxJQUFuRCxFQURnQyxDQUMwQjtBQUMzRCxTQUZELE1BRU87QUFDTCxnQkFBS0EsZ0JBQUw7QUFDRDtBQUNGLE9BdkJJLENBQVA7QUF3QkQ7Ozs4QkFFUztBQUFBOztBQUNSQyxjQUFRQyxHQUFSLENBQVksQ0FDVixLQUFLRixnQkFBTCxFQURVLEVBRVYsSUFBSUMsT0FBSixDQUFZLFVBQUNFLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUMvQixlQUFLQyxRQUFMLENBQWMsT0FBS2xFLE9BQUwsQ0FBYW1FLFlBQTNCLEVBQXlDSCxPQUF6QyxFQUFrREMsTUFBbEQ7QUFDRCxPQUZELENBRlUsQ0FBWixFQUtHcEIsSUFMSCxDQUtRLGdCQUFtQjtBQUFBO0FBQUEsWUFBakJ1QixDQUFpQjtBQUFBLFlBQWRDLFFBQWM7O0FBQ3pCLGVBQUtDLGlCQUFMLENBQ0UsT0FBS3RFLE9BQUwsQ0FBYXVFLFdBRGYsRUFFRSxPQUFLdkUsT0FBTCxDQUFhd0UsY0FBYixFQUZGOztBQUtBLGVBQUtDLGVBQUwsR0FBdUIsT0FBS0MsZ0JBQUwsQ0FBc0JMLFFBQXRCLENBQXZCO0FBQ0EsZUFBSzdDLGNBQUwsQ0FBb0I2QyxRQUFwQjtBQUNELE9BYkQsRUFhR00sS0FiSCxDQWFTLEtBQUtsRCxjQWJkO0FBY0Q7Ozs0Q0FFdUJtRCxNLEVBQVE7QUFDOUIsYUFBTyxLQUFLSCxlQUFMLElBQXdCRyxPQUFPQyxZQUF0QztBQUNEOzs7MENBRXFCUixRLEVBQVU7QUFDOUIsV0FBS3JFLE9BQUwsQ0FBYThFLElBQWIsQ0FDRVQsUUFERixFQUVFLFVBQVNVLE1BQVQsRUFBaUJDLEtBQWpCLEVBQXdCO0FBQ3RCLFlBQUlBLFVBQVUsYUFBZCxFQUE2QjtBQUMzQkMsY0FBSUMsR0FBSixDQUFRQyxLQUFSLENBQWMsc0NBQWQsRUFBc0RKLE1BQXREO0FBQ0Q7QUFDRixPQU5ILEVBT0UsVUFBU0ssU0FBVCxFQUFvQkMsU0FBcEIsRUFBK0I7QUFDN0JKLFlBQUlDLEdBQUosQ0FBUUksS0FBUixDQUFjRixTQUFkLEVBQXlCQyxTQUF6QjtBQUNELE9BVEgsRUFVRSxVQUFTRSxXQUFULEVBQXNCO0FBQ3BCO0FBQ0QsT0FaSDtBQWNEOzs7MENBRXFCbEIsUSxFQUFVO0FBQzlCO0FBQ0Q7Ozs2QkFFUUEsUSxFQUFVbUIsUSxFQUFVQyxJLEVBQU07QUFDakM7QUFDQSxXQUFLekYsT0FBTCxDQUFhMEYsUUFBYixDQUFzQnJCLFFBQXRCLEVBQWdDbUIsUUFBaEMsRUFBMENDLElBQTFDO0FBQ0Q7Ozt1Q0FFa0JwQixRLEVBQVVtQixRLEVBQVVDLEksRUFBTTtBQUMzQyxXQUFLekYsT0FBTCxDQUFhMkYsVUFBYixDQUF3QnRCLFFBQXhCLEVBQWtDbUIsUUFBbEMsRUFBNENDLElBQTVDO0FBQ0Q7OztrQ0FFYUQsUSxFQUFVQyxJLEVBQU07QUFDNUIsVUFBSUcsZ0JBQWdCLEtBQUs1RixPQUFMLENBQWE2RixxQkFBYixDQUFtQyxLQUFLMUYsSUFBeEMsQ0FBcEI7O0FBRUE7QUFDQTtBQUNBLFdBQUssSUFBSTJGLFlBQVQsSUFBeUJGLGFBQXpCLEVBQXdDO0FBQ3RDLFlBQ0VBLGNBQWNFLFlBQWQsS0FDQUEsaUJBQWlCLEtBQUs5RixPQUFMLENBQWF1RSxXQUZoQyxFQUdFO0FBQ0E7QUFDQSxlQUFLdkUsT0FBTCxDQUFhMEYsUUFBYixDQUFzQkksWUFBdEIsRUFBb0NOLFFBQXBDLEVBQThDQyxJQUE5QztBQUNEO0FBQ0Y7QUFDRjs7OzRDQUV1QkQsUSxFQUFVQyxJLEVBQU07QUFDdEMsVUFBSU0sY0FBYyxFQUFFQyxZQUFZLEtBQUs3RixJQUFuQixFQUFsQjtBQUNBLFdBQUtILE9BQUwsQ0FBYTJGLFVBQWIsQ0FBd0JJLFdBQXhCLEVBQXFDUCxRQUFyQyxFQUErQ0MsSUFBL0M7QUFDRDs7O3FDQUVnQnBCLFEsRUFBVTtBQUN6QixVQUFJNEIsU0FBUyxLQUFLakcsT0FBTCxDQUFha0csZ0JBQWIsQ0FBOEI3QixRQUE5QixDQUFiOztBQUVBLFVBQUk0QixVQUFVLEtBQUtqRyxPQUFMLENBQWFtRyxZQUEzQixFQUF5QztBQUN2QyxlQUFPbEIsSUFBSW1CLFFBQUosQ0FBYUQsWUFBcEI7QUFDRCxPQUZELE1BRU8sSUFBSUYsVUFBVSxLQUFLakcsT0FBTCxDQUFhcUcsYUFBM0IsRUFBMEM7QUFDL0MsZUFBT3BCLElBQUltQixRQUFKLENBQWFDLGFBQXBCO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsZUFBT3BCLElBQUltQixRQUFKLENBQWFFLFVBQXBCO0FBQ0Q7QUFDRjs7O21DQUVjakMsUSxFQUFVO0FBQ3ZCLFVBQUlrQyxPQUFPLElBQVg7QUFDQSxVQUFJLEtBQUtuRyxZQUFMLENBQWtCaUUsUUFBbEIsQ0FBSixFQUFpQztBQUMvQlksWUFBSUMsR0FBSixDQUFRQyxLQUFSLENBQWMsMkJBQTJCZCxRQUF6QztBQUNBLGVBQU9QLFFBQVFFLE9BQVIsQ0FBZ0IsS0FBSzVELFlBQUwsQ0FBa0JpRSxRQUFsQixDQUFoQixDQUFQO0FBQ0QsT0FIRCxNQUdPO0FBQ0xZLFlBQUlDLEdBQUosQ0FBUUMsS0FBUixDQUFjLDBCQUEwQmQsUUFBeEM7QUFDQSxlQUFPLElBQUlQLE9BQUosQ0FBWSxVQUFTRSxPQUFULEVBQWtCO0FBQ25DdUMsZUFBS2xHLG1CQUFMLENBQXlCZ0UsUUFBekIsSUFBcUNMLE9BQXJDO0FBQ0QsU0FGTSxDQUFQO0FBR0Q7QUFDRjs7O2lDQUVZO0FBQ1gsV0FBS2hFLE9BQUwsQ0FBYXdHLFVBQWI7QUFDRDs7QUFFRDs7Ozs7O3NDQUlrQkMsUyxFQUFXQyxNLEVBQVE7QUFDbkMsV0FBS3RHLFlBQUwsQ0FBa0JxRyxTQUFsQixJQUErQkMsTUFBL0I7QUFDQSxVQUFJLEtBQUtyRyxtQkFBTCxDQUF5Qm9HLFNBQXpCLENBQUosRUFBeUM7QUFDdkN4QixZQUFJQyxHQUFKLENBQVFDLEtBQVIsQ0FBYywyQkFBMkJzQixTQUF6QztBQUNBLGFBQUtwRyxtQkFBTCxDQUF5Qm9HLFNBQXpCLEVBQW9DQyxNQUFwQztBQUNBLGVBQU8sS0FBS3JHLG1CQUFMLENBQXlCb0csU0FBekIsRUFBb0NDLE1BQXBDLENBQVA7QUFDRDtBQUNGOzs7NkJBRVF2QyxZLEVBQWMzQyxjLEVBQWdCQyxjLEVBQWdCO0FBQ3JELFVBQUk4RSxPQUFPLElBQVg7O0FBRUEsV0FBS3ZHLE9BQUwsQ0FBYTJHLGlCQUFiLENBQStCLEtBQUtyQyxpQkFBTCxDQUF1QnNDLElBQXZCLENBQTRCLElBQTVCLENBQS9COztBQUVBLFdBQUs1RyxPQUFMLENBQWE2RyxpQkFBYixDQUErQixVQUFTSixTQUFULEVBQW9CO0FBQ2pELGVBQU9GLEtBQUtuRyxZQUFMLENBQWtCcUcsU0FBbEIsQ0FBUDtBQUNELE9BRkQ7O0FBSUEsVUFBSXRDLFlBQUosRUFBa0I7QUFDaEIsYUFBS25FLE9BQUwsQ0FBYThHLGVBQWIsQ0FDRSxZQUFXO0FBQ1RQLGVBQUt2RyxPQUFMLENBQWErRyxPQUFiLENBQXFCUixLQUFLckcsR0FBMUIsRUFBK0JzQixjQUEvQixFQUErQ0MsY0FBL0M7QUFDRCxTQUhILEVBSUUsVUFBUzJELFNBQVQsRUFBb0I0QixPQUFwQixFQUE2QjtBQUMzQi9CLGNBQUlDLEdBQUosQ0FBUUksS0FBUixDQUFjRixTQUFkLEVBQXlCNEIsT0FBekI7QUFDRCxTQU5IO0FBUUQsT0FURCxNQVNPO0FBQ0xULGFBQUt2RyxPQUFMLENBQWErRyxPQUFiLENBQXFCUixLQUFLckcsR0FBMUIsRUFBK0JzQixjQUEvQixFQUErQ0MsY0FBL0M7QUFDRDtBQUNGOzs7cUNBRWdCNEMsUSxFQUFVO0FBQ3pCLFVBQUk0QyxXQUFXaEMsSUFBSTlFLElBQW5CO0FBQ0EsVUFBSStHLFdBQVcsS0FBS2xILE9BQUwsQ0FBYTZGLHFCQUFiLENBQW1Db0IsUUFBbkMsRUFBNkM1QyxRQUE3QyxFQUNaUSxZQURIO0FBRUEsYUFBT3FDLFFBQVA7QUFDRDs7O29DQUVlO0FBQ2QsYUFBTzdFLEtBQUtDLEdBQUwsS0FBYSxLQUFLOUIsYUFBekI7QUFDRDs7Ozs7O0FBR0h5RSxJQUFJbUIsUUFBSixDQUFhZSxRQUFiLENBQXNCLFNBQXRCLEVBQWlDcEgsY0FBakM7O0FBRUFxSCxPQUFPQyxPQUFQLEdBQWlCdEgsY0FBakIsQyIsImZpbGUiOiJuYWYtZWFzeXJ0Yy1hZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYmYxNTNhZjUwNjg1MmU1MTkyZDYiLCIvKiBnbG9iYWwgTkFGICovXG5cbmNsYXNzIEVhc3lSdGNBZGFwdGVyIHtcblxuICBjb25zdHJ1Y3RvcihlYXN5cnRjKSB7XG4gICAgdGhpcy5lYXN5cnRjID0gZWFzeXJ0YyB8fCB3aW5kb3cuZWFzeXJ0YztcbiAgICB0aGlzLmFwcCA9IFwiZGVmYXVsdFwiO1xuICAgIHRoaXMucm9vbSA9IFwiZGVmYXVsdFwiO1xuXG4gICAgdGhpcy5hdWRpb1N0cmVhbXMgPSB7fTtcbiAgICB0aGlzLnBlbmRpbmdBdWRpb1JlcXVlc3QgPSB7fTtcblxuICAgIHRoaXMuc2VydmVyVGltZVJlcXVlc3RzID0gMDtcbiAgICB0aGlzLnRpbWVPZmZzZXRzID0gW107XG4gICAgdGhpcy5hdmdUaW1lT2Zmc2V0ID0gMDtcbiAgfVxuXG4gIHNldFNlcnZlclVybCh1cmwpIHtcbiAgICB0aGlzLmVhc3lydGMuc2V0U29ja2V0VXJsKHVybCk7XG4gIH1cblxuICBzZXRBcHAoYXBwTmFtZSkge1xuICAgIHRoaXMuYXBwID0gYXBwTmFtZTtcbiAgfVxuXG4gIHNldFJvb20ocm9vbU5hbWUpIHtcbiAgICB0aGlzLnJvb20gPSByb29tTmFtZTtcbiAgICB0aGlzLmVhc3lydGMuam9pblJvb20ocm9vbU5hbWUsIG51bGwpO1xuICB9XG5cbiAgLy8gb3B0aW9uczogeyBkYXRhY2hhbm5lbDogYm9vbCwgYXVkaW86IGJvb2wgfVxuICBzZXRXZWJSdGNPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAvLyB0aGlzLmVhc3lydGMuZW5hYmxlRGVidWcodHJ1ZSk7XG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZURhdGFDaGFubmVscyhvcHRpb25zLmRhdGFjaGFubmVsKTtcblxuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVWaWRlbyhmYWxzZSk7XG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZUF1ZGlvKG9wdGlvbnMuYXVkaW8pO1xuXG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZVZpZGVvUmVjZWl2ZShmYWxzZSk7XG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZUF1ZGlvUmVjZWl2ZSh0cnVlKTtcbiAgfVxuXG4gIHNldFNlcnZlckNvbm5lY3RMaXN0ZW5lcnMoc3VjY2Vzc0xpc3RlbmVyLCBmYWlsdXJlTGlzdGVuZXIpIHtcbiAgICB0aGlzLmNvbm5lY3RTdWNjZXNzID0gc3VjY2Vzc0xpc3RlbmVyO1xuICAgIHRoaXMuY29ubmVjdEZhaWx1cmUgPSBmYWlsdXJlTGlzdGVuZXI7XG4gIH1cblxuICBzZXRSb29tT2NjdXBhbnRMaXN0ZW5lcihvY2N1cGFudExpc3RlbmVyKSB7XG4gICAgdGhpcy5lYXN5cnRjLnNldFJvb21PY2N1cGFudExpc3RlbmVyKGZ1bmN0aW9uKFxuICAgICAgcm9vbU5hbWUsXG4gICAgICBvY2N1cGFudHMsXG4gICAgICBwcmltYXJ5XG4gICAgKSB7XG4gICAgICBvY2N1cGFudExpc3RlbmVyKG9jY3VwYW50cyk7XG4gICAgfSk7XG4gIH1cblxuICBzZXREYXRhQ2hhbm5lbExpc3RlbmVycyhvcGVuTGlzdGVuZXIsIGNsb3NlZExpc3RlbmVyLCBtZXNzYWdlTGlzdGVuZXIpIHtcbiAgICB0aGlzLmVhc3lydGMuc2V0RGF0YUNoYW5uZWxPcGVuTGlzdGVuZXIob3Blbkxpc3RlbmVyKTtcbiAgICB0aGlzLmVhc3lydGMuc2V0RGF0YUNoYW5uZWxDbG9zZUxpc3RlbmVyKGNsb3NlZExpc3RlbmVyKTtcbiAgICB0aGlzLmVhc3lydGMuc2V0UGVlckxpc3RlbmVyKG1lc3NhZ2VMaXN0ZW5lcik7XG4gIH1cblxuICB1cGRhdGVUaW1lT2Zmc2V0KCkge1xuICAgIGNvbnN0IGNsaWVudFNlbnRUaW1lID0gRGF0ZS5ub3coKSArIHRoaXMuYXZnVGltZU9mZnNldDtcblxuICAgIHJldHVybiBmZXRjaChkb2N1bWVudC5sb2NhdGlvbi5ocmVmLCB7IG1ldGhvZDogXCJIRUFEXCIsIGNhY2hlOiBcIm5vLWNhY2hlXCIgfSlcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIHZhciBwcmVjaXNpb24gPSAxMDAwO1xuICAgICAgICB2YXIgc2VydmVyUmVjZWl2ZWRUaW1lID0gbmV3IERhdGUocmVzLmhlYWRlcnMuZ2V0KFwiRGF0ZVwiKSkuZ2V0VGltZSgpICsgKHByZWNpc2lvbiAvIDIpO1xuICAgICAgICB2YXIgY2xpZW50UmVjZWl2ZWRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdmFyIHNlcnZlclRpbWUgPSBzZXJ2ZXJSZWNlaXZlZFRpbWUgKyAoKGNsaWVudFJlY2VpdmVkVGltZSAtIGNsaWVudFNlbnRUaW1lKSAvIDIpO1xuICAgICAgICB2YXIgdGltZU9mZnNldCA9IHNlcnZlclRpbWUgLSBjbGllbnRSZWNlaXZlZFRpbWU7XG5cbiAgICAgICAgdGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMrKztcblxuICAgICAgICBpZiAodGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMgPD0gMTApIHtcbiAgICAgICAgICB0aGlzLnRpbWVPZmZzZXRzLnB1c2godGltZU9mZnNldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aW1lT2Zmc2V0c1t0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyAlIDEwXSA9IHRpbWVPZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF2Z1RpbWVPZmZzZXQgPSB0aGlzLnRpbWVPZmZzZXRzLnJlZHVjZSgoYWNjLCBvZmZzZXQpID0+IGFjYyArPSBvZmZzZXQsIDApIC8gdGhpcy50aW1lT2Zmc2V0cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VydmVyVGltZVJlcXVlc3RzID4gMTApIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlVGltZU9mZnNldCgpLCA1ICogNjAgKiAxMDAwKTsgLy8gU3luYyBjbG9jayBldmVyeSA1IG1pbnV0ZXMuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVUaW1lT2Zmc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgY29ubmVjdCgpIHtcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLnVwZGF0ZVRpbWVPZmZzZXQoKSxcbiAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy5fY29ubmVjdCh0aGlzLmVhc3lydGMuYXVkaW9FbmFibGVkLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSlcbiAgICBdKS50aGVuKChbXywgY2xpZW50SWRdKSA9PiB7XG4gICAgICB0aGlzLl9zdG9yZUF1ZGlvU3RyZWFtKFxuICAgICAgICB0aGlzLmVhc3lydGMubXlFYXN5cnRjaWQsXG4gICAgICAgIHRoaXMuZWFzeXJ0Yy5nZXRMb2NhbFN0cmVhbSgpXG4gICAgICApO1xuXG4gICAgICB0aGlzLl9teVJvb21Kb2luVGltZSA9IHRoaXMuX2dldFJvb21Kb2luVGltZShjbGllbnRJZCk7XG4gICAgICB0aGlzLmNvbm5lY3RTdWNjZXNzKGNsaWVudElkKTtcbiAgICB9KS5jYXRjaCh0aGlzLmNvbm5lY3RGYWlsdXJlKTtcbiAgfVxuXG4gIHNob3VsZFN0YXJ0Q29ubmVjdGlvblRvKGNsaWVudCkge1xuICAgIHJldHVybiB0aGlzLl9teVJvb21Kb2luVGltZSA8PSBjbGllbnQucm9vbUpvaW5UaW1lO1xuICB9XG5cbiAgc3RhcnRTdHJlYW1Db25uZWN0aW9uKGNsaWVudElkKSB7XG4gICAgdGhpcy5lYXN5cnRjLmNhbGwoXG4gICAgICBjbGllbnRJZCxcbiAgICAgIGZ1bmN0aW9uKGNhbGxlciwgbWVkaWEpIHtcbiAgICAgICAgaWYgKG1lZGlhID09PSBcImRhdGFjaGFubmVsXCIpIHtcbiAgICAgICAgICBOQUYubG9nLndyaXRlKFwiU3VjY2Vzc2Z1bGx5IHN0YXJ0ZWQgZGF0YWNoYW5uZWwgdG8gXCIsIGNhbGxlcik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihlcnJvckNvZGUsIGVycm9yVGV4dCkge1xuICAgICAgICBOQUYubG9nLmVycm9yKGVycm9yQ29kZSwgZXJyb3JUZXh0KTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbih3YXNBY2NlcHRlZCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndhcyBhY2NlcHRlZD1cIiArIHdhc0FjY2VwdGVkKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY2xvc2VTdHJlYW1Db25uZWN0aW9uKGNsaWVudElkKSB7XG4gICAgLy8gSGFuZGxlZCBieSBlYXN5cnRjXG4gIH1cblxuICBzZW5kRGF0YShjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpIHtcbiAgICAvLyBzZW5kIHZpYSB3ZWJydGMgb3RoZXJ3aXNlIGZhbGxiYWNrIHRvIHdlYnNvY2tldHNcbiAgICB0aGlzLmVhc3lydGMuc2VuZERhdGEoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKTtcbiAgfVxuXG4gIHNlbmREYXRhR3VhcmFudGVlZChjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpIHtcbiAgICB0aGlzLmVhc3lydGMuc2VuZERhdGFXUyhjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpO1xuICB9XG5cbiAgYnJvYWRjYXN0RGF0YShkYXRhVHlwZSwgZGF0YSkge1xuICAgIHZhciByb29tT2NjdXBhbnRzID0gdGhpcy5lYXN5cnRjLmdldFJvb21PY2N1cGFudHNBc01hcCh0aGlzLnJvb20pO1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBrZXlzIG9mIHRoZSBlYXN5cnRjIHJvb20gb2NjdXBhbnRzIG1hcC5cbiAgICAvLyBnZXRSb29tT2NjdXBhbnRzQXNBcnJheSB1c2VzIE9iamVjdC5rZXlzIHdoaWNoIGFsbG9jYXRlcyBtZW1vcnkuXG4gICAgZm9yICh2YXIgcm9vbU9jY3VwYW50IGluIHJvb21PY2N1cGFudHMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgcm9vbU9jY3VwYW50c1tyb29tT2NjdXBhbnRdICYmXG4gICAgICAgIHJvb21PY2N1cGFudCAhPT0gdGhpcy5lYXN5cnRjLm15RWFzeXJ0Y2lkXG4gICAgICApIHtcbiAgICAgICAgLy8gc2VuZCB2aWEgd2VicnRjIG90aGVyd2lzZSBmYWxsYmFjayB0byB3ZWJzb2NrZXRzXG4gICAgICAgIHRoaXMuZWFzeXJ0Yy5zZW5kRGF0YShyb29tT2NjdXBhbnQsIGRhdGFUeXBlLCBkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBicm9hZGNhc3REYXRhR3VhcmFudGVlZChkYXRhVHlwZSwgZGF0YSkge1xuICAgIHZhciBkZXN0aW5hdGlvbiA9IHsgdGFyZ2V0Um9vbTogdGhpcy5yb29tIH07XG4gICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhV1MoZGVzdGluYXRpb24sIGRhdGFUeXBlLCBkYXRhKTtcbiAgfVxuXG4gIGdldENvbm5lY3RTdGF0dXMoY2xpZW50SWQpIHtcbiAgICB2YXIgc3RhdHVzID0gdGhpcy5lYXN5cnRjLmdldENvbm5lY3RTdGF0dXMoY2xpZW50SWQpO1xuXG4gICAgaWYgKHN0YXR1cyA9PSB0aGlzLmVhc3lydGMuSVNfQ09OTkVDVEVEKSB7XG4gICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLklTX0NPTk5FQ1RFRDtcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PSB0aGlzLmVhc3lydGMuTk9UX0NPTk5FQ1RFRCkge1xuICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5OT1RfQ09OTkVDVEVEO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLkNPTk5FQ1RJTkc7XG4gICAgfVxuICB9XG5cbiAgZ2V0TWVkaWFTdHJlYW0oY2xpZW50SWQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgaWYgKHRoaXMuYXVkaW9TdHJlYW1zW2NsaWVudElkXSkge1xuICAgICAgTkFGLmxvZy53cml0ZShcIkFscmVhZHkgaGFkIGF1ZGlvIGZvciBcIiArIGNsaWVudElkKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5hdWRpb1N0cmVhbXNbY2xpZW50SWRdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgTkFGLmxvZy53cml0ZShcIldhaXRpbmcgb24gYXVkaW8gZm9yIFwiICsgY2xpZW50SWQpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgdGhhdC5wZW5kaW5nQXVkaW9SZXF1ZXN0W2NsaWVudElkXSA9IHJlc29sdmU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuZWFzeXJ0Yy5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZXNcbiAgICovXG5cbiAgX3N0b3JlQXVkaW9TdHJlYW0oZWFzeXJ0Y2lkLCBzdHJlYW0pIHtcbiAgICB0aGlzLmF1ZGlvU3RyZWFtc1tlYXN5cnRjaWRdID0gc3RyZWFtO1xuICAgIGlmICh0aGlzLnBlbmRpbmdBdWRpb1JlcXVlc3RbZWFzeXJ0Y2lkXSkge1xuICAgICAgTkFGLmxvZy53cml0ZShcImdvdCBwZW5kaW5nIGF1ZGlvIGZvciBcIiArIGVhc3lydGNpZCk7XG4gICAgICB0aGlzLnBlbmRpbmdBdWRpb1JlcXVlc3RbZWFzeXJ0Y2lkXShzdHJlYW0pO1xuICAgICAgZGVsZXRlIHRoaXMucGVuZGluZ0F1ZGlvUmVxdWVzdFtlYXN5cnRjaWRdKHN0cmVhbSk7XG4gICAgfVxuICB9XG5cbiAgX2Nvbm5lY3QoYXVkaW9FbmFibGVkLCBjb25uZWN0U3VjY2VzcywgY29ubmVjdEZhaWx1cmUpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLmVhc3lydGMuc2V0U3RyZWFtQWNjZXB0b3IodGhpcy5fc3RvcmVBdWRpb1N0cmVhbS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuZWFzeXJ0Yy5zZXRPblN0cmVhbUNsb3NlZChmdW5jdGlvbihlYXN5cnRjaWQpIHtcbiAgICAgIGRlbGV0ZSB0aGF0LmF1ZGlvU3RyZWFtc1tlYXN5cnRjaWRdO1xuICAgIH0pO1xuXG4gICAgaWYgKGF1ZGlvRW5hYmxlZCkge1xuICAgICAgdGhpcy5lYXN5cnRjLmluaXRNZWRpYVNvdXJjZShcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhhdC5lYXN5cnRjLmNvbm5lY3QodGhhdC5hcHAsIGNvbm5lY3RTdWNjZXNzLCBjb25uZWN0RmFpbHVyZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKGVycm9yQ29kZSwgZXJybWVzZykge1xuICAgICAgICAgIE5BRi5sb2cuZXJyb3IoZXJyb3JDb2RlLCBlcnJtZXNnKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5lYXN5cnRjLmNvbm5lY3QodGhhdC5hcHAsIGNvbm5lY3RTdWNjZXNzLCBjb25uZWN0RmFpbHVyZSk7XG4gICAgfVxuICB9XG5cbiAgX2dldFJvb21Kb2luVGltZShjbGllbnRJZCkge1xuICAgIHZhciBteVJvb21JZCA9IE5BRi5yb29tO1xuICAgIHZhciBqb2luVGltZSA9IHRoaXMuZWFzeXJ0Yy5nZXRSb29tT2NjdXBhbnRzQXNNYXAobXlSb29tSWQpW2NsaWVudElkXVxuICAgICAgLnJvb21Kb2luVGltZTtcbiAgICByZXR1cm4gam9pblRpbWU7XG4gIH1cblxuICBnZXRTZXJ2ZXJUaW1lKCkge1xuICAgIHJldHVybiBEYXRlLm5vdygpICsgdGhpcy5hdmdUaW1lT2Zmc2V0O1xuICB9XG59XG5cbk5BRi5hZGFwdGVycy5yZWdpc3RlcihcImVhc3lydGNcIiwgRWFzeVJ0Y0FkYXB0ZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVhc3lSdGNBZGFwdGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=