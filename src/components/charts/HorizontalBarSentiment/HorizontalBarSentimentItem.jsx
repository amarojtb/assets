import classnames from 'classnames';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import parameters from 'constants/parameters';
import { FormatNumber } from 'services/AppUtils';

const propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    negative: PropTypes.number.isRequired,
    neutral: PropTypes.number.isRequired,
    positive: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  selectedKey: PropTypes.string.isRequired,
  sentiment: PropTypes.string.isRequired,
};

class HorizontalBarSentimentItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(sentiment) {
    const { item, onClick } = this.props;

    onClick(item, sentiment);
  }

  renderBarItem(sentimentKey) {
    const { item, selectedKey, sentiment } = this.props;
    const handleClick = () => this.handleClick(sentimentKey);
    const handleKeyDown = event => {
      if (event.keyCode === keycode('enter')) {
        handleClick();
      }
    };
    const barItemStyles = {
      width: `${item[sentimentKey] * 100 / item.value}%`,
    };

    return (
      item[sentimentKey] > 0 && (
        <div
          className={classnames(
            'horizontal-bar-sentiment-bar__item',
            `horizontal-bar-sentiment-bar__item--${sentimentKey}`,
            {
              'horizontal-bar-sentiment-bar__item--is-active text-align--center':
                selectedKey === item.key && sentiment === sentimentKey,
            },
            'u-display--table-cell',
            'u-position--relative'
          )}
          key={sentimentKey}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          style={barItemStyles}
          tabIndex={0}
        >
          {selectedKey === item.key && sentiment === sentimentKey ? (
            <div className="horizontal-bar-sentiment-bar__article-number
          u-position--absolute u-full-width">
              {new FormatNumber(item[sentimentKey]).format()}
            </div>
          ) : (
            <div className="horizontal-bar-sentiment-bar__tooltip
          u-position--absolute p-around--xx-small text-bold text-align--center">
              {new FormatNumber(item[sentimentKey]).format()}
            </div>
          )}
        </div>
      )
    );
  }

  render() {
    const { index, item } = this.props;

    return (
      <div className="horizontal-bar-sentiment-item u-display--table-row">
        <div className="horizontal-bar-sentiment-item__position
        u-display--table-cell p-left--x-small text-bold align-middle">
          {index}
        </div>

        <div className="horizontal-bar-sentiment-item__source
        u-display--table-cell p-right--x-small text-truncate align-middle">
          {item.label}
        </div>

        <div className="horizontal-bar-sentiment-item__bar u-display--table-cell
        align-middle">
          <div className="horizontal-bar-sentiment-bar u-display--table
          u-full-width">
            {parameters.SENTIMENT_ENUM.map(sentimentKey =>
              this.renderBarItem(sentimentKey)
            )}
          </div>
        </div>

        <div className="horizontal-bar-sentiment-item__total
        u-display--table-cell text-align--center align-middle">
          {new FormatNumber(item.value).format()}
        </div>
      </div>
    );
  }
}

HorizontalBarSentimentItem.propTypes = propTypes;
export default HorizontalBarSentimentItem;
