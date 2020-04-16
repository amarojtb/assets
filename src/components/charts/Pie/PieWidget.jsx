import PropTypes from 'prop-types';
import React, { Component } from 'react';
import parameters from 'constants/parameters';
import Widget, { widgetPropTypes } from 'components/Widget/Widget';
import { FormatNumber, ACCOUNT } from 'services/AppUtils';
import Pie from './Pie';
import './PieWidget.css';

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
const { BREAKPOINT } = parameters;

class PieWidget extends Component {
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
      windowWidth: window.innerWidth,
    };

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { series } } = nextProps;

    if (this.pie != null && series != null) {
      this.pie.update(series);
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

  onResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  createChart() {
    const { params, widget: { id, jsonParameters } } = this.props;
    const element = document.getElementById(`pie-${id}`);

    if (this.pie == null && params.series != null && element != null) {
      this.pie = new Pie(element, params, jsonParameters);
      this.forceUpdate();
    }

    window.addEventListener('resize', this.onResize);
  }

  deleteChart() {
    if (this.pie != null) {
      this.pie.destroy();
      this.pie = null;
    }

    window.removeEventListener('resize', this.onResize);
  }

  renderChart() {
    const { widget: { id } } = this.props;
    const { windowWidth } = this.state;

    return (
      <div className="c-pie-widget_wrapper">
        <div className="c-pie-widget" id={`pie-${id}`} />
        {this.pie != null && windowWidth > BREAKPOINT.sm
          ? this.renderLegend()
          : null}
      </div>
    );
  }

  renderLegend() {
    const { params: { series } } = this.props;

    return (
      <div className="c-pie-widget-legend">
        <ul className="c-pie-widget-legend__list list-unstyled">
          {series.map(
            ({ key, label, value }) =>
              key === 'other' && value === 0 ? null : (
                <li className="c-pie-widget-legend__item" key={key}>
                  <span className="c-pie-widget-legend__col c-pie-widget-legend__col--color">
                    <span
                      className="c-pie-widget-legend__color"
                      style={{ backgroundColor: this.pie.getColor(key) }}
                    />
                  </span>
                  <span
                    className={`c-pie-widget-legend__col c-pie-widget-legend__col--label ${!ACCOUNT.isNato() &&
                      'text-truncate'} ${ACCOUNT.isNato() && 'nato-font-size'}`}
                  >
                    {PieWidget.truncate(label)}
                  </span>
                  <span
                    className={`c-pie-widget-legend__col c-pie-widget-legend__col--value text-truncate ${ACCOUNT.isNato() &&
                      'w-15 '}`}
                  >
                    {new FormatNumber(value).format()}
                  </span>
                </li>
              )
          )}
        </ul>
      </div>
    );
  }

  render() {
    const { params: { series }, widget } = this.props;

    return (
      <Widget widget={widget}>
        {series == null ? null : this.renderChart()}
      </Widget>
    );
  }
}

PieWidget.propTypes = propTypes;
export default PieWidget;
