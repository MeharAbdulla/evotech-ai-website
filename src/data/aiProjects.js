/**
 * AI product projects from Aeromek technical reports + demo videos
 * (E:\\projects documents).
 */
const makeAiProject = ({
  id,
  title,
  short_description,
  full_description,
  technologies,
  category = "AI",
  thumbnail_image,
  preview_video,
  pdf_document,
  features = [],
}) => ({
  id,
  title,
  short_description,
  full_description,
  technologies,
  category,
  status: "Demo available",
  featured: true,
  origin: "public",
  open_source: false,
  proprietary: true,
  thumbnail_image,
  gallery_images: [thumbnail_image],
  model_3d: null,
  preview_video,
  zip_file: null,
  source_url: null,
  download_url: null,
  github_url: null,
  pdf_document,
  features,
  hardware_components: [],
  created_at: "2026-08-07T00:00:00.000Z",
  updated_at: "2026-08-07T00:00:00.000Z",
});

export const aiProjects = [
  makeAiProject({
    id: "ai-call-agent",
    title: "Aeromek Call Agent",
    short_description:
      "Browser-native voice discovery line that qualifies leads through a live conversational AI call.",
    full_description:
      "Aeromek Call Agent is a single-page web application that provides a live, browser-based voice interface to a conversational AI agent for business discovery and lead qualification. The system requests microphone access in the browser, establishes a real-time audio channel with a speech-enabled large language model, and runs a structured discovery conversation — identifying the AI solution category a visitor needs (voice, sales, support, booking, chat, or custom) and capturing contact details for follow-up. The surface area is intentionally minimal: a landing screen, a permission-gated call widget, and a live transcript panel. The technical paper covers architecture, multi-stage user flow, browser audio capture, real-time speech pipelines, serverless deployment, and future work such as outbound scheduling, CRM integration, and multi-agent routing.",
    technologies: [
      "Conversational AI",
      "Voice Agents",
      "WebRTC / Browser Audio",
      "LLMs",
      "Lead Qualification",
    ],
    category: "AI Agents",
    thumbnail_image: "/ai-projects/call-agent/poster.jpg",
    preview_video: "/ai-projects/call-agent/demo.mp4",
    pdf_document: "/ai-projects/call-agent/paper.docx",
    features: [
      "Browser microphone permission + live voice call",
      "Structured discovery for AI solution categories",
      "Live transcript panel during the conversation",
      "Lead capture for sales follow-up",
      "Serverless-friendly web deployment",
    ],
  }),
  makeAiProject({
    id: "ai-video-studio",
    title: "Aeromek Video Studio",
    short_description:
      "Prompt-driven studio that generates vertical short-form videos with voice-over, captions, and characters.",
    full_description:
      "Aeromek Video is a browser-based studio for generating vertical, voice-over-driven short-form videos from a single natural-language prompt. The system pairs a conversational authoring interface with an automated production pipeline that plans a narrative concept, assigns a narrator persona, builds a scene-by-scene blueprint, sources or generates supporting b-roll, and renders a finished 1080×1920 MP4 with captions, music, and lip-synced character voice-over. The technical report documents the studio UI, character and voice-casting subsystem, asynchronous generation pipeline, storyboard-based scene editor, deployment model, and engineering considerations for future releases.",
    technologies: [
      "AI Video Generation",
      "Text-to-Video",
      "Voice Cloning",
      "Lip Sync",
      "Storyboard Planning",
    ],
    category: "AI Media",
    thumbnail_image: "/ai-projects/video-studio/poster.jpg",
    preview_video: "/ai-projects/video-studio/demo.mp4",
    pdf_document: "/ai-projects/video-studio/paper.docx",
    features: [
      "Single-prompt short-form video generation",
      "Multi-character casting and voice selection",
      "Scene storyboard with editable outputs",
      "Captions, music, and lip-synced voice-over",
      "Vertical 1080×1920 MP4 render pipeline",
    ],
  }),
  makeAiProject({
    id: "ai-rag-bot",
    title: "RAG Document Q&A Bot",
    short_description:
      "Upload a PDF and ask natural-language questions grounded in retrieved document passages.",
    full_description:
      "RAG Bot is a document question-answering system that combines Retrieval-Augmented Generation with a conversational UI. Users upload a PDF; the backend parses the document, splits it into overlapping chunks, and encodes each chunk with a HuggingFace sentence-transformer into a Chroma vector store. At query time the question is embedded, relevant passages are retrieved, and a Groq-hosted LLM answers using that context. The architecture pairs a FastAPI ingestion/retrieval API with a Streamlit chat frontend. The report covers conversational memory, single-document session scoping, embedding cache latency, provider rate limits, and planned multi-document knowledge bases.",
    technologies: [
      "RAG",
      "FastAPI",
      "LangChain",
      "ChromaDB",
      "Groq",
      "Sentence Transformers",
    ],
    category: "AI",
    thumbnail_image: "/ai-projects/rag-bot/poster.jpg",
    preview_video: "/ai-projects/rag-bot/demo.mp4",
    pdf_document: "/ai-projects/rag-bot/paper.docx",
    features: [
      "PDF upload and chunked embedding pipeline",
      "Vector retrieval with ChromaDB",
      "Conversational Q&A grounded in source passages",
      "FastAPI backend + Streamlit chat UI",
      "Session-scoped single-document knowledge",
    ],
  }),
  makeAiProject({
    id: "ai-whatsapp-rag",
    title: "WhatsApp RAG Assistant",
    short_description:
      "Selenium-driven WhatsApp bot with multi-provider LLMs, humanized typing, and auto-reindexing RAG.",
    full_description:
      "An autonomous WhatsApp AI assistant that couples browser-level WhatsApp Web control with a multi-provider LLM backend and a locally hosted RAG pipeline. Selenium detects unread one-to-one chats, filters out groups/channels/communities/archives, and extracts incoming text and PDF attachments. Replies route full per-contact history through a configurable provider chain (Gemini, Groq, OpenAI, plus static fallback), optionally augmented with context from a Chroma store built from a watched document folder that re-embeds automatically in the background. Outgoing messages use a humanized, character-paced typing routine. The technical paper covers architecture, detection gates, RAG indexing/retrieval, deployment, and a path toward multi-tenant SaaS.",
    technologies: [
      "WhatsApp Automation",
      "Selenium",
      "RAG",
      "Multi-Provider LLMs",
      "Chroma",
      "NLP",
    ],
    category: "AI Agents",
    thumbnail_image: "/ai-projects/whatsapp-rag/poster.jpg",
    preview_video: "/ai-projects/whatsapp-rag/demo.mp4",
    pdf_document: "/ai-projects/whatsapp-rag/paper.docx",
    features: [
      "WhatsApp Web automation via Selenium",
      "Group/channel/archive filtering heuristics",
      "Multi-provider LLM fallback (Gemini / Groq / OpenAI)",
      "Auto-reindexing RAG from a watched folder",
      "Humanized character-paced message delivery",
    ],
  }),
];
