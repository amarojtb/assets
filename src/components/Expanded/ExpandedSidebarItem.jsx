import PropTypes from 'prop-types';
import React from 'react';
import Highlight from 'react-highlighter';
import Checkbox from 'components/Checkbox';
import './Expanded.css';

const propTypes = {
  filterText: PropTypes.string.isRequired,
  item: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

const ExpandedSidebarItem = ({ filterText, item, onChange }) => {
  const { active, backgroundColor, label } = item;

  return (
    <li className="chart-toggle__item">
      <Checkbox
        checked={active}
        classNameLabel="text-truncate align-top"
        onChange={() => onChange(item)}
      >
        <Highlight
          matchClass="text-search"
          matchElement="mark"
          search={filterText}
        >
          {label}
        </Highlight>
      </Checkbox>
      <span className="chart-toggle__color" style={{ backgroundColor }} />
    </li>
  );
};

ExpandedSidebarItem.propTypes = propTypes;
export default ExpandedSidebarItem;
