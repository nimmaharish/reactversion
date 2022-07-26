import { useEffect, useState } from 'react';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';

export function usePlans() {
  const [plans, setPlans] = useState({ plans: [] });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const plansList = await Becca.listPlans();
      plansList.plans = plansList.plans.map(plan => ({
        ...plan,
        price: plan.price.reverse(),
      }));
      setPlans(plansList);
    } catch (e) {
      console.error(e);
      Snackbar.show('error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return [plans, loading, refresh];
}
