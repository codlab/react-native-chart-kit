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
      return data.map(function(dataset, index) {
        return (
          <Polygon
            key={index}
            points={
              dataset.data
                .map(function(d, i) {
                  var x =
                    paddingRight +
                    (i * (width - paddingRight)) / dataset.data.length;
                  var y =
                    ((baseHeight - _this.calcHeight(d, datas, height)) / 4) *
                      3 +
                    paddingTop;
                  return x + "," + y;
                })
                .join(" ") +
              (" " +
                (paddingRight +
                  ((width - paddingRight) / dataset.data.length) *
                    (dataset.data.length - 1)) +
                "," +
                ((height / 4) * 3 + paddingTop) +
                " " +
                paddingRight +
                "," +
                ((height / 4) * 3 + paddingTop))
            }
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
      var skipped = _this.props.dataSkippedSegments;
      data.forEach(function(dataset, index) {
        var length = dataset.data.length;
        var lines = [];
        if (!!skipped && skipped.length > 0 && skipped.length >= length) {
          var current_line = [];
          var temp = [];
          dataset.data.map(function(data, index) {
            if (!!skipped[index]) {
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
      chartConfig = _a.chartConfig;
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
      horizontalLabelRotation: horizontalLabelRotation
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZUNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpbmUtY2hhcnQvTGluZUNoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFvQixNQUFNLE9BQU8sQ0FBQztBQUN6QyxPQUFPLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxFQUNULElBQUksRUFFTCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQ0wsTUFBTSxFQUNOLENBQUMsRUFDRCxJQUFJLEVBQ0osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osR0FBRyxFQUNKLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxhQUdOLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUxQyxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7QUE0TTlEO0lBQXdCLDZCQUE2QztJQUFyRTtRQUFBLHFFQWt5QkM7UUFqeUJDLFdBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFhLENBQUM7UUFFckMsV0FBSyxHQUFHO1lBQ04sNkJBQTZCLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNyRCxDQUFDO1FBRUYsY0FBUSxHQUFHLFVBQUMsT0FBZ0IsRUFBRSxPQUFlO1lBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQztRQUVGLG9CQUFjLEdBQUcsVUFBQyxPQUFnQjtZQUNoQyxPQUFPLE9BQU8sQ0FBQyxXQUFXLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FB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VUFBVSxFQUFFLFVBQW9CLEVBQ2hDLFlBQVksRUFBRSxZQUFzQixFQUNwQyxnQkFBZ0Isa0JBQUE7Z0JBQ2hCLDZCQUE2QiwrQkFBQSxJQUM3QixDQUNOO1lBQUEsRUFBRSxDQUFDLENBQ0g7WUFBQSxDQUFDLENBQUMsQ0FDQTtjQUFBLENBQUMsU0FBUztZQUNSLFNBQVMsdUJBQ0osTUFBTSxLQUNULElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUNuQixVQUFVLFlBQUE7Z0JBQ1YsWUFBWSxjQUFBLElBQ1osQ0FDTjtZQUFBLEVBQUUsQ0FBQyxDQUNMO1VBQUEsRUFBRSxDQUFDLENBQ0w7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsaUJBQWlCLElBQUksQ0FDcEIsQ0FBQyxVQUFVLENBQ1QsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUMvQixxQkFBcUIsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUM1Qyw4QkFBOEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUN0QyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUN4QixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3ZCO2dCQUNFLFdBQVcsRUFBRTtvQkFDWCxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsNkJBQTZCLEVBQUU7aUJBQ3BEO2FBQ0Y7U0FDRixDQUFDLENBQUMsQ0FDSCxVQUFVLENBQ1YsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQ2YsQ0FDSCxDQUNIO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWx5QkQsQ0FBd0IsYUFBYSxHQWt5QnBDO0FBRUQsZUFBZSxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1xuICBBbmltYXRlZCxcbiAgU2Nyb2xsVmlldyxcbiAgU3R5bGVTaGVldCxcbiAgVGV4dElucHV0LFxuICBWaWV3LFxuICBWaWV3U3R5bGVcbn0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHtcbiAgQ2lyY2xlLFxuICBHLFxuICBQYXRoLFxuICBQb2x5Z29uLFxuICBQb2x5bGluZSxcbiAgUmVjdCxcbiAgU3ZnXG59IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7XG4gIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gIEFic3RyYWN0Q2hhcnRQcm9wc1xufSBmcm9tIFwiLi4vQWJzdHJhY3RDaGFydFwiO1xuaW1wb3J0IHsgQ2hhcnREYXRhLCBEYXRhc2V0IH0gZnJvbSBcIi4uL0hlbHBlclR5cGVzXCI7XG5pbXBvcnQgeyBMZWdlbmRJdGVtIH0gZnJvbSBcIi4vTGVnZW5kSXRlbVwiO1xuXG5sZXQgQW5pbWF0ZWRDaXJjbGUgPSBBbmltYXRlZC5jcmVhdGVBbmltYXRlZENvbXBvbmVudChDaXJjbGUpO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpbmVDaGFydERhdGEgZXh0ZW5kcyBDaGFydERhdGEge1xuICBsZWdlbmQ/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIC8qKlxuICAgKiBEYXRhIGZvciB0aGUgY2hhcnQuXG4gICAqXG4gICAqIEV4YW1wbGUgZnJvbSBbZG9jc10oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQjbGluZS1jaGFydCk6XG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3QgZGF0YSA9IHtcbiAgICogICBsYWJlbHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZSddLFxuICAgKiAgIGRhdGFzZXRzOiBbe1xuICAgKiAgICAgZGF0YTogWyAyMCwgNDUsIDI4LCA4MCwgOTksIDQzIF0sXG4gICAqICAgICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgxMzQsIDY1LCAyNDQsICR7b3BhY2l0eX0pYCwgLy8gb3B0aW9uYWxcbiAgICogICAgIHN0cm9rZVdpZHRoOiAyIC8vIG9wdGlvbmFsXG4gICAqICAgfV0sXG4gICAqICAgbGVnZW5kOiBbXCJSYWlueSBEYXlzXCIsIFwiU3VubnkgRGF5c1wiLCBcIlNub3d5IERheXNcIl0gLy8gb3B0aW9uYWxcbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIGRhdGE6IExpbmVDaGFydERhdGE7XG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgY2hhcnQsIHVzZSAnRGltZW5zaW9ucycgbGlicmFyeSB0byBnZXQgdGhlIHdpZHRoIG9mIHlvdXIgc2NyZWVuIGZvciByZXNwb25zaXZlLlxuICAgKi9cbiAgd2lkdGg6IG51bWJlcjtcbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgY2hhcnQuXG4gICAqL1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgLyoqXG4gICAqIFNob3cgZG90cyBvbiB0aGUgbGluZSAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoRG90cz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHNoYWRvdyBmb3IgbGluZSAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoU2hhZG93PzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaW5uZXIgZGFzaGVkIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG5cbiAgd2l0aFNjcm9sbGFibGVEb3Q/OiBib29sZWFuO1xuICB3aXRoSW5uZXJMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IG91dGVyIGRhc2hlZCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoT3V0ZXJMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHZlcnRpY2FsIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhWZXJ0aWNhbExpbmVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaG9yaXpvbnRhbCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoSG9yaXpvbnRhbExpbmVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgdmVydGljYWwgbGFiZWxzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhWZXJ0aWNhbExhYmVscz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IGhvcml6b250YWwgbGFiZWxzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhIb3Jpem9udGFsTGFiZWxzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFJlbmRlciBjaGFydHMgZnJvbSAwIG5vdCBmcm9tIHRoZSBtaW5pbXVtIHZhbHVlLiAtIGRlZmF1bHQ6IEZhbHNlLlxuICAgKi9cbiAgZnJvbVplcm8/OiBib29sZWFuO1xuICAvKipcbiAgICogUHJlcGVuZCB0ZXh0IHRvIGhvcml6b250YWwgbGFiZWxzIC0tIGRlZmF1bHQ6ICcnLlxuICAgKi9cbiAgeUF4aXNMYWJlbD86IHN0cmluZztcbiAgLyoqXG4gICAqIEFwcGVuZCB0ZXh0IHRvIGhvcml6b250YWwgbGFiZWxzIC0tIGRlZmF1bHQ6ICcnLlxuICAgKi9cbiAgeUF4aXNTdWZmaXg/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBQcmVwZW5kIHRleHQgdG8gdmVydGljYWwgbGFiZWxzIC0tIGRlZmF1bHQ6ICcnLlxuICAgKi9cbiAgeEF4aXNMYWJlbD86IHN0cmluZztcbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB0aGUgY2hhcnQsIHNlZSBleGFtcGxlOlxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGNoYXJ0Q29uZmlnID0ge1xuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudEZyb206IFwiIzFFMjkyM1wiLFxuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5OiAwLFxuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudFRvOiBcIiMwODEzMERcIixcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHk6IDAuNSxcbiAgICogICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgyNiwgMjU1LCAxNDYsICR7b3BhY2l0eX0pYCxcbiAgICogICBsYWJlbENvbG9yOiAob3BhY2l0eSA9IDEpID0+IGByZ2JhKDI2LCAyNTUsIDE0NiwgJHtvcGFjaXR5fSlgLFxuICAgKiAgIHN0cm9rZVdpZHRoOiAyLCAvLyBvcHRpb25hbCwgZGVmYXVsdCAzXG4gICAqICAgYmFyUGVyY2VudGFnZTogMC41XG4gICAqIH07XG4gICAqIGBgYFxuICAgKi9cbiAgY2hhcnRDb25maWc/OiBBYnN0cmFjdENoYXJ0Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBEaXZpZGUgYXhpcyBxdWFudGl0eSBieSB0aGUgaW5wdXQgbnVtYmVyIC0tIGRlZmF1bHQ6IDEuXG4gICAqL1xuICB5QXhpc0ludGVydmFsPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIGNoYXJ0IGlzIHRyYW5zcGFyZW50XG4gICAqL1xuICB0cmFuc3BhcmVudD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgW3dob2xlIGJ1bmNoXShodHRwczovL2dpdGh1Yi5jb20vaW5kaWVzcGlyaXQvcmVhY3QtbmF0aXZlLWNoYXJ0LWtpdC9ibG9iL21hc3Rlci9zcmMvbGluZS1jaGFydC5qcyNMMjY2KVxuICAgKiBvZiBzdHVmZiBhbmQgY2FuIHJlbmRlciBleHRyYSBlbGVtZW50cyxcbiAgICogc3VjaCBhcyBkYXRhIHBvaW50IGluZm8gb3IgYWRkaXRpb25hbCBtYXJrdXAuXG4gICAqL1xuICBkZWNvcmF0b3I/OiBGdW5jdGlvbjtcbiAgLyoqXG4gICAqIENhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIHdoZW4gYSBkYXRhIHBvaW50IGlzIGNsaWNrZWQuXG4gICAqL1xuICBvbkRhdGFQb2ludENsaWNrPzogKGRhdGE6IHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIHZhbHVlOiBudW1iZXI7XG4gICAgZGF0YXNldDogRGF0YXNldDtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGdldENvbG9yOiAob3BhY2l0eTogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIH0pID0+IHZvaWQ7XG4gIC8qKlxuICAgKiBTdHlsZSBvZiB0aGUgY29udGFpbmVyIHZpZXcgb2YgdGhlIGNoYXJ0LlxuICAgKi9cbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIC8qKlxuICAgKiBBZGQgdGhpcyBwcm9wIHRvIG1ha2UgdGhlIGxpbmUgY2hhcnQgc21vb3RoIGFuZCBjdXJ2eS5cbiAgICpcbiAgICogW0V4YW1wbGVdKGh0dHBzOi8vZ2l0aHViLmNvbS9pbmRpZXNwaXJpdC9yZWFjdC1uYXRpdmUtY2hhcnQta2l0I2Jlemllci1saW5lLWNoYXJ0KVxuICAgKi9cbiAgYmV6aWVyPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNraXBwZWQgcG9pbnRzIDogb3B0aW9uYWwgYXJyYXkgd2hlcmUgaXRzIGxlbmd0aCBuZWVkcyB0byBtYXRjaCB0aGUgZGF0YS5sZW5ndGhcbiAgICogXG4gICAqIFRoZSByZW5kZXJlZCBsaW5lIHdpbGwgYmUgc2VnbWVudGVkIGFjcm9zcyB0aGUgdmFyaW91cyBcInNraXBwZWRcIiBwb2ludHMgb2YgdGhlIGRhdGEgc2V0XG4gICAqIFxuICAgKiAobm90ZSB0aGF0IHRoZSBkYXRhIG5lZWRzIHRvIGJlIGNvbnNpc3RhbnQsIHZhbHVlcyBza2lwcGVkIHNob3VsZCBiZSBzb21ldGhpbmcgbGlrZSAwKVxuICAgKi9cbiAgZGF0YVNraXBwZWRTZWdtZW50cz86IGJvb2xlYW5bXTtcbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIGRvdCBjb2xvciBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gY2FsY3VsYXRlIGNvbG9ycyBvZiBkb3RzIGluIGEgbGluZSBjaGFydC5cbiAgICogVGFrZXMgYChkYXRhUG9pbnQsIGRhdGFQb2ludEluZGV4KWAgYXMgYXJndW1lbnRzLlxuICAgKi9cbiAgZ2V0RG90Q29sb3I/OiAoZGF0YVBvaW50OiBhbnksIGluZGV4OiBudW1iZXIpID0+IHN0cmluZztcbiAgLyoqXG4gICAqIFJlbmRlcnMgYWRkaXRpb25hbCBjb250ZW50IGZvciBkb3RzIGluIGEgbGluZSBjaGFydC5cbiAgICogVGFrZXMgYCh7eCwgeSwgaW5kZXh9KWAgYXMgYXJndW1lbnRzLlxuICAgKi9cbiAgcmVuZGVyRG90Q29udGVudD86IChwYXJhbXM6IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGluZGV4OiBudW1iZXI7XG4gICAgaW5kZXhEYXRhOiBudW1iZXI7XG4gIH0pID0+IFJlYWN0LlJlYWN0Tm9kZTtcbiAgLyoqXG4gICAqIFJvdGF0aW9uIGFuZ2xlIG9mIHRoZSBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQgMCAoZGVncmVlcykuXG4gICAqL1xuICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcbiAgLyoqXG4gICAqIFJvdGF0aW9uIGFuZ2xlIG9mIHRoZSB2ZXJ0aWNhbCBsYWJlbHMgLSBkZWZhdWx0IDAgKGRlZ3JlZXMpLlxuICAgKi9cbiAgdmVydGljYWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICAvKipcbiAgICogT2Zmc2V0IGZvciBZIGF4aXMgbGFiZWxzLlxuICAgKi9cbiAgeUxhYmVsc09mZnNldD86IG51bWJlcjtcbiAgLyoqXG4gICAqIE9mZnNldCBmb3IgWCBheGlzIGxhYmVscy5cbiAgICovXG4gIHhMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBBcnJheSBvZiBpbmRpY2VzIG9mIHRoZSBkYXRhIHBvaW50cyB5b3UgZG9uJ3Qgd2FudCB0byBkaXNwbGF5LlxuICAgKi9cbiAgaGlkZVBvaW50c0F0SW5kZXg/OiBudW1iZXJbXTtcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gY2hhbmdlIHRoZSBmb3JtYXQgb2YgdGhlIGRpc3BsYXkgdmFsdWUgb2YgdGhlIFkgbGFiZWwuXG4gICAqIFRha2VzIHRoZSB5IHZhbHVlIGFzIGFyZ3VtZW50IGFuZCBzaG91bGQgcmV0dXJuIHRoZSBkZXNpcmFibGUgc3RyaW5nLlxuICAgKi9cbiAgZm9ybWF0WUxhYmVsPzogKHlWYWx1ZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNoYW5nZSB0aGUgZm9ybWF0IG9mIHRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBYIGxhYmVsLlxuICAgKiBUYWtlcyB0aGUgWCB2YWx1ZSBhcyBhcmd1bWVudCBhbmQgc2hvdWxkIHJldHVybiB0aGUgZGVzaXJhYmxlIHN0cmluZy5cbiAgICovXG4gIGZvcm1hdFhMYWJlbD86ICh4VmFsdWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICAvKipcbiAgICogUHJvdmlkZSBwcm9wcyBmb3IgYSBkYXRhIHBvaW50IGRvdC5cbiAgICovXG4gIGdldERvdFByb3BzPzogKGRhdGFQb2ludDogYW55LCBpbmRleDogbnVtYmVyKSA9PiBvYmplY3Q7XG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGhvcml6b250YWwgbGluZXNcbiAgICovXG4gIHNlZ21lbnRzPzogbnVtYmVyO1xufVxuXG50eXBlIExpbmVDaGFydFN0YXRlID0ge1xuICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldDogQW5pbWF0ZWQuVmFsdWU7XG59O1xuXG5jbGFzcyBMaW5lQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PExpbmVDaGFydFByb3BzLCBMaW5lQ2hhcnRTdGF0ZT4ge1xuICBsYWJlbCA9IFJlYWN0LmNyZWF0ZVJlZjxUZXh0SW5wdXQ+KCk7XG5cbiAgc3RhdGUgPSB7XG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQ6IG5ldyBBbmltYXRlZC5WYWx1ZSgwKVxuICB9O1xuXG4gIGdldENvbG9yID0gKGRhdGFzZXQ6IERhdGFzZXQsIG9wYWNpdHk6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiAoZGF0YXNldC5jb2xvciB8fCB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKShvcGFjaXR5KTtcbiAgfTtcblxuICBnZXRTdHJva2VXaWR0aCA9IChkYXRhc2V0OiBEYXRhc2V0KSA9PiB7XG4gICAgcmV0dXJuIGRhdGFzZXQuc3Ryb2tlV2lkdGggfHwgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5zdHJva2VXaWR0aCB8fCAzO1xuICB9O1xuXG4gIGdldERhdGFzID0gKGRhdGE6IERhdGFzZXRbXSk6IG51bWJlcltdID0+IHtcbiAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAoYWNjLCBpdGVtKSA9PiAoaXRlbS5kYXRhID8gWy4uLmFjYywgLi4uaXRlbS5kYXRhXSA6IGFjYyksXG4gICAgICBbXVxuICAgICk7XG4gIH07XG5cbiAgZ2V0UHJvcHNGb3JEb3RzID0gKHg6IGFueSwgaTogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgeyBnZXREb3RQcm9wcywgY2hhcnRDb25maWcgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAodHlwZW9mIGdldERvdFByb3BzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiBnZXREb3RQcm9wcyh4LCBpKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHByb3BzRm9yRG90cyA9IHt9IH0gPSBjaGFydENvbmZpZztcblxuICAgIHJldHVybiB7IHI6IFwiNFwiLCAuLi5wcm9wc0ZvckRvdHMgfTtcbiAgfTtcblxuICByZW5kZXJEb3RzID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBvbkRhdGFQb2ludENsaWNrXG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcbiAgPiAmIHtcbiAgICBvbkRhdGFQb2ludENsaWNrOiBMaW5lQ2hhcnRQcm9wc1tcIm9uRGF0YVBvaW50Q2xpY2tcIl07XG4gIH0pID0+IHtcbiAgICBjb25zdCBvdXRwdXQ6IFJlYWN0Tm9kZVtdID0gW107XG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgY29uc3Qge1xuICAgICAgZ2V0RG90Q29sb3IsXG4gICAgICBoaWRlUG9pbnRzQXRJbmRleCA9IFtdLFxuICAgICAgcmVuZGVyRG90Q29udGVudCA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBkYXRhLmZvckVhY2goZGF0YXNldCA9PiB7XG4gICAgICBpZiAoZGF0YXNldC53aXRoRG90cyA9PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICBkYXRhc2V0LmRhdGEuZm9yRWFjaCgoeCwgaSkgPT4ge1xuICAgICAgICBpZiAoaGlkZVBvaW50c0F0SW5kZXguaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjeCA9XG4gICAgICAgICAgcGFkZGluZ1JpZ2h0ICsgKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGRhdGFzZXQuZGF0YS5sZW5ndGg7XG5cbiAgICAgICAgY29uc3QgY3kgPVxuICAgICAgICAgICgoYmFzZUhlaWdodCAtIHRoaXMuY2FsY0hlaWdodCh4LCBkYXRhcywgaGVpZ2h0KSkgLyA0KSAqIDMgK1xuICAgICAgICAgIHBhZGRpbmdUb3A7XG5cbiAgICAgICAgY29uc3Qgb25QcmVzcyA9ICgpID0+IHtcbiAgICAgICAgICBpZiAoIW9uRGF0YVBvaW50Q2xpY2sgfHwgaGlkZVBvaW50c0F0SW5kZXguaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvbkRhdGFQb2ludENsaWNrKHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgdmFsdWU6IHgsXG4gICAgICAgICAgICBkYXRhc2V0LFxuICAgICAgICAgICAgeDogY3gsXG4gICAgICAgICAgICB5OiBjeSxcbiAgICAgICAgICAgIGdldENvbG9yOiBvcGFjaXR5ID0+IHRoaXMuZ2V0Q29sb3IoZGF0YXNldCwgb3BhY2l0eSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBvdXRwdXQucHVzaChcbiAgICAgICAgICA8Q2lyY2xlXG4gICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICBjeD17Y3h9XG4gICAgICAgICAgICBjeT17Y3l9XG4gICAgICAgICAgICBmaWxsPXtcbiAgICAgICAgICAgICAgdHlwZW9mIGdldERvdENvbG9yID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICA/IGdldERvdENvbG9yKHgsIGkpXG4gICAgICAgICAgICAgICAgOiB0aGlzLmdldENvbG9yKGRhdGFzZXQsIDAuOSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uUHJlc3M9e29uUHJlc3N9XG4gICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckRvdHMoeCwgaSl9XG4gICAgICAgICAgLz4sXG4gICAgICAgICAgPENpcmNsZVxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgY3g9e2N4fVxuICAgICAgICAgICAgY3k9e2N5fVxuICAgICAgICAgICAgcj1cIjE0XCJcbiAgICAgICAgICAgIGZpbGw9XCIjZmZmXCJcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5PXswfVxuICAgICAgICAgICAgb25QcmVzcz17b25QcmVzc31cbiAgICAgICAgICAvPixcbiAgICAgICAgICByZW5kZXJEb3RDb250ZW50KHsgeDogY3gsIHk6IGN5LCBpbmRleDogaSwgaW5kZXhEYXRhOiB4IH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgcmVuZGVyU2Nyb2xsYWJsZURvdCA9ICh7XG4gICAgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQsXG4gICAgc2Nyb2xsYWJsZURvdEZpbGwsXG4gICAgc2Nyb2xsYWJsZURvdFN0cm9rZUNvbG9yLFxuICAgIHNjcm9sbGFibGVEb3RTdHJva2VXaWR0aCxcbiAgICBzY3JvbGxhYmxlRG90UmFkaXVzLFxuICAgIHNjcm9sbGFibGVJbmZvVmlld1N0eWxlLFxuICAgIHNjcm9sbGFibGVJbmZvVGV4dFN0eWxlLFxuICAgIHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvciA9IHggPT4gYCR7eH1gLFxuICAgIHNjcm9sbGFibGVJbmZvU2l6ZSxcbiAgICBzY3JvbGxhYmxlSW5mb09mZnNldFxuICB9OiBBYnN0cmFjdENoYXJ0Q29uZmlnICYge1xuICAgIG9uRGF0YVBvaW50Q2xpY2s6IExpbmVDaGFydFByb3BzW1wib25EYXRhUG9pbnRDbGlja1wiXTtcbiAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldDogQW5pbWF0ZWQuVmFsdWU7XG4gIH0pID0+IHtcbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XG5cbiAgICBsZXQgdmw6IG51bWJlcltdID0gW107XG5cbiAgICBjb25zdCBwZXJEYXRhID0gd2lkdGggLyBkYXRhWzBdLmRhdGEubGVuZ3RoO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhWzBdLmRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2bC5wdXNoKGluZGV4ICogcGVyRGF0YSk7XG4gICAgfVxuICAgIGxldCBsYXN0SW5kZXg6IG51bWJlcjtcblxuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmFkZExpc3RlbmVyKHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdmFsdWUudmFsdWUgLyBwZXJEYXRhO1xuICAgICAgaWYgKCFsYXN0SW5kZXgpIHtcbiAgICAgICAgbGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICB9XG5cbiAgICAgIGxldCBhYnMgPSBNYXRoLmZsb29yKGluZGV4KTtcbiAgICAgIGxldCBwZXJjZW50ID0gaW5kZXggLSBhYnM7XG4gICAgICBhYnMgPSBkYXRhWzBdLmRhdGEubGVuZ3RoIC0gYWJzIC0gMTtcblxuICAgICAgaWYgKGluZGV4ID49IGRhdGFbMF0uZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKE1hdGguZmxvb3IoZGF0YVswXS5kYXRhWzBdKSlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaW5kZXggPiBsYXN0SW5kZXgpIHtcbiAgICAgICAgICAvLyB0byByaWdodFxuXG4gICAgICAgICAgY29uc3QgYmFzZSA9IGRhdGFbMF0uZGF0YVthYnNdO1xuICAgICAgICAgIGNvbnN0IHByZXYgPSBkYXRhWzBdLmRhdGFbYWJzIC0gMV07XG4gICAgICAgICAgaWYgKHByZXYgPiBiYXNlKSB7XG4gICAgICAgICAgICBsZXQgcmVzdCA9IHByZXYgLSBiYXNlO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSArIHBlcmNlbnQgKiByZXN0KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlc3QgPSBiYXNlIC0gcHJldjtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGJhc2UgLSBwZXJjZW50ICogcmVzdClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHRvIGxlZnRcblxuICAgICAgICAgIGNvbnN0IGJhc2UgPSBkYXRhWzBdLmRhdGFbYWJzIC0gMV07XG4gICAgICAgICAgY29uc3QgbmV4dCA9IGRhdGFbMF0uZGF0YVthYnNdO1xuICAgICAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcbiAgICAgICAgICBpZiAobmV4dCA+IGJhc2UpIHtcbiAgICAgICAgICAgIGxldCByZXN0ID0gbmV4dCAtIGJhc2U7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlICsgcGVyY2VudCAqIHJlc3QpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzdCA9IGJhc2UgLSBuZXh0O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSAtIHBlcmNlbnQgKiByZXN0KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxhc3RJbmRleCA9IGluZGV4O1xuICAgIH0pO1xuXG4gICAgZGF0YS5mb3JFYWNoKGRhdGFzZXQgPT4ge1xuICAgICAgaWYgKGRhdGFzZXQud2l0aFNjcm9sbGFibGVEb3QgPT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgY29uc3QgcGVyRGF0YSA9IHdpZHRoIC8gZGF0YXNldC5kYXRhLmxlbmd0aDtcbiAgICAgIGxldCB2YWx1ZXMgPSBbXTtcbiAgICAgIGxldCB5VmFsdWVzID0gW107XG4gICAgICBsZXQgeFZhbHVlcyA9IFtdO1xuXG4gICAgICBsZXQgeVZhbHVlc0xhYmVsID0gW107XG4gICAgICBsZXQgeFZhbHVlc0xhYmVsID0gW107XG5cbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhc2V0LmRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKGluZGV4ICogcGVyRGF0YSk7XG4gICAgICAgIGNvbnN0IHl2YWwgPVxuICAgICAgICAgICgoYmFzZUhlaWdodCAtXG4gICAgICAgICAgICB0aGlzLmNhbGNIZWlnaHQoXG4gICAgICAgICAgICAgIGRhdGFzZXQuZGF0YVtkYXRhc2V0LmRhdGEubGVuZ3RoIC0gaW5kZXggLSAxXSxcbiAgICAgICAgICAgICAgZGF0YXMsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgKSkgL1xuICAgICAgICAgICAgNCkgKlxuICAgICAgICAgICAgMyArXG4gICAgICAgICAgcGFkZGluZ1RvcDtcbiAgICAgICAgeVZhbHVlcy5wdXNoKHl2YWwpO1xuICAgICAgICBjb25zdCB4dmFsID1cbiAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICgoZGF0YXNldC5kYXRhLmxlbmd0aCAtIGluZGV4IC0gMSkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvXG4gICAgICAgICAgICBkYXRhc2V0LmRhdGEubGVuZ3RoO1xuICAgICAgICB4VmFsdWVzLnB1c2goeHZhbCk7XG5cbiAgICAgICAgeVZhbHVlc0xhYmVsLnB1c2goXG4gICAgICAgICAgeXZhbCAtIChzY3JvbGxhYmxlSW5mb1NpemUuaGVpZ2h0ICsgc2Nyb2xsYWJsZUluZm9PZmZzZXQpXG4gICAgICAgICk7XG4gICAgICAgIHhWYWx1ZXNMYWJlbC5wdXNoKHh2YWwgLSBzY3JvbGxhYmxlSW5mb1NpemUud2lkdGggLyAyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdHJhbnNsYXRlWCA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxuICAgICAgICBvdXRwdXRSYW5nZTogeFZhbHVlcyxcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRyYW5zbGF0ZVkgPSBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5pbnRlcnBvbGF0ZSh7XG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcbiAgICAgICAgb3V0cHV0UmFuZ2U6IHlWYWx1ZXMsXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsYWJlbFRyYW5zbGF0ZVggPSBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5pbnRlcnBvbGF0ZSh7XG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcbiAgICAgICAgb3V0cHV0UmFuZ2U6IHhWYWx1ZXNMYWJlbCxcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGxhYmVsVHJhbnNsYXRlWSA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxuICAgICAgICBvdXRwdXRSYW5nZTogeVZhbHVlc0xhYmVsLFxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXG4gICAgICB9KTtcblxuICAgICAgb3V0cHV0LnB1c2goW1xuICAgICAgICA8QW5pbWF0ZWQuVmlld1xuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICBzdHlsZT17W1xuICAgICAgICAgICAgc2Nyb2xsYWJsZUluZm9WaWV3U3R5bGUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xuICAgICAgICAgICAgICAgIHsgdHJhbnNsYXRlWDogbGFiZWxUcmFuc2xhdGVYIH0sXG4gICAgICAgICAgICAgICAgeyB0cmFuc2xhdGVZOiBsYWJlbFRyYW5zbGF0ZVkgfVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB3aWR0aDogc2Nyb2xsYWJsZUluZm9TaXplLndpZHRoLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNjcm9sbGFibGVJbmZvU2l6ZS5oZWlnaHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdfVxuICAgICAgICA+XG4gICAgICAgICAgPFRleHRJbnB1dFxuICAgICAgICAgICAgb25MYXlvdXQ9eygpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRhdGFbMF0uZGF0YVtkYXRhWzBdLmRhdGEubGVuZ3RoIC0gMV0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzdHlsZT17c2Nyb2xsYWJsZUluZm9UZXh0U3R5bGV9XG4gICAgICAgICAgICByZWY9e3RoaXMubGFiZWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9BbmltYXRlZC5WaWV3PixcbiAgICAgICAgPEFuaW1hdGVkQ2lyY2xlXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIGN4PXt0cmFuc2xhdGVYfVxuICAgICAgICAgIGN5PXt0cmFuc2xhdGVZfVxuICAgICAgICAgIHI9e3Njcm9sbGFibGVEb3RSYWRpdXN9XG4gICAgICAgICAgc3Ryb2tlPXtzY3JvbGxhYmxlRG90U3Ryb2tlQ29sb3J9XG4gICAgICAgICAgc3Ryb2tlV2lkdGg9e3Njcm9sbGFibGVEb3RTdHJva2VXaWR0aH1cbiAgICAgICAgICBmaWxsPXtzY3JvbGxhYmxlRG90RmlsbH1cbiAgICAgICAgLz5cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICByZW5kZXJTaGFkb3cgPSAoe1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBkYXRhLFxuICAgIHVzZUNvbG9yRnJvbURhdGFzZXRcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxuICA+ICYge1xuICAgIHVzZUNvbG9yRnJvbURhdGFzZXQ6IEFic3RyYWN0Q2hhcnRDb25maWdbXCJ1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XCJdO1xuICB9KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuYmV6aWVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJCZXppZXJTaGFkb3coe1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHVzZUNvbG9yRnJvbURhdGFzZXRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIHJldHVybiBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxQb2x5Z29uXG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICBwb2ludHM9e1xuICAgICAgICAgICAgZGF0YXNldC5kYXRhXG4gICAgICAgICAgICAgIC5tYXAoKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID1cbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodCArXG4gICAgICAgICAgICAgICAgICAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YXNldC5kYXRhLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHkgPVxuICAgICAgICAgICAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KGQsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuam9pbihcIiBcIikgK1xuICAgICAgICAgICAgYCAke3BhZGRpbmdSaWdodCArXG4gICAgICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gZGF0YXNldC5kYXRhLmxlbmd0aCkgKlxuICAgICAgICAgICAgICAgIChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMSl9LCR7KGhlaWdodCAvIDQpICogMyArXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3B9ICR7cGFkZGluZ1JpZ2h0fSwkeyhoZWlnaHQgLyA0KSAqIDMgKyBwYWRkaW5nVG9wfWBcbiAgICAgICAgICB9XG4gICAgICAgICAgZmlsbD17YHVybCgjZmlsbFNoYWRvd0dyYWRpZW50JHtcbiAgICAgICAgICAgIHVzZUNvbG9yRnJvbURhdGFzZXQgPyBgXyR7aW5kZXh9YCA6IFwiXCJcbiAgICAgICAgICB9KWB9XG4gICAgICAgICAgc3Ryb2tlV2lkdGg9ezB9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlckxpbmUgPSAoe1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBkYXRhLFxuICAgIGxpbmVqb2luVHlwZVxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJsaW5lam9pblR5cGVcIlxuICA+KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuYmV6aWVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJCZXppZXJMaW5lKHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgICBwYWRkaW5nVG9wXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XG5cbiAgICBsZXQgbGFzdFBvaW50OiBzdHJpbmc7XG5cbiAgICBjb25zdCB0b1BvaW50cyA9IChkYXRhc2V0OiBEYXRhc2V0LCBsaW5lczoge2RhdGE6IG51bWJlcnxudWxsLCBpbmRleDpudW1iZXJ9W11bXSApID0+IHtcbiAgICAgIHJldHVybiBsaW5lcy5tYXAobGluZSA9PiBsaW5lLm1hcCggKHtkYXRhLCBpbmRleH0pID0+IHtcbiAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHJldHVybiBsYXN0UG9pbnQ7XG4gICAgICAgIGNvbnN0IHggPVxuICAgICAgICAgIChpbmRleCAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YXNldC5kYXRhLmxlbmd0aCArIHBhZGRpbmdSaWdodDtcbiAgICAgICAgY29uc3QgeSA9XG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KGRhdGEsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXG4gICAgICAgICAgcGFkZGluZ1RvcDtcbiAgICAgICAgbGFzdFBvaW50ID0gYCR7eH0sJHt5fWA7XG4gICAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICAgIH0pKVxuICAgIH07XG5cbiAgICBjb25zdCBza2lwcGVkID0gdGhpcy5wcm9wcy5kYXRhU2tpcHBlZFNlZ21lbnRzO1xuXG4gICAgZGF0YS5mb3JFYWNoKChkYXRhc2V0LCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgbGVuZ3RoID0gZGF0YXNldC5kYXRhLmxlbmd0aDtcblxuICAgICAgdmFyIGxpbmVzOiBzdHJpbmdbXVtdID0gW107XG4gICAgICBcbiAgICAgIGlmKCEhc2tpcHBlZCAmJiBza2lwcGVkLmxlbmd0aCA+IDAgJiYgc2tpcHBlZC5sZW5ndGggPj0gbGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50X2xpbmU6IHtkYXRhOiBudW1iZXIsIGluZGV4OiBudW1iZXJ9W10gPSBbXTtcbiAgICAgICAgdmFyIHRlbXA6IHtkYXRhOiBudW1iZXIsIGluZGV4OiBudW1iZXJ9W11bXSA9IFtdO1xuXG4gICAgICAgIGRhdGFzZXQuZGF0YS5tYXAoKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoISFza2lwcGVkW2luZGV4XSkge1xuICAgICAgICAgICAgaWYoY3VycmVudF9saW5lICYmIGN1cnJlbnRfbGluZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHRlbXAucHVzaChjdXJyZW50X2xpbmUpO1xuICAgICAgICAgICAgICBjdXJyZW50X2xpbmUgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudF9saW5lLnB1c2goe2RhdGEsIGluZGV4fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYoY3VycmVudF9saW5lLmxlbmd0aCA+IDApIHRlbXAucHVzaChjdXJyZW50X2xpbmUpO1xuXG4gICAgICAgIGxpbmVzID0gdG9Qb2ludHMoZGF0YXNldCwgdGVtcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0ZW1wID0gW2RhdGFzZXQuZGF0YS5tYXAoKGRhdGEsIGluZGV4KSA9PiAoe2RhdGEsIGluZGV4fSkgKV07XG4gICAgICAgIGxpbmVzID0gdG9Qb2ludHMoZGF0YXNldCwgdGVtcCk7XG4gICAgICB9XG5cbiAgICAgIGxpbmVzLmZvckVhY2gocG9pbnRzID0+IHtcbiAgICAgICAgb3V0cHV0LnB1c2goXG4gICAgICAgICAgPFBvbHlsaW5lXG4gICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49e2xpbmVqb2luVHlwZX1cbiAgICAgICAgICAgIHBvaW50cz17cG9pbnRzLmpvaW4oXCIgXCIpfVxuICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgc3Ryb2tlPXt0aGlzLmdldENvbG9yKGRhdGFzZXQsIDAuMil9XG4gICAgICAgICAgICBzdHJva2VXaWR0aD17dGhpcy5nZXRTdHJva2VXaWR0aChkYXRhc2V0KX1cbiAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT17ZGF0YXNldC5zdHJva2VEYXNoQXJyYXl9XG4gICAgICAgICAgICBzdHJva2VEYXNob2Zmc2V0PXtkYXRhc2V0LnN0cm9rZURhc2hPZmZzZXR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIGdldEJlemllckxpbmVQb2ludHMgPSAoXG4gICAgZGF0YXNldDogRGF0YXNldCxcbiAgICB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgIHBhZGRpbmdUb3AsXG4gICAgICBkYXRhXG4gICAgfTogUGljazxcbiAgICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgICBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJkYXRhXCJcbiAgICA+XG4gICkgPT4ge1xuICAgIGlmIChkYXRhc2V0LmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJNMCwwXCI7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuXG4gICAgY29uc3QgeCA9IChpOiBudW1iZXIpID0+XG4gICAgICBNYXRoLmZsb29yKFxuICAgICAgICBwYWRkaW5nUmlnaHQgKyAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YXNldC5kYXRhLmxlbmd0aFxuICAgICAgKTtcblxuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgeSA9IChpOiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IHlIZWlnaHQgPSB0aGlzLmNhbGNIZWlnaHQoZGF0YXNldC5kYXRhW2ldLCBkYXRhcywgaGVpZ2h0KTtcblxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKChiYXNlSGVpZ2h0IC0geUhlaWdodCkgLyA0KSAqIDMgKyBwYWRkaW5nVG9wKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFtgTSR7eCgwKX0sJHt5KDApfWBdXG4gICAgICAuY29uY2F0KFxuICAgICAgICBkYXRhc2V0LmRhdGEuc2xpY2UoMCwgLTEpLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHhfbWlkID0gKHgoaSkgKyB4KGkgKyAxKSkgLyAyO1xuICAgICAgICAgIGNvbnN0IHlfbWlkID0gKHkoaSkgKyB5KGkgKyAxKSkgLyAyO1xuICAgICAgICAgIGNvbnN0IGNwX3gxID0gKHhfbWlkICsgeChpKSkgLyAyO1xuICAgICAgICAgIGNvbnN0IGNwX3gyID0gKHhfbWlkICsgeChpICsgMSkpIC8gMjtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgYFEgJHtjcF94MX0sICR7eShpKX0sICR7eF9taWR9LCAke3lfbWlkfWAgK1xuICAgICAgICAgICAgYCBRICR7Y3BfeDJ9LCAke3koaSArIDEpfSwgJHt4KGkgKyAxKX0sICR7eShpICsgMSl9YFxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuam9pbihcIiBcIik7XG4gIH07XG5cbiAgcmVuZGVyQmV6aWVyTGluZSA9ICh7XG4gICAgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHBhZGRpbmdUb3BcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxuICA+KSA9PiB7XG4gICAgcmV0dXJuIGRhdGEubWFwKChkYXRhc2V0LCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXRCZXppZXJMaW5lUG9pbnRzKGRhdGFzZXQsIHtcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgICBwYWRkaW5nVG9wLFxuICAgICAgICBkYXRhXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFBhdGhcbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIGQ9e3Jlc3VsdH1cbiAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgc3Ryb2tlPXt0aGlzLmdldENvbG9yKGRhdGFzZXQsIDAuMil9XG4gICAgICAgICAgc3Ryb2tlV2lkdGg9e3RoaXMuZ2V0U3Ryb2tlV2lkdGgoZGF0YXNldCl9XG4gICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtkYXRhc2V0LnN0cm9rZURhc2hBcnJheX1cbiAgICAgICAgICBzdHJva2VEYXNob2Zmc2V0PXtkYXRhc2V0LnN0cm9rZURhc2hPZmZzZXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlckJlemllclNoYWRvdyA9ICh7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIGRhdGEsXG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldFxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4gJiB7XG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldDogQWJzdHJhY3RDaGFydENvbmZpZ1tcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIl07XG4gIH0pID0+XG4gICAgZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBkID1cbiAgICAgICAgdGhpcy5nZXRCZXppZXJMaW5lUG9pbnRzKGRhdGFzZXQsIHtcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgZGF0YVxuICAgICAgICB9KSArXG4gICAgICAgIGAgTCR7cGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIGRhdGFzZXQuZGF0YS5sZW5ndGgpICpcbiAgICAgICAgICAgIChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMSl9LCR7KGhlaWdodCAvIDQpICogMyArXG4gICAgICAgICAgcGFkZGluZ1RvcH0gTCR7cGFkZGluZ1JpZ2h0fSwkeyhoZWlnaHQgLyA0KSAqIDMgKyBwYWRkaW5nVG9wfSBaYDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFBhdGhcbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIGQ9e2R9XG4gICAgICAgICAgZmlsbD17YHVybCgjZmlsbFNoYWRvd0dyYWRpZW50JHtcbiAgICAgICAgICAgIHVzZUNvbG9yRnJvbURhdGFzZXQgPyBgXyR7aW5kZXh9YCA6IFwiXCJcbiAgICAgICAgICB9KWB9XG4gICAgICAgICAgc3Ryb2tlV2lkdGg9ezB9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuXG4gIHJlbmRlckxlZ2VuZCA9ICh3aWR0aCwgbGVnZW5kT2Zmc2V0KSA9PiB7XG4gICAgY29uc3QgeyBsZWdlbmQsIGRhdGFzZXRzIH0gPSB0aGlzLnByb3BzLmRhdGE7XG4gICAgY29uc3QgYmFzZUxlZ2VuZEl0ZW1YID0gd2lkdGggLyAobGVnZW5kLmxlbmd0aCArIDEpO1xuXG4gICAgcmV0dXJuIGxlZ2VuZC5tYXAoKGxlZ2VuZEl0ZW0sIGkpID0+IChcbiAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XG4gICAgICAgIDxMZWdlbmRJdGVtXG4gICAgICAgICAgaW5kZXg9e2l9XG4gICAgICAgICAgaWNvbkNvbG9yPXt0aGlzLmdldENvbG9yKGRhdGFzZXRzW2ldLCAwLjkpfVxuICAgICAgICAgIGJhc2VMZWdlbmRJdGVtWD17YmFzZUxlZ2VuZEl0ZW1YfVxuICAgICAgICAgIGxlZ2VuZFRleHQ9e2xlZ2VuZEl0ZW19XG4gICAgICAgICAgbGFiZWxQcm9wcz17eyAuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCkgfX1cbiAgICAgICAgICBsZWdlbmRPZmZzZXQ9e2xlZ2VuZE9mZnNldH1cbiAgICAgICAgLz5cbiAgICAgIDwvRz5cbiAgICApKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBkYXRhLFxuICAgICAgd2l0aFNjcm9sbGFibGVEb3QgPSBmYWxzZSxcbiAgICAgIHdpdGhTaGFkb3cgPSB0cnVlLFxuICAgICAgd2l0aERvdHMgPSB0cnVlLFxuICAgICAgd2l0aElubmVyTGluZXMgPSB0cnVlLFxuICAgICAgd2l0aE91dGVyTGluZXMgPSB0cnVlLFxuICAgICAgd2l0aEhvcml6b250YWxMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoVmVydGljYWxMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoSG9yaXpvbnRhbExhYmVscyA9IHRydWUsXG4gICAgICB3aXRoVmVydGljYWxMYWJlbHMgPSB0cnVlLFxuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGRlY29yYXRvcixcbiAgICAgIG9uRGF0YVBvaW50Q2xpY2ssXG4gICAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24gPSAwLFxuICAgICAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24gPSAwLFxuICAgICAgZm9ybWF0WUxhYmVsID0geUxhYmVsID0+IHlMYWJlbCxcbiAgICAgIGZvcm1hdFhMYWJlbCA9IHhMYWJlbCA9PiB4TGFiZWwsXG4gICAgICBzZWdtZW50cyxcbiAgICAgIHRyYW5zcGFyZW50ID0gZmFsc2UsXG4gICAgICBjaGFydENvbmZpZ1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgeyBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IGxhYmVscyA9IFtdIH0gPSBkYXRhO1xuICAgIGNvbnN0IHtcbiAgICAgIGJvcmRlclJhZGl1cyA9IDAsXG4gICAgICBwYWRkaW5nVG9wID0gMTYsXG4gICAgICBwYWRkaW5nUmlnaHQgPSA2NCxcbiAgICAgIG1hcmdpbiA9IDAsXG4gICAgICBtYXJnaW5SaWdodCA9IDAsXG4gICAgICBwYWRkaW5nQm90dG9tID0gMFxuICAgIH0gPSBzdHlsZTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgdmVydGljYWxMYWJlbFJvdGF0aW9uLFxuICAgICAgaG9yaXpvbnRhbExhYmVsUm90YXRpb25cbiAgICB9O1xuXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEuZGF0YXNldHMpO1xuXG4gICAgbGV0IGNvdW50ID0gTWF0aC5taW4oLi4uZGF0YXMpID09PSBNYXRoLm1heCguLi5kYXRhcykgPyAxIDogNDtcbiAgICBpZiAoc2VnbWVudHMpIHtcbiAgICAgIGNvdW50ID0gc2VnbWVudHM7XG4gICAgfVxuXG4gICAgY29uc3QgbGVnZW5kT2Zmc2V0ID0gdGhpcy5wcm9wcy5kYXRhLmxlZ2VuZCA/IGhlaWdodCAqIDAuMTUgOiAwO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgIDxTdmdcbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodCArIChwYWRkaW5nQm90dG9tIGFzIG51bWJlcikgKyBsZWdlbmRPZmZzZXR9XG4gICAgICAgICAgd2lkdGg9e3dpZHRoIC0gKG1hcmdpbiBhcyBudW1iZXIpICogMiAtIChtYXJnaW5SaWdodCBhcyBudW1iZXIpfVxuICAgICAgICA+XG4gICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodCArIGxlZ2VuZE9mZnNldH1cbiAgICAgICAgICAgIHJ4PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICByeT17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgZmlsbD1cInVybCgjYmFja2dyb3VuZEdyYWRpZW50KVwiXG4gICAgICAgICAgICBmaWxsT3BhY2l0eT17dHJhbnNwYXJlbnQgPyAwIDogMX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmRhdGEubGVnZW5kICYmXG4gICAgICAgICAgICB0aGlzLnJlbmRlckxlZ2VuZChjb25maWcud2lkdGgsIGxlZ2VuZE9mZnNldCl9XG4gICAgICAgICAgPEcgeD1cIjBcIiB5PXtsZWdlbmRPZmZzZXR9PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRGVmcyh7XG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgLi4uY2hhcnRDb25maWcsXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoSG9yaXpvbnRhbExpbmVzICYmXG4gICAgICAgICAgICAgICAgKHdpdGhJbm5lckxpbmVzXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVySG9yaXpvbnRhbExpbmVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IHdpdGhPdXRlckxpbmVzXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVySG9yaXpvbnRhbExpbmUoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgOiBudWxsKX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7d2l0aEhvcml6b250YWxMYWJlbHMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckhvcml6b250YWxMYWJlbHMoe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YXMsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIGZvcm1hdFlMYWJlbCxcbiAgICAgICAgICAgICAgICAgIGRlY2ltYWxQbGFjZXM6IGNoYXJ0Q29uZmlnLmRlY2ltYWxQbGFjZXNcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7d2l0aFZlcnRpY2FsTGluZXMgJiZcbiAgICAgICAgICAgICAgICAod2l0aElubmVyTGluZXNcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJWZXJ0aWNhbExpbmVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1swXS5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlclxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgOiB3aXRoT3V0ZXJMaW5lc1xuICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlclZlcnRpY2FsTGluZSh7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlclxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgOiBudWxsKX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7d2l0aFZlcnRpY2FsTGFiZWxzICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJWZXJ0aWNhbExhYmVscyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBsYWJlbHMsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIGZvcm1hdFhMYWJlbFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckxpbmUoe1xuICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAuLi5jaGFydENvbmZpZyxcbiAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1xuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7d2l0aFNoYWRvdyAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyU2hhZG93KHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHMsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHVzZUNvbG9yRnJvbURhdGFzZXQ6IGNoYXJ0Q29uZmlnLnVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7d2l0aERvdHMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckRvdHMoe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgb25EYXRhUG9pbnRDbGlja1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoU2Nyb2xsYWJsZURvdCAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyU2Nyb2xsYWJsZURvdCh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICAuLi5jaGFydENvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHMsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIG9uRGF0YVBvaW50Q2xpY2ssXG4gICAgICAgICAgICAgICAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHtkZWNvcmF0b3IgJiZcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3Ioe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8L0c+XG4gICAgICAgIDwvU3ZnPlxuICAgICAgICB7d2l0aFNjcm9sbGFibGVEb3QgJiYgKFxuICAgICAgICAgIDxTY3JvbGxWaWV3XG4gICAgICAgICAgICBzdHlsZT17U3R5bGVTaGVldC5hYnNvbHV0ZUZpbGx9XG4gICAgICAgICAgICBjb250ZW50Q29udGFpbmVyU3R5bGU9e3sgd2lkdGg6IHdpZHRoICogMiB9fVxuICAgICAgICAgICAgc2hvd3NIb3Jpem9udGFsU2Nyb2xsSW5kaWNhdG9yPXtmYWxzZX1cbiAgICAgICAgICAgIHNjcm9sbEV2ZW50VGhyb3R0bGU9ezE2fVxuICAgICAgICAgICAgb25TY3JvbGw9e0FuaW1hdGVkLmV2ZW50KFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hdGl2ZUV2ZW50OiB7XG4gICAgICAgICAgICAgICAgICBjb250ZW50T2Zmc2V0OiB7IHg6IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0pfVxuICAgICAgICAgICAgaG9yaXpvbnRhbFxuICAgICAgICAgICAgYm91bmNlcz17ZmFsc2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpbmVDaGFydDtcbiJdfQ==
