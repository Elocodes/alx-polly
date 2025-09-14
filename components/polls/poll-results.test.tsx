
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PollResults } from './poll-results';

// Mock data for testing
const mockOptions = [
  { id: '1', text: 'Option A', votes: 10 },
  { id: '2', text: 'Option B', votes: 5 },
  { id: '3', text: 'Option C', votes: 15 },
];

const mockTotalVotes = 30;

describe('PollResults Component', () => {
  // Unit Test: Happy Path - Renders results correctly with votes
  test('should render poll results correctly with given options and total votes', () => {
    render(<PollResults options={mockOptions} totalVotes={mockTotalVotes} />);

    // Check if the title "Results:" is displayed
    expect(screen.getByText('Results:')).toBeInTheDocument();

    // Check if each option is rendered with its text, vote count, and percentage
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('10 votes (33.3%)')).toBeInTheDocument();

    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('5 votes (16.7%)')).toBeInTheDocument();

    expect(screen.getByText('Option C')).toBeInTheDocument();
    expect(screen.getByText('15 votes (50.0%)')).toBeInTheDocument();

    // Check if the total votes are displayed correctly
    expect(screen.getByText(`Total votes: ${mockTotalVotes}`)).toBeInTheDocument();
  });

  // Unit Test: Edge Case - Renders correctly when there are no votes
  test('should display 0.0% for all options when total votes are zero', () => {
    const zeroVoteOptions = mockOptions.map(opt => ({ ...opt, votes: 0 }));
    render(<PollResults options={zeroVoteOptions} totalVotes={0} />);

    // Check that percentages are all "0.0%"
    const voteElements = screen.getAllByText('0 votes (0.0%)');
    expect(voteElements).toHaveLength(zeroVoteOptions.length);

    // Check if the total votes are displayed as 0
    expect(screen.getByText('Total votes: 0')).toBeInTheDocument();
  });

  // Integration Test: Component updates correctly when props change
  test('should re-render and update results when props change', () => {
    // Initial render
    const { rerender } = render(<PollResults options={mockOptions} totalVotes={mockTotalVotes} />);

    // Verify initial state
    expect(screen.getByText('10 votes (33.3%)')).toBeInTheDocument();
    expect(screen.getByText(`Total votes: ${mockTotalVotes}`)).toBeInTheDocument();

    // New props to simulate an update (e.g., after a new vote is cast)
    const updatedOptions = [
      { id: '1', text: 'Option A', votes: 11 },
      { id: '2', text: 'Option B', votes: 5 },
      { id: '3', text: 'Option C', votes: 15 },
    ];
    const updatedTotalVotes = 31;

    // Re-render the component with new props
    rerender(<PollResults options={updatedOptions} totalVotes={updatedTotalVotes} />);

    // Verify the component has updated
    expect(screen.getByText('11 votes (35.5%)')).toBeInTheDocument(); // 11/31 = 35.48...
    expect(screen.getByText(`Total votes: ${updatedTotalVotes}`)).toBeInTheDocument();
  });
});
