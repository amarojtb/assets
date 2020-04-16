import { injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReactDayPicker from 'react-day-picker';
import Button from 'components/Button';
import DatePickerCaption from 'components/DatePickerCaption';
import Svg from 'components/Svg';
import * as DateUtils from 'services/DateUtils';
import * as StringUtils from 'services/StringUtils';
import './DatePicker.css';

function getDefaultMinDate() {
  const date = new Date();

  date.setFullYear(date.getFullYear() - 3);
  date.setMonth(0, 1);
  return date;
}

function getDefaultMaxDate() {
  const date = new Date();

  date.setFullYear(date.getFullYear());
  date.setMonth(11, 31);
  return date;
}

const propTypes = {
  defaultValue: PropTypes.instanceOf(Date),
  initialMonth: PropTypes.instanceOf(Date),
  intl: intlShape.isRequired,
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date),
};
const defaultProps = {
  defaultValue: null,
  initialMonth: null,
  maxDate: getDefaultMaxDate(),
  minDate: getDefaultMinDate(),
  value: null,
};

class DatePicker extends Component {
  static renderNavBar(props) {
    const {
      classNames,
      onNextClick,
      onPreviousClick,
      showNextButton,
      showPreviousButton,
    } = props;
    const handlePreviousClick = () => {
      if (onPreviousClick) {
        onPreviousClick();
      }
    };
    const handleNextClick = () => {
      if (onNextClick) {
        onNextClick();
      }
    };

    return (
      <div className={classNames.navBar}>
        {showPreviousButton && (
          <Button
            className={classNames.navButtonPrev}
            onClick={handlePreviousClick}
          >
            <Svg icon="chevron-left" />
          </Button>
        )}
        {showNextButton && (
          <Button
            className={classNames.navButtonNext}
            onClick={handleNextClick}
          >
            <Svg icon="chevron-right" />
          </Button>
        )}
      </div>
    );
  }

  constructor(props) {
    super(props);
    let newValue = null;

    if (props.value) {
      newValue = props.value;
    } else if (props.defaultValue) {
      newValue = props.defaultValue;
    }

    let selectedDay;
    if (newValue) {
      selectedDay = newValue.getDate();
    }

    let newInitialMonth = new Date();
    const today = new Date();

    if (props.initialMonth) {
      newInitialMonth = props.initialMonth;
    } else if (newValue) {
      newInitialMonth = newValue;
    } else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
      newInitialMonth = today;
    } else {
      newInitialMonth = DateUtils.getDateBetween([
        props.minDate,
        props.maxDate,
      ]);
    }

    this.state = {
      displayMonth: newInitialMonth.getMonth(),
      displayYear: newInitialMonth.getFullYear(),
      selectedDay,
      value: newValue,
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleMonthSelectChange = this.handleMonthSelectChange.bind(this);
    this.handleYearSelectChange = this.handleYearSelectChange.bind(this);
    this.renderCaption = this.renderCaption.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      let { displayMonth, displayYear, selectedDay } = this.state;

      if (nextProps.value) {
        displayMonth = nextProps.value.getMonth();
        displayYear = nextProps.value.getFullYear();
        selectedDay = nextProps.value.getDate();
      }
      this.setState({
        displayMonth,
        displayYear,
        selectedDay,
        value: nextProps.value,
      });
    }
  }

  setStateWithValueIfUncontrolled(newState, value) {
    return this.setState({
      ...newState,
      ...(this.props.value ? {} : { value }),
    });
  }

  computeValidDateInSpecifiedMonthYear(displayYear, displayMonth) {
    const { minDate, maxDate } = this.props;
    const maxDaysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    let { selectedDay } = this.state;

    if (selectedDay > maxDaysInMonth) {
      selectedDay = maxDaysInMonth;
    }

    let value = new Date(displayYear, displayMonth, selectedDay, 12);

    if (value < minDate) {
      value = minDate;
    } else if (value > maxDate) {
      value = maxDate;
    }

    return value;
  }

  handleDayClick(day, modifiers) {
    const { onChange } = this.props;

    if (!this.props.value) {
      if (!modifiers.disabled) {
        const displayMonth = day.getMonth();
        const displayYear = day.getFullYear();
        const selectedDay = day.getDate();

        this.setState({
          displayMonth,
          displayYear,
          selectedDay,
          value: day,
        });
      }
    }

    if (modifiers.disabled) {
      this.forceUpdate();
    } else {
      onChange(day, true);
      if (this.state.value && this.state.value.getMonth() !== day.getMonth()) {
        this.ignoreNextMonthChange = true;
      }
    }
  }

  handleMonthChange(newDate) {
    const { onChange } = this.props;
    const displayMonth = newDate.getMonth();
    const displayYear = newDate.getFullYear();
    const newValue = this.computeValidDateInSpecifiedMonthYear(
      displayYear,
      displayMonth
    );

    if (this.ignoreNextMonthChange) {
      this.ignoreNextMonthChange = false;
    } else {
      onChange(newValue, false);
    }

    this.setStateWithValueIfUncontrolled(
      { displayMonth, displayYear },
      newValue
    );
  }

  handleMonthSelectChange(displayMonth) {
    const { onChange } = this.props;
    const { value } = this.state;
    const newValue = this.computeValidDateInSpecifiedMonthYear(
      value.getFullYear(),
      displayMonth
    );

    onChange(newValue, false);
    this.setStateWithValueIfUncontrolled({ displayMonth }, newValue);
  }

  handleYearSelectChange(displayYear) {
    const { onChange } = this.props;
    let { displayMonth, value } = this.state;

    if (value) {
      value = this.computeValidDateInSpecifiedMonthYear(
        displayYear,
        displayMonth
      );
      onChange(value, false);
      displayMonth = value.getMonth();
    } else {
      const { minDate, maxDate } = this.props;
      const minYear = minDate.getFullYear();
      const maxYear = maxDate.getFullYear();
      const minMonth = minDate.getMonth();
      const maxMonth = maxDate.getMonth();

      if (displayYear === minYear && displayMonth < minMonth) {
        displayMonth = minMonth;
      } else if (displayYear === maxYear && displayMonth > maxMonth) {
        displayMonth = maxMonth;
      }
    }

    this.setStateWithValueIfUncontrolled({ displayMonth, displayYear }, value);
  }

  renderCaption(props) {
    const { maxDate, minDate } = this.props;

    return (
      <DatePickerCaption
        {...props}
        maxDate={maxDate}
        minDate={minDate}
        onMonthChange={this.handleMonthSelectChange}
        onYearChange={this.handleYearSelectChange}
      />
    );
  }

  render() {
    const { intl: { locale }, maxDate, minDate } = this.props;
    const { displayMonth, displayYear, value } = this.state;
    const classNames = {
      body: 'c-date-picker__body',
      caption: 'c-date-picker__caption',
      container: 'c-date-picker',
      day: 'c-date-picker__day',
      disabled: 'c-date-picker__day--disabled',
      footer: 'c-date-picker__footer',
      interactionDisabled: 'c-date-picker__interaction-disabled',
      month: 'c-date-picker__month',
      navBar: 'c-date-picker__nav-bar',
      navButtonInteractionDisabled:
        'c-date-picker__nav-button--interaction-disabled',
      navButtonNext:
        'c-date-picker__nav-button c-date-picker__nav-button--next',
      navButtonPrev:
        'c-date-picker__nav-button c-date-picker__nav-button--prev',
      outside: 'c-date-picker__day--outside',
      selected: 'c-date-picker__day--selected',
      today: 'c-date-picker__day--today',
      todayButton: 'c-date-picker__today-button',
      week: 'c-date-picker__week',
      weekday: 'c-date-picker__weekday',
      weekdays: 'c-date-picker__weekdays',
      weekdaysRow: 'c-date-picker__weekdays-row',
      wrapper: 'c-date-picker__wrapper',
    };
    const renderDay = day => <span>{day.getDate()}</span>;
    const months = moment
      .months()
      .map(month => StringUtils.capitalizeFirstChar(month));
    const weekdaysLong = moment
      .weekdays()
      .map(month => StringUtils.capitalizeFirstChar(month));
    const weekdaysShort = moment.weekdaysMin();

    return (
      <ReactDayPicker
        canChangeMonth
        captionElement={this.renderCaption}
        classNames={classNames}
        disabledDays={this.disabledDays}
        fromMonth={minDate}
        locale={locale}
        month={new Date(displayYear, displayMonth)}
        months={months}
        navbarElement={DatePicker.renderNavBar}
        onDayClick={this.handleDayClick}
        onMonthChange={this.handleMonthChange}
        renderDay={renderDay}
        selectedDays={value}
        showOutsideDays
        toMonth={maxDate}
        weekdaysLong={weekdaysLong}
        weekdaysShort={weekdaysShort}
      />
    );
  }
}

DatePicker.defaultProps = defaultProps;
DatePicker.propTypes = propTypes;
export default injectIntl(DatePicker);
export { propTypes as DatePickerPropTypes };
