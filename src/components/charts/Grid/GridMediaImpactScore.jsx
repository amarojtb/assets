import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FormattedDate,
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import ClipActionCreators from 'actions/ClipActionCreators';
import Table, {
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'components/Table';
import parameters from 'constants/parameters';
import * as DateUtils from 'services/DateUtils';
import GridMediaImpactScoreTitle from './GridMediaImpactScoreTitle';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      indexName: PropTypes.string.isRequired,
      mediaImpactScore: PropTypes.number.isRequired,
      pdf: PropTypes.shape({
        url: PropTypes.string,
      }),
      publicationDate: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  intl: intlShape.isRequired,
  width: PropTypes.number.isRequired,
};
const { BREAKPOINT } = parameters;

class GridMediaImpactScore extends Component {
  constructor(props) {
    super(props);

    this.handleTitleLinkClick = this.handleTitleLinkClick.bind(this);
  }

  handleTitleLinkClick(id) {
    const { data } = this.props;
    const { indexName, pdf } = data.find(item => item.id === id);

    if (pdf == null || pdf.url == null) {
      window.open(`/Common/CreatePDF?id=${id}&indexName=${indexName}`);
    } else {
      ClipActionCreators.addConsumption({
        id,
        indexName,
        type: 'pdf',
      });
    }
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
          width={width > BREAKPOINT.sm ? '70%' : null}
        >
          <FormattedMessage id="Global.headline" />
        </TableHeaderCell>
        {width > BREAKPOINT.sm ? (
          <TableHeaderCell
            title={formatMessage({ id: 'Global.publicationDate' })}
          >
            <FormattedMessage id="Global.publicationDate" />
          </TableHeaderCell>
        ) : null}
        <TableHeaderCell
          title={formatMessage({ id: 'Global.mediaImpactScore' })}
        >
          <FormattedMessage id="Global.mediaImpactScoreAcronym" />
        </TableHeaderCell>
      </TableHeader>
    );
  }

  renderMediaImpactScore(mediaImpactScore = 0) {
    const { intl: { formatMessage } } = this.props;

    return (
      <TableCell dataLabel={formatMessage({ id: 'Global.mediaImpactScore' })}>
        {mediaImpactScore}
      </TableCell>
    );
  }

  renderRow(index) {
    const { data, width } = this.props;
    const {
      id,
      mediaImpactScore,
      pdf,
      publicationDate,
      title,
      isTeased,
    } = data[index];

    return (
      <TableRow key={id}>
        <GridMediaImpactScoreTitle
          id={id}
          onClick={this.handleTitleLinkClick}
          title={title}
          url={pdf == null ? null : pdf.url}
          isTeased={isTeased}
        />
        {width > BREAKPOINT.sm ? this.renderDate(publicationDate) : null}
        {this.renderMediaImpactScore(mediaImpactScore)}
      </TableRow>
    );
  }

  render() {
    const { data } = this.props;

    return (
      <Table fixedLayout noRowHover striped>
        {this.renderHeader()}
        <TableBody>{data.map((_, index) => this.renderRow(index))}</TableBody>
      </Table>
    );
  }
}

GridMediaImpactScore.propTypes = propTypes;
export default injectIntl(GridMediaImpactScore);
