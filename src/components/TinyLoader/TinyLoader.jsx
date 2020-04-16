import PropTypes from 'prop-types';
import React from 'react';
import './TinyLoader.css';

const propTypes = {
  className: PropTypes.string,
};
const defaultProps = {
  className: '',
};

const TinyLoader = ({ className }) => (
  <svg viewBox="0 0 50 50" className={`spinner ${className}`}>
    <circle className="ring" cx="25" cy="25" r="22.5" />
    <circle className="line" cx="25" cy="25" r="22.5" />
  </svg>
);

TinyLoader.defaultProps = defaultProps;
TinyLoader.propTypes = propTypes;
export default TinyLoader;
