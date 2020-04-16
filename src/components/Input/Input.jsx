/**
 * Input is used to create interactive controls for web-based forms
 * in order to accept data from the user.
 */
import classnames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Button from 'components/Button';
import FormElement from 'components/FormElement';
import Svg from 'components/Svg';
import * as ObjectUtils from 'services/ObjectUtils';
import './Input.css';

const propTypes = {
  className: PropTypes.string,
  clearable: PropTypes.bool,
  error: PropTypes.string,
  helpMessage: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  props: PropTypes.objectOf(PropTypes.any),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  style: PropTypes.shape({}),
};
const defaultProps = {
  className: '',
  clearable: false,
  error: null,
  helpMessage: null,
  iconLeft: null,
  iconRight: null,
  label: null,
  onBlur: null,
  onChange: null,
  onFocus: null,
  props: {},
  readOnly: false,
  required: false,
  autoFocus: false,
  style: {},
};

class Input extends Component {
  constructor(props) {
    super(props);

    this.id = `input-${uuid()}`;

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidUpdate() {
    const { autoFocus } = this.props;
    if (autoFocus) this.input.focus();
  }

  handleBlur(event) {
    const { onBlur, props } = this.props;
    const {
      target: { value },
    } = event;

    if (typeof onBlur === 'function') {
      onBlur(value, props);
    }
  }

  handleChange(event) {
    const { onChange, props } = this.props;
    const {
      target: { value },
    } = event;

    if (typeof onChange === 'function') {
      onChange(value, props);
    }
  }

  handleFocus(event) {
    const { onFocus, props } = this.props;
    const {
      target: { value },
    } = event;

    if (typeof onFocus === 'function') {
      onFocus(value, props);
    }
  }

  handleClear() {
    const { onChange, props } = this.props;

    if (typeof onChange === 'function') {
      onChange('', props);
    }
  }

  renderClear() {
    const { clearable, value } = this.props;

    return clearable && value.length > 0 ? (
      <Button
        className="c-input__icon c-input__icon--clearable c-input__icon--right"
        onClick={this.handleClear}
      >
        <Svg icon="close" size="xx-small" />
      </Button>
    ) : null;
  }

  renderLeftIcon() {
    const { iconLeft } = this.props;

    return iconLeft == null ? null : (
      <Svg className="c-input__icon c-input__icon--left" icon={iconLeft} />
    );
  }

  renderRightIcon() {
    const { iconRight } = this.props;

    return iconRight == null ? null : (
      <Svg className="c-input__icon c-input__icon--right" icon={iconRight} />
    );
  }

  render() {
    const {
      className,
      clearable,
      error,
      helpMessage,
      iconLeft,
      iconRight,
      label,
      readOnly,
      required,
      value,
      disableAutocomplete,
      autoFocus,
      style,
      ...restProps
    } = this.props;
    const additionalProps = ObjectUtils.omit(restProps, Object.keys(propTypes));
    const inputClassNames = classnames('c-input', className);
    // inputClassNames = classnames(inputClassNames, error ? 'error' : '');

    return (
      <FormElement
        controlClassName={readOnly ? 'u-border--bottom' : ''}
        error={error}
        hasLeftIcon={iconLeft !== null}
        hasRightIcon={iconRight !== null || clearable}
        helpMessage={helpMessage}
        id={this.id}
        label={label}
        required={required}
      >
        {this.renderLeftIcon()}
        {readOnly ? (
          <span className="c-form-element__static">{value}</span>
        ) : (
          <input
            ref={input => this.input = input}
            className={inputClassNames}
            id={this.id}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            value={value}
            readOnly={disableAutocomplete}
            autoFocus={autoFocus}
            style={style}
            {...additionalProps}
          />
        )}
        {/* {errorMessage && <FormattedMessage id={errorMessage} />} */}
        {this.renderClear()}
        {this.renderRightIcon()}
      </FormElement>
    );
  }
}

Input.defaultProps = defaultProps;
Input.propTypes = propTypes;
export default Input;
