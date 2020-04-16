import Flickity from 'flickity';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ResponsiveTableColumn from './ResponsiveTableColumn';
import './Table.css';

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  fixed: PropTypes.number.isRequired,
  labels: PropTypes.shape(PropTypes.string.isRequired).isRequired,
  onSortClick: PropTypes.func.isRequired,
};

class ResponsiveTable extends Component {
  static getColumnData(data, columnName) {
    const columnData = [];

    data.forEach(item => {
      columnData.push(item[columnName]);
    });

    return columnData;
  }

  constructor(props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth,
    };

    this.onWindowResize = this.onWindowResize.bind(this);
    this.refTableScroll = this.refTableScroll.bind(this);
  }

  componentDidMount() {
    this.initFlickity();
    this.flkty.resize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      this.flkty.resize();
    }, 100);
  }

  componentWillUnmount() {
    if (this.flkty) {
      this.flkty.destroy();
    }
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    this.setState({ windowWidth: window.innerWidth });
    this.initFlickity();
    this.flkty.resize();
  }

  initFlickity() {
    const options = {
      adaptiveHeight: false,
      cellAlign: 'left',
      contain: true,
      dragThreshold: 10,
      freeScroll: false,
      groupCells: true,
      pageDots: false,
      prevNextButtons: true,
    };

    this.flkty = new Flickity(this.tableScroll, options);
  }

  refTableScroll(ref) {
    this.tableScroll = ref;
  }

  renderFixedColumn() {
    const { data, fixed, labels, onSortClick } = this.props;
    const keys = Object.keys(labels);

    return keys.map(
      (key, index) =>
        index < fixed ? (
          <ResponsiveTableColumn
            data={ResponsiveTable.getColumnData(data, key)}
            fixed={index < fixed}
            key={key}
            keyLabel={key}
            label={labels[key]}
            onSortClick={onSortClick}
          />
        ) : null
    );
  }

  renderCarousel(all = false) {
    const { data, fixed, labels, onSortClick } = this.props;
    const keys = Object.keys(labels);

    return keys.map(
      (key, index) =>
        index >= fixed || all ? (
          <ResponsiveTableColumn
            data={ResponsiveTable.getColumnData(data, key)}
            fixed={false}
            key={key}
            keyLabel={key}
            label={labels[key]}
            logins={data.map(({ login }) => login)}
            onSortClick={onSortClick}
          />
        ) : null
    );
  }

  renderMobile() {
    return (
      <div className="table-wrapper">
        <div className="table-scroll carousel" ref={this.refTableScroll}>
          {this.renderCarousel(true)}
        </div>
      </div>
    );
  }

  renderDesktop() {
    return (
      <div className="table-wrapper">
        {this.renderFixedColumn()}
        <div className="table-scroll carousel" ref={this.refTableScroll}>
          {this.renderCarousel(false)}
        </div>
      </div>
    );
  }

  render() {
    const { windowWidth } = this.state;

    return windowWidth <= 1024 ? this.renderMobile() : this.renderDesktop();
  }
}

ResponsiveTable.propTypes = propTypes;
export default ResponsiveTable;
