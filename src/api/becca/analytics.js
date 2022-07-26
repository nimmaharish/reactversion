import { connector } from 'api/becca/axios';

export async function getSummary(filters) {
  const {
    data
  } = await connector.get('seller/common/summary', {
    params: {
      filters,
    }
  });
  return data;
}

export async function getCohort(filters) {
  const {
    data
  } = await connector.get('seller/common/cohort', {
    params: {
      filters,
    }
  });
  return data;
}
