/**
 * Multi-line plain-text editing control.
 */
import classnames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import FormElement from 'components/FormElement';
import Scroll from 'components/Scroll';
import { excludePropertiesFromObject } from 'services/AppUtils';
import './Textarea.css';

const propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  helpMessage: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  props: PropTypes.shape(),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
const defaultProps = {
  className: '',
  error: null,
  helpMessage: null,
  id: null,
  label: null,
  onBlur() {},
  onChange() {},
  props: {},
  readOnly: false,
  required: false,
  rows: 7,
  value: '',
};

class Textarea extends PureComponent {
  constructor(props) {
    super(props);

    this.id = props.id || `textarea-${uuid()}`;

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.refInputCallback = this.refInputCallback.bind(this);
  }

  handleBlur() {
    const { onBlur, props } = this.props;

    if (onBlur) onBlur(this.node.value, props);
  }

  handleChange() {
    const { onChange, props } = this.props;

    if (onChange) onChange(this.node.value, props);
  }

  refInputCallback(ref) {
    this.node = ref;
  }

  render() {
    const {
      className,
      error,
      helpMessage,
      label,
      readOnly,
      required,
      rows,
      value,
      ...restProps
    } = this.props;
    const additionalProps = excludePropertiesFromObject(
      restProps,
      Object.keys(propTypes)
    );
    const textareaClassNames = classnames('c-textarea', className);

    return (
      <FormElement
        controlClassName={readOnly ? 'u-border--bottom' : ''}
        error={error}
        helpMessage={helpMessage}
        id={this.id}
        label={label}
        required={required}
      >
        {readOnly ? (
          <Scroll>
            <span className="c-form-element__static">{value}</span>
          </Scroll>
        ) : (
          <textarea
            className={textareaClassNames}
            id={this.id}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            ref={this.refInputCallback}
            rows={rows}
            value={value}
            {...additionalProps}
          />
        )}
      </FormElement>
    );
  }
}

Textarea.defaultProps = defaultProps;
Textarea.propTypes = propTypes;
export default Textarea;
