import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { format, formatDefaultLocale } from 'd3-format';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
import { mouse, select } from 'd3-selection';
import { stack, stackOffsetExpand, stackOffsetNone } from 'd3-shape';
import {
  timeFormat,
  timeFormatDefaultLocale,
  timeParse,
  utcParse,
} from 'd3-time-format';
import { transition } from 'd3-transition';
import parameters from 'constants/parameters';
import {
  excludePropertiesFromObject,
  FormatNumber,
  ACCOUNT,
} from 'services/AppUtils';
import { getDateInterval } from 'services/WidgetUtils';
import Chart from 'services/Chart';
import './VerticalBar.css';

const DEFAULTS = {
  duration: 1000,
  indicator: 'Volume',
};
const MARGIN = {
  bottom: 30,
  left: 60,
  right: 10,
  top: 20,
};

/**
 * Class VerticalBar.
 * @class VerticalBar
 * @extends {Chart}
 */
class VerticalBar extends Chart {

  /**
   * GETTER/SETTER
   */

  get data() {
    const { series, xAxis } = this.props;

    return xAxis.map((xAxisItem, index) =>
      Object.assign(
        {},
        { key: xAxisItem },
        ...series
          .filter(({ key }) => this.activeItems.includes(key))
          .map(({ key, value }) => ({
            [key]: value[index],
          }))
      )
    );
  }

  /**
   * PUBLIC METHODS
   */

  toggle(key, isChecked = false) {
    this.activeItems = isChecked
      ? [...this.activeItems, key]
      : this.activeItems.filter(keyItem => keyItem !== key);
    this.redrawSeries();
    this.renderTooltip();
  }

  toggleAll(isChecked = false) {
    const { series } = this.props;

    this.activeItems = isChecked ? series.map(serieItem => serieItem.key) : [];
    this.redrawSeries(true);
    this.renderTooltip();
  }

  /**
   * PRIVATE METHODS
   */

  animateBars(selection) {
    const { options: { duration } } = this.props;
    const barTopY = d => this.yScale(d[1]);
    const barHeight = d => this.heightScale(d[1] - d[0]);
    const t = transition().duration(duration);

    selection
      .transition(t)
      .attr('y', barTopY)
      .attr('height', barHeight);
  }

  animateTexts(selection) {
    const { options: { duration } } = this.props;
    const barHeight = d =>
      this.yScale(d[0]) + this.heightScale(d[0] - d[1]) / 2;
    const t = transition().duration(duration);

    selection.transition(t).attr('y', barHeight);
  }

  getMaxValue() {
    return max(
      this.data.map(item =>
        Object.keys(item)
          .filter(key => typeof item[key] === 'number')
          .reduce((previous, current) => previous + item[current], 0)
      ),
      total => total
    );
  }

  init() {
    const { options, series } = this.props;
    const keys = series && series.map(serieItem => serieItem.key);
    const d3Translations = JSON.parse(window.Messages['Global.D3']);
    const chartColors = Object.keys(parameters.NATO_CHART_SENTIMENT_COLORS_BAR)
      .map(colorKey => {
        if (keys.includes(colorKey)) {
          return parameters.NATO_CHART_SENTIMENT_COLORS_BAR[colorKey];
        }
        return null;
      })
      .filter(e => e);

    this.activeItems = keys;
    this.props.options = Object.assign(DEFAULTS, options);
    if (
      this.widgetInfo &&
      ACCOUNT.isNato() &&
      this.widgetInfo.indicator === 'volume' &&
      this.widgetInfo.segment1OnField === 'customerMetrics.string_sentiment'
    ) {
      this.colors = scaleOrdinal()
        .domain(keys)
        .range(chartColors);
    } else {
      this.colors = scaleOrdinal(parameters.CHART_COLORS).domain(keys);
    }
    formatDefaultLocale(d3Translations);
    timeFormatDefaultLocale(d3Translations);
  }

  redrawSeries(all = false) {
    const { widgetformat } = this.widgetInfo;
    const { options: { duration } } = this.props;
    const barBaseY = d => (all ? this.yScale(0) : this.yScale(d[0]));
    const maxStackY = this.getMaxValue();
    const t = transition().duration(duration);
    const self = this;

    function calculatePercentage(d) {
      let percent = 0;
      const tot = self.data.find(t => t.key === d.data.key);

      if (tot && !tot.total) {
        const obj = excludePropertiesFromObject(tot, ['key']);
        tot.total = Object.values(obj).reduce((a, b) => a + b);
      }
      if (widgetformat === 'Percentage') {
        percent = (d[1] - d[0]) * 100;
      } else {
        percent = (d[1] - d[0]) * 100 / tot.total;
      }

      if (!isNaN(percent) && percent > 0) {
        return `${Math.round(percent)}%`;
      }
      return null;
    }

    if (widgetformat !== 'Percentage') {
      this.heightScale.domain([0, maxStackY]);
      this.yScale.domain([0, maxStackY]);
    }

    this.layers = this.layers.data(
      stack()
        .keys(this.activeItems)
        .offset(
          (widgetformat === 'Percentage' && stackOffsetExpand) ||
            stackOffsetNone
        )(this.data),
      d => d.key
    );

    if (this.textLayers) {
      this.textLayers = this.textLayers.data(
        stack()
          .keys(this.activeItems)
          .offset(
            (widgetformat === 'Percentage' && stackOffsetExpand) ||
              stackOffsetNone
          )(this.data),
        d => d.key
      );

      this.textLayers
        .exit()
        .selectAll('text')
        .transition(t)
        .attr('y', 0)
        .remove();

      this.textLayers
        .exit()
        .transition(t)
        .remove();
    }

    this.layers
      .exit()
      .selectAll('rect')
      .transition(t)
      .attr('y', barBaseY)
      .attr('height', 0)
      .remove();

    this.layers
      .exit()
      .transition(t)
      .remove();

    const newLayer = this.layers
      .enter()
      .append('g')
      .classed('vertical-bar__bar', true)
      .style('fill', d => this.getColor(d.key));

    if (this.textLayers) {
      const newTextLayer = this.textLayers
        .enter()
        .append('g')
        .classed('vertical-bar__text', true);

      newTextLayer
        .selectAll('text')
        .data(d => d)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', 'white')
        .text(calculatePercentage)
        .attr('x', d => this.xScale(d.data.key) + this.xScale.bandwidth() / 2)
        .attr('y', this.yScale(0));

      this.textLayers = newTextLayer.merge(this.textLayers);

      this.textLayers
        .selectAll('text')
        .data(d => d)
        .call(this.animateTexts.bind(this));
    }

    newLayer
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => this.xScale(d.data.key))
      .attr('y', barBaseY)
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0);

    this.layers = newLayer.merge(this.layers);

    this.layers
      .selectAll('rect')
      .data(d => d)
      .call(this.animateBars.bind(this));

    this.updateYAxis();
  }

  render() {
    const { widgetformat, segmentName } = this.widgetInfo;
    const { options, xAxis } = this.props;
    const svg = select(this.element)
      .append('svg')
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);
    const maxStackY = this.getMaxValue();
    const height = Math.max(
      0,
      this.element.offsetHeight - MARGIN.top - MARGIN.bottom
    );
    const yFormat = d =>
      new FormatNumber(d).convert(new FormatNumber(maxStackY).divider())[0];
    const self = this;

    function calculatePercentage(d) {
      let percent = 0;
      const tot = self.data.find(t => t.key === d.data.key);

      if (tot && !tot.total) {
        const obj = excludePropertiesFromObject(tot, ['key']);
        tot.total = Object.values(obj).reduce((a, b) => a + b);
      }
      if (widgetformat === 'Percentage') {
        percent = (d[1] - d[0]) * 100;
      } else {
        percent = (d[1] - d[0]) * 100 / tot.total;
      }

      if (!isNaN(percent) && percent > 0) {
        return `${Math.round(percent)}%`;
      }
      return null;
    }

    this.xScale = scaleBand().domain(xAxis);
    this.yScale = scaleLinear().range([height, 0]);
    this.heightScale = scaleLinear().range([0, height]);

    if (widgetformat !== 'Percentage') {
      this.yScale.domain([0, maxStackY]);
      this.heightScale.domain([0, maxStackY]);
    }

    this.xAxis = axisBottom()
      .tickFormat(d => timeFormat('%d %b')(utcParse('%d/%m/%Y %H:%M:%S')(d)))
      .ticks(5);

    this.yAxis = axisLeft()
      .ticks(5)
      .tickFormat((widgetformat === 'Percentage' && format('.0%')) || yFormat);

    svg.append('g').classed('vertical-bar__grid', true);

    this.layers = svg
      .append('g')
      .classed('vertical-bar__bars', true)
      .selectAll('.vertical-bar__bar')
      .data(
        stack()
          .keys(this.activeItems)
          .offset(
            (widgetformat === 'Percentage' && stackOffsetExpand) ||
              stackOffsetNone
          )(this.data)
      )
      .enter()
      .append('g')
      .style('fill', d => this.getColor(d.key))
      .classed('vertical-bar__bar', true);

    if (segmentName === 'CustomerMetrics') {
      this.textLayers = svg
        .append('g')
        .classed('vertical-bar__texts', true)
        .selectAll('.vertical-bar__text')
        .data(
          stack()
            .keys(this.activeItems)
            .offset(
              (widgetformat === 'Percentage' && stackOffsetExpand) ||
                stackOffsetNone
            )(this.data)
        )
        .enter()
        .append('g')
        .classed('vertical-bar__text', true);
    }

    this.layers
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('height', 0)
      .attr('y', this.yScale(0))
      .call(this.animateBars.bind(this));

    if (this.textLayers) {
      this.textLayers
        .selectAll('text')
        .data(d => d)
        .enter()
        .append('text')
        .text(calculatePercentage)
        .attr('y', d => this.yScale(d[0]) / 2)
        .attr('x', d => this.xScale(d.data.key) + this.xScale.bandwidth() / 2);
    }

    svg.append('g').classed('vertical-bar__axis vertical-bar__axis--x', true);

    svg.append('g').classed('vertical-bar__axis vertical-bar__axis--y', true);

    svg
      .append('text')
      .classed('vertical-bar__axis-label--y', true)
      .style('text-anchor', 'middle')
      .text(() => {
        const indicator = window.Messages[`Global.${options.indicator}`];
        const suffix = new FormatNumber(maxStackY).suffix();

        return suffix && indicator ? `${indicator} (${suffix})` : indicator;
      });

    this.resizing();
    this.renderTooltip();
  }

  resize() {
    const width = Math.max(
      0,
      this.element.offsetWidth - MARGIN.left - MARGIN.right
    );
    const height = Math.max(
      0,
      this.element.offsetHeight - MARGIN.top - MARGIN.bottom
    );
    const svg = select(this.element).select('svg');

    this.setState({
      height,
      width,
    });

    svg
      .attr('height', height + MARGIN.top + MARGIN.bottom)
      .attr('width', width + MARGIN.left + MARGIN.right);

    this.heightScale.range([0, height]);
    this.xScale.range([-30, width]).padding(0.6);
    this.yScale.range([height, 0]);
    this.xAxis.scale(this.xScale);
    this.yAxis.scale(this.yScale);

    svg
      .select('.vertical-bar__axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(this.xAxis);

    svg.select('.vertical-bar__axis--y').call(this.yAxis);

    const yAxisHeight = svg
      .select('.vertical-bar__axis--y')
      .node()
      .getBoundingClientRect().height;

    svg
      .select('.vertical-bar__axis-label--y')
      .attr('transform', `translate(-40, ${yAxisHeight / 2}) rotate(-90)`);

    svg.select('.vertical-bar__grid').call(
      axisLeft(this.yScale)
        .ticks(5)
        .tickSize(-width, 0, 0)
        .tickFormat('')
    );

    svg
      .selectAll('.vertical-bar__bar rect')
      .attr('width', this.xScale.bandwidth())
      .attr('x', d => this.xScale(d.data.key));
    svg
      .selectAll('.vertical-bar__text text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'white')
      .attr('x', d => this.xScale(d.data.key) + this.xScale.bandwidth() / 2)
      .call(this.animateTexts.bind(this));
  }

  renderTooltip() {
    const chart = select(this.element);
    const svg = chart.select('svg');
    const self = this;

    function handleMouseOver() {
      const { series } = self.props;
      const width = chart.node().offsetWidth;
      const eachBand = self.xScale.step();
      const mouseX = mouse(this)[0];
      const index = Math.ceil(mouseX / eachBand) - 1;
      const xAxis = self.xScale
        .domain()
        .map(item => utcParse('%d/%m/%Y %H:%M:%S')(item));
      const selectedDate = xAxis[index];
      const dateInterval = getDateInterval(xAxis, selectedDate);
      const serie = excludePropertiesFromObject(
        self.data.find(
          serieItem => serieItem.key === self.xScale.domain()[index]
        ),
        ['key']
      );
      const tooltipData = Object.keys(serie)
        .slice(0, 10)
        .map(key => ({
          key,
          label: series.find(serieItem => serieItem.key === key).label,
          value: serie[key],
        }));
      const tooltip = chart.append('div').classed('vertical-bar-tooltip', true);

      if (mouseX + MARGIN.left < width / 2) {
        tooltip.style('left', 'auto').style('right', `${MARGIN.right + 30}px`);
      } else {
        tooltip.style('left', `${MARGIN.left + 30}px`).style('right', 'auto');
      }

      tooltip
        .append('header')
        .classed('vertical-bar-tooltip__header', true)
        .text(dateInterval);

      const list = tooltip
        .append('div')
        .classed('vertical-bar-tooltip__body', true)
        .append('ul')
        .classed('vertical-bar-tooltip__list', true);

      const items = list
        .selectAll('li')
        .data(tooltipData)
        .enter()
        .append('li')
        .classed('linear-tooltip__item', true);

      items.append('span').classed('linear-tooltip__color', true);
      items.append('span').classed('linear-tooltip__label', true);
      items.append('span').classed('linear-tooltip__value', true);

      tooltip
        .selectAll('.linear-tooltip__color')
        .data(tooltipData)
        .style('background-color', d => self.getColor(d.key));

      tooltip
        .selectAll('.linear-tooltip__label')
        .data(tooltipData)
        .text(d => d.label);

      tooltip
        .selectAll('.linear-tooltip__value')
        .data(tooltipData)
        .text(d => new FormatNumber(d.value).format());
    }

    svg
      .selectAll('.vertical-bar__bar')
      .on('mouseover', handleMouseOver)
      .on('mouseout', () => {
        chart.select('.vertical-bar-tooltip').remove();
      });
  }

  updateYAxis() {
    const { options: { duration } } = this.props;
    const svg = select(this.element).select('svg');
    const t = transition().duration(duration);

    svg
      .select('.vertical-bar__axis--y')
      .transition(t)
      .call(this.yAxis);
  }
}

export default VerticalBar;
