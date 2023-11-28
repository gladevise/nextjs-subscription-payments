import {
  manageSubscriptionStatusChange,
  upsertCustomerRecord,
  upsertPriceRecord,
  upsertProductRecord
} from '@/utils/supabase-admin';
import { stripe } from './stripe';

const syncProducts = async () => {
  const products = await stripe.products.list({ limit: 100 });
  for await (const product of products.data) {
    try {
      await upsertProductRecord(product);
    } catch (err) {
      console.error(err);
    }
  }
  console.log('Products synced.');
};

const syncPrices = async () => {
  const prices = await stripe.prices.list({ limit: 100 });
  for await (const price of prices.data) {
    try {
      await upsertPriceRecord(price);
    } catch (err) {
      console.error(err);
    }
  }
  console.log('Prices synced.');
};

const syncCustomers = async () => {
  const customers = await stripe.customers.list({ limit: 100 });
  for await (const customer of customers.data) {
    try {
      await upsertCustomerRecord(customer);
    } catch (err) {
      console.error(err);
    }
  }
  console.log('Customers synced.');
};

const syncSubscriptions = async () => {
  const subscriptions = await stripe.subscriptions.list({ limit: 100 });
  for await (const subscription of subscriptions.data) {
    try {
      await manageSubscriptionStatusChange(
        subscription.id,
        subscription.customer as string,
        true
      );
    } catch (err) {
      console.error(err);
    }
  }
  console.log('Subscriptions synced.');
};

(async () => {
  await syncProducts();
  await syncPrices();
  await syncCustomers();
  await syncSubscriptions();
  console.log('Sync complete.');
  process.exit(0);
})();
