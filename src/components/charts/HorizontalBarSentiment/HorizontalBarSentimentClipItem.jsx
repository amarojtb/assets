import ClipActionCreators from 'actions/ClipActionCreators';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedDate } from 'react-intl';
import ClipStore from 'stores/ClipStore';

const propTypes = {
  clipId: PropTypes.string.isRequired,
};

const HorizontalBarSentimentClipItem = ({ clipId }) => {
  const {
    medium,
    publicationDate,
    text,
    title,
    textWithHtml,
    isTeased,
  } = ClipStore.getClipById(clipId);
  const isTime = ['radio', 'script', 'social', 'tv'].includes(medium);
  const pdf = ClipStore.getFileByType(clipId, 'pdf');
  const handleClick = () => {
    const { indexName } = ClipStore.getClipById(clipId);

    if (pdf && typeof pdf.url === 'string') {
      window.open(pdf.url);
      ClipActionCreators.addConsumption({
        id: clipId,
        indexName,
        type: 'pdf',
      });
    } else {
      window.open(`/Common/CreatePDF?id=${clipId}&indexName=${indexName}`);
    }
  };
  const handleKeyDown = event => {
    if (event.keyCode === keycode('enter')) {
      handleClick();
    }
  };

  return (
    <div
      className={`horizontal-bar-sentiment-clip-item u-position--relative 
      p-vertical--small p-horizontal--medium ${
        !isTeased ? 'cursor-pointer' : null
      }`}
      onClick={isTeased ? null : handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <header className="horizontal-bar-sentiment-clip-item__header">
        <div
          className="horizontal-bar-sentiment-clip-item__title text-bold
          text-truncate"
        >
          {title}
        </div>
        <div
          className="horizontal-bar-sentiment-clip-item__date
          u-position--absolute"
        >
          <FormattedDate
            day="2-digit"
            hour={isTime ? 'numeric' : undefined}
            minute={isTime ? 'numeric' : undefined}
            month="2-digit"
            value={publicationDate}
            year="numeric"
          />
        </div>
      </header>
      {textWithHtml ? (
        <div
          className="horizontal-bar-sentiment-clip-item__text"
          dangerouslySetInnerHTML={{ __html: textWithHtml }}
        />
      ) : (
        <div className="horizontal-bar-sentiment-clip-item__text">{text}</div>
      )}
    </div>
  );
};

HorizontalBarSentimentClipItem.propTypes = propTypes;
export default HorizontalBarSentimentClipItem;
