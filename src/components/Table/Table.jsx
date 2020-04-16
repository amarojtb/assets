/**
 * Data tables are an enhanced version of an HTML table
 * and are used to display tabular data.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import TableHeaderCell from './TableHeaderCell';
import TableRow from './TableRow';
import './Table.css';

const propTypes = {
  bordered: PropTypes.bool,
  buffer: PropTypes.bool,
  children: PropTypes.node,
  compact: PropTypes.bool,
  fixedLayout: PropTypes.bool,
  noRowHover: PropTypes.bool,
  striped: PropTypes.bool,
  verticalBorders: PropTypes.bool,
};
const defaultProps = {
  bordered: false,
  buffer: false,
  children: null,
  compact: false,
  fixedLayout: false,
  noRowHover: false,
  striped: false,
  verticalBorders: false,
};

class Table extends PureComponent {
  render() {
    const {
      bordered,
      buffer,
      children,
      compact,
      fixedLayout,
      noRowHover,
      striped,
      verticalBorders,
    } = this.props;
    const tableClassName = classnames('c-table', {
      'c-table--bordered': bordered,
      'c-table--cell-buffer': buffer,
      'c-table--col-bordered': verticalBorders,
      'c-table--compact': compact,
      'c-table--fixed-layout': fixedLayout,
      'c-table--striped': striped,
      'no-row-hover': noRowHover,
    });

    return (
      <table className={tableClassName} role="grid">
        {children}
      </table>
    );
  }
}

Table.defaultProps = defaultProps;
Table.propTypes = propTypes;
export default Table;
export { TableBody, TableCell, TableHeader, TableHeaderCell, TableRow };
