import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
};

const TwitterExpandedTonalityItem = ({ item: { id, name, value } }) => (
  <div
    className={classnames(
      'c-twitter-tonality__item',
      `c-twitter-tonality__item--${id}`
    )}
  >
    <div className="c-twitter-tonality__content">
      <div className="c-twitter-tonality__value">{value}</div>
      <div className="c-twitter-tonality__name text-truncate" title={name}>
        {name}
      </div>
    </div>
  </div>
);

TwitterExpandedTonalityItem.propTypes = propTypes;
export default TwitterExpandedTonalityItem;
