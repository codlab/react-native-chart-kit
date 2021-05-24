var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import React, { Component } from "react";
import { Defs, Line, LinearGradient, Stop, Text } from "react-native-svg";
export var DEFAULT_X_LABELS_HEIGHT_PERCENTAGE = 0.75;
var AbstractChart = /** @class */ (function(_super) {
  __extends(AbstractChart, _super);
  function AbstractChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.calcScaler = function(data) {
      if (_this.props.fromZero) {
        return (
          Math.max.apply(Math, __spreadArrays(data, [0])) -
            Math.min.apply(Math, __spreadArrays(data, [0])) || 1
        );
      } else if (_this.props.fromNumber) {
        return (
          Math.max.apply(Math, __spreadArrays(data, [_this.props.fromNumber])) -
            Math.min.apply(
              Math,
              __spreadArrays(data, [_this.props.fromNumber])
            ) || 1
        );
      } else {
        return Math.max.apply(Math, data) - Math.min.apply(Math, data) || 1;
      }
    };
    _this.calcBaseHeight = function(data, height) {
      var min = Math.min.apply(Math, data);
      var max = Math.max.apply(Math, data);
      if (min >= 0 && max >= 0) {
        return height;
      } else if (min < 0 && max <= 0) {
        return 0;
      } else if (min < 0 && max > 0) {
        return (height * max) / _this.calcScaler(data);
      }
    };
    _this.calcHeight = function(val, data, height) {
      var max = Math.max.apply(Math, data);
      var min = Math.min.apply(Math, data);
      if (min < 0 && max > 0) {
        return height * (val / _this.calcScaler(data));
      } else if (min >= 0 && max >= 0) {
        return _this.props.fromZero
          ? height * (val / _this.calcScaler(data))
          : height * ((val - min) / _this.calcScaler(data));
      } else if (min < 0 && max <= 0) {
        return _this.props.fromZero
          ? height * (val / _this.calcScaler(data))
          : height * ((val - max) / _this.calcScaler(data));
      }
    };
    _this.renderHorizontalLines = function(config) {
      var count = config.count,
        width = config.width,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _a === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _a;
      var basePosition = height * verticalLabelsHeightPercentage;
      return __spreadArrays(new Array(count + 1)).map(function(_, i) {
        var y = (basePosition / count) * i + paddingTop;
        return (
          <Line
            key={Math.random()}
            x1={paddingRight}
            y1={y}
            x2={width}
            y2={y}
            {..._this.getPropsForBackgroundLines()}
          />
        );
      });
    };
    _this.renderHorizontalLine = function(config) {
      var width = config.width,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _a === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _a;
      return (
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height * verticalLabelsHeightPercentage + paddingTop}
          x2={width}
          y2={height * verticalLabelsHeightPercentage + paddingTop}
          {..._this.getPropsForBackgroundLines()}
        />
      );
    };
    _this.renderHorizontalLabels = function(config) {
      var count = config.count,
        data = config.data,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.horizontalLabelRotation,
        horizontalLabelRotation = _a === void 0 ? 0 : _a,
        _b = config.decimalPlaces,
        decimalPlaces = _b === void 0 ? 2 : _b,
        _c = config.formatYLabel,
        formatYLabel =
          _c === void 0
            ? function(yLabel) {
                return yLabel;
              }
            : _c,
        _d = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _d === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _d;
      var _e = _this.props,
        _f = _e.yAxisLabel,
        yAxisLabel = _f === void 0 ? "" : _f,
        _g = _e.yAxisSuffix,
        yAxisSuffix = _g === void 0 ? "" : _g,
        _h = _e.yLabelsOffset,
        yLabelsOffset = _h === void 0 ? 12 : _h;
      return new Array(count === 1 ? 1 : count + 1).fill(1).map(function(_, i) {
        var yLabel = String(i * count);
        if (count === 1) {
          yLabel =
            "" +
            yAxisLabel +
            formatYLabel(data[0].toFixed(decimalPlaces)) +
            yAxisSuffix;
        } else {
          var label = _this.props.fromZero
            ? (_this.calcScaler(data) / count) * i +
              Math.min.apply(Math, __spreadArrays(data, [0]))
            : (_this.calcScaler(data) / count) * i + Math.min.apply(Math, data);
          yLabel =
            "" +
            yAxisLabel +
            formatYLabel(label.toFixed(decimalPlaces)) +
            yAxisSuffix;
        }
        var basePosition = height * verticalLabelsHeightPercentage;
        var x = paddingRight - yLabelsOffset;
        var y =
          count === 1 && _this.props.fromZero
            ? paddingTop + 4
            : height * verticalLabelsHeightPercentage -
              (basePosition / count) * i +
              paddingTop;
        return (
          <Text
            rotation={horizontalLabelRotation}
            origin={x + ", " + y}
            key={Math.random()}
            x={x}
            textAnchor="end"
            y={y}
            {..._this.getPropsForLabels()}
            {..._this.getPropsForHorizontalLabels()}
          >
            {yLabel}
          </Text>
        );
      });
    };
    _this.renderVerticalLabels = function(_a) {
      var _b = _a.labels,
        labels = _b === void 0 ? [] : _b,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        _c = _a.horizontalOffset,
        horizontalOffset = _c === void 0 ? 0 : _c,
        _d = _a.stackedBar,
        stackedBar = _d === void 0 ? false : _d,
        _e = _a.verticalLabelRotation,
        verticalLabelRotation = _e === void 0 ? 0 : _e,
        _f = _a.formatXLabel,
        formatXLabel =
          _f === void 0
            ? function(xLabel) {
                return xLabel;
              }
            : _f,
        _g = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _g === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _g;
      var _h = _this.props,
        _j = _h.xAxisLabel,
        xAxisLabel = _j === void 0 ? "" : _j,
        _k = _h.xLabelsOffset,
        xLabelsOffset = _k === void 0 ? 0 : _k,
        _l = _h.hidePointsAtIndex,
        hidePointsAtIndex = _l === void 0 ? [] : _l,
        renderLabelsEvenIfHidden = _h.renderLabelsEvenIfHidden;
      var fontSize = 12;
      var fac = 1;
      if (stackedBar) {
        fac = 0.71;
      }
      return labels.map(function(label, i) {
        if (hidePointsAtIndex.includes(i) && !renderLabelsEvenIfHidden) {
          return null;
        }
        var x =
          (((width - paddingRight) / labels.length) * i +
            paddingRight +
            horizontalOffset) *
          fac;
        var y =
          height * verticalLabelsHeightPercentage +
          paddingTop +
          fontSize * 2 +
          xLabelsOffset;
        return (
          <Text
            origin={x + ", " + y}
            rotation={verticalLabelRotation}
            key={Math.random()}
            x={x}
            y={y}
            textAnchor={verticalLabelRotation === 0 ? "middle" : "start"}
            {..._this.getPropsForLabels()}
            {..._this.getPropsForVerticalLabels()}
          >
            {"" + formatXLabel(label) + xAxisLabel}
          </Text>
        );
      });
    };
    _this.renderVerticalLines = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        verticalLinesInterval = _a.verticalLinesInterval,
        _b = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _b === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _b;
      var _c = _this.props.yAxisInterval,
        yAxisInterval = _c === void 0 ? 1 : _c;
      return __spreadArrays(new Array(Math.ceil(data.length / yAxisInterval)))
        .map(function(_, i) {
          if (verticalLinesInterval && i % verticalLinesInterval != 0) {
            return null;
          }
          return (
            <Line
              key={Math.random()}
              x1={Math.floor(
                ((width - paddingRight) / (data.length / yAxisInterval)) * i +
                  paddingRight
              )}
              y1={0}
              x2={Math.floor(
                ((width - paddingRight) / (data.length / yAxisInterval)) * i +
                  paddingRight
              )}
              y2={height * verticalLabelsHeightPercentage + paddingTop}
              {..._this.getPropsForBackgroundLines()}
            />
          );
        })
        .filter(function(d) {
          return !!d;
        });
    };
    _this.renderVerticalLine = function(_a) {
      var height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        _b = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _b === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _b;
      return (
        <Line
          key={Math.random()}
          x1={Math.floor(paddingRight)}
          y1={0}
          x2={Math.floor(paddingRight)}
          y2={height * verticalLabelsHeightPercentage + paddingTop}
          {..._this.getPropsForBackgroundLines()}
        />
      );
    };
    _this.renderDefs = function(config) {
      var width = config.width,
        height = config.height,
        backgroundGradientFrom = config.backgroundGradientFrom,
        backgroundGradientTo = config.backgroundGradientTo,
        useShadowColorFromDataset = config.useShadowColorFromDataset,
        data = config.data;
      var fromOpacity = config.hasOwnProperty("backgroundGradientFromOpacity")
        ? config.backgroundGradientFromOpacity
        : 1.0;
      var toOpacity = config.hasOwnProperty("backgroundGradientToOpacity")
        ? config.backgroundGradientToOpacity
        : 1.0;
      var fillShadowGradient = config.hasOwnProperty("fillShadowGradient")
        ? config.fillShadowGradient
        : _this.props.chartConfig.color(1.0);
      var fillShadowGradientOpacity = config.hasOwnProperty(
        "fillShadowGradientOpacity"
      )
        ? config.fillShadowGradientOpacity
        : 0.1;
      return (
        <Defs>
          <LinearGradient
            id="backgroundGradient"
            x1={0}
            y1={height}
            x2={width}
            y2={0}
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0"
              stopColor={backgroundGradientFrom}
              stopOpacity={fromOpacity}
            />
            <Stop
              offset="1"
              stopColor={backgroundGradientTo}
              stopOpacity={toOpacity}
            />
          </LinearGradient>
          {useShadowColorFromDataset ? (
            data.map(function(dataset, index) {
              return (
                <LinearGradient
                  id={"fillShadowGradient_" + index}
                  key={"" + index}
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={height}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop
                    offset="0"
                    stopColor={
                      dataset.color ? dataset.color(1.0) : fillShadowGradient
                    }
                    stopOpacity={fillShadowGradientOpacity}
                  />
                  <Stop
                    offset="1"
                    stopColor={
                      dataset.color
                        ? dataset.color(fillShadowGradientOpacity)
                        : fillShadowGradient
                    }
                    stopOpacity="0"
                  />
                </LinearGradient>
              );
            })
          ) : (
            <LinearGradient
              id="fillShadowGradient"
              x1={0}
              y1={0}
              x2={0}
              y2={height}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={fillShadowGradient}
                stopOpacity={fillShadowGradientOpacity}
              />
              <Stop offset="1" stopColor={fillShadowGradient} stopOpacity="0" />
            </LinearGradient>
          )}
        </Defs>
      );
    };
    return _this;
  }
  AbstractChart.prototype.getPropsForBackgroundLines = function() {
    var _a = this.props.chartConfig.propsForBackgroundLines,
      propsForBackgroundLines = _a === void 0 ? {} : _a;
    return __assign(
      {
        stroke: this.props.chartConfig.color(0.2),
        strokeDasharray: "5, 10",
        strokeWidth: 1
      },
      propsForBackgroundLines
    );
  };
  AbstractChart.prototype.getPropsForLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForLabels,
      propsForLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fontSize: 12, fill: labelColor(0.8) }, propsForLabels);
  };
  AbstractChart.prototype.getPropsForVerticalLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForVerticalLabels,
      propsForVerticalLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fill: labelColor(0.8) }, propsForVerticalLabels);
  };
  AbstractChart.prototype.getPropsForHorizontalLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForHorizontalLabels,
      propsForHorizontalLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fill: labelColor(0.8) }, propsForHorizontalLabels);
  };
  return AbstractChart;
})(Component);
export default AbstractChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWJzdHJhY3RDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BYnN0cmFjdENoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQXNDMUUsTUFBTSxDQUFDLElBQU0sa0NBQWtDLEdBQUcsSUFBSSxDQUFDO0FBRXZEO0lBR1UsaUNBQW1FO0lBSDdFO1FBQUEscUVBd2NDO1FBcGNDLGdCQUFVLEdBQUcsVUFBQyxJQUFjO1lBQzFCLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLE1BQUksSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUM7YUFDekQ7aUJBQU0sSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtnQkFDaEMsT0FBTyxDQUNMLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLE1BQ3JDLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUMsSUFBSSxDQUFDLENBQ2hELENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENB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S0FBSyxLQUNNLENBQUM7UUFDM0Isa0JBQ0UsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFDbEIsd0JBQXdCLEVBQzNCO0lBQ0osQ0FBQztJQTZXSCxvQkFBQztBQUFELENBQUMsQUF4Y0QsQ0FHVSxTQUFTLEdBcWNsQjtBQUVELGVBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgRGVmcywgTGluZSwgTGluZWFyR3JhZGllbnQsIFN0b3AsIFRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgeyBDaGFydENvbmZpZywgRGF0YXNldCwgUGFydGlhbEJ5IH0gZnJvbSBcIi4vSGVscGVyVHlwZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBmcm9tWmVybz86IGJvb2xlYW47XG4gIGZyb21OdW1iZXI/OiBudW1iZXI7XG4gIGNoYXJ0Q29uZmlnPzogQWJzdHJhY3RDaGFydENvbmZpZztcbiAgeUF4aXNMYWJlbD86IHN0cmluZztcbiAgeUF4aXNTdWZmaXg/OiBzdHJpbmc7XG4gIHlMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIHlBeGlzSW50ZXJ2YWw/OiBudW1iZXI7XG4gIHhBeGlzTGFiZWw/OiBzdHJpbmc7XG4gIHhMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIGhpZGVQb2ludHNBdEluZGV4PzogbnVtYmVyW107XG4gIHJlbmRlckxhYmVsc0V2ZW5JZkhpZGRlbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDaGFydENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcbiAgdmVydGljYWxMaW5lc0ludGVydmFsPzogbnVtYmVyLFxuICBjb3VudD86IG51bWJlcjtcbiAgZGF0YT86IERhdGFzZXRbXTtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgcGFkZGluZ1RvcD86IG51bWJlcjtcbiAgcGFkZGluZ1JpZ2h0PzogbnVtYmVyO1xuICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcbiAgZm9ybWF0WUxhYmVsPzogKHlMYWJlbDogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICBob3Jpem9udGFsT2Zmc2V0PzogbnVtYmVyO1xuICBzdGFja2VkQmFyPzogYm9vbGVhbjtcbiAgdmVydGljYWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICBmb3JtYXRYTGFiZWw/OiAoeExhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcbiAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlPzogbnVtYmVyO1xufVxuXG5leHBvcnQgdHlwZSBBYnN0cmFjdENoYXJ0U3RhdGUgPSB7fTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0UgPSAwLjc1O1xuXG5jbGFzcyBBYnN0cmFjdENoYXJ0PFxuICBJUHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMsXG4gIElTdGF0ZSBleHRlbmRzIEFic3RyYWN0Q2hhcnRTdGF0ZVxuPiBleHRlbmRzIENvbXBvbmVudDxBYnN0cmFjdENoYXJ0UHJvcHMgJiBJUHJvcHMsIEFic3RyYWN0Q2hhcnRTdGF0ZSAmIElTdGF0ZT4ge1xuICBjYWxjU2NhbGVyID0gKGRhdGE6IG51bWJlcltdKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuZnJvbVplcm8pIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCguLi5kYXRhLCAwKSAtIE1hdGgubWluKC4uLmRhdGEsIDApIHx8IDE7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmZyb21OdW1iZXIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIE1hdGgubWF4KC4uLmRhdGEsIHRoaXMucHJvcHMuZnJvbU51bWJlcikgLVxuICAgICAgICAgIE1hdGgubWluKC4uLmRhdGEsIHRoaXMucHJvcHMuZnJvbU51bWJlcikgfHwgMVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KC4uLmRhdGEpIC0gTWF0aC5taW4oLi4uZGF0YSkgfHwgMTtcbiAgICB9XG4gIH07XG5cbiAgY2FsY0Jhc2VIZWlnaHQgPSAoZGF0YTogbnVtYmVyW10sIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4uZGF0YSk7XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF0YSk7XG4gICAgaWYgKG1pbiA+PSAwICYmIG1heCA+PSAwKSB7XG4gICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH0gZWxzZSBpZiAobWluIDwgMCAmJiBtYXggPD0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA+IDApIHtcbiAgICAgIHJldHVybiAoaGVpZ2h0ICogbWF4KSAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKTtcbiAgICB9XG4gIH07XG5cbiAgY2FsY0hlaWdodCA9ICh2YWw6IG51bWJlciwgZGF0YTogbnVtYmVyW10sIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF0YSk7XG4gICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4uZGF0YSk7XG5cbiAgICBpZiAobWluIDwgMCAmJiBtYXggPiAwKSB7XG4gICAgICByZXR1cm4gaGVpZ2h0ICogKHZhbCAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSk7XG4gICAgfSBlbHNlIGlmIChtaW4gPj0gMCAmJiBtYXggPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgPyBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKVxuICAgICAgICA6IGhlaWdodCAqICgodmFsIC0gbWluKSAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSk7XG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA8PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5mcm9tWmVyb1xuICAgICAgICA/IGhlaWdodCAqICh2YWwgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpXG4gICAgICAgIDogaGVpZ2h0ICogKCh2YWwgLSBtYXgpIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKTtcbiAgICB9XG4gIH07XG5cbiAgZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKSB7XG4gICAgY29uc3QgeyBwcm9wc0ZvckJhY2tncm91bmRMaW5lcyA9IHt9IH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiB7XG4gICAgICBzdHJva2U6IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoMC4yKSxcbiAgICAgIHN0cm9rZURhc2hhcnJheTogXCI1LCAxMFwiLFxuICAgICAgc3Ryb2tlV2lkdGg6IDEsXG4gICAgICAuLi5wcm9wc0ZvckJhY2tncm91bmRMaW5lc1xuICAgIH07XG4gIH1cblxuICBnZXRQcm9wc0ZvckxhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0ZvckxhYmVscyA9IHt9LFxuICAgICAgY29sb3IsXG4gICAgICBsYWJlbENvbG9yID0gY29sb3JcbiAgICB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4ge1xuICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgZmlsbDogbGFiZWxDb2xvcigwLjgpLFxuICAgICAgLi4ucHJvcHNGb3JMYWJlbHNcbiAgICB9O1xuICB9XG5cbiAgZ2V0UHJvcHNGb3JWZXJ0aWNhbExhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0ZvclZlcnRpY2FsTGFiZWxzID0ge30sXG4gICAgICBjb2xvcixcbiAgICAgIGxhYmVsQ29sb3IgPSBjb2xvclxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiB7XG4gICAgICBmaWxsOiBsYWJlbENvbG9yKDAuOCksXG4gICAgICAuLi5wcm9wc0ZvclZlcnRpY2FsTGFiZWxzXG4gICAgfTtcbiAgfVxuXG4gIGdldFByb3BzRm9ySG9yaXpvbnRhbExhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0Zvckhvcml6b250YWxMYWJlbHMgPSB7fSxcbiAgICAgIGNvbG9yLFxuICAgICAgbGFiZWxDb2xvciA9IGNvbG9yXG4gICAgfSA9IHRoaXMucHJvcHMuY2hhcnRDb25maWc7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGw6IGxhYmVsQ29sb3IoMC44KSxcbiAgICAgIC4uLnByb3BzRm9ySG9yaXpvbnRhbExhYmVsc1xuICAgIH07XG4gIH1cblxuICByZW5kZXJIb3Jpem9udGFsTGluZXMgPSBjb25maWcgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvdW50LFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICAgIH0gPSBjb25maWc7XG4gICAgY29uc3QgYmFzZVBvc2l0aW9uID0gaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlO1xuXG4gICAgcmV0dXJuIFsuLi5uZXcgQXJyYXkoY291bnQgKyAxKV0ubWFwKChfLCBpKSA9PiB7XG4gICAgICBjb25zdCB5ID0gKGJhc2VQb3NpdGlvbiAvIGNvdW50KSAqIGkgKyBwYWRkaW5nVG9wO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPExpbmVcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgeDE9e3BhZGRpbmdSaWdodH1cbiAgICAgICAgICB5MT17eX1cbiAgICAgICAgICB4Mj17d2lkdGh9XG4gICAgICAgICAgeTI9e3l9XG4gICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVySG9yaXpvbnRhbExpbmUgPSBjb25maWcgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcGFkZGluZ1RvcCxcbiAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgICB9ID0gY29uZmlnO1xuICAgIHJldHVybiAoXG4gICAgICA8TGluZVxuICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgIHgxPXtwYWRkaW5nUmlnaHR9XG4gICAgICAgIHkxPXtoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgKyBwYWRkaW5nVG9wfVxuICAgICAgICB4Mj17d2lkdGh9XG4gICAgICAgIHkyPXtoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgKyBwYWRkaW5nVG9wfVxuICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpfVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIHJlbmRlckhvcml6b250YWxMYWJlbHMgPSAoXG4gICAgY29uZmlnOiBPbWl0PEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPiAmIHsgZGF0YTogbnVtYmVyW10gfVxuICApID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBjb3VudCxcbiAgICAgIGRhdGEsXG4gICAgICBoZWlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24gPSAwLFxuICAgICAgZGVjaW1hbFBsYWNlcyA9IDIsXG4gICAgICBmb3JtYXRZTGFiZWwgPSAoeUxhYmVsOiBzdHJpbmcpID0+IHlMYWJlbCxcbiAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3Qge1xuICAgICAgeUF4aXNMYWJlbCA9IFwiXCIsXG4gICAgICB5QXhpc1N1ZmZpeCA9IFwiXCIsXG4gICAgICB5TGFiZWxzT2Zmc2V0ID0gMTJcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gbmV3IEFycmF5KGNvdW50ID09PSAxID8gMSA6IGNvdW50ICsgMSkuZmlsbCgxKS5tYXAoKF8sIGkpID0+IHtcbiAgICAgIGxldCB5TGFiZWwgPSBTdHJpbmcoaSAqIGNvdW50KTtcblxuICAgICAgaWYgKGNvdW50ID09PSAxKSB7XG4gICAgICAgIHlMYWJlbCA9IGAke3lBeGlzTGFiZWx9JHtmb3JtYXRZTGFiZWwoXG4gICAgICAgICAgZGF0YVswXS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpXG4gICAgICAgICl9JHt5QXhpc1N1ZmZpeH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLnByb3BzLmZyb21aZXJvXG4gICAgICAgICAgPyAodGhpcy5jYWxjU2NhbGVyKGRhdGEpIC8gY291bnQpICogaSArIE1hdGgubWluKC4uLmRhdGEsIDApXG4gICAgICAgICAgOiAodGhpcy5jYWxjU2NhbGVyKGRhdGEpIC8gY291bnQpICogaSArIE1hdGgubWluKC4uLmRhdGEpO1xuICAgICAgICB5TGFiZWwgPSBgJHt5QXhpc0xhYmVsfSR7Zm9ybWF0WUxhYmVsKFxuICAgICAgICAgIGxhYmVsLnRvRml4ZWQoZGVjaW1hbFBsYWNlcylcbiAgICAgICAgKX0ke3lBeGlzU3VmZml4fWA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJhc2VQb3NpdGlvbiA9IGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZTtcbiAgICAgIGNvbnN0IHggPSBwYWRkaW5nUmlnaHQgLSB5TGFiZWxzT2Zmc2V0O1xuICAgICAgY29uc3QgeSA9XG4gICAgICAgIGNvdW50ID09PSAxICYmIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgICA/IHBhZGRpbmdUb3AgKyA0XG4gICAgICAgICAgOiBoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgLVxuICAgICAgICAgICAgKGJhc2VQb3NpdGlvbiAvIGNvdW50KSAqIGkgK1xuICAgICAgICAgICAgcGFkZGluZ1RvcDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUZXh0XG4gICAgICAgICAgcm90YXRpb249e2hvcml6b250YWxMYWJlbFJvdGF0aW9ufVxuICAgICAgICAgIG9yaWdpbj17YCR7eH0sICR7eX1gfVxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICB4PXt4fVxuICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIlxuICAgICAgICAgIHk9e3l9XG4gICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKX1cbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0Zvckhvcml6b250YWxMYWJlbHMoKX1cbiAgICAgICAgPlxuICAgICAgICAgIHt5TGFiZWx9XG4gICAgICAgIDwvVGV4dD5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyVmVydGljYWxMYWJlbHMgPSAoe1xuICAgIGxhYmVscyA9IFtdLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBob3Jpem9udGFsT2Zmc2V0ID0gMCxcbiAgICBzdGFja2VkQmFyID0gZmFsc2UsXG4gICAgdmVydGljYWxMYWJlbFJvdGF0aW9uID0gMCxcbiAgICBmb3JtYXRYTGFiZWwgPSB4TGFiZWwgPT4geExhYmVsLFxuICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIHwgXCJsYWJlbHNcIlxuICAgIHwgXCJ3aWR0aFwiXG4gICAgfCBcImhlaWdodFwiXG4gICAgfCBcInBhZGRpbmdSaWdodFwiXG4gICAgfCBcInBhZGRpbmdUb3BcIlxuICAgIHwgXCJob3Jpem9udGFsT2Zmc2V0XCJcbiAgICB8IFwic3RhY2tlZEJhclwiXG4gICAgfCBcInZlcnRpY2FsTGFiZWxSb3RhdGlvblwiXG4gICAgfCBcImZvcm1hdFhMYWJlbFwiXG4gICAgfCBcInZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZVwiXG4gID4pID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB4QXhpc0xhYmVsID0gXCJcIixcbiAgICAgIHhMYWJlbHNPZmZzZXQgPSAwLFxuICAgICAgaGlkZVBvaW50c0F0SW5kZXggPSBbXSxcbiAgICAgIHJlbmRlckxhYmVsc0V2ZW5JZkhpZGRlblxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgZm9udFNpemUgPSAxMjtcblxuICAgIGxldCBmYWMgPSAxO1xuICAgIGlmIChzdGFja2VkQmFyKSB7XG4gICAgICBmYWMgPSAwLjcxO1xuICAgIH1cblxuICAgIHJldHVybiBsYWJlbHMubWFwKChsYWJlbCwgaSkgPT4ge1xuICAgICAgaWYgKGhpZGVQb2ludHNBdEluZGV4LmluY2x1ZGVzKGkpICYmICFyZW5kZXJMYWJlbHNFdmVuSWZIaWRkZW4pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHggPVxuICAgICAgICAoKCh3aWR0aCAtIHBhZGRpbmdSaWdodCkgLyBsYWJlbHMubGVuZ3RoKSAqIGkgK1xuICAgICAgICAgIHBhZGRpbmdSaWdodCArXG4gICAgICAgICAgaG9yaXpvbnRhbE9mZnNldCkgKlxuICAgICAgICBmYWM7XG5cbiAgICAgIGNvbnN0IHkgPVxuICAgICAgICBoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgK1xuICAgICAgICBwYWRkaW5nVG9wICtcbiAgICAgICAgZm9udFNpemUgKiAyICtcbiAgICAgICAgeExhYmVsc09mZnNldDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRleHRcbiAgICAgICAgICBvcmlnaW49e2Ake3h9LCAke3l9YH1cbiAgICAgICAgICByb3RhdGlvbj17dmVydGljYWxMYWJlbFJvdGF0aW9ufVxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICB4PXt4fVxuICAgICAgICAgIHk9e3l9XG4gICAgICAgICAgdGV4dEFuY2hvcj17dmVydGljYWxMYWJlbFJvdGF0aW9uID09PSAwID8gXCJtaWRkbGVcIiA6IFwic3RhcnRcIn1cbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckxhYmVscygpfVxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yVmVydGljYWxMYWJlbHMoKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtgJHtmb3JtYXRYTGFiZWwobGFiZWwpfSR7eEF4aXNMYWJlbH1gfVxuICAgICAgICA8L1RleHQ+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlclZlcnRpY2FsTGluZXMgPSAoe1xuICAgIGRhdGEsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHZlcnRpY2FsTGluZXNJbnRlcnZhbCxcbiAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXG4gIH06IE9taXQ8XG4gICAgUGljazxcbiAgICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgICB8IFwiZGF0YVwiXG4gICAgICB8IFwid2lkdGhcIlxuICAgICAgfCBcImhlaWdodFwiXG4gICAgICB8IFwicGFkZGluZ1JpZ2h0XCJcbiAgICAgIHwgXCJwYWRkaW5nVG9wXCJcbiAgICAgIHwgXCJ2ZXJ0aWNhbExpbmVzSW50ZXJ2YWxcIlxuICAgICAgfCBcInZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZVwiXG4gICAgPixcbiAgICBcImRhdGFcIlxuICA+ICYgeyBkYXRhOiBudW1iZXJbXSB9KSA9PiB7XG4gICAgY29uc3QgeyB5QXhpc0ludGVydmFsID0gMSB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBbLi4ubmV3IEFycmF5KE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIHlBeGlzSW50ZXJ2YWwpKV0ubWFwKFxuICAgICAgKF8sIGkpID0+IHtcbiAgICAgICAgaWYodmVydGljYWxMaW5lc0ludGVydmFsICYmIGkgJSB2ZXJ0aWNhbExpbmVzSW50ZXJ2YWwgIT0gMCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPExpbmVcbiAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICAgIHgxPXtNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIChkYXRhLmxlbmd0aCAvIHlBeGlzSW50ZXJ2YWwpKSAqIGkgK1xuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHkxPXswfVxuICAgICAgICAgICAgeDI9e01hdGguZmxvb3IoXG4gICAgICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gKGRhdGEubGVuZ3RoIC8geUF4aXNJbnRlcnZhbCkpICogaSArXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgeTI9e2hlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArIHBhZGRpbmdUb3B9XG4gICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpfVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKS5maWx0ZXIoZCA9PiAhIWQpO1xuICB9O1xuXG4gIHJlbmRlclZlcnRpY2FsTGluZSA9ICh7XG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcInZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZVwiXG4gID4pID0+IChcbiAgICA8TGluZVxuICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgeDE9e01hdGguZmxvb3IocGFkZGluZ1JpZ2h0KX1cbiAgICAgIHkxPXswfVxuICAgICAgeDI9e01hdGguZmxvb3IocGFkZGluZ1JpZ2h0KX1cbiAgICAgIHkyPXtoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgKyBwYWRkaW5nVG9wfVxuICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cbiAgICAvPlxuICApO1xuXG4gIHJlbmRlckRlZnMgPSAoXG4gICAgY29uZmlnOiBQaWNrPFxuICAgICAgUGFydGlhbEJ5PFxuICAgICAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHlcIlxuICAgICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCJcbiAgICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudFwiXG4gICAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XCJcbiAgICAgID4sXG4gICAgICB8IFwid2lkdGhcIlxuICAgICAgfCBcImhlaWdodFwiXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbVwiXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9cIlxuICAgICAgfCBcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIlxuICAgICAgfCBcImRhdGFcIlxuICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XCJcbiAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHlcIlxuICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudFwiXG4gICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVwiXG4gICAgPlxuICApID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGJhY2tncm91bmRHcmFkaWVudEZyb20sXG4gICAgICBiYWNrZ3JvdW5kR3JhZGllbnRUbyxcbiAgICAgIHVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXQsXG4gICAgICBkYXRhXG4gICAgfSA9IGNvbmZpZztcblxuICAgIGNvbnN0IGZyb21PcGFjaXR5ID0gY29uZmlnLmhhc093blByb3BlcnR5KFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHlcIilcbiAgICAgID8gY29uZmlnLmJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XG4gICAgICA6IDEuMDtcbiAgICBjb25zdCB0b09wYWNpdHkgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXCJiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHlcIilcbiAgICAgID8gY29uZmlnLmJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVxuICAgICAgOiAxLjA7XG5cbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnQgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXCJmaWxsU2hhZG93R3JhZGllbnRcIilcbiAgICAgID8gY29uZmlnLmZpbGxTaGFkb3dHcmFkaWVudFxuICAgICAgOiB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKDEuMCk7XG5cbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5ID0gY29uZmlnLmhhc093blByb3BlcnR5KFxuICAgICAgXCJmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XCJcbiAgICApXG4gICAgICA/IGNvbmZpZy5maWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XG4gICAgICA6IDAuMTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RGVmcz5cbiAgICAgICAgPExpbmVhckdyYWRpZW50XG4gICAgICAgICAgaWQ9XCJiYWNrZ3JvdW5kR3JhZGllbnRcIlxuICAgICAgICAgIHgxPXswfVxuICAgICAgICAgIHkxPXtoZWlnaHR9XG4gICAgICAgICAgeDI9e3dpZHRofVxuICAgICAgICAgIHkyPXswfVxuICAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8U3RvcFxuICAgICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICAgICBzdG9wQ29sb3I9e2JhY2tncm91bmRHcmFkaWVudEZyb219XG4gICAgICAgICAgICBzdG9wT3BhY2l0eT17ZnJvbU9wYWNpdHl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U3RvcFxuICAgICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICAgICBzdG9wQ29sb3I9e2JhY2tncm91bmRHcmFkaWVudFRvfVxuICAgICAgICAgICAgc3RvcE9wYWNpdHk9e3RvT3BhY2l0eX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxuICAgICAgICB7dXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldCA/IChcbiAgICAgICAgICBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxMaW5lYXJHcmFkaWVudFxuICAgICAgICAgICAgICBpZD17YGZpbGxTaGFkb3dHcmFkaWVudF8ke2luZGV4fWB9XG4gICAgICAgICAgICAgIGtleT17YCR7aW5kZXh9YH1cbiAgICAgICAgICAgICAgeDE9ezB9XG4gICAgICAgICAgICAgIHkxPXswfVxuICAgICAgICAgICAgICB4Mj17MH1cbiAgICAgICAgICAgICAgeTI9e2hlaWdodH1cbiAgICAgICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgICAgICAgICBzdG9wQ29sb3I9e1xuICAgICAgICAgICAgICAgICAgZGF0YXNldC5jb2xvciA/IGRhdGFzZXQuY29sb3IoMS4wKSA6IGZpbGxTaGFkb3dHcmFkaWVudFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdG9wT3BhY2l0eT17ZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgICAgICAgICBzdG9wQ29sb3I9e1xuICAgICAgICAgICAgICAgICAgZGF0YXNldC5jb2xvclxuICAgICAgICAgICAgICAgICAgICA/IGRhdGFzZXQuY29sb3IoZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eSlcbiAgICAgICAgICAgICAgICAgICAgOiBmaWxsU2hhZG93R3JhZGllbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RvcE9wYWNpdHk9XCIwXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvTGluZWFyR3JhZGllbnQ+XG4gICAgICAgICAgKSlcbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8TGluZWFyR3JhZGllbnRcbiAgICAgICAgICAgIGlkPVwiZmlsbFNoYWRvd0dyYWRpZW50XCJcbiAgICAgICAgICAgIHgxPXswfVxuICAgICAgICAgICAgeTE9ezB9XG4gICAgICAgICAgICB4Mj17MH1cbiAgICAgICAgICAgIHkyPXtoZWlnaHR9XG4gICAgICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdG9wXG4gICAgICAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgICAgICBzdG9wQ29sb3I9e2ZpbGxTaGFkb3dHcmFkaWVudH1cbiAgICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2ZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFN0b3Agb2Zmc2V0PVwiMVwiIHN0b3BDb2xvcj17ZmlsbFNoYWRvd0dyYWRpZW50fSBzdG9wT3BhY2l0eT1cIjBcIiAvPlxuICAgICAgICAgIDwvTGluZWFyR3JhZGllbnQ+XG4gICAgICAgICl9XG4gICAgICA8L0RlZnM+XG4gICAgKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RDaGFydDtcbiJdfQ==
