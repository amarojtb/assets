import React from 'react';
import PropTypes from 'prop-types';

import './ButtonGroup.css';

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {
  children: null,
};

const ButtonGroup = ({ children }) => (
  <div className="c-button-group">{children}</div>
);

ButtonGroup.defaultProps = defaultProps;
ButtonGroup.propTypes = propTypes;
export default ButtonGroup;
