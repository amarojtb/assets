import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import 'services/enzyme-test-helper';
import Alert from './Alert';

const createShallowAlert = () => {
  const props = {
    type: 'default',
  };

  return shallow(<Alert {...props}>text</Alert>);
};

describe('<Alert>', () => {
  it('contains the class name alert', () => {
    const wrapper = createShallowAlert();

    expect(wrapper.hasClass('alert')).to.equal(true);
  });

  it('renders the alert text', () => {
    const wrapper = createShallowAlert();

    expect(wrapper.find('.alert').text()).to.equal('text');
  });

  it('contains the class type default', () => {
    const wrapper = createShallowAlert();

    expect(wrapper.hasClass('alert--default')).to.equal(true);
  });
});
