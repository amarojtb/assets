import { geoMercator, geoPath } from 'd3-geo';
import { scaleThreshold } from 'd3-scale';
import { event, select } from 'd3-selection';
import { zoom } from 'd3-zoom';
import Chart from 'services/Chart';
import Color from 'color';
import { feature } from 'topojson-client';
import LegendList from './LegendList';
import Tooltip from './Tooltip';
import './Map.css';

const europeMapJson = require('../../../../Scripts/Delivery/Widget/Datas/europe.json');
const worldMapJson = require('../../../../Scripts/Delivery/Widget/Datas/world.json');

const DEFAULTS = {
  colors: ['#c8cee7', '#3255a4'],
  hoverColor: '#1e2868',
  legendSize: 5,
  map: 'world',
  showMostImportant: true,
};
const CENTER = {
  europe: [0, 57],
  world: [0, 44],
};
const ROTATE = {
  europe: [110, 0],
  world: [0, 0],
};
const SCALE = {
  europe: [0.7, 0.88],
  world: [0.15874, 0.2465],
};

const JSON_MAP_PATH = {
  europe: europeMapJson,
  world: worldMapJson,
};

/**
 * Class MapChart.
 * @class MapChart
 * @extends {Chart}
 */
class MapChart extends Chart {
  static gradientColor(color1, color2, percent) {
    /**
     * Make channel
     * @param  {number} a - Color 1
     * @param  {number} b - Color 2
     * @return {number} Channel
     */
    function channel(a, b) {
      return a + Math.round((b - a) * (percent / 100));
    }

    /**
     * Make color piece
     * @param  {number} numberIn - Color
     * @return {string} Hexadecimal color
     */
    function colorPiece(numberIn) {
      let numberOut = numberIn;

      numberOut = Math.min(numberOut, 255);
      numberOut = Math.max(numberOut, 0);

      let str = numberOut.toString(16);

      if (str.length < 2) {
        str = `0${str}`;
      }

      return str;
    }

    return `#${colorPiece(channel(color1.r, color2.r))}\
${colorPiece(channel(color1.g, color2.g))}\
${colorPiece(channel(color1.b, color2.b))}`;
  }

  static loadJsonMap(map, callback) {
    callback(JSON_MAP_PATH[map]);
  }

  /**
   * PRIVATE METHODS
   */

  render() {
    this.element.style.position = 'relative';
    this.element.style.width = '100%';
    this.element.style.height = '100%';

    this.zoom = zoom()
      .scaleExtent([1, 8])
      .on('zoom', this.move.bind(this));

    this.domain = [1];

    for (let i = 1; i < this.options.legendSize - 2; i += 1) {
      this.domain.push(Math.round((50 / (this.options.legendSize - 2)) * i));
    }

    this.domain.push(50);
    this.domain.push(101);

    this.scale = scaleThreshold()
      .domain(this.domain)
      .range(this.generateRangeColors());

    this.projection = geoMercator()
      .center(CENTER[this.options.map])
      .rotate(ROTATE[this.options.map])
      .translate([0, 0]);

    this.path = geoPath();

    MapChart.loadJsonMap(this.options.map, jsonMap => {
      const countries = feature(jsonMap, jsonMap.objects.countries).features;
      const availableIsoCode = countries
        .map(e => e.id)
        .filter(e => typeof e === 'string');

      this.data = this.data
        .map(e => {
          const label =
            typeof e.label === 'string' &&
            availableIsoCode.includes(e.label) &&
            e.label;
          const value = typeof e.value === 'number' && e.value;

          return label && value && e;
        })
        .filter(e => e);

      const svg = select(this.element)
        .append('svg')
        .style('height', '100%')
        .style('width', '100%');

      svg
        .append('defs')
        .append('pattern')
        .attr('height', 4)
        .attr('id', 'motif')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('x', 0)
        .attr('y', 0)
        .append('rect')
        .attr('height', 2)
        .attr('width', 2)
        .style('fill', '#ccc');

      svg
        .append('g')
        .call(this.zoom)
        .on('mousedown.zoom', null)
        .on('touchstart.zoom', null)
        .on('touchmove.zoom', null)
        .on('touchend.zoom', null);

      svg
        .select('g')
        .append('rect')
        .classed('map__overlay', true)
        .style('fill', 'none')
        .style('pointer-events', 'all');

      const g = svg.select('g').append('g');

      g.style('fill', this.options.hoverColor);

      this.points = feature(jsonMap, jsonMap.objects.points).features;

      g.selectAll()
        .data(countries)
        .enter()
        .append('path')
        .attr('class', d => `map__country ${d.label}`)
        .style('fill', d => {
          const item = this.data.find(e => e.label === d.id);
          const value = item && typeof item.value === 'number' && item.value;

          return value
            ? this.scale((value / this.getTotal()) * 100)
            : 'url(#motif)';
        })
        .on('click', d => {
          if (this.data.find(e => e.label === d.id)) {
            this.setState({
              selectedLabel: d.id,
            });
            this.renderTooltip(d);
          }
        });

      if (this.options.showMostImportant) {
        g.append('path')
          .classed('map__most-important', true)
          .style('fill', '#fff')
          .style('pointer-events', 'none')
          .attr(
            'd',
            'M7,0l1.7,5H14L9.7,8l1.7,5L7,9.9L2.7,13l1.7-5L0,5h5.3L7,0z'
          );
      }

      g.selectAll()
        .data(this.points)
        .enter()
        .append('path')
        .attr('class', d => `map__point ${d.id}`);

      this.renderLegend();
      this.resizing();
    });
  }

  renderLegend() {
    const legend = document.createElement('div');
    const tabColors = this.generateRangeColors().reverse();
    const tabLabels = this.domain.slice().reverse();
    const tabLegend = [];

    legend.className = 'map-legend';
    legend.style.position = 'absolute';
    this.element.appendChild(legend);

    if (this.options.showMostImportant) {
      tabLegend.push({
        color: tabColors[0],
        type: 'important',
      });
    }

    tabLegend.push({
      color: tabColors[0],
      type: 'more',
    });

    for (let i = 1; i < this.options.legendSize - 1; i += 1) {
      tabLegend.push({
        color: tabColors[i],
        numbers: [tabLabels[i + 1] / 100, tabLabels[i] / 100],
        type: 'numbers',
      });
    }

    tabLegend.push({
      color: tabColors[tabColors.length - 1],
      type: 'less',
    });

    window.renderReactComponent(LegendList, legend, {
      tabLegend,
    });
  }

  renderTooltip(d) {
    const tooltipOld = this.element.querySelector('.map-tooltip');
    const tooltip = document.createElement('div');

    if (tooltipOld) {
      tooltipOld.parentNode.removeChild(tooltipOld);
    }

    tooltip.className = 'map-tooltip';
    tooltip.style.position = 'absolute';
    this.element.appendChild(tooltip);

    window.renderReactComponent(Tooltip, tooltip, {
      color: this.getColor(),
      id: d.id,
      indicator: this.options.indicator,
      percent: this.getValue() / this.getTotal(),
      quantity: this.getValue(),
    });

    if (tooltip) {
      const tooltipPosition = this.getTooltipPosition();

      tooltip.style.top = `${tooltipPosition.top}px`;
      tooltip.style.left = `${tooltipPosition.left}px`;
    }
  }

  generateRangeColors() {
    const { colors } = this.options;
    const tabColors = [];

    for (let i = 0; i < this.options.legendSize; i += 1) {
      const range = (100 / (this.options.legendSize - 1)) * i;

      tabColors.push(
        MapChart.gradientColor(
          Color(colors[0]).object(),
          Color(colors[colors.length - 1]).object(),
          range
        )
      );
    }

    return tabColors;
  }

  getAroundSpace() {
    const group = this.element.querySelector('g g');

    return group
      ? (this.element.offsetWidth - group.getBoundingClientRect().width) / 2
      : 0;
  }

  getColor() {
    return this.scale((this.getValue() / this.getTotal()) * 100);
  }

  getMaxValueLabel() {
    let max = 0;
    let maxLabel = '';

    this.data.forEach(e => {
      if (e.value > max) {
        max = e.value;
        maxLabel = e.label;
      }
    });

    return maxLabel;
  }

  getMaxPoint() {
    const points = this.points.find(e => e.id === this.getMaxValueLabel());
    const position = this.projection(points.geometry.coordinates);
    const [left, top] = position;

    return `${left - 7}, ${top - 7}`;
  }

  getTooltipPosition() {
    const svg = this.element.querySelector('svg');
    const point = svg.querySelector(`.map__point.${this.state.selectedLabel}`);
    const pointCoords = point.getBoundingClientRect();
    const mapCoords = this.element.getBoundingClientRect();
    const tooltip = this.element.querySelector('.map-tooltip');
    const tooltipCoords = tooltip.getBoundingClientRect();

    return {
      left:
        pointCoords.left +
        pointCoords.width / 2 -
        mapCoords.left -
        tooltipCoords.width / 2,
      top:
        pointCoords.top +
        pointCoords.height / 2 -
        mapCoords.top -
        (tooltipCoords.height + 12),
    };
  }

  getTotal() {
    return this.data
      .map(({ value }) => value)
      .reduce((previous, current) => previous + current, 0);
  }

  getValue() {
    return this.data.find(({ label }) => label === this.state.selectedLabel)
      .value;
  }

  init() {
    const { data, options, onResize } = this.props;

    this.data = data;
    this.options = Object.assign({}, DEFAULTS, options);
    this.onResize = onResize;
  }

  move() {
    const svg = select(this.element).select('svg');
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    const { x, y, k } = event.transform;
    const tooltip = this.element.querySelector('.map-tooltip');
    const tx = Math.min(
      (width / 2) * (k - 1),
      Math.max((width / 2) * (1 - k), x)
    );
    const ty = Math.min(
      (height / 2) * (k - 1) + k,
      Math.max((height / 2) * (1 - k) - k, y)
    );

    this.zoom.translateExtent([tx, ty]);
    svg
      .select('g g')
      .attr(
        'transform',
        `translate(${tx + this.getAroundSpace()}, ${ty}) scale(${k})`
      );

    if (tooltip) {
      const tooltipPosition = this.getTooltipPosition();

      tooltip.style.top = `${tooltipPosition.top}px`;
      tooltip.style.left = `${tooltipPosition.left}px`;
    }
  }

  resize() {
    const svg = select(this.element).select('svg');
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    const ratio = width / height;
    const scale =
      ratio < 1.55
        ? width * SCALE[this.options.map][0]
        : height * SCALE[this.options.map][1];
    const tooltip = this.element.querySelector('.map-tooltip');

    this.projection.scale(scale);

    this.path.projection(this.projection);

    svg.select('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    svg.selectAll('.map__country').attr('d', this.path);

    svg
      .selectAll('.map__point')
      .attr('d', this.path)
      .style('fill', 'transparent')
      .style('pointer-events', 'none');

    svg
      .select('g g')
      .attr('transform', `translate(${this.getAroundSpace()}, 0)`);

    setTimeout(() => {
      svg
        .select('g g')
        .attr('transform', `translate(${this.getAroundSpace()}, 0)`);
    }, 100);

    if (this.data.length && this.options.showMostImportant) {
      svg
        .select('.map__most-important')
        .attr('transform', `translate(${this.getMaxPoint()})`);
    }

    svg
      .select('.map__overlay')
      .attr('x', -width / 2)
      .attr('y', -height / 2)
      .attr('width', width)
      .attr('height', height);

    if (tooltip) {
      const tooltipPosition = this.getTooltipPosition();

      tooltip.style.top = `${tooltipPosition.top}px`;
      tooltip.style.left = `${tooltipPosition.left}px`;
    }

    if (typeof this.onResize === 'function') {
      this.onResize();
    }
  }
}

export default MapChart;
