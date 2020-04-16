/**
 * A row of cells in a Table.
 */
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,
};
const defaultProps = {
  children: null,
  selected: false,
};

const TableRow = ({ children, selected }) => (
  <tr aria-selected={selected} className={selected ? 'is-selected' : ''}>
    {children}
  </tr>
);

TableRow.defaultProps = defaultProps;
TableRow.propTypes = propTypes;
export default TableRow;
