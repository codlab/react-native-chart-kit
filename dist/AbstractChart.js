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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWJzdHJhY3RDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BYnN0cmFjdENoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQXVDMUUsTUFBTSxDQUFDLElBQU0sa0NBQWtDLEdBQUcsSUFBSSxDQUFDO0FBRXZEO0lBR1UsaUNBQW1FO0lBSDdFO1FBQUEscUVBa2RDO1FBOWNDLGdCQUFVLEdBQUcsVUFBQyxJQUFjO1lBQzFCLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLE1BQUksSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUM7YUFDekQ7aUJBQU0sSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtnQkFDaEMsT0FBTyxDQUNMLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLE1BQ3JDLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUMsSUFBSSxDQUFDLENBQ2hELENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENB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QUFHLEVBQUUsS0FBQSxFQUMzQixLQUFLLFdBQUEsRUFDTCxrQkFBa0IsRUFBbEIsVUFBVSxtQkFBRyxLQUFLLEtBQ00sQ0FBQztRQUMzQixrQkFDRSxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUNsQixzQkFBc0IsRUFDekI7SUFDSixDQUFDO0lBRUQsbURBQTJCLEdBQTNCO1FBQ1EsSUFBQSxLQUlGLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUh4QixnQ0FBNkIsRUFBN0Isd0JBQXdCLG1CQUFHLEVBQUUsS0FBQSxFQUM3QixLQUFLLFdBQUEsRUFDTCxrQkFBa0IsRUFBbEIsVUFBVSxtQkFBRyxLQUFLLEtBQ00sQ0FBQztRQUMzQixrQkFDRSxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUNsQix3QkFBd0IsRUFDM0I7SUFDSixDQUFDO0lBc1hILG9CQUFDO0FBQUQsQ0FBQyxBQWxkRCxDQUdVLFNBQVMsR0ErY2xCO0FBRUQsZUFBZSxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBEZWZzLCBMaW5lLCBMaW5lYXJHcmFkaWVudCwgU3RvcCwgVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCB7IENoYXJ0Q29uZmlnLCBEYXRhc2V0LCBQYXJ0aWFsQnkgfSBmcm9tIFwiLi9IZWxwZXJUeXBlc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGZyb21aZXJvPzogYm9vbGVhbjtcbiAgZnJvbU51bWJlcj86IG51bWJlcjtcbiAgY2hhcnRDb25maWc/OiBBYnN0cmFjdENoYXJ0Q29uZmlnO1xuICB5QXhpc0xhYmVsPzogc3RyaW5nO1xuICB5QXhpc1N1ZmZpeD86IHN0cmluZztcbiAgeUxhYmVsc09mZnNldD86IG51bWJlcjtcbiAgeUF4aXNJbnRlcnZhbD86IG51bWJlcjtcbiAgeEF4aXNMYWJlbD86IHN0cmluZztcbiAgeExhYmVsc09mZnNldD86IG51bWJlcjtcbiAgaGlkZVBvaW50c0F0SW5kZXg/OiBudW1iZXJbXTtcbiAgcmVuZGVyTGFiZWxzRXZlbklmSGlkZGVuPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENoYXJ0Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xuICB2ZXJ0aWNhbExpbmVzSW50ZXJ2YWw/OiBudW1iZXI7XG4gIGNvdW50PzogbnVtYmVyO1xuICBkYXRhPzogRGF0YXNldFtdO1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBwYWRkaW5nVG9wPzogbnVtYmVyO1xuICBwYWRkaW5nUmlnaHQ/OiBudW1iZXI7XG4gIGhvcml6b250YWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICBmb3JtYXRZTGFiZWw/OiAoeUxhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIGhvcml6b250YWxPZmZzZXQ/OiBudW1iZXI7XG4gIHN0YWNrZWRCYXI/OiBib29sZWFuO1xuICB2ZXJ0aWNhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XG4gIGZvcm1hdFhMYWJlbD86ICh4TGFiZWw6IHN0cmluZykgPT4gc3RyaW5nO1xuICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2U/OiBudW1iZXI7XG4gIGZvbnRTaXplPzogbnVtYmVyO1xufVxuXG5leHBvcnQgdHlwZSBBYnN0cmFjdENoYXJ0U3RhdGUgPSB7fTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0UgPSAwLjc1O1xuXG5jbGFzcyBBYnN0cmFjdENoYXJ0PFxuICBJUHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMsXG4gIElTdGF0ZSBleHRlbmRzIEFic3RyYWN0Q2hhcnRTdGF0ZVxuPiBleHRlbmRzIENvbXBvbmVudDxBYnN0cmFjdENoYXJ0UHJvcHMgJiBJUHJvcHMsIEFic3RyYWN0Q2hhcnRTdGF0ZSAmIElTdGF0ZT4ge1xuICBjYWxjU2NhbGVyID0gKGRhdGE6IG51bWJlcltdKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuZnJvbVplcm8pIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCguLi5kYXRhLCAwKSAtIE1hdGgubWluKC4uLmRhdGEsIDApIHx8IDE7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmZyb21OdW1iZXIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIE1hdGgubWF4KC4uLmRhdGEsIHRoaXMucHJvcHMuZnJvbU51bWJlcikgLVxuICAgICAgICAgIE1hdGgubWluKC4uLmRhdGEsIHRoaXMucHJvcHMuZnJvbU51bWJlcikgfHwgMVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KC4uLmRhdGEpIC0gTWF0aC5taW4oLi4uZGF0YSkgfHwgMTtcbiAgICB9XG4gIH07XG5cbiAgY2FsY0Jhc2VIZWlnaHQgPSAoZGF0YTogbnVtYmVyW10sIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4uZGF0YSk7XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF0YSk7XG4gICAgaWYgKG1pbiA+PSAwICYmIG1heCA+PSAwKSB7XG4gICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH0gZWxzZSBpZiAobWluIDwgMCAmJiBtYXggPD0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA+IDApIHtcbiAgICAgIHJldHVybiAoaGVpZ2h0ICogbWF4KSAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKTtcbiAgICB9XG4gIH07XG5cbiAgY2FsY0hlaWdodCA9ICh2YWw6IG51bWJlciwgZGF0YTogbnVtYmVyW10sIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF0YSk7XG4gICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4uZGF0YSk7XG5cbiAgICBpZiAobWluIDwgMCAmJiBtYXggPiAwKSB7XG4gICAgICByZXR1cm4gaGVpZ2h0ICogKHZhbCAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSk7XG4gICAgfSBlbHNlIGlmIChtaW4gPj0gMCAmJiBtYXggPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgPyBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKVxuICAgICAgICA6IGhlaWdodCAqICgodmFsIC0gbWluKSAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSk7XG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA8PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5mcm9tWmVyb1xuICAgICAgICA/IGhlaWdodCAqICh2YWwgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpXG4gICAgICAgIDogaGVpZ2h0ICogKCh2YWwgLSBtYXgpIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKTtcbiAgICB9XG4gIH07XG5cbiAgZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKSB7XG4gICAgY29uc3QgeyBwcm9wc0ZvckJhY2tncm91bmRMaW5lcyA9IHt9IH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiB7XG4gICAgICBzdHJva2U6IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoMC4yKSxcbiAgICAgIHN0cm9rZURhc2hhcnJheTogXCI1LCAxMFwiLFxuICAgICAgc3Ryb2tlV2lkdGg6IDEsXG4gICAgICAuLi5wcm9wc0ZvckJhY2tncm91bmRMaW5lc1xuICAgIH07XG4gIH1cblxuICBnZXRQcm9wc0ZvckxhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0ZvckxhYmVscyA9IHt9LFxuICAgICAgY29sb3IsXG4gICAgICBsYWJlbENvbG9yID0gY29sb3IsXG4gICAgICBmb250U2l6ZVxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiB7XG4gICAgICBmb250U2l6ZTogZm9udFNpemUgfHwgMTIsXG4gICAgICBmaWxsOiBsYWJlbENvbG9yKDAuOCksXG4gICAgICAuLi5wcm9wc0ZvckxhYmVsc1xuICAgIH07XG4gIH1cblxuICBnZXRQcm9wc0ZvclZlcnRpY2FsTGFiZWxzKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHByb3BzRm9yVmVydGljYWxMYWJlbHMgPSB7fSxcbiAgICAgIGNvbG9yLFxuICAgICAgbGFiZWxDb2xvciA9IGNvbG9yXG4gICAgfSA9IHRoaXMucHJvcHMuY2hhcnRDb25maWc7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGw6IGxhYmVsQ29sb3IoMC44KSxcbiAgICAgIC4uLnByb3BzRm9yVmVydGljYWxMYWJlbHNcbiAgICB9O1xuICB9XG5cbiAgZ2V0UHJvcHNGb3JIb3Jpem9udGFsTGFiZWxzKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHByb3BzRm9ySG9yaXpvbnRhbExhYmVscyA9IHt9LFxuICAgICAgY29sb3IsXG4gICAgICBsYWJlbENvbG9yID0gY29sb3JcbiAgICB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4ge1xuICAgICAgZmlsbDogbGFiZWxDb2xvcigwLjgpLFxuICAgICAgLi4ucHJvcHNGb3JIb3Jpem9udGFsTGFiZWxzXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlckhvcml6b250YWxMaW5lcyA9IGNvbmZpZyA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgY291bnQsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHBhZGRpbmdUb3AsXG4gICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXG4gICAgfSA9IGNvbmZpZztcbiAgICBjb25zdCBiYXNlUG9zaXRpb24gPSBoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2U7XG5cbiAgICByZXR1cm4gWy4uLm5ldyBBcnJheShjb3VudCArIDEpXS5tYXAoKF8sIGkpID0+IHtcbiAgICAgIGNvbnN0IHkgPSAoYmFzZVBvc2l0aW9uIC8gY291bnQpICogaSArIHBhZGRpbmdUb3A7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TGluZVxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICB4MT17cGFkZGluZ1JpZ2h0fVxuICAgICAgICAgIHkxPXt5fVxuICAgICAgICAgIHgyPXt3aWR0aH1cbiAgICAgICAgICB5Mj17eX1cbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXJIb3Jpem9udGFsTGluZSA9IGNvbmZpZyA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICAgIH0gPSBjb25maWc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxMaW5lXG4gICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgeDE9e3BhZGRpbmdSaWdodH1cbiAgICAgICAgeTE9e2hlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArIHBhZGRpbmdUb3B9XG4gICAgICAgIHgyPXt3aWR0aH1cbiAgICAgICAgeTI9e2hlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArIHBhZGRpbmdUb3B9XG4gICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XG4gICAgICAvPlxuICAgICk7XG4gIH07XG5cbiAgcmVuZGVySG9yaXpvbnRhbExhYmVscyA9IChcbiAgICBjb25maWc6IE9taXQ8QWJzdHJhY3RDaGFydENvbmZpZywgXCJkYXRhXCI+ICYgeyBkYXRhOiBudW1iZXJbXSB9XG4gICkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvdW50LFxuICAgICAgZGF0YSxcbiAgICAgIGhlaWdodCxcbiAgICAgIHBhZGRpbmdUb3AsXG4gICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBkZWNpbWFsUGxhY2VzID0gMixcbiAgICAgIGZvcm1hdFlMYWJlbCA9ICh5TGFiZWw6IHN0cmluZykgPT4geUxhYmVsLFxuICAgICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICAgIH0gPSBjb25maWc7XG5cbiAgICBjb25zdCB7XG4gICAgICB5QXhpc0xhYmVsID0gXCJcIixcbiAgICAgIHlBeGlzU3VmZml4ID0gXCJcIixcbiAgICAgIHlMYWJlbHNPZmZzZXQgPSAxMlxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiBuZXcgQXJyYXkoY291bnQgPT09IDEgPyAxIDogY291bnQgKyAxKS5maWxsKDEpLm1hcCgoXywgaSkgPT4ge1xuICAgICAgbGV0IHlMYWJlbCA9IFN0cmluZyhpICogY291bnQpO1xuXG4gICAgICBpZiAoY291bnQgPT09IDEpIHtcbiAgICAgICAgeUxhYmVsID0gYCR7eUF4aXNMYWJlbH0ke2Zvcm1hdFlMYWJlbChcbiAgICAgICAgICBkYXRhWzBdLnRvRml4ZWQoZGVjaW1hbFBsYWNlcylcbiAgICAgICAgKX0ke3lBeGlzU3VmZml4fWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgICA/ICh0aGlzLmNhbGNTY2FsZXIoZGF0YSkgLyBjb3VudCkgKiBpICsgTWF0aC5taW4oLi4uZGF0YSwgMClcbiAgICAgICAgICA6ICh0aGlzLmNhbGNTY2FsZXIoZGF0YSkgLyBjb3VudCkgKiBpICsgTWF0aC5taW4oLi4uZGF0YSk7XG4gICAgICAgIHlMYWJlbCA9IGAke3lBeGlzTGFiZWx9JHtmb3JtYXRZTGFiZWwoXG4gICAgICAgICAgbGFiZWwudG9GaXhlZChkZWNpbWFsUGxhY2VzKVxuICAgICAgICApfSR7eUF4aXNTdWZmaXh9YDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYmFzZVBvc2l0aW9uID0gaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlO1xuICAgICAgY29uc3QgeCA9IHBhZGRpbmdSaWdodCAtIHlMYWJlbHNPZmZzZXQ7XG4gICAgICBjb25zdCB5ID1cbiAgICAgICAgY291bnQgPT09IDEgJiYgdGhpcy5wcm9wcy5mcm9tWmVyb1xuICAgICAgICAgID8gcGFkZGluZ1RvcCArIDRcbiAgICAgICAgICA6IGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSAtXG4gICAgICAgICAgICAoYmFzZVBvc2l0aW9uIC8gY291bnQpICogaSArXG4gICAgICAgICAgICBwYWRkaW5nVG9wO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRleHRcbiAgICAgICAgICByb3RhdGlvbj17aG9yaXpvbnRhbExhYmVsUm90YXRpb259XG4gICAgICAgICAgb3JpZ2luPXtgJHt4fSwgJHt5fWB9XG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHg9e3h9XG4gICAgICAgICAgdGV4dEFuY2hvcj1cImVuZFwiXG4gICAgICAgICAgeT17eX1cbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckxhYmVscygpfVxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9ySG9yaXpvbnRhbExhYmVscygpfVxuICAgICAgICA+XG4gICAgICAgICAge3lMYWJlbH1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXJWZXJ0aWNhbExhYmVscyA9ICh7XG4gICAgbGFiZWxzID0gW10sXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIGhvcml6b250YWxPZmZzZXQgPSAwLFxuICAgIHN0YWNrZWRCYXIgPSBmYWxzZSxcbiAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24gPSAwLFxuICAgIGZvcm1hdFhMYWJlbCA9IHhMYWJlbCA9PiB4TGFiZWwsXG4gICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgfCBcImxhYmVsc1wiXG4gICAgfCBcIndpZHRoXCJcbiAgICB8IFwiaGVpZ2h0XCJcbiAgICB8IFwicGFkZGluZ1JpZ2h0XCJcbiAgICB8IFwicGFkZGluZ1RvcFwiXG4gICAgfCBcImhvcml6b250YWxPZmZzZXRcIlxuICAgIHwgXCJzdGFja2VkQmFyXCJcbiAgICB8IFwidmVydGljYWxMYWJlbFJvdGF0aW9uXCJcbiAgICB8IFwiZm9ybWF0WExhYmVsXCJcbiAgICB8IFwidmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXCJcbiAgPikgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHhBeGlzTGFiZWwgPSBcIlwiLFxuICAgICAgeExhYmVsc09mZnNldCA9IDAsXG4gICAgICBoaWRlUG9pbnRzQXRJbmRleCA9IFtdLFxuICAgICAgcmVuZGVyTGFiZWxzRXZlbklmSGlkZGVuXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBsYWJlbFByb3BzID0ge1xuICAgICAgLi4udGhpcy5nZXRQcm9wc0ZvckxhYmVscygpLFxuICAgICAgLi4udGhpcy5nZXRQcm9wc0ZvclZlcnRpY2FsTGFiZWxzKClcbiAgICB9O1xuXG4gICAgdmFyIHJhd0ZvbnRTaXplID0gbGFiZWxQcm9wcy5mb250U2l6ZTtcblxuICAgIHZhciB0ZjogbnVtYmVyID0gcmF3Rm9udFNpemUgPyBwYXJzZUludChgJHtyYXdGb250U2l6ZX1gKSA6IDEyO1xuICAgIGlmIChpc05hTih0ZikpIHRmID0gMTI7XG4gICAgY29uc3QgZm9udFNpemUgPSB0ZiB8fCAxMjtcbiAgICBsYWJlbFByb3BzLmZvbnRTaXplID0gZm9udFNpemU7XG5cbiAgICBsZXQgZmFjID0gMTtcbiAgICBpZiAoc3RhY2tlZEJhcikge1xuICAgICAgZmFjID0gMC43MTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGFiZWxzLm1hcCgobGFiZWwsIGkpID0+IHtcbiAgICAgIGlmIChoaWRlUG9pbnRzQXRJbmRleC5pbmNsdWRlcyhpKSAmJiAhcmVuZGVyTGFiZWxzRXZlbklmSGlkZGVuKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB4ID1cbiAgICAgICAgKCgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gbGFiZWxzLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgIGhvcml6b250YWxPZmZzZXQpICpcbiAgICAgICAgZmFjO1xuXG4gICAgICBjb25zdCB5ID1cbiAgICAgICAgaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICtcbiAgICAgICAgcGFkZGluZ1RvcCArXG4gICAgICAgIGZvbnRTaXplICogMiArXG4gICAgICAgIHhMYWJlbHNPZmZzZXQ7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUZXh0XG4gICAgICAgICAgb3JpZ2luPXtgJHt4fSwgJHt5fWB9XG4gICAgICAgICAgcm90YXRpb249e3ZlcnRpY2FsTGFiZWxSb3RhdGlvbn1cbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgeD17eH1cbiAgICAgICAgICB5PXt5fVxuICAgICAgICAgIHRleHRBbmNob3I9e3ZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9PT0gMCA/IFwibWlkZGxlXCIgOiBcInN0YXJ0XCJ9XG4gICAgICAgICAgey4uLmxhYmVsUHJvcHN9XG4gICAgICAgID5cbiAgICAgICAgICB7YCR7Zm9ybWF0WExhYmVsKGxhYmVsKX0ke3hBeGlzTGFiZWx9YH1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXJWZXJ0aWNhbExpbmVzID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICB2ZXJ0aWNhbExpbmVzSW50ZXJ2YWwsXG4gICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICB9OiBPbWl0PFxuICAgIFBpY2s8XG4gICAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgICAgfCBcImRhdGFcIlxuICAgICAgfCBcIndpZHRoXCJcbiAgICAgIHwgXCJoZWlnaHRcIlxuICAgICAgfCBcInBhZGRpbmdSaWdodFwiXG4gICAgICB8IFwicGFkZGluZ1RvcFwiXG4gICAgICB8IFwidmVydGljYWxMaW5lc0ludGVydmFsXCJcbiAgICAgIHwgXCJ2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2VcIlxuICAgID4sXG4gICAgXCJkYXRhXCJcbiAgPiAmIHsgZGF0YTogbnVtYmVyW10gfSkgPT4ge1xuICAgIGNvbnN0IHsgeUF4aXNJbnRlcnZhbCA9IDEgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gWy4uLm5ldyBBcnJheShNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyB5QXhpc0ludGVydmFsKSldXG4gICAgICAubWFwKChfLCBpKSA9PiB7XG4gICAgICAgIGlmICh2ZXJ0aWNhbExpbmVzSW50ZXJ2YWwgJiYgaSAlIHZlcnRpY2FsTGluZXNJbnRlcnZhbCAhPSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TGluZVxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgeDE9e01hdGguZmxvb3IoXG4gICAgICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gKGRhdGEubGVuZ3RoIC8geUF4aXNJbnRlcnZhbCkpICogaSArXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgeTE9ezB9XG4gICAgICAgICAgICB4Mj17TWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgKCh3aWR0aCAtIHBhZGRpbmdSaWdodCkgLyAoZGF0YS5sZW5ndGggLyB5QXhpc0ludGVydmFsKSkgKiBpICtcbiAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB5Mj17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cbiAgICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKGQgPT4gISFkKTtcbiAgfTtcblxuICByZW5kZXJWZXJ0aWNhbExpbmUgPSAoe1xuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJ2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2VcIlxuICA+KSA9PiAoXG4gICAgPExpbmVcbiAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgIHgxPXtNYXRoLmZsb29yKHBhZGRpbmdSaWdodCl9XG4gICAgICB5MT17MH1cbiAgICAgIHgyPXtNYXRoLmZsb29yKHBhZGRpbmdSaWdodCl9XG4gICAgICB5Mj17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cbiAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XG4gICAgLz5cbiAgKTtcblxuICByZW5kZXJEZWZzID0gKFxuICAgIGNvbmZpZzogUGljazxcbiAgICAgIFBhcnRpYWxCeTxcbiAgICAgICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XCJcbiAgICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVwiXG4gICAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRcIlxuICAgICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVwiXG4gICAgICA+LFxuICAgICAgfCBcIndpZHRoXCJcbiAgICAgIHwgXCJoZWlnaHRcIlxuICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudEZyb21cIlxuICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudFRvXCJcbiAgICAgIHwgXCJ1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XCJcbiAgICAgIHwgXCJkYXRhXCJcbiAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVwiXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCJcbiAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRcIlxuICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHlcIlxuICAgID5cbiAgKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBiYWNrZ3JvdW5kR3JhZGllbnRGcm9tLFxuICAgICAgYmFja2dyb3VuZEdyYWRpZW50VG8sXG4gICAgICB1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0LFxuICAgICAgZGF0YVxuICAgIH0gPSBjb25maWc7XG5cbiAgICBjb25zdCBmcm9tT3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XCIpXG4gICAgICA/IGNvbmZpZy5iYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVxuICAgICAgOiAxLjA7XG4gICAgY29uc3QgdG9PcGFjaXR5ID0gY29uZmlnLmhhc093blByb3BlcnR5KFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCIpXG4gICAgICA/IGNvbmZpZy5iYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHlcbiAgICAgIDogMS4wO1xuXG4gICAgY29uc3QgZmlsbFNoYWRvd0dyYWRpZW50ID0gY29uZmlnLmhhc093blByb3BlcnR5KFwiZmlsbFNoYWRvd0dyYWRpZW50XCIpXG4gICAgICA/IGNvbmZpZy5maWxsU2hhZG93R3JhZGllbnRcbiAgICAgIDogdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigxLjApO1xuXG4gICAgY29uc3QgZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcbiAgICAgIFwiZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVwiXG4gICAgKVxuICAgICAgPyBjb25maWcuZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVxuICAgICAgOiAwLjE7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPERlZnM+XG4gICAgICAgIDxMaW5lYXJHcmFkaWVudFxuICAgICAgICAgIGlkPVwiYmFja2dyb3VuZEdyYWRpZW50XCJcbiAgICAgICAgICB4MT17MH1cbiAgICAgICAgICB5MT17aGVpZ2h0fVxuICAgICAgICAgIHgyPXt3aWR0aH1cbiAgICAgICAgICB5Mj17MH1cbiAgICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgICAgc3RvcENvbG9yPXtiYWNrZ3JvdW5kR3JhZGllbnRGcm9tfVxuICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2Zyb21PcGFjaXR5fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgIG9mZnNldD1cIjFcIlxuICAgICAgICAgICAgc3RvcENvbG9yPXtiYWNrZ3JvdW5kR3JhZGllbnRUb31cbiAgICAgICAgICAgIHN0b3BPcGFjaXR5PXt0b09wYWNpdHl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MaW5lYXJHcmFkaWVudD5cbiAgICAgICAge3VzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXQgPyAoXG4gICAgICAgICAgZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8TGluZWFyR3JhZGllbnRcbiAgICAgICAgICAgICAgaWQ9e2BmaWxsU2hhZG93R3JhZGllbnRfJHtpbmRleH1gfVxuICAgICAgICAgICAgICBrZXk9e2Ake2luZGV4fWB9XG4gICAgICAgICAgICAgIHgxPXswfVxuICAgICAgICAgICAgICB5MT17MH1cbiAgICAgICAgICAgICAgeDI9ezB9XG4gICAgICAgICAgICAgIHkyPXtoZWlnaHR9XG4gICAgICAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdG9wXG4gICAgICAgICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICAgICAgICAgc3RvcENvbG9yPXtcbiAgICAgICAgICAgICAgICAgIGRhdGFzZXQuY29sb3IgPyBkYXRhc2V0LmNvbG9yKDEuMCkgOiBmaWxsU2hhZG93R3JhZGllbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2ZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxTdG9wXG4gICAgICAgICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICAgICAgICAgc3RvcENvbG9yPXtcbiAgICAgICAgICAgICAgICAgIGRhdGFzZXQuY29sb3JcbiAgICAgICAgICAgICAgICAgICAgPyBkYXRhc2V0LmNvbG9yKGZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHkpXG4gICAgICAgICAgICAgICAgICAgIDogZmlsbFNoYWRvd0dyYWRpZW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0b3BPcGFjaXR5PVwiMFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxuICAgICAgICAgICkpXG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPExpbmVhckdyYWRpZW50XG4gICAgICAgICAgICBpZD1cImZpbGxTaGFkb3dHcmFkaWVudFwiXG4gICAgICAgICAgICB4MT17MH1cbiAgICAgICAgICAgIHkxPXswfVxuICAgICAgICAgICAgeDI9ezB9XG4gICAgICAgICAgICB5Mj17aGVpZ2h0fVxuICAgICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RvcFxuICAgICAgICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgICAgICAgc3RvcENvbG9yPXtmaWxsU2hhZG93R3JhZGllbnR9XG4gICAgICAgICAgICAgIHN0b3BPcGFjaXR5PXtmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTdG9wIG9mZnNldD1cIjFcIiBzdG9wQ29sb3I9e2ZpbGxTaGFkb3dHcmFkaWVudH0gc3RvcE9wYWNpdHk9XCIwXCIgLz5cbiAgICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxuICAgICAgICApfVxuICAgICAgPC9EZWZzPlxuICAgICk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0Q2hhcnQ7XG4iXX0=
