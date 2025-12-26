'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Zap, Shield, Building2, HelpCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const plans = [
    {
        name: 'Starter',
        description: 'Perfect for testing',
        price: { monthly: 0, yearly: 0 },
        features: [
            '500 Credits / month',
            'Access to GPT-4o-Mini',
            '5 Test Projects',
            'Community Support'
        ],
        buttonText: 'Current Plan',
        buttonVariant: 'secondary' as const,
        icon: Zap,
        highlighted: false
    },
    {
        name: 'Sentinel Pro',
        description: 'Perfect for solo developers',
        price: { monthly: 10, yearly: 100 },
        badge: 'Most Popular',
        features: [
            '15,000 Credits / month',
            'Access to GPT-4o (The Judge)',
            'Unlimited Projects',
            'Priority Queue (No waiting)',
            'Advanced Analytics'
        ],
        buttonText: 'Upgrade to Pro',
        buttonVariant: 'default' as const,
        icon: Shield,
        highlighted: true
    },
    {
        name: 'Enterprise',
        description: 'For large teams',
        price: { monthly: -1, yearly: -1 }, // -1 means custom
        features: [
            'Custom Credit Volume',
            'Dedicated Support',
            'SSO / SAML',
            'Self-Hosted Options',
            'Custom Integrations'
        ],
        buttonText: 'Contact Sales',
        buttonVariant: 'outline' as const,
        icon: Building2,
        highlighted: false
    }
]

const faqs = [
    {
        question: 'How do credits work?',
        answer: 'Credits are consumed when you run tests. Each API call to generate a response uses tokens, and each token costs a small amount of credits. The AI Judge (GPT-4o) uses more credits than basic generation (GPT-4o-Mini).'
    },
    {
        question: 'How many tests can I run for $10?',
        answer: 'For $10, you get 15,000 credits. That\'s approximately 15,000 standard runs with GPT-4o-Mini or ~750 premium GPT-4o judge evaluations.'
    },
    {
        question: 'Can I cancel anytime?',
        answer: 'Yes, absolutely. You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.'
    },
    {
        question: 'What happens if I run out of credits?',
        answer: 'You can purchase additional credit packs anytime, or wait until your monthly credits reset. We\'ll notify you when you\'re running low.'
    },
    {
        question: 'Do unused credits roll over?',
        answer: 'Credits reset at the start of each billing cycle and do not roll over. We recommend upgrading to a higher tier if you consistently need more credits.'
    }
]

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            {/* Hero Section */}
            <div className="pt-20 pb-16 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Simple, transparent pricing.
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                        Start for free, upgrade when you need power.
                    </p>

                    {/* Monthly/Yearly Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-slate-500'}`}>
                            Monthly
                        </span>
                        <Switch
                            checked={isYearly}
                            onCheckedChange={setIsYearly}
                            className="data-[state=checked]:bg-cyan-600"
                        />
                        <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-slate-500'}`}>
                            Yearly
                            <span className="ml-2 text-xs text-emerald-400 font-normal">Save 17%</span>
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative rounded-2xl p-6 flex flex-col ${plan.highlighted
                                ? 'bg-gradient-to-b from-cyan-950/50 to-[#0c0c0e] border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]'
                                : 'bg-[#0c0c0e] border border-white/10'
                                }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <div className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-bold text-white shadow-lg">
                                        {plan.badge}
                                    </div>
                                </div>
                            )}

                            {/* Header */}
                            <div className="mb-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.highlighted ? 'bg-cyan-500/20' : 'bg-white/5'
                                    }`}>
                                    <plan.icon className={`w-5 h-5 ${plan.highlighted ? 'text-cyan-400' : 'text-slate-400'}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {plan.price.monthly === -1 ? (
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-white">Custom</span>
                                    </div>
                                ) : (
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-white">
                                            ${isYearly ? plan.price.yearly : plan.price.monthly}
                                        </span>
                                        <span className="text-slate-400">
                                            /{isYearly ? 'year' : 'mo'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-cyan-400' : 'text-emerald-400'
                                            }`} />
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Button */}
                            <Link href={plan.name === 'Enterprise' ? 'mailto:sales@orvion.io' : '/login'}>
                                <Button
                                    variant={plan.buttonVariant}
                                    className={`w-full h-11 ${plan.highlighted
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                        : plan.buttonVariant === 'secondary'
                                            ? 'bg-white/5 text-slate-400 hover:bg-white/10 border-0'
                                            : 'border-white/20 text-white hover:bg-white/5'
                                        }`}
                                >
                                    {plan.buttonText}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-6 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h2>
                    <p className="text-slate-400">Everything you need to know about credits and billing.</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-[#0c0c0e] border border-white/10 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="w-4 h-4 text-cyan-500" />
                                    <span className="font-medium text-white">{faq.question}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''
                                    }`} />
                            </button>
                            {openFaq === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="px-6 pb-4"
                                >
                                    <p className="text-sm text-slate-400 pl-7">{faq.answer}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-6 border-t border-white/10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Ready to ship AI with confidence?
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Join thousands of developers who trust Orvion Labs to keep their AI pipelines stable.
                </p>
                <Link href="/login">
                    <Button size="lg" className="h-12 px-8 bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                        Get Started for Free
                    </Button>
                </Link>
            </div>
        </div>
    )
}
