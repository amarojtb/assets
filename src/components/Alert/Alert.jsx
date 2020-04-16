import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import './Alert.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf([
    'danger',
    'default',
    'error',
    'info',
    'success',
    'warning',
  ]).isRequired,
};
const defaultProps = {
  className: '',
};

const Alert = ({ children, className, type }) => {
  const alertClassNames = classnames('alert', `alert--${type}`, className);

  return <div className={alertClassNames}>{children}</div>;
};

Alert.defaultProps = defaultProps;
Alert.propTypes = propTypes;
export default Alert;
