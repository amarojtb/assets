import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'components/Button';
import Svg from 'components/Svg';

const propTypes = {
  actionName: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  iconName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  text: PropTypes.string,
};
const defaultProps = {
  actionName: null,
  children: null,
  className: '',
  iconName: null,
  text: null,
};

const ModalHeader = ({
  actionName,
  children,
  className,
  iconName,
  onClose,
  text,
}) => {
  const modalHeaderClassNames = classnames('modal__header', className);

  return (
    <div className={modalHeaderClassNames}>
      <Button
        className="modal__close u-position--absolute u-pin--top-right"
        onClick={onClose}
      >
        <Svg icon="close" size="x-small" />
      </Button>
      <div className="modal__title text-light">
        {iconName == null ? null : (
          <Svg className="m-right--x-small" icon={iconName} size="x-large" />
        )}
        {actionName != null && text != null ? (
          <span className="align-middle">
            <span className="text-bold">{actionName}</span>{' '}
            <span className="text-light">{text}</span>
          </span>
        ) : null}
        {children}
      </div>
    </div>
  );
};

ModalHeader.defaultProps = defaultProps;
ModalHeader.propTypes = propTypes;
export default ModalHeader;
