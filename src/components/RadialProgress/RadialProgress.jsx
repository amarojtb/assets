import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { gradientColor } from 'services/AppUtils';
import './RadialProgress.css';

const propTypes = {
  className: PropTypes.string,
  inset: PropTypes.number,
  progression: PropTypes.number,
  size: PropTypes.number,
};
const defaultProps = {
  className: '',
  inset: 30,
  progression: 0,
  size: 40,
};

const RadialProgress = props => {
  const { className, inset, progression, size } = props;
  const backgroundColor = gradientColor(
    {
      b: 17,
      g: 52,
      r: 228,
    },
    {
      b: 71,
      g: 190,
      r: 6,
    },
    progression
  );
  const radialProgressClassNames = classnames('radial-progress', className);

  return (
    <div
      className={radialProgressClassNames}
      style={{
        height: size,
        width: size,
      }}
    >
      <div className="radial-progress__circle">
        <div
          className="radial-progress__mask"
          style={{
            clip: `rect(0, ${size}px, ${size}px, ${size / 2}px)`,
            height: size,
            transform: `rotate(${progression * 1.8}deg)`,
            width: size,
          }}
        >
          <div
            className="radial-progress__fill"
            style={{
              backgroundColor,
              clip: `rect(0, ${size / 2}px, ${size}px, 0)`,
              height: size,
              transform: `rotate(${progression * 1.8}deg)`,
              width: size,
            }}
          />
        </div>
        <div
          className="radial-progress__mask"
          style={{
            clip: `rect(0, ${size}px, ${size}px, ${size / 2}px)`,
            height: size,
            width: size,
          }}
        >
          <div
            className="radial-progress__fill"
            style={{
              backgroundColor,
              clip: `rect(0, ${size / 2}px, ${size}px, 0)`,
              height: size,
              transform: `rotate(${progression * 1.8}deg)`,
              width: size,
            }}
          />
          <div
            className="radial-progress__fill"
            style={{
              backgroundColor,
              clip: `rect(0, ${size / 2}px, ${size}px, 0)`,
              height: size,
              transform: `rotate(${progression * 3.6}deg)`,
              width: size,
            }}
          />
        </div>
      </div>
      <div
        className="radial-progress__inset"
        style={{
          height: inset,
          width: inset,
        }}
      >
        <div className="radial-progress__percentage">
          {Math.round(progression)}
        </div>
      </div>
    </div>
  );
};

RadialProgress.propTypes = propTypes;
RadialProgress.defaultProps = defaultProps;
export default RadialProgress;
