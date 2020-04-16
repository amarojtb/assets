import React from "react";
import PropTypes from 'prop-types';

const propTypes = {
  target: PropTypes.string.isRequired,
  rel: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Link = ({ target, rel, href, children }) => {
  return (
    <a href={href} target={target} rel={rel}>
      {children}
    </a>
  );
};

Link.propTypes = propTypes;
export default Link;
