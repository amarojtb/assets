/**
 * Fieldset is used to group several controls within a web form.
 */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import FieldsetRow from './FieldsetRow';

const propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
};
const defaultProps = {
  label: null,
};

class Fieldset extends PureComponent {
  renderLabel() {
    const { label } = this.props;

    return <legend className="c-form-element__label">{label}</legend>;
  }

  render() {
    const { children, label } = this.props;

    return (
      <fieldset className="c-form-element">
        {label && this.renderLabel()}
        <div className="c-form-element__group">{children}</div>
      </fieldset>
    );
  }
}

Fieldset.defaultProps = defaultProps;
Fieldset.propTypes = propTypes;
export default Fieldset;
export { FieldsetRow };
