/**
 * The body of a Table.
 */
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {
  children: null,
};

const TableBody = ({ children }) => <tbody>{children}</tbody>;

TableBody.defaultProps = defaultProps;
TableBody.propTypes = propTypes;
export default TableBody;
