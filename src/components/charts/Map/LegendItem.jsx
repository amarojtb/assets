import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

const propTypes = {
  item: PropTypes.shape({
    color: PropTypes.string.isRequired,
    numbers: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    type: PropTypes.string,
  }).isRequired,
};

const LegendItem = ({ item }) => (
  <div className="map-legend__item u-position--relative p-vertical--xx-small">
    <div
      className="map-legend__color u-position--absolute"
      style={{ backgroundColor: item.color }}
    >
      {item.type === 'important' && (
        <svg className="align-top">
          <path
            d="M7,0l1.7,5H14L9.7,8l1.7,5L7,9.9L2.7,13l1.7-5L0,5h5.3L7,0z"
            fill="#fff"
            transform="translate(3, 3.5)"
          />
        </svg>
      )}
    </div>
    {item.type === 'important' ? (
      <div className="map-legend__text text-uppercase">
        <FormattedMessage id="Map.legendMostImportant" />
      </div>
    ) : null}
    {item.type === 'more' ? (
      <div className="map-legend__text text-uppercase">
        <FormattedMessage id="Map.legendMore" values={{ value: 0.5 }} />
      </div>
    ) : null}
    {item.type === 'numbers' ? (
      <div className="map-legend__text text-uppercase">
        <FormattedNumber style="percent" value={item.numbers[0]} />
        {' - '}
        <FormattedNumber style="percent" value={item.numbers[1]} />
      </div>
    ) : null}
    {item.type === 'less' ? (
      <div className="map-legend__text text-uppercase">
        <FormattedMessage id="Map.legendLess" values={{ value: 0.01 }} />
      </div>
    ) : null}
  </div>
);

LegendItem.propTypes = propTypes;
export default LegendItem;
