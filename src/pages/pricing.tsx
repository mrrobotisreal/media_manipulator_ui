import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import mixpanel from 'mixpanel-browser';

interface PricingTier {
  id: 'free' | 'starter' | 'pro' | 'business';
  name: string;
  price: number;
  interval: 'month';
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: string[];
  limits: {
    conversions: number | string;
    maxFileSize: string;
    priority: boolean;
    api: boolean;
    support: string;
  };
  stripePriceId?: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'Perfect for occasional use',
    icon: <Zap className="w-5 h-5" />,
    features: [
      '5 conversions per month',
      'Files up to 50MB',
      'All popular formats',
      'Basic quality settings',
      'Community support'
    ],
    limits: {
      conversions: 5,
      maxFileSize: '50MB',
      priority: false,
      api: false,
      support: 'Community'
    }
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    interval: 'month',
    description: 'Great for regular content creators',
    icon: <Star className="w-5 h-5" />,
    popular: true,
    features: [
      '100 conversions per month',
      'Files up to 500MB',
      'No watermarks',
      'Advanced quality controls',
      'Batch processing',
      'Email support'
    ],
    limits: {
      conversions: 100,
      maxFileSize: '500MB',
      priority: false,
      api: false,
      support: 'Email'
    },
    stripePriceId: 'price_starter_monthly'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    interval: 'month',
    description: 'Unlimited power for professionals',
    icon: <Crown className="w-5 h-5" />,
    features: [
      'Unlimited conversions',
      'Files up to 2GB',
      'Priority processing',
      'Custom presets',
      'Advanced batch tools',
      'API access (1000 calls/month)',
      'Priority support'
    ],
    limits: {
      conversions: 'Unlimited',
      maxFileSize: '2GB',
      priority: true,
      api: true,
      support: 'Priority'
    },
    stripePriceId: 'price_pro_monthly'
  },
  {
    id: 'business',
    name: 'Business',
    price: 0,
    interval: 'month',
    description: 'Custom solutions for teams',
    icon: <Building className="w-5 h-5" />,
    features: [
      'Everything in Pro',
      'Files up to 5GB',
      'Team management',
      'White-label options',
      'Custom integrations',
      'Dedicated support',
      'Custom contracts'
    ],
    limits: {
      conversions: 'Unlimited',
      maxFileSize: '5GB',
      priority: true,
      api: true,
      support: 'Dedicated'
    }
  }
];

const PricingPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    mixpanel.track('Pricing Page Viewed', {
      user_tier: userProfile?.tier || 'anonymous',
      user_id: user?.uid || null
    });
  }, [user, userProfile]);

  const handleSubscribe = async (tier: PricingTier) => {
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to upgrade your account."
      });
      return;
    }

    if (tier.id === 'free') {
      toast.error("You're already on the free plan", {
        description: "Choose a paid plan to upgrade."
      });
      return;
    }

    if (tier.id === 'business') {
      // Business tier - contact us
      mixpanel.track('Contact Sales Clicked', {
        user_tier: userProfile?.tier || 'free',
        target_tier: 'business'
      });

      window.open('mailto:mitchellwintrow@gmail.com?subject=Business Plan Inquiry&body=Hi, I\'m interested in the Business plan for Media Manipulator. Please contact me with more details.', '_blank');
      return;
    }

    setIsLoading(tier.id);

    try {
      // Track subscription attempt
      mixpanel.track('Subscription Attempt', {
        target_tier: tier.id,
        current_tier: userProfile?.tier || 'free',
        price: tier.price,
        user_id: user.uid
      });

      // In a real implementation, you'd integrate with Stripe here
      // For now, we'll show a success message
      toast.success("Redirecting to checkout...", {
        description: `Starting ${tier.name} plan subscription.`
      });

      // Simulate Stripe checkout redirect
      setTimeout(() => {
        setIsLoading(null);
        toast.success("Subscription successful!", {
          description: `Welcome to the ${tier.name} plan!`
        });

        mixpanel.track('Subscription Success', {
          tier: tier.id,
          price: tier.price,
          user_id: user.uid
        });
      }, 2000);

    } catch (error) {
      console.error('Subscription error:', error);
      setIsLoading(null);

      mixpanel.track('Subscription Failed', {
        tier: tier.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      toast.error("Subscription failed", {
        description: "Please try again or contact support."
      });
    }
  };

  const getButtonText = (tier: PricingTier) => {
    if (!user) return 'Sign Up';
    if (tier.id === 'free') return 'Current Plan';
    if (tier.id === 'business') return 'Contact Sales';
    if (userProfile?.tier === tier.id) return 'Current Plan';
    return `Upgrade to ${tier.name}`;
  };

  const getButtonVariant = (tier: PricingTier) => {
    if (userProfile?.tier === tier.id) return 'secondary';
    if (tier.popular) return 'default';
    return 'outline';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert more files with powerful features. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current Usage (if signed in) */}
      {userProfile && (
        <Card className="max-w-md mx-auto mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950/20 sci-fi-frame">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Current Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Plan:</span>
                <Badge variant="secondary" className="capitalize">
                  {userProfile.tier}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Conversions this month:</span>
                <span className="font-medium">
                  {userProfile.monthlyUsage.conversions} / {
                    userProfile.tier === 'pro' ? '∞' :
                    userProfile.tier === 'starter' ? '100' : '5'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total conversions:</span>
                <span className="font-medium">{userProfile.totalUsage.conversions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative sci-fi-frame ${
              tier.popular
                ? 'border-blue-500 shadow-lg scale-105 lg:scale-110'
                : 'border-border'
            }`}
          >
            {tier.popular && (
              <Badge
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600"
              >
                Most Popular
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {tier.icon}
                <CardTitle className="text-xl">{tier.name}</CardTitle>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold">
                  {tier.price === 0 ? 'Free' : `$${tier.price}`}
                </span>
                {tier.price > 0 && tier.id !== 'business' && (
                  <span className="text-muted-foreground">/month</span>
                )}
                {tier.id === 'business' && (
                  <span className="text-muted-foreground text-sm block">Custom pricing</span>
                )}
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(tier)}
                variant={getButtonVariant(tier)}
                className="w-full"
                disabled={
                  isLoading === tier.id ||
                  (userProfile?.tier === tier.id && tier.id !== 'business')
                }
              >
                {isLoading === tier.id ? (
                  'Processing...'
                ) : (
                  <>
                    {getButtonText(tier)}
                    {tier.id === 'business' && <ArrowRight className="w-4 h-4 ml-2" />}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <Card className="sci-fi-frame">
            <CardHeader>
              <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate your billing accordingly.
              </p>
            </CardContent>
          </Card>

          <Card className="sci-fi-frame">
            <CardHeader>
              <CardTitle className="text-lg">What file formats do you support?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We support all popular image, video, and audio formats including JPG, PNG, MP4, MOV,
                MP3, WAV, and many more. Our converter handles over 100+ formats.
              </p>
            </CardContent>
          </Card>

          <Card className="sci-fi-frame">
            <CardHeader>
              <CardTitle className="text-lg">Is my data secure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Absolutely. All uploads use HTTPS encryption, files are processed on secure servers,
                and everything is automatically deleted within 1 hour. We never store or analyze your content.
              </p>
            </CardContent>
          </Card>

          <Card className="sci-fi-frame">
            <CardHeader>
              <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied,
                contact us within 30 days for a full refund.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
