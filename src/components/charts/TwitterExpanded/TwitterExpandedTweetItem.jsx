import PropTypes from 'prop-types';
import React from 'react';
import { FormattedDate } from 'react-intl';

const propTypes = {
  item: PropTypes.shape({
    date: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

const TwitterExpandedTweetItem = ({ item: { date, message } }) => (
  <div className="c-twitter-tweet__item">
    <div className="c-twitter-tweet__date">
      <FormattedDate
        day="numeric"
        hour="numeric"
        minute="numeric"
        month="short"
        value={new Date(date)}
        year="numeric"
      />
    </div>
    <div
      className="c-twitter-tweet__message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  </div>
);

TwitterExpandedTweetItem.propTypes = propTypes;
export default TwitterExpandedTweetItem;
