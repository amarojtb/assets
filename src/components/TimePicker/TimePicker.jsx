import classnames from 'classnames';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Button from 'components/Button';
import Svg from 'components/Svg';
import * as DateUtils from 'services/DateUtils';
import './TimePicker.css';

const propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  precision: PropTypes.oneOf(['minute', 'second']),
  selectAllOnFocus: PropTypes.bool,
  showArrowButtons: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
};
const defaultProps = {
  className: '',
  defaultValue: null,
  disabled: false,
  precision: 'minute',
  selectAllOnFocus: false,
  showArrowButtons: false,
  value: null,
};
const DEFAULT_MIN_HOUR = 0;
const DEFAULT_MIN_MINUTE = 0;
const DEFAULT_MIN_SECOND = 0;
const DEFAULT_MAX_HOUR = 23;
const DEFAULT_MAX_MINUTE = 59;
const DEFAULT_MAX_SECOND = 59;

function formatTime(time, unit) {
  switch (unit) {
    case 'hour':
      return time.toString();
    case 'minute':
    case 'second':
      return `0${time}`.slice(-2);
    default:
      throw Error('Invalid TimeUnit');
  }
}

function getStringValueFromInputEvent(event) {
  return event.currentTarget.value;
}

function getTimeUnit(date, unit) {
  switch (unit) {
    case 'hour':
      return date.getHours();
    case 'minute':
      return date.getMinutes();
    case 'second':
      return date.getSeconds();
    default:
      throw Error('Invalid TimeUnit');
  }
}

function handleKeyEvent(event, actions, preventDefault = true) {
  Object.keys(actions).forEach(actionKey => {
    const key = Number(actionKey);

    if (event.which === key) {
      if (preventDefault) {
        event.preventDefault();
      }
      actions[key]();
    }
  });
}

function maxTime(unit) {
  const max = {
    hour: DEFAULT_MAX_HOUR,
    minute: DEFAULT_MAX_MINUTE,
    second: DEFAULT_MAX_SECOND,
  };

  return max[unit];
}

function minTime(unit) {
  const min = {
    hour: DEFAULT_MIN_HOUR,
    minute: DEFAULT_MIN_MINUTE,
    second: DEFAULT_MIN_SECOND,
  };

  return min[unit];
}

function isTimeValid(time, unit) {
  return (
    typeof time === 'number' && minTime(unit) <= time && time <= maxTime(unit)
  );
}

function loopTime(time, unit) {
  const max = maxTime(unit);
  const min = minTime(unit);

  if (time > max) {
    return min;
  } else if (time < min) {
    return max;
  }
  return time;
}

function setTimeUnit(time, date, unit) {
  switch (unit) {
    case 'hour':
      date.setHours(time);
      break;
    case 'minute':
      date.setMinutes(time);
      break;
    case 'second':
      date.setSeconds(time);
      break;
    default:
      throw Error('Invalid TimeUnit');
  }
}

class TimePicker extends PureComponent {
  static getFullStateFromValue(value) {
    return {
      hourText: formatTime(value.getHours(), 'hour'),
      minuteText: formatTime(value.getMinutes(), 'minute'),
      secondText: formatTime(value.getSeconds(), 'second'),
      value,
    };
  }

  static renderDivider() {
    return <span className="c-time-picker__divider-text">:</span>;
  }

  constructor(props) {
    super(props);

    const { defaultValue, value } = props;

    if (value) {
      this.state = TimePicker.getFullStateFromValue(props.value);
    } else if (defaultValue) {
      this.state = TimePicker.getFullStateFromValue(props.defaultValue);
    } else {
      this.state = TimePicker.getFullStateFromValue(
        new Date(0, 0, 0, 0, 0, 0, 0)
      );
    }

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.value &&
      !DateUtils.areSameTime(nextProps.value, this.props.value)
    ) {
      this.setState(TimePicker.getFullStateFromValue(nextProps.value));
    }
  }

  decrementTime(unit) {
    const { disabled } = this.props;
    const { value } = this.state;

    if (disabled) {
      return;
    }
    const newTime = getTimeUnit(value, unit) - 1;

    this.updateTime(loopTime(newTime, unit), unit);
  }

  handleBlur(unit, event) {
    const text = getStringValueFromInputEvent(event);

    this.updateTime(parseInt(text, 10), unit);
  }

  handleChange(unit, event) {
    const TWO_DIGITS = /^\d{0,2}$/;
    const text = getStringValueFromInputEvent(event);

    if (TWO_DIGITS.test(text)) {
      switch (unit) {
        case 'hour':
          this.updateState({ hourText: text });
          break;
        case 'minute':
          this.updateState({ minuteText: text });
          break;
        case 'second':
          this.updateState({ secondText: text });
          break;
        default:
          throw Error('Invalid TimeUnit');
      }
    }
  }

  handleFocus(event) {
    const { selectAllOnFocus } = this.props;

    if (selectAllOnFocus) {
      event.currentTarget.select();
    }
  }

  handleKeyDown(unit, event) {
    handleKeyEvent(event, {
      [keycode('up')]: () => this.incrementTime(unit),
      [keycode('down')]: () => this.decrementTime(unit),
      [keycode('enter')]: () => {
        event.currentTarget.blur();
      },
    });
  }

  incrementTime(unit) {
    const { disabled } = this.props;
    const { value } = this.state;

    if (disabled) {
      return;
    }
    const newTime = getTimeUnit(value, unit) + 1;

    this.updateTime(loopTime(newTime, unit), unit);
  }

  maybeRenderArrowButton(icon, onClick) {
    const { showArrowButtons } = this.props;

    return (
      showArrowButtons && (
        <Button className="c-time-picker__arrow-button" onClick={onClick}>
          <Svg icon={icon} />
        </Button>
      )
    );
  }

  updateState(state) {
    const { onChange } = this.props;
    let newState = state;
    const hasNewValue =
      newState.value &&
      !DateUtils.areSameTime(newState.value, this.state.value);

    if (!this.props.value) {
      if (newState.value) {
        newState = TimePicker.getFullStateFromValue(newState.value);
      }
      this.setState(newState);
    } else if (hasNewValue) {
      this.setState(TimePicker.getFullStateFromValue(this.state.value));
    } else {
      this.setState({
        ...newState,
        value: DateUtils.clone(this.state.value),
      });
    }

    if (hasNewValue) {
      onChange(newState.value);
    }
  }

  updateTime(time, unit) {
    const { value } = this.state;

    if (isTimeValid(time, unit)) {
      const newValue = DateUtils.clone(value);

      setTimeUnit(time, newValue, unit);
      this.updateState({ value: newValue });
    } else {
      this.updateState(TimePicker.getFullStateFromValue(value));
    }
  }

  renderInput(className, unit, value) {
    const { disabled } = this.props;

    return (
      <input
        className={classnames('c-time-picker__input', className)}
        disabled={disabled}
        onBlur={event => this.handleBlur(unit, event)}
        onChange={event => this.handleChange(unit, event)}
        onFocus={this.handleFocus}
        onKeyDown={event => this.handleKeyDown(unit, event)}
        value={value}
      />
    );
  }

  render() {
    const { className, disabled, precision } = this.props;
    const { hourText, minuteText, secondText } = this.state;
    const shouldRenderSeconds = precision >= 'second';
    const timePickerClassNames = classnames('c-time-picker', className, {
      'is-disabled': disabled,
    });

    return (
      <div className={timePickerClassNames}>
        <div className="c-time-picker__arrow-row">
          {this.maybeRenderArrowButton('up', () => this.incrementTime('hour'))}
          {this.maybeRenderArrowButton('up', () =>
            this.incrementTime('minute')
          )}
          {shouldRenderSeconds &&
            this.maybeRenderArrowButton('up', () =>
              this.incrementTime('second')
            )}
        </div>
        <div className="c-time-picker__input-row">
          {this.renderInput('c-time-picker__input_hour', 'hour', hourText)}
          {TimePicker.renderDivider()}
          {this.renderInput(
            'c-time-picker__input_minute',
            'minute',
            minuteText
          )}
          {shouldRenderSeconds && TimePicker.renderDivider()}
          {shouldRenderSeconds &&
            this.renderInput(
              'c-time-picker__input_second',
              'second',
              secondText
            )}
        </div>
        <div className="c-time-picker__arrow-row">
          {this.maybeRenderArrowButton('down', () =>
            this.decrementTime('hour')
          )}
          {this.maybeRenderArrowButton('down', () =>
            this.decrementTime('minute')
          )}
          {shouldRenderSeconds &&
            this.maybeRenderArrowButton('down', () =>
              this.decrementTime('second')
            )}
        </div>
      </div>
    );
  }
}

TimePicker.defaultProps = defaultProps;
TimePicker.propTypes = propTypes;
export default TimePicker;
export { propTypes as TimePickerPropTypes };
