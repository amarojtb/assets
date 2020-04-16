import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import uuid from 'uuid';
import './Checkbox.css';

const propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  classNameLabel: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
};
const defaultProps = {
  checked: false,
  children: null,
  className: '',
  classNameLabel: '',
  disabled: false,
  id: null,
  indeterminate: false,
  title: null,
};

class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.id = `checkbox-${uuid()}`;

    this.refInputCallback = this.refInputCallback.bind(this);
  }

  componentDidMount() {
    this.setIndeterminate(this.props.indeterminate);
  }

  componentWillReceiveProps(nextProps) {
    this.setIndeterminate(nextProps.indeterminate);
  }

  getValue() {
    return this.inputElement.checked;
  }

  setIndeterminate(value) {
    this.inputElement.indeterminate = value;
  }

  refInputCallback(ref) {
    this.inputElement = ref;
  }

  render() {
    const {
      checked,
      children,
      className,
      classNameLabel,
      disabled,
      id,
      indeterminate,
      onChange,
      title,
    } = this.props;
    const checkboxClassNames = classnames('checkbox', className);

    return (
      <div className={checkboxClassNames} title={title}>
        <input
          checked={checked && !indeterminate}
          disabled={disabled}
          id={id || this.id}
          onChange={onChange}
          ref={this.refInputCallback}
          type="checkbox"
        />
        <label
          className={classnames('align-middle', classNameLabel)}
          htmlFor={id || this.id}
        >
          {children}
        </label>
      </div>
    );
  }
}

Checkbox.defaultProps = defaultProps;
Checkbox.propTypes = propTypes;
export default Checkbox;
