import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
const defaultProps = {
  className: '',
};

const ModalFooter = ({ children, className }) => {
  const modalFooterClassNames = classnames('modal__footer', className);

  return <div className={modalFooterClassNames}>{children}</div>;
};

ModalFooter.defaultProps = defaultProps;
ModalFooter.propTypes = propTypes;
export default ModalFooter;
