import React, { useEffect, useRef } from "react";
import classnames from 'classnames';
import PropTypes from 'prop-types';
// import svg4everybody from 'svg4everybody';

import './Svg.css';

const propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
};
const defaultProps = {
  className: '',
  size: 'medium',
};

const Svg = ({ className , icon, size}) => {
  const refIcon = useRef(null);
  // useEffect(() => {
  //   const { icon } = this.props;
  //   const path = this.icon.getElementsByTagName("path")[0];

  //   if (path != null) {
  //     const use = document.createElement("use");

  //     path.remove();
  //     use.setAttribute("xlink:href", `/build/img/sprite.svg#${icon}`);
  //     this.icon.appendChild(use);
  //     svg4everybody();
  //   }
  // }, [className, icon]);

  const iconClassNames = classnames(
    "icon",
    `icon-${icon}`,
    `icon--${size}`,
    className
  );

  return (
    <svg className={iconClassNames} ref={refIcon}>
      <use xlinkHref={`/build/img/sprite.svg#${icon}`} />
    </svg>
  );
};

Svg.defaultProps = defaultProps;
Svg.propTypes = propTypes;
export default Svg;
