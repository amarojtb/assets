import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import './Loader.css';

const propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
};
const defaultProps = {
  className: '',
  id: null,
  style: null,
};

const Loader = ({ className, id, style }) => (
  <div className={classnames('loader', className)} id={id} style={style}>
    <div className="loader__layout">
      <div className="loader__content" />
    </div>
  </div>
);

Loader.defaultProps = defaultProps;
Loader.propTypes = propTypes;
export default Loader;
