import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import DatePicker from 'components/DatePicker';
import DateTimePicker from 'components/DateTimePicker';
import Input from 'components/Input';
import Popover from 'components/Popover/';
import './DateInput.css';

const propTypes = {
  defaultValue: PropTypes.instanceOf(Date),
  intl: intlShape.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  timePrecision: PropTypes.oneOf(['minute', 'second']),
  value: PropTypes.instanceOf(Date),
};
const defaultProps = {
  defaultValue: null,
  label: null,
  onChange: PropTypes.func,
  timePrecision: 'minute',
  value: null,
};

class DateInput extends Component {
  static hasMonthChanged(prevDate, nextDate) {
    return nextDate && prevDate && nextDate.getMonth() !== prevDate.getMonth();
  }

  constructor(props) {
    super(props);
    const defaultValue = props.defaultValue || new Date();

    this.state = {
      isOpen: false,
      value: props.value || defaultValue,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClosePopover = this.handleClosePopover.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChange() {
    const { onChange } = this.props;
    const { value } = this.state;

    onChange(value);
  }

  handleClosePopover() {
    this.setState({ isOpen: false });
  }

  handleDateChange(date, hasUserManuallySelectedDate) {
    const { onChange } = this.props;
    const prevDate = this.state.value;
    const isOpen =
      !hasUserManuallySelectedDate ||
      DateInput.hasMonthChanged(prevDate, date) ||
      this.hasTimeChanged(prevDate, date);
    const newState = { isOpen };

    if (!this.props.value) {
      newState.value = date;
    }
    this.setState(newState);
    onChange(date);
  }

  handleInputChange() {
    this.setState({ isOpen: false });
  }

  handleInputClick() {
    this.setState({ isOpen: true });
  }

  hasTimeChanged(prevDate, nextDate) {
    const { timePrecision } = this.props;

    return (
      prevDate &&
      nextDate &&
      timePrecision &&
      (nextDate.getHours() !== prevDate.getHours() ||
        nextDate.getMinutes() !== prevDate.getMinutes() ||
        nextDate.getSeconds() !== prevDate.getSeconds())
    );
  }

  render() {
    const { intl: { formatDate }, label, timePrecision } = this.props;
    const { isOpen, value } = this.state;

    return (
      <div className="c-date-input">
        <Input
          label={label}
          onChange={this.handleInputChange}
          onClick={this.handleInputClick}
          value={formatDate(value, {
            day: '2-digit',
            hour: timePrecision ? 'numeric' : undefined,
            minute:
              timePrecision === ('minute' || 'second') ? 'numeric' : undefined,
            month: '2-digit',
            second: timePrecision === 'second' ? 'numeric' : undefined,
            year: 'numeric',
          })}
        />
        {isOpen && (
          <Popover onClose={this.handleClosePopover}>
            {timePrecision ? (
              <DateTimePicker
                datePickerProps={this.props}
                onChange={this.handleDateChange}
                timePickerProps={{
                  precision: timePrecision,
                  showArrowButtons: true,
                }}
                value={value}
              />
            ) : (
              <DatePicker onChange={this.handleDateChange} value={value} />
            )}
          </Popover>
        )}
      </div>
    );
  }
}

DateInput.defaultProps = defaultProps;
DateInput.propTypes = propTypes;
export default injectIntl(DateInput);
