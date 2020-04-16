import Svg from 'components/Svg';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FormattedDate,
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import * as AppUtils from 'services/AppUtils';
import * as DateUtils from 'services/DateUtils';
import ClipStore from 'stores/ClipStore';
import moment from 'moment';
import './ClipDate.css';

/*
 *
 * Date component for article list | article preview | review article list | review article preview
 *
 * How to use it :
 *  - Article list : <ClipDate clipId={clipId} location="articleList"  />
 *
 *  - Article preview : <ClipDate clipId={clipId} location="articlePreview" type=['publication', 'delivery', 'both']  />
 *
 *  - Review article list : <ClipDate clip={clip} location="reviewArticleList"   />
 *
 *  - Review article preview : <ClipDate clipId={clipId} location="reviewArticlePreview" type=['publication', 'delivery', 'both']   />
 *
 *  - Related article : <ClipDate clip={clip} location="relatedArticle" type=['publication', 'delivery', 'both']   />
 *
 */

const propTypes = {
  clipId: PropTypes.string,
  location: PropTypes.oneOf([
    'articleList',
    'articlePreview',
    'reviewArticleList',
    'reviewArticlePreview',
    'relatedArticle',
  ]).isRequired,
  type: PropTypes.oneOf(['publication', 'delivery', 'both']),
  intl: intlShape.isRequired,
  clip: PropTypes.shape({
    deliveredDate: PropTypes.date,
    headlines: PropTypes.array,
    highlightSelection: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    indexName: PropTypes.string,
    isCopyrighted: PropTypes.bool,
    isExpirationDate: PropTypes.bool,
    isForbidden: PropTypes.bool,
    keywords: PropTypes.arrayOf(PropTypes.string),
    medium: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    publicationDate: PropTypes.date,
    sourceName: PropTypes.string,
    summaries: PropTypes.array,
    text: PropTypes.string,
    title: PropTypes.string,
  }),
};

const defaultProps = {
  type: 'publication',
  clipId: null,
  clip: null,
};

class ClipDate extends Component {
  constructor(props) {
    super(props);
    this.renderArticleList = this.renderArticleList.bind(this);
    this.renderArticlePreview = this.renderArticlePreview.bind(this);
    this.renderArticlePreviewTodayDelivery = this.renderArticlePreviewTodayDelivery.bind(
      this
    );
    this.renderArticlePreviewTodayPublication = this.renderArticlePreviewTodayPublication.bind(
      this
    );
    this.renderArticlePreviewDelivery = this.renderArticlePreviewDelivery.bind(
      this
    );
    this.renderArticlePreviewPublication = this.renderArticlePreviewPublication.bind(
      this
    );
    this.renderReviewArticleList = this.renderReviewArticleList.bind(this);
    this.renderReviewPreviewDelivery = this.renderReviewPreviewDelivery.bind(
      this
    );
    this.renderReviewPreviewPublication = this.renderReviewPreviewPublication.bind(
      this
    );
  }

  renderArticleList() {
    const {
      clipId,
      intl: { formatMessage },
    } = this.props;
    const clip = ClipStore.getClipById(clipId);
    const { deliveredDate, publicationDate, medium } = clip;

    const isTime = ['radio', 'script', 'tv', 'social-media', 'social'].includes(
      medium
    );
    const date = publicationDate;
    const searchModel = window.km.Delivery.Shared.Search.searchModelJson();
    const dateType = Number(searchModel.searchModel.DateType);
    const isTodayPublication = DateUtils.isToday(date);
    const isTodayDelivery = DateUtils.isToday(date);
    if (dateType === 1) {
      if (isTodayPublication) {
        return (
          <span title={formatMessage({ id: 'Global.publicationDate' })}>
            <FormattedDate hour="2-digit" minute="2-digit" value={date} />
          </span>
        );
      }
      return (
        <span title={formatMessage({ id: 'Global.publicationDate' })}>
          <FormattedDate
            day="2-digit"
            hour={isTime ? 'numeric' : undefined}
            minute={isTime ? 'numeric' : undefined}
            month="2-digit"
            value={date}
            year="numeric"
            title={formatMessage({ id: 'Global.publicationDate' })}
          />
        </span>
      );
    }
    // Delivery
    if (isTodayDelivery) {
      return (
        <span title={formatMessage({ id: 'Global.deliveredDate' })}>
          <FormattedDate
            hour="2-digit"
            minute="2-digit"
            value={deliveredDate}
            title={formatMessage({ id: 'Global.deliveredDate' })}
          />
        </span>
      );
    }
    return (
      <span title={formatMessage({ id: 'Global.deliveredDate' })}>
        <FormattedDate
          day="2-digit"
          hour={isTime ? 'numeric' : undefined}
          minute={isTime ? 'numeric' : undefined}
          month="2-digit"
          value={deliveredDate}
          year="numeric"
          title={formatMessage({ id: 'Global.deliveredDate' })}
        />
      </span>
    );
  }

  renderArticlePreview() {
    const { clipId, clip, type } = this.props;
    const currentClip = (!clip && ClipStore.getClipById(clipId)) || clip;
    const { deliveredDate, publicationDate } = currentClip;
    const datePublication = publicationDate;
    const dateDelivered = deliveredDate;
    const isTodayPublication = DateUtils.isToday(datePublication);
    const isTodayDelivery = DateUtils.isToday(dateDelivered);
    switch (type) {
      case 'delivery':
        if (isTodayDelivery) {
          return this.renderArticlePreviewTodayDelivery();
        }
        return this.renderArticlePreviewDelivery();

      case 'publication':
        if (isTodayPublication) {
          return this.renderArticlePreviewTodayPublication();
        }
        return this.renderArticlePreviewPublication();

      case 'both':
        if (isTodayPublication && isTodayDelivery) {
          return (
            <span>
              {this.renderArticlePreviewTodayDelivery()}
              {this.renderArticlePreviewTodayPublication()}
            </span>
          );
        } else if (!isTodayPublication && isTodayDelivery) {
          return (
            <span>
              {this.renderArticlePreviewTodayDelivery()}
              {this.renderArticlePreviewPublication()}
            </span>
          );
        } else if (isTodayPublication && !isTodayDelivery) {
          return (
            <span>
              {this.renderArticlePreviewDelivery()}
              {this.renderArticlePreviewTodayPublication()}
            </span>
          );
        }
        return (
          <span>
            {this.renderArticlePreviewDelivery()}
            {this.renderArticlePreviewPublication()}
          </span>
        );

      default:
        return null;
    }
  }

  renderArticlePreviewTodayDelivery() {
    const {
      clipId,
      clip,
      intl: { formatMessage },
    } = this.props;
    const currentClip = (!clip && ClipStore.getClipById(clipId)) || clip;
    const { deliveredDate } = currentClip;
    const date = deliveredDate;
    return (
      <span
        className="c-clip-date__delivery"
        title={formatMessage({ id: 'Global.deliveredDate' })}
      >
        <Svg className="m-right--xx-small" icon="clock" />
        <FormattedDate hour="2-digit" minute="2-digit" value={date} />
      </span>
    );
  }

  renderArticlePreviewTodayPublication() {
    const {
      clipId,
      clip,
      intl: { formatMessage },
    } = this.props;
    const currentClip = (!clip && ClipStore.getClipById(clipId)) || clip;
    const { publicationDate } = currentClip;
    const date = publicationDate;
    return (
      <span
        className="c-clip-date__publication"
        title={formatMessage({ id: 'Global.publicationDate' })}
      >
        <Svg className="m-right--xx-small" icon="publication_date" />
        <FormattedDate hour="2-digit" minute="2-digit" value={date} />
      </span>
    );
  }

  renderArticlePreviewDelivery() {
    const {
      clipId,
      clip,
      intl: { formatMessage },
    } = this.props;
    const currentClip = (!clip && ClipStore.getClipById(clipId)) || clip;
    const { deliveredDate, medium } = currentClip;
    const date = deliveredDate;
    const isTime = ['radio', 'script', 'tv', 'social-media', 'social'].includes(
      medium
    );

    return (
      <span
        className="c-clip-date__delivery"
        title={formatMessage({ id: 'Global.deliveredDate' })}
      >
        <Svg className="m-right--xx-small" icon="clock" />
        <FormattedDate
          day="2-digit"
          hour={isTime ? 'numeric' : undefined}
          minute={isTime ? 'numeric' : undefined}
          month="2-digit"
          value={date}
          year="numeric"
        />
      </span>
    );
  }

  renderArticlePreviewPublication() {
    const {
      clipId,
      clip,
      intl: { formatMessage },
    } = this.props;
    const currentClip = (!clip && ClipStore.getClipById(clipId)) || clip;
    const { publicationDate, medium } = currentClip;
    const date = publicationDate;
    const isTime = ['radio', 'script', 'tv', 'social-media', 'social'].includes(
      medium
    );

    return (
      <span
        className="c-clip-date__publication"
        title={formatMessage({ id: 'Global.publicationDate' })}
      >
        <Svg className="m-right--xx-small" icon="publication_date" />
        <FormattedDate
          day="2-digit"
          hour={isTime ? 'numeric' : undefined}
          minute={isTime ? 'numeric' : undefined}
          month="2-digit"
          value={date}
          year="numeric"
        />
      </span>
    );
  }

  renderReviewArticleList() {
    const { clip } = this.props;
    const { publicationDate, medium } = clip;
    const mediumValue = AppUtils.convertMediumEnumtoMediumName(medium);
    const clipPublicationDate = new Date(publicationDate);

    const isTime = ['radio', 'script', 'tv', 'social-media', 'social'].includes(
      mediumValue
    );

    const isTodayPublication = DateUtils.isToday(clipPublicationDate);
    const isYesterdayPublication = DateUtils.isYesterday(clipPublicationDate);

    if (isTodayPublication) {
      return (
        <span>
          <FormattedMessage id="Global.today" />{' '}
          {isTime ? (
            <FormattedDate
              hour="numeric"
              minute="numeric"
              value={clipPublicationDate}
            />
          ) : null}
        </span>
      );
    } else if (isYesterdayPublication) {
      return (
        <span>
          <FormattedMessage id="Global.yesterday" />{' '}
          {isTime ? (
            <FormattedDate
              hour="numeric"
              minute="numeric"
              value={clipPublicationDate}
            />
          ) : null}
        </span>
      );
    }

    return (
      <FormattedDate
        day="2-digit"
        hour={isTime ? 'numeric' : undefined}
        minute={isTime ? 'numeric' : undefined}
        month="2-digit"
        value={clipPublicationDate}
        year="numeric"
      />
    );
  }

  renderReviewPreviewPublication() {
    const {
      clipId,
      intl: { formatMessage },
    } = this.props;
    const clip = ClipStore.getClipById(clipId);
    const { publicationDate, medium } = clip;
    const datePublication = publicationDate;
    const isTodayPublication = DateUtils.isToday(datePublication);
    const isYesterdayPublication = DateUtils.isYesterday(datePublication);

    const isTime = ['radio', 'script', 'tv', 'social-media', 'social'].includes(
      medium
    );
    return (
      <span
        className="c-clip-date__publication"
        title={formatMessage({ id: 'Global.publicationDate' })}
      >
        <Svg className="m-right--xx-small" icon="publication_date" />

        {(isTodayPublication && (
          <span>
            <FormattedMessage id="Global.today" />{' '}
            {isTime ? (
              <FormattedDate
                hour="numeric"
                minute="numeric"
                value={datePublication}
              />
            ) : null}
          </span>
        )) ||
          (isYesterdayPublication && (
            <span>
              <FormattedMessage id="Global.yesterday" />{' '}
              {isTime ? (
                <FormattedDate
                  hour="numeric"
                  minute="numeric"
                  value={datePublication}
                />
              ) : null}
            </span>
          )) || (
            <FormattedDate
              day="2-digit"
              hour={isTime ? 'numeric' : undefined}
              minute={isTime ? 'numeric' : undefined}
              month="2-digit"
              value={datePublication}
              year="numeric"
            />
          )}
      </span>
    );
  }

  renderReviewPreviewDelivery() {
    const {
      clipId,
      intl: { formatMessage },
    } = this.props;
    const clip = ClipStore.getClipById(clipId);
    const { deliveredDate, medium } = clip;
    const dateDelivery = deliveredDate;
    const isTodayDelivery = DateUtils.isToday(dateDelivery);
    const isYesterdayDelivery = DateUtils.isYesterday(dateDelivery);

    const isTime = ['radio', 'script', 'tv', 'social-media', 'social'].includes(
      medium
    );

    return (
      <span
        className="c-clip-date__delivery"
        title={formatMessage({ id: 'Global.deliveredDate' })}
      >
        <Svg className="m-right--xx-small" icon="clock" />
        {(isTodayDelivery && (
          <span>
            <FormattedMessage id="Global.today" />{' '}
            {isTime ? (
              <FormattedDate
                hour="numeric"
                minute="numeric"
                value={dateDelivery}
              />
            ) : null}
          </span>
        )) ||
          (isYesterdayDelivery && (
            <span>
              <FormattedMessage id="Global.yesterday" />{' '}
              {isTime ? (
                <FormattedDate
                  hour="numeric"
                  minute="numeric"
                  value={dateDelivery}
                />
              ) : null}
            </span>
          )) || (
            <FormattedDate
              day="2-digit"
              hour={isTime ? 'numeric' : undefined}
              minute={isTime ? 'numeric' : undefined}
              month="2-digit"
              value={dateDelivery}
              year="numeric"
            />
          )}
      </span>
    );
  }

  render() {
    const { location, type } = this.props;

    switch (location) {
      case 'articleList':
        return this.renderArticleList();

      case 'articlePreview':
        return this.renderArticlePreview();

      case 'reviewArticleList':
        return this.renderReviewArticleList();

      case 'reviewArticlePreview':
        switch (type) {
          case 'delivery':
            return this.renderReviewPreviewDelivery();
          case 'publication':
            return this.renderReviewPreviewPublication();
          case 'both':
            return (
              <span>
                {this.renderReviewPreviewDelivery()}
                {this.renderReviewPreviewPublication()}
              </span>
            );
          default:
            return null;
        }

      case 'relatedArticle':
        return this.renderArticlePreview();

      default:
        return null;
    }
  }
}

ClipDate.propTypes = propTypes;
ClipDate.defaultProps = defaultProps;
export default injectIntl(ClipDate);
