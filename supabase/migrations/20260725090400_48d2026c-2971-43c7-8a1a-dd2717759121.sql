
-- profile_content
CREATE TABLE public.profile_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profile_content TO anon, authenticated;
GRANT ALL ON public.profile_content TO service_role;
ALTER TABLE public.profile_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read profile_content" ON public.profile_content FOR SELECT USING (true);

-- documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.documents TO anon, authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read documents" ON public.documents FOR SELECT USING (true);

-- faq_items
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_items TO anon, authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active faqs" ON public.faq_items FOR SELECT USING (is_active = true);

-- chat_sessions
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_type TEXT CHECK (visitor_type IN ('recruiter','academic','collaborator','other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.chat_sessions TO anon, authenticated;
GRANT ALL ON public.chat_sessions TO service_role;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert chat_sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "public read own chat_sessions" ON public.chat_sessions FOR SELECT USING (true);

-- chat_messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.chat_messages TO anon, authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "public read chat_messages" ON public.chat_messages FOR SELECT USING (true);

-- contact_messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organisation TEXT,
  reason TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- site_analytics
CREATE TABLE public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.site_analytics TO anon, authenticated;
GRANT ALL ON public.site_analytics TO service_role;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert analytics" ON public.site_analytics FOR INSERT WITH CHECK (true);

-- Seed profile_content
INSERT INTO public.profile_content (section, title, content, tags, sort_order) VALUES
('bio', 'About Francis', 'Francis Phiri is a Junior Data Engineer, Software Developer and Machine Learning Researcher based in Johannesburg, South Africa. He holds an MSc Engineering in Electrical and Information Engineering from the University of the Witwatersrand. His work spans production data platforms, intelligent software systems, and applied research on 5G/6G edge intelligence.', ARRAY['bio','summary'], 0),
('career', 'Junior Data Engineer — KHM Technology', 'Full-time. Builds and maintains a medallion-architecture data warehouse (bronze / silver / gold). Owns SQL and Python ETL, dimensional modelling, Airbyte ingestion, SQL scripts, stored procedures, views and triggers. Integrates Metabase and Power BI dashboards for business and marketing stakeholders. Contributes to data governance, data quality, and data-access policies. Also builds ASP.NET Web APIs, Kafka integrations, Docker workflows, n8n automations, and OpenAI/Claude agent tooling to enrich product telemetry.', ARRAY['data-engineering','sql','python','power-bi','metabase','airbyte','kafka','docker'], 1),
('career', 'Junior Software Developer — Best Health Solutions', 'Part-time. Contributed to digital health software features and integrations.', ARRAY['software','healthtech'], 2),
('career', 'Data Science Intern — Wits Business Intelligence Services', 'Part-time. Built analytics and models supporting institutional and student-success reporting.', ARRAY['data-science','analytics'], 3),
('career', 'Data Engineering Intern — Wits Business Intelligence Services', 'Part-time. Developed ETL pipelines and data models for institutional analytics.', ARRAY['data-engineering','etl'], 4),
('career', 'Lecturing Assistant — University of the Witwatersrand', 'Part-time. Supported undergraduate teaching in electrical and information engineering.', ARRAY['teaching'], 5),
('academic', 'MSc Engineering — University of the Witwatersrand', 'MSc Engineering in Electrical and Information Engineering. Focus on machine learning, wireless communications, and edge computing.', ARRAY['msc','wits'], 0),
('dissertation', 'Machine Learning-based Computation Offloading in Energy-Harvesting 5G Networks', 'Applied Twin Delayed Deep Deterministic Policy Gradient (TD3) deep reinforcement learning to computation offloading in 5G mobile edge computing. Addressed eMBB/URLLC coexistence, energy-harvesting constraints, queueing delay, and joint resource allocation to improve energy efficiency and QoS.', ARRAY['td3','reinforcement-learning','5g','mec','energy-harvesting'], 0),
('research', 'Research Interests', '5G/6G networks · mobile edge computing · federated learning · deep reinforcement learning · resource allocation · eMBB/URLLC coexistence · energy-aware offloading · graph learning · privacy-aware edge intelligence.', ARRAY['research'], 0),
('publication', 'SATNAC 2024 — Second-Best Paper Award', 'Peer-reviewed conference paper published at the Southern Africa Telecommunication Networks and Applications Conference (SATNAC) 2024. Recognised with the Second-Best Paper Award.', ARRAY['satnac','award','2024'], 0),
('publication', 'IEEE GLOBECOM 2025', 'Peer-reviewed conference paper accepted at IEEE Global Communications Conference (GLOBECOM) 2025.', ARRAY['ieee','globecom','2025'], 1),
('phd', 'Proposed PhD Direction', 'Federated and reinforcement learning for energy-efficient computation offloading in 5G/6G edge networks.', ARRAY['phd','federated-learning','6g'], 0),
('project', 'KHM Data Warehouse & Reporting Platform', 'Designed and implemented a medallion-architecture warehouse with Airbyte ingestion, SQL/Python transformations, and Metabase + Power BI reporting for business and marketing stakeholders.', ARRAY['data-warehouse','medallion','power-bi'], 0),
('project', 'Digital Health Systems', 'Software features and integrations for digital health workflows at Best Health Solutions.', ARRAY['healthtech'], 1),
('project', 'Institutional Analytics & Student-Success Dashboards', 'ETL pipelines and dashboards supporting Wits institutional analytics and student-success reporting.', ARRAY['analytics','higher-ed'], 2),
('project', 'NLP CV Shortlisting System', 'Natural-language-processing pipeline for automated CV screening and shortlisting against role requirements.', ARRAY['nlp','recruitment'], 3);

-- Seed FAQs
INSERT INTO public.faq_items (question, answer, category) VALUES
('What data engineering experience does Francis have?', 'Francis is a full-time Junior Data Engineer at KHM Technology, where he builds a medallion-architecture data warehouse using SQL, Python, Airbyte ingestion, dimensional modelling, and bronze/silver/gold processing layers. He integrates Metabase and Power BI, writes stored procedures and triggers, and contributes to data governance and quality.', 'career'),
('What is his MSc research about?', 'His MSc dissertation is titled "Machine Learning-based Computation Offloading in Energy-Harvesting 5G Networks." He applied TD3 deep reinforcement learning to 5G mobile edge computing, addressing eMBB/URLLC coexistence, energy-harvesting constraints, queueing delay, and resource allocation.', 'academic'),
('Does he have Power BI experience?', 'Yes. At KHM Technology he builds and maintains Power BI (and Metabase) reports for business and marketing stakeholders, sourced from the gold layer of the warehouse.', 'skills'),
('What projects has he built?', 'Selected projects include the KHM Data Warehouse and Reporting Platform, digital health systems at Best Health Solutions, institutional analytics and student-success dashboards at Wits, and an NLP-based CV shortlisting system.', 'projects'),
('Is he suitable for a PhD in federated learning or telecommunications?', 'Yes. His MSc research already applies deep reinforcement learning to 5G edge computing, with two peer-reviewed publications (SATNAC 2024 — Second-Best Paper Award, and IEEE GLOBECOM 2025). His proposed PhD direction is federated and reinforcement learning for energy-efficient computation offloading in 5G/6G edge networks.', 'phd'),
('What programming languages and tools does he use?', 'Python, SQL, C# (ASP.NET Web APIs), and JavaScript/TypeScript. Tools include Airbyte, Metabase, Power BI, Kafka, Docker, Git, n8n, and OpenAI/Claude agent tooling. Research work uses PyTorch/TensorFlow-style deep RL frameworks.', 'skills'),
('How can I contact Francis?', 'Email francophiri97@gmail.com, phone +27 74 538 5295, or connect on LinkedIn at linkedin.com/in/francis-phiri-004b07111.', 'contact');

-- Seed documents (placeholders — file_url to be updated later)
INSERT INTO public.documents (title, category, description, file_url) VALUES
('Career CV (Two-Page ATS)', 'cv', 'Two-page ATS-friendly CV covering data engineering, software development and ML experience.', ''),
('Academic PhD CV', 'cv', 'Detailed academic CV highlighting research, publications, and MSc dissertation work.', ''),
('MSc Dissertation', 'research', 'Machine Learning-based Computation Offloading in Energy-Harvesting 5G Networks.', ''),
('SATNAC 2024 Paper (Second-Best Paper Award)', 'publication', 'Peer-reviewed conference paper published at SATNAC 2024.', ''),
('IEEE GLOBECOM 2025 Paper', 'publication', 'Peer-reviewed conference paper published at IEEE GLOBECOM 2025.', ''),
('Career Cover Letter', 'cover-letter', 'Career cover letter tailored for data engineering, software development and ML roles.', '');
