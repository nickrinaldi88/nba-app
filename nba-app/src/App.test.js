import { render, screen } from '@testing-library/react';
import GamesList from './components/GamesList/GamesList';

// React Router v7's package exports are not understood by Create React App's
// Jest resolver. This focused component test keeps the launch safety behavior
// covered while the app is still on CRA.
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
  };
}, { virtual: true });

test('shows an honest empty-schedule state', () => {
  render(<GamesList games={[]} />);

  expect(screen.getByRole('heading', { name: /no nba games today/i })).toBeInTheDocument();
  expect(screen.getByText(/check back tomorrow/i)).toBeInTheDocument();
});
