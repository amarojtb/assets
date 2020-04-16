import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'components/Select';

const propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  maxDate: PropTypes.instanceOf(Date).isRequired,
  minDate: PropTypes.instanceOf(Date).isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired,
};

class DatePickerCaption extends Component {
  constructor(props) {
    super(props);

    this.handleMonthSelectChange = this.handleMonthSelectChange.bind(this);
    this.handleYearSelectChange = this.handleYearSelectChange.bind(this);
  }

  handleMonthSelectChange(value) {
    const { onMonthChange } = this.props;
    const month = Number(value);

    onMonthChange(month);
  }

  handleYearSelectChange(value) {
    const { onYearChange } = this.props;
    const year = Number(value);

    onYearChange(year);
  }

  render() {
    const { date, maxDate, minDate, months } = this.props;
    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();
    const displayMonth = date.getMonth();
    const displayYear = date.getFullYear();
    const startMonth = displayYear === minYear ? minDate.getMonth() : 0;
    const endMonth =
      displayYear === maxYear ? maxDate.getMonth() + 1 : undefined;
    const monthOptionElements = months
      .map((name, i) => (
        <option key={name} value={i.toString()}>
          {name}
        </option>
      ))
      .slice(startMonth, endMonth);
    const years = [minYear];

    for (let year = minYear + 1; year <= maxYear; year += 1) {
      years.push(year);
    }
    const yearOptionElements = years.map(year => (
      <option key={year} value={year.toString()}>
        {year}
      </option>
    ));

    if (displayYear > maxYear) {
      yearOptionElements.push(
        <option key="next" disabled value={displayYear.toString()}>
          {displayYear}
        </option>
      );
    }

    const caretClasses = classnames(
      'pt-icon-standard',
      'pt-icon-caret-down',
      'c-date-picker__caption-caret'
    );
    return (
      <div className="c-date-picker__caption">
        <div className="c-date-picker__caption-select c-date-picker__caption-select--month">
          <Select
            className="c-date-picker__month-select"
            onChange={this.handleMonthSelectChange}
            value={displayMonth.toString()}
          >
            {monthOptionElements}
          </Select>
          <span className={caretClasses} />
        </div>
        <div className="c-date-picker__caption-select c-date-picker__caption-select--year">
          <Select
            className="c-date-picker__year-select"
            onChange={this.handleYearSelectChange}
            value={displayYear.toString()}
          >
            {yearOptionElements}
          </Select>
          <span className={caretClasses} />
        </div>
      </div>
    );
  }
}

DatePickerCaption.propTypes = propTypes;
export default DatePickerCaption;
