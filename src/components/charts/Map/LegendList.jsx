import PropTypes from 'prop-types';
import React from 'react';
import LegendItem from './LegendItem';

const propTypes = {
  tabLegend: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

const LegendList = ({ tabLegend }) => (
  <div className="map-legend__list">
    {tabLegend.map(item => (
      <LegendItem item={item} key={item.color + item.type} />
    ))}
  </div>
);

LegendList.propTypes = propTypes;
export default LegendList;
