/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
import Chart from 'services/Chart';
import { axisBottom, axisLeft } from 'd3-axis';
import { mouse, select, event } from 'd3-selection';
import { format, formatDefaultLocale } from 'd3-format';
import { timeFormat, utcParse } from 'd3-time-format';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
import { stack, stackOffsetExpand, stackOffsetNone } from 'd3-shape';
import { excludePropertiesFromObject, FormatNumber } from 'services/AppUtils';
import parameters from 'constants/parameters';
import './HorizontalStackedBarChart.css';

const MARGIN = {
  top: 10,
  right: 10,
  bottom: 20,
  left: 60,
};

/**
 * Class HorizontalStackedBarChart.
 * @class HorizontalStackedBarChart
 * @extends {Chart}
 */
class HorizontalStackedBarChart extends Chart {
  init() {
    const d3Translations = JSON.parse(window.Messages['Global.D3']);
    const { series } = this.props;
    formatDefaultLocale(d3Translations);

    this.prepareData();
    const elementWidth = this.element.offsetWidth || 550;
    const elementHeight = this.element.offsetHeight || 240;
    const keys = series && series.map(serieItem => serieItem.key);
    const width = elementWidth - MARGIN.left + 40;
    const height = elementHeight - MARGIN.bottom - MARGIN.top;

    this.activeItems = keys;
    this.drawArea = {
      width: width || 500,
      height: (height && height) || 300,
    };
    this.colors = scaleOrdinal().range(parameters.CHART_COLORS);
    this.svg = select(this.element)
      .append('svg')
      .attr('width', this.drawArea.width)
      .attr('height', this.drawArea.height);
  }

  prepareData(data) {
    const props = data || this.props;
    const { yAxis: { categories }, series } = props;
    this.activeItems = this.activeItems || series.map(serie => serie.key);
    if (!series || !categories) {
      this.data = [{}];
    }

    const newData = [];
    const parsedDate = categories.map(e => utcParse('%d/%m/%Y %H:%M:%S')(e));

    categories.forEach((category, index) => {
      const row = {};
      row.date = parsedDate[index];
      row.name = (series[index] && series[index].key) || '';
      series.forEach(v => {
        row[v.key] = (this.activeItems.includes(v.key) && v.value[index]) || 0;
      });
      newData.push(row);
    });

    this.data = newData;
  }

  render() {
    const { widgetformat } = this.widgetInfo;
    const { yAxis: { categories }, series } = this.props;
    const parsedDate = categories.map(e => utcParse('%d/%m/%Y %H:%M:%S')(e));

    this.totals = this.data.map(object => {
      const key = object.name;
      const val = () => {
        const obj = { ...object };
        obj.name = 0;
        obj.date = 0;
        return obj;
      };
      const values = Object.values(val());
      return { key, total: values.reduce((c, v) => c + v) };
    });
    const xFormat = d =>
      new FormatNumber(d).convert(
        new FormatNumber(Math.max(...this.totals.map(t => t.total))).divider()
      )[0];

    this.y = scaleBand()
      .domain(categories.map((date, index) => parsedDate[index]))
      .range([this.drawArea.height - 35, 10])
      .padding(0.1);

    this.x = scaleLinear().range([
      MARGIN.left + 1,
      this.drawArea.width - MARGIN.right - 5,
    ]);

    if (widgetformat !== 'Percentage') {
      this.x.domain([0, Math.max(...this.totals.map(t => t.total))]);
    }

    this.stack = stack()
      .keys(series.map(serie => serie.key))
      .offset(
        (widgetformat === 'Percentage' && stackOffsetExpand) || stackOffsetNone
      );

    this.leftAxis = axisLeft(this.y)
      .ticks(5)
      .tickSize(-this.drawArea.width, 0, 0)
      .tickSizeInner(1)
      .tickSizeOuter(0)
      .tickFormat(d => timeFormat('%d %b')(d));

    this.bottomAxis = axisBottom(this.x)
      .ticks(5)
      .tickSize(-this.drawArea.width, 0, 0)
      .tickSizeInner(1)
      .tickSizeOuter(0)
      .tickFormat((widgetformat === 'Percentage' && format('.0%')) || xFormat);

    // Create y-axis
    this.svg
      .append('g')
      .classed('horizontalStackedBar__axis horizontalStackedBar__axis--y', true)
      .style('transform', `translate(${MARGIN.left}px, 0)`)
      .call(this.leftAxis);

    // Create x-axis
    this.svg
      .append('g')
      .classed('horizontalStackedBar__axis horizontalStackedBar__axis--x', true)
      .style('transform', `translate(-1px, ${this.drawArea.height - 35}px)`)
      .call(this.bottomAxis);

    this.svg
      .append('text')
      .classed('horizontal-bar__axis-label--y', true)
      .style('text-anchor', 'middle')
      .text(() => {
        const indicator =
          window.Messages[`Global.${this.props.yAxis.title.indicator}`];
        const suffix = new FormatNumber(
          Math.max(...this.totals.map(t => t.total))
        ).suffix();

        return suffix && indicator ? `${indicator} (${suffix})` : indicator;
      });
    this.drawSeries();
    this.resizing();
    this.renderTooltip();
  }

  drawSeries() {
    const { widgetformat } = this.widgetInfo;
    const { series } = this.props;
    const keys = series.map(serie => serie.key);
    const self = this;

    function calculatePercentage(d) {
      let percent = 0;
      const tot = self.totals.find(t => t.key === d.data.name);
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

    keys.forEach((key, keyIndex) => {
      const bar = this.svg
        .selectAll(`.bar-${key}`)
        .data(this.stack(this.data)[keyIndex], d => `${d.data.date}-${key}`);
      const texts = this.svg
        .selectAll(`.text-${key}`)
        .data(this.stack(this.data)[keyIndex], d => `${d.data.date}-${key}`);

      bar
        .transition()
        .attr('x', d => this.x(d[0]))
        .attr('y', d => this.y(d.data.date))
        .attr('width', d => this.x(d[1]) - this.x(d[0]));

      texts
        .transition()
        .text(calculatePercentage)
        .attr('x', d => this.x(d[1]) + (this.x(d[0]) - this.x(d[1])) / 2);

      bar
        .enter()
        .append('rect')
        .attr('class', () => `bar bar-${key}`)
        .attr('x', d => this.x(d[0]))
        .attr('y', d => this.y(d.data.date))
        .attr('height', this.y.bandwidth())
        .attr('width', d => this.x(d[1]) - this.x(d[0]))
        .attr('fill', () => this.colors(key));

      texts
        .enter()
        .append('text')
        .text(calculatePercentage)
        .attr('class', `text text-${key}`)
        .attr('text-anchor', 'middle')
        .attr(
          'y',
          d => Math.round(this.y(d.data.date) + this.y.bandwidth() / 2) + 3
        )
        .attr('font-size', '10px')
        .attr('fill', 'white')
        .transition()
        .attr('x', d => this.x(d[1]) + (this.x(d[0]) - this.x(d[1])) / 2);
    });
  }

  updateAxis() {
    const { widgetformat } = this.widgetInfo;
    const { yAxis: { categories } } = this.props;
    const parsedDate = categories.map(e => utcParse('%d/%m/%Y %H:%M:%S')(e));
    const xFormat = d =>
      new FormatNumber(d).convert(
        new FormatNumber(Math.max(...this.totals.map(t => t.total))).divider()
      )[0];

    this.y = scaleBand()
      .domain(categories.map((date, index) => parsedDate[index]))
      .range([this.drawArea.height - 35, 10])
      .padding(0.1);

    this.x = scaleLinear().range([
      MARGIN.left + 1,
      this.drawArea.width - MARGIN.right - 5,
    ]);

    if (widgetformat !== 'Percentage') {
      this.x.domain([0, Math.max(...this.totals.map(t => t.total))]);
    }

    this.leftAxis = axisLeft(this.y)
      .ticks(5)
      .tickSize(-this.drawArea.width, 0, 0)
      .tickSizeInner(1)
      .tickSizeOuter(0)
      .tickFormat(d => timeFormat('%d %b')(d));

    this.bottomAxis = axisBottom(this.x)
      .ticks(5)
      .tickSize(-this.drawArea.width, 0, 0)
      .tickSizeInner(1)
      .tickSizeOuter(0)
      .tickFormat((widgetformat === 'Percentage' && format('.0%')) || xFormat);

    this.svg
      .select('.horizontalStackedBar__axis--x')
      .transition()
      .duration(700)
      .call(this.bottomAxis);

    this.svg
      .select('.horizontalStackedBar__axis--y')
      .transition()
      .duration(700)
      .call(this.leftAxis);
  }

  resize() {
    const svg = this.svg;
    const elementWidth = this.element.offsetWidth || 500;
    const elementHeight = this.element.offsetHeight || 210;
    const width = elementWidth - MARGIN.left + 40;
    const height = elementHeight - MARGIN.bottom - MARGIN.top;

    this.drawArea = {
      width: width || 500,
      height: (height < 210 && 210) || height,
    };

    svg.attr('height', this.drawArea.height).attr('width', this.drawArea.width);

    this.x.range([MARGIN.left + 1, this.drawArea.width - MARGIN.right - 5]);
    this.y.range([this.drawArea.height - 35, 5]);
    this.bottomAxis.scale(this.x);
    this.leftAxis.scale(this.y);

    svg
      .select('.horizontalStackedBar__axis--x')
      .attr('transform', `translate(-1, ${this.drawArea.height - 35})`)
      .call(this.bottomAxis);

    svg.select('.horizontalStackedBar__axis--y').call(this.leftAxis);

    svg
      .selectAll('.bar')
      .attr('height', this.y.bandwidth())
      .attr('width', d => this.x(d[1]) - this.x(d[0]))
      .attr('x', d => this.x(d[0]));

    svg
      .selectAll('.text')
      .attr('x', d => this.x(d[1]) + (this.x(d[0]) - this.x(d[1])) / 2);

    svg
      .select('.horizontal-bar__axis-label--y')
      .attr(
        'transform',
        `translate(${this.drawArea.width / 2}, ${this.drawArea.height - 7})`
      );
  }

  renderTooltip() {
    const chart = select(this.element);
    const svg = chart.select('svg');
    const self = this;
    let tooltip = chart
      .append('div')
      .classed('horizontal-stacked-bar-tooltip', true);

    function handleMouseMove() {
      const mouseX = event.pageX;

      if (mouseX < chart.node().offsetWidth) {
        tooltip.style('left', 'auto').style('right', `${MARGIN.right + 30}px`);
      } else {
        tooltip.style('left', `${MARGIN.left + 30}px`).style('right', 'auto');
      }
    }

    function handleMouseOver(barData) {
      const mouseX = event.pageX;
      const { series } = self.props;
      const ser = self.data.find(
        serieItem => serieItem.date.valueOf() === barData.data.date.valueOf()
      );
      const serie = excludePropertiesFromObject(ser, ['date', 'name']);
      const tooltipData = Object.keys(serie)
        .slice(0, 10)
        .map(key => ({
          key,
          label: series.find(serieItem => serieItem.key === key).label,
          value: serie[key],
        }));
      tooltip = chart
        .append('div')
        .classed('horizontal-stacked-bar-tooltip', true);

      if (mouseX < chart.node().offsetWidth) {
        tooltip.style('left', 'auto').style('right', `${MARGIN.right + 30}px`);
      } else {
        tooltip.style('left', `${MARGIN.left + 30}px`).style('right', 'auto');
      }

      tooltip
        .append('header')
        .classed('horizontal-stacked-bar-tooltip__header', true)
        .text(timeFormat('%d %B')(barData.data.date));

      const list = tooltip
        .append('div')
        .classed('horizontal-stacked-bar-tooltip__body', true)
        .append('ul')
        .classed('horizontal-stacked-bar-tooltip__list', true);

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
      .selectAll('.bar')
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', () => {
        chart.selectAll('.horizontal-stacked-bar-tooltip').remove();
      });
    svg
      .selectAll('.text')
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', () => {
        chart.selectAll('.horizontal-stacked-bar-tooltip').remove();
      });
  }

  toggle(key, isChecked = false) {
    this.activeItems = isChecked
      ? [...this.activeItems, key]
      : this.activeItems.filter(keyItem => keyItem !== key);
    this.update();
  }

  toggleAll(isChecked = false) {
    const { series } = this.props;

    this.activeItems = isChecked ? series.map(serieItem => serieItem.key) : [];
    this.update();
  }

  update(series) {
    this.prepareData(series);
    this.updateAxis();

    setTimeout(() => {
      this.drawSeries();
      this.renderTooltip();
    }, 0);
  }

  change() {
    this.drawSeries();
  }

  getProps() {
    const props = super.getProps();
    return props;
  }
}

export default HorizontalStackedBarChart;
