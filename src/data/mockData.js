// Data Analyst Portfolio Core Data Store

// export const HERO_STATS = [
//   { label: "End-to-End Projects", value: "15+", subtext: "E-Commerce, SaaS, Finance" },
//   { label: "Business ROI Impacted", value: "$2.4M+", subtext: "Cost savings & revenue optimization" },
//   { label: "Rows Processed", value: "50M+", subtext: "BigQuery, Snowflake & PostgreSQL" },
//   { label: "ETL Accuracy Rate", value: "99.9%", subtext: "Automated dbt & Airflow pipelines" }
// ];

export const TECH_STACK = [
  { name: "Excel", category: "Spreadsheets", icon: "FileSpreadsheet" },
  { name: "Google Sheets", category: "Spreadsheets", icon: "FileSpreadsheet" },
  { name: "Power BI", category: "Visualization", icon: "BarChart3" },
  { name: "SQL", category: "Database", icon: "Database" },
  { name: "Python", category: "Programming", icon: "Code2" },
  { name: "Statistics", category: "Methodology", icon: "TrendingUp" },
  { name: "Git & Github", category: "Version", icon: "Git" },
];

export const CASE_STUDIES = [
  {
    id: "dsn-2026-hackathon",
    title: "DSN 2026 AI Bootcamp Hackathon Project",
    domain: "E-Commerce & Retail",
    shortDesc: "Audited existing management dashboard, identified data quality issues, validated reported metrics, and built a corrected executive dashboard.",
    tools: ["Excel", "Power BI"],
    featured: true,
    documentation: `# Audit the Dashboard: Retail Data Analytics Project

## Project Overview
This project was completed as part of the **Data Science Nigeria (DSN) AI Bootcamp 2026 Data Analytics Track**.

The objective was not simply to analyze a retail dataset, but to audit an existing management dashboard and determine whether its conclusions could be trusted. The project required identifying data-quality issues, validating reported metrics, challenging existing assumptions, and building a corrected dashboard that accurately reflects business performance.

## Business Problem
Management had already received a dashboard and several business conclusions based on a retail transaction dataset. Before making strategic decisions, management needed an independent review to determine:

- Whether the reported metrics were reliable
- Whether the dashboard conclusions were supported by the data
- Which insights could be trusted for decision-making
- What corrections were necessary to improve reporting accuracy`,
    starMethod: {
      situation: "Management received an initial retail dashboard with unverified metrics and conflicting conclusions.",
      task: "Audit raw transaction data, validate metrics, and rebuild a reliable executive reporting model.",
      action: "Executed data audit in Excel & Power BI, identified data quality anomalies, and rebuilt corrected DAX measures.",
      result: "Restored 100% metric accuracy and established trusted executive decision reporting."
    },
    sampleData: [
      { id: 1, OrderID: "ORD-9021", Region: "West", Sales: "$14,250", Margin: "24.5%", Status: "Verified" },
      { id: 2, OrderID: "ORD-9022", Region: "East", Sales: "$8,900", Margin: "19.2%", Status: "Verified" },
      { id: 3, OrderID: "ORD-9023", Region: "North", Sales: "$22,100", Margin: "31.0%", Status: "Verified" }
    ]
  }
];
