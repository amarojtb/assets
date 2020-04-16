import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
};

class FieldsetRow extends PureComponent {
  render() {
    const { children } = this.props;
    return <div className="c-form-element__row">{children}</div>;
  }
}

FieldsetRow.propTypes = propTypes;
export default FieldsetRow;
