import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FormattedDate,
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import Table, {
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'components/Table';
import parameters from 'constants/parameters';
import * as DateUtils from 'services/DateUtils';
import * as StringUtils from 'services/StringUtils';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      idTweet: PropTypes.string.isRequired,
      publicationDate: PropTypes.string.isRequired,
      retweets: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  intl: intlShape.isRequired,
  width: PropTypes.number.isRequired,
};
const { BREAKPOINT } = parameters;

class GridTwitter extends Component {
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
                day: 'numeric',
                month: 'long',
              })
            : null
        }
      >
        <FormattedDate
          day="numeric"
          month="short"
          value={isValidDate ? date : new Date()}
        />
      </TableCell>
    );
  }

  renderHeader() {
    const { intl: { formatMessage }, width } = this.props;

    return (
      <TableHeader>
        <TableHeaderCell
          title={formatMessage({ id: 'Global.headline' })}
          width={width > BREAKPOINT.sm ? '50%' : null}
        >
          <FormattedMessage id="Global.headline" />
        </TableHeaderCell>
        {width > BREAKPOINT.sm ? (
          <TableHeaderCell title={formatMessage({ id: 'Global.date' })}>
            <FormattedMessage id="Global.date" />
          </TableHeaderCell>
        ) : null}
        <TableHeaderCell title={formatMessage({ id: 'Global.retweets' })}>
          <FormattedMessage id="Global.retweets" />
        </TableHeaderCell>
      </TableHeader>
    );
  }

  renderRetweets(retweets = 0) {
    const { intl: { formatMessage } } = this.props;

    return (
      <TableCell dataLabel={formatMessage({ id: 'Global.retweets' })}>
        {retweets}
      </TableCell>
    );
  }

  renderRow(index) {
    const { data, width } = this.props;
    const { idTweet, publicationDate, retweets, title } = data[index];

    return (
      <TableRow key={idTweet}>
        {this.renderTitle(title, idTweet)}
        {width > BREAKPOINT.sm ? this.renderDate(publicationDate) : null}
        {this.renderRetweets(retweets)}
      </TableRow>
    );
  }

  renderTitle(title = '', idTweet) {
    const { intl: { formatMessage } } = this.props;

    return (
      <TableCell
        dataLabel={formatMessage({ id: 'Global.headline' })}
        title={StringUtils.cleanHtml(title)}
      >
        <a
          className="u-text-link--reset"
          dangerouslySetInnerHTML={{ __html: title }}
          href={`https://twitter.com/statuses/${idTweet}`}
          rel="noopener noreferrer"
          target="_blank"
        />
      </TableCell>
    );
  }

  render() {
    const { data } = this.props;

    return (
      <Table fixedLayout>
        {this.renderHeader()}
        <TableBody>{data.map((_, index) => this.renderRow(index))}</TableBody>
      </Table>
    );
  }
}

GridTwitter.propTypes = propTypes;
export default injectIntl(GridTwitter);
