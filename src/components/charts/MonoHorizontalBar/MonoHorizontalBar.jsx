import classnames from 'classnames';
import { scaleOrdinal } from 'd3-scale';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedNumber } from 'react-intl';
import parameters from 'constants/parameters';
import { FormatNumber } from 'services/AppUtils';
import './MonoHorizontalBar.css';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
    showNumber: PropTypes.bool,
  }).isRequired,
};
const { CHART_COLORS, COLORS } = parameters;

const MonoHorizontalBar = props => {
  const { params: { data, showNumber } } = props;
  const total = data.reduce((p, c) => p + c.value, 0);
  const getColor = key => {
    const keys = data.map(e => e.key);
    const colors = scaleOrdinal(CHART_COLORS).domain(keys);

    return COLORS[key] ? COLORS[key] : colors(key);
  };
  const isEmpty =
    data.length &&
    Array.from(data.values()).reduce((p, c) => p + c.value, 0) === 0;
  const monoHorizontalBarClassNames = classnames('mono-horizontal-bar', {
    'mono-horizontal-bar--is-empty': isEmpty,
  });

  data.sort((a, b) => {
    if (a.label > b.label) return 1;
    if (a.label < b.label) return -1;
    return 0;
  });

  return (
    <div className={monoHorizontalBarClassNames}>
      <div className="mono-horizontal-bar__chart">
        <div className="mono-horizontal-bar__bars">
          <div className="mono-horizontal-bar__bar
          mono-horizontal-bar__bar--top u-position--absolute u-pin--top-left">
            {data.map(({ key, value }) => (
              <div
                className="u-display--inline-block u-full-height"
                key={key}
                style={{
                  backgroundColor: !isEmpty && getColor(key),
                  width: `${value * 100 / total}%`,
                }}
              />
            ))}
          </div>
          <div className="mono-horizontal-bar__bar
          mono-horizontal-bar__bar--front u-position--absolute u-pin--top-left">
            {data.map(({ key, value }) => (
              <div
                className="u-display--inline-block u-full-height"
                key={key}
                style={{
                  backgroundColor: !isEmpty && getColor(key),
                  width: `${value * 100 / total}%`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="mono-horizontal-bar__shadow-container
        u-position--relative">
          <div className="mono-horizontal-bar__shadow u-position--absolute
          u-pin--top-left" />
        </div>
      </div>
      <div className="u-display--table u-full-width m-top--small">
        {data.map(({ key, value }) => (
          <div
            className="mono-horizontal-bar__percent u-display--table-cell
            p-bottom--xxx-small text-light text-align--center"
            key={key}
            style={{ width: `${100 / data.length}%` }}
          >
            <FormattedNumber
              style="percent"
              value={value > 0 ? value / total : 0}
            />
            {showNumber && ` (${new FormatNumber(value).format()})`}
          </div>
        ))}
      </div>
      <div className="u-display--table u-full-width">
        {data.map(({ key }) => (
          <div
            className="mono-horizontal-bar__legend-bar u-display--table-cell"
            key={key}
            style={{
              backgroundColor: getColor(key),
              width: `${100 / data.length}%`,
            }}
          />
        ))}
      </div>
      <div className="u-display--table u-full-width m-top--x-small">
        {data.map(({ key, label }) => (
          <div
            className="mono-horizontal-bar__legend-field u-display--table-cell
            text-align--center text-medium text-uppercase"
            key={key}
            style={{ width: `${100 / data.length}%` }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

MonoHorizontalBar.propTypes = propTypes;
export default MonoHorizontalBar;
