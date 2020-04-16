import Svg from 'components/Svg';
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

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      country: PropTypes.string,
      id: PropTypes.string.isRequired,
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

class GridLatestArticles extends Component {
  static renderHeader() {
    return (
      <TableHeader>
        <TableHeaderCell width="80%" />
        <TableHeaderCell width="20%" />
      </TableHeader>
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
        <div className="latest-articles__clip-delivered-date">
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

  renderRow(index) {
    const { data } = this.props;
    const {
      id,
      deliveredDate,
      publicationDate,
      sourceName,
      indexName,
      title,
      medium,
    } = data[index];

    return (
      <TableRow key={`${id}${indexName}`}>
        {this.renderClip(
          publicationDate,
          sourceName,

          title,
          medium
        )}
        {this.renderDate(deliveredDate)}
      </TableRow>
    );
  }

  renderClip(publicationDate, sourceName, title, medium) {
    const { intl: { formatMessage } } = this.props;

    return (
      <TableCell
        key={publicationDate}
        dataLabel={formatMessage({ id: 'Global.headline' })}
        title={title}
        truncate
      >
        <div className="latest-articles__clip-item">
          <div className="latest-articles__clip-item__info">
            <span className="latest-articles__clip-item__medium">
              <Svg icon={medium === 'social media' ? 'social' : medium} />
            </span>
            <span className="align-middle m-left--x-small">
              {sourceName && (
                <span className="latest-articles__clip-item__source">
                  {sourceName}
                </span>
              )}
            </span>
          </div>
          <div className="latest-articles__clip-item__title text-truncate">
            {title}
          </div>
        </div>
      </TableCell>
    );
  }

  render() {
    const { data } = this.props;
    const clips = data.length >= 9 ? data.slice(0, 10) : data;

    return (
      <Table fixedLayout noRowHover striped>
        {GridLatestArticles.renderHeader()}
        <TableBody>{clips.map((_, index) => this.renderRow(index))}</TableBody>
      </Table>
    );
  }
}

GridLatestArticles.propTypes = propTypes;
export default injectIntl(GridLatestArticles);
