import React from 'react';
import PropTypes from 'prop-types';
import tweetParser from 'tweet-parser';

const TweetParser = ({ children, urlClass, textClass }) => {
  if (!children) return children;
  const tweet = tweetParser(children).map((part, index) => {
    /* eslint-disable react/no-array-index-key */
    switch (part.type) {
      case 'TEXT':
        return (
          <span
            key={`tweet_${index}`}
            className={textClass}
            dangerouslySetInnerHTML={{ __html: part.content }}
          />
        );
      default:
        return (
          <a
            className={urlClass}
            href={part.url}
            target="_blank"
            key={`tweet_${index}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: part.content,
              }}
            />
          </a>
        );
    }
  });

  return <div>{tweet}</div>;
};

TweetParser.propTypes = {
  children: PropTypes.node.isRequired,
  urlClass: PropTypes.string,
  textClass: PropTypes.string,
};

TweetParser.defaultProps = {
  urlClass: '',
  textClass: '',
};

export default TweetParser;
