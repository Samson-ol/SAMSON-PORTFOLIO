import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Users, Percent, Sparkles, ArrowRight } from 'lucide-react';

export default function ROICalculator() {
  const [annualRevenue, setAnnualRevenue] = useState(2500000);
  const [churnRate, setChurnRate] = useState(7.5); // %
  const [churnReduction, setChurnReduction] = useState(18); // %
  const [adSpend, setAdSpend] = useState(300000);
  const [roasLift, setRoasLift] = useState(25); // %

  // Calculation Logic
  const annualChurnLoss = (annualRevenue * (churnRate / 100));
  const revenueSavedFromChurn = annualChurnLoss * (churnReduction / 100);
  const additionalAdRevenue = (adSpend * (roasLift / 100));
  const totalImpact = revenueSavedFromChurn + additionalAdRevenue;
  const estimatedCostOfAnalyst = 95000;
  const netROI = ((totalImpact / estimatedCostOfAnalyst) * 100).toFixed(0);

  return (
    <section id="roi-calculator" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="badge-tag">
            <Calculator size={14} /> Financial Impact Simulator
          </div>
          <h2 className="section-title">
            Business Impact & <span className="gradient-text">ROI Calculator</span>
          </h2>
          <p className="section-subtitle">
            Demonstrating business intuition & financial modeling. Test how applying data analytics strategies directly boosts bottom-line revenue.
          </p>
        </div>

        {/* Calculator Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Controls Column */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} /> Input Business Parameters
            </h3>

            {/* Input 1: Annual Revenue */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Annual Revenue ($)</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>${annualRevenue.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="10000000" 
                step="250000"
                value={annualRevenue} 
                onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
            </div>

            {/* Input 2: Current Monthly Churn */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Current Monthly Churn Rate (%)</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-rose)' }}>{churnRate}%</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="20" 
                step="0.5"
                value={churnRate} 
                onChange={(e) => setChurnRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-rose)', cursor: 'pointer' }}
              />
            </div>

            {/* Input 3: Targeted Churn Reduction */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Data Model Churn Reduction Target</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>-{churnReduction}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="1"
                value={churnReduction} 
                onChange={(e) => setChurnReduction(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
              />
            </div>

            {/* Input 4: Annual Digital Ad Spend */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Annual Digital Marketing Spend ($)</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>${adSpend.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="50000" 
                max="2000000" 
                step="50000"
                value={adSpend} 
                onChange={(e) => setAdSpend(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
              />
            </div>

          </div>

          {/* Results Column */}
          <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(0,242,254,0.05) 0%, rgba(139,92,246,0.05) 100%)', border: '1px solid var(--border-accent)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} style={{ color: 'var(--accent-emerald)' }} /> Estimated Analytics Value Generated
              </h3>

              {/* Total Financial Output Hero Card */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 242, 254, 0.2)', textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Projected Annual Bottom-Line Impact
                </div>
                <div style={{ fontSize: '3rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }} className="gradient-text-emerald">
                  ${Math.round(totalImpact).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                  {netROI}% Return on Analytics Investment
                </div>
              </div>

              {/* Itemized Breakdown */}
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ARR Retained from Churn Model:</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>+${Math.round(revenueSavedFromChurn).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ad ROAS Optimization Lift:</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>+${Math.round(additionalAdRevenue).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                *Calculations based on econometric attribution modeling & cohort retention benchmarks.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
