/**
 * Icon sentiment.
 */
import PropTypes from 'prop-types';
import React from 'react';
import Svg from 'components/Svg';
import './IconSentiment.css';

const propTypes = {
  automatic: PropTypes.bool,
  human: PropTypes.bool,
  level: PropTypes.oneOf([
    'negative',
    'neutral',
    'positive',
    'balanced',
    'notanalyzed',
  ]),
  size: PropTypes.number,
};
const defaultProps = {
  automatic: false,
  human: false,
  level: 'neutral',
  size: 16,
};

const IconSentiment = ({ automatic, human, level, size }) => {
  const iconSentimentStyles = {
    height: size * 1.25,
    width: size * 1.25,
  };
  const iconStyles = { borderWidth: `${size}px ${size}px 0 0` };
  const renderAutomaticIcon = (
    <Svg className="c-icon-sentiment__automatic" icon="gear" size="x-small" />
  );
  const renderHumanIcon = (
    <Svg className="c-icon-sentiment__human" icon="user" size="x-small" />
  );

  return (
    <span
      className={`c-icon-sentiment is-${level}`}
      style={iconSentimentStyles}
    >
      <span className="c-icon-sentiment__level" style={iconStyles} />
      {automatic && !human && renderAutomaticIcon}
      {human && renderHumanIcon}
    </span>
  );
};

IconSentiment.defaultProps = defaultProps;
IconSentiment.propTypes = propTypes;
export default IconSentiment;
