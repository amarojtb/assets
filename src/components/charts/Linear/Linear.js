import { extent } from 'd3-array';
import { axisBottom, axisLeft, axisRight } from 'd3-axis';
import { formatDefaultLocale } from 'd3-format';
import { scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { mouse, select } from 'd3-selection';
import { line } from 'd3-shape';
import { timeMinute } from 'd3-time';
import { timeFormat, timeFormatDefaultLocale, utcParse } from 'd3-time-format';
import { transition } from 'd3-transition';
import { FormatNumber, ACCOUNT } from 'services/AppUtils';
import Chart from 'services/Chart';
import parameters from 'constants/parameters';
import { findClosestDate, getDateInterval } from 'services/WidgetUtils';
import './Linear.css';

const DEFAULTS = {
  duration: 1000,
  other: null,
};
const { LEGEND_INTERVALS } = parameters;
const MARGIN = {
  bottom: 30,
  left: 60,
  right: 30,
  top: 10,
};

const GOOGLE_COLORS = ['#3cba54', '#f4c20d', '#db3236', '#4885ed'];

/**
 * Class Linear.
 * @class Linear
 * @extends {Chart}
 */
class Linear extends Chart {
  
  setData(dataset) {
    const { xAxis, rightYAxis } = this.props;
    const xAxisParsed = xAxis.categories.map(e =>
      utcParse('%d/%m/%Y %H:%M:%S')(e)
    );
    const items = item =>
      item.value.map((e, i) => ({
        date: xAxisParsed[i],
        key: item.key,
        label: item.label,
        value: Number(e),
        x: i,
      }));

    this.data = dataset
      .map(e => ({
        key: e.key,
        values: items(e),
      }))
      .sort((a, b) => b.value - a.value);

    if (Array.isArray(rightYAxis)) {
      const values = [];
      rightYAxis.forEach(ga => values.push(...ga.counts));
      this.rightYAxisMax = Math.max(...values);
      this.googleAnalyticsData = rightYAxis.map((rya, j) => ({
        key: rya.key,
        label: rya.name,
        color: GOOGLE_COLORS[j],
        values: xAxisParsed.map((xa, i) => ({
          date: xa,
          key: rya.key,
          label: rya.name,
          value: rya.counts[i],
          x: i,
        })),
      }));
    }

    this.setState({
      xAxis: xAxisParsed,
    });
  }

  /**
   * PUBLIC METHODS
   */

  update() {
    const { series } = this.props;

    this.setData(series);
    this.change();
  }

  toggle(key, isChecked = false) {
    this.activeItems = isChecked
      ? [...this.activeItems, key]
      : this.activeItems.filter(keyItem => keyItem !== key);
  }

  toggleSome(keys, isChecked = false) {
    this.activeItems = isChecked
      ? [...keys]
      : this.activeItems.filter(keyItem => !keys.includes(keyItem));
  }

  toggleAll(isChecked = false) {
    const { series } = this.props;

    this.activeItems = isChecked ? series.map(serieItem => serieItem.key) : [];
  }

  /**
   * PRIVATE METHODS
   */

  change(first) {
    const { onResize, options: { duration }, rightYAxis } = this.props;
    const svg = select(this.element).select('svg');
    const t = transition().duration(duration);
    const maxValue = this.getMaxValue();
    let maxY2Value = 0;

    if (rightYAxis) {
      maxY2Value = this.rightYAxisMax;
    }
    const lines = svg
      .select('.linear__lines')
      .selectAll('.linear__line')
      .data(
        this.data.filter(item => this.activeItems.includes(item.key)),
        d => d.key
      );

    const ga_lines = svg
      .select('.linear__lines')
      .selectAll('.linear__line_ga')
      .data(this.googleAnalyticsData, d => d.key);

    this.data.forEach(e => {
      this.xScale.domain(extent(e.values, d => d.date));
      this.transitionScale.domain(extent(e.values, d => d.x));
    });

    this.onResize = onResize;

    this.yScale.domain([0, maxValue]);
    if (rightYAxis) {
      this.y2Scale.domain([0, maxY2Value]);
    }

    svg.select('.linear__axis-label--y').text(() => {
      const { yAxis } = this.props;
      const indicator = window.Messages[`Global.${yAxis.title.indicator}`];
      const suffix = new FormatNumber(maxValue).suffix();

      return suffix ? `${indicator} (${suffix})` : indicator;
    });

    /* y2 axis label */
    if (rightYAxis) {
      svg.select('.linear__axis-label--y2').text(() => {
        const indicator = window.Messages[`Global.SessionDate`];
        const suffix = new FormatNumber(this.rightYAxisMax).suffix();

        return suffix ? `${indicator} (${suffix})` : indicator;
      });
    }

    lines
      .exit()
      .attr('opacity', 1)
      .transition(t)
      .attr('d', d =>
        this.valueline(
          d.values.map(value => Object.assign({}, value, { value: 0 }))
        )
      )
      .attr('opacity', 0)
      .remove();

    if (rightYAxis) {
      ga_lines
        .exit()
        .attr('opacity', 1)
        .transition(t)
        .attr('d', d =>
          this.valueline(
            d.values.map(value => Object.assign({}, value, { value: 0 })),
            true
          )
        )
        .attr('opacity', 0)
        .remove();
    }

    function handleStart() {
      this.removeAttribute('opacity');
    }

    lines
      .transition(t)
      .attr('d', d => this.valueline(d.values))
      .on('start', handleStart);

    if (rightYAxis) {
      ga_lines
        .transition(t)
        .attr('d', d => this.valueline(d.values, true))
        .on('start', handleStart);
    }

    lines
      .enter()
      .append('path')
      .classed('linear__line', true)
      .style('stroke', d => this.getColor(d.key))
      .transition(t)
      .attrTween('d', d => this.pathTween(d));

    if (rightYAxis) {
      ga_lines
        .enter()
        .append('path')
        .classed('linear__line_ga', true)
        .style('stroke', d => d.color)
        .attr('stroke-dasharray', '3.5')
        .transition(t)
        .attrTween('d', d => this.pathTween(d, true));
    }

    this.updateXAxisLegend();
    this.renderCircles();

    if (first) {
      this.renderTooltip();
    } else {
      this.updateXAxis();
      this.updateYAxis();
      this.updateGrid();
      this.updateTooltip();
    }
    setTimeout(() => {
      if (document.body.contains(this.element)) {
        this.resize();
      }
    }, duration);
  }

  getMax() {
    const activeItems = this.data.filter(item =>
      this.activeItems.includes(item.key)
    );

    return (
      activeItems.length > 0 &&
      activeItems.reduce((p, c) => {
        const maxPrevValue = Math.max(...p.values.map(d => d.value));
        const maxCurrentValue = Math.max(...c.values.map(d => d.value));

        return maxPrevValue > maxCurrentValue ? p : c;
      })
    );
  }

  getMaxValue() {
    const maxItem = this.getMax();

    return maxItem ? Math.max(...maxItem.values.map(d => d.value)) : 0;
  }

  init() {
    const { series } = this.props;
    const d3Translations = JSON.parse(window.Messages['Global.D3']);
    const keys = series && series.map(serieItem => serieItem.key);
    const chartColors = [];
    keys.forEach(colorKey => {
      if (
        keys.includes(colorKey) &&
        parameters.NATO_CHART_SENTIMENT_COLORS_BAR[colorKey]
      ) {
        chartColors.push(parameters.NATO_CHART_SENTIMENT_COLORS_BAR[colorKey]);
      }
    });

    this.props.options = Object.assign(DEFAULTS, this.props.options);
    this.activeItems = series.map(serieItem => serieItem.key);

    this.setData(series);
    if (
      this.widgetInfo &&
      chartColors.length > 0 &&
      ACCOUNT.isNato() &&
      this.widgetInfo.segment1OnField === 'customerMetrics.string_sentiment'
    ) {
      this.colors = scaleOrdinal().range(chartColors);
    } else {
      this.colors = scaleOrdinal(parameters.CHART_COLORS);
    }
    // this.colors = scaleOrdinal(parameters.CHART_COLORS);
    formatDefaultLocale(d3Translations);
    timeFormatDefaultLocale(d3Translations);
  }

  pathTween({ values }, googleAnalytics = false) {
    const interpolate = scaleLinear()
      .domain([0, 1])
      .range([1, values.length + 1]);

    return t => {
      const flooredX = Math.floor(interpolate(t));
      const interpolatedLine = values.slice(0, flooredX);

      if (flooredX > 0 && flooredX < values.length) {
        const weight = interpolate(t) - flooredX;
        const weightedLineAverage =
          values[flooredX].value * weight +
          values[flooredX - 1].value * (1 - weight);

        interpolatedLine.push({
          value: weightedLineAverage,
          x: interpolate(t) - 1,
        });
      }

      return this.valueline(interpolatedLine, googleAnalytics);
    };
  }

  render() {
    const { rightYAxis } = this.props;
    const svg = select(this.element)
      .append('svg')
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    this.xScale = scaleTime();
    this.transitionScale = scaleTime();
    this.yScale = scaleLinear();
    this.y2Scale = scaleLinear();

    this.xAxis = axisBottom(this.xScale).tickFormat(timeFormat('%d %b'));

    this.yAxis = axisLeft(this.yScale)
      .tickFormat(
        this.getMaxValue() / 5 >= 1
          ? d =>
              new FormatNumber(d).convert(
                new FormatNumber(this.getMaxValue()).divider()
              )[0]
          : null
      )
      .ticks(5);

    if (rightYAxis) {
      /* here is the right y axis */
      this.y2Axis = axisRight(this.y2Scale)
        .tickFormat(
          this.rightYAxisMax / 5 >= 1
            ? d =>
                new FormatNumber(d).convert(
                  new FormatNumber(this.rightYAxisMax).divider()
                )[0]
            : null
        )
        .ticks(5);
    }

    svg.append('g').classed('linear__grid', true);

    svg.append('rect').classed('linear__overlay', true);

    svg.append('g').classed('linear__axis linear__axis--x', true);

    svg.append('g').classed('linear__axis linear__axis--y', true);

    if (rightYAxis) {
      svg.append('g').classed('linear__axis linear__axis--y2', true);
    }

    svg
      .append('text')
      .classed('linear__axis-label--y', true)
      .style('text-anchor', 'middle');

    if (rightYAxis) {
      svg
        .append('text')
        .classed('linear__axis-label--y2', true)
        .style('text-anchor', 'middle');
    }

    svg.append('g').classed('linear__lines', true);

    svg.append('g').classed('linear__circles', true);

    this.change(true);
    this.resizing();
  }

  renderCircles() {
    const svg = select(this.element).select('svg');
    if (!this.googleAnalyticsData) {
      this.googleAnalyticsData = [];
    }
    const circlesData = [
      ...this.data.filter(item => this.activeItems.includes(item.key)),
      ...this.googleAnalyticsData,
    ].filter(e => e);
    svg
      .select('.linear__circles')
      .selectAll('.linear__circle')
      .remove();
    const selection = svg
      .select('.linear__circles')
      .selectAll('.linear__circle')
      .data(circlesData, d => d.key);
    const circles = selection.enter().append('g');

    circles
      .merge(selection)
      .attr('opacity', 0)
      .classed('linear__circle', true);

    circles
      .append('circle')
      .attr('fill', d => this.getColor(d.key))
      .attr('r', 7);

    circles
      .append('circle')
      .attr('fill', '#fff')
      .attr('r', 5);

    circles
      .append('circle')
      .attr('fill', d => this.getColor(d.key))
      .attr('r', 4);

    circles.each((d, i, n) => {
      if (d.key.includes('SessionDate')) {
        n[i].classList.add('linear__circle_ga');

        const circs = select(n[i]).selectAll('circle');
        if (circs) {
          circs.each((dd, ii, e) => {
            (ii === 0 || ii === 2) && select(e[ii]).style('fill', d.color);
          });
        }
      }
    });

    selection.exit().remove();
  }

  renderTooltip() {
    const self = this;
    const { xAxis } = this.state;
    const { rightYAxis } = this.props;
    const svg = select(this.element).select('svg');
    const tooltip = select(this.element)
      .append('div')
      .attr('class', 'linear-tooltip')
      .style('transition', 'opacity .1s linear')
      .style('z-index', '-1')
      .style('opacity', '0');

    tooltip.append('header').classed('linear-tooltip__header', true);

    const body = tooltip.append('div').classed('linear-tooltip__body', true);
    const list = body.append('ul').classed('linear-tooltip__list', true);
    const items = list
      .selectAll('li')
      .data(
        [
          ...this.googleAnalyticsData,
          ...this.data
            .filter(item => this.activeItems.includes(item.key))
            .slice(0, 10),
        ].filter(e => e),
        d => d.key
      )
      .enter()
      .append('li')
      .classed('linear-tooltip__item', true);

    items.append('span').classed('linear-tooltip__color', true);
    items.append('span').classed('linear-tooltip__label', true);
    items.append('span').classed('linear-tooltip__value', true);

    function handleMouseMove() {
      const width = Number(this.getAttribute('width'));
      const mouseX = mouse(this)[0];
      const selectedDate = self.xScale.invert(mouseX);
      const dateInterval = getDateInterval(xAxis, selectedDate, 'timeHour');
      const date = findClosestDate(xAxis.map(e => e), selectedDate);

      const values = [
        ...self.googleAnalyticsData,
        ...self.data.filter(item => self.activeItems.includes(item.key)),
      ]
        .filter(e => e)
        .map(element => ({
          ...element.values.find(e => e.date.getTime() === date.getTime()),
          color: element.color,
        }))
        .filter(e => e);

      tooltip.select('.linear-tooltip__header').text(dateInterval);

      tooltip
        .selectAll('.linear-tooltip__color')
        .data(values)
        .style('background-color', d => {
          if (d.key && d.key.includes('SessionDate')) {
            return d.color;
          }
          return self.getColor(d.key);
        });

      tooltip
        .selectAll('.linear-tooltip__label')
        .data(values)
        .text(d => d.label);

      tooltip
        .selectAll('.linear-tooltip__value')
        .data(values)
        .text(d => new FormatNumber(d.value).format());

      tooltip.style('opacity', '1').style('z-index', '2');

      if (mouseX < width / 2) {
        tooltip.style('left', 'auto').style('right', `${MARGIN.right + 30}px`);
      } else {
        tooltip.style('left', `${MARGIN.left + 30}px`).style('right', 'auto');
      }

      svg
        .selectAll('.linear__circle')
        .attr('opacity', 1)
        .attr('transform', d => {
          const item = d.values.find(e => e.date.getTime() === date.getTime());
          const value = item && item.value;

          return (
            item && `translate(${self.xScale(date)}, ${self.yScale(value)})`
          );
        });

      svg
        .selectAll('.linear__circle_ga')
        .attr('opacity', 1)
        .attr('transform', d => {
          const item = d.values.find(e => e.date.getTime() === date.getTime());
          const value = item && item.value;

          return (
            item && `translate(${self.xScale(date)}, ${self.y2Scale(value)})`
          );
        });
    }

    select(this.element)
      .select('.linear__overlay')
      .on('mouseover', () => {
        tooltip.style('opacity', '1').style('z-index', '1');

        svg
          .selectAll('.linear__circle')
          .transition()
          .duration(200)
          .attr('opacity', 1);
      })
      .on('mousemove', handleMouseMove)
      .on('mouseout', () => {
        tooltip.style('opacity', '0').style('z-index', '-1');

        svg
          .selectAll('.linear__circle')
          .transition()
          .duration(200)
          .attr('opacity', 0);
      });
  }

  resize(first) {
    const { widgetHeight, widgetWidth, rightYAxis } = this.props;
    let width;
    let height;

    if (widgetHeight && widgetWidth) {
      width = Number(widgetWidth) - MARGIN.left - MARGIN.right;
      height = Number(widgetHeight) - MARGIN.top - MARGIN.bottom - 65;
    } else {
      width = Math.max(
        0,
        this.element.offsetWidth - MARGIN.left - MARGIN.right
      );
      height = Math.max(
        0,
        this.element.offsetHeight - MARGIN.top - MARGIN.bottom
      );
    }
    const svg = select(this.element).select('svg');

    svg
      .attr('height', height + MARGIN.top + MARGIN.bottom)
      .attr('width', width + MARGIN.left + MARGIN.right);

    this.setState({
      height,
      width,
    });

    svg
      .select('.linear__overlay')
      .attr('height', height)
      .attr('width', rightYAxis ? width - 30 : width);

    this.xScale.range([0, rightYAxis ? width - 30 : width]);
    this.transitionScale.range([0, rightYAxis ? width - 30 : width]);
    this.yScale.range([height, 0]);
    this.y2Scale.range([height, 0]);

    this.updateXAxisLegend();

    svg
      .select('.linear__axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(this.xAxis);

    svg.select('.linear__axis--y').call(this.yAxis);

    if (rightYAxis) {
      svg
        .select('.linear__axis--y2')
        .attr('fill', 'none')
        .attr('transform', `translate( ${width - 30}, 0 )`)
        .call(this.y2Axis);
    }

    const yAxisHeight = svg
      .select('.linear__axis--y')
      .node()
      .getBoundingClientRect().height;

    svg
      .select('.linear__axis-label--y')
      .attr('transform', `translate(-40, ${yAxisHeight / 2}) rotate(-90)`);
    if (rightYAxis) {
      svg
        .select('.linear__axis-label--y2')
        .attr(
          'transform',
          `translate(${width + 20}, ${yAxisHeight / 2}) rotate(-90)`
        );
    }

    this.updateGrid();

    if (!first) {
      svg.selectAll('.linear__line').attr('d', d => this.valueline(d.values));
      svg
        .selectAll('.linear__line_ga')
        .attr('d', d => this.valueline(d.values, true));
    }

    if (typeof this.onResize === 'function') {
      this.onResize(first);
    }
  }

  updateGrid() {
    const { width } = this.state;
    const { rightYAxis } = this.props;
    const self = this;
    const svg = select(this.element).select('svg');

    svg.selectAll('.linear__grid').call(
      axisLeft(self.yScale)
        .ticks(5)
        .tickSize(-(width - ((rightYAxis && 30) || 0)), 0, 0)
        .tickFormat('')
    );
  }

  updateTooltip() {
    const selection = select(this.element)
      .select('.linear-tooltip__list')
      .selectAll('.linear-tooltip__item')
      .data(
        [
          ...this.googleAnalyticsData,
          ...this.data
            .filter(item => this.activeItems.includes(item.key))
            .slice(0, 10),
        ].filter(e => e)
      );

    const item = selection.enter().append('li');

    item.merge(selection).classed('linear-tooltip__item', true);

    item.append('span').classed('linear-tooltip__color', true);

    item.append('span').classed('linear-tooltip__label', true);

    item.append('span').classed('linear-tooltip__value', true);

    selection.exit().remove();
  }

  updateXAxisLegend() {
    const { xAxis } = this.state;
    const tickValues = () => {
      const overlay = select(this.element).select('.linear__overlay');
      const widthOverlay = overlay.attr('width');
      const labelsNumber = Math.max(2, Math.floor(widthOverlay / 100));
      const startDate = xAxis[0];
      const endDate = xAxis[xAxis.length - 1];

      const interval =
        LEGEND_INTERVALS.find(
          e => e.minutes >= timeMinute.count(startDate, endDate) / labelsNumber
        ) || LEGEND_INTERVALS[LEGEND_INTERVALS.length - 1];
      const formats = {
        timeDay: '%a %d',
        timeHour: '%I %p',
        timeMinute: '%I:%M',
        timeMonth: '%d %b',
        timeWeek: '%d %b',
        timeYear: '%Y',
      };

      this.xAxis.tickFormat(timeFormat(formats[interval.method]));
      
      return labelsNumber === 2
        ? [xAxis[0], xAxis[xAxis.length - 1]]
        : xAxis
            .map(
              (e, i) =>
                i % Math.max(1, Math.ceil(xAxis.length / labelsNumber)) === 0 &&
                e
            )
            .filter(e => e);
    };
    this.xAxis.tickValues(xAxis.length > 2 ? tickValues() : xAxis);
  }

  updateXAxis() {
    const { options: { duration } } = this.props;
    const svg = select(this.element).select('svg');
    const t = transition().duration(duration);

    svg
      .select('.linear__axis--x')
      .transition(t)
      .call(this.xAxis);
  }

  updateYAxis() {
    const { options: { duration }, rightYAxis } = this.props;
    const svg = select(this.element).select('svg');
    const t = transition().duration(duration);

    svg
      .select('.linear__axis--y')
      .transition(t)
      .call(this.yAxis);

    if (rightYAxis) {
      svg
        .select('.linear__axis--y2')
        .transition(t)
        .call(this.y2Axis);
    }
  }

  valueline(item, googleAnalytics) {
    return line()
      .x(d => this.transitionScale(d.x))
      .y(d => (googleAnalytics ? this.y2Scale(d.value) : this.yScale(d.value)))(
      item
    );
  }

  getProps() {
    const props = super.getProps();
    if (Array.isArray(this.googleAnalyticsData)) {
      props.googleAnalyticsData = this.googleAnalyticsData;
    }
    return props;
  }
}

export default Linear;
