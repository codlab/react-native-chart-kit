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
import React from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import {
  Circle,
  G,
  Path,
  Polygon,
  Polyline,
  Rect,
  Svg
} from "react-native-svg";
import AbstractChart from "../AbstractChart";
import { LegendItem } from "./LegendItem";
var AnimatedCircle = Animated.createAnimatedComponent(Circle);
var LineChart = /** @class */ (function(_super) {
  __extends(LineChart, _super);
  function LineChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.label = React.createRef();
    _this.state = {
      scrollableDotHorizontalOffset: new Animated.Value(0)
    };
    _this.getColor = function(dataset, opacity) {
      return (dataset.color || _this.props.chartConfig.color)(opacity);
    };
    _this.getStrokeWidth = function(dataset) {
      return dataset.strokeWidth || _this.props.chartConfig.strokeWidth || 3;
    };
    _this.getDatas = function(data) {
      return data.reduce(function(acc, item) {
        return item.data ? __spreadArrays(acc, item.data) : acc;
      }, []);
    };
    _this.getPropsForDots = function(x, i) {
      var _a = _this.props,
        getDotProps = _a.getDotProps,
        chartConfig = _a.chartConfig;
      if (typeof getDotProps === "function") {
        return getDotProps(x, i);
      }
      var _b = chartConfig.propsForDots,
        propsForDots = _b === void 0 ? {} : _b;
      return __assign({ r: "4" }, propsForDots);
    };
    _this.renderDots = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        onDataPointClick = _a.onDataPointClick;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var _b = _this.props,
        getDotColor = _b.getDotColor,
        _c = _b.hidePointsAtIndex,
        hidePointsAtIndex = _c === void 0 ? [] : _c,
        _d = _b.renderDotContent,
        renderDotContent =
          _d === void 0
            ? function() {
                return null;
              }
            : _d;
      data.forEach(function(dataset) {
        if (dataset.withDots == false) return;
        dataset.data.forEach(function(x, i) {
          if (hidePointsAtIndex.includes(i)) {
            return;
          }
          var cx =
            paddingRight + (i * (width - paddingRight)) / dataset.data.length;
          var cy =
            ((baseHeight - _this.calcHeight(x, datas, height)) / 4) * 3 +
            paddingTop;
          var onPress = function() {
            if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
              return;
            }
            onDataPointClick({
              index: i,
              value: x,
              dataset: dataset,
              x: cx,
              y: cy,
              getColor: function(opacity) {
                return _this.getColor(dataset, opacity);
              }
            });
          };
          output.push(
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              fill={
                typeof getDotColor === "function"
                  ? getDotColor(x, i)
                  : _this.getColor(dataset, 0.9)
              }
              onPress={onPress}
              {..._this.getPropsForDots(x, i)}
            />,
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              r="14"
              fill="#fff"
              fillOpacity={0}
              onPress={onPress}
            />,
            renderDotContent({ x: cx, y: cy, index: i, indexData: x })
          );
        });
      });
      return output;
    };
    _this.renderScrollableDot = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        scrollableDotHorizontalOffset = _a.scrollableDotHorizontalOffset,
        scrollableDotFill = _a.scrollableDotFill,
        scrollableDotStrokeColor = _a.scrollableDotStrokeColor,
        scrollableDotStrokeWidth = _a.scrollableDotStrokeWidth,
        scrollableDotRadius = _a.scrollableDotRadius,
        scrollableInfoViewStyle = _a.scrollableInfoViewStyle,
        scrollableInfoTextStyle = _a.scrollableInfoTextStyle,
        _b = _a.scrollableInfoTextDecorator,
        scrollableInfoTextDecorator =
          _b === void 0
            ? function(x) {
                return "" + x;
              }
            : _b,
        scrollableInfoSize = _a.scrollableInfoSize,
        scrollableInfoOffset = _a.scrollableInfoOffset;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var vl = [];
      var perData = width / data[0].data.length;
      for (var index = 0; index < data[0].data.length; index++) {
        vl.push(index * perData);
      }
      var lastIndex;
      scrollableDotHorizontalOffset.addListener(function(value) {
        var index = value.value / perData;
        if (!lastIndex) {
          lastIndex = index;
        }
        var abs = Math.floor(index);
        var percent = index - abs;
        abs = data[0].data.length - abs - 1;
        if (index >= data[0].data.length - 1) {
          _this.label.current.setNativeProps({
            text: scrollableInfoTextDecorator(Math.floor(data[0].data[0]))
          });
        } else {
          if (index > lastIndex) {
            // to right
            var base = data[0].data[abs];
            var prev = data[0].data[abs - 1];
            if (prev > base) {
              var rest = prev - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - prev;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          } else {
            // to left
            var base = data[0].data[abs - 1];
            var next = data[0].data[abs];
            percent = 1 - percent;
            if (next > base) {
              var rest = next - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - next;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          }
        }
        lastIndex = index;
      });
      data.forEach(function(dataset) {
        if (dataset.withScrollableDot == false) return;
        var perData = width / dataset.data.length;
        var values = [];
        var yValues = [];
        var xValues = [];
        var yValuesLabel = [];
        var xValuesLabel = [];
        for (var index = 0; index < dataset.data.length; index++) {
          values.push(index * perData);
          var yval =
            ((baseHeight -
              _this.calcHeight(
                dataset.data[dataset.data.length - index - 1],
                datas,
                height
              )) /
              4) *
              3 +
            paddingTop;
          yValues.push(yval);
          var xval =
            paddingRight +
            ((dataset.data.length - index - 1) * (width - paddingRight)) /
              dataset.data.length;
          xValues.push(xval);
          yValuesLabel.push(
            yval - (scrollableInfoSize.height + scrollableInfoOffset)
          );
          xValuesLabel.push(xval - scrollableInfoSize.width / 2);
        }
        var translateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValues,
          extrapolate: "clamp"
        });
        var translateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValues,
          extrapolate: "clamp"
        });
        var labelTranslateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValuesLabel,
          extrapolate: "clamp"
        });
        var labelTranslateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValuesLabel,
          extrapolate: "clamp"
        });
        output.push([
          <Animated.View
            key={Math.random()}
            style={[
              scrollableInfoViewStyle,
              {
                transform: [
                  { translateX: labelTranslateX },
                  { translateY: labelTranslateY }
                ],
                width: scrollableInfoSize.width,
                height: scrollableInfoSize.height
              }
            ]}
          >
            <TextInput
              onLayout={function() {
                _this.label.current.setNativeProps({
                  text: scrollableInfoTextDecorator(
                    Math.floor(data[0].data[data[0].data.length - 1])
                  )
                });
              }}
              style={scrollableInfoTextStyle}
              ref={_this.label}
            />
          </Animated.View>,
          <AnimatedCircle
            key={Math.random()}
            cx={translateX}
            cy={translateY}
            r={scrollableDotRadius}
            stroke={scrollableDotStrokeColor}
            strokeWidth={scrollableDotStrokeWidth}
            fill={scrollableDotFill}
          />
        ]);
      });
      return output;
    };
    _this.renderShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      if (_this.props.bezier) {
        return _this.renderBezierShadow({
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data,
          useColorFromDataset: useColorFromDataset
        });
      }
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var toPoint = function(data, length, index) {
        var x = (index * (width - paddingRight)) / length + paddingRight;
        var y =
          ((baseHeight - _this.calcHeight(data, datas, height)) / 4) * 3 +
          paddingTop;
        return { x: x, y: y, index: index };
      };
      var toPoints = function(dataset, lines) {
        return lines.map(function(line) {
          var length = dataset.data.length;
          var points = line.map(function(_a) {
            var data = _a.data,
              index = _a.index;
            return toPoint(data, length, index);
          });
          var extremLeft = line.length > 0 ? line[0] : undefined;
          var extremRight = line.length > 0 ? line[line.length - 1] : undefined;
          //we extract the corresponding value for 0
          //this is interesting in case 0 is between max and min or top or bottom
          //we then have a clear right -> left back closing value
          //TODO since the 0 value is at most at {left} and {right} from this subset, we can add it to the line itself
          var left = extremLeft
            ? toPoint(0, length, extremLeft.index)
            : undefined;
          var right = extremRight
            ? toPoint(0, length, extremRight.index)
            : undefined;
          return { points: points, left: left, right: right };
        });
      };
      var skipped = _this.props.dataSkippedSegments || [];
      var avoid = _this.props.hidePointsAtIndex || [];
      var output = [];
      data.forEach(function(dataset, index) {
        var length = dataset.data.length;
        var lines = [];
        var can_skip =
          !!skipped && skipped.length > 0 && skipped.length >= length;
        var can_avoid = !!avoid && avoid.length && avoid.length <= length;
        if (can_skip || can_avoid) {
          var current_line = [];
          var temp = [];
          dataset.data.map(function(data, index) {
            if (
              !!skipped[index] ||
              avoid.find(function(i) {
                return i == index;
              })
            ) {
              if (current_line && current_line.length > 0) {
                temp.push(current_line);
                current_line = [];
              }
            } else {
              current_line.push({ data: data, index: index });
            }
          });
          if (current_line.length > 0) temp.push(current_line);
          lines = toPoints(dataset, temp);
        } else {
          var temp_1 = [
            dataset.data.map(function(data, index) {
              return { data: data, index: index };
            })
          ];
          lines = toPoints(dataset, temp_1);
        }
        lines.forEach(function(points, index) {
          /*var x1: string | number =
                      paddingRight +
                      ((width - paddingRight) / dataset.data.length) *
                        (dataset.data.length - 1);
                    if (points.length > 0) {
                      //here, we check if we need to get the last point of the line
                      const last = points[points.length - 1];
                      x1 = last.point.split(",")[0];
                    }
                    const y1 = (height / 4) * 3 + paddingTop;
                    var x2: string | number = paddingRight;
                    if (points.length > 0 && points[0].index > 0) {
                      //here we check if we need to get the first line's point x to make the upper shadow
                      const first = points[0];
                      x2 = first.point.split(",")[0];
                    }
                    const y2 = (height / 4) * 3 + paddingTop;*/
          var result = __spreadArrays(points.points);
          if (points.right) result.push(points.right);
          if (points.left) result.push(points.left);
          if (result.length == 0) return;
          /*
                                  points.map(({ point }) => point).join(" ") +
                                  ` ${x1},${y1} ${x2},${y2}`
                    */
          output.push(
            <Polygon
              key={index}
              points={result
                .map(function(p) {
                  return p.x + "," + p.y;
                })
                .join(" ")}
              fill={
                "url(#fillShadowGradient" +
                (useColorFromDataset ? "_" + index : "") +
                ")"
              }
              strokeWidth={0}
            />
          );
        });
      });
      return output;
    };
    _this.renderLine = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        linejoinType = _a.linejoinType;
      if (_this.props.bezier) {
        return _this.renderBezierLine({
          data: data,
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop
        });
      }
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var lastPoint;
      var toPoints = function(dataset, lines) {
        return lines.map(function(line) {
          return line.map(function(_a) {
            var data = _a.data,
              index = _a.index;
            if (data === null) return lastPoint;
            var x =
              (index * (width - paddingRight)) / dataset.data.length +
              paddingRight;
            var y =
              ((baseHeight - _this.calcHeight(data, datas, height)) / 4) * 3 +
              paddingTop;
            lastPoint = x + "," + y;
            return x + "," + y;
          });
        });
      };
      var skipped = _this.props.dataSkippedSegments || [];
      var avoid = _this.props.hidePointsAtIndex || [];
      data.forEach(function(dataset, index) {
        var length = dataset.data.length;
        var lines = [];
        var can_skip =
          !!skipped && skipped.length > 0 && skipped.length >= length;
        var can_avoid = !!avoid && avoid.length && avoid.length <= length;
        if (can_skip || can_avoid) {
          var current_line = [];
          var temp = [];
          dataset.data.map(function(data, index) {
            if (
              !!skipped[index] ||
              avoid.find(function(i) {
                return i == index;
              })
            ) {
              if (current_line && current_line.length > 0) {
                temp.push(current_line);
                current_line = [];
              }
            } else {
              current_line.push({ data: data, index: index });
            }
          });
          if (current_line.length > 0) temp.push(current_line);
          lines = toPoints(dataset, temp);
        } else {
          var temp_2 = [
            dataset.data.map(function(data, index) {
              return { data: data, index: index };
            })
          ];
          lines = toPoints(dataset, temp_2);
        }
        lines.forEach(function(points) {
          output.push(
            <Polyline
              key={index}
              strokeLinejoin={linejoinType}
              points={points.join(" ")}
              fill="none"
              stroke={_this.getColor(dataset, 0.2)}
              strokeWidth={_this.getStrokeWidth(dataset)}
              strokeDasharray={dataset.strokeDashArray}
              strokeDashoffset={dataset.strokeDashOffset}
            />
          );
        });
      });
      return output;
    };
    _this.getBezierLinePoints = function(dataset, _a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data;
      if (dataset.data.length === 0) {
        return "M0,0";
      }
      var datas = _this.getDatas(data);
      var x = function(i) {
        return Math.floor(
          paddingRight + (i * (width - paddingRight)) / dataset.data.length
        );
      };
      var baseHeight = _this.calcBaseHeight(datas, height);
      var y = function(i) {
        var yHeight = _this.calcHeight(dataset.data[i], datas, height);
        return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
      };
      return ["M" + x(0) + "," + y(0)]
        .concat(
          dataset.data.slice(0, -1).map(function(_, i) {
            var x_mid = (x(i) + x(i + 1)) / 2;
            var y_mid = (y(i) + y(i + 1)) / 2;
            var cp_x1 = (x_mid + x(i)) / 2;
            var cp_x2 = (x_mid + x(i + 1)) / 2;
            return (
              "Q " +
              cp_x1 +
              ", " +
              y(i) +
              ", " +
              x_mid +
              ", " +
              y_mid +
              (" Q " +
                cp_x2 +
                ", " +
                y(i + 1) +
                ", " +
                x(i + 1) +
                ", " +
                y(i + 1))
            );
          })
        )
        .join(" ");
    };
    _this.renderBezierLine = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop;
      return data.map(function(dataset, index) {
        var result = _this.getBezierLinePoints(dataset, {
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data
        });
        return (
          <Path
            key={index}
            d={result}
            fill="none"
            stroke={_this.getColor(dataset, 0.2)}
            strokeWidth={_this.getStrokeWidth(dataset)}
            strokeDasharray={dataset.strokeDashArray}
            strokeDashoffset={dataset.strokeDashOffset}
          />
        );
      });
    };
    _this.renderBezierShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      return data.map(function(dataset, index) {
        var d =
          _this.getBezierLinePoints(dataset, {
            width: width,
            height: height,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            data: data
          }) +
          (" L" +
            (paddingRight +
              ((width - paddingRight) / dataset.data.length) *
                (dataset.data.length - 1)) +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " L" +
            paddingRight +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " Z");
        return (
          <Path
            key={index}
            d={d}
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLegend = function(width, legendOffset) {
      var _a = _this.props.data,
        legend = _a.legend,
        datasets = _a.datasets;
      var baseLegendItemX = width / (legend.length + 1);
      return legend.map(function(legendItem, i) {
        return (
          <G key={Math.random()}>
            <LegendItem
              index={i}
              iconColor={_this.getColor(datasets[i], 0.9)}
              baseLegendItemX={baseLegendItemX}
              legendText={legendItem}
              labelProps={__assign({}, _this.getPropsForLabels())}
              legendOffset={legendOffset}
            />
          </G>
        );
      });
    };
    return _this;
  }
  LineChart.prototype.render = function() {
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      data = _a.data,
      _b = _a.withScrollableDot,
      withScrollableDot = _b === void 0 ? false : _b,
      _c = _a.withShadow,
      withShadow = _c === void 0 ? true : _c,
      _d = _a.withDots,
      withDots = _d === void 0 ? true : _d,
      _e = _a.withInnerLines,
      withInnerLines = _e === void 0 ? true : _e,
      _f = _a.withOuterLines,
      withOuterLines = _f === void 0 ? true : _f,
      _g = _a.withHorizontalLines,
      withHorizontalLines = _g === void 0 ? true : _g,
      _h = _a.withVerticalLines,
      withVerticalLines = _h === void 0 ? true : _h,
      _j = _a.withHorizontalLabels,
      withHorizontalLabels = _j === void 0 ? true : _j,
      _k = _a.withVerticalLabels,
      withVerticalLabels = _k === void 0 ? true : _k,
      _l = _a.style,
      style = _l === void 0 ? {} : _l,
      decorator = _a.decorator,
      onDataPointClick = _a.onDataPointClick,
      _m = _a.verticalLabelRotation,
      verticalLabelRotation = _m === void 0 ? 0 : _m,
      _o = _a.horizontalLabelRotation,
      horizontalLabelRotation = _o === void 0 ? 0 : _o,
      _p = _a.formatYLabel,
      formatYLabel =
        _p === void 0
          ? function(yLabel) {
              return yLabel;
            }
          : _p,
      _q = _a.formatXLabel,
      formatXLabel =
        _q === void 0
          ? function(xLabel) {
              return xLabel;
            }
          : _q,
      segments = _a.segments,
      _r = _a.transparent,
      transparent = _r === void 0 ? false : _r,
      chartConfig = _a.chartConfig,
      verticalLinesInterval = _a.verticalLinesInterval;
    var scrollableDotHorizontalOffset = this.state
      .scrollableDotHorizontalOffset;
    var _s = data.labels,
      labels = _s === void 0 ? [] : _s;
    var _t = style.borderRadius,
      borderRadius = _t === void 0 ? 0 : _t,
      _u = style.paddingTop,
      paddingTop = _u === void 0 ? 16 : _u,
      _v = style.paddingRight,
      paddingRight = _v === void 0 ? 64 : _v,
      _w = style.margin,
      margin = _w === void 0 ? 0 : _w,
      _x = style.marginRight,
      marginRight = _x === void 0 ? 0 : _x,
      _y = style.paddingBottom,
      paddingBottom = _y === void 0 ? 0 : _y;
    var config = {
      width: width,
      height: height,
      verticalLabelRotation: verticalLabelRotation,
      horizontalLabelRotation: horizontalLabelRotation,
      verticalLinesInterval: verticalLinesInterval
    };
    var datas = this.getDatas(data.datasets);
    var count =
      Math.min.apply(Math, datas) === Math.max.apply(Math, datas) ? 1 : 4;
    if (segments) {
      count = segments;
    }
    var legendOffset = this.props.data.legend ? height * 0.15 : 0;
    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + legendOffset}
          width={width - margin * 2 - marginRight}
        >
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
            fillOpacity={transparent ? 0 : 1}
          />
          {this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)}
          <G x="0" y={legendOffset}>
            {this.renderDefs(
              __assign(__assign(__assign({}, config), chartConfig), {
                data: data.datasets
              })
            )}
            <G>
              {withHorizontalLines &&
                (withInnerLines
                  ? this.renderHorizontalLines(
                      __assign(__assign({}, config), {
                        count: count,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderHorizontalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withHorizontalLabels &&
                this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: count,
                    data: datas,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatYLabel: formatYLabel,
                    decimalPlaces: chartConfig.decimalPlaces
                  })
                )}
            </G>
            <G>
              {withVerticalLines &&
                (withInnerLines
                  ? this.renderVerticalLines(
                      __assign(__assign({}, config), {
                        data: data.datasets[0].data,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderVerticalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withVerticalLabels &&
                this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: labels,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatXLabel: formatXLabel
                  })
                )}
            </G>
            <G>
              {this.renderLine(
                __assign(__assign(__assign({}, config), chartConfig), {
                  paddingRight: paddingRight,
                  paddingTop: paddingTop,
                  data: data.datasets
                })
              )}
            </G>
            <G>
              {withShadow &&
                this.renderShadow(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    useColorFromDataset: chartConfig.useShadowColorFromDataset
                  })
                )}
            </G>
            <G>
              {withDots &&
                this.renderDots(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick
                  })
                )}
            </G>
            <G>
              {withScrollableDot &&
                this.renderScrollableDot(
                  __assign(__assign(__assign({}, config), chartConfig), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick,
                    scrollableDotHorizontalOffset: scrollableDotHorizontalOffset
                  })
                )}
            </G>
            <G>
              {decorator &&
                decorator(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )}
            </G>
          </G>
        </Svg>
        {withScrollableDot && (
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{ width: width * 2 }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { x: scrollableDotHorizontalOffset }
                }
              }
            ])}
            horizontal
            bounces={false}
          />
        )}
      </View>
    );
  };
  return LineChart;
})(AbstractChart);
export default LineChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZUNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpbmUtY2hhcnQvTGluZUNoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFvQixNQUFNLE9BQU8sQ0FBQztBQUN6QyxPQUFPLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxFQUNULElBQUksRUFFTCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQ0wsTUFBTSxFQUNOLENBQUMsRUFDRCxJQUFJLEVBQ0osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osR0FBRyxFQUNKLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxhQUdOLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUxQyxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFzTjlEO0lBQXdCLDZCQUE2QztJQUFyRTtRQUFBLHFFQXUzQkM7UUF0M0JDLFdBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFhLENBQUM7UUFFckMsV0FBSyxHQUFHO1lBQ04sNkJBQTZCLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNyRCxDQUFDO1FBRUYsY0FBUSxHQUFHLFVBQUMsT0FBZ0IsRUFBRSxPQUFlO1lBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQztRQUVGLG9CQUFjLEdBQUcsVUFBQyxPQUFnQjtZQUNoQyxPQUFPLE9BQU8sQ0FBQyxXQUFXLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUM7UUFFRixjQUFRLEdBQUcsVUFBQyxJQUFlO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FDaEIsVUFBQyxHQUFHLEVBQUUsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQUssR0FBRyxFQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUExQyxDQUEwQyxFQUN6RCxFQUFFLENBQ0gsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVGLHFCQUFlLEdBQUcsVUFBQyxDQUFNLEVBQUUsQ0FBUztZQUM1QixJQUFBLEtBQStCLEtBQUksQ0FBQyxLQUFLLEVBQXZDLFdBQVcsaUJBQUEsRUFBRSxXQUFXLGlCQUFlLENBQUM7WUFFaEQsSUFBSSxPQUFPLFdBQVcsS0FBSyxVQUFVLEVBQUU7Z0JBQ3JDLE9BQU8sV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMxQjtZQUVPLElBQUEsS0FBc0IsV0FBVyxhQUFoQixFQUFqQixZQUFZLG1CQUFHLEVBQUUsS0FBQSxDQUFpQjtZQUUxQyxrQkFBUyxDQUFDLEVBQUUsR0FBRyxJQUFLLFlBQVksRUFBRztRQUNyQyxDQUFDLENBQUM7UUFFRixnQkFBVSxHQUFHLFVBQUMsRUFZYjtnQkFYQyxJQUFJLFVBQUEsRUFDSixLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixVQUFVLGdCQUFBLEVBQ1YsWUFBWSxrQkFBQSxFQUNaLGdCQUFnQixzQkFBQTtZQU9oQixJQUFNLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO1lBQy9CLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBTSxVQUFVLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFaEQsSUFBQSxLQU1GLEtBQUksQ0FBQyxLQUFLLEVBTFosV0FBVyxpQkFBQSxFQUNYLHlCQUFzQixFQUF0QixpQkFBaUIsbUJBQUcsRUFBRSxLQUFBLEVBQ3RCLHdCQUVDLEVBRkQsZ0JBQWdCLG1CQUFHO2dCQUNqQixPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsS0FDVyxDQUFDO1lBRWYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87Z0JBQ2xCLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxLQUFLO29CQUFFLE9BQU87Z0JBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ3hCLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNqQyxPQUFPO3FCQUNSO29CQUVELElBQU0sRUFBRSxHQUNOLFlBQVksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUVwRSxJQUFNLEVBQUUsR0FDTixDQUFDLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQzFELFVBQVUsQ0FBQztvQkFFYixJQUFNLE9BQU8sR0FBRzt3QkFDZCxJQUFJLENBQUMsZ0JBQWdCLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUN0RCxPQUFPO3lCQUNSO3dCQUVELGdCQUFnQixDQUFDOzRCQUNmLEtBQUssRUFBRSxDQUFDOzRCQUNSLEtBQUssRUFBRSxDQUFDOzRCQUNSLE9BQU8sU0FBQTs0QkFDUCxDQUFDLEVBQUUsRUFBRTs0QkFDTCxDQUFDLEVBQUUsRUFBRTs0QkFDTCxRQUFRLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBL0IsQ0FBK0I7eUJBQ3JELENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUM7b0JBRUYsTUFBTSxDQUFDLElBQUksQ0FDVCxDQUFDLE1BQU0sQ0FDTCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FDbkIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ1AsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ1AsSUFBSSxDQUFDLENBQ0gsT0FBTyxXQUFXLEtBQUssVUFBVTt3QkFDL0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNuQixDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQ2hDLENBQ0QsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pCLElBQUksS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDL0IsRUFDRixDQUFDLE1BQU0sQ0FDTCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FDbkIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ1AsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ1AsQ0FBQyxDQUFDLElBQUksQ0FDTixJQUFJLENBQUMsTUFBTSxDQUNYLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNmLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUNqQixFQUNGLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQzNELENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsQ0FBQztRQUVGLHlCQUFtQixHQUFHLFVBQUMsRUFtQnRCO2dCQWxCQyxJQUFJLFVBQUEsRUFDSixLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixVQUFVLGdCQUFBLEVBQ1YsWUFBWSxrQkFBQSxFQUNaLDZCQUE2QixtQ0FBQSxFQUM3QixpQkFBaUIsdUJBQUEsRUFDakIsd0JBQXdCLDhCQUFBLEVBQ3hCLHdCQUF3Qiw4QkFBQSxFQUN4QixtQkFBbUIseUJBQUEsRUFDbkIsdUJBQXVCLDZCQUFBLEVBQ3ZCLHVCQUF1Qiw2QkFBQSxFQUN2QixtQ0FBeUMsRUFBekMsMkJBQTJCLG1CQUFHLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBRyxDQUFHLEVBQU4sQ0FBTSxLQUFBLEVBQ3pDLGtCQUFrQix3QkFBQSxFQUNsQixvQkFBb0IsMEJBQUE7WUFLcEIsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBTSxVQUFVLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFdEQsSUFBSSxFQUFFLEdBQWEsRUFBRSxDQUFDO1lBRXRCLElBQU0sT0FBTyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUM1QyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3hELEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDO2FBQzFCO1lBQ0QsSUFBSSxTQUFpQixDQUFDO1lBRXRCLDZCQUE2QixDQUFDLFdBQVcsQ0FBQyxVQUFBLEtBQUs7Z0JBQzdDLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNkLFNBQVMsR0FBRyxLQUFLLENBQUM7aUJBQ25CO2dCQUVELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLElBQUksT0FBTyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7Z0JBQzFCLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUVwQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3BDLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQzt3QkFDaEMsSUFBSSxFQUFFLDJCQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMvRCxDQUFDLENBQUM7aUJBQ0o7cUJBQU07b0JBQ0wsSUFBSSxLQUFLLEdBQUcsU0FBUyxFQUFFO3dCQUNyQixXQUFXO3dCQUVYLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQy9CLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLEVBQUU7NEJBQ2YsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQzs0QkFDdkIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO2dDQUNoQyxJQUFJLEVBQUUsMkJBQTJCLENBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FDbEM7NkJBQ0YsQ0FBQyxDQUFDO3lCQUNKOzZCQUFNOzRCQUNMLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7NEJBQ3ZCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztnQ0FDaEMsSUFBSSxFQUFFLDJCQUEyQixDQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQ2xDOzZCQUNGLENBQUMsQ0FBQzt5QkFDSjtxQkFDRjt5QkFBTTt3QkFDTCxVQUFVO3dCQUVWLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNuQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUMvQixPQUFPLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQzt3QkFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFOzRCQUNmLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7NEJBQ3ZCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztnQ0FDaEMsSUFBSSxFQUFFLDJCQUEyQixDQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQ2xDOzZCQUNGLENBQUMsQ0FBQzt5QkFDSjs2QkFBTTs0QkFDTCxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUN2QixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7Z0NBQ2hDLElBQUksRUFBRSwyQkFBMkIsQ0FDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUNsQzs2QkFDRixDQUFDLENBQUM7eUJBQ0o7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUNwQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO2dCQUNsQixJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxLQUFLO29CQUFFLE9BQU87Z0JBRS9DLElBQU0sT0FBTyxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDNUMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFFakIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO2dCQUN0QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBRXRCLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtvQkFDeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUM7b0JBQzdCLElBQU0sSUFBSSxHQUNSLENBQUMsQ0FBQyxVQUFVO3dCQUNWLEtBQUksQ0FBQyxVQUFVLENBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQzdDLEtBQUssRUFDTCxNQUFNLENBQ1AsQ0FBQzt3QkFDRixDQUFDLENBQUM7d0JBQ0YsQ0FBQzt3QkFDSCxVQUFVLENBQUM7b0JBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbkIsSUFBTSxJQUFJLEdBQ1IsWUFBWTt3QkFDWixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDOzRCQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFbkIsWUFBWSxDQUFDLElBQUksQ0FDZixJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsb0JBQW9CLENBQUMsQ0FDMUQsQ0FBQztvQkFDRixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3hEO2dCQUVELElBQU0sVUFBVSxHQUFHLDZCQUE2QixDQUFDLFdBQVcsQ0FBQztvQkFDM0QsVUFBVSxFQUFFLE1BQU07b0JBQ2xCLFdBQVcsRUFBRSxPQUFPO29CQUNwQixXQUFXLEVBQUUsT0FBTztpQkFDckIsQ0FBQyxDQUFDO2dCQUVILElBQU0sVUFBVSxHQUFHLDZCQUE2QixDQUFDLFdBQVcsQ0FBQztvQkFDM0QsVUFBVSxFQUFFLE1BQU07b0JBQ2xCLFdBQVcsRUFBRSxPQUFPO29CQUNwQixXQUFXLEVBQUUsT0FBTztpQkFDckIsQ0FBQyxDQUFDO2dCQUVILElBQU0sZUFBZSxHQUFHLDZCQUE2QixDQUFDLFdBQVcsQ0FBQztvQkFDaEUsVUFBVSxFQUFFLE1BQU07b0JBQ2xCLFdBQVcsRUFBRSxZQUFZO29CQUN6QixXQUFXLEVBQUUsT0FBTztpQkFDckIsQ0FBQyxDQUFDO2dCQUVILElBQU0sZUFBZSxHQUFHLDZCQUE2QixDQUFDLFdBQVcsQ0FBQztvQkFDaEUsVUFBVSxFQUFFLE1BQU07b0JBQ2xCLFdBQVcsRUFBRSxZQUFZO29CQUN6QixXQUFXLEVBQUUsT0FBTztpQkFDckIsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ1YsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNaLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUNuQixLQUFLLENBQUMsQ0FBQzt3QkFDTCx1QkFBdUI7d0JBQ3ZCOzRCQUNFLFNBQVMsRUFBRTtnQ0FDVCxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUU7Z0NBQy9CLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRTs2QkFDaEM7NEJBQ0QsS0FBSyxFQUFFLGtCQUFrQixDQUFDLEtBQUs7NEJBQy9CLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxNQUFNO3lCQUNsQztxQkFDRixDQUFDLENBRUY7VUFBQSxDQUFDLFNBQVMsQ0FDUixRQUFRLENBQUMsQ0FBQzt3QkFDUixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7NEJBQ2hDLElBQUksRUFBRSwyQkFBMkIsQ0FDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQ2xEO3lCQUNGLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUMsQ0FDRixLQUFLLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUMvQixHQUFHLENBQUMsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLEVBRXBCO1FBQUEsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNoQixDQUFDLGNBQWMsQ0FDYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FDbkIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQ2YsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQ2YsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FDdkIsTUFBTSxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FDakMsV0FBVyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FDdEMsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsRUFDeEI7aUJBQ0gsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7UUFFRixrQkFBWSxHQUFHLFVBQUMsRUFZZjtnQkFYQyxLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixZQUFZLGtCQUFBLEVBQ1osVUFBVSxnQkFBQSxFQUNWLElBQUksVUFBQSxFQUNKLG1CQUFtQix5QkFBQTtZQU9uQixJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNyQixPQUFPLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQztvQkFDN0IsS0FBSyxPQUFBO29CQUNMLE1BQU0sUUFBQTtvQkFDTixZQUFZLGNBQUE7b0JBQ1osVUFBVSxZQUFBO29CQUNWLElBQUksTUFBQTtvQkFDSixtQkFBbUIscUJBQUE7aUJBQ3BCLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxJQUFNLFVBQVUsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV0RCxJQUFNLE9BQU8sR0FBRyxVQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSztnQkFDbEMsSUFBTSxDQUFDLEdBQ0wsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsR0FBRyxNQUFNO29CQUN6QyxZQUFZLENBQUM7Z0JBQ2YsSUFBTSxDQUFDLEdBQ0wsQ0FBQyxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUM3RCxVQUFVLENBQUM7Z0JBQ2IsT0FBTyxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUM7WUFDekIsQ0FBQyxDQUFBO1lBRUQsSUFBTSxRQUFRLEdBQUcsVUFDZixPQUFnQixFQUNoQixLQUFpRDtnQkFFakQsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtvQkFDbkIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQ25DLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFlOzRCQUFiLElBQUksVUFBQSxFQUFFLEtBQUssV0FBQTt3QkFBTyxPQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQztvQkFBNUIsQ0FBNEIsQ0FBQyxDQUFDO29CQUMzRSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQ3pELElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUV4RSwwQ0FBMEM7b0JBQzFDLHVFQUF1RTtvQkFDdkUsdURBQXVEO29CQUN2RCw0R0FBNEc7b0JBQzVHLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQzNFLElBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQzlFLE9BQU8sRUFBRSxNQUFNLFFBQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDO2dCQUNqQyxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUNGLElBQU0sT0FBTyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLElBQUksRUFBRSxDQUFDO1lBQ3JELElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDO1lBQ2pELElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUVsQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7Z0JBQzFCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUVuQyxJQUFJLEtBQUssR0FBbUUsRUFBRSxDQUFDO2dCQUUvRSxJQUFNLFFBQVEsR0FDWixDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDO2dCQUM5RCxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUM7Z0JBQ3BFLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRTtvQkFDekIsSUFBSSxZQUFZLEdBQXNDLEVBQUUsQ0FBQztvQkFDekQsSUFBSSxJQUFJLEdBQXdDLEVBQUUsQ0FBQztvQkFFbkQsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSzt3QkFDM0IsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLElBQUksS0FBSyxFQUFWLENBQVUsQ0FBQyxFQUFFOzRCQUNuRCxJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQ0FDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQ0FDeEIsWUFBWSxHQUFHLEVBQUUsQ0FBQzs2QkFDbkI7eUJBQ0Y7NkJBQU07NEJBQ0wsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQzt5QkFDcEM7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUM7d0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFckQsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ2pDO3FCQUFNO29CQUNMLElBQU0sTUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSyxJQUFLLE9BQUEsQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQUksQ0FBQyxDQUFDO2lCQUNqQztnQkFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUs7b0JBQzFCOzs7Ozs7Ozs7Ozs7Ozs7OytEQWdCMkM7b0JBQzNDLElBQU0sTUFBTSxrQkFBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2xDLElBQUcsTUFBTSxDQUFDLEtBQUs7d0JBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzNDLElBQUcsTUFBTSxDQUFDLElBQUk7d0JBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pDLElBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDO3dCQUFFLE9BQU87b0JBQ3RDOzs7c0JBR0U7b0JBQ00sTUFBTSxDQUFDLElBQUksQ0FDVCxDQUFDLE9BQU8sQ0FDTixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDWCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUcsQ0FBQyxDQUFDLENBQUMsU0FBSSxDQUFDLENBQUMsQ0FBRyxFQUFmLENBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUNuRCxJQUFJLENBQUMsQ0FBQyw2QkFDSixtQkFBbUIsQ0FBQyxDQUFDLENBQUMsTUFBSSxLQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FDckMsQ0FBQyxDQUNKLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNmLENBQ0gsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDO1FBRUYsZ0JBQVUsR0FBRyxVQUFDLEVBVWI7Z0JBVEMsS0FBSyxXQUFBLEVBQ0wsTUFBTSxZQUFBLEVBQ04sWUFBWSxrQkFBQSxFQUNaLFVBQVUsZ0JBQUEsRUFDVixJQUFJLFVBQUEsRUFDSixZQUFZLGtCQUFBO1lBS1osSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDckIsT0FBTyxLQUFJLENBQUMsZ0JBQWdCLENBQUM7b0JBQzNCLElBQUksTUFBQTtvQkFDSixLQUFLLE9BQUE7b0JBQ0wsTUFBTSxRQUFBO29CQUNOLFlBQVksY0FBQTtvQkFDWixVQUFVLFlBQUE7aUJBQ1gsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxJQUFNLFVBQVUsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV0RCxJQUFJLFNBQWlCLENBQUM7WUFFdEIsSUFBTSxRQUFRLEdBQUcsVUFDZixPQUFnQixFQUNoQixLQUFpRDtnQkFFakQsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtvQkFDbkIsT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBZTs0QkFBYixJQUFJLFVBQUEsRUFBRSxLQUFLLFdBQUE7d0JBQ3JCLElBQUksSUFBSSxLQUFLLElBQUk7NEJBQUUsT0FBTyxTQUFTLENBQUM7d0JBQ3BDLElBQU0sQ0FBQyxHQUNMLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNOzRCQUN0RCxZQUFZLENBQUM7d0JBQ2YsSUFBTSxDQUFDLEdBQ0wsQ0FBQyxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDOzRCQUM3RCxVQUFVLENBQUM7d0JBQ2IsU0FBUyxHQUFNLENBQUMsU0FBSSxDQUFHLENBQUM7d0JBQ3hCLE9BQVUsQ0FBQyxTQUFJLENBQUcsQ0FBQztvQkFDckIsQ0FBQyxDQUFDO2dCQVZGLENBVUUsQ0FDSCxDQUFDO1lBQ0osQ0FBQyxDQUFDO1lBRUYsSUFBTSxPQUFPLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsSUFBSSxFQUFFLENBQUM7WUFDckQsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUM7WUFFakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLO2dCQUMxQixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFFbkMsSUFBSSxLQUFLLEdBQWUsRUFBRSxDQUFDO2dCQUUzQixJQUFNLFFBQVEsR0FDWixDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDO2dCQUM5RCxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUM7Z0JBQ3BFLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRTtvQkFDekIsSUFBSSxZQUFZLEdBQXNDLEVBQUUsQ0FBQztvQkFDekQsSUFBSSxJQUFJLEdBQXdDLEVBQUUsQ0FBQztvQkFFbkQsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSzt3QkFDM0IsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLElBQUksS0FBSyxFQUFWLENBQVUsQ0FBQyxFQUFFOzRCQUNuRCxJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQ0FDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQ0FDeEIsWUFBWSxHQUFHLEVBQUUsQ0FBQzs2QkFDbkI7eUJBQ0Y7NkJBQU07NEJBQ0wsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQzt5QkFDcEM7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUM7d0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFckQsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ2pDO3FCQUFNO29CQUNMLElBQU0sTUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSyxJQUFLLE9BQUEsQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQUksQ0FBQyxDQUFDO2lCQUNqQztnQkFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtvQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FDVCxDQUFDLFFBQVEsQ0FDUCxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDWCxjQUFjLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDN0IsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUN6QixJQUFJLENBQUMsTUFBTSxDQUNYLE1BQU0sQ0FBQyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQ3BDLFdBQVcsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FDMUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUN6QyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUMzQyxDQUNILENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsQ0FBQztRQUVGLHlCQUFtQixHQUFHLFVBQ3BCLE9BQWdCLEVBQ2hCLEVBU0M7Z0JBUkMsS0FBSyxXQUFBLEVBQ0wsTUFBTSxZQUFBLEVBQ04sWUFBWSxrQkFBQSxFQUNaLFVBQVUsZ0JBQUEsRUFDVixJQUFJLFVBQUE7WUFNTixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDN0IsT0FBTyxNQUFNLENBQUM7YUFDZjtZQUVELElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEMsSUFBTSxDQUFDLEdBQUcsVUFBQyxDQUFTO2dCQUNsQixPQUFBLElBQUksQ0FBQyxLQUFLLENBQ1IsWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ2xFO1lBRkQsQ0FFQyxDQUFDO1lBRUosSUFBTSxVQUFVLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFdEQsSUFBTSxDQUFDLEdBQUcsVUFBQyxDQUFTO2dCQUNsQixJQUFNLE9BQU8sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUVoRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFDO1lBRUYsT0FBTyxDQUFDLE1BQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFJLENBQUMsQ0FBQyxDQUFDLENBQUcsQ0FBQztpQkFDeEIsTUFBTSxDQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNqQyxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLElBQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLE9BQU8sQ0FDTCxPQUFLLEtBQUssVUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQUssS0FBSyxVQUFLLEtBQU87cUJBQ3pDLFFBQU0sS0FBSyxVQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRyxDQUFBLENBQ3JELENBQUM7WUFDSixDQUFDLENBQUMsQ0FDSDtpQkFDQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZixDQUFDLENBQUM7UUFFRixzQkFBZ0IsR0FBRyxVQUFDLEVBU25CO2dCQVJDLElBQUksVUFBQSxFQUNKLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFlBQVksa0JBQUEsRUFDWixVQUFVLGdCQUFBO1lBS1YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7Z0JBQzdCLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7b0JBQy9DLEtBQUssT0FBQTtvQkFDTCxNQUFNLFFBQUE7b0JBQ04sWUFBWSxjQUFBO29CQUNaLFVBQVUsWUFBQTtvQkFDVixJQUFJLE1BQUE7aUJBQ0wsQ0FBQyxDQUFDO2dCQUVILE9BQU8sQ0FDTCxDQUFDLElBQUksQ0FDSCxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDWCxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDVixJQUFJLENBQUMsTUFBTSxDQUNYLE1BQU0sQ0FBQyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQ3BDLFdBQVcsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FDMUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUN6QyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUMzQyxDQUNILENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLHdCQUFrQixHQUFHLFVBQUMsRUFZckI7Z0JBWEMsS0FBSyxXQUFBLEVBQ0wsTUFBTSxZQUFBLEVBQ04sWUFBWSxrQkFBQSxFQUNaLFVBQVUsZ0JBQUEsRUFDVixJQUFJLFVBQUEsRUFDSixtQkFBbUIseUJBQUE7WUFPbkIsT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7Z0JBQ3RCLElBQU0sQ0FBQyxHQUNMLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7b0JBQ2hDLEtBQUssT0FBQTtvQkFDTCxNQUFNLFFBQUE7b0JBQ04sWUFBWSxjQUFBO29CQUNaLFVBQVUsWUFBQTtvQkFDVixJQUFJLE1BQUE7aUJBQ0wsQ0FBQztxQkFDRixRQUFLLFlBQVk7d0JBQ2YsQ0FBQyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFDNUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsV0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUMvQyxVQUFVLFdBQUssWUFBWSxVQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLFFBQUksQ0FBQSxDQUFDO2dCQUVyRSxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQ0gsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ1gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ0wsSUFBSSxDQUFDLENBQUMsNkJBQ0osbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE1BQUksS0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQ3JDLENBQUMsQ0FDSixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDZixDQUNILENBQUM7WUFDSixDQUFDLENBQUM7UUF4QkYsQ0F3QkUsQ0FBQztRQUVMLGtCQUFZLEdBQUcsVUFBQyxLQUFLLEVBQUUsWUFBWTtZQUMzQixJQUFBLEtBQXVCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFwQyxNQUFNLFlBQUEsRUFBRSxRQUFRLGNBQW9CLENBQUM7WUFDN0MsSUFBTSxlQUFlLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUVwRCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxVQUFVLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FDbkMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQ3BCO1FBQUEsQ0FBQyxVQUFVLENBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1QsU0FBUyxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FDM0MsZUFBZSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQ2pDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUN2QixVQUFVLENBQUMsY0FBTSxLQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRyxDQUM1QyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFFL0I7TUFBQSxFQUFFLENBQUMsQ0FBQyxDQUNMLEVBWG9DLENBV3BDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQzs7SUErTUosQ0FBQztJQTdNQywwQkFBTSxHQUFOO1FBQ1EsSUFBQSxLQXdCRixJQUFJLENBQUMsS0FBSyxFQXZCWixLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixJQUFJLFVBQUEsRUFDSix5QkFBeUIsRUFBekIsaUJBQWlCLG1CQUFHLEtBQUssS0FBQSxFQUN6QixrQkFBaUIsRUFBakIsVUFBVSxtQkFBRyxJQUFJLEtBQUEsRUFDakIsZ0JBQWUsRUFBZixRQUFRLG1CQUFHLElBQUksS0FBQSxFQUNmLHNCQUFxQixFQUFyQixjQUFjLG1CQUFHLElBQUksS0FBQSxFQUNyQixzQkFBcUIsRUFBckIsY0FBYyxtQkFBRyxJQUFJLEtBQUEsRUFDckIsMkJBQTBCLEVBQTFCLG1CQUFtQixtQkFBRyxJQUFJLEtBQUEsRUFDMUIseUJBQXdCLEVBQXhCLGlCQUFpQixtQkFBRyxJQUFJLEtBQUEsRUFDeEIsNEJBQTJCLEVBQTNCLG9CQUFvQixtQkFBRyxJQUFJLEtBQUEsRUFDM0IsMEJBQXlCLEVBQXpCLGtCQUFrQixtQkFBRyxJQUFJLEtBQUEsRUFDekIsYUFBVSxFQUFWLEtBQUssbUJBQUcsRUFBRSxLQUFBLEVBQ1YsU0FBUyxlQUFBLEVBQ1QsZ0JBQWdCLHNCQUFBLEVBQ2hCLDZCQUF5QixFQUF6QixxQkFBcUIsbUJBQUcsQ0FBQyxLQUFBLEVBQ3pCLCtCQUEyQixFQUEzQix1QkFBdUIsbUJBQUcsQ0FBQyxLQUFBLEVBQzNCLG9CQUErQixFQUEvQixZQUFZLG1CQUFHLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxFQUFOLENBQU0sS0FBQSxFQUMvQixvQkFBK0IsRUFBL0IsWUFBWSxtQkFBRyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sRUFBTixDQUFNLEtBQUEsRUFDL0IsUUFBUSxjQUFBLEVBQ1IsbUJBQW1CLEVBQW5CLFdBQVcsbUJBQUcsS0FBSyxLQUFBLEVBQ25CLFdBQVcsaUJBQUEsRUFDWCxxQkFBcUIsMkJBQ1QsQ0FBQztRQUVQLElBQUEsNkJBQTZCLEdBQUssSUFBSSxDQUFDLEtBQUssOEJBQWYsQ0FBZ0I7UUFDN0MsSUFBQSxLQUFnQixJQUFJLE9BQVQsRUFBWCxNQUFNLG1CQUFHLEVBQUUsS0FBQSxDQUFVO1FBRTNCLElBQUEsS0FNRSxLQUFLLGFBTlMsRUFBaEIsWUFBWSxtQkFBRyxDQUFDLEtBQUEsRUFDaEIsS0FLRSxLQUFLLFdBTFEsRUFBZixVQUFVLG1CQUFHLEVBQUUsS0FBQSxFQUNmLEtBSUUsS0FBSyxhQUpVLEVBQWpCLFlBQVksbUJBQUcsRUFBRSxLQUFBLEVBQ2pCLEtBR0UsS0FBSyxPQUhHLEVBQVYsTUFBTSxtQkFBRyxDQUFDLEtBQUEsRUFDVixLQUVFLEtBQUssWUFGUSxFQUFmLFdBQVcsbUJBQUcsQ0FBQyxLQUFBLEVBQ2YsS0FDRSxLQUFLLGNBRFUsRUFBakIsYUFBYSxtQkFBRyxDQUFDLEtBQUEsQ0FDVDtRQUVWLElBQU0sTUFBTSxHQUFHO1lBQ2IsS0FBSyxPQUFBO1lBQ0wsTUFBTSxRQUFBO1lBQ04scUJBQXFCLHVCQUFBO1lBQ3JCLHVCQUF1Qix5QkFBQTtZQUN2QixxQkFBcUIsdUJBQUE7U0FDdEIsQ0FBQztRQUVGLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTNDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLEtBQUssTUFBTSxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxRQUFRLEVBQUU7WUFDWixLQUFLLEdBQUcsUUFBUSxDQUFDO1NBQ2xCO1FBRUQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEUsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNqQjtRQUFBLENBQUMsR0FBRyxDQUNGLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBSSxhQUF3QixHQUFHLFlBQVksQ0FBQyxDQUMxRCxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUksTUFBaUIsR0FBRyxDQUFDLEdBQUksV0FBc0IsQ0FBQyxDQUVoRTtVQUFBLENBQUMsSUFBSSxDQUNILEtBQUssQ0FBQyxNQUFNLENBQ1osTUFBTSxDQUFDLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUM5QixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDakIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ2pCLElBQUksQ0FBQywwQkFBMEIsQ0FDL0IsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUVuQztVQUFBLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQy9DO1VBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDdkI7WUFBQSxDQUFDLElBQUksQ0FBQyxVQUFVLGdDQUNYLE1BQU0sR0FDTixXQUFXLEtBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQ25CLENBQ0Y7WUFBQSxDQUFDLENBQUMsQ0FDQTtjQUFBLENBQUMsbUJBQW1CO1lBQ2xCLENBQUMsY0FBYztnQkFDYixDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQix1QkFDckIsTUFBTSxLQUNULEtBQUssRUFBRSxLQUFLLEVBQ1osVUFBVSxZQUFBO29CQUNWLFlBQVksY0FBQSxJQUNaO2dCQUNKLENBQUMsQ0FBQyxjQUFjO29CQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQix1QkFDcEIsTUFBTSxLQUNULFVBQVUsWUFBQTt3QkFDVixZQUFZLGNBQUEsSUFDWjtvQkFDSixDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2I7WUFBQSxFQUFFLENBQUMsQ0FDSDtZQUFBLENBQUMsQ0FBQyxDQUNBO2NBQUEsQ0FBQyxvQkFBb0I7WUFDbkIsSUFBSSxDQUFDLHNCQUFzQix1QkFDdEIsTUFBTSxLQUNULEtBQUssRUFBRSxLQUFLLEVBQ1osSUFBSSxFQUFFLEtBQUssRUFDWCxVQUFVLEVBQUUsVUFBb0IsRUFDaEMsWUFBWSxFQUFFLFlBQXNCLEVBQ3BDLFlBQVksY0FBQSxFQUNaLGFBQWEsRUFBRSxXQUFXLENBQUMsYUFBYSxJQUN4QyxDQUNOO1lBQUEsRUFBRSxDQUFDLENBQ0g7WUFBQSxDQUFDLENBQUMsQ0FDQTtjQUFBLENBQUMsaUJBQWlCO1lBQ2hCLENBQUMsY0FBYztnQkFDYixDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQix1QkFDbkIsTUFBTSxLQUNULElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFDM0IsVUFBVSxFQUFFLFVBQW9CLEVBQ2hDLFlBQVksRUFBRSxZQUFzQixJQUNwQztnQkFDSixDQUFDLENBQUMsY0FBYztvQkFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsdUJBQ2xCLE1BQU0sS0FDVCxVQUFVLEVBQUUsVUFBb0IsRUFDaEMsWUFBWSxFQUFFLFlBQXNCLElBQ3BDO29CQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDYjtZQUFBLEVBQUUsQ0FBQyxDQUNIO1lBQUEsQ0FBQyxDQUFDLENBQ0E7Y0FBQSxDQUFDLGtCQUFrQjtZQUNqQixJQUFJLENBQUMsb0JBQW9CLHVCQUNwQixNQUFNLEtBQ1QsTUFBTSxRQUFBLEVBQ04sVUFBVSxFQUFFLFVBQW9CLEVBQ2hDLFlBQVksRUFBRSxZQUFzQixFQUNwQyxZQUFZLGNBQUEsSUFDWixDQUNOO1lBQUEsRUFBRSxDQUFDLENBQ0g7WUFBQSxDQUFDLENBQUMsQ0FDQTtjQUFBLENBQUMsSUFBSSxDQUFDLFVBQVUsZ0NBQ1gsTUFBTSxHQUNOLFdBQVcsS0FDZCxZQUFZLEVBQUUsWUFBc0IsRUFDcEMsVUFBVSxFQUFFLFVBQW9CLEVBQ2hDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxJQUNuQixDQUNKO1lBQUEsRUFBRSxDQUFDLENBQ0g7WUFBQSxDQUFDLENBQUMsQ0FDQTtjQUFBLENBQUMsVUFBVTtZQUNULElBQUksQ0FBQyxZQUFZLHVCQUNaLE1BQU0sS0FDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFDbkIsWUFBWSxFQUFFLFlBQXNCLEVBQ3BDLFVBQVUsRUFBRSxVQUFvQixFQUNoQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMseUJBQXlCLElBQzFELENBQ047WUFBQSxFQUFFLENBQUMsQ0FDSDtZQUFBLENBQUMsQ0FBQyxDQUNBO2NBQUEsQ0FBQyxRQUFRO1lBQ1AsSUFBSSxDQUFDLFVBQVUsdUJBQ1YsTUFBTSxLQUNULElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUNuQixVQUFVLEVBQUUsVUFBb0IsRUFDaEMsWUFBWSxFQUFFLFlBQXNCLEVBQ3BDLGdCQUFnQixrQkFBQSxJQUNoQixDQUNOO1lBQUEsRUFBRSxDQUFDLENBQ0g7WUFBQSxDQUFDLENBQUMsQ0FDQTtjQUFBLENBQUMsaUJBQWlCO1lBQ2hCLElBQUksQ0FBQyxtQkFBbUIsZ0NBQ25CLE1BQU0sR0FDTixXQUFXLEtBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQ25CLFVBQVUsRUFBRSxVQUFvQixFQUNoQyxZQUFZLEVBQUUsWUFBc0IsRUFDcEMsZ0JBQWdCLGtCQUFBO2dCQUNoQiw2QkFBNkIsK0JBQUEsSUFDN0IsQ0FDTjtZQUFBLEVBQUUsQ0FBQyxDQUNIO1lBQUEsQ0FBQyxDQUFDLENBQ0E7Y0FBQSxDQUFDLFNBQVM7WUFDUixTQUFTLHVCQUNKLE1BQU0sS0FDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFDbkIsVUFBVSxZQUFBO2dCQUNWLFlBQVksY0FBQSxJQUNaLENBQ047WUFBQSxFQUFFLENBQUMsQ0FDTDtVQUFBLEVBQUUsQ0FBQyxDQUNMO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLGlCQUFpQixJQUFJLENBQ3BCLENBQUMsVUFBVSxDQUNULEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FDL0IscUJBQXFCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FDNUMsOEJBQThCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDdEMsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDeEIsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUN2QjtnQkFDRSxXQUFXLEVBQUU7b0JBQ1gsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLDZCQUE2QixFQUFFO2lCQUNwRDthQUNGO1NBQ0YsQ0FBQyxDQUFDLENBQ0gsVUFBVSxDQUNWLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUNmLENBQ0gsQ0FDSDtNQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUF2M0JELENBQXdCLGFBQWEsR0F1M0JwQztBQUVELGVBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgQW5pbWF0ZWQsXG4gIFNjcm9sbFZpZXcsXG4gIFN0eWxlU2hlZXQsXG4gIFRleHRJbnB1dCxcbiAgVmlldyxcbiAgVmlld1N0eWxlXG59IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7XG4gIENpcmNsZSxcbiAgRyxcbiAgUGF0aCxcbiAgUG9seWdvbixcbiAgUG9seWxpbmUsXG4gIFJlY3QsXG4gIFN2Z1xufSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgQWJzdHJhY3RDaGFydCwge1xuICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICBBYnN0cmFjdENoYXJ0UHJvcHNcbn0gZnJvbSBcIi4uL0Fic3RyYWN0Q2hhcnRcIjtcbmltcG9ydCB7IENoYXJ0RGF0YSwgRGF0YXNldCB9IGZyb20gXCIuLi9IZWxwZXJUeXBlc1wiO1xuaW1wb3J0IHsgTGVnZW5kSXRlbSB9IGZyb20gXCIuL0xlZ2VuZEl0ZW1cIjtcblxubGV0IEFuaW1hdGVkQ2lyY2xlID0gQW5pbWF0ZWQuY3JlYXRlQW5pbWF0ZWRDb21wb25lbnQoQ2lyY2xlKTtcblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQ2hhcnREYXRhIGV4dGVuZHMgQ2hhcnREYXRhIHtcbiAgbGVnZW5kPzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZVBvaW50IHtcbiAgeDogbnVtYmVyLFxuICB5OiBudW1iZXIsXG4gIGluZGV4OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIC8qKlxuICAgKiBEYXRhIGZvciB0aGUgY2hhcnQuXG4gICAqXG4gICAqIEV4YW1wbGUgZnJvbSBbZG9jc10oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQjbGluZS1jaGFydCk6XG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3QgZGF0YSA9IHtcbiAgICogICBsYWJlbHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZSddLFxuICAgKiAgIGRhdGFzZXRzOiBbe1xuICAgKiAgICAgZGF0YTogWyAyMCwgNDUsIDI4LCA4MCwgOTksIDQzIF0sXG4gICAqICAgICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgxMzQsIDY1LCAyNDQsICR7b3BhY2l0eX0pYCwgLy8gb3B0aW9uYWxcbiAgICogICAgIHN0cm9rZVdpZHRoOiAyIC8vIG9wdGlvbmFsXG4gICAqICAgfV0sXG4gICAqICAgbGVnZW5kOiBbXCJSYWlueSBEYXlzXCIsIFwiU3VubnkgRGF5c1wiLCBcIlNub3d5IERheXNcIl0gLy8gb3B0aW9uYWxcbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIGRhdGE6IExpbmVDaGFydERhdGE7XG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgY2hhcnQsIHVzZSAnRGltZW5zaW9ucycgbGlicmFyeSB0byBnZXQgdGhlIHdpZHRoIG9mIHlvdXIgc2NyZWVuIGZvciByZXNwb25zaXZlLlxuICAgKi9cbiAgd2lkdGg6IG51bWJlcjtcbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgY2hhcnQuXG4gICAqL1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgLyoqXG4gICAqIFNob3cgZG90cyBvbiB0aGUgbGluZSAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoRG90cz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHNoYWRvdyBmb3IgbGluZSAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoU2hhZG93PzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaW5uZXIgZGFzaGVkIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG5cbiAgd2l0aFNjcm9sbGFibGVEb3Q/OiBib29sZWFuO1xuICB3aXRoSW5uZXJMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IG91dGVyIGRhc2hlZCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoT3V0ZXJMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHZlcnRpY2FsIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhWZXJ0aWNhbExpbmVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaG9yaXpvbnRhbCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoSG9yaXpvbnRhbExpbmVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqXG4gICAqL1xuICB2ZXJ0aWNhbExpbmVzSW50ZXJ2YWw/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBTaG93IHZlcnRpY2FsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoVmVydGljYWxMYWJlbHM/OiBib29sZWFuO1xuICAvKipcbiAgICogU2hvdyBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoSG9yaXpvbnRhbExhYmVscz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBSZW5kZXIgY2hhcnRzIGZyb20gMCBub3QgZnJvbSB0aGUgbWluaW11bSB2YWx1ZS4gLSBkZWZhdWx0OiBGYWxzZS5cbiAgICovXG4gIGZyb21aZXJvPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFByZXBlbmQgdGV4dCB0byBob3Jpem9udGFsIGxhYmVscyAtLSBkZWZhdWx0OiAnJy5cbiAgICovXG4gIHlBeGlzTGFiZWw/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBcHBlbmQgdGV4dCB0byBob3Jpem9udGFsIGxhYmVscyAtLSBkZWZhdWx0OiAnJy5cbiAgICovXG4gIHlBeGlzU3VmZml4Pzogc3RyaW5nO1xuICAvKipcbiAgICogUHJlcGVuZCB0ZXh0IHRvIHZlcnRpY2FsIGxhYmVscyAtLSBkZWZhdWx0OiAnJy5cbiAgICovXG4gIHhBeGlzTGFiZWw/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlIGNoYXJ0LCBzZWUgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBjb25zdCBjaGFydENvbmZpZyA9IHtcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRGcm9tOiBcIiMxRTI5MjNcIixcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eTogMCxcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRUbzogXCIjMDgxMzBEXCIsXG4gICAqICAgYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5OiAwLjUsXG4gICAqICAgY29sb3I6IChvcGFjaXR5ID0gMSkgPT4gYHJnYmEoMjYsIDI1NSwgMTQ2LCAke29wYWNpdHl9KWAsXG4gICAqICAgbGFiZWxDb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgyNiwgMjU1LCAxNDYsICR7b3BhY2l0eX0pYCxcbiAgICogICBzdHJva2VXaWR0aDogMiwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgM1xuICAgKiAgIGJhclBlcmNlbnRhZ2U6IDAuNVxuICAgKiB9O1xuICAgKiBgYGBcbiAgICovXG4gIGNoYXJ0Q29uZmlnPzogQWJzdHJhY3RDaGFydENvbmZpZztcblxuICAvKipcbiAgICogRGl2aWRlIGF4aXMgcXVhbnRpdHkgYnkgdGhlIGlucHV0IG51bWJlciAtLSBkZWZhdWx0OiAxLlxuICAgKi9cbiAgeUF4aXNJbnRlcnZhbD86IG51bWJlcjtcblxuICAvKipcbiAgICogRGVmaW5lcyBpZiBjaGFydCBpcyB0cmFuc3BhcmVudFxuICAgKi9cbiAgdHJhbnNwYXJlbnQ/OiBib29sZWFuO1xuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiB0YWtlcyBhIFt3aG9sZSBidW5jaF0oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQvYmxvYi9tYXN0ZXIvc3JjL2xpbmUtY2hhcnQuanMjTDI2NilcbiAgICogb2Ygc3R1ZmYgYW5kIGNhbiByZW5kZXIgZXh0cmEgZWxlbWVudHMsXG4gICAqIHN1Y2ggYXMgZGF0YSBwb2ludCBpbmZvIG9yIGFkZGl0aW9uYWwgbWFya3VwLlxuICAgKi9cbiAgZGVjb3JhdG9yPzogRnVuY3Rpb247XG4gIC8qKlxuICAgKiBDYWxsYmFjayB0aGF0IGlzIGNhbGxlZCB3aGVuIGEgZGF0YSBwb2ludCBpcyBjbGlja2VkLlxuICAgKi9cbiAgb25EYXRhUG9pbnRDbGljaz86IChkYXRhOiB7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICB2YWx1ZTogbnVtYmVyO1xuICAgIGRhdGFzZXQ6IERhdGFzZXQ7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBnZXRDb2xvcjogKG9wYWNpdHk6IG51bWJlcikgPT4gc3RyaW5nO1xuICB9KSA9PiB2b2lkO1xuICAvKipcbiAgICogU3R5bGUgb2YgdGhlIGNvbnRhaW5lciB2aWV3IG9mIHRoZSBjaGFydC5cbiAgICovXG4gIHN0eWxlPzogUGFydGlhbDxWaWV3U3R5bGU+O1xuICAvKipcbiAgICogQWRkIHRoaXMgcHJvcCB0byBtYWtlIHRoZSBsaW5lIGNoYXJ0IHNtb290aCBhbmQgY3VydnkuXG4gICAqXG4gICAqIFtFeGFtcGxlXShodHRwczovL2dpdGh1Yi5jb20vaW5kaWVzcGlyaXQvcmVhY3QtbmF0aXZlLWNoYXJ0LWtpdCNiZXppZXItbGluZS1jaGFydClcbiAgICovXG4gIGJlemllcj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTa2lwcGVkIHBvaW50cyA6IG9wdGlvbmFsIGFycmF5IHdoZXJlIGl0cyBsZW5ndGggbmVlZHMgdG8gbWF0Y2ggdGhlIGRhdGEubGVuZ3RoXG4gICAqXG4gICAqIFRoZSByZW5kZXJlZCBsaW5lIHdpbGwgYmUgc2VnbWVudGVkIGFjcm9zcyB0aGUgdmFyaW91cyBcInNraXBwZWRcIiBwb2ludHMgb2YgdGhlIGRhdGEgc2V0XG4gICAqXG4gICAqIChub3RlIHRoYXQgdGhlIGRhdGEgbmVlZHMgdG8gYmUgY29uc2lzdGFudCwgdmFsdWVzIHNraXBwZWQgc2hvdWxkIGJlIHNvbWV0aGluZyBsaWtlIDApXG4gICAqL1xuICBkYXRhU2tpcHBlZFNlZ21lbnRzPzogYm9vbGVhbltdO1xuICAvKipcbiAgICogRGVmaW5lcyB0aGUgZG90IGNvbG9yIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBjYWxjdWxhdGUgY29sb3JzIG9mIGRvdHMgaW4gYSBsaW5lIGNoYXJ0LlxuICAgKiBUYWtlcyBgKGRhdGFQb2ludCwgZGF0YVBvaW50SW5kZXgpYCBhcyBhcmd1bWVudHMuXG4gICAqL1xuICBnZXREb3RDb2xvcj86IChkYXRhUG9pbnQ6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gc3RyaW5nO1xuICAvKipcbiAgICogUmVuZGVycyBhZGRpdGlvbmFsIGNvbnRlbnQgZm9yIGRvdHMgaW4gYSBsaW5lIGNoYXJ0LlxuICAgKiBUYWtlcyBgKHt4LCB5LCBpbmRleH0pYCBhcyBhcmd1bWVudHMuXG4gICAqL1xuICByZW5kZXJEb3RDb250ZW50PzogKHBhcmFtczoge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBpbmRleERhdGE6IG51bWJlcjtcbiAgfSkgPT4gUmVhY3QuUmVhY3ROb2RlO1xuICAvKipcbiAgICogUm90YXRpb24gYW5nbGUgb2YgdGhlIGhvcml6b250YWwgbGFiZWxzIC0gZGVmYXVsdCAwIChkZWdyZWVzKS5cbiAgICovXG4gIGhvcml6b250YWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICAvKipcbiAgICogUm90YXRpb24gYW5nbGUgb2YgdGhlIHZlcnRpY2FsIGxhYmVscyAtIGRlZmF1bHQgMCAoZGVncmVlcykuXG4gICAqL1xuICB2ZXJ0aWNhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBPZmZzZXQgZm9yIFkgYXhpcyBsYWJlbHMuXG4gICAqL1xuICB5TGFiZWxzT2Zmc2V0PzogbnVtYmVyO1xuICAvKipcbiAgICogT2Zmc2V0IGZvciBYIGF4aXMgbGFiZWxzLlxuICAgKi9cbiAgeExhYmVsc09mZnNldD86IG51bWJlcjtcbiAgLyoqXG4gICAqIEFycmF5IG9mIGluZGljZXMgb2YgdGhlIGRhdGEgcG9pbnRzIHlvdSBkb24ndCB3YW50IHRvIGRpc3BsYXkuXG4gICAqL1xuICBoaWRlUG9pbnRzQXRJbmRleD86IG51bWJlcltdO1xuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBjaGFuZ2UgdGhlIGZvcm1hdCBvZiB0aGUgZGlzcGxheSB2YWx1ZSBvZiB0aGUgWSBsYWJlbC5cbiAgICogVGFrZXMgdGhlIHkgdmFsdWUgYXMgYXJndW1lbnQgYW5kIHNob3VsZCByZXR1cm4gdGhlIGRlc2lyYWJsZSBzdHJpbmcuXG4gICAqL1xuICBmb3JtYXRZTGFiZWw/OiAoeVZhbHVlOiBzdHJpbmcpID0+IHN0cmluZztcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gY2hhbmdlIHRoZSBmb3JtYXQgb2YgdGhlIGRpc3BsYXkgdmFsdWUgb2YgdGhlIFggbGFiZWwuXG4gICAqIFRha2VzIHRoZSBYIHZhbHVlIGFzIGFyZ3VtZW50IGFuZCBzaG91bGQgcmV0dXJuIHRoZSBkZXNpcmFibGUgc3RyaW5nLlxuICAgKi9cbiAgZm9ybWF0WExhYmVsPzogKHhWYWx1ZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIC8qKlxuICAgKiBQcm92aWRlIHByb3BzIGZvciBhIGRhdGEgcG9pbnQgZG90LlxuICAgKi9cbiAgZ2V0RG90UHJvcHM/OiAoZGF0YVBvaW50OiBhbnksIGluZGV4OiBudW1iZXIpID0+IG9iamVjdDtcbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgaG9yaXpvbnRhbCBsaW5lc1xuICAgKi9cbiAgc2VnbWVudHM/OiBudW1iZXI7XG59XG5cbnR5cGUgTGluZUNoYXJ0U3RhdGUgPSB7XG4gIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0OiBBbmltYXRlZC5WYWx1ZTtcbn07XG5cbmNsYXNzIExpbmVDaGFydCBleHRlbmRzIEFic3RyYWN0Q2hhcnQ8TGluZUNoYXJ0UHJvcHMsIExpbmVDaGFydFN0YXRlPiB7XG4gIGxhYmVsID0gUmVhY3QuY3JlYXRlUmVmPFRleHRJbnB1dD4oKTtcblxuICBzdGF0ZSA9IHtcbiAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldDogbmV3IEFuaW1hdGVkLlZhbHVlKDApXG4gIH07XG5cbiAgZ2V0Q29sb3IgPSAoZGF0YXNldDogRGF0YXNldCwgb3BhY2l0eTogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIChkYXRhc2V0LmNvbG9yIHx8IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IpKG9wYWNpdHkpO1xuICB9O1xuXG4gIGdldFN0cm9rZVdpZHRoID0gKGRhdGFzZXQ6IERhdGFzZXQpID0+IHtcbiAgICByZXR1cm4gZGF0YXNldC5zdHJva2VXaWR0aCB8fCB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLnN0cm9rZVdpZHRoIHx8IDM7XG4gIH07XG5cbiAgZ2V0RGF0YXMgPSAoZGF0YTogRGF0YXNldFtdKTogbnVtYmVyW10gPT4ge1xuICAgIHJldHVybiBkYXRhLnJlZHVjZShcbiAgICAgIChhY2MsIGl0ZW0pID0+IChpdGVtLmRhdGEgPyBbLi4uYWNjLCAuLi5pdGVtLmRhdGFdIDogYWNjKSxcbiAgICAgIFtdXG4gICAgKTtcbiAgfTtcblxuICBnZXRQcm9wc0ZvckRvdHMgPSAoeDogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCB7IGdldERvdFByb3BzLCBjaGFydENvbmZpZyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICh0eXBlb2YgZ2V0RG90UHJvcHMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIGdldERvdFByb3BzKHgsIGkpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgcHJvcHNGb3JEb3RzID0ge30gfSA9IGNoYXJ0Q29uZmlnO1xuXG4gICAgcmV0dXJuIHsgcjogXCI0XCIsIC4uLnByb3BzRm9yRG90cyB9O1xuICB9O1xuXG4gIHJlbmRlckRvdHMgPSAoe1xuICAgIGRhdGEsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIG9uRGF0YVBvaW50Q2xpY2tcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxuICA+ICYge1xuICAgIG9uRGF0YVBvaW50Q2xpY2s6IExpbmVDaGFydFByb3BzW1wib25EYXRhUG9pbnRDbGlja1wiXTtcbiAgfSkgPT4ge1xuICAgIGNvbnN0IG91dHB1dDogUmVhY3ROb2RlW10gPSBbXTtcbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XG5cbiAgICBjb25zdCB7XG4gICAgICBnZXREb3RDb2xvcixcbiAgICAgIGhpZGVQb2ludHNBdEluZGV4ID0gW10sXG4gICAgICByZW5kZXJEb3RDb250ZW50ID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGRhdGEuZm9yRWFjaChkYXRhc2V0ID0+IHtcbiAgICAgIGlmIChkYXRhc2V0LndpdGhEb3RzID09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIGRhdGFzZXQuZGF0YS5mb3JFYWNoKCh4LCBpKSA9PiB7XG4gICAgICAgIGlmIChoaWRlUG9pbnRzQXRJbmRleC5pbmNsdWRlcyhpKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN4ID1cbiAgICAgICAgICBwYWRkaW5nUmlnaHQgKyAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YXNldC5kYXRhLmxlbmd0aDtcblxuICAgICAgICBjb25zdCBjeSA9XG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KHgsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXG4gICAgICAgICAgcGFkZGluZ1RvcDtcblxuICAgICAgICBjb25zdCBvblByZXNzID0gKCkgPT4ge1xuICAgICAgICAgIGlmICghb25EYXRhUG9pbnRDbGljayB8fCBoaWRlUG9pbnRzQXRJbmRleC5pbmNsdWRlcyhpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9uRGF0YVBvaW50Q2xpY2soe1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICB2YWx1ZTogeCxcbiAgICAgICAgICAgIGRhdGFzZXQsXG4gICAgICAgICAgICB4OiBjeCxcbiAgICAgICAgICAgIHk6IGN5LFxuICAgICAgICAgICAgZ2V0Q29sb3I6IG9wYWNpdHkgPT4gdGhpcy5nZXRDb2xvcihkYXRhc2V0LCBvcGFjaXR5KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIG91dHB1dC5wdXNoKFxuICAgICAgICAgIDxDaXJjbGVcbiAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICAgIGN4PXtjeH1cbiAgICAgICAgICAgIGN5PXtjeX1cbiAgICAgICAgICAgIGZpbGw9e1xuICAgICAgICAgICAgICB0eXBlb2YgZ2V0RG90Q29sb3IgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgID8gZ2V0RG90Q29sb3IoeCwgaSlcbiAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC45KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25QcmVzcz17b25QcmVzc31cbiAgICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yRG90cyh4LCBpKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgICA8Q2lyY2xlXG4gICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICBjeD17Y3h9XG4gICAgICAgICAgICBjeT17Y3l9XG4gICAgICAgICAgICByPVwiMTRcIlxuICAgICAgICAgICAgZmlsbD1cIiNmZmZcIlxuICAgICAgICAgICAgZmlsbE9wYWNpdHk9ezB9XG4gICAgICAgICAgICBvblByZXNzPXtvblByZXNzfVxuICAgICAgICAgIC8+LFxuICAgICAgICAgIHJlbmRlckRvdENvbnRlbnQoeyB4OiBjeCwgeTogY3ksIGluZGV4OiBpLCBpbmRleERhdGE6IHggfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICByZW5kZXJTY3JvbGxhYmxlRG90ID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldCxcbiAgICBzY3JvbGxhYmxlRG90RmlsbCxcbiAgICBzY3JvbGxhYmxlRG90U3Ryb2tlQ29sb3IsXG4gICAgc2Nyb2xsYWJsZURvdFN0cm9rZVdpZHRoLFxuICAgIHNjcm9sbGFibGVEb3RSYWRpdXMsXG4gICAgc2Nyb2xsYWJsZUluZm9WaWV3U3R5bGUsXG4gICAgc2Nyb2xsYWJsZUluZm9UZXh0U3R5bGUsXG4gICAgc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yID0geCA9PiBgJHt4fWAsXG4gICAgc2Nyb2xsYWJsZUluZm9TaXplLFxuICAgIHNjcm9sbGFibGVJbmZvT2Zmc2V0XG4gIH06IEFic3RyYWN0Q2hhcnRDb25maWcgJiB7XG4gICAgb25EYXRhUG9pbnRDbGljazogTGluZUNoYXJ0UHJvcHNbXCJvbkRhdGFQb2ludENsaWNrXCJdO1xuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0OiBBbmltYXRlZC5WYWx1ZTtcbiAgfSkgPT4ge1xuICAgIGNvbnN0IG91dHB1dCA9IFtdO1xuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIGxldCB2bDogbnVtYmVyW10gPSBbXTtcblxuICAgIGNvbnN0IHBlckRhdGEgPSB3aWR0aCAvIGRhdGFbMF0uZGF0YS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGFbMF0uZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZsLnB1c2goaW5kZXggKiBwZXJEYXRhKTtcbiAgICB9XG4gICAgbGV0IGxhc3RJbmRleDogbnVtYmVyO1xuXG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuYWRkTGlzdGVuZXIodmFsdWUgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB2YWx1ZS52YWx1ZSAvIHBlckRhdGE7XG4gICAgICBpZiAoIWxhc3RJbmRleCkge1xuICAgICAgICBsYXN0SW5kZXggPSBpbmRleDtcbiAgICAgIH1cblxuICAgICAgbGV0IGFicyA9IE1hdGguZmxvb3IoaW5kZXgpO1xuICAgICAgbGV0IHBlcmNlbnQgPSBpbmRleCAtIGFicztcbiAgICAgIGFicyA9IGRhdGFbMF0uZGF0YS5sZW5ndGggLSBhYnMgLSAxO1xuXG4gICAgICBpZiAoaW5kZXggPj0gZGF0YVswXS5kYXRhLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoTWF0aC5mbG9vcihkYXRhWzBdLmRhdGFbMF0pKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpbmRleCA+IGxhc3RJbmRleCkge1xuICAgICAgICAgIC8vIHRvIHJpZ2h0XG5cbiAgICAgICAgICBjb25zdCBiYXNlID0gZGF0YVswXS5kYXRhW2Fic107XG4gICAgICAgICAgY29uc3QgcHJldiA9IGRhdGFbMF0uZGF0YVthYnMgLSAxXTtcbiAgICAgICAgICBpZiAocHJldiA+IGJhc2UpIHtcbiAgICAgICAgICAgIGxldCByZXN0ID0gcHJldiAtIGJhc2U7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlICsgcGVyY2VudCAqIHJlc3QpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzdCA9IGJhc2UgLSBwcmV2O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSAtIHBlcmNlbnQgKiByZXN0KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gdG8gbGVmdFxuXG4gICAgICAgICAgY29uc3QgYmFzZSA9IGRhdGFbMF0uZGF0YVthYnMgLSAxXTtcbiAgICAgICAgICBjb25zdCBuZXh0ID0gZGF0YVswXS5kYXRhW2Fic107XG4gICAgICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xuICAgICAgICAgIGlmIChuZXh0ID4gYmFzZSkge1xuICAgICAgICAgICAgbGV0IHJlc3QgPSBuZXh0IC0gYmFzZTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGJhc2UgKyBwZXJjZW50ICogcmVzdClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZXN0ID0gYmFzZSAtIG5leHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlIC0gcGVyY2VudCAqIHJlc3QpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGFzdEluZGV4ID0gaW5kZXg7XG4gICAgfSk7XG5cbiAgICBkYXRhLmZvckVhY2goZGF0YXNldCA9PiB7XG4gICAgICBpZiAoZGF0YXNldC53aXRoU2Nyb2xsYWJsZURvdCA9PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBwZXJEYXRhID0gd2lkdGggLyBkYXRhc2V0LmRhdGEubGVuZ3RoO1xuICAgICAgbGV0IHZhbHVlcyA9IFtdO1xuICAgICAgbGV0IHlWYWx1ZXMgPSBbXTtcbiAgICAgIGxldCB4VmFsdWVzID0gW107XG5cbiAgICAgIGxldCB5VmFsdWVzTGFiZWwgPSBbXTtcbiAgICAgIGxldCB4VmFsdWVzTGFiZWwgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGFzZXQuZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFsdWVzLnB1c2goaW5kZXggKiBwZXJEYXRhKTtcbiAgICAgICAgY29uc3QgeXZhbCA9XG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC1cbiAgICAgICAgICAgIHRoaXMuY2FsY0hlaWdodChcbiAgICAgICAgICAgICAgZGF0YXNldC5kYXRhW2RhdGFzZXQuZGF0YS5sZW5ndGggLSBpbmRleCAtIDFdLFxuICAgICAgICAgICAgICBkYXRhcyxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICApKSAvXG4gICAgICAgICAgICA0KSAqXG4gICAgICAgICAgICAzICtcbiAgICAgICAgICBwYWRkaW5nVG9wO1xuICAgICAgICB5VmFsdWVzLnB1c2goeXZhbCk7XG4gICAgICAgIGNvbnN0IHh2YWwgPVxuICAgICAgICAgIHBhZGRpbmdSaWdodCArXG4gICAgICAgICAgKChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gaW5kZXggLSAxKSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC9cbiAgICAgICAgICAgIGRhdGFzZXQuZGF0YS5sZW5ndGg7XG4gICAgICAgIHhWYWx1ZXMucHVzaCh4dmFsKTtcblxuICAgICAgICB5VmFsdWVzTGFiZWwucHVzaChcbiAgICAgICAgICB5dmFsIC0gKHNjcm9sbGFibGVJbmZvU2l6ZS5oZWlnaHQgKyBzY3JvbGxhYmxlSW5mb09mZnNldClcbiAgICAgICAgKTtcbiAgICAgICAgeFZhbHVlc0xhYmVsLnB1c2goeHZhbCAtIHNjcm9sbGFibGVJbmZvU2l6ZS53aWR0aCAvIDIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0cmFuc2xhdGVYID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xuICAgICAgICBpbnB1dFJhbmdlOiB2YWx1ZXMsXG4gICAgICAgIG91dHB1dFJhbmdlOiB4VmFsdWVzLFxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdHJhbnNsYXRlWSA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxuICAgICAgICBvdXRwdXRSYW5nZTogeVZhbHVlcyxcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGxhYmVsVHJhbnNsYXRlWCA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxuICAgICAgICBvdXRwdXRSYW5nZTogeFZhbHVlc0xhYmVsLFxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbGFiZWxUcmFuc2xhdGVZID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xuICAgICAgICBpbnB1dFJhbmdlOiB2YWx1ZXMsXG4gICAgICAgIG91dHB1dFJhbmdlOiB5VmFsdWVzTGFiZWwsXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcbiAgICAgIH0pO1xuXG4gICAgICBvdXRwdXQucHVzaChbXG4gICAgICAgIDxBbmltYXRlZC5WaWV3XG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHN0eWxlPXtbXG4gICAgICAgICAgICBzY3JvbGxhYmxlSW5mb1ZpZXdTdHlsZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXG4gICAgICAgICAgICAgICAgeyB0cmFuc2xhdGVYOiBsYWJlbFRyYW5zbGF0ZVggfSxcbiAgICAgICAgICAgICAgICB7IHRyYW5zbGF0ZVk6IGxhYmVsVHJhbnNsYXRlWSB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHdpZHRoOiBzY3JvbGxhYmxlSW5mb1NpemUud2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodDogc2Nyb2xsYWJsZUluZm9TaXplLmhlaWdodFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF19XG4gICAgICAgID5cbiAgICAgICAgICA8VGV4dElucHV0XG4gICAgICAgICAgICBvbkxheW91dD17KCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcbiAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoZGF0YVswXS5kYXRhW2RhdGFbMF0uZGF0YS5sZW5ndGggLSAxXSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHN0eWxlPXtzY3JvbGxhYmxlSW5mb1RleHRTdHlsZX1cbiAgICAgICAgICAgIHJlZj17dGhpcy5sYWJlbH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0FuaW1hdGVkLlZpZXc+LFxuICAgICAgICA8QW5pbWF0ZWRDaXJjbGVcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgY3g9e3RyYW5zbGF0ZVh9XG4gICAgICAgICAgY3k9e3RyYW5zbGF0ZVl9XG4gICAgICAgICAgcj17c2Nyb2xsYWJsZURvdFJhZGl1c31cbiAgICAgICAgICBzdHJva2U9e3Njcm9sbGFibGVEb3RTdHJva2VDb2xvcn1cbiAgICAgICAgICBzdHJva2VXaWR0aD17c2Nyb2xsYWJsZURvdFN0cm9rZVdpZHRofVxuICAgICAgICAgIGZpbGw9e3Njcm9sbGFibGVEb3RGaWxsfVxuICAgICAgICAvPlxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIHJlbmRlclNoYWRvdyA9ICh7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIGRhdGEsXG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldFxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4gJiB7XG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldDogQWJzdHJhY3RDaGFydENvbmZpZ1tcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIl07XG4gIH0pID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5iZXppZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckJlemllclNoYWRvdyh7XG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgdG9Qb2ludCA9IChkYXRhLCBsZW5ndGgsIGluZGV4KTogTGluZVBvaW50ID0+IHtcbiAgICAgIGNvbnN0IHggPVxuICAgICAgICAoaW5kZXggKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGxlbmd0aCArXG4gICAgICAgIHBhZGRpbmdSaWdodDtcbiAgICAgIGNvbnN0IHkgPVxuICAgICAgICAoKGJhc2VIZWlnaHQgLSB0aGlzLmNhbGNIZWlnaHQoZGF0YSwgZGF0YXMsIGhlaWdodCkpIC8gNCkgKiAzICtcbiAgICAgICAgcGFkZGluZ1RvcDtcbiAgICAgIHJldHVybiB7IHgsIHksIGluZGV4IH07XG4gICAgfVxuXG4gICAgY29uc3QgdG9Qb2ludHMgPSAoXG4gICAgICBkYXRhc2V0OiBEYXRhc2V0LFxuICAgICAgbGluZXM6IHsgZGF0YTogbnVtYmVyIHwgbnVsbDsgaW5kZXg6IG51bWJlciB9W11bXVxuICAgICk6IHtwb2ludHM6IExpbmVQb2ludFtdLCBsZWZ0PzogTGluZVBvaW50LCByaWdodD86IExpbmVQb2ludH1bXSA9PiB7XG4gICAgICByZXR1cm4gbGluZXMubWFwKGxpbmUgPT4ge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBkYXRhc2V0LmRhdGEubGVuZ3RoO1xuICAgICAgICBjb25zdCBwb2ludHMgPSBsaW5lLm1hcCgoeyBkYXRhLCBpbmRleCB9KSA9PiB0b1BvaW50KGRhdGEsIGxlbmd0aCwgaW5kZXgpKTtcbiAgICAgICAgY29uc3QgZXh0cmVtTGVmdCA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmVbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGV4dHJlbVJpZ2h0ID0gbGluZS5sZW5ndGggPiAwID8gbGluZVtsaW5lLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vd2UgZXh0cmFjdCB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSBmb3IgMFxuICAgICAgICAvL3RoaXMgaXMgaW50ZXJlc3RpbmcgaW4gY2FzZSAwIGlzIGJldHdlZW4gbWF4IGFuZCBtaW4gb3IgdG9wIG9yIGJvdHRvbVxuICAgICAgICAvL3dlIHRoZW4gaGF2ZSBhIGNsZWFyIHJpZ2h0IC0+IGxlZnQgYmFjayBjbG9zaW5nIHZhbHVlXG4gICAgICAgIC8vVE9ETyBzaW5jZSB0aGUgMCB2YWx1ZSBpcyBhdCBtb3N0IGF0IHtsZWZ0fSBhbmQge3JpZ2h0fSBmcm9tIHRoaXMgc3Vic2V0LCB3ZSBjYW4gYWRkIGl0IHRvIHRoZSBsaW5lIGl0c2VsZlxuICAgICAgICBjb25zdCBsZWZ0ID0gZXh0cmVtTGVmdCA/IHRvUG9pbnQoMCwgbGVuZ3RoLCBleHRyZW1MZWZ0LmluZGV4KSA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgcmlnaHQgPSBleHRyZW1SaWdodCA/IHRvUG9pbnQoMCwgbGVuZ3RoLCBleHRyZW1SaWdodC5pbmRleCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB7IHBvaW50cywgbGVmdCwgcmlnaHQgfTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3Qgc2tpcHBlZCA9IHRoaXMucHJvcHMuZGF0YVNraXBwZWRTZWdtZW50cyB8fCBbXTtcbiAgICBjb25zdCBhdm9pZCA9IHRoaXMucHJvcHMuaGlkZVBvaW50c0F0SW5kZXggfHwgW107XG4gICAgY29uc3Qgb3V0cHV0ID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goKGRhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBsZW5ndGggPSBkYXRhc2V0LmRhdGEubGVuZ3RoO1xuXG4gICAgICB2YXIgbGluZXM6IHsgcG9pbnRzOiBMaW5lUG9pbnRbXTsgbGVmdD86IExpbmVQb2ludCwgcmlnaHQ/OiBMaW5lUG9pbnQgfVtdID0gW107XG5cbiAgICAgIGNvbnN0IGNhbl9za2lwID1cbiAgICAgICAgISFza2lwcGVkICYmIHNraXBwZWQubGVuZ3RoID4gMCAmJiBza2lwcGVkLmxlbmd0aCA+PSBsZW5ndGg7XG4gICAgICBjb25zdCBjYW5fYXZvaWQgPSAhIWF2b2lkICYmIGF2b2lkLmxlbmd0aCAmJiBhdm9pZC5sZW5ndGggPD0gbGVuZ3RoO1xuICAgICAgaWYgKGNhbl9za2lwIHx8IGNhbl9hdm9pZCkge1xuICAgICAgICB2YXIgY3VycmVudF9saW5lOiB7IGRhdGE6IG51bWJlcjsgaW5kZXg6IG51bWJlciB9W10gPSBbXTtcbiAgICAgICAgdmFyIHRlbXA6IHsgZGF0YTogbnVtYmVyOyBpbmRleDogbnVtYmVyIH1bXVtdID0gW107XG5cbiAgICAgICAgZGF0YXNldC5kYXRhLm1hcCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoISFza2lwcGVkW2luZGV4XSB8fCBhdm9pZC5maW5kKGkgPT4gaSA9PSBpbmRleCkpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50X2xpbmUgJiYgY3VycmVudF9saW5lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdGVtcC5wdXNoKGN1cnJlbnRfbGluZSk7XG4gICAgICAgICAgICAgIGN1cnJlbnRfbGluZSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50X2xpbmUucHVzaCh7IGRhdGEsIGluZGV4IH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjdXJyZW50X2xpbmUubGVuZ3RoID4gMCkgdGVtcC5wdXNoKGN1cnJlbnRfbGluZSk7XG5cbiAgICAgICAgbGluZXMgPSB0b1BvaW50cyhkYXRhc2V0LCB0ZW1wKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRlbXAgPSBbZGF0YXNldC5kYXRhLm1hcCgoZGF0YSwgaW5kZXgpID0+ICh7IGRhdGEsIGluZGV4IH0pKV07XG4gICAgICAgIGxpbmVzID0gdG9Qb2ludHMoZGF0YXNldCwgdGVtcCk7XG4gICAgICB9XG5cbiAgICAgIGxpbmVzLmZvckVhY2goKHBvaW50cywgaW5kZXgpID0+IHtcbiAgICAgICAgLyp2YXIgeDE6IHN0cmluZyB8IG51bWJlciA9XG4gICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIGRhdGFzZXQuZGF0YS5sZW5ndGgpICpcbiAgICAgICAgICAgIChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMSk7XG4gICAgICAgIGlmIChwb2ludHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vaGVyZSwgd2UgY2hlY2sgaWYgd2UgbmVlZCB0byBnZXQgdGhlIGxhc3QgcG9pbnQgb2YgdGhlIGxpbmVcbiAgICAgICAgICBjb25zdCBsYXN0ID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICB4MSA9IGxhc3QucG9pbnQuc3BsaXQoXCIsXCIpWzBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkxID0gKGhlaWdodCAvIDQpICogMyArIHBhZGRpbmdUb3A7XG4gICAgICAgIHZhciB4Mjogc3RyaW5nIHwgbnVtYmVyID0gcGFkZGluZ1JpZ2h0O1xuICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IDAgJiYgcG9pbnRzWzBdLmluZGV4ID4gMCkge1xuICAgICAgICAgIC8vaGVyZSB3ZSBjaGVjayBpZiB3ZSBuZWVkIHRvIGdldCB0aGUgZmlyc3QgbGluZSdzIHBvaW50IHggdG8gbWFrZSB0aGUgdXBwZXIgc2hhZG93XG4gICAgICAgICAgY29uc3QgZmlyc3QgPSBwb2ludHNbMF07XG4gICAgICAgICAgeDIgPSBmaXJzdC5wb2ludC5zcGxpdChcIixcIilbMF07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeTIgPSAoaGVpZ2h0IC8gNCkgKiAzICsgcGFkZGluZ1RvcDsqL1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbLi4ucG9pbnRzLnBvaW50c107XG4gICAgICAgIGlmKHBvaW50cy5yaWdodCkgcmVzdWx0LnB1c2gocG9pbnRzLnJpZ2h0KTtcbiAgICAgICAgaWYocG9pbnRzLmxlZnQpIHJlc3VsdC5wdXNoKHBvaW50cy5sZWZ0KTtcbiAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA9PSAwKSByZXR1cm47XG4vKlxuICAgICAgICAgICAgICBwb2ludHMubWFwKCh7IHBvaW50IH0pID0+IHBvaW50KS5qb2luKFwiIFwiKSArXG4gICAgICAgICAgICAgIGAgJHt4MX0sJHt5MX0gJHt4Mn0sJHt5Mn1gXG4qL1xuICAgICAgICBvdXRwdXQucHVzaChcbiAgICAgICAgICA8UG9seWdvblxuICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgIHBvaW50cz17cmVzdWx0Lm1hcChwID0+IGAke3AueH0sJHtwLnl9YCkuam9pbihcIiBcIil9XG4gICAgICAgICAgICBmaWxsPXtgdXJsKCNmaWxsU2hhZG93R3JhZGllbnQke1xuICAgICAgICAgICAgICB1c2VDb2xvckZyb21EYXRhc2V0ID8gYF8ke2luZGV4fWAgOiBcIlwiXG4gICAgICAgICAgICB9KWB9XG4gICAgICAgICAgICBzdHJva2VXaWR0aD17MH1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIHJlbmRlckxpbmUgPSAoe1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBkYXRhLFxuICAgIGxpbmVqb2luVHlwZVxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJsaW5lam9pblR5cGVcIlxuICA+KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuYmV6aWVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJCZXppZXJMaW5lKHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgICBwYWRkaW5nVG9wXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XG5cbiAgICBsZXQgbGFzdFBvaW50OiBzdHJpbmc7XG5cbiAgICBjb25zdCB0b1BvaW50cyA9IChcbiAgICAgIGRhdGFzZXQ6IERhdGFzZXQsXG4gICAgICBsaW5lczogeyBkYXRhOiBudW1iZXIgfCBudWxsOyBpbmRleDogbnVtYmVyIH1bXVtdXG4gICAgKSA9PiB7XG4gICAgICByZXR1cm4gbGluZXMubWFwKGxpbmUgPT5cbiAgICAgICAgbGluZS5tYXAoKHsgZGF0YSwgaW5kZXggfSkgPT4ge1xuICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSByZXR1cm4gbGFzdFBvaW50O1xuICAgICAgICAgIGNvbnN0IHggPVxuICAgICAgICAgICAgKGluZGV4ICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoICtcbiAgICAgICAgICAgIHBhZGRpbmdSaWdodDtcbiAgICAgICAgICBjb25zdCB5ID1cbiAgICAgICAgICAgICgoYmFzZUhlaWdodCAtIHRoaXMuY2FsY0hlaWdodChkYXRhLCBkYXRhcywgaGVpZ2h0KSkgLyA0KSAqIDMgK1xuICAgICAgICAgICAgcGFkZGluZ1RvcDtcbiAgICAgICAgICBsYXN0UG9pbnQgPSBgJHt4fSwke3l9YDtcbiAgICAgICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBza2lwcGVkID0gdGhpcy5wcm9wcy5kYXRhU2tpcHBlZFNlZ21lbnRzIHx8IFtdO1xuICAgIGNvbnN0IGF2b2lkID0gdGhpcy5wcm9wcy5oaWRlUG9pbnRzQXRJbmRleCB8fCBbXTtcblxuICAgIGRhdGEuZm9yRWFjaCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IGRhdGFzZXQuZGF0YS5sZW5ndGg7XG5cbiAgICAgIHZhciBsaW5lczogc3RyaW5nW11bXSA9IFtdO1xuXG4gICAgICBjb25zdCBjYW5fc2tpcCA9XG4gICAgICAgICEhc2tpcHBlZCAmJiBza2lwcGVkLmxlbmd0aCA+IDAgJiYgc2tpcHBlZC5sZW5ndGggPj0gbGVuZ3RoO1xuICAgICAgY29uc3QgY2FuX2F2b2lkID0gISFhdm9pZCAmJiBhdm9pZC5sZW5ndGggJiYgYXZvaWQubGVuZ3RoIDw9IGxlbmd0aDtcbiAgICAgIGlmIChjYW5fc2tpcCB8fCBjYW5fYXZvaWQpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRfbGluZTogeyBkYXRhOiBudW1iZXI7IGluZGV4OiBudW1iZXIgfVtdID0gW107XG4gICAgICAgIHZhciB0ZW1wOiB7IGRhdGE6IG51bWJlcjsgaW5kZXg6IG51bWJlciB9W11bXSA9IFtdO1xuXG4gICAgICAgIGRhdGFzZXQuZGF0YS5tYXAoKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKCEhc2tpcHBlZFtpbmRleF0gfHwgYXZvaWQuZmluZChpID0+IGkgPT0gaW5kZXgpKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudF9saW5lICYmIGN1cnJlbnRfbGluZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHRlbXAucHVzaChjdXJyZW50X2xpbmUpO1xuICAgICAgICAgICAgICBjdXJyZW50X2xpbmUgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudF9saW5lLnB1c2goeyBkYXRhLCBpbmRleCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY3VycmVudF9saW5lLmxlbmd0aCA+IDApIHRlbXAucHVzaChjdXJyZW50X2xpbmUpO1xuXG4gICAgICAgIGxpbmVzID0gdG9Qb2ludHMoZGF0YXNldCwgdGVtcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0ZW1wID0gW2RhdGFzZXQuZGF0YS5tYXAoKGRhdGEsIGluZGV4KSA9PiAoeyBkYXRhLCBpbmRleCB9KSldO1xuICAgICAgICBsaW5lcyA9IHRvUG9pbnRzKGRhdGFzZXQsIHRlbXApO1xuICAgICAgfVxuXG4gICAgICBsaW5lcy5mb3JFYWNoKHBvaW50cyA9PiB7XG4gICAgICAgIG91dHB1dC5wdXNoKFxuICAgICAgICAgIDxQb2x5bGluZVxuICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPXtsaW5lam9pblR5cGV9XG4gICAgICAgICAgICBwb2ludHM9e3BvaW50cy5qb2luKFwiIFwiKX1cbiAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgIHN0cm9rZT17dGhpcy5nZXRDb2xvcihkYXRhc2V0LCAwLjIpfVxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg9e3RoaXMuZ2V0U3Ryb2tlV2lkdGgoZGF0YXNldCl9XG4gICAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e2RhdGFzZXQuc3Ryb2tlRGFzaEFycmF5fVxuICAgICAgICAgICAgc3Ryb2tlRGFzaG9mZnNldD17ZGF0YXNldC5zdHJva2VEYXNoT2Zmc2V0fVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgZ2V0QmV6aWVyTGluZVBvaW50cyA9IChcbiAgICBkYXRhc2V0OiBEYXRhc2V0LFxuICAgIHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgcGFkZGluZ1RvcCxcbiAgICAgIGRhdGFcbiAgICB9OiBQaWNrPFxuICAgICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcImRhdGFcIlxuICAgID5cbiAgKSA9PiB7XG4gICAgaWYgKGRhdGFzZXQuZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBcIk0wLDBcIjtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG5cbiAgICBjb25zdCB4ID0gKGk6IG51bWJlcikgPT5cbiAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgIHBhZGRpbmdSaWdodCArIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoXG4gICAgICApO1xuXG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XG5cbiAgICBjb25zdCB5ID0gKGk6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgeUhlaWdodCA9IHRoaXMuY2FsY0hlaWdodChkYXRhc2V0LmRhdGFbaV0sIGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigoKGJhc2VIZWlnaHQgLSB5SGVpZ2h0KSAvIDQpICogMyArIHBhZGRpbmdUb3ApO1xuICAgIH07XG5cbiAgICByZXR1cm4gW2BNJHt4KDApfSwke3koMCl9YF1cbiAgICAgIC5jb25jYXQoXG4gICAgICAgIGRhdGFzZXQuZGF0YS5zbGljZSgwLCAtMSkubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgeF9taWQgPSAoeChpKSArIHgoaSArIDEpKSAvIDI7XG4gICAgICAgICAgY29uc3QgeV9taWQgPSAoeShpKSArIHkoaSArIDEpKSAvIDI7XG4gICAgICAgICAgY29uc3QgY3BfeDEgPSAoeF9taWQgKyB4KGkpKSAvIDI7XG4gICAgICAgICAgY29uc3QgY3BfeDIgPSAoeF9taWQgKyB4KGkgKyAxKSkgLyAyO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBgUSAke2NwX3gxfSwgJHt5KGkpfSwgJHt4X21pZH0sICR7eV9taWR9YCArXG4gICAgICAgICAgICBgIFEgJHtjcF94Mn0sICR7eShpICsgMSl9LCAke3goaSArIDEpfSwgJHt5KGkgKyAxKX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5qb2luKFwiIFwiKTtcbiAgfTtcblxuICByZW5kZXJCZXppZXJMaW5lID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcFxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4pID0+IHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmdldEJlemllckxpbmVQb2ludHMoZGF0YXNldCwge1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgIGRhdGFcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UGF0aFxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgZD17cmVzdWx0fVxuICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC4yKX1cbiAgICAgICAgICBzdHJva2VXaWR0aD17dGhpcy5nZXRTdHJva2VXaWR0aChkYXRhc2V0KX1cbiAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e2RhdGFzZXQuc3Ryb2tlRGFzaEFycmF5fVxuICAgICAgICAgIHN0cm9rZURhc2hvZmZzZXQ9e2RhdGFzZXQuc3Ryb2tlRGFzaE9mZnNldH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyQmV6aWVyU2hhZG93ID0gKHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgZGF0YSxcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0XG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcbiAgPiAmIHtcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0OiBBYnN0cmFjdENoYXJ0Q29uZmlnW1widXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFwiXTtcbiAgfSkgPT5cbiAgICBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGQgPVxuICAgICAgICB0aGlzLmdldEJlemllckxpbmVQb2ludHMoZGF0YXNldCwge1xuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICBkYXRhXG4gICAgICAgIH0pICtcbiAgICAgICAgYCBMJHtwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gZGF0YXNldC5kYXRhLmxlbmd0aCkgKlxuICAgICAgICAgICAgKGRhdGFzZXQuZGF0YS5sZW5ndGggLSAxKX0sJHsoaGVpZ2h0IC8gNCkgKiAzICtcbiAgICAgICAgICBwYWRkaW5nVG9wfSBMJHtwYWRkaW5nUmlnaHR9LCR7KGhlaWdodCAvIDQpICogMyArIHBhZGRpbmdUb3B9IFpgO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UGF0aFxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgZD17ZH1cbiAgICAgICAgICBmaWxsPXtgdXJsKCNmaWxsU2hhZG93R3JhZGllbnQke1xuICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldCA/IGBfJHtpbmRleH1gIDogXCJcIlxuICAgICAgICAgIH0pYH1cbiAgICAgICAgICBzdHJva2VXaWR0aD17MH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgcmVuZGVyTGVnZW5kID0gKHdpZHRoLCBsZWdlbmRPZmZzZXQpID0+IHtcbiAgICBjb25zdCB7IGxlZ2VuZCwgZGF0YXNldHMgfSA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBjb25zdCBiYXNlTGVnZW5kSXRlbVggPSB3aWR0aCAvIChsZWdlbmQubGVuZ3RoICsgMSk7XG5cbiAgICByZXR1cm4gbGVnZW5kLm1hcCgobGVnZW5kSXRlbSwgaSkgPT4gKFxuICAgICAgPEcga2V5PXtNYXRoLnJhbmRvbSgpfT5cbiAgICAgICAgPExlZ2VuZEl0ZW1cbiAgICAgICAgICBpbmRleD17aX1cbiAgICAgICAgICBpY29uQ29sb3I9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldHNbaV0sIDAuOSl9XG4gICAgICAgICAgYmFzZUxlZ2VuZEl0ZW1YPXtiYXNlTGVnZW5kSXRlbVh9XG4gICAgICAgICAgbGVnZW5kVGV4dD17bGVnZW5kSXRlbX1cbiAgICAgICAgICBsYWJlbFByb3BzPXt7IC4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKSB9fVxuICAgICAgICAgIGxlZ2VuZE9mZnNldD17bGVnZW5kT2Zmc2V0fVxuICAgICAgICAvPlxuICAgICAgPC9HPlxuICAgICkpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGRhdGEsXG4gICAgICB3aXRoU2Nyb2xsYWJsZURvdCA9IGZhbHNlLFxuICAgICAgd2l0aFNoYWRvdyA9IHRydWUsXG4gICAgICB3aXRoRG90cyA9IHRydWUsXG4gICAgICB3aXRoSW5uZXJMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoT3V0ZXJMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoSG9yaXpvbnRhbExpbmVzID0gdHJ1ZSxcbiAgICAgIHdpdGhWZXJ0aWNhbExpbmVzID0gdHJ1ZSxcbiAgICAgIHdpdGhIb3Jpem9udGFsTGFiZWxzID0gdHJ1ZSxcbiAgICAgIHdpdGhWZXJ0aWNhbExhYmVscyA9IHRydWUsXG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgZGVjb3JhdG9yLFxuICAgICAgb25EYXRhUG9pbnRDbGljayxcbiAgICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBmb3JtYXRZTGFiZWwgPSB5TGFiZWwgPT4geUxhYmVsLFxuICAgICAgZm9ybWF0WExhYmVsID0geExhYmVsID0+IHhMYWJlbCxcbiAgICAgIHNlZ21lbnRzLFxuICAgICAgdHJhbnNwYXJlbnQgPSBmYWxzZSxcbiAgICAgIGNoYXJ0Q29uZmlnLFxuICAgICAgdmVydGljYWxMaW5lc0ludGVydmFsXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbGFiZWxzID0gW10gfSA9IGRhdGE7XG4gICAgY29uc3Qge1xuICAgICAgYm9yZGVyUmFkaXVzID0gMCxcbiAgICAgIHBhZGRpbmdUb3AgPSAxNixcbiAgICAgIHBhZGRpbmdSaWdodCA9IDY0LFxuICAgICAgbWFyZ2luID0gMCxcbiAgICAgIG1hcmdpblJpZ2h0ID0gMCxcbiAgICAgIHBhZGRpbmdCb3R0b20gPSAwXG4gICAgfSA9IHN0eWxlO1xuXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24sXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbixcbiAgICAgIHZlcnRpY2FsTGluZXNJbnRlcnZhbFxuICAgIH07XG5cbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YS5kYXRhc2V0cyk7XG5cbiAgICBsZXQgY291bnQgPSBNYXRoLm1pbiguLi5kYXRhcykgPT09IE1hdGgubWF4KC4uLmRhdGFzKSA/IDEgOiA0O1xuICAgIGlmIChzZWdtZW50cykge1xuICAgICAgY291bnQgPSBzZWdtZW50cztcbiAgICB9XG5cbiAgICBjb25zdCBsZWdlbmRPZmZzZXQgPSB0aGlzLnByb3BzLmRhdGEubGVnZW5kID8gaGVpZ2h0ICogMC4xNSA6IDA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXcgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgPFN2Z1xuICAgICAgICAgIGhlaWdodD17aGVpZ2h0ICsgKHBhZGRpbmdCb3R0b20gYXMgbnVtYmVyKSArIGxlZ2VuZE9mZnNldH1cbiAgICAgICAgICB3aWR0aD17d2lkdGggLSAobWFyZ2luIGFzIG51bWJlcikgKiAyIC0gKG1hcmdpblJpZ2h0IGFzIG51bWJlcil9XG4gICAgICAgID5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0ICsgbGVnZW5kT2Zmc2V0fVxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBmaWxsPVwidXJsKCNiYWNrZ3JvdW5kR3JhZGllbnQpXCJcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5PXt0cmFuc3BhcmVudCA/IDAgOiAxfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3RoaXMucHJvcHMuZGF0YS5sZWdlbmQgJiZcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTGVnZW5kKGNvbmZpZy53aWR0aCwgbGVnZW5kT2Zmc2V0KX1cbiAgICAgICAgICA8RyB4PVwiMFwiIHk9e2xlZ2VuZE9mZnNldH0+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAuLi5jaGFydENvbmZpZyxcbiAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhIb3Jpem9udGFsTGluZXMgJiZcbiAgICAgICAgICAgICAgICAod2l0aElubmVyTGluZXNcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZXMoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIDogd2l0aE91dGVyTGluZXNcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZSh7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IG51bGwpfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoSG9yaXpvbnRhbExhYmVscyAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVySG9yaXpvbnRhbExhYmVscyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhcyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0WUxhYmVsLFxuICAgICAgICAgICAgICAgICAgZGVjaW1hbFBsYWNlczogY2hhcnRDb25maWcuZGVjaW1hbFBsYWNlc1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoVmVydGljYWxMaW5lcyAmJlxuICAgICAgICAgICAgICAgICh3aXRoSW5uZXJMaW5lc1xuICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlclZlcnRpY2FsTGluZXMoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzWzBdLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IHdpdGhPdXRlckxpbmVzXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyVmVydGljYWxMaW5lKHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IG51bGwpfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoVmVydGljYWxMYWJlbHMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclZlcnRpY2FsTGFiZWxzKHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGxhYmVscyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0WExhYmVsXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyTGluZSh7XG4gICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoU2hhZG93ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTaGFkb3coe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldDogY2hhcnRDb25maWcudXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoRG90cyAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRG90cyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBvbkRhdGFQb2ludENsaWNrXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhTY3JvbGxhYmxlRG90ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTY3JvbGxhYmxlRG90KHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgb25EYXRhUG9pbnRDbGljayxcbiAgICAgICAgICAgICAgICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge2RlY29yYXRvciAmJlxuICAgICAgICAgICAgICAgIGRlY29yYXRvcih7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgIDwvRz5cbiAgICAgICAgPC9Tdmc+XG4gICAgICAgIHt3aXRoU2Nyb2xsYWJsZURvdCAmJiAoXG4gICAgICAgICAgPFNjcm9sbFZpZXdcbiAgICAgICAgICAgIHN0eWxlPXtTdHlsZVNoZWV0LmFic29sdXRlRmlsbH1cbiAgICAgICAgICAgIGNvbnRlbnRDb250YWluZXJTdHlsZT17eyB3aWR0aDogd2lkdGggKiAyIH19XG4gICAgICAgICAgICBzaG93c0hvcml6b250YWxTY3JvbGxJbmRpY2F0b3I9e2ZhbHNlfVxuICAgICAgICAgICAgc2Nyb2xsRXZlbnRUaHJvdHRsZT17MTZ9XG4gICAgICAgICAgICBvblNjcm9sbD17QW5pbWF0ZWQuZXZlbnQoW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmF0aXZlRXZlbnQ6IHtcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnRPZmZzZXQ6IHsgeDogc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSl9XG4gICAgICAgICAgICBob3Jpem9udGFsXG4gICAgICAgICAgICBib3VuY2VzPXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGluZUNoYXJ0O1xuIl19
