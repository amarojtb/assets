import classnames from 'classnames';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import React from 'react';
import './Template.css';

const propTypes = {
  isSelected: PropTypes.bool,
  logo: PropTypes.string,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  templateId: PropTypes.string.isRequired,
};
const defaultProps = {
  isSelected: false,
  logo: null,
};

const Template = ({ isSelected, logo, name, onClick, templateId }) => {
  const handleKeyDown = event => {
    if (event.keyCode === keycode('enter')) {
      onClick();
    }
  };
  const templateClassNames = classnames('c-template', {
    'is-selected': isSelected,
  });
  const templateStyles = {
    backgroundImage: `url('/Areas/Delivery/Content/img/export/templates/\
${templateId}.jpg')`,
  };

  return (
    <div
      aria-checked={isSelected}
      className={templateClassNames}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="radio"
      tabIndex={0}
      style={templateStyles}
    >
      <div className="c-template__content">
        <div className="c-template__name text-truncate" title={name}>
          {name}
        </div>
        {logo == null ? null : <img alt="" src={logo} width="75" />}
      </div>
    </div>
  );
};

Template.defaultProps = defaultProps;
Template.propTypes = propTypes;
export default Template;
