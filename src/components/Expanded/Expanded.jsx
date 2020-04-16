import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Form from 'components/Form';
import Input from 'components/Input';
import Scroll from 'components/Scroll';
import Svg from 'components/Svg';
import { widgetPropTypes } from 'components/Widget';
import ExpandedSidebarItem from './ExpandedSidebarItem';
import './Expanded.css';

const propTypes = {
  checkboxes: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      backgroundColor: PropTypes.string,
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  children: PropTypes.node,
  hasMainHeader: PropTypes.bool,
  hasSidebar: PropTypes.bool,
  icon: PropTypes.string,
  intl: intlShape.isRequired,
  mainHeader: PropTypes.node,
  name: PropTypes.string.isRequired,
  onCumulate: PropTypes.func,
  onCumulateAll: PropTypes.func,
  onToggleChart: PropTypes.func,
  sidebarBody: PropTypes.node,
  sidebarHeader: PropTypes.node,
  showCumulateAll: PropTypes.bool,
  widget: widgetPropTypes.isRequired,
};
const defaultProps = {
  checkboxes: null,
  children: null,
  hasMainHeader: true,
  hasSidebar: true,
  icon: null,
  mainHeader: null,
  onCumulate: null,
  onCumulateAll: null,
  onToggleChart: null,
  sidebarBody: null,
  sidebarHeader: null,
  showCumulateAll: false,
};

class Expanded extends Component {
  static handleCloseModal() {
    window.lightbox.close('dashboard-lightbox');
  }

  static renderNoDataMessage() {
    return (
      <div className="c-expanded__no-data">
        <FormattedMessage id="Global.noData" />
      </div>
    );
  }

  static renderSidebarHeader() {
    return (
      <div className="c-expanded-sidebar__title text-truncate">
        <FormattedMessage id="Expanded.sidebarTitle" />
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      cumulate: false,
      cumulateAll: false,
      filterText: '',
      isSidebarOpen: false,
    };

    this.keyCount = 0;

    this.getKey = this.getKey.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleExportExcel = this.handleExportExcel.bind(this);
    this.handleExportImage = this.handleExportImage.bind(this);
    this.handleExportPdf = this.handleExportPdf.bind(this);
    this.handleOpenSidebar = this.handleOpenSidebar.bind(this);
    this.handleToggleValue = this.handleToggleValue.bind(this);
    this.handleToggleCheckAll = this.handleToggleCheckAll.bind(this);
    this.handleToggleCumulateData = this.handleToggleCumulateData.bind(this);
    this.handleToggleCumulateAllData = this.handleToggleCumulateAllData.bind(
      this
    );
    this.refSidebarCallback = this.refSidebarCallback.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  getCumulateState() {
    const { cumulate } = this.state;

    return cumulate;
  }

  getCumulateAllState() {
    const { cumulateAll } = this.state;

    return cumulateAll;
  }

  getKey() {
    this.keyCount += 1;

    return this.keyCount;
  }

  handleChangeFilter(value) {
    this.setState({ filterText: value });
  }

  handleDocumentClick(event) {
    const { isSidebarOpen } = this.state;
    const { target } = event;

    if (
      this.sidebarElement != null &&
      !this.sidebarElement.contains(target) &&
      isSidebarOpen
    ) {
      this.setState({ isSidebarOpen: false });
    }
  }

  handleExportExcel() {
    const { widget: { id, name, partialViewName } } = this.props;

    window.km.Analytics.Event.widgetExportExcel(id, name, partialViewName);
  }

  handleExportImage() {
    const { widget: { id, name, partialViewName } } = this.props;

    window.km.Analytics.Event.widgetExportPNG(id, name, partialViewName);
  }

  handleExportPdf() {
    const { widget: { id, name, partialViewName } } = this.props;

    window.km.Analytics.Event.widgetExportPDF(id, name, partialViewName);
  }

  handleOpenSidebar() {
    this.setState(prevState => ({ isSidebarOpen: !prevState.isSidebarOpen }));
  }

  handleToggleValue({ active, key }) {
    const { onToggleChart } = this.props;

    if (onToggleChart != null) {
      onToggleChart(!active, key);
    }
  }

  handleToggleCheckAll() {
    const { checkboxes, onToggleChart } = this.props;
    const isAllChecked = checkboxes.every(({ active }) => active);

    onToggleChart(!isAllChecked);
  }

  handleToggleCumulateData() {
    const { onCumulate } = this.props;
    const { cumulate } = this.state;
    if (this.state.cumulateAll) {
      this.handleToggleCheckAll();
    }
    this.setState(prevState => ({
      cumulate: !prevState.cumulate,
      cumulateAll: false,
    }));
    onCumulate(!cumulate);
  }

  handleToggleCumulateAllData() {
    const { onCumulateAll } = this.props;
    const { cumulateAll } = this.state;
    this.handleToggleCheckAll();
    this.setState(prevState => ({
      cumulateAll: !prevState.cumulateAll,
      cumulate: false,
    }));
    onCumulateAll(!cumulateAll);
  }

  refSidebarCallback(ref) {
    this.sidebarElement = ref;
  }

  renderFooter() {
    return (
      <footer className="c-expanded-footer t-color-primary-border t-background-left-column-bg t-color-left-column">
        <span className="c-expanded-export-label t-color-primary">
          <FormattedMessage id="Expanded.exportTitle" />
        </span>
        <Button
          className="c-expanded-export-format"
          onClick={this.handleExportPdf}
        >
          <Svg icon="pdf" />
          <div className="m-top--xx-small">
            <FormattedMessage id="Global.pdf" />
          </div>
        </Button>
        <Button
          className="c-expanded-export-format"
          onClick={this.handleExportImage}
        >
          <Svg icon="image" />
          <div className="m-top--xx-small">
            <FormattedMessage id="Global.image" />
          </div>
        </Button>
        <Button
          className="c-expanded-export-format"
          onClick={this.handleExportExcel}
        >
          <Svg icon="excel" />
          <div className="m-top--xx-small">
            <FormattedMessage id="Global.excel" />
          </div>
        </Button>
      </footer>
    );
  }

  renderMainHeader() {
    const { icon, widget: { name } } = this.props;

    return (
      <div className="c-expanded__title text-truncate">
        {icon == null ? null : <Svg className="c-expanded__icon" icon={icon} />}
        <span className="m-left--small align-middle">
          {name == null ? null : name}
        </span>
      </div>
    );
  }

  renderSideBar() {
    const {
      onCumulate,
      onCumulateAll,
      sidebarBody,
      sidebarHeader,
      showCumulateAll,
    } = this.props;
    const { cumulate, cumulateAll, isSidebarOpen } = this.state;
    const sidebarClassNames = classnames('c-expanded-sidebar', {
      'is-open': isSidebarOpen,
    });
    const sidebarBodyClassNames = classnames('c-expanded-sidebar__body', {
      'sidebar-disabled': cumulateAll,
      'sidebar-default-height': !showCumulateAll,
    });

    return (
      <section className={sidebarClassNames} ref={this.refSidebarCallback}>
        <header className="c-expanded-sidebar__header t-color-primary-bg">
          {sidebarHeader == null
            ? Expanded.renderSidebarHeader()
            : sidebarHeader}
        </header>
        {onCumulate || onCumulateAll ? (
          <div
            className={classnames('c-expanded__cumulate', {
              'c-expanded__cumulate-all': showCumulateAll,
            })}
          >
            {onCumulate == null ? null : (
              <Checkbox
                checked={cumulate}
                classNameLabel="text-truncate align-right"
                onChange={this.handleToggleCumulateData}
              >
                <FormattedMessage id="Expanded.cumulateData" />
              </Checkbox>
            )}
            {onCumulateAll == null || !showCumulateAll ? null : (
              <Checkbox
                checked={cumulateAll}
                classNameLabel="text-truncate align-right"
                onChange={this.handleToggleCumulateAllData}
              >
                <FormattedMessage id="Expanded.cumulateAllData" />
              </Checkbox>
            )}
          </div>
        ) : null}
        <div className={sidebarBodyClassNames}>
          <Scroll>
            {sidebarBody == null ? this.renderSidebarBody() : sidebarBody}
          </Scroll>
        </div>
        <Button
          className="c-expanded-sidebar__toggle"
          onClick={this.handleOpenSidebar}
        >
          <div className="c-expanded-sidebar__toggle-content text-nowrap">
            <Svg
              className="m-right--small"
              icon={isSidebarOpen ? 'chevron-up' : 'chevron-down'}
            />
            <FormattedMessage
              id={
                isSidebarOpen
                  ? 'Expanded.toggleSidebarButtonClose'
                  : 'Expanded.toggleSidebarButtonOpen'
              }
            />
            <Svg
              className="m-left--small"
              icon={isSidebarOpen ? 'chevron-up' : 'chevron-down'}
            />
          </div>
        </Button>
      </section>
    );
  }

  renderSidebarBody() {
    const { checkboxes, intl: { formatMessage } } = this.props;
    const { filterText } = this.state;
    const allChecked =
      checkboxes == null ? false : checkboxes.every(({ active }) => active);

    return (
      <div className="chart-toggle">
        {checkboxes == null ? null : (
          <Form className="m-bottom--small">
            <Input
              clearable
              onChange={this.handleChangeFilter}
              placeholder={formatMessage({ id: 'Global.filter' })}
              value={filterText}
            />
          </Form>
        )}
        {checkboxes == null ? null : (
          <div>
            <div className="text-align--right">
              <Button
                className="chart-toggle__check-all"
                onClick={this.handleToggleCheckAll}
                type="link"
              >
                {allChecked ? (
                  <FormattedMessage id="Expanded.uncheckAll" />
                ) : (
                  <FormattedMessage id="Expanded.checkAll" />
                )}
              </Button>
            </div>
            <ul className="chart-toggle__list list-unstyled">
              {checkboxes == null
                ? null
                : checkboxes
                    .filter(
                      ({ label }) =>
                        label &&
                        label.toLowerCase().includes(filterText.toLowerCase())
                    )
                    .map(item => (
                      <ExpandedSidebarItem
                        filterText={filterText}
                        item={item}
                        key={item.key}
                        onChange={this.handleToggleValue}
                      />
                    ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      children,
      hasMainHeader,
      hasSidebar,
      name,
      mainHeader,
    } = this.props;

    return (
      <div className={`c-expanded c-expanded--${name}`}>
        <Button
          className="c-expanded__close"
          onClick={Expanded.handleCloseModal}
        >
          <Svg icon="close" size="x-small" />
        </Button>
        <div className="c-expanded-content">
          {hasSidebar ? this.renderSideBar() : null}
          <section className="c-expanded-main">
            {hasMainHeader ? (
              <header className="c-expanded-main__header">
                {mainHeader == null ? this.renderMainHeader() : mainHeader}
              </header>
            ) : null}
            <div className="c-expanded-main__body">
              {children == null ? Expanded.renderNoDataMessage() : children}
            </div>
          </section>
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}

Expanded.defaultProps = defaultProps;
Expanded.propTypes = propTypes;
export default injectIntl(Expanded, { withRef: true });
