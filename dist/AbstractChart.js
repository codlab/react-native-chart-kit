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
      var labelProps = __assign(
        __assign({}, _this.getPropsForLabels()),
        _this.getPropsForVerticalLabels()
      );
      var rawFontSize = labelProps.fontSize;
      var tf = rawFontSize ? parseInt("" + rawFontSize) : 12;
      if (isNaN(tf)) tf = 12;
      var fontSize = tf || 12;
      labelProps.fontSize = fontSize;
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
            {...labelProps}
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
          if (
            i == 0 ||
            (verticalLinesInterval && i % verticalLinesInterval != 0)
          ) {
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
      labelColor = _c === void 0 ? color : _c,
      fontSize = _a.fontSize;
    return __assign(
      { fontSize: fontSize || 12, fill: labelColor(0.8) },
      propsForLabels
    );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWJzdHJhY3RDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BYnN0cmFjdENoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQXVDMUUsTUFBTSxDQUFDLElBQU0sa0NBQWtDLEdBQUcsSUFBSSxDQUFDO0FBRXZEO0lBR1UsaUNBQW1FO0lBSDdFO1FBQUEscUVBcWRDO1FBamRDLGdCQUFVLEdBQUcsVUFBQyxJQUFjO1lBQzFCLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLE1BQUksSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUM7YUFDekQ7aUJBQU0sSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtnQkFDaEMsT0FBTyxDQUNMLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLE1BQ3JDLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUMsSUFBSSxDQUFDLENBQ2hELENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbkQ7UUFDSCxDQUFDLENBQUM7UUFFRixvQkFBYyxHQUFHLFVBQUMsSUFBYyxFQUFFLE1BQWM7WUFDOUMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hCLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7aUJBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7Z0JBQzlCLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7aUJBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7Z0JBQzdCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvQztRQUNILENBQUMsQ0FBQztRQUVGLGdCQUFVLEdBQUcsVUFBQyxHQUFXLEVBQUUsSUFBYyxFQUFFLE1BQWM7WUFDdkQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsSUFBSSxDQUFDLENBQUM7WUFFOUIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLE9BQU8sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUMvQztpQkFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtnQkFDL0IsT0FBTyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7b0JBQ3hCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDeEMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNwRDtpQkFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtnQkFDOUIsT0FBTyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7b0JBQ3hCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDeEMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNwRDtRQUNILENBQUMsQ0FBQztRQWtERiwyQkFBcUIsR0FBRyxVQUFBLE1BQU07WUFFMUIsSUFBQSxLQUFLLEdBTUgsTUFBTSxNQU5ILEVBQ0wsS0FBSyxHQUtILE1BQU0sTUFMSCxFQUNMLE1BQU0sR0FJSixNQUFNLE9BSkYsRUFDTixVQUFVLEdBR1IsTUFBTSxXQUhFLEVBQ1YsWUFBWSxHQUVWLE1BQU0sYUFGSSxFQUNaLEtBQ0UsTUFBTSwrQkFEMkQsRUFBbkUsOEJBQThCLG1CQUFHLGtDQUFrQyxLQUFBLENBQzFEO1lBQ1gsSUFBTSxZQUFZLEdBQUcsTUFBTSxHQUFHLDhCQUE4QixDQUFDO1lBRTdELE9BQU8sZUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3hDLElBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7Z0JBQ2xELE9BQU8sQ0FDTCxDQUFDLElBQUksQ0FDSCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FDbkIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ2pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNOLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNOLElBQUksS0FBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsRUFDdEMsQ0FDSCxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRiwwQkFBb0IsR0FBRyxVQUFBLE1BQU07WUFFekIsSUFBQSxLQUFLLEdBS0gsTUFBTSxNQUxILEVBQ0wsTUFBTSxHQUlKLE1BQU0sT0FKRixFQUNOLFVBQVUsR0FHUixNQUFNLFdBSEUsRUFDVixZQUFZLEdBRVYsTUFBTSxhQUZJLEVBQ1osS0FDRSxNQUFNLCtCQUQyRCxFQUFuRSw4QkFBOEIsbUJBQUcsa0NBQWtDLEtBQUEsQ0FDMUQ7WUFDWCxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQ0gsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQ25CLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUNqQixFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsOEJBQThCLEdBQUcsVUFBVSxDQUFDLENBQ3pELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNWLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyw4QkFBOEIsR0FBRyxVQUFVLENBQUMsQ0FDekQsSUFBSSxLQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxFQUN0QyxDQUNILENBQUM7UUFDSixDQUFDLENBQUM7UUFFRiw0QkFBc0IsR0FBRyxVQUN2QixNQUE4RDtZQUc1RCxJQUFBLEtBQUssR0FTSCxNQUFNLE1BVEgsRUFDTCxJQUFJLEdBUUYsTUFBTSxLQVJKLEVBQ0osTUFBTSxHQU9KLE1BQU0sT0FQRixFQUNOLFVBQVUsR0FNUixNQUFNLFdBTkUsRUFDVixZQUFZLEdBS1YsTUFBTSxhQUxJLEVBQ1osS0FJRSxNQUFNLHdCQUptQixFQUEzQix1QkFBdUIsbUJBQUcsQ0FBQyxLQUFBLEVBQzNCLEtBR0UsTUFBTSxjQUhTLEVBQWpCLGFBQWEsbUJBQUcsQ0FBQyxLQUFBLEVBQ2pCLEtBRUUsTUFBTSxhQUZpQyxFQUF6QyxZQUFZLG1CQUFHLFVBQUMsTUFBYyxJQUFLLE9BQUEsTUFBTSxFQUFOLENBQU0sS0FBQSxFQUN6QyxLQUNFLE1BQU0sK0JBRDJELEVBQW5FLDhCQUE4QixtQkFBRyxrQ0FBa0MsS0FBQSxDQUMxRDtZQUVMLElBQUEsS0FJRixLQUFJLENBQUMsS0FBSyxFQUhaLGtCQUFlLEVBQWYsVUFBVSxtQkFBRyxFQUFFLEtBQUEsRUFDZixtQkFBZ0IsRUFBaEIsV0FBVyxtQkFBRyxFQUFFLEtBQUEsRUFDaEIscUJBQWtCLEVBQWxCLGFBQWEsbUJBQUcsRUFBRSxLQUNOLENBQUM7WUFDZixPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztnQkFDN0QsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFFL0IsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO29CQUNmLE1BQU0sR0FBRyxLQUFHLFVBQVUsR0FBRyxZQUFZLENBQ25DLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQy9CLEdBQUcsV0FBYSxDQUFDO2lCQUNuQjtxQkFBTTtvQkFDTCxJQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7d0JBQy9CLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsQ0FBQyxHQUFDO3dCQUM1RCxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxJQUFJLENBQUMsQ0FBQztvQkFDNUQsTUFBTSxHQUFHLEtBQUcsVUFBVSxHQUFHLFlBQVksQ0FDbkMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FDN0IsR0FBRyxXQUFhLENBQUM7aUJBQ25CO2dCQUVELElBQU0sWUFBWSxHQUFHLE1BQU0sR0FBRyw4QkFBOEIsQ0FBQztnQkFDN0QsSUFBTSxDQUFDLEdBQUcsWUFBWSxHQUFHLGFBQWEsQ0FBQztnQkFDdkMsSUFBTSxDQUFDLEdBQ0wsS0FBSyxLQUFLLENBQUMsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7b0JBQ2hDLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQztvQkFDaEIsQ0FBQyxDQUFDLE1BQU0sR0FBRyw4QkFBOEI7d0JBQ3ZDLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7d0JBQzFCLFVBQVUsQ0FBQztnQkFDakIsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUNILFFBQVEsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQ2xDLE1BQU0sQ0FBQyxDQUFJLENBQUMsVUFBSyxDQUFHLENBQUMsQ0FDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNMLFVBQVUsQ0FBQyxLQUFLLENBQ2hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNMLElBQUksS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FDN0IsSUFBSSxLQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQyxDQUV2QztVQUFBLENBQUMsTUFBTSxDQUNUO1FBQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRiwwQkFBb0IsR0FBRyxVQUFDLEVBdUJ2QjtnQkF0QkMsY0FBVyxFQUFYLE1BQU0sbUJBQUcsRUFBRSxLQUFBLEVBQ1gsS0FBSyxXQUFBLEVBQ0wsTUFBTSxZQUFBLEVBQ04sWUFBWSxrQkFBQSxFQUNaLFVBQVUsZ0JBQUEsRUFDVix3QkFBb0IsRUFBcEIsZ0JBQWdCLG1CQUFHLENBQUMsS0FBQSxFQUNwQixrQkFBa0IsRUFBbEIsVUFBVSxtQkFBRyxLQUFLLEtBQUEsRUFDbEIsNkJBQXlCLEVBQXpCLHFCQUFxQixtQkFBRyxDQUFDLEtBQUEsRUFDekIsb0JBQStCLEVBQS9CLFlBQVksbUJBQUcsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLEVBQU4sQ0FBTSxLQUFBLEVBQy9CLHNDQUFtRSxFQUFuRSw4QkFBOEIsbUJBQUcsa0NBQWtDLEtBQUE7WUFjN0QsSUFBQSxLQUtGLEtBQUksQ0FBQyxLQUFLLEVBSlosa0JBQWUsRUFBZixVQUFVLG1CQUFHLEVBQUUsS0FBQSxFQUNmLHFCQUFpQixFQUFqQixhQUFhLG1CQUFHLENBQUMsS0FBQSxFQUNqQix5QkFBc0IsRUFBdEIsaUJBQWlCLG1CQUFHLEVBQUUsS0FBQSxFQUN0Qix3QkFBd0IsOEJBQ1osQ0FBQztZQUVmLElBQU0sVUFBVSx5QkFDWCxLQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FDeEIsS0FBSSxDQUFDLHlCQUF5QixFQUFFLENBQ3BDLENBQUM7WUFFRixJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBRXRDLElBQUksRUFBRSxHQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUcsV0FBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMvRCxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFNLFFBQVEsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1lBQzFCLFVBQVUsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBRS9CLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksVUFBVSxFQUFFO2dCQUNkLEdBQUcsR0FBRyxJQUFJLENBQUM7YUFDWjtZQUVELE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN6QixJQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFO29CQUM5RCxPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFFRCxJQUFNLENBQUMsR0FDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7b0JBQzNDLFlBQVk7b0JBQ1osZ0JBQWdCLENBQUM7b0JBQ25CLEdBQUcsQ0FBQztnQkFFTixJQUFNLENBQUMsR0FDTCxNQUFNLEdBQUcsOEJBQThCO29CQUN2QyxVQUFVO29CQUNWLFFBQVEsR0FBRyxDQUFDO29CQUNaLGFBQWEsQ0FBQztnQkFFaEIsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUNILE1BQU0sQ0FBQyxDQUFJLENBQUMsVUFBSyxDQUFHLENBQUMsQ0FDckIsUUFBUSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNMLFVBQVUsQ0FBQyxDQUFDLHFCQUFxQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDN0QsSUFBSSxVQUFVLENBQUMsQ0FFZjtVQUFBLENBQUMsS0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBWSxDQUN4QztRQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYseUJBQW1CLEdBQUcsVUFBQyxFQW9CRDtnQkFuQnBCLElBQUksVUFBQSxFQUNKLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFVBQVUsZ0JBQUEsRUFDVixZQUFZLGtCQUFBLEVBQ1oscUJBQXFCLDJCQUFBLEVBQ3JCLHNDQUFtRSxFQUFuRSw4QkFBOEIsbUJBQUcsa0NBQWtDLEtBQUE7WUFjM0QsSUFBQSxLQUFzQixLQUFJLENBQUMsS0FBSyxjQUFmLEVBQWpCLGFBQWEsbUJBQUcsQ0FBQyxLQUFBLENBQWdCO1lBRXpDLE9BQU8sZUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUMsRUFDekQsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ1IsSUFDRSxDQUFDLElBQUksQ0FBQztvQkFDTixDQUFDLHFCQUFxQixJQUFJLENBQUMsR0FBRyxxQkFBcUIsSUFBSSxDQUFDLENBQUMsRUFDekQ7b0JBQ0EsT0FBTyxJQUFJLENBQUM7aUJBQ2I7Z0JBQ0QsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUNILEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUNaLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFDMUQsWUFBWSxDQUNmLENBQUMsQ0FDRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUNaLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFDMUQsWUFBWSxDQUNmLENBQUMsQ0FDRixFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsOEJBQThCLEdBQUcsVUFBVSxDQUFDLENBQ3pELElBQUksS0FBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsRUFDdEMsQ0FDSCxDQUFDO1lBQ0osQ0FBQyxDQUFDO2lCQUNELE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDO1FBRUYsd0JBQWtCLEdBQUcsVUFBQyxFQVFyQjtnQkFQQyxNQUFNLFlBQUEsRUFDTixVQUFVLGdCQUFBLEVBQ1YsWUFBWSxrQkFBQSxFQUNaLHNDQUFtRSxFQUFuRSw4QkFBOEIsbUJBQUcsa0NBQWtDLEtBQUE7WUFJL0QsT0FBQSxDQUNKLENBQUMsSUFBSSxDQUNILEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNOLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FDN0IsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLDhCQUE4QixHQUFHLFVBQVUsQ0FBQyxDQUN6RCxJQUFJLEtBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLEVBQ3RDLENBQ0g7UUFUSyxDQVNMLENBQUM7UUFFRixnQkFBVSxHQUFHLFVBQ1gsTUFrQkM7WUFHQyxJQUFBLEtBQUssR0FNSCxNQUFNLE1BTkgsRUFDTCxNQUFNLEdBS0osTUFBTSxPQUxGLEVBQ04sc0JBQXNCLEdBSXBCLE1BQU0sdUJBSmMsRUFDdEIsb0JBQW9CLEdBR2xCLE1BQU0scUJBSFksRUFDcEIseUJBQXlCLEdBRXZCLE1BQU0sMEJBRmlCLEVBQ3pCLElBQUksR0FDRixNQUFNLEtBREosQ0FDSztZQUVYLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsK0JBQStCLENBQUM7Z0JBQ3hFLENBQUMsQ0FBQyxNQUFNLENBQUMsNkJBQTZCO2dCQUN0QyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ1IsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQztnQkFDcEUsQ0FBQyxDQUFDLE1BQU0sQ0FBQywyQkFBMkI7Z0JBQ3BDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFFUixJQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUM7Z0JBQ3BFLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCO2dCQUMzQixDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXRDLElBQU0seUJBQXlCLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FDckQsMkJBQTJCLENBQzVCO2dCQUNDLENBQUMsQ0FBQyxNQUFNLENBQUMseUJBQXlCO2dCQUNsQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBRVIsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUNIO1FBQUEsQ0FBQyxjQUFjLENBQ2IsRUFBRSxDQUFDLG9CQUFvQixDQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDWCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDVixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixhQUFhLENBQUMsZ0JBQWdCLENBRTlCO1VBQUEsQ0FBQyxJQUFJLENBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FDVixTQUFTLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUNsQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFFM0I7VUFBQSxDQUFDLElBQUksQ0FDSCxNQUFNLENBQUMsR0FBRyxDQUNWLFNBQVMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQ2hDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUUzQjtRQUFBLEVBQUUsY0FBYyxDQUNoQjtRQUFBLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSyxJQUFLLE9BQUEsQ0FDM0IsQ0FBQyxjQUFjLENBQ2IsRUFBRSxDQUFDLENBQUMsd0JBQXNCLEtBQU8sQ0FBQyxDQUNsQyxHQUFHLENBQUMsQ0FBQyxLQUFHLEtBQU8sQ0FBQyxDQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDWCxhQUFhLENBQUMsZ0JBQWdCLENBRTlCO2NBQUEsQ0FBQyxJQUFJLENBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FDVixTQUFTLENBQUMsQ0FDUixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FDeEQsQ0FDRCxXQUFXLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxFQUV6QztjQUFBLENBQUMsSUFBSSxDQUNILE1BQU0sQ0FBQyxHQUFHLENBQ1YsU0FBUyxDQUFDLENBQ1IsT0FBTyxDQUFDLEtBQUs7Z0JBQ1gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUM7Z0JBQzFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FDdkIsQ0FDRCxXQUFXLENBQUMsR0FBRyxFQUVuQjtZQUFBLEVBQUUsY0FBYyxDQUFDLENBQ2xCLEVBM0I0QixDQTJCNUIsQ0FBQyxDQUNILENBQUMsQ0FBQyxDQUFDLENBQ0YsQ0FBQyxjQUFjLENBQ2IsRUFBRSxDQUFDLG9CQUFvQixDQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDWCxhQUFhLENBQUMsZ0JBQWdCLENBRTlCO1lBQUEsQ0FBQyxJQUFJLENBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FDVixTQUFTLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUM5QixXQUFXLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxFQUV6QztZQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUNqRTtVQUFBLEVBQUUsY0FBYyxDQUFDLENBQ2xCLENBQ0g7TUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7UUFDSixDQUFDLENBQUM7O0lBQ0osQ0FBQztJQXZhQyxrREFBMEIsR0FBMUI7UUFDVSxJQUFBLEtBQWlDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyx3QkFBM0IsRUFBNUIsdUJBQXVCLG1CQUFHLEVBQUUsS0FBQSxDQUE0QjtRQUNoRSxrQkFDRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUN6QyxlQUFlLEVBQUUsT0FBTyxFQUN4QixXQUFXLEVBQUUsQ0FBQyxJQUNYLHVCQUF1QixFQUMxQjtJQUNKLENBQUM7SUFFRCx5Q0FBaUIsR0FBakI7UUFDUSxJQUFBLEtBS0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBSnhCLHNCQUFtQixFQUFuQixjQUFjLG1CQUFHLEVBQUUsS0FBQSxFQUNuQixLQUFLLFdBQUEsRUFDTCxrQkFBa0IsRUFBbEIsVUFBVSxtQkFBRyxLQUFLLEtBQUEsRUFDbEIsUUFBUSxjQUNnQixDQUFDO1FBQzNCLGtCQUNFLFFBQVEsRUFBRSxRQUFRLElBQUksRUFBRSxFQUN4QixJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUNsQixjQUFjLEVBQ2pCO0lBQ0osQ0FBQztJQUVELGlEQUF5QixHQUF6QjtRQUNRLElBQUEsS0FJRixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFIeEIsOEJBQTJCLEVBQTNCLHNCQUFzQixtQkFBRyxFQUFFLEtBQUEsRUFDM0IsS0FBSyxXQUFBLEVBQ0wsa0JBQWtCLEVBQWxCLFVBQVUsbUJBQUcsS0FBSyxLQUNNLENBQUM7UUFDM0Isa0JBQ0UsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFDbEIsc0JBQXNCLEVBQ3pCO0lBQ0osQ0FBQztJQUVELG1EQUEyQixHQUEzQjtRQUNRLElBQUEsS0FJRixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFIeEIsZ0NBQTZCLEVBQTdCLHdCQUF3QixtQkFBRyxFQUFFLEtBQUEsRUFDN0IsS0FBSyxXQUFBLEVBQ0wsa0JBQWtCLEVBQWxCLFVBQVUsbUJBQUcsS0FBSyxLQUNNLENBQUM7UUFDM0Isa0JBQ0UsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFDbEIsd0JBQXdCLEVBQzNCO0lBQ0osQ0FBQztJQXlYSCxvQkFBQztBQUFELENBQUMsQUFyZEQsQ0FHVSxTQUFTLEdBa2RsQjtBQUVELGVBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgRGVmcywgTGluZSwgTGluZWFyR3JhZGllbnQsIFN0b3AsIFRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgeyBDaGFydENvbmZpZywgRGF0YXNldCwgUGFydGlhbEJ5IH0gZnJvbSBcIi4vSGVscGVyVHlwZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBmcm9tWmVybz86IGJvb2xlYW47XG4gIGZyb21OdW1iZXI/OiBudW1iZXI7XG4gIGNoYXJ0Q29uZmlnPzogQWJzdHJhY3RDaGFydENvbmZpZztcbiAgeUF4aXNMYWJlbD86IHN0cmluZztcbiAgeUF4aXNTdWZmaXg/OiBzdHJpbmc7XG4gIHlMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIHlBeGlzSW50ZXJ2YWw/OiBudW1iZXI7XG4gIHhBeGlzTGFiZWw/OiBzdHJpbmc7XG4gIHhMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIGhpZGVQb2ludHNBdEluZGV4PzogbnVtYmVyW107XG4gIHJlbmRlckxhYmVsc0V2ZW5JZkhpZGRlbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDaGFydENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcbiAgdmVydGljYWxMaW5lc0ludGVydmFsPzogbnVtYmVyO1xuICBjb3VudD86IG51bWJlcjtcbiAgZGF0YT86IERhdGFzZXRbXTtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgcGFkZGluZ1RvcD86IG51bWJlcjtcbiAgcGFkZGluZ1JpZ2h0PzogbnVtYmVyO1xuICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcbiAgZm9ybWF0WUxhYmVsPzogKHlMYWJlbDogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICBob3Jpem9udGFsT2Zmc2V0PzogbnVtYmVyO1xuICBzdGFja2VkQmFyPzogYm9vbGVhbjtcbiAgdmVydGljYWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICBmb3JtYXRYTGFiZWw/OiAoeExhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcbiAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlPzogbnVtYmVyO1xuICBmb250U2l6ZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IHR5cGUgQWJzdHJhY3RDaGFydFN0YXRlID0ge307XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFID0gMC43NTtcblxuY2xhc3MgQWJzdHJhY3RDaGFydDxcbiAgSVByb3BzIGV4dGVuZHMgQWJzdHJhY3RDaGFydFByb3BzLFxuICBJU3RhdGUgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0U3RhdGVcbj4gZXh0ZW5kcyBDb21wb25lbnQ8QWJzdHJhY3RDaGFydFByb3BzICYgSVByb3BzLCBBYnN0cmFjdENoYXJ0U3RhdGUgJiBJU3RhdGU+IHtcbiAgY2FsY1NjYWxlciA9IChkYXRhOiBudW1iZXJbXSkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmZyb21aZXJvKSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoLi4uZGF0YSwgMCkgLSBNYXRoLm1pbiguLi5kYXRhLCAwKSB8fCAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5mcm9tTnVtYmVyKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBNYXRoLm1heCguLi5kYXRhLCB0aGlzLnByb3BzLmZyb21OdW1iZXIpIC1cbiAgICAgICAgICBNYXRoLm1pbiguLi5kYXRhLCB0aGlzLnByb3BzLmZyb21OdW1iZXIpIHx8IDFcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCguLi5kYXRhKSAtIE1hdGgubWluKC4uLmRhdGEpIHx8IDE7XG4gICAgfVxuICB9O1xuXG4gIGNhbGNCYXNlSGVpZ2h0ID0gKGRhdGE6IG51bWJlcltdLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLmRhdGEpO1xuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmRhdGEpO1xuICAgIGlmIChtaW4gPj0gMCAmJiBtYXggPj0gMCkge1xuICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICB9IGVsc2UgaWYgKG1pbiA8IDAgJiYgbWF4IDw9IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSBpZiAobWluIDwgMCAmJiBtYXggPiAwKSB7XG4gICAgICByZXR1cm4gKGhlaWdodCAqIG1heCkgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSk7XG4gICAgfVxuICB9O1xuXG4gIGNhbGNIZWlnaHQgPSAodmFsOiBudW1iZXIsIGRhdGE6IG51bWJlcltdLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmRhdGEpO1xuICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLmRhdGEpO1xuXG4gICAgaWYgKG1pbiA8IDAgJiYgbWF4ID4gMCkge1xuICAgICAgcmV0dXJuIGhlaWdodCAqICh2YWwgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpO1xuICAgIH0gZWxzZSBpZiAobWluID49IDAgJiYgbWF4ID49IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmZyb21aZXJvXG4gICAgICAgID8gaGVpZ2h0ICogKHZhbCAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSlcbiAgICAgICAgOiBoZWlnaHQgKiAoKHZhbCAtIG1pbikgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpO1xuICAgIH0gZWxzZSBpZiAobWluIDwgMCAmJiBtYXggPD0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgPyBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKVxuICAgICAgICA6IGhlaWdodCAqICgodmFsIC0gbWF4KSAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSk7XG4gICAgfVxuICB9O1xuXG4gIGdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCkge1xuICAgIGNvbnN0IHsgcHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMgPSB7fSB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4ge1xuICAgICAgc3Ryb2tlOiB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKDAuMiksXG4gICAgICBzdHJva2VEYXNoYXJyYXk6IFwiNSwgMTBcIixcbiAgICAgIHN0cm9rZVdpZHRoOiAxLFxuICAgICAgLi4ucHJvcHNGb3JCYWNrZ3JvdW5kTGluZXNcbiAgICB9O1xuICB9XG5cbiAgZ2V0UHJvcHNGb3JMYWJlbHMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJvcHNGb3JMYWJlbHMgPSB7fSxcbiAgICAgIGNvbG9yLFxuICAgICAgbGFiZWxDb2xvciA9IGNvbG9yLFxuICAgICAgZm9udFNpemVcbiAgICB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4ge1xuICAgICAgZm9udFNpemU6IGZvbnRTaXplIHx8IDEyLFxuICAgICAgZmlsbDogbGFiZWxDb2xvcigwLjgpLFxuICAgICAgLi4ucHJvcHNGb3JMYWJlbHNcbiAgICB9O1xuICB9XG5cbiAgZ2V0UHJvcHNGb3JWZXJ0aWNhbExhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0ZvclZlcnRpY2FsTGFiZWxzID0ge30sXG4gICAgICBjb2xvcixcbiAgICAgIGxhYmVsQ29sb3IgPSBjb2xvclxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiB7XG4gICAgICBmaWxsOiBsYWJlbENvbG9yKDAuOCksXG4gICAgICAuLi5wcm9wc0ZvclZlcnRpY2FsTGFiZWxzXG4gICAgfTtcbiAgfVxuXG4gIGdldFByb3BzRm9ySG9yaXpvbnRhbExhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0Zvckhvcml6b250YWxMYWJlbHMgPSB7fSxcbiAgICAgIGNvbG9yLFxuICAgICAgbGFiZWxDb2xvciA9IGNvbG9yXG4gICAgfSA9IHRoaXMucHJvcHMuY2hhcnRDb25maWc7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGw6IGxhYmVsQ29sb3IoMC44KSxcbiAgICAgIC4uLnByb3BzRm9ySG9yaXpvbnRhbExhYmVsc1xuICAgIH07XG4gIH1cblxuICByZW5kZXJIb3Jpem9udGFsTGluZXMgPSBjb25maWcgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvdW50LFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICAgIH0gPSBjb25maWc7XG4gICAgY29uc3QgYmFzZVBvc2l0aW9uID0gaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlO1xuXG4gICAgcmV0dXJuIFsuLi5uZXcgQXJyYXkoY291bnQgKyAxKV0ubWFwKChfLCBpKSA9PiB7XG4gICAgICBjb25zdCB5ID0gKGJhc2VQb3NpdGlvbiAvIGNvdW50KSAqIGkgKyBwYWRkaW5nVG9wO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPExpbmVcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgeDE9e3BhZGRpbmdSaWdodH1cbiAgICAgICAgICB5MT17eX1cbiAgICAgICAgICB4Mj17d2lkdGh9XG4gICAgICAgICAgeTI9e3l9XG4gICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVySG9yaXpvbnRhbExpbmUgPSBjb25maWcgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcGFkZGluZ1RvcCxcbiAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgICB9ID0gY29uZmlnO1xuICAgIHJldHVybiAoXG4gICAgICA8TGluZVxuICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgIHgxPXtwYWRkaW5nUmlnaHR9XG4gICAgICAgIHkxPXtoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgKyBwYWRkaW5nVG9wfVxuICAgICAgICB4Mj17d2lkdGh9XG4gICAgICAgIHkyPXtoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgKyBwYWRkaW5nVG9wfVxuICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpfVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIHJlbmRlckhvcml6b250YWxMYWJlbHMgPSAoXG4gICAgY29uZmlnOiBPbWl0PEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPiAmIHsgZGF0YTogbnVtYmVyW10gfVxuICApID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBjb3VudCxcbiAgICAgIGRhdGEsXG4gICAgICBoZWlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24gPSAwLFxuICAgICAgZGVjaW1hbFBsYWNlcyA9IDIsXG4gICAgICBmb3JtYXRZTGFiZWwgPSAoeUxhYmVsOiBzdHJpbmcpID0+IHlMYWJlbCxcbiAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3Qge1xuICAgICAgeUF4aXNMYWJlbCA9IFwiXCIsXG4gICAgICB5QXhpc1N1ZmZpeCA9IFwiXCIsXG4gICAgICB5TGFiZWxzT2Zmc2V0ID0gMTJcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gbmV3IEFycmF5KGNvdW50ID09PSAxID8gMSA6IGNvdW50ICsgMSkuZmlsbCgxKS5tYXAoKF8sIGkpID0+IHtcbiAgICAgIGxldCB5TGFiZWwgPSBTdHJpbmcoaSAqIGNvdW50KTtcblxuICAgICAgaWYgKGNvdW50ID09PSAxKSB7XG4gICAgICAgIHlMYWJlbCA9IGAke3lBeGlzTGFiZWx9JHtmb3JtYXRZTGFiZWwoXG4gICAgICAgICAgZGF0YVswXS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpXG4gICAgICAgICl9JHt5QXhpc1N1ZmZpeH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLnByb3BzLmZyb21aZXJvXG4gICAgICAgICAgPyAodGhpcy5jYWxjU2NhbGVyKGRhdGEpIC8gY291bnQpICogaSArIE1hdGgubWluKC4uLmRhdGEsIDApXG4gICAgICAgICAgOiAodGhpcy5jYWxjU2NhbGVyKGRhdGEpIC8gY291bnQpICogaSArIE1hdGgubWluKC4uLmRhdGEpO1xuICAgICAgICB5TGFiZWwgPSBgJHt5QXhpc0xhYmVsfSR7Zm9ybWF0WUxhYmVsKFxuICAgICAgICAgIGxhYmVsLnRvRml4ZWQoZGVjaW1hbFBsYWNlcylcbiAgICAgICAgKX0ke3lBeGlzU3VmZml4fWA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJhc2VQb3NpdGlvbiA9IGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZTtcbiAgICAgIGNvbnN0IHggPSBwYWRkaW5nUmlnaHQgLSB5TGFiZWxzT2Zmc2V0O1xuICAgICAgY29uc3QgeSA9XG4gICAgICAgIGNvdW50ID09PSAxICYmIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgICA/IHBhZGRpbmdUb3AgKyA0XG4gICAgICAgICAgOiBoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgLVxuICAgICAgICAgICAgKGJhc2VQb3NpdGlvbiAvIGNvdW50KSAqIGkgK1xuICAgICAgICAgICAgcGFkZGluZ1RvcDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUZXh0XG4gICAgICAgICAgcm90YXRpb249e2hvcml6b250YWxMYWJlbFJvdGF0aW9ufVxuICAgICAgICAgIG9yaWdpbj17YCR7eH0sICR7eX1gfVxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICB4PXt4fVxuICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIlxuICAgICAgICAgIHk9e3l9XG4gICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKX1cbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0Zvckhvcml6b250YWxMYWJlbHMoKX1cbiAgICAgICAgPlxuICAgICAgICAgIHt5TGFiZWx9XG4gICAgICAgIDwvVGV4dD5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyVmVydGljYWxMYWJlbHMgPSAoe1xuICAgIGxhYmVscyA9IFtdLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBob3Jpem9udGFsT2Zmc2V0ID0gMCxcbiAgICBzdGFja2VkQmFyID0gZmFsc2UsXG4gICAgdmVydGljYWxMYWJlbFJvdGF0aW9uID0gMCxcbiAgICBmb3JtYXRYTGFiZWwgPSB4TGFiZWwgPT4geExhYmVsLFxuICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIHwgXCJsYWJlbHNcIlxuICAgIHwgXCJ3aWR0aFwiXG4gICAgfCBcImhlaWdodFwiXG4gICAgfCBcInBhZGRpbmdSaWdodFwiXG4gICAgfCBcInBhZGRpbmdUb3BcIlxuICAgIHwgXCJob3Jpem9udGFsT2Zmc2V0XCJcbiAgICB8IFwic3RhY2tlZEJhclwiXG4gICAgfCBcInZlcnRpY2FsTGFiZWxSb3RhdGlvblwiXG4gICAgfCBcImZvcm1hdFhMYWJlbFwiXG4gICAgfCBcInZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZVwiXG4gID4pID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB4QXhpc0xhYmVsID0gXCJcIixcbiAgICAgIHhMYWJlbHNPZmZzZXQgPSAwLFxuICAgICAgaGlkZVBvaW50c0F0SW5kZXggPSBbXSxcbiAgICAgIHJlbmRlckxhYmVsc0V2ZW5JZkhpZGRlblxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbGFiZWxQcm9wcyA9IHtcbiAgICAgIC4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKSxcbiAgICAgIC4uLnRoaXMuZ2V0UHJvcHNGb3JWZXJ0aWNhbExhYmVscygpXG4gICAgfTtcblxuICAgIHZhciByYXdGb250U2l6ZSA9IGxhYmVsUHJvcHMuZm9udFNpemU7XG5cbiAgICB2YXIgdGY6IG51bWJlciA9IHJhd0ZvbnRTaXplID8gcGFyc2VJbnQoYCR7cmF3Rm9udFNpemV9YCkgOiAxMjtcbiAgICBpZiAoaXNOYU4odGYpKSB0ZiA9IDEyO1xuICAgIGNvbnN0IGZvbnRTaXplID0gdGYgfHwgMTI7XG4gICAgbGFiZWxQcm9wcy5mb250U2l6ZSA9IGZvbnRTaXplO1xuXG4gICAgbGV0IGZhYyA9IDE7XG4gICAgaWYgKHN0YWNrZWRCYXIpIHtcbiAgICAgIGZhYyA9IDAuNzE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhYmVscy5tYXAoKGxhYmVsLCBpKSA9PiB7XG4gICAgICBpZiAoaGlkZVBvaW50c0F0SW5kZXguaW5jbHVkZXMoaSkgJiYgIXJlbmRlckxhYmVsc0V2ZW5JZkhpZGRlbikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeCA9XG4gICAgICAgICgoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIGxhYmVscy5sZW5ndGgpICogaSArXG4gICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICBob3Jpem9udGFsT2Zmc2V0KSAqXG4gICAgICAgIGZhYztcblxuICAgICAgY29uc3QgeSA9XG4gICAgICAgIGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArXG4gICAgICAgIHBhZGRpbmdUb3AgK1xuICAgICAgICBmb250U2l6ZSAqIDIgK1xuICAgICAgICB4TGFiZWxzT2Zmc2V0O1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGV4dFxuICAgICAgICAgIG9yaWdpbj17YCR7eH0sICR7eX1gfVxuICAgICAgICAgIHJvdGF0aW9uPXt2ZXJ0aWNhbExhYmVsUm90YXRpb259XG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHg9e3h9XG4gICAgICAgICAgeT17eX1cbiAgICAgICAgICB0ZXh0QW5jaG9yPXt2ZXJ0aWNhbExhYmVsUm90YXRpb24gPT09IDAgPyBcIm1pZGRsZVwiIDogXCJzdGFydFwifVxuICAgICAgICAgIHsuLi5sYWJlbFByb3BzfVxuICAgICAgICA+XG4gICAgICAgICAge2Ake2Zvcm1hdFhMYWJlbChsYWJlbCl9JHt4QXhpc0xhYmVsfWB9XG4gICAgICAgIDwvVGV4dD5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyVmVydGljYWxMaW5lcyA9ICh7XG4gICAgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgdmVydGljYWxMaW5lc0ludGVydmFsLFxuICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgfTogT21pdDxcbiAgICBQaWNrPFxuICAgICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICAgIHwgXCJkYXRhXCJcbiAgICAgIHwgXCJ3aWR0aFwiXG4gICAgICB8IFwiaGVpZ2h0XCJcbiAgICAgIHwgXCJwYWRkaW5nUmlnaHRcIlxuICAgICAgfCBcInBhZGRpbmdUb3BcIlxuICAgICAgfCBcInZlcnRpY2FsTGluZXNJbnRlcnZhbFwiXG4gICAgICB8IFwidmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXCJcbiAgICA+LFxuICAgIFwiZGF0YVwiXG4gID4gJiB7IGRhdGE6IG51bWJlcltdIH0pID0+IHtcbiAgICBjb25zdCB7IHlBeGlzSW50ZXJ2YWwgPSAxIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIFsuLi5uZXcgQXJyYXkoTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8geUF4aXNJbnRlcnZhbCkpXVxuICAgICAgLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgaSA9PSAwIHx8XG4gICAgICAgICAgKHZlcnRpY2FsTGluZXNJbnRlcnZhbCAmJiBpICUgdmVydGljYWxMaW5lc0ludGVydmFsICE9IDApXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPExpbmVcbiAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICAgIHgxPXtNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIChkYXRhLmxlbmd0aCAvIHlBeGlzSW50ZXJ2YWwpKSAqIGkgK1xuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHkxPXswfVxuICAgICAgICAgICAgeDI9e01hdGguZmxvb3IoXG4gICAgICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gKGRhdGEubGVuZ3RoIC8geUF4aXNJbnRlcnZhbCkpICogaSArXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgeTI9e2hlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArIHBhZGRpbmdUb3B9XG4gICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpfVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLmZpbHRlcihkID0+ICEhZCk7XG4gIH07XG5cbiAgcmVuZGVyVmVydGljYWxMaW5lID0gKHtcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIiB8IFwidmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXCJcbiAgPikgPT4gKFxuICAgIDxMaW5lXG4gICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICB4MT17TWF0aC5mbG9vcihwYWRkaW5nUmlnaHQpfVxuICAgICAgeTE9ezB9XG4gICAgICB4Mj17TWF0aC5mbG9vcihwYWRkaW5nUmlnaHQpfVxuICAgICAgeTI9e2hlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArIHBhZGRpbmdUb3B9XG4gICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpfVxuICAgIC8+XG4gICk7XG5cbiAgcmVuZGVyRGVmcyA9IChcbiAgICBjb25maWc6IFBpY2s8XG4gICAgICBQYXJ0aWFsQnk8XG4gICAgICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVwiXG4gICAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHlcIlxuICAgICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50XCJcbiAgICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHlcIlxuICAgICAgPixcbiAgICAgIHwgXCJ3aWR0aFwiXG4gICAgICB8IFwiaGVpZ2h0XCJcbiAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRGcm9tXCJcbiAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRUb1wiXG4gICAgICB8IFwidXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFwiXG4gICAgICB8IFwiZGF0YVwiXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHlcIlxuICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVwiXG4gICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50XCJcbiAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XCJcbiAgICA+XG4gICkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgYmFja2dyb3VuZEdyYWRpZW50RnJvbSxcbiAgICAgIGJhY2tncm91bmRHcmFkaWVudFRvLFxuICAgICAgdXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldCxcbiAgICAgIGRhdGFcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3QgZnJvbU9wYWNpdHkgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXCJiYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVwiKVxuICAgICAgPyBjb25maWcuYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHlcbiAgICAgIDogMS4wO1xuICAgIGNvbnN0IHRvT3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVwiKVxuICAgICAgPyBjb25maWcuYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XG4gICAgICA6IDEuMDtcblxuICAgIGNvbnN0IGZpbGxTaGFkb3dHcmFkaWVudCA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImZpbGxTaGFkb3dHcmFkaWVudFwiKVxuICAgICAgPyBjb25maWcuZmlsbFNoYWRvd0dyYWRpZW50XG4gICAgICA6IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoMS4wKTtcblxuICAgIGNvbnN0IGZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHkgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXG4gICAgICBcImZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHlcIlxuICAgIClcbiAgICAgID8gY29uZmlnLmZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHlcbiAgICAgIDogMC4xO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEZWZzPlxuICAgICAgICA8TGluZWFyR3JhZGllbnRcbiAgICAgICAgICBpZD1cImJhY2tncm91bmRHcmFkaWVudFwiXG4gICAgICAgICAgeDE9ezB9XG4gICAgICAgICAgeTE9e2hlaWdodH1cbiAgICAgICAgICB4Mj17d2lkdGh9XG4gICAgICAgICAgeTI9ezB9XG4gICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxTdG9wXG4gICAgICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgICAgIHN0b3BDb2xvcj17YmFja2dyb3VuZEdyYWRpZW50RnJvbX1cbiAgICAgICAgICAgIHN0b3BPcGFjaXR5PXtmcm9tT3BhY2l0eX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxTdG9wXG4gICAgICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgICAgIHN0b3BDb2xvcj17YmFja2dyb3VuZEdyYWRpZW50VG99XG4gICAgICAgICAgICBzdG9wT3BhY2l0eT17dG9PcGFjaXR5fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGluZWFyR3JhZGllbnQ+XG4gICAgICAgIHt1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0ID8gKFxuICAgICAgICAgIGRhdGEubWFwKChkYXRhc2V0LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPExpbmVhckdyYWRpZW50XG4gICAgICAgICAgICAgIGlkPXtgZmlsbFNoYWRvd0dyYWRpZW50XyR7aW5kZXh9YH1cbiAgICAgICAgICAgICAga2V5PXtgJHtpbmRleH1gfVxuICAgICAgICAgICAgICB4MT17MH1cbiAgICAgICAgICAgICAgeTE9ezB9XG4gICAgICAgICAgICAgIHgyPXswfVxuICAgICAgICAgICAgICB5Mj17aGVpZ2h0fVxuICAgICAgICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U3RvcFxuICAgICAgICAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgICAgICAgIHN0b3BDb2xvcj17XG4gICAgICAgICAgICAgICAgICBkYXRhc2V0LmNvbG9yID8gZGF0YXNldC5jb2xvcigxLjApIDogZmlsbFNoYWRvd0dyYWRpZW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0b3BPcGFjaXR5PXtmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8U3RvcFxuICAgICAgICAgICAgICAgIG9mZnNldD1cIjFcIlxuICAgICAgICAgICAgICAgIHN0b3BDb2xvcj17XG4gICAgICAgICAgICAgICAgICBkYXRhc2V0LmNvbG9yXG4gICAgICAgICAgICAgICAgICAgID8gZGF0YXNldC5jb2xvcihmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5KVxuICAgICAgICAgICAgICAgICAgICA6IGZpbGxTaGFkb3dHcmFkaWVudFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdG9wT3BhY2l0eT1cIjBcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9MaW5lYXJHcmFkaWVudD5cbiAgICAgICAgICApKVxuICAgICAgICApIDogKFxuICAgICAgICAgIDxMaW5lYXJHcmFkaWVudFxuICAgICAgICAgICAgaWQ9XCJmaWxsU2hhZG93R3JhZGllbnRcIlxuICAgICAgICAgICAgeDE9ezB9XG4gICAgICAgICAgICB5MT17MH1cbiAgICAgICAgICAgIHgyPXswfVxuICAgICAgICAgICAgeTI9e2hlaWdodH1cbiAgICAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICAgICAgIHN0b3BDb2xvcj17ZmlsbFNoYWRvd0dyYWRpZW50fVxuICAgICAgICAgICAgICBzdG9wT3BhY2l0eT17ZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8U3RvcCBvZmZzZXQ9XCIxXCIgc3RvcENvbG9yPXtmaWxsU2hhZG93R3JhZGllbnR9IHN0b3BPcGFjaXR5PVwiMFwiIC8+XG4gICAgICAgICAgPC9MaW5lYXJHcmFkaWVudD5cbiAgICAgICAgKX1cbiAgICAgIDwvRGVmcz5cbiAgICApO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBBYnN0cmFjdENoYXJ0O1xuIl19
