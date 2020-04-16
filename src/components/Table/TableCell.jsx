/**
 * A cell of a Table.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  action: PropTypes.bool,
  children: PropTypes.node,
  dataLabel: PropTypes.string,
  title: PropTypes.string,
  truncate: PropTypes.bool,
  wrap: PropTypes.bool,
};
const defaultProps = {
  action: false,
  children: null,
  dataLabel: '',
  title: null,
  truncate: true,
  wrap: false,
};

const TableCell = ({ action, children, dataLabel, title, truncate, wrap }) => {
  const divProps = {
    className: truncate ? 'text-truncate' : '',
    ...(typeof children === 'string' ? { title: children } : {}),
  };
  const renderContent = action ? children : <div {...divProps}>{children}</div>;
  const cellClassNames = classnames({
    'u-text-align--right': action,
    'cell-wrap': wrap,
  });

  return (
    <td
      className={cellClassNames}
      data-label={dataLabel}
      role="gridcell"
      title={title}
    >
      {renderContent}
    </td>
  );
};

TableCell.defaultProps = defaultProps;
TableCell.propTypes = propTypes;
export default TableCell;
