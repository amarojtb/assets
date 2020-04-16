import React from "react";
import PropTypes from 'prop-types';

const propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

const Img = ({src, alt}) => {
  return <img src={src} alt={alt} />;
};

Img.propTypes = propTypes;
export default Img;
