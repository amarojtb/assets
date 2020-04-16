import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import FR from 'rc-calendar/lib/locale/fr_FR';
import EN from 'rc-calendar/lib/locale/en_US';
import CA from 'rc-calendar/lib/locale/ca_ES';
import ES from 'rc-calendar/lib/locale/es_ES';
import IT from 'rc-calendar/lib/locale/it_IT';
import DE from 'rc-calendar/lib/locale/de_DE';
import './RangePicker.css';

const propTypes = {
  onRangeChange: PropTypes.func.isRequired,
};

const Translation = {
  fr: FR,
  en: EN,
  ca: CA,
  es: ES,
  it: IT,
  de: DE,
};

class RangePicker extends Component {
  static disabledDate(current) {
    const date = window.moment();
    date.hour(0);
    date.minute(0);
    date.second(0);
    return current && current.isAfter(date.clone().add(1, 'days')); // can not select days after today
  }

  static newArray(start, end) {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  }

  static disabledTime(time, type) {
    if (type === 'start') {
      return {
        disabledHours() {
          const hours = RangePicker.newArray(0, 60);
          hours.splice(window.moment().hour(), 24 - window.moment().hour());
          return hours;
        },
        disabledMinutes(h) {
          if (h === 20) {
            return RangePicker.newArray(0, 31);
          } else if (h === 23) {
            return RangePicker.newArray(30, 60);
          }
          return [];
        },
        disabledSeconds() {
          return [55, 56];
        },
      };
    }
    return false;
  }

  constructor(props) {
    super(props);

    const defaultDate = window
      .moment()
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0);
    this.state = {
      hoverValue: [defaultDate],
      selectedValue: [defaultDate, window.moment().clone()],
    };
    this.now = defaultDate;
    this.defaultValue = [
      window
        .moment()
        .clone()
        .add(-1, 'months'),
      defaultDate,
    ];
    this.onHoverChange = this.onHoverChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  onHoverChange(hoverValue) {
    this.setState({ hoverValue });
  }

  onChange(params) {
    if (params.length > 1) {
      this.props.onRangeChange(params);
    }
  }

  handleSelect(value) {
    this.setState({
      selectedValue: value,
    });
  }

  render() {
    const language = window.km.getLang();
    const timePickerElement = (
      <TimePickerPanel
        locale={Translation[language] || Translation.en}
        defaultValue={[
          window
            .moment()
            .clone()
            .hours(0)
            .minutes(0)
            .seconds(0)
            .format('HH:mm:ss'),
          window
            .moment()
            .clone()
            .format('HH:mm:ss'),
        ]}
      />
    );
    return (
      <RangeCalendar
        className="c-range-picker"
        showToday={false}
        showOk={false}
        hoverValue={this.state.hoverValue}
        onHoverChange={this.onHoverChange}
        selectedValue={this.state.selectedValue}
        onSelect={this.handleSelect}
        onChange={this.onChange}
        format="DD/MM/YYYY HH:mm:ss"
        locale={Translation[language] || Translation.en}
        dateInputPlaceholder={['Date début', 'Date fin']}
        defaultValue={this.defaultValue}
        disabledDate={RangePicker.disabledDate}
        timePicker={timePickerElement}
      />
    );
  }
}

RangePicker.propTypes = propTypes;
export default RangePicker;
