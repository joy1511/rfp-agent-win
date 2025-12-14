const express = require('express');
const cors = require('cors');

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

// Dummy Product Matching data
const productMatching = [
  {
    rfpItem: 'Industrial Grade Router',
    topMatch: 'Cisco ISR 4451',
    matchScore: 94,
    alternatives: [
      { name: 'Juniper MX204', score: 89 },
      { name: 'HPE FlexNetwork', score: 85 },
    ],
  },
  {
    rfpItem: 'Network Switch 48-Port',
    topMatch: 'Cisco Catalyst 9300',
    matchScore: 96,
    alternatives: [
      { name: 'Arista 7050X', score: 91 },
      { name: 'Dell PowerSwitch', score: 87 },
    ],
  },
  {
    rfpItem: 'Firewall Appliance',
    topMatch: 'Palo Alto PA-5220',
    matchScore: 92,
    alternatives: [
      { name: 'Fortinet FortiGate 600E', score: 88 },
      { name: 'Check Point 6400', score: 84 },
    ],
  },
];

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

app.get('/api/product-matching', (req, res) => {
  res.json(productMatching);
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

