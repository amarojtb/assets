/* eslint-disable consistent-return */
import React, { Component, Fragment } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { logicalDateTypes } from 'services/DateUtils';
import DropDownSelect from 'components/DropDownSelect';
import Radio from 'components/Radio';
import SearchStore from 'stores/SearchStore';
import 'react-day-picker/lib/style.css';
import ModalCalendar from 'components/ModalCalendar';
import Svg from 'components/Svg/Svg';
import moment from 'moment';

import DateSelectorItem from './DateSelectorItemSearch';
import './DateSelectorSearch.css';

const propTypes = {
  onChange: PropTypes.func.isRequired,
};

const dateTypes = {
  delivery: 2,
  publication: 1,
};

const reversedDateTypes = {
  2: 'delivery',
  1: 'publication',
};

class DateSelectorSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptionId: null,
      selectedOption: null,
      selectedDateType: 'delivery',
      expandedDropDown: false,
    };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDateTypeChange = this.handleDateTypeChange.bind(this);
    this.renderDropDownTitle = this.renderDropDownTitle.bind(this);
    this.onSearchObjectUpdate = this.onSearchObjectUpdate.bind(this);
    this.modalCalendarRef = this.modalCalendarRef.bind(this);
  }

  componentWillMount() {
    const logicalDate = SearchStore.getLogicalDate(true);

    this.setState({
      selectedOptionId: logicalDateTypes[logicalDate],
    });
    SearchStore.addChangeListener(this.onSearchObjectUpdate);
    SearchStore.addSearchObjectUpdateListener(this.onSearchObjectUpdate);
  }

  componentWillUnmount() {
    SearchStore.removeChangeListener(this.onSearchObjectUpdate);
    SearchStore.removeSearchObjectUpdateListener(this.onSearchObjectUpdate);
  }

  onSearchObjectUpdate() {
    const logicalDate = SearchStore.getLogicalDate();
    const dateType = SearchStore.getDateType();
    const dates = SearchStore.getSearchDates();
    const from = moment(dates.from, 'YYYYMMDD').format('DD/MM/YYYY');
    const to = moment(dates.to, 'YYYYMMDD').format('DD/MM/YYYY');
    let translation = null;

    if (logicalDate === 'custom' || logicalDate === '5') {
      translation = `${from} ⟷ ${to}`;
    } else {
      translation = window.Messages[`SearchBar.dateSelector.${logicalDate}`];
    }

    this.setState({
      selectedOption: translation,
      selectedDateType: reversedDateTypes[dateType],
    });
  }

  handleOnClick() {
    this.setState({
      expandedDropDown: !this.state.expandedDropDown,
    });
  }

  handleItemClick(selectedOption, dates) {
    const { onChange } = this.props;
    if (!selectedOption || !dates || typeof onChange !== 'function') return;
    return () => {
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

      onChange(selectedOption, dates);

      this.setState({
        selectedOptionId: selectedOption,
        selectedOption: translation,
        expandedDropDown: false,
      });
    };
  }

  handleDateTypeChange(event) {
    const { updateFilter } = this.props;
    const {
      target: { value },
    } = event;

    SearchStore.setDateType(dateTypes[value]);
    updateFilter();

    this.setState({
      selectedDateType: value,
      expandedDropDown: true,
    });
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

    return (
      <ul className="date-selector_list">
        <div className="date-selector_datetype">
          <Radio
            checked={selectedDateType === 'delivery'}
            name="dateType"
            id="datetype-delivery"
            value="delivery"
            onChange={this.handleDateTypeChange}
          >
            <FormattedMessage id="SearchBar.dateSelector.delivery" />
          </Radio>
          <Radio
            checked={selectedDateType === 'publication'}
            name="dateType"
            id="datetype-publication"
            value="publication"
            onChange={this.handleDateTypeChange}
          >
            <FormattedMessage id="SearchBar.dateSelector.publication" />
          </Radio>
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

DateSelectorSearch.propTypes = propTypes;
export default injectIntl(DateSelectorSearch, { withRef: true });
