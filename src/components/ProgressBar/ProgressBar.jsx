import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import './ProgressBar.css';

const propTypes = {
  height: PropTypes.oneOf(['x-small', 'small', 'medium', 'large']),
  progression: PropTypes.number,
};
const defaultProps = {
  height: 'medium',
  progression: 0,
};

class ProgressBar extends PureComponent {
  render() {
    const { height, progression } = this.props;
    const progressBarValueStyles = {
      width: `${progression}%`,
    };

    return (
      <div
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={progression}
        className={`c-progress-bar c-progress-bar--${height}`}
        role="progressbar"
      >
        <span className="c-progress-bar__value" style={progressBarValueStyles}>
          <span className="u-assistive-text">
            <FormattedMessage
              id="ProgressBar.assistiveTextProgress"
              values={{ progression }}
            />
          </span>
        </span>
      </div>
    );
  }
}

ProgressBar.defaultProps = defaultProps;
ProgressBar.propTypes = propTypes;
export default ProgressBar;
