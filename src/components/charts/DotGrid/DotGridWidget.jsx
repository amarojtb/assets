import React, { Component } from 'react';
import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import Widget, { widgetPropTypes } from 'components/Widget';
import DotGrid from './DotGrid';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class DotGridWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colors: [],
    };

    this.handleSendColors = this.handleSendColors.bind(this);
  }

  handleSendColors(colors) {
    this.setState({ colors });
  }

  renderLegend() {
    const { params: { data } } = this.props;
    const { colors } = this.state;
    const maxValue = Math.max(...data.map(({ value }) => value));
    const maxValueItem = data.find(({ value }) => value === maxValue);
    const maxValueKey = maxValueItem == null ? null : maxValueItem.key;
    const total = data.reduce((previous, { value }) => previous + value, 0);
    const totalPercent = data.reduce(
      (previous, { value }) =>
        previous +
        (value === 0 && total === 0 ? 0 : Math.round(value * 100 / total)),
      0
    );
    const assignPercent = item => {
      const percent =
        item.value === 0 && total === 0
          ? 0
          : Math.round(item.value * 100 / total);

      if (totalPercent === 0) {
        return { ...item, percent };
      } else if (totalPercent < 100 && item.key === maxValueKey) {
        return { ...item, percent: percent + 1 };
      } else if (totalPercent > 100 && item.key === maxValueKey) {
        return { ...item, percent: percent - 1 };
      }

      return { ...item, percent };
    };
    const assignColor = (item, index) => ({ ...item, color: colors[index] });
    const sortValueInDescOrder = (a, b) => b.value - a.value;

    return (
      <div className="c-dot-grid-widget-legend">
        <ul className="c-dot-grid-widget-legend__list">
          {data
            .map(assignPercent)
            .map(assignColor)
            .sort(sortValueInDescOrder)
            .slice(0, 3)
            .map(({ color, key, label, percent }) => (
              <li
                className="c-dot-grid-widget-legend__item"
                key={key}
                style={{ color }}
              >
                <span
                  className="c-dot-grid-widget-legend__color"
                  style={{ backgroundColor: color }}
                />
                <span className="c-dot-grid-widget-legend__text">
                  <span className="c-dot-grid-widget-legend__value">
                    <FormattedNumber style="percent" value={percent / 100} />
                  </span>
                  <span className="c-dot-grid-widget-legend__label">
                    {label}
                  </span>
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  renderChart() {
    const { params: { data } } = this.props;

    return (
      <div className="c-dot-grid-widget-container">
        <DotGrid
          data={data.map(item => ({ ...item, active: true }))}
          onSendColors={this.handleSendColors}
        />
        {this.renderLegend()}
      </div>
    );
  }

  render() {
    const { params: { data }, widget } = this.props;

    return (
      <Widget widget={widget}>
        {data == null ? null : this.renderChart()}
      </Widget>
    );
  }
}

DotGridWidget.propTypes = propTypes;
export default DotGridWidget;
