import PropTypes from 'prop-types';
import React from 'react';

import './SettingsWrapper.css';

const SettingsWrapper = ({ children }) => (
  <div className="c-settings-wrapper">{children}</div>
);

SettingsWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
export default SettingsWrapper;
