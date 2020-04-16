import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import 'services/enzyme-test-helper';
import Button from './Button';

const createShallowButton = () => {
  const props = {
    type: 'default',
    title: 'text',
  };

  return shallow(<Button {...props} />);
};

describe('<Button>', () => {
  it('contains the class name alert', () => {
    const wrapper = createShallowButton();

    expect(wrapper.hasClass('btn')).to.equal(true);
  });

  it('renders the button text', () => {
    const wrapper = createShallowButton();

    expect(wrapper.find('span').text()).to.equal('text');
  });

  it('contains the class name default', () => {
    const wrapper = createShallowButton();

    expect(wrapper.hasClass('btn--default')).to.equal(true);
  });
});
