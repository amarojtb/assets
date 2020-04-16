import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedNumber } from 'react-intl';
import Expanded from 'components/Expanded/Expanded';
import { widgetPropTypes } from 'components/Widget/Widget';
import { FormatNumber, ACCOUNT } from 'services/AppUtils';
import Pie from './Pie';
import './PieExpanded.css';

const propTypes = {
  params: PropTypes.shape({
    options: PropTypes.shape({
      duration: PropTypes.number.isRequired,
    }),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class PieExpanded extends Component {
  static truncate(label) {
    let string = '';
    if (ACCOUNT.isNato() && label && label.length > 60) {
      string = `${label.substr(0, 58)}...`;
    } else {
      string = label;
    }
    return string;
  }
  constructor(props) {
    super(props);

    this.pie = null;

    this.state = {
      selectedKeys:
        props.params.series == null
          ? []
          : props.params.series.map(({ key }) => key),
    };

    this.handleToggleChart = this.handleToggleChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { series } } = nextProps;

    if (this.pie != null && series != null) {
      this.pie.update(series);
      this.setState({ selectedKeys: series.map(({ key }) => key) });
    } else if (this.pie != null && series == null) {
      this.deleteChart();
    }
  }

  componentDidUpdate() {
    this.createChart();
  }

  componentWillUnmount() {
    this.deleteChart();
  }

  handleToggleChart(checked, key) {
    const { params: { series } } = this.props;
    const { selectedKeys } = this.state;

    if (key == null) {
      this.setState({
        selectedKeys: checked ? series.map(serieItem => serieItem.key) : [],
      });
    } else {
      this.setState({
        selectedKeys: checked
          ? [...selectedKeys, key]
          : selectedKeys.filter(keyItem => keyItem !== key),
      });
    }

    this.pie.toggle(key, checked, key == null);
  }

  createChart() {
    const { params, widget: { id, jsonParameters } } = this.props;
    const element = document.getElementById(`pie-expanded-${id}`);

    if (this.pie == null && params.series != null && element != null) {
      setTimeout(() => {
        this.pie = new Pie(element, params, jsonParameters);
        this.forceUpdate();
      }, 1);
    }
  }

  deleteChart() {
    if (this.pie != null) {
      this.pie.destroy();
      this.pie = null;
    }
  }

  renderChart() {
    const { widget: { id } } = this.props;

    return (
      <div className="c-pie-expanded_wrapper">
        <div className="c-pie-expanded" id={`pie-expanded-${id}`} />
        {this.pie == null ? null : this.renderLegend()}
      </div>
    );
  }

  renderLegend() {
    const { params: { series } } = this.props;
    const { selectedKeys } = this.state;
    const filterSelectedItems = ({ key }) => selectedKeys.includes(key);
    const sortByValue = (a, b) => b.value - a.value;

    const items = series
      .filter(filterSelectedItems)
      .sort(sortByValue)
      .slice(0, 9);
    

    const othersValue = series
      .filter(filterSelectedItems)
      .sort(sortByValue)
      .slice(9, series.length)
      .reduce((previous, current) => previous + current.value, 0);

    let totalPercent = 0;

    const total = Array.from(series.values()).reduce(
      (previous, { value }) => previous + value,
      0
    );

    items.forEach(item => {
      totalPercent += Math.round(item.value * 100 / total);
    });

    return (
      <div className="c-pie-expanded-legend">
        <ul className="c-pie-expanded-legend__list list-unstyled">
          {items.map(item => this.renderLegendItem(item, total))}
          {items.length > 0 && (
            <li className="c-pie-expanded-legend__item">
            <span className="c-pie-expanded-legend__col c-pie-expanded-legend__col--color">
              <span className="c-pie-expanded-legend__color"
                    style={{ backgroundColor: this.pie.getColor('other') }} />
            </span>
            <span className={`c-pie-expanded-legend__col c-pie-expanded-legend__col--label
                  ${!ACCOUNT.isNato() && 'text-truncate' } ${ACCOUNT.isNato() &&
                  'nato-font-size' }`}>
                {PieExpanded.truncate(window.Messages['Global.other'])}
            </span>
            <span className={`c-pie-expanded-legend__col pie-expanded-legend__col--value text-truncate
                  ${ACCOUNT.isNato() && 'w-15 ' }`}>
                {new FormatNumber(othersValue).format()}
            </span>
            <span className={`c-pie-expanded-legend__col c-pie-expanded-legend__col--percent text-truncate
                  ${ACCOUNT.isNato() && 'w-15' }`}>
                {`${100 - totalPercent}%`}
            </span>
            </li>
          ) || null}
        </ul>
      </div>
    );
  }

  renderLegendItem({ key, label, value }, total) {
    const percent = value > 0 ? value / total : 0;
    return (
      <li className="c-pie-expanded-legend__item" key={key}>
        <span className="c-pie-expanded-legend__col c-pie-expanded-legend__col--color">
          <span
            className="c-pie-expanded-legend__color"
            style={{ backgroundColor: this.pie.getColor(key) }}
          />
        </span>
        <span
          className={`c-pie-expanded-legend__col c-pie-expanded-legend__col--label
          ${!ACCOUNT.isNato() && 'text-truncate'} ${ACCOUNT.isNato() &&
            'nato-font-size'}`}
        >
          {PieExpanded.truncate(label)}
        </span>
        <span
          className={`c-pie-expanded-legend__col pie-expanded-legend__col--value text-truncate
          ${ACCOUNT.isNato() && 'w-15 '}`}
        >
          {new FormatNumber(value).format()}
        </span>
        <span
          className={`c-pie-expanded-legend__col c-pie-expanded-legend__col--percent text-truncate
          ${ACCOUNT.isNato() && 'w-15'}`}
        >
          <FormattedNumber style="percent" value={percent} />
        </span>
      </li>
    );
  }

  render() {
    const { params: { series }, widget } = this.props;
    const { selectedKeys } = this.state;
    const checkboxes =
      series == null
        ? null
        : series
            .map(serieItem => ({
              ...serieItem,
              active: selectedKeys.includes(serieItem.key),
              backgroundColor:
                this.pie == null
                  ? 'transparent'
                  : this.pie.getColor(serieItem.key),
            }))
            .sort((a, b) => b.value - a.value);

    return (
      <Expanded
        checkboxes={checkboxes}
        icon="pie"
        name="pie"
        onToggleChart={this.handleToggleChart}
        widget={widget}
      >
        {series == null ? null : this.renderChart()}
      </Expanded>
    );
  }
}

PieExpanded.propTypes = propTypes;
export default PieExpanded;
