/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import React, { Component, Fragment } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import Loader from 'components/TinyLoader';
import Svg from 'components/Svg';
import Input from 'components/Input';
import DropDown from 'components/DropDown';
import SearchStore from 'stores/SearchStore';
import SearchActionCreators from 'actions/SearchActionCreators';
import './AppliedFilters.css';

class AppliedFilters extends Component {
  static handleDeleteFacet(facet) {
    return () => {
      SearchStore.deleteFacet(facet);

      SearchActionCreators.updateFilter(SearchStore.buildSearchModel());
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      filtersApplied: {},
      collapsed: false,
      saveIsVisible: false,
      inputValue: '',
      error: false,
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleToggleCollapse = this.handleToggleCollapse.bind(this);
    this.handleSaveSearchChange = this.handleSaveSearchChange.bind(this);
    this.handleToggleSaveSearch = this.handleToggleSaveSearch.bind(this);
    this.handleCreateFavoriteSearch = this.handleCreateFavoriteSearch.bind(
      this
    );
  }

  componentWillMount() {
    SearchStore.addChangeListener(this.onSearchChange);
  }

  componentWillUnmount() {
    SearchStore.removeChangeListener(this.onSearchChange);
  }

  onSearchChange() {
    const facets = SearchStore.getSelectedFacetsObjectsArrayGrouped();

    this.setState({
      saveIsVisible: false,
      isLoading: false,
      inputValue: '',
      filtersApplied: facets,
    });
  }

  handleToggleCollapse() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleToggleSaveSearch() {
    this.setState({
      saveIsVisible: !this.state.saveIsVisible,
    });
  }

  handleSaveSearchChange(value) {
    this.setState({
      saveIsVisible: true,
      inputValue: value,
      error: !!!value,
    });
  }

  handleClearAll() {
    const { updateFilter } = this.props;

    SearchStore.clearAllFacets();
    SearchStore.setSelectedFavouriteSearch(null);
    updateFilter();
    this.setState({
      filtersApplied: {},
    });
  }

  handleCreateFavoriteSearch() {
    const { inputValue } = this.state;

    if (inputValue.length === 0) {
      this.setState({
        saveIsVisible: true,
        error: true,
      });
      return;
    }

    const searchModel = JSON.stringify({
      ...SearchStore.buildSearchModel({ favoriteSearch: true }),
    });

    const model = {
      Criterias: searchModel,
      Id: 0,
      Name: inputValue,
      Type: 0,
    };

    this.setState({
      isLoading: true,
      error: false,
    });

    SearchActionCreators.createFavoriteSearch(model);
  }

  render() {
    const {
      filtersApplied,
      collapsed,
      saveIsVisible,
      error,
      inputValue,
      isLoading,
    } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;

    return (
      <Fragment>
        {Object.keys(filtersApplied).length > 0 && (
          <div className="c-filters-applied">
            <div className="filters-applied__heading">
              <Button
                onClick={this.handleToggleCollapse}
                className="c-filters-applied_collapser"
              >
                <Svg icon={`${collapsed ? 'chevron-down' : 'chevron-up'}`} />
              </Button>
              <DropDown
                title={() => <Svg size="large" icon="save" />}
                collapsed={saveIsVisible}
                className="c-dropdown-save_search"
                onClick={this.handleToggleSaveSearch}
              >
                <div className="c-filters-applied__save-dropdown">
                  <span className="create-search_title">
                    <FormattedMessage id="SearchBar.appliedFilter.createSearch" />
                  </span>
                  <Input
                    className="create-search_input"
                    error={
                      error
                        ? formatMessage({ id: 'Global.requiredField' })
                        : null
                    }
                    onChange={this.handleSaveSearchChange}
                    value={inputValue}
                  />
                  <div className="create-search_actions m-top--x-small text-right">
                    <Button
                      type="primary"
                      onClick={this.handleCreateFavoriteSearch}
                    >
                      {(isLoading && <Loader />) ||
                        window.Messages['Global.ok']}
                    </Button>
                  </div>
                </div>
              </DropDown>
              <h3>
                <FormattedMessage id="SearchBar.appliedFilter.filterApplied" />
              </h3>
            </div>
            <div
              className={`c-filters-applied_content ${(collapsed &&
                'collapsed') ||
                'expanded'}`}
            >
              <div className="c-filters-applied_content__wrapper">
                <Button
                  type="link"
                  onClick={this.handleClearAll}
                  className="c-filters-applied_clear"
                >
                  <FormattedMessage id="ReactSelect.clearAllText" />
                </Button>
                {Object.keys(filtersApplied).map(key => {
                  const facets = filtersApplied[key];
                  return (
                    <div className="filter-applied__group" key={key}>
                      <div className="title">
                        {window.Messages[`Facets.${key}`]}
                      </div>
                      <ul className="filter-applied__group__list">
                        {facets.map(({ text, id, value }) => (
                          <li key={id + value}>
                            {id === 'headlines.isoCode'
                              ? window.Messages[`Global.Language.${value}`]
                              : id === 'sentiment.level'
                              ? window.Messages[`Global.${value.toLowerCase()}`]
                              : (window.Messages[
                                  `Global.${value.toLowerCase()}`
                                ] &&
                                  window.Messages[
                                    `Global.${value.toLowerCase()}`
                                  ]) ||
                                text}
                            <span
                              className="filter-applied__group__list-close t-color-primary-bg-hover"
                              onClick={AppliedFilters.handleDeleteFacet({
                                text,
                                id,
                                value,
                              })}
                              onKeyUp={AppliedFilters.handleDeleteFacet({
                                text,
                                id,
                                value,
                              })}
                              role="button"
                              tabIndex={0}
                            >
                              x
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default injectIntl(AppliedFilters, { withRef: true });
