/**
 * FormElement is a wrapper for each element of a form.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './FormElement.css';

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
  themableLabel: PropTypes.bool,
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
  themableLabel: false,
};

class FormElement extends Component {
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
      'c-form-element__control',
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
    const { label, id, required, tooltip, themableLabel } = this.props;

    return (
      <label
        className={`c-form-element__label ${(themableLabel &&
          't-color-primary') ||
          null}`}
        htmlFor={id}
        {...(tooltip ? { 'data-tooltip': tooltip } : {})}
      >
        {required && FormElement.renderRequired()}
        {label}
      </label>
    );
  }

  renderHelp() {
    const { error, helpMessage } = this.props;
    const createMarkup = { __html: helpMessage || error };

    return (
      <span
        className="c-form-element__help"
        dangerouslySetInnerHTML={createMarkup}
      />
    );
  }

  render() {
    const { className, error, helpMessage, label, id } = this.props;
    const formElementClassNames = classnames(
      'c-form-element',
      { 'has-error': error != null },
      className
    );

    return (
      <div className={formElementClassNames} id={id}>
        {label && this.renderLabel()}
        {this.renderControl()}
        {(error || helpMessage) && this.renderHelp()}
      </div>
    );
  }
}

FormElement.defaultProps = defaultProps;
FormElement.propTypes = propTypes;
export default FormElement;
