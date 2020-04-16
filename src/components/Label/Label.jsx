import PropTypes from 'prop-types';
import React from 'react';
import './Label.css';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const Label = props => {
  const { children } = props;

  return <span className="label">{children}</span>;
};

Label.propTypes = propTypes;

export default Label;
