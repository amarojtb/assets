/**
 * A header cell of a Table.
 */
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
const defaultProps = {
  children: null,
  title: null,
  width: null,
};

const TableHeaderCell = ({ children, title, width }) => (
  <th className="t-color-primary-bg" title={title} width={width}>
    <div
      className="text-truncate"
      title={typeof children === 'string' ? children : undefined}
    >
      {children}
    </div>
  </th>
);

TableHeaderCell.defaultProps = defaultProps;
TableHeaderCell.propTypes = propTypes;
export default TableHeaderCell;
