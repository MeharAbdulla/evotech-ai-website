/** Public AI-agent service offerings shown on /services and as API fallback. */
export const agentServices = [
  {
    id: "svc-whatsapp-agent",
    icon: "FiSmartphone",
    title: "WhatsApp AI Agent",
    short_description:
      "Automate customer chat on WhatsApp — FAQs, lead capture, bookings, and human handoff.",
    features: ["Business API integration", "RAG knowledge replies", "CRM sync"],
  },
  {
    id: "svc-lead-agent",
    icon: "FiZap",
    title: "Lead Generation Agent",
    short_description:
      "Score, qualify, and nurture inbound leads from forms, ads, and chat in real time.",
    features: ["Lead scoring", "Auto nurture", "Sales alerts"],
  },
  {
    id: "svc-crm-ai",
    icon: "FiLayers",
    title: "AI CRM System",
    short_description:
      "Smart CRM with enrichment, pipeline coaching, and automated follow-ups for your team.",
    features: ["Contact enrichment", "Deal coaching", "Omnichannel timeline"],
  },
  {
    id: "svc-support-agent",
    icon: "FiGlobe",
    title: "Customer Support Agent",
    short_description:
      "Omnichannel support that resolves routine tickets and escalates only when needed.",
    features: ["Doc-grounded answers", "Ticketing", "CSAT tracking"],
  },
  {
    id: "svc-sales-agent",
    icon: "FiCpu",
    title: "Sales Outreach Agent",
    short_description:
      "Personalized outbound sequences across email and LinkedIn with CRM logging.",
    features: ["Prospect research", "Sequences", "Demo booking"],
  },
  {
    id: "svc-booking-agent",
    icon: "FiBox",
    title: "Appointment Booking Agent",
    short_description:
      "Chat and voice booking with calendar sync, reminders, and no-show reduction.",
    features: ["Calendar sync", "Reminders", "Reschedule flows"],
  },
];
