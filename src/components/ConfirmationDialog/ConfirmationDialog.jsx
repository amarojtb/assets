import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import Modal, { ModalBody, ModalFooter, ModalHeader } from 'components/Modal';
import Svg from 'components/Svg';
import Button from 'components/Button';

import './ConfirmationDialog.css';

const ConfirmationDialog = ({
  isModalOpen,
  intl: { formatMessage },
  onCloseModalHandler,
  onValidationClickHandler,
  message,
  icon,
}) => (
  <Fragment>
    <Modal
      isOpen={isModalOpen}
      onCancel={onCloseModalHandler}
      width="small"
      type="secundary"
      className="c-confirmation-dialog"
    >
      <ModalHeader onClose={onCloseModalHandler}>
        <div className="modal__icon">
          <Svg icon={icon} size="xxxx-large" />
        </div>
      </ModalHeader>
      <ModalBody className="text-center">
        <FormattedMessage id={message} />
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={onCloseModalHandler}
          type="default"
          title={formatMessage({ id: 'Global.cancel' })}
        >
          <FormattedMessage id="Global.cancel" />
        </Button>
        <Button
          onKeyUp={onValidationClickHandler}
          onClick={onValidationClickHandler}
          type="primary"
          title={formatMessage({ id: 'Global.ok' })}
        >
          <FormattedMessage id="Global.ok" />
        </Button>
      </ModalFooter>
    </Modal>
  </Fragment>
);

ConfirmationDialog.propTypes = {
  intl: intlShape.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  onCloseModalHandler: PropTypes.func.isRequired,
  onValidationClickHandler: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

ConfirmationDialog.defaultProps = {
  icon: 'question',
};

export default injectIntl(ConfirmationDialog);
