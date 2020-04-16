/**
 * Badges are labels which hold small amounts of information.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import './Badge.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['inverse']),
};
const defaultProps = {
  className: '',
  variant: null,
};

const Badge = ({ children, className, variant }) => {
  const badgeClassNames = classnames(
    'c-badge',
    { [`c-badge--${variant}`]: variant != null },
    className
  );

  return <span className={badgeClassNames}>{children}</span>;
};

Badge.defaultProps = defaultProps;
Badge.propTypes = propTypes;
export default Badge;
