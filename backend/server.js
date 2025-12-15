require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require('express');
const cors = require('cors');
const { getSpecMatchPercentage } = require('./openaiClient');

const app = express();
const PORT = 5000;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dummy RFP data
const rfps = [
  {
    id: 1,
    title: 'Industrial Equipment Supply - Metro Rail Project',
    source: 'gov-procurement.com',
    dueDate: '2025-02-15',
    daysLeft: 28,
  },
  {
    id: 2,
    title: 'Telecommunications Infrastructure Upgrade',
    source: 'telecom-rfps.io',
    dueDate: '2025-03-10',
    daysLeft: 51,
  },
  {
    id: 3,
    title: 'Smart Manufacturing Solutions RFP',
    source: 'enterprise-bids.net',
    dueDate: '2025-02-28',
    daysLeft: 41,
  },
  {
    id: 4,
    title: 'Metro Rail Signaling System Modernization',
    source: 'gov-procurement.com',
    dueDate: '2025-03-20',
    daysLeft: 61,
  },
  {
    id: 5,
    title: '5G Network Equipment Procurement',
    source: 'telecom-rfps.io',
    dueDate: '2025-02-22',
    daysLeft: 35,
  },
];

// Product matching data with RFP requirements and product specifications
const productMatchingData = [
  {
    rfpItem: 'Industrial Grade Router',
    rfpRequirement: 'Industrial grade router required for metro rail project. Must support high-speed data transmission, redundant power supplies, advanced routing protocols (OSPF, BGP), and operate in harsh environmental conditions. Minimum throughput: 10 Gbps, support for VPN, and 24/7 reliability.',
    topMatch: 'Cisco ISR 4451',
    topMatchSpecs: 'Cisco ISR 4451 Integrated Services Router. Supports up to 10 Gbps throughput, dual power supplies, advanced routing (OSPF, BGP, EIGRP), VPN capabilities, and industrial temperature range. Designed for enterprise and industrial deployments with high reliability.',
    fallbackMatchScore: 94,
    alternatives: [
      { 
        name: 'Juniper MX204', 
        specs: 'Juniper MX204 Universal Routing Platform. 10 Gbps capacity, modular power, supports OSPF and BGP, VPN support, industrial-grade design.',
        fallbackScore: 89 
      },
      { 
        name: 'HPE FlexNetwork', 
        specs: 'HPE FlexNetwork Router. 8 Gbps throughput, single power supply, basic routing protocols, limited VPN support.',
        fallbackScore: 85 
      },
    ],
  },
  {
    rfpItem: 'Network Switch 48-Port',
    rfpRequirement: '48-port network switch for enterprise deployment. Required features: Gigabit Ethernet ports, PoE+ support for at least 24 ports, Layer 3 switching, VLAN support, SNMP management, and stackable configuration. Must support 10Gb uplinks.',
    topMatch: 'Cisco Catalyst 9300',
    topMatchSpecs: 'Cisco Catalyst 9300 Series Switch. 48 Gigabit Ethernet ports with PoE+ on all ports, Layer 3 switching, advanced VLAN support, SNMP and CLI management, stackable up to 8 units, dual 10Gb SFP+ uplinks.',
    fallbackMatchScore: 96,
    alternatives: [
      { 
        name: 'Arista 7050X', 
        specs: 'Arista 7050X Series. 48 ports, PoE+ on 24 ports, Layer 3 capabilities, VLAN support, management interfaces, 10Gb uplinks.',
        fallbackScore: 91 
      },
      { 
        name: 'Dell PowerSwitch', 
        specs: 'Dell PowerSwitch N3000 Series. 48 ports, PoE on 24 ports, Layer 2/3 switching, basic VLAN, SNMP support.',
        fallbackScore: 87 
      },
    ],
  },
  {
    rfpItem: 'Firewall Appliance',
    rfpRequirement: 'Enterprise firewall appliance with advanced threat protection. Requirements: minimum 5 Gbps throughput, intrusion prevention system (IPS), application control, VPN support, centralized management, and real-time threat intelligence updates.',
    topMatch: 'Palo Alto PA-5220',
    topMatchSpecs: 'Palo Alto PA-5220 Next-Generation Firewall. 10 Gbps throughput, advanced threat prevention, IPS, application identification and control, VPN capabilities, Panorama centralized management, Threat Intelligence subscriptions.',
    fallbackMatchScore: 92,
    alternatives: [
      { 
        name: 'Fortinet FortiGate 600E', 
        specs: 'Fortinet FortiGate 600E. 5 Gbps throughput, IPS and application control, VPN support, FortiManager integration, threat intelligence.',
        fallbackScore: 88 
      },
      { 
        name: 'Check Point 6400', 
        specs: 'Check Point 6400 Security Gateway. 4 Gbps throughput, IPS capabilities, application control, VPN support, SmartConsole management.',
        fallbackScore: 84 
      },
    ],
  },
];

// In-memory cache for product matching results, keyed by a simple session identifier.
// This keeps spec match values stable for a given requester without changing the API.
const productMatchingCache = new Map();

function getProductMatchingCacheKey(req) {
  // Approximate a "session" without frontend changes by using IP + user agent.
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
  const ua = req.headers["user-agent"] || "unknown-ua";
  return `${ip}::${ua}`;
}

// Dummy Pricing Summary data
const pricingSummary = {
  materialsBreakdown: [
    { item: 'Cisco ISR 4451', quantity: 5, unitPrice: 12500, total: 62500 },
    { item: 'Cisco Catalyst 9300', quantity: 12, unitPrice: 8200, total: 98400 },
    { item: 'Palo Alto PA-5220', quantity: 3, unitPrice: 28000, total: 84000 },
  ],
  servicesBreakdown: [
    { item: 'Installation & Configuration', hours: 120, rate: 150, total: 18000 },
    { item: 'Performance Testing', hours: 40, rate: 175, total: 7000 },
    { item: 'Acceptance Testing', hours: 32, rate: 175, total: 5600 },
  ],
};

// Calculate totals
const materialCost = pricingSummary.materialsBreakdown.reduce((sum, item) => sum + item.total, 0);
const serviceCost = pricingSummary.servicesBreakdown.reduce((sum, item) => sum + item.total, 0);
const totalProposalValue = materialCost + serviceCost;

// API Routes
app.get('/api/rfps', (req, res) => {
  res.json(rfps);
});

// Helper function to call Gemini with timeout and fallback
async function getMatchScoreWithFallback(rfpRequirement, productSpecs, fallbackValue, productName) {
  try {
    // Call Gemini to compute spec match percentage
    const matchScore = await Promise.race([
      getSpecMatchPercentage(rfpRequirement, productSpecs),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gemini request timeout')), 30000)
      )
    ]);
    console.log(`✓ AI match calculated for ${productName}: ${matchScore}%`);
    return matchScore;
  } catch (error) {
    console.error(`✗ Gemini failed for ${productName}, using fallback ${fallbackValue}%:`, error.message);
    return fallbackValue;
  }
}

app.get('/api/product-matching', async (req, res) => {
  const cacheKey = getProductMatchingCacheKey(req);

  // 1) Return cached results if available, so values stay stable for this requester/session.
  if (productMatchingCache.has(cacheKey)) {
    console.log('📊 Product Matching API called - returning cached results for session:', cacheKey);
    return res.json(productMatchingCache.get(cacheKey));
  }

  console.log('📊 Product Matching API called - computing spec match percentages with AI...');
  
  try {
    const productMatching = await Promise.all(
      productMatchingData.map(async (item) => {
        // Calculate match score for top match using AI (or mock, depending on mode)
        const topMatchScore = await getMatchScoreWithFallback(
          item.rfpRequirement,
          item.topMatchSpecs,
          item.fallbackMatchScore,
          item.topMatch
        );

        // Calculate match scores for alternatives using AI / mock
        const alternatives = await Promise.all(
          item.alternatives.map(async (alt) => {
            const altScore = await getMatchScoreWithFallback(
              item.rfpRequirement,
              alt.specs,
              alt.fallbackScore,
              alt.name
            );
            return {
              name: alt.name,
              score: altScore,
            };
          })
        );

        return {
          rfpItem: item.rfpItem,
          topMatch: item.topMatch,
          matchScore: topMatchScore,
          alternatives: alternatives,
        };
      })
    );

    console.log('✅ Product Matching API response ready, caching for session:', cacheKey);
    productMatchingCache.set(cacheKey, productMatching);
    res.json(productMatching);
  } catch (error) {
    console.error('❌ Critical error in /api/product-matching:', error);
    // Fallback to hardcoded values on complete failure
    const fallbackProductMatching = productMatchingData.map((item) => ({
      rfpItem: item.rfpItem,
      topMatch: item.topMatch,
      matchScore: item.fallbackMatchScore,
      alternatives: item.alternatives.map((alt) => ({
        name: alt.name,
        score: alt.fallbackScore,
      })),
    }));

    console.log('✅ Returning fallback product matching and caching for session:', cacheKey);
    productMatchingCache.set(cacheKey, fallbackProductMatching);
    res.json(fallbackProductMatching);
  }
});

app.get('/api/pricing-summary', (req, res) => {
  res.json({
    materialCost,
    serviceCost,
    totalProposalValue,
    materialsBreakdown: pricingSummary.materialsBreakdown,
    servicesBreakdown: pricingSummary.servicesBreakdown,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

