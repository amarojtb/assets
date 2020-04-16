import { ascending, merge } from 'd3-array';
import { set } from 'd3-collection';
import { interpolate } from 'd3-interpolate';
import { scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { arc, pie } from 'd3-shape';

import parameters from 'constants/parameters';
import {
  FormatNumber,
  getContrast,
  getLang,
  isoCodeToLocale,
  ACCOUNT,
} from 'services/AppUtils';
import Chart from 'services/Chart';

const DEFAULTS = {
  duration: 1000,
};

/**
 * Class Pie.
 * @class Pie
 * @extends {Chart}
 */
class Pie extends Chart {
  static setOrderItemToLast(data) {
    const otherItemIndex = data.findIndex(e => e.key === 'other');
    const otherItem = data[otherItemIndex];

    data.splice(otherItemIndex, 1);
    data.push(otherItem);

    return data;
  }

  static hidePercentageLabel(element, props) {
    const { options: { duration } } = props;
    const svg = select(element).select('svg');

    setTimeout(() => {
      svg
        .select('.pie__slices')
        .selectAll('text')
        .remove();
    }, duration / 1.8);
  }

  /**
   * GETTER/SETTER
   */

  setData(dataset) {
    const data =
      dataset &&
      dataset
        .map(e => ({
          active: true,
          key: e.key,
          label: e.label,
          value: e.value,
        }))
        .sort((a, b) => {
          if (a.key > b.key) return 1;
          if (a.key < b.key) return -1;
          return 0;
        });
    const d = data.find(e => e.key === 'other')
      ? Pie.setOrderItemToLast(data)
      : data;

    // Set data if the total of all values is upper than zero
    this.data =
      d && Array.from(d.values()).reduce((p, c) => p + c.value, 0) > 0 ? d : [];
  }

  /**
   * PUBLIC METHODS
   */

  update(series) {
    // Pie.hidePercentageLabel(this.element, this.props);
    this.setData(series);
    this.change();
  }

  toggle(key, isChecked = false, all = false) {
    // Pie.hidePercentageLabel(this.element, this.props);
    if (all) {
      this.data = this.data.map(item => ({
        ...item,
        active: isChecked === 'undefined' ? !item.active : isChecked,
      }));
      this.change();
    } else {
      const item = this.data.find(e => e.key === key);

      item.active = !item.active;
      this.change();
    }
  }

  /**
   * PRIVATE METHODS
   */

  change() {
    const { options: { duration } } = this.props;
    const self = this;
    const width = this.element.offsetWidth;
    const svg = select(this.element).select('svg');
    const data = this.data.filter(e => e.active);
    const key = d => d && d.data.key;
    const labelKey = function(d) {
      return d && d.data && d.data.key;
    };
    const data0 = svg
      .selectAll('path')
      .data()
      .map(d => d.data);
    const text0 = svg
      .selectAll('text')
      .data()
      .map(d => d && d.data)
      .filter(e => e);

    /**
     * Merge data and puts at 0 the value of items which misses
     * @param {Object} first - First data
     * @param {Object} second - Second data
     * @return {Object} Merged data
     */
    function mergeWithFirstEqualZero(first, second) {
      const secondSet = set();

      second.forEach(e => secondSet.add(e.key));

      const onlyFirst = first.filter(e => !secondSet.has(e.key)).map(e => ({
        key: e.key,
        label: e.label,
        value: 0,
      }));

      const d = merge([second, onlyFirst]).sort((a, b) =>
        ascending(a.key, b.key)
      );

      return d.find(e => e.key === 'other') ? Pie.setOrderItemToLast(d) : d;
    }

    const was = mergeWithFirstEqualZero(data, data0.length ? data0 : data);
    const is = mergeWithFirstEqualZero(data0.length ? data0 : data, data);

    function handleCurrent(d) {
      this.current = d;
    }

    function handleAttrTween(d) {
      const interpolator = interpolate(this.current, d);

      return t => {
        this.current = interpolator(t);
        return self.getArc()(this.current);
      };
    }

    function labelarcTween(a) {
      const i = interpolate(this.current, a);
      return t => {
        this.current = i(t);
        const c = self.getArc().centroid(this.current);
        return `translate(${c[0] * 0.9},${c[1] * 0.9})`;
        /* return `translate( ${self.getArc().centroid(i(t))} )`; */
      };
    }

    if (data0.length) {
      svg
        .select('.pie__slices')
        .selectAll('path')
        .data(this.pie(was), key)
        .enter()
        .insert('path')
        .each(handleCurrent)
        .on('mouseenter', d => this.showTooltip(d))
        .on('mouseout', () => this.hideTooltip())
        .style('fill', d => this.getColor(d.data.key));

      svg
        .select('.pie__slices')
        .selectAll('path')
        .data(this.pie(is), key)
        .transition()
        .duration(duration)
        .style('fill', d => this.getColor(d.data.key))
        .attrTween('d', handleAttrTween);

      svg
        .select('.pie__slices')
        .selectAll('path')
        .data(this.pie(data), key)
        .exit()
        .transition()
        .delay(duration)
        .duration(0)
        .remove();
      if (ACCOUNT.isNato()) {
        svg
          .select('.pie__slices')
          .selectAll('.arc__text')
          .data(this.pie(was), key)
          .enter()
          .insert('text')
          .each(handleCurrent)
          .classed('arc__text', true)
          .attr('dy', '0.35em')
          .attr('dx', '-1em')
          .style('font-size', width / 33)
          .on('mouseenter', d => this.showTooltip(d))
          .on('mouseout', () => this.hideTooltip())
          .style('fill', d =>
            getContrast(this.getColor(d.data.key).substring(1))
          );

        svg
          .select('.pie__slices')
          .selectAll('.arc__text')
          .data(this.pie(is), key)
          .transition()
          .delay(duration / 100)
          .duration(duration)
          .text(d => {
            const percent = new Intl.NumberFormat(isoCodeToLocale(getLang()), {
              maximumFractionDigits: 1,
              style: 'percent',
            }).format(d.value / this.getTotal());
            return percent === '0%' ||
              parseInt(percent.substring(0, percent.length - 1), 10) < 1
              ? null
              : percent;
          })
          .attrTween('transform', labelarcTween);

        svg
          .select('.pie__slices')
          .selectAll('.arc__text')
          .data(this.pie(data), key)
          .exit()
          .transition()
          .duration(duration / 1.5)
          .attrTween('transform', labelarcTween)
          .remove();
      }
    } else {
      svg
        .select('.pie__slices')
        .selectAll()
        .data(this.pie(data), key)
        .enter()
        .append('path')
        .on('mouseenter', d => this.showTooltip(d))
        .on('mouseout', () => this.hideTooltip())
        .style('fill', 'transparent')
        .transition()
        .duration(duration)
        .attrTween('d', finish => {
          const start = {
            endAngle: 0,
            startAngle: 0,
          };
          const interpolator = interpolate(start, finish);

          return t => this.getArc()(interpolator(t));
        })
        .each(handleCurrent)
        .style('fill', d => this.getColor(d.data.key));

      if (ACCOUNT.isNato()) {
        svg
          .select('.pie__slices')
          .selectAll()
          .data(this.pie(data), key)
          .enter()
          .append('text')
          .classed('arc__text', true)
          .on('mouseenter', d => this.showTooltip(d))
          .on('mouseout', () => this.hideTooltip())
          .attr('dy', '0.35em')
          .attr('dx', '-1em')
          .style('fill', d =>
            getContrast(this.getColor(d.data.key).substring(1))
          )
          .transition()
          .duration(duration)
          .style('font-size', width / 33)
          .text(d => {
            const percent = new Intl.NumberFormat(isoCodeToLocale(getLang()), {
              maximumFractionDigits: 1,
              style: 'percent',
            }).format(d.value / this.getTotal());
            return percent === '0%' ||
              parseInt(percent.substring(0, percent.length - 1), 10) < 1
              ? null
              : percent;
          })
          .attrTween('transform', labelarcTween);
      }
    }
  }

  getArc() {
    const { radius } = this.state;

    return arc()
      .outerRadius(radius * 0.5)
      .innerRadius(radius);
  }

  getArcText() {
    const { radius } = this.state;
    return arc()
      .outerRadius(0)
      .innerRadius(radius);
  }

  getRadius() {
    const { height, width } = this.state;

    return Math.min(width, height) / 2;
  }

  getTotal() {
    return Array.from(this.data.values()).reduce((p, c) => p + c.value, 0);
  }

  hideTooltip() {
    const element = select(this.element);

    element.select('.pie__tooltip-percent').text('');
    element.select('.pie__tooltip-label').text('');
    element.select('.pie__tooltip-value').text('');
  }

  init() {
    const { series } = this.props;
    const keys = series && series.map(serieItem => serieItem.key);
    const chartColors = Object.keys(parameters.NATO_CHART_SENTIMENT_COLORS_BAR)
      .map(colorKey => {
        if (keys.includes(colorKey)) {
          return parameters.NATO_CHART_SENTIMENT_COLORS_BAR[colorKey];
        }
        return null;
      })
      .filter(e => e);

    this.props.options = Object.assign(DEFAULTS, this.props.options);
    this.setState({ radius: this.getRadius() });
    this.pie = pie()
      .sort(null)
      .value(d => d.value);

    if (
      this.widgetInfo &&
      ACCOUNT.isNato() &&
      this.widgetInfo.segment1OnField === 'customerMetrics.string_sentiment'
    ) {
      this.colors = scaleOrdinal().range(chartColors);
    } else {
      this.colors = scaleOrdinal(parameters.CHART_COLORS);
    }
    this.setData(series.filter(item => item.label));
  }

  render() {
    const svg = select(this.element)
      .append('svg')
      .append('g');

    svg.append('g').classed('pie__slices', true);

    const label = svg.append('g').classed('pie__tooltip', true);

    label
      .append('text')
      .classed('pie__tooltip-percent', true)
      .style('font-weight', '700')
      .style('text-anchor', 'middle');

    label
      .append('text')
      .attr('transform', 'translate(0, 25)')
      .classed('pie__tooltip-label', true)
      .style('text-anchor', 'middle');

    label
      .append('text')
      .attr('transform', 'translate(0, 45)')
      .classed('pie__tooltip-value', true)
      .style('text-anchor', 'middle');

    this.change();
    this.resizing();
  }

  resize() {
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    const svg = select(this.element).select('svg');
    const radius = this.getRadius();

    function handleCurrent(d) {
      this.current = d;
    }

    this.setState({
      height,
      radius,
      width,
    });
    svg.attr('height', height).attr('width', width);

    svg.select('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    svg
      .select('.pie__slices')
      .selectAll('path')
      .attr('d', this.getArc())
      .each(handleCurrent);

    svg
      .select('.pie__tooltip-percent')
      .style('font-size', `${Math.max(2.75, 2.75 * radius / 200)}rem`);

    svg
      .select('.pie__tooltip-label')
      .style('font-size', `${Math.max(0.975, 0.975 * radius / 200)}rem`);

    svg
      .select('.pie__tooltip-value')
      .style('font-size', `${Math.max(0.75, 0.75 * radius / 200)}rem`);
  }

  showTooltip(d) {
    const { key, label, value } = d.data;
    const element = select(this.element);

    element
      .select('.pie__tooltip-percent')
      .text(
        new Intl.NumberFormat(isoCodeToLocale(getLang()), {
          maximumFractionDigits: 1,
          style: 'percent',
        }).format(value / this.getTotal())
      )
      .style('fill', this.getColor(key));

    element.select('.pie__tooltip-label').text(label);

    element
      .select('.pie__tooltip-value')
      .text(new FormatNumber(value).format());
  }
}

export default Pie;
