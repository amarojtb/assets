/**
 * Unit tests for Expanded component.
 */
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Highlight from 'react-highlighter';
import { FormattedMessage } from 'react-intl';
import sinon from 'sinon';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';
import parameters from 'constants/parameters';
import Svg from 'components/Svg';
import { intl } from 'services/enzyme-test-helper';
import Expanded from './Expanded';
import ExpandedSidebarItem from './ExpandedSidebarItem';

const { COLORS } = parameters;

describe('<Expanded />', () => {
  const checkboxes = [
    {
      active: true,
      backgroundColor: COLORS.positive,
      key: 'positive',
      label: 'Positive',
      value: 200,
    },
    {
      active: true,
      backgroundColor: COLORS.neutral,
      key: 'neutral',
      label: 'Neutral',
      value: 300,
    },
    {
      active: true,
      backgroundColor: COLORS.negative,
      key: 'negative',
      label: 'Negative',
      value: 100,
    },
  ];
  const id = 'widget-id';
  const name = 'Widget Name';
  const partialViewName = 'DotGridChart';
  const widget = {
    data: null,
    id,
    name,
    partialViewName,
  };
  let shallowExpanded;

  beforeEach(() => {
    shallowExpanded = shallow(
      <Expanded.WrappedComponent
        checkboxes={checkboxes}
        intl={intl}
        name={name}
        widget={widget}
      />
    );
  });

  afterEach(() => {
    shallowExpanded.unmount();
  });

  it('should render correctly', () => {
    expect(shallowExpanded.type()).to.equal('div');
  });

  it('should have correct className value', () => {
    expect(shallowExpanded.hasClass('c-expanded')).to.be.true;
  });

  it('should render a close button', () => {
    const spy = sinon.spy(Expanded.WrappedComponent, 'handleCloseModal');

    shallowExpanded.instance().forceUpdate();
    shallowExpanded.update();
    shallowExpanded.find('.c-expanded__close').simulate('click');
    expect(spy.calledOnce).to.be.true;
  });

  it('should have a message indicating that there is no data', () => {
    expect(shallowExpanded.find('.c-expanded__no-data')).to.have.lengthOf(1);
    expect(
      shallowExpanded
        .find(FormattedMessage)
        .findWhere(messageItem => messageItem.prop('id') === 'Global.noData')
    ).to.have.lengthOf(1);
  });

  it('should render children', () => {
    shallowExpanded.setProps({ children: <div className="children" /> });
    expect(shallowExpanded.find('.children')).to.have.lengthOf(1);
  });

  describe('expanded -> sidebar', () => {
    const getSidebar = () => shallowExpanded.find('.c-expanded-sidebar');

    it('should render the sidebar (the "hasSidebar" prop is true by default)', () => {
      expect(getSidebar()).to.have.lengthOf(1);
    });

    it('should not render the sidebar if the "hasSidebar" prop is false', () => {
      shallowExpanded.setProps({ hasSidebar: false });
      expect(getSidebar()).to.have.lengthOf(0);
    });

    it('should sidebar toggle button works', () => {
      const getSidebarToggleContentElement = () =>
        shallowExpanded.find('.c-expanded-sidebar__toggle-content');
      const getToggleButtonMessageElement = () =>
        getSidebarToggleContentElement().find(FormattedMessage);
      const getToggleIconElements = () =>
        getSidebarToggleContentElement().find(Svg);

      expect(shallowExpanded.state('isSidebarOpen')).to.be.false;
      expect(getSidebar().hasClass('is-open')).to.be.false;
      expect(getToggleButtonMessageElement().prop('id')).to.equal(
        'Expanded.toggleSidebarButtonOpen'
      );
      getToggleIconElements().forEach(icon => {
        expect(icon.prop('icon')).to.equal('chevron-down');
      });
      shallowExpanded.find('.c-expanded-sidebar__toggle').simulate('click');
      expect(shallowExpanded.state('isSidebarOpen')).to.be.true;
      expect(getSidebar().hasClass('is-open')).to.be.true;
      expect(getToggleButtonMessageElement().prop('id')).to.equal(
        'Expanded.toggleSidebarButtonClose'
      );
      getToggleIconElements().forEach(icon => {
        expect(icon.prop('icon')).to.equal('chevron-up');
      });
    });

    it('should render the title of the widget in the header of the sidebar', () => {
      const sidebarTitleElement = getSidebar().find(
        '.c-expanded-sidebar__title'
      );

      expect(sidebarTitleElement).to.have.lengthOf(1);
      expect(sidebarTitleElement.find(FormattedMessage).prop('id')).to.equal(
        'Expanded.sidebarTitle'
      );
    });

    it('should render a custom header in the sidebar', () => {
      shallowExpanded.setProps({
        sidebarHeader: <div className="sidebar-header-custom" />,
      });

      const wrapperHeader = getSidebar().find('.c-expanded-sidebar__header');

      expect(wrapperHeader.find('.c-expanded-sidebar__title')).to.have.lengthOf(
        0
      );
      expect(wrapperHeader.find('.sidebar-header-custom')).to.have.lengthOf(1);
    });

    it('should render the body of the sidebar', () => {
      expect(getSidebar().find('.chart-toggle')).to.have.lengthOf(1);
    });

    it('should render Filter', () => {
      expect(getSidebar().find(Input)).to.have.lengthOf(1);
    });

    it('should update the "filterText" state when the value of the Filter has changed', () => {
      const newFilterTextValue = 'Filter Text';

      expect(shallowExpanded.state('filterText')).to.equal('');
      getSidebar()
        .find(Input)
        .shallow()
        .find('input')
        .simulate('change', { target: { value: newFilterTextValue } });
      expect(shallowExpanded.state('filterText')).to.equal(newFilterTextValue);
    });

    it('should render the "check/uncheck all" button', () => {
      expect(
        getSidebar()
          .find('.chart-toggle__check-all')
          .type()
      ).to.equal(Button);
    });

    it('should the "check/uncheck all" button works', () => {
      const spy = sinon.spy();

      shallowExpanded.setProps({ onToggleChart: spy });
      getSidebar()
        .find('.chart-toggle__check-all')
        .simulate('click');
      expect(spy.withArgs(false).calledOnce).to.be.true;
      spy.resetHistory();
      shallowExpanded.setProps({
        checkboxes: checkboxes.map(
          item => (item.key === 'neutral' ? { ...item, active: false } : item)
        ),
      });
      getSidebar()
        .find('.chart-toggle__check-all')
        .simulate('click');
      expect(spy.withArgs(true).calledOnce).to.be.true;
    });

    it('should render ExpandedSidebarItem', () => {
      expect(getSidebar().find(ExpandedSidebarItem)).to.have.lengthOf(
        checkboxes.length
      );
    });

    it('should toggle ExpandedSidebarItem', () => {
      const spy = sinon.spy();

      shallowExpanded.setProps({ onToggleChart: spy });
      getSidebar()
        .find(ExpandedSidebarItem)
        .at(0)
        .shallow()
        .find(Checkbox)
        .simulate('change');
      expect(spy.withArgs(!checkboxes[0].active, checkboxes[0].key).calledOnce)
        .to.be.true;
    });

    it('should not render the "cumulate" checkbox by default', () => {
      expect(getSidebar().find('.c-expanded__cumulate')).to.have.lengthOf(0);
    });

    it('should render the "cumulate" checkbox if the "onCumulate" prop is configured', () => {
      shallowExpanded.setProps({ onCumulate: () => {} });
      expect(getSidebar().find('.c-expanded__cumulate')).to.have.lengthOf(1);
    });

    it('should "cumulate" checkbox works', () => {
      const spy = sinon.spy();

      shallowExpanded.setProps({ onCumulate: spy });
      expect(shallowExpanded.state('cumulate')).to.be.false;
      getSidebar()
        .find('.c-expanded__cumulate')
        .find('Checkbox')
        .simulate('change');
      expect(shallowExpanded.state('cumulate')).to.be.true;
      expect(spy.withArgs(true).calledOnce).to.be.true;
    });

    it('should render a custom body in the sidebar', () => {
      shallowExpanded.setProps({
        sidebarBody: <div className="sidebar-body-custom" />,
      });

      const wrapperBody = getSidebar().find('.c-expanded-sidebar__body');

      expect(wrapperBody.find('.chart-toggle')).to.have.lengthOf(0);
      expect(wrapperBody.find('.sidebar-body-custom')).to.have.lengthOf(1);
    });
  });

  describe('header', () => {
    const getHeader = () => shallowExpanded.find('.c-expanded-main__header');

    it('should render the header (the "hasMainHeader" prop is true by default)', () => {
      expect(getHeader()).to.have.lengthOf(1);
    });

    it('should not render the header if the "hasMainHeader" prop is false', () => {
      shallowExpanded.setProps({ hasMainHeader: false });
      expect(getHeader()).to.have.lengthOf(0);
    });

    it('should render the header', () => {
      expect(getHeader().find('.c-expanded__title')).to.have.lengthOf(1);
    });

    it('should render the icon in the header', () => {
      expect(getHeader().find(Svg)).to.have.lengthOf(0);

      const iconName = 'image';

      shallowExpanded.setProps({ icon: iconName });
      expect(getHeader().find(Svg)).to.have.lengthOf(1);
      expect(
        getHeader()
          .find(Svg)
          .prop('icon')
      ).to.equal(iconName);
    });

    it('should render the name of the widget in the header', () => {
      expect(
        getHeader()
          .find('span')
          .text()
      ).to.equal(name);
    });
  });

  describe('Expanded -> footer', () => {
    const getFooter = () => shallowExpanded.find('.c-expanded-footer');

    it('should render footer', () => {
      expect(getFooter()).to.have.lengthOf(1);
    });

    it('should render export buttons', () => {
      const expectedIcons = ['pdf', 'image', 'excel'];
      const expectedMessages = ['Global.pdf', 'Global.image', 'Global.excel'];
      const exportButtonElements = getFooter().find(
        '.c-expanded-export-format'
      );

      expect(exportButtonElements).to.have.lengthOf(3);
      exportButtonElements.forEach((buttonItem, index) => {
        expect(buttonItem.find(Svg).prop('icon')).to.equal(
          expectedIcons[index]
        );
        expect(buttonItem.find(FormattedMessage).prop('id')).to.equal(
          expectedMessages[index]
        );
      });
    });

    it('should be able to export as PDF', () => {
      const spy = sinon.spy(window.km.Analytics.Event, 'widgetExportPDF');
      const buttonElement = getFooter()
        .find('.c-expanded-export-format')
        .at(0);

      buttonElement.simulate('click');
      expect(spy.withArgs(id, name, partialViewName).calledOnce).to.be.true;
      spy.restore();
    });

    it('should be able to export as image', () => {
      const spy = sinon.spy(window.km.Analytics.Event, 'widgetExportPNG');
      const buttonElement = getFooter()
        .find('.c-expanded-export-format')
        .at(1);

      buttonElement.simulate('click');
      expect(spy.withArgs(id, name, partialViewName).calledOnce).to.be.true;
      spy.restore();
    });

    it('should be able to export as Excel', () => {
      const spy = sinon.spy(window.km.Analytics.Event, 'widgetExportExcel');
      const buttonElement = getFooter()
        .find('.c-expanded-export-format')
        .at(2);

      buttonElement.simulate('click');
      expect(spy.withArgs(id, name, partialViewName).calledOnce).to.be.true;
      spy.restore();
    });
  });
});

describe('<ExpandedSidebarItem />', () => {
  const filterText = 'Filter Text';
  const item = {
    active: false,
    backgroundColor: '#f00',
    key: 'web',
    label: 'Web',
  };
  let shallowExpandedSidebarItem;

  beforeEach(() => {
    shallowExpandedSidebarItem = shallow(
      <ExpandedSidebarItem
        filterText={filterText}
        item={item}
        onChange={() => {}}
      />
    );
  });

  afterEach(() => {
    shallowExpandedSidebarItem.unmount();
  });

  it('should render correctly', () => {
    expect(shallowExpandedSidebarItem.type()).to.equal('li');
  });

  it('should have correct className value', () => {
    expect(shallowExpandedSidebarItem.hasClass('chart-toggle__item')).to.be
      .true;
  });

  it('should have a Checkbox', () => {
    expect(shallowExpandedSidebarItem.find(Checkbox)).to.have.lengthOf(1);
  });

  it('should Checkbox is checked in relation to the "active" item property value', () => {
    const getCheckbox = () => shallowExpandedSidebarItem.find(Checkbox);

    expect(getCheckbox().prop('checked')).to.be.false;
    shallowExpandedSidebarItem.setProps({ item: { ...item, active: true } });
    expect(getCheckbox().prop('checked')).to.be.true;
  });

  it('should have a Checkbox', () => {
    const spy = sinon.spy();

    shallowExpandedSidebarItem.setProps({ onChange: spy });
    shallowExpandedSidebarItem.find(Checkbox).simulate('change');
    expect(spy.withArgs(item).calledOnce).to.be.true;
  });

  it('should render the label and highlight it with the text content of the "filterText" prop', () => {
    const highlightElement = shallowExpandedSidebarItem.find(Highlight);

    expect(highlightElement).to.have.lengthOf(1);
    expect(highlightElement.prop('matchClass')).to.equal('text-search');
    expect(highlightElement.prop('matchElement')).to.equal('mark');
    expect(highlightElement.prop('search')).to.equal(filterText);
    expect(highlightElement.children().text()).to.equal(item.label);
  });

  it('should render the bullet', () => {
    const bullet = shallowExpandedSidebarItem.find('.chart-toggle__color');

    expect(bullet).to.have.lengthOf(1);
    expect(bullet.prop('style')).to.have.property(
      'backgroundColor',
      item.backgroundColor
    );
  });
});
