import React from 'react';
import PropTypes from 'prop-types';
import Svg from 'components/Svg';

const propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  mode: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  icon: PropTypes.string,
};

const defaultProps = {
  mode: 'list',
  icon: null,
};

const DateSelectorItem = ({ label, mode, onClick, icon, selected }) => (
  <div
    className={`date-selector_list__item ${(selected &&
      'date-selector_list__item--selected') ||
      ''}`}
    onClick={onClick(mode)}
    onKeyUp={onClick(mode)}
    role="button"
    tabIndex={0}
  >
    <div className="date-selector_list__item-name text-truncate">{label}</div>
    {icon && (
      <span className="date-selector_list__item-icon">
        <Svg icon={icon} />
      </span>
    )}
  </div>
);

DateSelectorItem.propTypes = propTypes;
DateSelectorItem.defaultProps = defaultProps;
export default DateSelectorItem;
