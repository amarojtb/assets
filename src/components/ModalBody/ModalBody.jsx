import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  className: PropTypes.string,
};
const defaultProps = {
  className: '',
};

const ModalBody = props => {
  const { className } = props;
  const modalBodyClassNames = classnames('modal__body', className);

  return <div {...props} className={modalBodyClassNames} />;
};

ModalBody.defaultProps = defaultProps;
ModalBody.propTypes = propTypes;
export default ModalBody;
