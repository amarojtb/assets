/* eslint-disable consistent-return */
import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import swal from 'sweetalert';
import DropDownSelect from 'components/DropDownSelect';
import Loader from 'components/TinyLoader';
import SearchActionCreators from 'actions/SearchActionCreators';
import SearchStore from 'stores/SearchStore';
import FavoriteSearchItem from './FavoriteSearchItem';
import './FavouriteSearch.css';

class FavouriteSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSearch: null,
      expandedDropDown: false,
      favouriteSearchLoading: false,
    };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleFavoriteSearchEdit = this.handleFavoriteSearchEdit.bind(this);
    this.handleFavoriteSearchSave = this.handleFavoriteSearchSave.bind(this);
    this.handleFavoriteSearchDelete = this.handleFavoriteSearchDelete.bind(
      this
    );
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchModelUpdate = this.onSearchModelUpdate.bind(this);
    this.renderDropDownTitle = this.renderDropDownTitle.bind(this);
  }

  componentWillMount() {
    SearchStore.addSearchObjectUpdateListener(this.onSearchModelUpdate);
    SearchStore.addChangeListener(this.onSearchChange);
  }

  componentWillUnmount() {
    SearchStore.removeSearchObjectUpdateListener(this.onSearchModelUpdate);
    SearchStore.removeChangeListener(this.onSearchChange);
  }

  onSearchModelUpdate() {
    if (!SearchStore.getSelectedFavouriteSearch()) {
      this.setState({
        selectedSearch: false,
      });
    }
  }

  onSearchChange() {
    this.setState({
      favouriteSearchLoading: false,
      expandedDropDown: this.fromInside,
    });
  }

  handleOnClick() {
    let fsLoading = false;
    const state = {
      expandedDropDown: true,
    };

    if (!SearchStore.isInitialized('favouriteSearches')) {
      fsLoading = true;
      SearchActionCreators.getFavouriteSearches();
      state.expandedDropDown = true;
      this.fromInside = true;
    }

    this.setState({
      favouriteSearchLoading: fsLoading,
      expandedDropDown: state.expandedDropDown,
    });
  }

  handleItemClick(id) {
    if (!id) return;

    return () => {
      const { updateFilter } = this.props;
      const favouriteSearch = SearchStore.getFavouriteSearchById(id);
      const criterias = JSON.parse(favouriteSearch.Criterias);

      SearchStore.setHash(null);
      SearchStore.setTrashed(false);
      SearchStore.setDraftId(null);
      SearchStore.setSelectedFavouriteSearch(favouriteSearch.Id);
      SearchStore.addFacets(criterias.facetsSelected);
      SearchStore.searchModel = criterias.searchModel;

      updateFilter();

      this.setState({
        favouriteSearchLoading: true,
        selectedSearch: favouriteSearch,
        expandedDropDown: false,
      });
    };
  }

  handleFavoriteSearchSave(title, id) {
    if (!id) return;

    return () => {
      const favoriteSearch = SearchStore.getFavouriteSearchById(id);
      this.beingEditedId = null;

      SearchActionCreators.updateFavoriteSearch({
        ...favoriteSearch,
        Name: title,
      });

      this.setState({
        favouriteSearchLoading: true,
      });
    };
  }

  handleFavoriteSearchDelete(id) {
    if (!id) return;

    return () => {
      const favoriteSearch = SearchStore.getFavouriteSearchById(id);

      swal(
        {
          title: window.Messages['Global.warning'],
          text: window.Messages['FavouriteSearch.warningDeleteFavouriteSearch'],
          type: 'warning',
          showCancelButton: true,
          allowOutsideClick: true,
        },
        isConfirm => {
          if (isConfirm) {
            this.setState(
              {
                favouriteSearchLoading: true,
              },
              () => {
                SearchActionCreators.deleteFavoriteSearch({
                  Id: favoriteSearch.Id,
                });
              }
            );
          }
        }
      );

      this.setState({
        expandedDropDown: true,
      });
    };
  }

  handleFavoriteSearchEdit(id) {
    this.beingEditedId = id;
    this.setState({
      expandedDropDown: true,
    });
  }

  renderDropDownTitle() {
    const { favouriteSearchLoading, selectedSearch } = this.state;
    const isLoading = favouriteSearchLoading;

    return (
      <Fragment>
        <span>
          {(selectedSearch && selectedSearch.Name) ||
            window.Messages['SearchBar.favoriteSearch.mySearches']}
          {isLoading && <Loader className="favourite-search_loader" />}
        </span>
      </Fragment>
    );
  }

  renderFavouriteSearches() {
    const favSearches = SearchStore.getFavouriteSearches();

    return (
      <div>
        <div className="list-header">
          <FormattedMessage id="SearchBar.favoriteSearch.favoriteSearches" />
        </div>
        <ul className="favourite-search_list">
          {(favSearches &&
            favSearches.map(fs => (
              <FavoriteSearchItem
                item={fs}
                key={fs.Id}
                onSave={this.handleFavoriteSearchSave}
                onEdit={this.handleFavoriteSearchEdit}
                onDelete={this.handleFavoriteSearchDelete}
                onClick={this.handleItemClick}
                mode={this.beingEditedId === fs.Id ? 'edit' : 'list'}
              />
            ))) ||
            null}
        </ul>
        {favSearches && !!favSearches.length && <div className="separator" />}
      </div>
    );
  }

  render() {
    const { expandedDropDown } = this.state;

    return (
      <DropDownSelect
        title={this.renderDropDownTitle}
        onClick={this.handleOnClick}
        collapsed={expandedDropDown}
        className="c-favourite-search"
      >
        {this.renderFavouriteSearches()}
      </DropDownSelect>
    );
  }
}

export default FavouriteSearch;
