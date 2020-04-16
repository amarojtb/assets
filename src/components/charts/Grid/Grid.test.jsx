/**
 * Unit tests for Grid component.
 */
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import sinon from 'sinon';
import ClipActionCreators from 'actions/ClipActionCreators';
import Table, {
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'components/Table';
import { intl, mountWithIntl } from 'services/enzyme-test-helper';
import * as StringUtils from 'services/StringUtils';
import Grid from './Grid';
import GridFacebook from './GridFacebook';
import GridMediaImpactScore from './GridMediaImpactScore';
import GridMediaImpactScoreTitle from './GridMediaImpactScoreTitle';
import GridTwitter from './GridTwitter';

const mediaImpactScoreData = [
  {
    id: 'FR5_419849717',
    indexName: '.clips-201710',
    mediaImpactScore: 89,
    pdf: {
      url:
        'http://s.kmni.eu/s/AV8LH7CXYKVjLaDP-TAM/barmagazine.co.uk_20171011000000',
    },
    publicationDate: '2017-10-11T00:00:00',
    title: 'London triumphs in award for best bar in Europe',
  },
  {
    id: 'FR5_419757719',
    indexName: '.clips-201710',
    mediaImpactScore: 59,
    pdf: {
      url: null,
    },
    publicationDate: '2017-10-11T00:00:00',
    title: 'A new style of afternoon tea at the Langham Melbourne',
  },
  {
    id: 'FR5_419720582',
    indexName: '.clips-201710',
    mediaImpactScore: 48,
    pdf: {
      url:
        'http://s.kmni.eu/s/AV8LH6tL5eXy2i4gRPK1/whimn.com.au_20171010000000',
    },
    publicationDate: '2017-10-10T00:00:00',
    title:
      'Hangover-Free Prosecco Just Launched - And Yes, Dreams Do Come True',
  },
  {
    id: 'FR5_419869958',
    indexName: '.clips-201710',
    mediaImpactScore: 36,
    pdf: {
      url:
        'http://s.kmni.eu/s/AV8PbJq6mFoOlOYuYmVz/visitedeco.com_20171011000000',
    },
    publicationDate: '2017-10-11T00:00:00',
    title: 'AMÉNAGER UNE SUITE PARENTALE DE RÊVE',
  },
];
const twitterData = [
  {
    idTweet: '896049330007580672',
    publicationDate: '2017-08-11T16:43:00',
    retweets: 18,
    title:
      "RT <a target='_blank' href='https://twitter.com/cityofcalgary'>@cityofcalgary</a>: Thanks to SW Calgarians, we’ve begun composting over 2,000,000kg of food/yard waste. NW collection starts next week… <a target='_blank' href='https://t.co/L9rhbrTfsR'>https://t.co/L9rhbrTfsR</a>",
  },
  {
    idTweet: '895485275693957120',
    publicationDate: '2017-08-10T03:21:00',
    retweets: 9,
    title:
      "RT <a target='_blank' href='https://twitter.com/mojomathers'>@mojomathers</a>: My tribute to Metiria, \"one of the most generous, brave and compassionate women I know\".\n<a target='_blank' href='https://t.co/gOhVx3f3wQ'>https://t.co/gOhVx3f3wQ</a>",
  },
  {
    idTweet: '893548880117112832',
    publicationDate: '2017-08-04T19:07:00',
    retweets: 3,
    title:
      "RT <a target='_blank' href='https://twitter.com/OneMontgomeryG'>@OneMontgomeryG</a>: Learn about the circular economy & building a greener local economy 8/17, 6pm, County Council Offices in Rockville.… <a target='_blank' href='https://t.co/ZMPYVHuPwd'>https://t.co/ZMPYVHuPwd</a>",
  },
];
const parentElementWidth = 565;

describe('Grid', () => {
  const facebookParameters = { segment1OnField: 'facebookShares' };
  const mediaImpactScoreParameters = { segment1OnField: 'mediaImpactScore' };
  const twitterParameters = { segment1OnField: 'twittertweetid' };
  const parentElementId = 'd52a1781-fe9c-4709-811c-2de595fc9f8c';
  const parentElement = document.createElement('div');
  let mountGrid;
  let shallowGrid;

  parentElement.id = parentElementId;
  parentElement.style.width = `${parentElementWidth}px`;
  document.body.appendChild(parentElement);

  beforeEach(() => {
    mountGrid = mountWithIntl(
      <Grid
        data={[]}
        params={mediaImpactScoreParameters}
        parentElementId="d52a1781-fe9c-4709-811c-2de595fc9f8c"
        expanded
      />
    );

    shallowGrid = shallow(
      <Grid
        data={[]}
        params={mediaImpactScoreParameters}
        parentElementId="d52a1781-fe9c-4709-811c-2de595fc9f8c"
        expanded
      />
    );
  });

  it('should render correctly', () => {
    expect(shallowGrid.type()).to.equal('div');
  });

  it('should have correct className value', () => {
    expect(shallowGrid.hasClass('c-grid')).to.be.true;
  });

  it('should the "width" state value is correct', () => {
    expect(shallowGrid.state('width')).to.be.equal(parentElementWidth);
  });

  it('should the "width" state update when resize event is triggered', () => {
    const newWidth = 400;
    const resizeEvent = new Event('resize');

    parentElement.style.width = `${newWidth}px`;
    window.dispatchEvent(resizeEvent);
    expect(mountGrid.state('width')).to.be.equal(newWidth);
  });

  it('should display "no data" if "segment1OnField" is incorrect', () => {
    shallowGrid.setProps({ params: {} });
    expect(shallowGrid.find('.c-widget__no-data')).to.have.lengthOf(1);
    expect(
      shallowGrid
        .find(FormattedMessage)
        .findWhere(messageItem => messageItem.prop('id') === 'Global.noData')
    ).to.have.lengthOf(1);
  });

  it('should display the Facebook grid if "segment1OnField" value is "facebookShares"', () => {
    shallowGrid.setProps({ params: facebookParameters });
    expect(shallowGrid.find(GridFacebook)).to.have.lengthOf(1);
  });

  it('should have the "c-grid--facebook" className if "segment1OnField" value is "facebookShares"', () => {
    shallowGrid.setProps({ params: facebookParameters });
    expect(shallowGrid.hasClass('c-grid--facebook')).to.be.true;
  });

  it('should display the Media Impact Score grid if "segment1OnField" value is "mediaImpactScore"', () => {
    expect(shallowGrid.find(GridMediaImpactScore)).to.have.lengthOf(1);
  });

  it('should display the Twitter grid if "segment1OnField" value is "twittertweetid"', () => {
    shallowGrid.setProps({ params: twitterParameters });
    expect(shallowGrid.find(GridTwitter)).to.have.lengthOf(1);
  });

  it('should have the "c-grid--twitter" className if "segment1OnField" value is "twittertweetid"', () => {
    shallowGrid.setProps({ params: twitterParameters });
    expect(shallowGrid.hasClass('c-grid--twitter')).to.be.true;
  });
});

describe('GridMediaImpactScore', () => {
  let shallowGridMediaImpactScore;

  beforeEach(() => {
    shallowGridMediaImpactScore = shallow(
      <GridMediaImpactScore.WrappedComponent
        data={mediaImpactScoreData}
        intl={intl}
        params={{ segment1OnField: 'mediaImpactScore' }}
        width={parentElementWidth}
      />
    );
  });

  it('should render correctly', () => {
    expect(shallowGridMediaImpactScore.type()).to.equal(Table);
    expect(shallowGridMediaImpactScore.prop('fixedLayout')).to.be.true;
    expect(shallowGridMediaImpactScore.prop('noRowHover')).to.be.true;
    expect(shallowGridMediaImpactScore.prop('striped')).to.be.true;
  });

  it('should render the header', () => {
    expect(shallowGridMediaImpactScore.find(TableHeader)).to.be.lengthOf(1);
  });

  it('should render header cells', () => {
    expect(shallowGridMediaImpactScore.find(TableHeaderCell)).to.be.lengthOf(3);
  });

  it('should render good translations in header cells', () => {
    const { messages } = intl;
    const headerCells = shallowGridMediaImpactScore.find(TableHeaderCell);
    const titleCell = headerCells.at(0);
    const publicationDateCell = headerCells.at(1);
    const mediaImpactScoreCell = headerCells.at(2);

    expect(titleCell.prop('title')).to.equal(messages['Global.headline']);
    expect(titleCell.find(FormattedMessage).prop('id')).to.equal(
      'Global.headline'
    );
    expect(publicationDateCell.prop('title')).to.equal(
      messages['Global.publicationDate']
    );
    expect(publicationDateCell.find(FormattedMessage).prop('id')).to.equal(
      'Global.publicationDate'
    );
    expect(mediaImpactScoreCell.prop('title')).to.equal(
      messages['Global.mediaImpactScore']
    );
    expect(mediaImpactScoreCell.find(FormattedMessage)).to.have.lengthOf(1);
    expect(
      mediaImpactScoreCell
        .find(FormattedMessage)
        .at(0)
        .prop('id')
    ).to.equal('Global.mediaImpactScoreAcronym');
    expect(
      mediaImpactScoreCell
        .find(FormattedMessage)
        .at(0)
        .prop('id')
    ).to.equal('Global.mediaImpactScoreAcronym');
  });

  it('should the title column take 70% above small breakpoint', () => {
    expect(
      shallowGridMediaImpactScore
        .find(TableHeaderCell)
        .at(0)
        .prop('width')
    ).to.equal('70%');
    shallowGridMediaImpactScore.setProps({ width: 200 });
    expect(
      shallowGridMediaImpactScore
        .find(TableHeaderCell)
        .at(0)
        .prop('width')
    ).to.be.null;
  });

  it('should not render publication date header column if width is smaller than small breakpoint', () => {
    shallowGridMediaImpactScore.setProps({ width: 200 });

    const { messages } = intl;
    const headerCells = shallowGridMediaImpactScore.find(TableHeaderCell);

    expect(headerCells).to.be.lengthOf(2);
    expect(
      headerCells.findWhere(
        headerCell =>
          headerCell.prop('title') === messages['Global.publicationDate']
      )
    ).to.have.lengthOf(0);
  });

  it('should render body', () => {
    expect(shallowGridMediaImpactScore.find(TableBody)).to.have.lengthOf(1);
  });

  it('should render rows', () => {
    expect(shallowGridMediaImpactScore.find(TableRow)).to.be.lengthOf(
      mediaImpactScoreData.length
    );
  });

  it('should render cells', () => {
    shallowGridMediaImpactScore.find(TableRow).forEach(tableRow => {
      expect(tableRow.children()).to.be.lengthOf(3);
      expect(tableRow.find(TableCell)).to.be.lengthOf(2);
    });
  });

  it('should render GridMediaImpactScoreTitle component in the title column', () => {
    shallowGridMediaImpactScore.find(TableRow).forEach(tableRow => {
      const cell = tableRow.children().at(0);

      expect(cell.find(GridMediaImpactScoreTitle)).to.have.lengthOf(1);
    });
  });

  it('should addConsumption is triggered when the url of the PDF exists', () => {
    const { id, indexName } = mediaImpactScoreData[0];
    const model = {
      id,
      indexName,
      type: 'pdf',
    };

    sinon.spy(ClipActionCreators, 'addConsumption');
    shallowGridMediaImpactScore.instance().handleTitleLinkClick(id);
    expect(ClipActionCreators.addConsumption.withArgs(model).calledOnce).to.be
      .true;
    ClipActionCreators.addConsumption.restore();
  });

  it('should open CreatePDF page when the url of the PDF is null', () => {
    const { id, indexName } = mediaImpactScoreData[1];

    sinon.spy(window, 'open');
    shallowGridMediaImpactScore.instance().handleTitleLinkClick(id);
    // expect(
    //   window.open.withArgs(`/Common/CreatePDF?id=${id}&indexName=${indexName}`)
    //     .calledOnce
    // ).to.be.true;
    window.open.restore();
  });

  it('should the publication date column has a data label attribute', () => {
    shallowGridMediaImpactScore.find(TableRow).forEach(tableRow => {
      const { messages } = intl;
      const cell = tableRow.children().at(1);

      expect(cell.prop('dataLabel')).to.equal(messages['Global.date']);
    });
  });

  it('should the publication date column has a title attribute', () => {
    shallowGridMediaImpactScore.find(TableRow).forEach((tableRow, index) => {
      const { formatDate } = intl;
      const cell = tableRow.children().at(1);

      expect(cell.prop('title')).to.equal(
        formatDate(mediaImpactScoreData[index].publicationDate, {
          day: 'numeric',
          month: 'long',
        })
      );
    });
  });

  it('should render the publication date', () => {
    shallowGridMediaImpactScore.find(TableRow).forEach(tableRow => {
      const cell = tableRow.children().at(1);
      const date = cell.find(FormattedDate);

      expect(date).to.have.lengthOf(1);
      expect(date.prop('day')).to.equal('numeric');
      expect(date.prop('month')).to.equal('short');
      expect(date.prop('value')).to.be.an.instanceof(Date);
    });
  });

  it('should not render publication date column if width is smaller than small breakpoint', () => {
    shallowGridMediaImpactScore.setProps({ width: 200 });
    shallowGridMediaImpactScore.find(TableRow).forEach(tableRow => {
      expect(tableRow.children()).to.have.lengthOf(2);
      expect(tableRow.find(FormattedDate).exists()).to.be.false;
    });
  });

  it('should the media impact score column has a data label attribute', () => {
    shallowGridMediaImpactScore.find(TableRow).forEach(tableRow => {
      const { messages } = intl;
      const cell = tableRow.children().at(2);

      expect(cell.prop('dataLabel')).to.equal(
        messages['Global.mediaImpactScore']
      );
    });
  });

  it('should render the media impact score column', () => {
    shallowGridMediaImpactScore.find(TableRow).forEach((tableRow, index) => {
      const cell = tableRow.children().at(2);

      expect(Number(cell.children().text())).to.equal(
        mediaImpactScoreData[index].mediaImpactScore
      );
    });
  });
});

describe('GridMediaImpactScoreTitle', () => {
  const { id, title, pdf: { url } } = mediaImpactScoreData[0];
  let shallowGridMediaImpactScoreTitle;

  beforeEach(() => {
    shallowGridMediaImpactScoreTitle = shallow(
      <GridMediaImpactScoreTitle.WrappedComponent
        id={id}
        intl={intl}
        onClick={() => {}}
        title={title}
        url={url}
        isTeased={false}
      />
    );
  });

  it('should render correctly', () => {
    expect(shallowGridMediaImpactScoreTitle.type()).to.equal(TableCell);
  });

  it('should have a data label attribute', () => {
    const { messages } = intl;

    expect(shallowGridMediaImpactScoreTitle.prop('dataLabel')).to.equal(
      messages['Global.headline']
    );
  });

  it('should have a title attribute', () => {
    expect(shallowGridMediaImpactScoreTitle.prop('title')).to.equal(title);
  });

  it('should render a link', () => {
    expect(shallowGridMediaImpactScoreTitle.find('a')).to.have.lengthOf(1);
  });

  it('should have an url', () => {
    expect(shallowGridMediaImpactScoreTitle.find('a').prop('href')).to.equal(
      url
    );
  });

  it('should onClick function is called when click on the link', () => {
    const onClick = sinon.spy();

    shallowGridMediaImpactScoreTitle.setProps({ onClick });
    shallowGridMediaImpactScoreTitle.find('a').simulate('click');
    expect(onClick.calledOnce).to.be.true;
  });
});

describe('GridTwitter', () => {
  let shallowGridTwitter;

  beforeEach(() => {
    shallowGridTwitter = shallow(
      <GridTwitter.WrappedComponent
        data={twitterData}
        intl={intl}
        width={parentElementWidth}
      />
    );
  });

  it('should render correctly', () => {
    expect(shallowGridTwitter.type()).to.equal(Table);
    expect(shallowGridTwitter.prop('fixedLayout')).to.be.true;
  });

  it('should render the header', () => {
    expect(shallowGridTwitter.find(TableHeader)).to.be.lengthOf(1);
  });

  it('should render header cells', () => {
    expect(shallowGridTwitter.find(TableHeaderCell)).to.be.lengthOf(3);
  });

  it('should render good translations in header cells', () => {
    const { messages } = intl;
    const headerCells = shallowGridTwitter.find(TableHeaderCell);
    const titleCell = headerCells.at(0);
    const publicationDateCell = headerCells.at(1);
    const retweetsCell = headerCells.at(2);

    expect(titleCell.prop('title')).to.equal(messages['Global.headline']);
    expect(titleCell.find(FormattedMessage).prop('id')).to.equal(
      'Global.headline'
    );
    expect(publicationDateCell.prop('title')).to.equal(messages['Global.date']);
    expect(publicationDateCell.find(FormattedMessage).prop('id')).to.equal(
      'Global.date'
    );
    expect(retweetsCell.prop('title')).to.equal(messages['Global.retweets']);
    expect(retweetsCell.find(FormattedMessage).prop('id')).to.equal(
      'Global.retweets'
    );
  });

  it('should the title column take 50% above small breakpoint', () => {
    expect(
      shallowGridTwitter
        .find(TableHeaderCell)
        .at(0)
        .prop('width')
    ).to.equal('50%');
    shallowGridTwitter.setProps({ width: 300 });
    expect(
      shallowGridTwitter
        .find(TableHeaderCell)
        .at(0)
        .prop('width')
    ).to.be.null;
  });

  it('should not render publication date header column if width is smaller than small breakpoint', () => {
    shallowGridTwitter.setProps({ width: 200 });

    const { messages } = intl;
    const headerCells = shallowGridTwitter.find(TableHeaderCell);

    expect(headerCells).to.be.lengthOf(2);
    expect(
      headerCells.findWhere(
        headerCell => headerCell.prop('title') === messages['Global.date']
      )
    ).to.have.lengthOf(0);
  });

  it('should render body', () => {
    expect(shallowGridTwitter.find(TableBody)).to.have.lengthOf(1);
  });

  it('should render rows', () => {
    expect(shallowGridTwitter.find(TableRow)).to.be.lengthOf(
      twitterData.length
    );
  });

  it('should render cells', () => {
    shallowGridTwitter.find(TableRow).forEach(tableRow => {
      expect(tableRow.find(TableCell)).to.be.lengthOf(3);
    });
  });

  it('should the title column has a data label attribute', () => {
    shallowGridTwitter.find(TableRow).forEach(tableRow => {
      const { messages } = intl;
      const cell = tableRow.children().at(0);

      expect(cell.prop('dataLabel')).to.equal(messages['Global.headline']);
    });
  });

  it('should the title column has a title attribute', () => {
    shallowGridTwitter.find(TableRow).forEach((tableRow, index) => {
      const { title } = twitterData[index];
      const cell = tableRow.children().at(0);

      expect(cell.prop('title')).to.equal(StringUtils.cleanHtml(title));
    });
  });

  it('should the title render a link', () => {
    shallowGridTwitter.find(TableRow).forEach(tableRow => {
      expect(tableRow.find('a')).to.have.lengthOf(1);
    });
  });

  it('should the link title has an url', () => {
    shallowGridTwitter.find(TableRow).forEach((tableRow, index) => {
      const { idTweet } = twitterData[index];

      expect(tableRow.find('a').prop('href')).to.equal(
        `https://twitter.com/statuses/${idTweet}`
      );
    });
  });

  it('should render the title column', () => {
    shallowGridTwitter.find(TableRow).forEach((tableRow, index) => {
      const { idTweet, title } = twitterData[index];
      const cell = tableRow.children().at(0);

      expect(cell.find('a').html()).to.equal(
        `<a class="u-text-link--reset" href="https://twitter.com/statuses/${idTweet}" rel="noopener noreferrer" target="_blank">${title}</a>`
      );
    });
  });

  it('should not render publication date column if width is smaller than small breakpoint', () => {
    shallowGridTwitter.setProps({ width: 200 });
    shallowGridTwitter.find(TableRow).forEach(tableRow => {
      expect(tableRow.children()).to.have.lengthOf(2);
      expect(tableRow.find(FormattedDate).exists()).to.be.false;
    });
  });

  it('should the publication date column has a data label attribute', () => {
    shallowGridTwitter.find(TableRow).forEach(tableRow => {
      const { messages } = intl;
      const cell = tableRow.children().at(1);

      expect(cell.prop('dataLabel')).to.equal(messages['Global.date']);
    });
  });

  it('should the publication date column has a title attribute', () => {
    shallowGridTwitter.find(TableRow).forEach((tableRow, index) => {
      const { formatDate } = intl;
      const cell = tableRow.children().at(1);

      expect(cell.prop('title')).to.equal(
        formatDate(twitterData[index].publicationDate, {
          day: 'numeric',
          month: 'long',
        })
      );
    });
  });

  it('should render the publication date', () => {
    shallowGridTwitter.find(TableRow).forEach(tableRow => {
      const cell = tableRow.children().at(1);
      const date = cell.find(FormattedDate);

      expect(date).to.have.lengthOf(1);
      expect(date.prop('day')).to.equal('numeric');
      expect(date.prop('month')).to.equal('short');
      expect(date.prop('value')).to.be.an.instanceof(Date);
    });
  });

  it('should not render publication date column if width is smaller than small breakpoint', () => {
    shallowGridTwitter.setProps({ width: 200 });
    shallowGridTwitter.find(TableRow).forEach(tableRow => {
      expect(tableRow.children()).to.have.lengthOf(2);
      expect(tableRow.find(FormattedDate).exists()).to.be.false;
    });
  });

  it('should the retweets column has a data label attribute', () => {
    shallowGridTwitter.find(TableRow).forEach(tableRow => {
      const { messages } = intl;
      const cell = tableRow.children().at(2);

      expect(cell.prop('dataLabel')).to.equal(messages['Global.retweets']);
    });
  });

  it('should render the retweets column', () => {
    shallowGridTwitter.find(TableRow).forEach((tableRow, index) => {
      const cell = tableRow.children().at(2);

      expect(Number(cell.children().text())).to.equal(
        twitterData[index].retweets
      );
    });
  });
});
