import React, { Component, Fragment } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import SearchStore from 'stores/SearchStore';
import FacetStore from 'stores/FacetStore';
import SearchActionCreators from 'actions/SearchActionCreators';
import Toggle from 'components/Toggle';
import Svg from 'components/Svg';
import Input from 'components/Input';
import Checkbox from 'components/Checkbox';
import Loader from 'components/Loader';
import parameters from 'constants/parameters';
import DateSelector from './components/DateSelectorSearch';
import FavouriteSearch from './components/FavouriteSearch';
import ContentList from './components/ContentList';
import AppliedFilters from './components/AppliedFilters';
import AdvancedFilter from '../../../Areas/Delivery/Content/components/AdvancedFilters';
import QueryBuilder from '../../../Areas/Delivery/Content/components/QueryBuilderConfiguration';
import FacetFonfiguration from '../../../Areas/Delivery/Content/components/FacetsConfiguration';
import Facets from '../../../Areas/Delivery/Content/components/Facets';
import './SearchBar.css';

const { TIMEOUT_BEFORE_FILTER_UPDATE } = parameters;

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      totalArticles: 0,
      Q: '',
      isLoading: false,
    };

    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.onUpdateFilter = this.onUpdateFilter.bind(this);
    this.handleQueryBuilderClick = this.handleQueryBuilderClick.bind(this);
    this.handleKeyPressEnter = this.handleKeyPressEnter.bind(this);
    this.handleDateSelectorChange = this.handleDateSelectorChange.bind(this);
    this.handleFullTextSearchInputChange = this.handleFullTextSearchInputChange.bind(
      this
    );
    this.handleFacetConfigurationClick = this.handleFacetConfigurationClick.bind(
      this
    );
    this.showLoader = this.showLoader.bind(this);
    this.hideLoader = this.hideLoader.bind(this);
    this.advancedFilterRef = this.advancedFilterRef.bind(this);
    this.queryBuilderRef = this.queryBuilderRef.bind(this);
    this.facetConfigurationRef = this.facetConfigurationRef.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentWillMount() {
    const { lastPeriod } = this.props;

    const searchBarState = km.Common.LocalStorageManager.GetData(
      'searchbar_state'
    );

    this.setState({
      collapsed: searchBarState === 'false',
    });

    SearchStore.setLastPeriod(lastPeriod);
    SearchStore.addChangeListener(this.onUpdateFilter);
    FacetStore.addChangeListener(this.onUpdateFilter);
    SearchActionCreators.updateFilter(SearchStore.buildSearchModel());
  }

  componentWillUnmount() {
    SearchStore.removeChangeListener(this.onUpdateFilter);
    FacetStore.removeChangeListener(this.onUpdateFilter);
  }

  onUpdateFilter() {
    const totalArticles = SearchStore.totalClips;

    this.setState({
      isLoading: false,
      totalArticles,
    });
  }

  handleDateSelectorChange(mode, dates) {
    if (
      mode === 'custom' &&
      (!dates.universalDateFrom || !dates.universalDateTo)
    )
      return;
    SearchStore.setLogicalDate(mode);
    SearchStore.setLastPeriod({
      from: moment(dates.universalDateFrom)
        .set({
          hour: 0,
          minute: 0,
          second: 0,
        })
        .format('YYYY-MM-DD HH:mm:ss'),
      to: moment(dates.universalDateTo)
        .set({
          hour: 23,
          minute: 59,
          second: 59,
        })
        .format('YYYY-MM-DD HH:mm:ss'),
      logicalDate: SearchStore.getLogicalDate(true),
    });

    this.updateFilter();
  }

  handleQueryBuilderClick() {
    this.queryBuilder.getWrappedInstance().handleOpenModal();
  }

  handleFacetConfigurationClick() {
    this.facetConfiguration.getWrappedInstance().handleOpenModal();
  }

  handleToggleClick() {
    const dashboardContainer = document.querySelector('.c-dashboard_container');

    if (this.state.collapsed && dashboardContainer) {
      dashboardContainer.classList.remove('collapsed');
      dashboardContainer.classList.add('expanded');
    } else if (dashboardContainer) {
      dashboardContainer.classList.add('collapsed');
      dashboardContainer.classList.remove('expanded');
    }

    this.setState(state => ({
      collapsed: !state.collapsed,
    }));

    km.Common.LocalStorageManager.SaveData(
      'searchbar_state',
      this.state.collapsed
    );
  }

  handleFullTextSearchInputChange(value) {
    this.setState({
      Q: value,
    });
  }

  handleKeyPressEnter(e) {
    const { Q } = this.state;

    if (e.keyCode === 13) {
      SearchStore.setQ(Q);
      SearchActionCreators.updateFilter(SearchStore.buildSearchModel());
    }
  }

  showLoader() {
    this.setState({
      isLoading: true,
    });
  }

  hideLoader() {
    this.setState({
      isLoading: false,
    });
  }

  advancedFilterRef(ref) {
    this.advancedFilter = ref;
  }

  queryBuilderRef(ref) {
    this.queryBuilder = ref;
  }

  facetConfigurationRef(ref) {
    this.facetConfiguration = ref;
  }

  updateFilter() {
    clearTimeout(this.interval);

    this.setState({
      isLoading: true,
    });

    this.interval = setTimeout(
      SearchActionCreators.updateFilter(SearchStore.buildSearchModel()),
      TIMEOUT_BEFORE_FILTER_UPDATE
    );
  }

  renderAnalytics() {
    const { collapsed, totalArticles, Q, isLoading } = this.state;
    const {
      lastPeriod,
      intl: { formatMessage },
      context,
    } = this.props;

    return (
      <Fragment>
        {isLoading && <Loader />}
        <div className="c-search_bar left-column--filters t-primary-left-column">
          <QueryBuilder
            context={context}
            updateFilter={this.updateFilter}
            ref={this.queryBuilderRef}
          />
          <AdvancedFilter
            context={context}
            updateFilter={this.updateFilter}
            ref={this.advancedFilterRef}
          />
          <FacetFonfiguration ref={this.facetConfigurationRef} />
          <div
            className={`search_bar__content left-column ${
              collapsed ? '' : 'search_bar__content--hidden'
            }`}
          >
            <div className="search-bar_full-text-search t-color-primary">
              <Svg
                icon="search"
                size="large"
                className="full-text-search__icon"
              />
              <Input
                className="full-text_search__input"
                placeholder={window.Messages['Global.search']}
                onChange={this.handleFullTextSearchInputChange}
                onKeyDown={this.handleKeyPressEnter}
                value={Q}
              />
            </div>
            <div className="total-articles">
              <span className="text-bold">
                {totalArticles || 0} <FormattedMessage id="Global.articles" />
              </span>
            </div>
            <ContentList
              updateFilter={this.updateFilter}
              advancedFilterRef={this.advancedFilter}
            />
            <div className="splitter" />
            <div className="filter-labels">
              <div className="filter-title">
                <FormattedMessage id="Insight.widget.sidebar.filters" />
              </div>
              <div className="filters-actions">
                <div
                  onClick={this.handleFacetConfigurationClick}
                  onKeyUp={this.handleFacetConfigurationClick}
                  role="button"
                  tabIndex={-1}
                >
                  <Svg icon="gear" />
                </div>
                <div
                  onClick={this.handleQueryBuilderClick}
                  onKeyUp={this.handleQueryBuilderClick}
                  role="button"
                  tabIndex={0}
                >
                  <Svg icon="query-builder" />
                </div>
              </div>
            </div>
            <FavouriteSearch updateFilter={this.updateFilter} />
            <div className="splitter" />
            <AppliedFilters updateFilter={this.updateFilter} />
            <DateSelector
              lastPeriod={lastPeriod}
              onChange={this.handleDateSelectorChange}
              updateFilter={this.updateFilter}
            />
            <Facets
              context={context}
              updateFilter={this.updateFilter}
              selectedFacetItemIds={SearchStore.getSelectedFacetsArray()}
            />
          </div>
          <Toggle
            className={`${collapsed ? '' : 'toggle-cmp--hidden'}`}
            handleToggleClick={this.handleToggleClick}
            collapsed={collapsed}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { context } = this.props;

    return (
      <Fragment>{context === 'insights' && this.renderAnalytics()}</Fragment>
    );
  }
}

export default injectIntl(SearchBar, { withRef: true });
