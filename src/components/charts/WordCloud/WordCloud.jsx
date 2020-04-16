import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Wordcloud from 'wordcloud';

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  limit: PropTypes.number,
  range: PropTypes.arrayOf(PropTypes.number).isRequired,
};
const defaultProps = {
  limit: null,
};

class WordCloud extends Component {
  constructor(props) {
    super(props);

    this.wordcloud = null;
  }

  componentDidMount() {
    const { data, limit } = this.props;

    if (data != null) {
      this.createChart(limit);
    }
  }

  componentWillReceiveProps() {
    if (this.wordcloud != null) {
      this.wordcloud = null;
    }
  }

  componentDidUpdate() {
    const { limit } = this.props;

    this.createChart(limit);
  }

  formatData(limit) {
    const { data, range } = this.props;
    const sortedData = data.sort((a, b) => b.value - a.value);
    const d =
      typeof limit === 'number' ? sortedData.slice(0, limit) : sortedData;
    const values = d.map(e => e.value);
    const minp = Math.min.apply(null, values);
    const maxp = Math.max.apply(null, values);
    const minv = Math.log(range[0]);
    const maxv = Math.log(range[1]);
    const scale = (maxv - minv) / (maxp - minp);

    return (
      d &&
      d.map(e => [
        e.label.toString().length > 25
          ? `${e.label.substring(0, 25)}...`
          : e.label,
        d.length > 1 && minp !== maxp
          ? Math.round(Math.exp(minv + scale * (e.value - minp)))
          : 20,
      ])
    );
  }

  createChart(limit) {
    const { id } = this.props;
    const element = document.getElementById(id);

    if (!this.wordcloud && element) {
      this.wordcloud = new Wordcloud(element, {
        backgroundColor: 'transparent',
        fontFamily: 'Roboto, sans-serif',
        gridSize: 15,
        list: this.formatData(limit),
        rotateRatio: 0,
        shuffle: false,
      });
    }
  }

  render() {
    const { id } = this.props;

    return (
      <div
        style={{
          height: '100%',
          padding: '1.25rem',
          width: '100%',
        }}
      >
        <div
          id={id}
          style={{
            height: '100%',
            padding: '1.25rem',
            position: 'relative',
            width: '100%',
          }}
        />
      </div>
    );
  }
}

WordCloud.defaultProps = defaultProps;
WordCloud.propTypes = propTypes;
export default WordCloud;
