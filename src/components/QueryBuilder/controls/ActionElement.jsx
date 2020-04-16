import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Svg from 'components/Svg';

const ActionElement = props => {
  const { label, className, handleOnClick, title, id, disabled } = props;
  const buttonType =
    (['removeGroup', 'removeRule', 'remove'].includes(id) && 'danger') ||
    'success';
  let component = null;
  switch (id) {
    case 'remove':
      component = (
        <div
          className="rule__delete"
          role="button"
          tabIndex={0}
          onClick={e => handleOnClick(e)}
          onKeyUp={e => handleOnClick(e)}
        >
          <Svg className="btn__icon--left" icon="trash" size="x-large" />
        </div>
      );

      break;
    default:
      component = (
        <Button
          type={buttonType}
          title={title}
          className={className}
          onClick={e => handleOnClick(e)}
          disabled={disabled}
        >
          {/* <FormattedMessage id="Global.cancel" /> */}
          {label}
        </Button>
      );
  }
  return component;
};

ActionElement.displayName = 'ActionElement';

ActionElement.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  handleOnClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default ActionElement;
