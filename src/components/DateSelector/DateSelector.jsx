/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
import React, { Component, Fragment } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import DropDownSelect from 'components/DropDownSelect';
import Radio from 'components/Radio';
import 'react-day-picker/lib/style.css';
import Svg from 'components/Svg/Svg';
import moment from 'moment';
import ModalCalendar from 'components/ModalCalendar';

import DateSelectorItem from './DateSelectorItem';
import './DateSelector.css';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const propTypes = {
  intl: intlShape,
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  intl: {},
};

class DateSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptionId: 'today',
      selectedOption: null,
      selectedDateType: 'delivery',
      expandedDropDown: false,
    };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDateTypeChange = this.handleDateTypeChange.bind(this);
    this.handleToggleDateType = this.handleToggleDateType.bind(this);
    this.renderDropDownTitle = this.renderDropDownTitle.bind(this);
    this.modalCalendarRef = this.modalCalendarRef.bind(this);
  }

  handleOnClick() {
    this.setState({
      expandedDropDown: !this.state.expandedDropDown,
    });
  }

  handleItemClick(selectedOption, dd = {}) {
    const { onChange } = this.props;
    const dates = {
      universalDateFrom: dd.universalDateFrom || '',
      universalDateTo: dd.universalDateTo || '',
      dateFrom: '',
      dateTo: '',
    };

    if (!selectedOption || !dates) return;
    return () => {
      switch (selectedOption) {
        case 'today':
          const todayFrom = moment().startOf('day');
          const todayTo = moment();
          dates.universalDateFrom = todayFrom.format(dateFormat);
          dates.universalDateTo = todayTo.format(dateFormat);
          dates.dateFrom = todayFrom.format(dateFormat);
          dates.dateTo = todayTo.format(dateFormat);
          break;

        case 'yesterday':
          const yesterdayFrom = moment()
            .add(-1, 'days')
            .startOf('day');
          const yesterdayTo = moment();
          dates.universalDateFrom = yesterdayFrom.format(dateFormat);
          dates.universalDateTo = yesterdayTo.format(dateFormat);
          dates.dateFrom = yesterdayTo.format(dateFormat);
          dates.dateTo = yesterdayTo.format(dateFormat);
          break;

        case 'lastweek':
          const lastweekFrom = moment()
            .add(-7, 'days')
            .startOf('day');
          const lastweekTo = moment();
          dates.universalDateFrom = lastweekFrom.format(dateFormat);
          dates.universalDateTo = lastweekTo.format(dateFormat);
          dates.dateFrom = lastweekTo.format(dateFormat);
          dates.dateTo = lastweekTo.format(dateFormat);
          break;

        case 'lastmonth':
          const lastmonthFrom = moment()
            .add(-30, 'days')
            .startOf('day');
          const lastmonthTo = moment();
          dates.universalDateFrom = lastmonthFrom.format(dateFormat);
          dates.universalDateTo = lastmonthTo.format(dateFormat);
          dates.dateFrom = lastmonthTo.format(dateFormat);
          dates.dateTo = lastmonthTo.format(dateFormat);
          break;

        default:
          break;
      }

      let translation = null;

      if (selectedOption === 'custom') {
        if (!dates.universalDateFrom || !dates.universalDateTo) {
          translation =
            window.Messages[`SearchBar.dateSelector.${selectedOption}`];
        } else {
          translation = `
            ${moment(dates.universalDateFrom).format('DD/MM/YYYY')} ⟷
            ${moment(dates.universalDateTo).format('DD/MM/YYYY')}
          `;
        }
      } else {
        translation =
          window.Messages[`SearchBar.dateSelector.${selectedOption}`];
      }

      if (selectedOption === 'custom') {
        this.modalCalendar.getWrappedInstance().handleOpenModal();
      }

      this.setState({
        selectedOptionId: selectedOption,
        selectedOption: translation,
        expandedDropDown: false,
      });

      onChange(selectedOption, dates);
    };
  }

  handleDateTypeChange(event) {
    const {
      target: { value },
    } = event;

    this.setState({
      selectedDateType: value,
      expandedDropDown: true,
    });
  }

  handleToggleDateType(dateType) {
    const { onChange } = this.props;

    return () => {
      onChange('dateType', dateType);

      this.setState({
        selectedDateType: dateType,
        expandedDropDown: true,
      });
    };
  }

  modalCalendarRef(ref) {
    this.modalCalendar = ref;
  }

  renderDropDownTitle() {
    const { selectedOption, selectedDateType } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;
    return (
      <div
        title={
          selectedDateType === 'delivery'
            ? formatMessage({ id: 'Global.deliveredDate' })
            : formatMessage({ id: 'Global.publicationDate' })
        }
      >
        <Svg
          icon={selectedDateType === 'delivery' ? 'clock' : 'publication_date'}
          size="medium"
        />
        <span className="date-text">
          {(selectedOption && selectedOption) ||
            window.Messages['Global.today']}
        </span>
      </div>
    );
  }

  renderOptions() {
    const { selectedDateType, selectedOptionId } = this.state;
    const isDelivery = selectedDateType === 'delivery';
    const isPublication = selectedDateType === 'publication';

    return (
      <ul className="date-selector_list">
        <div className="date-selector_datetype">
          <div
            className="date-selected_datetype__item"
            role="button"
            tabIndex={0}
            onClick={this.handleToggleDateType('delivery')}
            onKeyUp={this.handleToggleDateType('delivery')}
          >
            <Radio
              checked={isDelivery}
              name="f-dateType"
              id="datetype-delivery-f"
              value="delivery"
            >
              <FormattedMessage id="SearchBar.dateSelector.delivery" />
            </Radio>
          </div>
          <div
            className="date-selected_datetype__item"
            role="button"
            tabIndex={0}
            onClick={this.handleToggleDateType('publication')}
            onKeyUp={this.handleToggleDateType('publication')}
          >
            <Radio
              checked={isPublication}
              name="f-dateType"
              id="datetype-publication-f"
              value="publication"
            >
              <FormattedMessage id="SearchBar.dateSelector.publication" />
            </Radio>
          </div>
          <div className="separator" />
        </div>
        <DateSelectorItem
          label={window.Messages['Global.today']}
          mode="today"
          selected={selectedOptionId === 'today'}
          onClick={this.handleItemClick}
        />
        <DateSelectorItem
          label={window.Messages['SearchBar.dateSelector.yesterday']}
          mode="yesterday"
          selected={selectedOptionId === 'yesterday'}
          onClick={this.handleItemClick}
        />
        <DateSelectorItem
          label={window.Messages['SearchBar.dateSelector.lastweek']}
          mode="lastweek"
          selected={selectedOptionId === 'lastweek'}
          onClick={this.handleItemClick}
        />
        <DateSelectorItem
          label={window.Messages['SearchBar.dateSelector.lastmonth']}
          mode="lastmonth"
          selected={selectedOptionId === 'lastmonth'}
          onClick={this.handleItemClick}
        />
        <DateSelectorItem
          label={window.Messages['SearchBar.dateSelector.custom']}
          mode="custom"
          selected={selectedOptionId === 'custom'}
          icon="calendar"
          onClick={this.handleItemClick}
        />
      </ul>
    );
  }

  render() {
    const { expandedDropDown } = this.state;

    return (
      <Fragment>
        <ModalCalendar
          functional
          ref={this.modalCalendarRef}
          onChange={this.handleItemClick}
          reset={this.onSearchObjectUpdate}
        />
        <DropDownSelect
          title={this.renderDropDownTitle}
          onClick={this.handleOnClick}
          collapsed={expandedDropDown}
          className="c-date-selector"
        >
          {this.renderOptions()}
        </DropDownSelect>
      </Fragment>
    );
  }
}

DateSelector.propTypes = propTypes;
DateSelector.defaultProps = defaultProps;
export default injectIntl(DateSelector, { withRef: true });
