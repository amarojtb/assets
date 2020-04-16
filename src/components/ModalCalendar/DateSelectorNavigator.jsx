/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import DropDown from 'components/DropDown';
import 'react-day-picker/lib/style.css';

const propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  localeUtils: PropTypes.instanceOf(Object).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedYear: PropTypes.number,
};

const defaultProps = {
  selectedYear: new Date().getFullYear(),
};

const currentYear = defaultProps.selectedYear;
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear - 4, 11);

function DateSelectorNavigator({ date, localeUtils, onChange }) {
  const months = localeUtils.getMonths();
  const currentTitle = date.getFullYear();

  const years = [];
  for (
    let i = fromMonth.getFullYear() + 1;
    i >= toMonth.getFullYear();
    i -= 1
  ) {
    years.push(i);
  }

  const handleYearChange = e => {
    const { value } = e.target.dataset;
    const month = Number(date.getMonth());
    onChange(new Date(value, month));
  };

  return (
    <div className="DayPicker-Caption">
      <span>{months[date.getMonth()]}, </span>
      <DropDown
        title={currentTitle.toString()}
        className="c-date-picker-year__selector"
      >
        {years.map(y => (
          <li onClick={handleYearChange} key={y} data-value={y}>
            {y}
          </li>
        ))}
      </DropDown>
    </div>
  );
}

DateSelectorNavigator.propTypes = propTypes;
DateSelectorNavigator.defaultProps = defaultProps;

export default DateSelectorNavigator;
