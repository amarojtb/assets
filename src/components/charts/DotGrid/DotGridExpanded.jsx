import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedNumber } from 'react-intl';
import Expanded from 'components/Expanded';
import { widgetPropTypes } from 'components/Widget';
import { FormatNumber } from 'services/AppUtils';
import parameters from 'constants/parameters';
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

class DotGridExpanded extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colors: [],
      selectedKeys: props.params.data.map(({ key }) => key),
    };

    this.handleSendColors = this.handleSendColors.bind(this);
    this.handleToggleChart = this.handleToggleChart.bind(this);
  }

  handleSendColors(colors) {
    this.setState({ colors });
  }

  handleToggleChart(checked, key) {
    const { params: { data } } = this.props;
    const { selectedKeys } = this.state;

    if (key == null) {
      this.setState({
        selectedKeys: checked ? data.map(item => item.key) : [],
      });
    } else {
      this.setState({
        selectedKeys: checked
          ? [...selectedKeys, key]
          : selectedKeys.filter(keyItem => keyItem !== key),
      });
    }
  }

  renderLegend() {
    const { params: { data } } = this.props;
    const { selectedKeys } = this.state;
    const colors = parameters.COLORS;
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
    const filterSelectedValues = ({ key }) => selectedKeys.includes(key);
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
    const assignColor = item => ({ ...item, color: colors[item.key] });

    return (
      <div className="c-dot-grid-expanded-legend">
        <ul className="c-dot-grid-expanded-legend__list">
          {data
            .filter(filterSelectedValues)
            .map(assignPercent)
            .map(assignColor)
            .map(({ color, key, label, percent, value }) => (
              <li
                className="c-dot-grid-expanded-legend__item"
                key={key}
                style={{ color }}
              >
                <div className="c-dot-grid-expanded-legend__col">{label}</div>
                <div className="dot-grid-expanded-legend__col">
                  {new FormatNumber(value).format()}
                </div>
                <div className="c-dot-grid-expanded-legend__col">
                  <FormattedNumber style="percent" value={percent / 100} />
                </div>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  render() {
    const { params: { data }, widget } = this.props;
    const { colors, selectedKeys } = this.state;
    const checkboxes =
      data == null
        ? []
        : data.map((item, index) => ({
            ...item,
            active: selectedKeys.includes(item.key),
            backgroundColor: colors[index],
          }));

    return (
      <Expanded
        checkboxes={checkboxes}
        icon="dot-grid"
        name="dot-grid"
        onToggleChart={this.handleToggleChart}
        widget={widget}
      >
        {data == null ? null : (
          <div className="c-dot-grid_wrapper--expanded">
            <DotGrid
              data={data.map(item => ({
                ...item,
                active: selectedKeys.includes(item.key),
              }))}
              onSendColors={this.handleSendColors}
            />
            {this.renderLegend()}
          </div>
        )}
      </Expanded>
    );
  }
}

DotGridExpanded.propTypes = propTypes;
export default DotGridExpanded;
