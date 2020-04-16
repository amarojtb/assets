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
import * as DateUtils from 'services/DateUtils';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      comments: PropTypes.number.isRequired,
      likes: PropTypes.number.isRequired,
      publicationDate: PropTypes.string.isRequired,
      shares: PropTypes.number.isRequired,
      socialShare: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  intl: intlShape.isRequired,
  width: PropTypes.number.isRequired,
};
const BREAKPOINT = 700;

class GridFacebook extends Component {
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
        <TableHeaderCell title={formatMessage({ id: 'Global.headline' })}>
          <FormattedMessage id="Global.headline" />
        </TableHeaderCell>
        <TableHeaderCell title={formatMessage({ id: 'Global.date' })}>
          <FormattedMessage id="Global.date" />
        </TableHeaderCell>
        <TableHeaderCell title={formatMessage({ id: 'Global.socialShare' })}>
          <FormattedMessage id="Global.socialShare" />
        </TableHeaderCell>
        <TableHeaderCell title={formatMessage({ id: 'Global.likes' })}>
          <FormattedMessage id="Global.likes" />
        </TableHeaderCell>
        {width > BREAKPOINT ? (
          <TableHeaderCell title={formatMessage({ id: 'Global.shares' })}>
            <FormattedMessage id="Global.shares" />
          </TableHeaderCell>
        ) : null}
        {width > BREAKPOINT ? (
          <TableHeaderCell title={formatMessage({ id: 'Global.comments' })}>
            <FormattedMessage id="Global.comments" />
          </TableHeaderCell>
        ) : null}
      </TableHeader>
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
    const { data, width } = this.props;
    const {
      comments,
      likes,
      publicationDate,
      shares,
      socialShare,
      title,
    } = data[index];

    return (
      <TableRow key={publicationDate}>
        {this.renderTitle(title)}
        {this.renderDate(publicationDate)}
        {this.renderNumber(socialShare, 'Global.socialShare')}
        {this.renderNumber(likes, 'Global.likes')}
        {width > BREAKPOINT ? this.renderNumber(shares, 'Global.shares') : null}
        {width > BREAKPOINT
          ? this.renderNumber(comments, 'Global.comments')
          : null}
      </TableRow>
    );
  }

  renderTitle(title = '') {
    const { intl: { formatMessage } } = this.props;

    return (
      <TableCell
        dataLabel={formatMessage({ id: 'Global.headline' })}
        title={title}
        truncate={false}
        wrap
      >
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </TableCell>
    );
  }

  render() {
    const { data } = this.props;

    return (
      <Table>
        {this.renderHeader()}
        <TableBody>{data.map((_, index) => this.renderRow(index))}</TableBody>
      </Table>
    );
  }
}

GridFacebook.propTypes = propTypes;
export default injectIntl(GridFacebook);
