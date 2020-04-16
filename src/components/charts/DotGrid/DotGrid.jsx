import { scaleOrdinal } from 'd3-scale';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import parameters from 'constants/parameters';
import './DotGrid.css';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  onSendColors: PropTypes.func.isRequired,
};
const defaultProps = {
  data: [],
};

class DotGrid extends Component {
  static renderDot(dotSize, backgroundColor, key) {
    const style = {
      backgroundColor,
      height: Math.floor(dotSize / 10 * 8),
      margin: Math.floor(dotSize / 10),
      width: Math.floor(dotSize / 10 * 8),
    };

    return <span className="c-dot-grid__dot" key={key} style={style} />;
  }

  constructor(props) {
    super(props);

    this.interval = 0;

    this.onResize = this.onResize.bind(this);
    this.refLayoutCallback = this.refLayoutCallback.bind(this);
  }

  componentDidMount() {
    const { data, onSendColors } = this.props;

    onSendColors(data.map(item => this.getColor(item.key)));
    window.addEventListener('resize', this.onResize, true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, true);
  }

  onResize() {
    clearTimeout(this.interval);

    this.interval = setTimeout(() => {
      this.forceUpdate();
    }, 400);
  }

  getColor(key) {
    const { data } = this.props;
    const keys = data.map(item => item.key);
    const { COLORS } = parameters;
    const colors = scaleOrdinal(parameters.CHART_COLORS).domain(keys);

    return COLORS[key] ? COLORS[key] : colors(key);
  }

  refLayoutCallback(ref) {
    this.layout = ref;
  }

  render() {
    const { data } = this.props;
    const activeItems = data.filter(({ active }) => active);
    const maxValue = Math.max(...activeItems.map(({ value }) => value));
    const maxValueItem = activeItems.find(({ value }) => value === maxValue);
    const maxValueKey = maxValueItem == null ? null : maxValueItem.key;
    const total = activeItems.reduce(
      (previous, { value }) => previous + value,
      0
    );
    const totalPercent = activeItems.reduce(
      (previous, { value }) => previous + Math.round(value * 100 / total),
      0
    );
    const dotSize = (() => {
      const layoutSize =
        this.layout != null && document.body.contains(this.layout.parentNode)
          ? Math.min(
              this.layout.offsetWidth,
              this.layout.parentNode.offsetHeight
            )
          : 0;

      return layoutSize === 0 ? 0 : Math.round(layoutSize / 10);
    })();
    const dots = activeItems
      .map(({ key, value }) => {
        const arr = [];
        const length = (() => {
          const percent = Math.round(value * 100 / total);

          if (totalPercent < 100 && key === maxValueKey) {
            return percent + 1;
          } else if (totalPercent > 100 && key === maxValueKey) {
            return percent - 1;
          }

          return percent;
        })();
        let i = 0;

        for (; i < length; i += 1) {
          arr.push(DotGrid.renderDot(dotSize, this.getColor(key), key + i));
        }

        return arr;
      })
      .reduce((previous, current) => previous.concat(current), []);
    const rowStyles = dotSize
      ? { height: Math.floor(dotSize / 10 * 8) + Math.floor(dotSize / 10) * 2 }
      : {};

    return (
      <div className="c-dot-grid">
        <div className="c-dot-grid__layout" ref={this.refLayoutCallback}>
          {dots.map(
            ({ key }, index) =>
              index % 10 === 0 && (
                <div className="c-dot-grid__row" key={key} style={rowStyles}>
                  {dots.slice(index, index + 10)}
                </div>
              )
          )}
        </div>
      </div>
    );
  }
}

DotGrid.defaultProps = defaultProps;
DotGrid.propTypes = propTypes;
export default DotGrid;
