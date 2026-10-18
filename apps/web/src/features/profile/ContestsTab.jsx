import React from 'react';
import ContestRatingChart from './ContestRatingChart';

/**
 * ContestsTab Component
 * Tab wrapper for contest rating history chart and participation records.
 */
export default function ContestsTab({ contestsData, isLoading = false }) {
  return <ContestRatingChart contestsData={contestsData} isLoading={isLoading} />;
}
