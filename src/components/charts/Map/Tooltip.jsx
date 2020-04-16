import { FormattedMessage, FormattedNumber } from 'react-intl';
import React, { Component } from 'react';
import Button from 'components/Button/Button';
import PropTypes from 'prop-types';
import Svg from 'components/Svg/Svg';
import TranslationStore from 'stores/TranslationStore';

const propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
};

class Tooltip extends Component {
  constructor(props) {
    super(props);

    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.refTooltip = this.refTooltip.bind(this);
  }

  handleCloseClick() {
    this.tooltipElement.parentNode.remove();
  }

  refTooltip(ref) {
    this.tooltipElement = ref;
  }

  render() {
    const { color, id, indicator, percent, quantity } = this.props;

    return (
      <div className="p-around--x-small" ref={this.refTooltip}>
        <header className="text-bold text-uppercase">
          {TranslationStore.getCountryByIsoCode(id.toLowerCase()).label}
          <Button
            className="map-tooltip__close u-position--absolute
            u-pin--top-right p-around--xxx-small"
            onClick={this.handleCloseClick}
          >
            <Svg icon="close" size="x-small" />
          </Button>
        </header>
        <div className="u-position--relative">
          <div
            className="map-tooltip__color u-position--absolute"
            style={{ backgroundColor: color }}
          />
          <div
            className="map-tooltip__percent m-left--large text-thin
          text-align--center"
          >
            <FormattedNumber style="percent" value={percent} />
          </div>
        </div>
        <div className="text-align--center">
          <FormattedMessage
            id={`Map.textValueTooltip${indicator.charAt(0).toUpperCase() +
              indicator.slice(1)}`}
            values={{ value: quantity }}
          />
        </div>
      </div>
    );
  }
}

Tooltip.propTypes = propTypes;
export default Tooltip;
