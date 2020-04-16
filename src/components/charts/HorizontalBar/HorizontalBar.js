import { max } from 'd3-array';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { scaleOrdinal, scaleLinear } from 'd3-scale';
import Chart from 'services/Chart';
import { FormatNumber } from 'services/AppUtils';

const DURATION = 1000;
const MARGIN = {
  bottom: 0,
  left: 0,
  right: 70,
  top: 20,
};
const BAR_HEIGHT = 14;

const SHARE_ICON_PATH =
  'M14.68,12.621c-0.9,0-1.702,0.43-2.216,1.09l-4.549-2.637c0.284-0.691,0.284-1.457,0-2.146l4.549-2.638c0.514,0.661,1.315,1.09,2.216,1.09c1.549,0,2.809-1.26,2.809-2.808c0-1.548-1.26-2.809-2.809-2.809c-1.548,0-2.808,1.26-2.808,2.809c0,0.38,0.076,0.741,0.214,1.073l-4.55,2.638c-0.515-0.661-1.316-1.09-2.217-1.09c-1.548,0-2.808,1.26-2.808,2.809s1.26,2.808,2.808,2.808c0.9,0,1.702-0.43,2.217-1.09l4.55,2.637c-0.138,0.332-0.214,0.693-0.214,1.074c0,1.549,1.26,2.809,2.808,2.809c1.549,0,2.809-1.26,2.809-2.809S16.229,12.621,14.68,12.621M14.68,2.512c1.136,0,2.06,0.923,2.06,2.06S15.815,6.63,14.68,6.63s-2.059-0.923-2.059-2.059S13.544,2.512,14.68,2.512M5.319,12.061c-1.136,0-2.06-0.924-2.06-2.06s0.923-2.059,2.06-2.059c1.135,0,2.06,0.923,2.06,2.059S6.454,12.061,5.319,12.061M14.68,17.488c-1.136,0-2.059-0.922-2.059-2.059s0.923-2.061,2.059-2.061s2.06,0.924,2.06,2.061S15.815,17.488,14.68,17.488';

/**
 * Class HorizontalBar.
 * @class HorizontalBar
 * @extends {Chart}
 */
class HorizontalBar extends Chart {
  /**
   * PRIVATE METHODS
   */

  init() {
    const { data } = this.props;

    this.data = data.slice(0, 10);
  }

  render() {
    const svg = select(this.element)
      .append('svg')
      .append('g');
    const selection = svg.selectAll('g').data(this.data);
    const color = scaleOrdinal().range([
      '#1f9cb6',
      '#2ba1ad',
      '#3aa6a3',
      '#4ead94',
      '#63b485',
      '#78bc75',
      '#8fc464',
      '#a2cb56',
      '#b2d04b',
      '#bed542',
    ]);

    this.xScale = scaleLinear().domain([0, max(this.data, d => d.value)]);

    svg.attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    const items = selection
      .enter()
      .append('g')
      .classed('horizontal-bar__item', true);

    items
      .append('text')
      .attr('transform', 'translate(7, 10)')
      .classed('horizontal-bar__tag', true)
      .style('font-size', '.75rem')
      .style('font-weight', '500')
      .append('tspan')
      .text(d => d.label);

    items
      .append('rect')
      .attr('height', BAR_HEIGHT)
      .attr('transform', 'translate(7, 17)')
      .classed('horizontal-bar__shadow', true)
      .style('fill', '#d3e1dd');

    items
      .append('rect')
      .attr('height', BAR_HEIGHT)
      .attr('transform', 'translate(7, 14)')
      .classed('horizontal-bar__bar', true)
      .style('fill', d => color(d.value));

    items
      .append('text')
      .attr('transform', 'translate(0, 26)')
      .classed('horizontal-bar__value', true)
      .style('fill', d => color(d.value))
      .style('font-weight', '700')
      .text(d => new FormatNumber(d.value).format());

    if (
      this.widgetInfo &&
      this.widgetInfo.jsonParameters &&
      this.widgetInfo.jsonParameters.filter &&
      (this.widgetInfo.jsonParameters.filter.value === 'Facebook' ||
        this.widgetInfo.jsonParameters.filter.value === 'Twitter' ||
        this.widgetInfo.jsonParameters.filter.value === 'Blogs')
    ) {
      items
        .append('path')
        .classed('logo-float-right__value', true)
        .attr(
          'transform',
          d => `translate(${this.xScale(d.value) + 30}) scale(0.8)`
        )
        .attr('stroke', '#202020')
        .attr('fill', 'none')
        .attr('d', SHARE_ICON_PATH);
    }

    items
      .append('line')
      .filter((e, i) => i !== this.data.length - 1)
      .attr('transform', 'translate(0, 38)')
      .attr('y2', 0)
      .classed('horizontal-bar__separator', true)
      .style('stroke', '#eee');

    this.resizing();
  }

  resize(first) {
    const width = Math.max(
      0,
      this.element.offsetWidth - MARGIN.left - MARGIN.right
    );
    const height = Math.max(
      0,
      this.element.offsetHeight - MARGIN.top - MARGIN.bottom
    );
    const svg = select(this.element).select('svg');
    const t = transition().duration(first ? DURATION : 0);
    let textLength = 0;

    function renderText(d) {
      this.textContent = d.label;
      textLength = this.getComputedTextLength();
      let text = select(this).text();

      while (
        textLength > width + MARGIN.left + MARGIN.right - 14 &&
        text.length > 0
      ) {
        text = text.slice(0, -1);
        select(this).text(`${text}...`);
        textLength = this.getComputedTextLength();
      }
    }

    svg
      .attr('height', height + MARGIN.top + MARGIN.bottom)
      .attr('width', width + MARGIN.left + MARGIN.right);

    this.xScale.range([0, width]);

    svg
      .selectAll('.horizontal-bar__item')
      .attr(
        'transform',
        (d, i) => `translate(0, ${i * (height / this.data.length)})`
      );

    svg.selectAll('.horizontal-bar__tag tspan').each(renderText);

    svg
      .selectAll('.horizontal-bar__bar')
      .transition(t)
      .attr('width', d => this.xScale(d.value));

    svg
      .selectAll('.horizontal-bar__shadow')
      .transition(t)
      .attr(
        'width',
        d => (this.xScale(d.value) > 7 ? this.xScale(d.value) - 7 : 0)
      );

    svg
      .selectAll('.horizontal-bar__value')
      .transition(t)
      .attr('x', d => this.xScale(d.value) + 12);

    svg
      .selectAll('.logo-float-right__value')
      .transition(t)
      .attr(
        'transform',
        d => `translate(${this.xScale(d.value) + 30}, 14) scale(0.8)`
      );

    svg
      .selectAll('.horizontal-bar__separator')
      .attr('x2', width + MARGIN.left + MARGIN.right);
  }
}

export default HorizontalBar;
