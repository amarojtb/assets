import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './Row.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  gutter: PropTypes.number,
};
const defaultProps = {
  children: null,
  className: '',
  gutter: 1.25,
};
const childContextTypes = {
  gutter: PropTypes.number,
};

class Row extends Component {
  getChildContext() {
    return { gutter: this.props.gutter };
  }

  render() {
    const { children, className, gutter } = this.props;
    const rowClassNames = classnames('row', className);

    return (
      <div
        className={rowClassNames}
        style={
          gutter > 0
            ? {
                marginLeft: `${gutter / -2}rem`,
                marginRight: `${gutter / -2}rem`,
              }
            : null
        }
      >
        {children}
      </div>
    );
  }
}

Row.childContextTypes = childContextTypes;
Row.defaultProps = defaultProps;
Row.propTypes = propTypes;
export default Row;
