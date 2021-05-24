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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWJzdHJhY3RDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BYnN0cmFjdENoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQXNDMUUsTUFBTSxDQUFDLElBQU0sa0NBQWtDLEdBQUcsSUFBSSxDQUFDO0FBRXZEO0lBR1UsaUNBQW1FO0lBSDdFO1FBQUEscUVBd2NDO1FBcGNDLGdCQUFVLEdBQUcsVUFBQyxJQUFjO1lBQzFCLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLE1BQUksSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUM7YUFDekQ7aUJBQU0sSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtnQkFDaEMsT0FBTyxDQUNMLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLE1BQ3JDLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUMsSUFBSSxDQUFDLENBQ2hELENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENB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LEtBQUssS0FDTSxDQUFDO1FBQzNCLGtCQUNFLElBQUksRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLElBQ2xCLHdCQUF3QixFQUMzQjtJQUNKLENBQUM7SUE2V0gsb0JBQUM7QUFBRCxDQUFDLEFBeGNELENBR1UsU0FBUyxHQXFjbEI7QUFFRCxlQUFlLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IERlZnMsIExpbmUsIExpbmVhckdyYWRpZW50LCBTdG9wLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcblxuaW1wb3J0IHsgQ2hhcnRDb25maWcsIERhdGFzZXQsIFBhcnRpYWxCeSB9IGZyb20gXCIuL0hlbHBlclR5cGVzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDaGFydFByb3BzIHtcbiAgZnJvbVplcm8/OiBib29sZWFuO1xuICBmcm9tTnVtYmVyPzogbnVtYmVyO1xuICBjaGFydENvbmZpZz86IEFic3RyYWN0Q2hhcnRDb25maWc7XG4gIHlBeGlzTGFiZWw/OiBzdHJpbmc7XG4gIHlBeGlzU3VmZml4Pzogc3RyaW5nO1xuICB5TGFiZWxzT2Zmc2V0PzogbnVtYmVyO1xuICB5QXhpc0ludGVydmFsPzogbnVtYmVyO1xuICB4QXhpc0xhYmVsPzogc3RyaW5nO1xuICB4TGFiZWxzT2Zmc2V0PzogbnVtYmVyO1xuICBoaWRlUG9pbnRzQXRJbmRleD86IG51bWJlcltdO1xuICByZW5kZXJMYWJlbHNFdmVuSWZIaWRkZW4/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFic3RyYWN0Q2hhcnRDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZyB7XG4gIHZlcnRpY2FsTGluZXNJbnRlcnZhbD86IG51bWJlcjtcbiAgY291bnQ/OiBudW1iZXI7XG4gIGRhdGE/OiBEYXRhc2V0W107XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIHBhZGRpbmdUb3A/OiBudW1iZXI7XG4gIHBhZGRpbmdSaWdodD86IG51bWJlcjtcbiAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XG4gIGZvcm1hdFlMYWJlbD86ICh5TGFiZWw6IHN0cmluZykgPT4gc3RyaW5nO1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgaG9yaXpvbnRhbE9mZnNldD86IG51bWJlcjtcbiAgc3RhY2tlZEJhcj86IGJvb2xlYW47XG4gIHZlcnRpY2FsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcbiAgZm9ybWF0WExhYmVsPzogKHhMYWJlbDogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IHR5cGUgQWJzdHJhY3RDaGFydFN0YXRlID0ge307XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFID0gMC43NTtcblxuY2xhc3MgQWJzdHJhY3RDaGFydDxcbiAgSVByb3BzIGV4dGVuZHMgQWJzdHJhY3RDaGFydFByb3BzLFxuICBJU3RhdGUgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0U3RhdGVcbj4gZXh0ZW5kcyBDb21wb25lbnQ8QWJzdHJhY3RDaGFydFByb3BzICYgSVByb3BzLCBBYnN0cmFjdENoYXJ0U3RhdGUgJiBJU3RhdGU+IHtcbiAgY2FsY1NjYWxlciA9IChkYXRhOiBudW1iZXJbXSkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmZyb21aZXJvKSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoLi4uZGF0YSwgMCkgLSBNYXRoLm1pbiguLi5kYXRhLCAwKSB8fCAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5mcm9tTnVtYmVyKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBNYXRoLm1heCguLi5kYXRhLCB0aGlzLnByb3BzLmZyb21OdW1iZXIpIC1cbiAgICAgICAgICBNYXRoLm1pbiguLi5kYXRhLCB0aGlzLnByb3BzLmZyb21OdW1iZXIpIHx8IDFcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCguLi5kYXRhKSAtIE1hdGgubWluKC4uLmRhdGEpIHx8IDE7XG4gICAgfVxuICB9O1xuXG4gIGNhbGNCYXNlSGVpZ2h0ID0gKGRhdGE6IG51bWJlcltdLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLmRhdGEpO1xuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmRhdGEpO1xuICAgIGlmIChtaW4gPj0gMCAmJiBtYXggPj0gMCkge1xuICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICB9IGVsc2UgaWYgKG1pbiA8IDAgJiYgbWF4IDw9IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSBpZiAobWluIDwgMCAmJiBtYXggPiAwKSB7XG4gICAgICByZXR1cm4gKGhlaWdodCAqIG1heCkgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSk7XG4gICAgfVxuICB9O1xuXG4gIGNhbGNIZWlnaHQgPSAodmFsOiBudW1iZXIsIGRhdGE6IG51bWJlcltdLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmRhdGEpO1xuICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLmRhdGEpO1xuXG4gICAgaWYgKG1pbiA8IDAgJiYgbWF4ID4gMCkge1xuICAgICAgcmV0dXJuIGhlaWdodCAqICh2YWwgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpO1xuICAgIH0gZWxzZSBpZiAobWluID49IDAgJiYgbWF4ID49IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmZyb21aZXJvXG4gICAgICAgID8gaGVpZ2h0ICogKHZhbCAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSlcbiAgICAgICAgOiBoZWlnaHQgKiAoKHZhbCAtIG1pbikgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpO1xuICAgIH0gZWxzZSBpZiAobWluIDwgMCAmJiBtYXggPD0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgPyBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKVxuICAgICAgICA6IGhlaWdodCAqICgodmFsIC0gbWF4KSAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSk7XG4gICAgfVxuICB9O1xuXG4gIGdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCkge1xuICAgIGNvbnN0IHsgcHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMgPSB7fSB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4ge1xuICAgICAgc3Ryb2tlOiB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKDAuMiksXG4gICAgICBzdHJva2VEYXNoYXJyYXk6IFwiNSwgMTBcIixcbiAgICAgIHN0cm9rZVdpZHRoOiAxLFxuICAgICAgLi4ucHJvcHNGb3JCYWNrZ3JvdW5kTGluZXNcbiAgICB9O1xuICB9XG5cbiAgZ2V0UHJvcHNGb3JMYWJlbHMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJvcHNGb3JMYWJlbHMgPSB7fSxcbiAgICAgIGNvbG9yLFxuICAgICAgbGFiZWxDb2xvciA9IGNvbG9yXG4gICAgfSA9IHRoaXMucHJvcHMuY2hhcnRDb25maWc7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZvbnRTaXplOiAxMixcbiAgICAgIGZpbGw6IGxhYmVsQ29sb3IoMC44KSxcbiAgICAgIC4uLnByb3BzRm9yTGFiZWxzXG4gICAgfTtcbiAgfVxuXG4gIGdldFByb3BzRm9yVmVydGljYWxMYWJlbHMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJvcHNGb3JWZXJ0aWNhbExhYmVscyA9IHt9LFxuICAgICAgY29sb3IsXG4gICAgICBsYWJlbENvbG9yID0gY29sb3JcbiAgICB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4ge1xuICAgICAgZmlsbDogbGFiZWxDb2xvcigwLjgpLFxuICAgICAgLi4ucHJvcHNGb3JWZXJ0aWNhbExhYmVsc1xuICAgIH07XG4gIH1cblxuICBnZXRQcm9wc0Zvckhvcml6b250YWxMYWJlbHMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJvcHNGb3JIb3Jpem9udGFsTGFiZWxzID0ge30sXG4gICAgICBjb2xvcixcbiAgICAgIGxhYmVsQ29sb3IgPSBjb2xvclxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiB7XG4gICAgICBmaWxsOiBsYWJlbENvbG9yKDAuOCksXG4gICAgICAuLi5wcm9wc0Zvckhvcml6b250YWxMYWJlbHNcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVySG9yaXpvbnRhbExpbmVzID0gY29uZmlnID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBjb3VudCxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcGFkZGluZ1RvcCxcbiAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgICB9ID0gY29uZmlnO1xuICAgIGNvbnN0IGJhc2VQb3NpdGlvbiA9IGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZTtcblxuICAgIHJldHVybiBbLi4ubmV3IEFycmF5KGNvdW50ICsgMSldLm1hcCgoXywgaSkgPT4ge1xuICAgICAgY29uc3QgeSA9IChiYXNlUG9zaXRpb24gLyBjb3VudCkgKiBpICsgcGFkZGluZ1RvcDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxMaW5lXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHgxPXtwYWRkaW5nUmlnaHR9XG4gICAgICAgICAgeTE9e3l9XG4gICAgICAgICAgeDI9e3dpZHRofVxuICAgICAgICAgIHkyPXt5fVxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlckhvcml6b250YWxMaW5lID0gY29uZmlnID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHBhZGRpbmdUb3AsXG4gICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXG4gICAgfSA9IGNvbmZpZztcbiAgICByZXR1cm4gKFxuICAgICAgPExpbmVcbiAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICB4MT17cGFkZGluZ1JpZ2h0fVxuICAgICAgICB5MT17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cbiAgICAgICAgeDI9e3dpZHRofVxuICAgICAgICB5Mj17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cbiAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfTtcblxuICByZW5kZXJIb3Jpem9udGFsTGFiZWxzID0gKFxuICAgIGNvbmZpZzogT21pdDxBYnN0cmFjdENoYXJ0Q29uZmlnLCBcImRhdGFcIj4gJiB7IGRhdGE6IG51bWJlcltdIH1cbiAgKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgY291bnQsXG4gICAgICBkYXRhLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcGFkZGluZ1RvcCxcbiAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgIGhvcml6b250YWxMYWJlbFJvdGF0aW9uID0gMCxcbiAgICAgIGRlY2ltYWxQbGFjZXMgPSAyLFxuICAgICAgZm9ybWF0WUxhYmVsID0gKHlMYWJlbDogc3RyaW5nKSA9PiB5TGFiZWwsXG4gICAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXG4gICAgfSA9IGNvbmZpZztcblxuICAgIGNvbnN0IHtcbiAgICAgIHlBeGlzTGFiZWwgPSBcIlwiLFxuICAgICAgeUF4aXNTdWZmaXggPSBcIlwiLFxuICAgICAgeUxhYmVsc09mZnNldCA9IDEyXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIG5ldyBBcnJheShjb3VudCA9PT0gMSA/IDEgOiBjb3VudCArIDEpLmZpbGwoMSkubWFwKChfLCBpKSA9PiB7XG4gICAgICBsZXQgeUxhYmVsID0gU3RyaW5nKGkgKiBjb3VudCk7XG5cbiAgICAgIGlmIChjb3VudCA9PT0gMSkge1xuICAgICAgICB5TGFiZWwgPSBgJHt5QXhpc0xhYmVsfSR7Zm9ybWF0WUxhYmVsKFxuICAgICAgICAgIGRhdGFbMF0udG9GaXhlZChkZWNpbWFsUGxhY2VzKVxuICAgICAgICApfSR7eUF4aXNTdWZmaXh9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5wcm9wcy5mcm9tWmVyb1xuICAgICAgICAgID8gKHRoaXMuY2FsY1NjYWxlcihkYXRhKSAvIGNvdW50KSAqIGkgKyBNYXRoLm1pbiguLi5kYXRhLCAwKVxuICAgICAgICAgIDogKHRoaXMuY2FsY1NjYWxlcihkYXRhKSAvIGNvdW50KSAqIGkgKyBNYXRoLm1pbiguLi5kYXRhKTtcbiAgICAgICAgeUxhYmVsID0gYCR7eUF4aXNMYWJlbH0ke2Zvcm1hdFlMYWJlbChcbiAgICAgICAgICBsYWJlbC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpXG4gICAgICAgICl9JHt5QXhpc1N1ZmZpeH1gO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBiYXNlUG9zaXRpb24gPSBoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2U7XG4gICAgICBjb25zdCB4ID0gcGFkZGluZ1JpZ2h0IC0geUxhYmVsc09mZnNldDtcbiAgICAgIGNvbnN0IHkgPVxuICAgICAgICBjb3VudCA9PT0gMSAmJiB0aGlzLnByb3BzLmZyb21aZXJvXG4gICAgICAgICAgPyBwYWRkaW5nVG9wICsgNFxuICAgICAgICAgIDogaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlIC1cbiAgICAgICAgICAgIChiYXNlUG9zaXRpb24gLyBjb3VudCkgKiBpICtcbiAgICAgICAgICAgIHBhZGRpbmdUb3A7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGV4dFxuICAgICAgICAgIHJvdGF0aW9uPXtob3Jpem9udGFsTGFiZWxSb3RhdGlvbn1cbiAgICAgICAgICBvcmlnaW49e2Ake3h9LCAke3l9YH1cbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgeD17eH1cbiAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCJcbiAgICAgICAgICB5PXt5fVxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCl9XG4gICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JIb3Jpem9udGFsTGFiZWxzKCl9XG4gICAgICAgID5cbiAgICAgICAgICB7eUxhYmVsfVxuICAgICAgICA8L1RleHQ+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlclZlcnRpY2FsTGFiZWxzID0gKHtcbiAgICBsYWJlbHMgPSBbXSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgaG9yaXpvbnRhbE9mZnNldCA9IDAsXG4gICAgc3RhY2tlZEJhciA9IGZhbHNlLFxuICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgZm9ybWF0WExhYmVsID0geExhYmVsID0+IHhMYWJlbCxcbiAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICB8IFwibGFiZWxzXCJcbiAgICB8IFwid2lkdGhcIlxuICAgIHwgXCJoZWlnaHRcIlxuICAgIHwgXCJwYWRkaW5nUmlnaHRcIlxuICAgIHwgXCJwYWRkaW5nVG9wXCJcbiAgICB8IFwiaG9yaXpvbnRhbE9mZnNldFwiXG4gICAgfCBcInN0YWNrZWRCYXJcIlxuICAgIHwgXCJ2ZXJ0aWNhbExhYmVsUm90YXRpb25cIlxuICAgIHwgXCJmb3JtYXRYTGFiZWxcIlxuICAgIHwgXCJ2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2VcIlxuICA+KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgeEF4aXNMYWJlbCA9IFwiXCIsXG4gICAgICB4TGFiZWxzT2Zmc2V0ID0gMCxcbiAgICAgIGhpZGVQb2ludHNBdEluZGV4ID0gW10sXG4gICAgICByZW5kZXJMYWJlbHNFdmVuSWZIaWRkZW5cbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGZvbnRTaXplID0gMTI7XG5cbiAgICBsZXQgZmFjID0gMTtcbiAgICBpZiAoc3RhY2tlZEJhcikge1xuICAgICAgZmFjID0gMC43MTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGFiZWxzLm1hcCgobGFiZWwsIGkpID0+IHtcbiAgICAgIGlmIChoaWRlUG9pbnRzQXRJbmRleC5pbmNsdWRlcyhpKSAmJiAhcmVuZGVyTGFiZWxzRXZlbklmSGlkZGVuKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB4ID1cbiAgICAgICAgKCgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gbGFiZWxzLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgIGhvcml6b250YWxPZmZzZXQpICpcbiAgICAgICAgZmFjO1xuXG4gICAgICBjb25zdCB5ID1cbiAgICAgICAgaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICtcbiAgICAgICAgcGFkZGluZ1RvcCArXG4gICAgICAgIGZvbnRTaXplICogMiArXG4gICAgICAgIHhMYWJlbHNPZmZzZXQ7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUZXh0XG4gICAgICAgICAgb3JpZ2luPXtgJHt4fSwgJHt5fWB9XG4gICAgICAgICAgcm90YXRpb249e3ZlcnRpY2FsTGFiZWxSb3RhdGlvbn1cbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgeD17eH1cbiAgICAgICAgICB5PXt5fVxuICAgICAgICAgIHRleHRBbmNob3I9e3ZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9PT0gMCA/IFwibWlkZGxlXCIgOiBcInN0YXJ0XCJ9XG4gICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKX1cbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvclZlcnRpY2FsTGFiZWxzKCl9XG4gICAgICAgID5cbiAgICAgICAgICB7YCR7Zm9ybWF0WExhYmVsKGxhYmVsKX0ke3hBeGlzTGFiZWx9YH1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXJWZXJ0aWNhbExpbmVzID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICB2ZXJ0aWNhbExpbmVzSW50ZXJ2YWwsXG4gICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICB9OiBPbWl0PFxuICAgIFBpY2s8XG4gICAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgICAgfCBcImRhdGFcIlxuICAgICAgfCBcIndpZHRoXCJcbiAgICAgIHwgXCJoZWlnaHRcIlxuICAgICAgfCBcInBhZGRpbmdSaWdodFwiXG4gICAgICB8IFwicGFkZGluZ1RvcFwiXG4gICAgICB8IFwidmVydGljYWxMaW5lc0ludGVydmFsXCJcbiAgICAgIHwgXCJ2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2VcIlxuICAgID4sXG4gICAgXCJkYXRhXCJcbiAgPiAmIHsgZGF0YTogbnVtYmVyW10gfSkgPT4ge1xuICAgIGNvbnN0IHsgeUF4aXNJbnRlcnZhbCA9IDEgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gWy4uLm5ldyBBcnJheShNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyB5QXhpc0ludGVydmFsKSldXG4gICAgICAubWFwKChfLCBpKSA9PiB7XG4gICAgICAgIGlmICh2ZXJ0aWNhbExpbmVzSW50ZXJ2YWwgJiYgaSAlIHZlcnRpY2FsTGluZXNJbnRlcnZhbCAhPSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TGluZVxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgeDE9e01hdGguZmxvb3IoXG4gICAgICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gKGRhdGEubGVuZ3RoIC8geUF4aXNJbnRlcnZhbCkpICogaSArXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgeTE9ezB9XG4gICAgICAgICAgICB4Mj17TWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgKCh3aWR0aCAtIHBhZGRpbmdSaWdodCkgLyAoZGF0YS5sZW5ndGggLyB5QXhpc0ludGVydmFsKSkgKiBpICtcbiAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB5Mj17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cbiAgICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKGQgPT4gISFkKTtcbiAgfTtcblxuICByZW5kZXJWZXJ0aWNhbExpbmUgPSAoe1xuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJ2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2VcIlxuICA+KSA9PiAoXG4gICAgPExpbmVcbiAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgIHgxPXtNYXRoLmZsb29yKHBhZGRpbmdSaWdodCl9XG4gICAgICB5MT17MH1cbiAgICAgIHgyPXtNYXRoLmZsb29yKHBhZGRpbmdSaWdodCl9XG4gICAgICB5Mj17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cbiAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XG4gICAgLz5cbiAgKTtcblxuICByZW5kZXJEZWZzID0gKFxuICAgIGNvbmZpZzogUGljazxcbiAgICAgIFBhcnRpYWxCeTxcbiAgICAgICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XCJcbiAgICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVwiXG4gICAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRcIlxuICAgICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVwiXG4gICAgICA+LFxuICAgICAgfCBcIndpZHRoXCJcbiAgICAgIHwgXCJoZWlnaHRcIlxuICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudEZyb21cIlxuICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudFRvXCJcbiAgICAgIHwgXCJ1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XCJcbiAgICAgIHwgXCJkYXRhXCJcbiAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVwiXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCJcbiAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRcIlxuICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHlcIlxuICAgID5cbiAgKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBiYWNrZ3JvdW5kR3JhZGllbnRGcm9tLFxuICAgICAgYmFja2dyb3VuZEdyYWRpZW50VG8sXG4gICAgICB1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0LFxuICAgICAgZGF0YVxuICAgIH0gPSBjb25maWc7XG5cbiAgICBjb25zdCBmcm9tT3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XCIpXG4gICAgICA/IGNvbmZpZy5iYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVxuICAgICAgOiAxLjA7XG4gICAgY29uc3QgdG9PcGFjaXR5ID0gY29uZmlnLmhhc093blByb3BlcnR5KFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCIpXG4gICAgICA/IGNvbmZpZy5iYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHlcbiAgICAgIDogMS4wO1xuXG4gICAgY29uc3QgZmlsbFNoYWRvd0dyYWRpZW50ID0gY29uZmlnLmhhc093blByb3BlcnR5KFwiZmlsbFNoYWRvd0dyYWRpZW50XCIpXG4gICAgICA/IGNvbmZpZy5maWxsU2hhZG93R3JhZGllbnRcbiAgICAgIDogdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigxLjApO1xuXG4gICAgY29uc3QgZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcbiAgICAgIFwiZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVwiXG4gICAgKVxuICAgICAgPyBjb25maWcuZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVxuICAgICAgOiAwLjE7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPERlZnM+XG4gICAgICAgIDxMaW5lYXJHcmFkaWVudFxuICAgICAgICAgIGlkPVwiYmFja2dyb3VuZEdyYWRpZW50XCJcbiAgICAgICAgICB4MT17MH1cbiAgICAgICAgICB5MT17aGVpZ2h0fVxuICAgICAgICAgIHgyPXt3aWR0aH1cbiAgICAgICAgICB5Mj17MH1cbiAgICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgICAgc3RvcENvbG9yPXtiYWNrZ3JvdW5kR3JhZGllbnRGcm9tfVxuICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2Zyb21PcGFjaXR5fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgIG9mZnNldD1cIjFcIlxuICAgICAgICAgICAgc3RvcENvbG9yPXtiYWNrZ3JvdW5kR3JhZGllbnRUb31cbiAgICAgICAgICAgIHN0b3BPcGFjaXR5PXt0b09wYWNpdHl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MaW5lYXJHcmFkaWVudD5cbiAgICAgICAge3VzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXQgPyAoXG4gICAgICAgICAgZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8TGluZWFyR3JhZGllbnRcbiAgICAgICAgICAgICAgaWQ9e2BmaWxsU2hhZG93R3JhZGllbnRfJHtpbmRleH1gfVxuICAgICAgICAgICAgICBrZXk9e2Ake2luZGV4fWB9XG4gICAgICAgICAgICAgIHgxPXswfVxuICAgICAgICAgICAgICB5MT17MH1cbiAgICAgICAgICAgICAgeDI9ezB9XG4gICAgICAgICAgICAgIHkyPXtoZWlnaHR9XG4gICAgICAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdG9wXG4gICAgICAgICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICAgICAgICAgc3RvcENvbG9yPXtcbiAgICAgICAgICAgICAgICAgIGRhdGFzZXQuY29sb3IgPyBkYXRhc2V0LmNvbG9yKDEuMCkgOiBmaWxsU2hhZG93R3JhZGllbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2ZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxTdG9wXG4gICAgICAgICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICAgICAgICAgc3RvcENvbG9yPXtcbiAgICAgICAgICAgICAgICAgIGRhdGFzZXQuY29sb3JcbiAgICAgICAgICAgICAgICAgICAgPyBkYXRhc2V0LmNvbG9yKGZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHkpXG4gICAgICAgICAgICAgICAgICAgIDogZmlsbFNoYWRvd0dyYWRpZW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0b3BPcGFjaXR5PVwiMFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxuICAgICAgICAgICkpXG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPExpbmVhckdyYWRpZW50XG4gICAgICAgICAgICBpZD1cImZpbGxTaGFkb3dHcmFkaWVudFwiXG4gICAgICAgICAgICB4MT17MH1cbiAgICAgICAgICAgIHkxPXswfVxuICAgICAgICAgICAgeDI9ezB9XG4gICAgICAgICAgICB5Mj17aGVpZ2h0fVxuICAgICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RvcFxuICAgICAgICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgICAgICAgc3RvcENvbG9yPXtmaWxsU2hhZG93R3JhZGllbnR9XG4gICAgICAgICAgICAgIHN0b3BPcGFjaXR5PXtmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTdG9wIG9mZnNldD1cIjFcIiBzdG9wQ29sb3I9e2ZpbGxTaGFkb3dHcmFkaWVudH0gc3RvcE9wYWNpdHk9XCIwXCIgLz5cbiAgICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxuICAgICAgICApfVxuICAgICAgPC9EZWZzPlxuICAgICk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0Q2hhcnQ7XG4iXX0=
