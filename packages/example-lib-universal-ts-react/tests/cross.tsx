import React from 'react';
import renderer from 'react-test-renderer';
import { Cross } from '../src/cross';

test('Render <Cross />', () => {
  const component = renderer.create(<Cross />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
