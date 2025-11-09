import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Check, CreditCard, Zap, Building } from 'lucide-react';
import { billingAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function BillingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchStatus();
    }
  }, [user]);

  const fetchStatus = async () => {
    try {
      const res = await billingAPI.getStatus(user.id);
      setStatus(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubscribe = async (planType, amount, description) => {
    try {
      setLoading(true);
      const res = await billingAPI.createSession(planType, amount, description);
      // Redirect to Stripe Checkout
      window.location.href = res.data.checkoutUrl;
    } catch (e) {
      console.error(e);
      toast.error('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['5 resumes', '20 AI calls/month', 'Basic templates', 'PDF export'],
      current: status?.subscriptionTier === 'free',
    },
    {
      name: 'Pro',
      price: 29.99,
      features: ['Unlimited resumes', '100 AI calls/month', 'All templates', 'All exports', 'Priority support'],
      current: status?.subscriptionTier === 'pro',
    },
    {
      name: 'Enterprise',
      price: 99.99,
      features: ['Unlimited everything', '500 AI calls/month', 'Custom domain', 'Team accounts', 'Analytics'],
      current: status?.subscriptionTier === 'enterprise',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Upgrade to unlock premium features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card ${plan.current ? 'border-2 border-primary-500' : ''} relative`}
            >
              {plan.current && (
                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Current
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  ${plan.price}
                  {plan.price > 0 && <span className="text-lg text-gray-600">/month</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {!plan.current && plan.price > 0 && (
                <button
                  onClick={() => handleSubscribe(plan.name.toLowerCase(), plan.price, `${plan.name} Plan`)}
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 mr-2 inline" />
                  Subscribe
                </button>
              )}
              {plan.current && (
                <div className="text-center text-sm text-gray-500">Current Plan</div>
              )}
            </div>
          ))}
        </div>

        {status && (
          <div className="mt-12 card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Subscription Tier</p>
                <p className="text-lg font-semibold text-gray-900">{status.subscriptionTier || 'free'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Credits Remaining</p>
                <p className="text-lg font-semibold text-gray-900">{status.aiCredits || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

