import DropDown from 'components/DropDown/DropDown';
import { FormattedDate } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Svg from 'components/Svg/Svg';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.string.isRequired,
    ]).isRequired
  ).isRequired,
  fixed: PropTypes.bool.isRequired,
  keyLabel: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSortClick: PropTypes.func.isRequired,
};
let order = 'asc';
let clickedKey = null;
let limit = 3;

const ResponsiveTableColumn = ({
  data,
  fixed,
  keyLabel,
  label,
  onSortClick,
}) => {
  const handleClick = key => {
    if (key === clickedKey) {
      if (order === 'asc') {
        order = 'desc';
      } else {
        order = 'asc';
      }
    } else {
      order = 'desc';
    }

    clickedKey = key;
    onSortClick(key);
  };

  const renderGroups = array => {
    if (array.length >= limit) {
      const testString = array[0] + array[1];

      if (testString.length > 20) {
        limit = 1;
      } else {
        limit = 3;
      }
    }

    return array.slice(0, limit).join(', ');
  };

  const renderGroupsMore = array =>
    array.map(
      (item, i) =>
        i > limit - 1 ? (
          <div className="groups-more__item" key={item}>
            {item}
          </div>
        ) : null
    );

  const isDate = date => {
    const pattern = new RegExp(
      '(19|20)[0-9][0-9]-(0[0-9]|1[0-2])-(0[1-9]|([12][0-9]|3[01]))T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]'
    );

    return pattern.test(date);
  };

  const renderDate = value => (
    <FormattedDate
      day="2-digit"
      hour="2-digit"
      minute="2-digit"
      month="2-digit"
      value={value}
      year="numeric"
    />
  );

  const renderMore = item =>
    item.length > limit ? (
      <DropDown
        className="groups-more"
        smartDrop=".users"
        title={`+ ${item.length - limit}`}
      >
        {renderGroupsMore(item)}
      </DropDown>
    ) : null;

  const renderRows = () =>
    data.map((item, index) => (
      <tr key={index}>
        <td>
          <span className="text">
            {Array.isArray(item) ? renderGroups(item) : null}
            {Array.isArray(item) ? renderMore(item) : null}
            {item === '' ? '-' : null}
            {isDate(item) ? renderDate(item) : null}
            {typeof item === 'string' && !isDate(item) ? item : null}
          </span>
        </td>
      </tr>
    ));

  const renderOrderingArrow = () =>
    order === 'desc' ? (
      <Svg icon="chevron-up" size="x-small" />
    ) : (
      <Svg icon="chevron-down" size="x-small" />
    );

  return (
    <table
      className={fixed ? 'table-fixed_column carousel-cell' : 'carousel-cell'}
    >
      <tbody>
        <tr className="fixedHeader" onClick={() => handleClick(keyLabel)}>
          <th className="t-color-primary-bg">
            {label || 'No Title'}
            <span className="sort-icon">
              {keyLabel === clickedKey ? (
                renderOrderingArrow()
              ) : (
                <Svg icon="chevron-down" size="x-small" />
              )}
            </span>
          </th>
        </tr>
        {renderRows()}
      </tbody>
    </table>
  );
};

ResponsiveTableColumn.propTypes = propTypes;
export default ResponsiveTableColumn;
