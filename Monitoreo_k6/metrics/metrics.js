import { Trend, Gauge } from 'k6/metrics';

export const stepDuration = new Trend('pcfactory_step_duration_seconds', true);
export const journeyDuration = new Trend('pcfactory_journey_duration_seconds', true);
export const stepSuccess = new Gauge('pcfactory_step_success');
export const journeySuccess = new Gauge('pcfactory_journey_success');
export const searchResultsCount = new Gauge('pcfactory_search_results');