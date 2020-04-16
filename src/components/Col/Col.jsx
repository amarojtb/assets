import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import './Col.css';

const propTypes = {
  align: PropTypes.oneOf(['bottom', 'middle', 'top']),
  children: PropTypes.node,
  className: PropTypes.string,
  gutter: PropTypes.number,
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  xl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
const defaultProps = {
  align: 'top',
  children: null,
  className: '',
  gutter: null,
  lg: null,
  md: null,
  sm: null,
  xl: null,
  xs: null,
};
const contextTypes = {
  gutter: PropTypes.number,
};

const Col = (props, context) => {
  const { align, children, className, md, sm, lg, xl, xs } = props;
  const gutter = props.gutter ? props.gutter : context.gutter;
  const layout = {};

  if (md) {
    layout[`col--md-${md}`] = md;
  }

  if (lg) {
    layout[`col--lg-${lg}`] = lg;
  }

  if (sm) {
    layout[`col--sm-${sm}`] = sm;
  }

  if (xl) {
    layout[`col--xl-${xl}`] = xl;
  }

  if (xs) {
    layout[`col--xs-${xs}`] = xs;
  }

  const colClassNames = classnames('col', layout, className);

  return (
    <div
      className={colClassNames}
      style={{
        paddingLeft: gutter > 0 && `${gutter / 2}rem`,
        paddingRight: gutter > 0 && `${gutter / 2}rem`,
        verticalAlign: align,
      }}
    >
      {children}
    </div>
  );
};

Col.contextTypes = contextTypes;
Col.defaultProps = defaultProps;
Col.propTypes = propTypes;
export default Col;
