/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import React, { Component, Fragment } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import DropDownSelect from 'components/DropDownSelect';
import Loader from 'components/TinyLoader';
import Button from 'components/Button';
import ReviewActionCreators from 'actions/ReviewActionCreators';
import DraftActionCreators from 'actions/DraftActionCreators';
import SearchStore from 'stores/SearchStore';
import DraftStore from 'stores/DraftStore';
import ReviewStore from 'stores/ReviewStore';
import CreateDraft from '../../../../../Areas/Delivery/Content/components/CreateDraft';
import './ContentList.css';

class ContentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draftLoading: false,
      expandedDropDown: false,
      reviewLoading: false,
      selectedTitle: window.Messages['SearchBar.contentList.allArticles'],
    };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleOpenCreateDraft = this.handleOpenCreateDraft.bind(this);
    this.handleShowAllReviews = this.handleShowAllReviews.bind(this);
    this.onReviewChange = this.onReviewChange.bind(this);
    this.onDraftChange = this.onDraftChange.bind(this);
    this.onSearchModelUpdate = this.onSearchModelUpdate.bind(this);
    this.renderDropDownTitle = this.renderDropDownTitle.bind(this);
    this.renderDraftsList = this.renderDraftsList.bind(this);
  }

  componentWillMount() {
    SearchStore.addSearchObjectUpdateListener(this.onSearchModelUpdate);
    DraftStore.addChangeListener(this.onDraftChange);
    ReviewStore.addChangeListener(this.onReviewChange);
  }

  componentWillUnmount() {
    SearchStore.removeSearchObjectUpdateListener(this.onSearchModelUpdate);
    DraftStore.removeChangeListener(this.onDraftChange);
    ReviewStore.removeChangeListener(this.onReviewChange);
  }

  onReviewChange() {
    this.setState({
      reviewLoading: false,
      expandedDropDown: true,
    });
  }

  onSearchModelUpdate() {
    const hash = SearchStore.getHash();
    const draftId = SearchStore.getDraftId();
    const favSearchId = SearchStore.getSelectedFavouriteSearch();
    const trashed = SearchStore.getTrashed();

    if (hash) {
      const review = ReviewStore.getReviewByHash(hash);
      this.setState({
        selectedTitle: review.title,
      });
    } else if (draftId) {
      const draft = DraftStore.getDraftById(draftId);
      this.setState({
        selectedTitle: draft.name,
      });
    } else if (favSearchId) {
      this.setState({
        selectedTitle: 'All my Articles',
      });
    } else if (trashed) {
      this.setState({
        selectedTitle: 'Deleted Content',
      });
    }
  }

  onDraftChange(actionType) {
    const { updateFilter } = this.props;

    if (actionType === 'GET_DRAFT_RESPONSE') {
      SearchStore.setDraftId(this.lastDraftId);
      updateFilter();
      this.lastDraftId = null;
    }

    this.setState({
      draftLoading: false,
      expandedDropDown: true,
    });
  }

  handleOnClick() {
    let reviewLoading = false;
    let draftLoading = false;
    const state = {
      expandedDropDown: !this.state.expandedDropDown,
    };

    if (!DraftStore.isInit()) {
      draftLoading = true;
      DraftActionCreators.getDrafts();
      state.expandedDropDown = false;
    }

    if (
      !ReviewStore.isInit() ||
      (!ReviewStore.isInit() && ReviewStore.reviews.length === 0)
    ) {
      reviewLoading = true;
      const model = { ...SearchStore.searchModel };
      model.limit = 5;
      model.dateFrom = null;
      model.dateTo = null;
      ReviewActionCreators.getReviews(model);
      state.expandedDropDown = false;
    }

    this.setState({
      draftLoading,
      reviewLoading,
      expandedDropDown: state.expandedDropDown,
    });
  }

  handleItemClick(type, id) {
    return () => {
      const { updateFilter } = this.props;

      switch (type) {
        case 'draft':
          SearchStore.clearAllFacets();
          SearchStore.defaultSearchModel();
          SearchStore.setSelectedFavouriteSearch(null);
          SearchStore.setDraftId(id);
          const draft = DraftStore.getDraftById(id);
          DraftActionCreators.getDraft({
            draftId: draft.id,
          });
          this.lastDraftId = draft.id;
          this.setState({
            selectedTitle: draft.name,
            expandedDropDown: false,
          });
          break;
        case 'review':
          const review = ReviewStore.getReviewByHash(id);
          SearchStore.clearAllFacets();
          SearchStore.defaultSearchModel();
          SearchStore.setHash(id);
          SearchStore.setSelectedFavouriteSearch(null);
          updateFilter();
          this.setState({
            selectedTitle: review.title,
            expandedDropDown: false,
          });
          break;
        case 'allArticle':
          SearchStore.clearAllFacets();
          SearchStore.defaultSearchModel();
          SearchStore.setSelectedFavouriteSearch(null);
          updateFilter();
          this.setState({
            selectedTitle: window.Messages['SearchBar.contentList.allArticles'],
            expandedDropDown: false,
          });
          break;
        case 'deletedContent':
          SearchStore.clearAllFacets();
          SearchStore.defaultSearchModel();
          SearchStore.setTrashed(true);
          updateFilter();
          this.setState({
            selectedTitle: 'Deleted content',
            expandedDropDown: false,
          });
          break;

        default:
          break;
      }
    };
  }

  handleOpenCreateDraft() {
    this.createDraft.getWrappedInstance().handleOpenModal();
  }

  handleShowAllReviews() {
    if (!this.props.advancedFilterRef) return;

    this.props.advancedFilterRef.getWrappedInstance().openReviewModal();
  }

  renderDropDownTitle() {
    const { reviewLoading, draftLoading, selectedTitle } = this.state;
    const isLoading = reviewLoading || draftLoading;

    return (
      <Fragment>
        <span>
          {selectedTitle}
          {isLoading && <Loader className="content-list_loader" />}
        </span>
      </Fragment>
    );
  }

  renderDraftsList() {
    const draftList = DraftStore.drafts;

    return (
      <div>
        <div className="list-header">
          {window.Messages['DraftListSearch.title']}
        </div>
        <ul className="content-list_list">
          {(draftList &&
            draftList.map(draft => (
              <div
                onClick={this.handleItemClick('draft', draft.id)}
                onKeyUp={this.handleItemClick('draft', draft.id)}
                className="content-list_list__item text-truncate"
                key={draft.id}
                role="button"
                tabIndex={0}
              >
                <div className="content-list_list__item-name text-truncate">
                  {draft.name}
                </div>
                <div className="content-list_list__item-date">
                  <FormattedDate
                    day="2-digit"
                    month="2-digit"
                    year="numeric"
                    value={new Date(draft.createdDate)}
                  />
                </div>
              </div>
            ))) ||
            null}
        </ul>
        <div className="content-list_actions">
          <Button onClick={this.handleOpenCreateDraft} type="primary">
            <FormattedMessage id="DraftListSearch.createDraftButton" />
          </Button>
          <CreateDraft
            ref={ref => {
              this.createDraft = ref;
            }}
          />
        </div>
        <div className="separator" />
      </div>
    );
  }

  renderReviewsList() {
    const reviewList = ReviewStore.reviews.slice(0, 5);

    return (
      <div>
        <div className="list-header">
          {window.Messages['Review.modalReviewListTitle']}
        </div>
        <ul className="content-list_list">
          {(reviewList &&
            reviewList.map(review => (
              <div
                onClick={this.handleItemClick('review', review.hash)}
                onKeyUp={this.handleItemClick('review', review.hash)}
                className="content-list_list__item text-truncate"
                key={review.hash}
                role="button"
                tabIndex={0}
              >
                <div className="content-list_list__item-name text-truncate">
                  {review.title}
                </div>
                <div className="content-list_list__item-date">
                  <FormattedDate
                    day="2-digit"
                    month="2-digit"
                    year="numeric"
                    value={new Date(review.creationDate)}
                  />
                </div>
              </div>
            ))) ||
            null}
          <Button
            className="pull--right all-reviews"
            type="primary"
            onClick={this.handleShowAllReviews}
          >
            <FormattedMessage id="SearchBar.contentList.allReviews" />
          </Button>
        </ul>
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
        className="c-content-list"
      >
        <div
          className="list-item selected"
          onClick={this.handleItemClick('allArticle')}
          onKeyUp={this.handleItemClick('allArticle')}
          role="button"
          tabIndex={0}
        >
          <FormattedMessage id="SearchBar.contentList.allArticles" />
        </div>
        {this.renderDraftsList()}
        {this.renderReviewsList()}
        <div className="separator" />
        <div
          className="list-item"
          onClick={this.handleItemClick('deletedContent')}
          onKeyUp={this.handleItemClick('deletedContent')}
          role="button"
          tabIndex={0}
        >
          <FormattedMessage id="SearchBar.contentList.deletedContent" />
        </div>
      </DropDownSelect>
    );
  }
}

export default ContentList;
