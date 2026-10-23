'use client';

import * as React from 'react';

import { BillingPanel } from '@/components/account/billing-panel';

/**
 * Billing slot. MM19's panel owns all billing logic (status, checkout, portal); this tab only
 * gives it a place to live. The panel already renders the tier and the upgrade/manage actions
 * for every state, so no placeholder is needed now that MM19 is on main.
 */
export const BillingTab: React.FC = () => <BillingPanel />;

export default BillingTab;
