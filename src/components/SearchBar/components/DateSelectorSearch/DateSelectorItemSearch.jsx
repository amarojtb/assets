/* eslint-disable no-case-declarations */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Svg from 'components/Svg';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  mode: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  icon: PropTypes.string,
};

const defaultProps = {
  mode: 'list',
  icon: null,
};

const DateSelector = ({ label, mode, onClick, icon, selected }) => {
  const dates = {
    universalDateFrom: '',
    universalDateTo: '',
    dateFrom:'',
    dateTo:'',
  };

  switch (mode) {
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

  return (
    <div
      className={`date-selector_list__item ${(selected &&
        'date-selector_list__item--selected') ||
        ''}`}
      onClick={onClick(mode, dates)}
      onKeyUp={onClick(mode, dates)}
      role="button"
      tabIndex={0}
    >
      <div className="date-selector_list__item-name text-truncate">{label}</div>
      {icon && (
        <span className="date-selector_list__item-icon">
          <Svg icon={icon} />
        </span>
      )}
    </div>
  );
};

DateSelector.propTypes = propTypes;
DateSelector.defaultProps = defaultProps;
export default DateSelector;
