import ClipActionCreators from 'actions/ClipActionCreators';
import Svg from 'components/Svg';
import keycode from 'keycode';
import Table, {
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'components/Table';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FormattedDate,
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import * as DateUtils from 'services/DateUtils';
import ClipStore from 'stores/ClipStore';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      country: PropTypes.string,
      id: PropTypes.string.isRequired,
      isTeased:PropTypes.bool.isRequired,
      indexName: PropTypes.string.isRequired,
      medium: PropTypes.string,
      publicationDate: PropTypes.string.isRequired,
      deliveredDate: PropTypes.string.isRequired,
      sourceName: PropTypes.string,
      text: PropTypes.string,
      source: PropTypes.string,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  intl: intlShape.isRequired,
};

let win = null;

class GridLatestArticlesExpanded extends Component {
  static renderHeader() {
    return (
      <TableHeader>
        <TableHeaderCell width="80%" />
        <TableHeaderCell width="20%" />
      </TableHeader>
    );
  }
  static onAddConsumption(type, id) {
    const file = ClipStore.getFileByType(id, type);
    const fileUrl = file && typeof file.url === 'string' && file.url;

    if (fileUrl && win) {
      win.focus();
      win.location = fileUrl;
    }
  }
  static onArticleClick(id, indexName) {
    return () => {
      const pdf = ClipStore.getFileByType(id, 'pdf');

      if (pdf && typeof pdf.url === 'string') {
        ClipActionCreators.addConsumption({
          id,
          indexName,
          type: 'pdf',
        });
      } else {
        window.open(`/Common/CreatePDF?id=${id}&indexName=${indexName}`);
      }
    };
  }

  static handleKeyDown(event, id, indexName) {
    if (event.keyCode === keycode('enter')) {
      return GridLatestArticlesExpanded.onArticleClick(id, indexName);
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      activeArticleClick: !window.location.href.includes('Public'),
    };
  }

  componentWillMount() {
    const searchModel = window.km.Delivery.Shared.Search.searchModelJson();
    ClipActionCreators.getClips({
      ...searchModel,
      ...{
        facetsSelected: [...searchModel.facetsSelected],
      },
    });

    ClipStore.addAddConsumptionListener(
      GridLatestArticlesExpanded.onAddConsumption
    );
  }

  componentWillUnmount() {
    ClipStore.removeAddConsumptionListener(
      GridLatestArticlesExpanded.onAddConsumption
    );
  }

  renderDate(dateString) {
    const { intl: { formatDate, formatMessage } } = this.props;
    const date = new Date(dateString);
    const isValidDate = DateUtils.isValidDate(date);

    return (
      <TableCell
        dataLabel={formatMessage({ id: 'Global.date' })}
        title={
          isValidDate
            ? formatDate(date, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : null
        }
        width="20%"
        wrap
      >
        <div
          className="latest-articles-expanded__clip-delivered-date"
          title={formatMessage({ id: 'Global.deliveredDate' })}
        >
          <FormattedDate
            day="2-digit"
            month="2-digit"
            year="numeric"
            value={isValidDate ? date : new Date()}
          />
        </div>
      </TableCell>
    );
  }

  renderNumber(value = 0, translationKey) {
    const { intl: { formatMessage } } = this.props;

    return (
      <TableCell dataLabel={formatMessage({ id: translationKey })}>
        {value}
      </TableCell>
    );
  }

  renderRow(index) {
    const { data } = this.props;
    const {
      author,
      id,
      isTeased,
      country,
      deliveredDate,
      publicationDate,
      sourceName,
      indexName,
      title,
      medium,
      text,
    } = data[index];

    return (
      <TableRow key={`${id}${indexName}`}>
        {this.renderClip(
          author,
          country,
          id,
          isTeased,
          publicationDate,
          sourceName,
          indexName,
          title,
          medium,
          text
        )}
        {this.renderDate(deliveredDate)}
      </TableRow>
    );
  }

  renderClip(
    author,
    country,
    id,
    isTeased,
    publicationDate,
    sourceName,
    indexName,
    title,
    medium,
    text
  ) {
    const { intl: { formatMessage } } = this.props;
    const { activeArticleClick } = this.state;
    const textWithoutHtml = text.replace(/<(?:.|\n)*?>/gm, '');

    return (
      <TableCell
        key={publicationDate}
        dataLabel={formatMessage({ id: 'Global.headline' })}
        title={title}
        truncate={false}
      >
        <div
          className={
            (activeArticleClick && !isTeased)
              ? 'latest-articles-expanded__clip-item'
              : 'latest-articles-expanded__clip-item-public '
          }
          onClick={
            (activeArticleClick && !isTeased)
              ? GridLatestArticlesExpanded.onArticleClick(id, indexName)
              : null
          }
          onKeyDown={GridLatestArticlesExpanded.handleKeyDown(id, indexName)}
          role="link"
        >
          <div className="latest-articles-expanded__clip-item__info">
            <span className="latest-articles-expanded__clip-item__medium">
              <Svg icon={medium === 'social media' ? 'social' : medium} />
            </span>
            <span className="align-middle m-left--x-small">
              {sourceName && (
                <span className="latest-articles-expanded__clip-item__source">
                  {sourceName}
                </span>
              )}
              {sourceName && ' - '}

              {author && author.length > 0 ? (
                <span
                  className="latest-articles-expanded__clip-item__author"
                  title={formatMessage({ id: 'Global.author' })}
                >
                  <span className="latest-articles-expanded__clip-item__author- info">
                    <span className="latest-articles-expanded__clip-item__author-value">
                      <FormattedMessage id="ArticlePreview.by" />{' '}
                    </span>{' '}
                  </span>
                  {author}
                  {' - '}
                </span>
              ) : null}

              {country && country.length > 0 ? <span>({country})</span> : null}
            </span>
          </div>
          <div className="latest-articles-expanded__clip-item__title">
            {title}
          </div>
          <div className="latest-articles-expanded__clip-item__text text-truncate">
            {textWithoutHtml}
          </div>
        </div>
      </TableCell>
    );
  }

  render() {
    const { data } = this.props;
    const clips = data.length >= 49 ? data.slice(0, 50) : data;

    return (
      <Table fixedLayout noRowHover striped>
        {GridLatestArticlesExpanded.renderHeader()}
        <TableBody>{clips.map((_, index) => this.renderRow(index))}</TableBody>
      </Table>
    );
  }
}

GridLatestArticlesExpanded.propTypes = propTypes;
export default injectIntl(GridLatestArticlesExpanded);
