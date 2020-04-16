import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DatePicker, { DatePickerPropTypes } from 'components/DatePicker';
import TimePicker, { TimePickerPropTypes } from 'components/TimePicker';
import * as DateUtils from 'services/DateUtils';
import './DateTimePicker.css';

const propTypes = {
  datePickerProps: PropTypes.shape(DatePickerPropTypes),
  defaultValue: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  timePickerProps: PropTypes.shape({
    ...TimePickerPropTypes,
    onChange: PropTypes.func,
  }),
  value: PropTypes.instanceOf(Date),
};
const defaultProps = {
  datePickerProps: {},
  defaultValue: new Date(),
  timePickerProps: {},
  value: null,
};

class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    const { defaultValue, value } = this.props;
    const initialValue = value || defaultValue;

    this.state = {
      dateValue: initialValue,
      timeValue: initialValue,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        dateValue: nextProps.value,
        timeValue: nextProps.value,
      });
    } else {
      this.setState({ dateValue: null });
    }
  }

  handleDateChange(dateValue, isUserChange) {
    const { onChange } = this.props;
    const { timeValue } = this.state;

    if (!this.props.value) {
      this.setState({ dateValue });
    }
    const value = DateUtils.getDateTime(dateValue, timeValue);

    onChange(value, isUserChange);
  }

  handleTimeChange(timeValue) {
    const { onChange } = this.props;
    const { dateValue } = this.state;

    if (!this.props.value) {
      this.setState({ timeValue });
    }
    const value = DateUtils.getDateTime(dateValue, timeValue);

    onChange(value, true);
  }

  render() {
    const { datePickerProps, timePickerProps } = this.props;
    const { dateValue, timeValue } = this.state;
    const value = DateUtils.getDateTime(dateValue, timeValue);

    return (
      <div className="c-date-time-picker">
        <DatePicker
          {...datePickerProps}
          onChange={this.handleDateChange}
          value={value}
        />
        <TimePicker
          {...timePickerProps}
          onChange={this.handleTimeChange}
          value={value}
        />
      </div>
    );
  }
}

DateTimePicker.defaultProps = defaultProps;
DateTimePicker.propTypes = propTypes;
export default DateTimePicker;
