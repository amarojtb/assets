/**
 * Form represents a document section that contains interactive controls
 * to submit information to a web server.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import './Form.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['stacked', 'horizontal', 'inline', 'compound']),
};
const defaultProps = {
  children: null,
  className: '',
  variant: 'stacked',
};

const Form = ({ children, className, variant }) => {
  const formClassNames = classnames(`c-form--${variant}`, className);

  return <form className={formClassNames}>{children}</form>;
};

Form.defaultProps = defaultProps;
Form.propTypes = propTypes;
export default Form;
