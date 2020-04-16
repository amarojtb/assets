/**
 * The head of a Table.
 */
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {
  children: null,
};

const TableHeader = ({ children }) => (
  <thead>
    <tr className="u-line-height--reset">{children}</tr>
  </thead>
);

TableHeader.defaultProps = defaultProps;
TableHeader.propTypes = propTypes;
export default TableHeader;
