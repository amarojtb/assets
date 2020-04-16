/**
 * Select element presents a menu of options.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import uuid from 'uuid';
import FormElement from 'components/FormElement';
import './Select.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
const defaultProps = {
  className: '',
  error: null,
  label: null,
  required: false,
  disabled: false,
};

class Select extends PureComponent {
  constructor(props) {
    super(props);

    this.id = `select-${uuid()}`;

    this.handleChange = this.handleChange.bind(this);
    this.refSelectCallback = this.refSelectCallback.bind(this);
  }

  handleChange() {
    const { onChange } = this.props;

    if (onChange) {
      onChange(this.selectElement.value);
    }
  }

  refSelectCallback(ref) {
    this.selectElement = ref;
  }

  render() {
    const { children, className, error, label, required, value, disabled } = this.props;
    const selectClassNames = classnames('c-select', className);

    return (
      <FormElement error={error} label={label} required={required}>
        <div className="c-select_container">
          <select
            className={selectClassNames}
            id={this.id}
            onChange={this.handleChange}
            ref={this.refSelectCallback}
            value={value}
            disabled
          >
            {children}
          </select>
        </div>
      </FormElement>
    );
  }
}

Select.defaultProps = defaultProps;
Select.propTypes = propTypes;
export default Select;
