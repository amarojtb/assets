import React, { Component } from 'react';
import { FormatNumber } from 'services/AppUtils';
import PropTypes from 'prop-types';
import './KeyFigure.css';

const propTypes = {
  indicator: PropTypes.string,
  segment1OnField: PropTypes.string,
  label: PropTypes.string,
  mountedEvent: PropTypes.func,
  number: PropTypes.string.isRequired,
  order: PropTypes.arrayOf(PropTypes.string),
};
const defaultProps = {
  indicator: null,
  label: null,
  mountedEvent: null,
  order: ['label', 'number'],
};

class KeyFigure extends Component {
  constructor(props) {
    super(props);

    this.handleRefCallback = this.handleRefCallback.bind(this);
  }

  componentDidMount() {
    const { mountedEvent } = this.props;
    const imgElements = this.keyFigureElement;

    if (typeof mountedEvent === 'function') {
      mountedEvent(imgElements);
    }
  }

  getTranslationByIndicator() {
    const { indicator, segment1OnField } = this.props;

    if (indicator == null) {
      return null;
    } else if (
      indicator === 'mediaImpactScore' &&
      segment1OnField == 'customerMetrics.Decimal_MediaImpactScore'
    ) {
      return `${window.Messages['Global.mediaImpactScoreAcronym']} - ` + `NATO`;
    } else if (indicator === 'mediaImpactScore')
      return `${window.Messages['Global.mediaImpactScoreAcronym']} - ${
        window.Messages['Global.averageAbbreviation']
      }`;

    return window.Messages[`Global.${indicator}`];
  }

  handleRefCallback(ref) {
    this.keyFigureElement = ref;
  }

  renderWidget(e, i) {
    const { label, number, segment1OnField } = this.props;

    return {
      label: React.createElement(
        'div',
        {
          className: 'key-figure__label text-thin text-uppercase',
          key: i,
        },
        label == null ? this.getTranslationByIndicator() : label
      ),
      number: React.createElement(
        'div',
        {
          className: 'key-figure__number text-bold',
          key: i,
        },
        Number.isNaN(number)
          ? number
          : new FormatNumber(Number(number)).format()
      ),
    }[e];
  }

  render() {
    const { order } = this.props;

    return (
      <div
        className="key-figure u-position--relative u-full-width u-full-height"
        ref={this.handleRefCallback}
      >
        <div
          className="key-figure__layout u-position--absolute u-full-width
          text-align--center"
        >
          {order.map((e, i) => this.renderWidget(e, i))}
        </div>
      </div>
    );
  }
}

KeyFigure.propTypes = propTypes;
KeyFigure.defaultProps = defaultProps;
export default KeyFigure;
