import blacklist from 'blacklist';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Checkbox from 'components/Checkbox/Checkbox';
import Expanded from 'components/Expanded/Expanded';
import { widgetPropTypes } from 'components/Widget';
import WordCloud from './WordCloud';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class WordCloudExpanded extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: -1,
    };

    this.handleChangeLimit = this.handleChangeLimit.bind(this);
    this.refCheckbox = this.refCheckbox.bind(this);
  }

  handleChangeLimit() {
    this.setState({ limit: this.checkbox.getValue() ? 30 : -1 });
  }

  refCheckbox(ref) {
    this.checkbox = ref;
  }

  renderChart() {
    const { params: { data }, widget: { id } } = this.props;
    const { limit } = this.state;
    const props = {
      data,
      id: `wordcloud-expanded-${id}`,
      limit,
      range: [15, 70],
    };
    const blacklistedProps = blacklist(props, {
      limit: typeof limit !== 'number',
    });

    return <WordCloud {...blacklistedProps} />;
  }

  renderSidebarBody() {
    const { limit } = this.state;

    return (
      <div className="p-around--medium">
        <Checkbox
          checked={limit >= 0}
          onChange={this.handleChangeLimit}
          ref={this.refCheckbox}
        >
          <FormattedMessage id="WordCloud.only30" />
        </Checkbox>
      </div>
    );
  }

  render() {
    const { params: { data }, widget } = this.props;

    return (
      <Expanded
        icon="word-cloud"
        name="word-cloud"
        sidebarBody={this.renderSidebarBody()}
        widget={widget}
      >
        {data == null ? null : this.renderChart()}
      </Expanded>
    );
  }
}

WordCloudExpanded.propTypes = propTypes;
export default WordCloudExpanded;
