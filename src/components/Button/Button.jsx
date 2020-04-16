import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import './Button.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  onDoubleClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'lg']),
  title: PropTypes.string,
  type: PropTypes.oneOf([
    'close',
    'danger',
    'default',
    'icon',
    'info',
    'link',
    'primary',
    'success',
    'warning',
  ]),
};
const defaultProps = {
  children: null,
  className: '',
  disabled: false,
  id: '',
  name: 'button',
  onClick() {},
  onMouseEnter() {},
  onMouseLeave() {},
  onMouseDown() {},
  onDoubleClick() {},
  size: null,
  title: 'button',
  type: null,
};

const Button = ({
  id,
  children,
  className,
  disabled,
  onClick,
  name,
  size,
  type,
  title,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onDoubleClick,
}) => {
  const handleClick = event => onClick(event);
  const buttonClassNames = classnames(
    'btn',
    type && `btn--${type}`,
    size && `btn--${size}`,
    className
  );

  return (
    <button
      className={buttonClassNames}
      disabled={disabled}
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      onClick={handleClick}
      type="button"
      title={title}
      name={name}
    >
      <span hidden>{title}</span>
      {children}
    </button>
  );
};

Button.defaultProps = defaultProps;
Button.propTypes = propTypes;
export default Button;
