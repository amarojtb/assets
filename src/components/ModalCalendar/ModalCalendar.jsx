import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import SearchStore from 'stores/SearchStore';
import swal from 'sweetalert';
import moment from 'moment';
import Svg from 'components/Svg';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Scroll from 'components/Scroll';
import { zeroFill } from 'services/StringUtils';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import DateSelectorNavigator from './DateSelectorNavigator';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  reset: PropTypes.func,
};

const defaultProps = {
  reset: Function.prototype,
};

const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0);

class ModalCalendar extends Component {
  static getDefaultClassNames() {
    return {
      container: 'DayPicker',
      wrapper: 'DayPicker-wrapper',
      interactionDisabled: 'DayPicker--interactionDisabled',
      months: 'DayPicker-Months',
      month: 'DayPicker-Month',

      navBar: 'DayPicker-NavBar',
      navButtonPrev: 'DayPicker-NavButton DayPicker-NavButton--prev',
      navButtonNext: 'DayPicker-NavButton DayPicker-NavButton--next',
      navButtonInteractionDisabled: 'DayPicker-NavButton--interactionDisabled',

      caption: 'DayPicker-Caption',
      weekdays: 'DayPicker-Weekdays',
      weekdaysRow: 'DayPicker-WeekdaysRow',
      weekday: 'DayPicker-Weekday',
      body: 'DayPicker-Body',
      week: 'DayPicker-Week',
      weekNumber: 'DayPicker-WeekNumber',
      day: 'DayPicker-Day',
      footer: 'DayPicker-Footer',
      todayButton: 'DayPicker-TodayButton',

      // default modifiers
      today: 'today',
      selected: 'selected',
      disabled: 'disabled',
      outside: 'outside',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      enteredTo: null,
      from: null,
      minuteFrom: '00',
      minuteTo: '59',
      hourFrom: '00',
      hourTo: '23',
      modalIsOpen: false,
      month: fromMonth,
      to: null,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
    this.handleValidationClick = this.handleValidationClick.bind(this);
  }

  componentWillMount() {
    const { functional } = this.props;
    const lastPeriod = JSON.parse(SearchStore.getLastPeriod());
    lastPeriod.from =
      (lastPeriod.from && lastPeriod.from.replace(' ', 'T')) || lastPeriod.from;
    lastPeriod.to =
      (lastPeriod.to && lastPeriod.to.replace(' ', 'T')) || lastPeriod.to;
    if (lastPeriod && lastPeriod.logicalDate === '5' && !functional) {
      const month = new Date(lastPeriod.from).getMonth();
      this.setState({
        month: new Date(new Date().getFullYear(), month),
        from: new Date(lastPeriod.from),
        to: new Date(lastPeriod.to),
      });
    } else {
      this.setState({
        month: new Date(new Date().getFullYear(), new Date().getMonth()),
      });
    }
  }

  handleOpenModal() {
    this.setState({
      modalIsOpen: true,
    });
  }

  handleCloseModal() {
    const { reset } = this.props;

    this.setState({
      modalIsOpen: false,
    });
    if (typeof reset === 'function') {
      reset();
    }
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }

  handleResetClick() {
    this.setState({
      from: null,
      to: null,
    });
  }

  handleYearMonthChange(date) {
    this.setState({
      month: date,
    });
  }

  handleMinutesChange(type) {
    const selectedMinute = type === 'from' ? 'minuteFrom' : 'minuteTo';

    return ev => {
      const date = this.state[type];
      const { value } = ev.target;
      const selectedDate = type === 'from' ? 'from' : 'to';
      date.setMinutes(value);

      this.setState({
        [selectedDate]: date,
        [selectedMinute]: value,
      });
    };
  }

  handleHoursChange(type) {
    // type can be 'from' or 'to';
    const selectedHour = type === 'from' ? 'hourFrom' : 'hourTo';

    return ev => {
      const date = this.state[type];
      const { value } = ev.target;
      const selectedDate = type === 'from' ? 'from' : 'to';
      date.setHours(value);

      this.setState({
        [selectedDate]: date,
        [selectedHour]: value,
      });
    };
  }

  handleValidationClick() {
    const { from, to } = this.state;
    const { onChange } = this.props;

    if (typeof onChange !== 'function') return;

    if (!from || !to) {
      swal({
        title: 'Warning',
        text: window.Messages['Calendar.emptyDateWarning'],
        type: 'warning',
        allowOutsideClick: true,
      });
      return;
    }

    const dates = {
      universalDateFrom:
        (from && moment(from).format('YYYY-MM-DD HH:mm:ss')) || null,
      universalDateTo: (to && moment(to).format('YYYY-MM-DD HH:mm:ss')) || null,
    };

    onChange('custom', dates)();
    this.handleCloseModal();
  }

  renderHours(type) {
    const { hourFrom, hourTo } = this.state;
    let selectedHour;

    if (type === 'from') {
      selectedHour = hourFrom;
    } else {
      selectedHour = hourTo;
    }
    return () => (
      <select
        className="m-left--xx-small"
        onChange={this.handleHoursChange(type)}
        value={selectedHour}
      >
        {[...Array(24).keys()].map((hour, index) => (
          <option key={hour} value={zeroFill(index, 2)}>
            {zeroFill(index, 2)}
          </option>
        ))}
      </select>
    );
  }

  renderMinutes(type) {
    const { minuteFrom, minuteTo } = this.state;
    let selectedMinute;

    if (type === 'from') {
      selectedMinute = minuteFrom;
    } else {
      selectedMinute = minuteTo;
    }

    return () => (
      <select
        className="m-left--xx-small"
        onChange={this.handleMinutesChange(type)}
        value={selectedMinute}
      >
        {[...Array(60).keys()].map((minute, index) => (
          <option key={minute} value={zeroFill(index, 2)}>
            {zeroFill(index, 2)}
          </option>
        ))}
      </select>
    );
  }

  render() {
    const { from, to, modalIsOpen, month } = this.state;
    const modifiers = { start: from, end: to };
    const classNames = {
      ...ModalCalendar.getDefaultClassNames(),
      selected: 'selected secondary-background-color',
    };

    return (
      <Modal
        isOpen={modalIsOpen}
        onCancel={this.handleCloseModal}
        className="c-date-selector__modal"
        width="50"
      >
        <Scroll>
          <div
            onClick={this.handleCloseModal}
            onKeyUp={this.handleCloseModal}
            className="c-date-selector__modal-close"
            role="button"
            tabIndex={0}
          >
            <Svg icon="close" size="small" />
          </div>
          <div className="date-selector__inputs">
            <div className="date-selector__title m-bottom--x-large text-uppercase">
              <FormattedMessage id="DateSelector.modalTitle" />
            </div>
            <div className="m-bottom--medium">
              <div className="date-selector__date align-bottom">
                <div className="date-selector__row m-bottom--medium">
                  <div className="date-selector__from">
                    <div className="date-selector__label p-bottom--x-small">
                      <FormattedMessage id="DateSelector.labelDateStart" />
                    </div>
                    <div className="date-selector__value">
                      <div className="date-selector__date--from p-horizontal--small">
                        {to && window.moment(from).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  </div>
                  <div className="date-selector__to">
                    <div className="date-selector__label p-bottom--x-small p-left--small">
                      <FormattedMessage id="DateSelector.labelTimeStart" />
                    </div>
                    <div className="date-selector__value p-left--x-small">
                      {this.renderHours('from')()}
                      {this.renderMinutes('from')()}
                    </div>
                  </div>
                </div>
                <div className="date-selector__row m-bottom--medium">
                  <div className="date-selector__from">
                    <div className="date-selector__label p-bottom--x-small">
                      <FormattedMessage id="DateSelector.labelDateEnd" />
                    </div>
                    <div className="date-selector__value">
                      <div className="date-selector__date--from p-horizontal--small">
                        {to && window.moment(to).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  </div>
                  <div className="date-selector__to">
                    <div className="date-selector__label p-bottom--x-small p-left--small">
                      <FormattedMessage id="DateSelector.labelTimeEnd" />
                    </div>
                    <div className="date-selector__value p-left--x-small">
                      {this.renderHours('to')()}
                      {this.renderMinutes('to')()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="p-horizontal--large pull--right"
              type="success"
              onClick={this.handleValidationClick}
            >
              <FormattedMessage id="Global.ok" />
            </Button>
          </div>
          <DayPicker
            month={month}
            className="c-date-picker-range__calendar"
            classNames={classNames}
            numberOfMonths={1}
            modifiers={modifiers}
            selectedDays={[from, { from, to }]}
            onDayClick={this.handleDayClick}
            showOutsideDays
            fixedWeeks
            localeUtils={MomentLocaleUtils}
            locale={km.getLang()}
            onMonthChange={this.handleMonthChange}
            captionElement={({ date, localeUtils }) => (
              <DateSelectorNavigator
                date={date}
                localeUtils={localeUtils}
                onChange={this.handleYearMonthChange}
              />
            )}
          />
        </Scroll>
      </Modal>
    );
  }
}

ModalCalendar.propTypes = propTypes;
ModalCalendar.defaultProps = defaultProps;
export default injectIntl(ModalCalendar, { withRef: true });
