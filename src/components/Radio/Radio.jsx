/**
 * Radio Input
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Radio.css';

const propTypes = {
  checked: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
const defaultProps = {
  className: '',
  disabled: false,
  value: '',
};

class Radio extends Component {
  constructor(props) {
    super(props);

    this.refInputCallback = this.refInputCallback.bind(this);
  }

  getValue() {
    return this.input.checked;
  }

  refInputCallback(ref) {
    this.input = ref;
  }

  render() {
    const {
      checked,
      children,
      className,
      disabled,
      id,
      name,
      onChange,
      value,
    } = this.props;

    return (
      <div className={classnames('radio', className)}>
        <input
          checked={checked}
          disabled={disabled}
          id={id}
          name={name}
          onChange={onChange}
          ref={this.refInputCallback}
          type="radio"
          value={value}
        />
        <label htmlFor={id}>
          {children == null ? null : (
            <span className="radio__label">{children}</span>
          )}
        </label>
      </div>
    );
  }
}

Radio.defaultProps = defaultProps;
Radio.propTypes = propTypes;
export default Radio;
