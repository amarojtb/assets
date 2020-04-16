import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import 'services/enzyme-test-helper';
import TinyLoader from './TinyLoader';

const createShallowAlert = () => mount(<TinyLoader className="lds-roller" />);

describe('<TinyLoader>', () => {
  it('contains the class name lds-roller', () => {
    const wrapper = createShallowAlert();

    expect(wrapper.hasClass('lds-roller')).to.equal(true);
  });
});
