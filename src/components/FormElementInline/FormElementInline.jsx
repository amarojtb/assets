/**
 * FormElementInline is a wrapper for each element of a form.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './FormElementInline.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  controlClassName: PropTypes.string,
  error: PropTypes.string,
  hasLeftIcon: PropTypes.bool,
  hasRightIcon: PropTypes.bool,
  helpMessage: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  tooltip: PropTypes.string,
};
const defaultProps = {
  className: '',
  controlClassName: '',
  error: null,
  hasLeftIcon: false,
  hasRightIcon: false,
  helpMessage: null,
  id: '',
  label: null,
  required: false,
  tooltip: '',
};

class FormElementInline extends Component {
  static renderRequired() {
    return <abbr className="required">* </abbr>;
  }

  renderControl() {
    const {
      children,
      controlClassName,
      hasLeftIcon,
      hasRightIcon,
    } = this.props;
    const elementControlClassName = classnames(
      'c-form-element-inline__control',
      {
        'c-input-has-icon': hasLeftIcon || hasRightIcon,
        'c-input-has-icon--left': hasLeftIcon && !hasRightIcon,
        'c-input-has-icon--left-right': hasLeftIcon && hasRightIcon,
        'c-input-has-icon--right': hasRightIcon && !hasLeftIcon,
      },
      controlClassName
    );

    return <div className={elementControlClassName}>{children}</div>;
  }

  renderLabel() {
    const { label, id, required, tooltip } = this.props;

    return (
      <label
        className="c-form-element-inline__label"
        htmlFor={id}
        {...(tooltip ? { 'data-tooltip': tooltip } : {})}
      >
        {required && FormElementInline.renderRequired()}
        {label}
      </label>
    );
  }

  renderHelp() {
    const { error, helpMessage } = this.props;
    const createMarkup = { __html: helpMessage || error };

    return (
      <span
        className="c-form-element-inline__help"
        dangerouslySetInnerHTML={createMarkup}
      />
    );
  }

  render() {
    const { className, error, helpMessage, label, id } = this.props;
    const FormElementInlineClassNames = classnames(
      'c-form-element-inline',
      { 'has-error': error != null },
      className
    );

    return (
      <div className={FormElementInlineClassNames} id={id}>
        {label && this.renderLabel()}
        <div className="c-form-element-inline__wrapper">
          {this.renderControl()}
          {(error || helpMessage) && this.renderHelp()}
        </div>
      </div>
    );
  }
}

FormElementInline.defaultProps = defaultProps;
FormElementInline.propTypes = propTypes;
export default FormElementInline;
