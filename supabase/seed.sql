-- =============================================
-- OBSERVE — Seed Data
-- Demo content to make the platform feel alive
-- =============================================

-- Data sources
INSERT INTO public.data_sources (name, slug, adapter_key, base_url, auth_type, is_active, fetch_interval_seconds) VALUES
  ('GDELT Project', 'gdelt', 'gdelt', 'http://api.gdeltproject.org', 'none', true, 300),
  ('USGS Earthquakes', 'usgs', 'usgs', 'https://earthquake.usgs.gov', 'none', true, 300),
  ('Open-Meteo', 'openmeteo', 'openmeteo', 'https://api.open-meteo.com', 'none', true, 600),
  ('OpenSky Network', 'opensky', 'opensky', 'https://opensky-network.org', 'basic', true, 60),
  ('CoinGecko', 'coingecko', 'coingecko', 'https://api.coingecko.com', 'api_key', true, 60),
  ('Exchange Rate API', 'exchangerate', 'exchangerate', 'https://api.exchangerate.host', 'none', true, 60),
  ('Demo Seed', 'demo', 'demo', null, 'none', false, 99999)
ON CONFLICT (slug) DO NOTHING;

-- Countries (key subset — full list populated by application)
INSERT INTO public.countries (id, name, region, subregion, capital, lat, lng, population, risk_score) VALUES
  ('UA', 'Ukraine', 'Europe', 'Eastern Europe', 'Kyiv', 48.3794, 31.1656, 43000000, 92),
  ('RU', 'Russia', 'Europe', 'Eastern Europe', 'Moscow', 61.5240, 105.3188, 143000000, 88),
  ('IL', 'Israel', 'Middle East', 'Western Asia', 'Jerusalem', 31.0461, 34.8516, 9000000, 85),
  ('PS', 'Palestine', 'Middle East', 'Western Asia', 'Ramallah', 31.9522, 35.2332, 5000000, 90),
  ('SY', 'Syria', 'Middle East', 'Western Asia', 'Damascus', 34.8021, 38.9968, 21000000, 91),
  ('IQ', 'Iraq', 'Middle East', 'Western Asia', 'Baghdad', 33.2232, 43.6793, 40000000, 78),
  ('IR', 'Iran', 'Middle East', 'Western Asia', 'Tehran', 32.4279, 53.6880, 84000000, 82),
  ('YE', 'Yemen', 'Middle East', 'Western Asia', 'Sanaa', 15.5527, 48.5164, 30000000, 95),
  ('SD', 'Sudan', 'Africa', 'Northern Africa', 'Khartoum', 12.8628, 30.2176, 43000000, 89),
  ('ET', 'Ethiopia', 'Africa', 'Eastern Africa', 'Addis Ababa', 9.1450, 40.4897, 115000000, 74),
  ('MM', 'Myanmar', 'Asia', 'South-Eastern Asia', 'Naypyidaw', 21.9162, 95.9560, 54000000, 86),
  ('KP', 'North Korea', 'Asia', 'Eastern Asia', 'Pyongyang', 40.3399, 127.5101, 26000000, 87),
  ('CN', 'China', 'Asia', 'Eastern Asia', 'Beijing', 35.8617, 104.1954, 1400000000, 45),
  ('TW', 'Taiwan', 'Asia', 'Eastern Asia', 'Taipei', 23.6978, 120.9605, 24000000, 62),
  ('US', 'United States', 'Americas', 'Northern America', 'Washington D.C.', 37.0902, -95.7129, 331000000, 22),
  ('GB', 'United Kingdom', 'Europe', 'Northern Europe', 'London', 55.3781, -3.4360, 67000000, 18),
  ('DE', 'Germany', 'Europe', 'Western Europe', 'Berlin', 51.1657, 10.4515, 84000000, 15),
  ('FR', 'France', 'Europe', 'Western Europe', 'Paris', 46.2276, 2.2137, 67000000, 20),
  ('SA', 'Saudi Arabia', 'Middle East', 'Western Asia', 'Riyadh', 23.8859, 45.0792, 35000000, 55),
  ('PK', 'Pakistan', 'Asia', 'Southern Asia', 'Islamabad', 30.3753, 69.3451, 220000000, 76),
  ('IN', 'India', 'Asia', 'Southern Asia', 'New Delhi', 20.5937, 78.9629, 1400000000, 38),
  ('BR', 'Brazil', 'Americas', 'South America', 'Brasília', -14.2350, -51.9253, 213000000, 42),
  ('MX', 'Mexico', 'Americas', 'Central America', 'Mexico City', 23.6345, -102.5528, 128000000, 55),
  ('VE', 'Venezuela', 'Americas', 'South America', 'Caracas', 6.4238, -66.5897, 28000000, 78),
  ('AF', 'Afghanistan', 'Asia', 'Southern Asia', 'Kabul', 33.9391, 67.7100, 38000000, 94),
  ('LY', 'Libya', 'Africa', 'Northern Africa', 'Tripoli', 26.3351, 17.2283, 7000000, 80),
  ('SO', 'Somalia', 'Africa', 'Eastern Africa', 'Mogadishu', 5.1521, 46.1996, 16000000, 88),
  ('ML', 'Mali', 'Africa', 'Western Africa', 'Bamako', 17.5707, -3.9962, 20000000, 79),
  ('NG', 'Nigeria', 'Africa', 'Western Africa', 'Abuja', 9.0820, 8.6753, 211000000, 65),
  ('JP', 'Japan', 'Asia', 'Eastern Asia', 'Tokyo', 36.2048, 138.2529, 126000000, 18),
  ('KR', 'South Korea', 'Asia', 'Eastern Asia', 'Seoul', 35.9078, 127.7669, 52000000, 30),
  ('AU', 'Australia', 'Oceania', 'Australia and New Zealand', 'Canberra', -25.2744, 133.7751, 26000000, 12),
  ('CA', 'Canada', 'Americas', 'Northern America', 'Ottawa', 56.1304, -106.3468, 38000000, 10),
  ('TR', 'Turkey', 'Europe', 'Western Asia', 'Ankara', 38.9637, 35.2433, 84000000, 52),
  ('PH', 'Philippines', 'Asia', 'South-Eastern Asia', 'Manila', 12.8797, 121.7740, 110000000, 55),
  ('ZA', 'South Africa', 'Africa', 'Southern Africa', 'Pretoria', -30.5595, 22.9375, 59000000, 45),
  ('ES', 'Spain', 'Europe', 'Southern Europe', 'Madrid', 40.4637, -3.7492, 47000000, 18),
  ('BD', 'Bangladesh', 'Asia', 'Southern Asia', 'Dhaka', 23.6850, 90.3563, 170000000, 55),
  ('AE', 'United Arab Emirates', 'Middle East', 'Western Asia', 'Abu Dhabi', 23.4241, 53.8478, 10000000, 30),
  ('SG', 'Singapore', 'Asia', 'South-Eastern Asia', 'Singapore', 1.3521, 103.8198, 6000000, 8),
  ('NL', 'Netherlands', 'Europe', 'Western Europe', 'Amsterdam', 52.1326, 5.2913, 17000000, 12),
  ('MY', 'Malaysia', 'Asia', 'South-Eastern Asia', 'Kuala Lumpur', 4.2105, 101.9758, 33000000, 30),
  ('EG', 'Egypt', 'Africa', 'Northern Africa', 'Cairo', 26.8206, 30.8025, 104000000, 55)
ON CONFLICT (id) DO NOTHING;

-- Market assets
INSERT INTO public.market_assets (symbol, name, asset_class, country_id, is_active) VALUES
  ('BTC', 'Bitcoin', 'crypto', null, true),
  ('ETH', 'Ethereum', 'crypto', null, true),
  ('XRP', 'Ripple', 'crypto', null, true),
  ('SOL', 'Solana', 'crypto', null, true),
  ('USDT', 'Tether', 'crypto', null, true),
  ('USD/EUR', 'US Dollar / Euro', 'currency', 'US', true),
  ('USD/GBP', 'US Dollar / British Pound', 'currency', 'US', true),
  ('USD/JPY', 'US Dollar / Japanese Yen', 'currency', 'US', true),
  ('USD/CNY', 'US Dollar / Chinese Yuan', 'currency', 'US', true),
  ('USD/RUB', 'US Dollar / Russian Ruble', 'currency', 'RU', true),
  ('USD/UAH', 'US Dollar / Ukrainian Hryvnia', 'currency', 'UA', true),
  ('GOLD', 'Gold', 'commodity', null, true),
  ('OIL_WTI', 'Crude Oil WTI', 'commodity', null, true),
  ('OIL_BRENT', 'Crude Oil Brent', 'commodity', null, true),
  ('NATGAS', 'Natural Gas', 'commodity', null, true),
  ('WHEAT', 'Wheat Futures', 'commodity', null, true)
ON CONFLICT (symbol) DO NOTHING;

-- Seed global events with realistic demo data
-- Conflicts
INSERT INTO public.global_events (id, external_id, type, title, summary, severity, country_id, region, lat, lng, tags, occurred_at, source_url) VALUES
  ('00000000-0000-0000-0001-000000000001', 'seed-conflict-001', 'conflict', 'Russia-Ukraine War: Ongoing Frontline Activity', 'Active combat operations continue along the eastern front in Donetsk and Zaporizhzhia oblasts. Artillery exchanges reported near Avdiivka sector.', 'critical', 'UA', 'Europe', 48.5, 37.5, ARRAY['war', 'artillery', 'frontline', 'ukraine', 'russia'], now() - interval '2 hours', 'https://www.bbc.com/news/world-europe'),
  ('00000000-0000-0000-0001-000000000002', 'seed-conflict-002', 'conflict', 'Gaza: Humanitarian Corridor Negotiations', 'International mediators working on ceasefire framework. Hostage negotiations ongoing. Significant civilian displacement continues.', 'critical', 'PS', 'Middle East', 31.4, 34.3, ARRAY['gaza', 'humanitarian', 'ceasefire', 'negotiations'], now() - interval '4 hours', 'https://www.reuters.com/world/middle-east/'),
  ('00000000-0000-0000-0001-000000000003', 'seed-conflict-003', 'conflict', 'Sudan Civil War: RSF vs SAF Clashes Intensify', 'Rapid Support Forces and Sudanese Armed Forces in continued urban conflict in Khartoum and Darfur region. Humanitarian crisis deepening.', 'critical', 'SD', 'Africa', 15.6, 32.5, ARRAY['sudan', 'civil-war', 'rsf', 'humanitarian'], now() - interval '6 hours', 'https://www.aljazeera.com/africa/'),
  ('00000000-0000-0000-0001-000000000004', 'seed-conflict-004', 'conflict', 'Myanmar: Resistance Forces Advance in Shan State', 'Three Brotherhood Alliance reports significant territorial gains in northern Shan State. Military junta facing pressure on multiple fronts.', 'high', 'MM', 'Asia', 22.9, 98.5, ARRAY['myanmar', 'junta', 'resistance', 'shan-state'], now() - interval '8 hours', 'https://www.irrawaddy.com/'),
  ('00000000-0000-0000-0001-000000000005', 'seed-conflict-005', 'conflict', 'South China Sea: Naval Tensions Near Spratly Islands', 'Chinese Coast Guard vessels confront Philippine supply vessels near Second Thomas Shoal. Escalatory incident with water cannon deployment.', 'high', 'CN', 'Asia', 9.7, 115.8, ARRAY['south-china-sea', 'territorial-dispute', 'china', 'philippines', 'naval'], now() - interval '12 hours', 'https://www.reuters.com/world/asia-pacific/'),
  ('00000000-0000-0000-0001-000000000006', 'seed-conflict-006', 'conflict', 'Yemen: Houthi Red Sea Shipping Attacks Continue', 'Ansar Allah (Houthis) launch drone and missile attacks on commercial shipping in Red Sea corridor. Coalition naval forces respond.', 'high', 'YE', 'Middle East', 15.5, 43.2, ARRAY['houthis', 'red-sea', 'shipping', 'attacks', 'iran'], now() - interval '3 hours', 'https://gcaptain.com/'),
  ('00000000-0000-0000-0001-000000000007', 'seed-conflict-007', 'conflict', 'Ethiopia: Amhara Region Conflict Flares', 'Amhara Fano militias clash with federal forces in Lalibela region. Displacement of civilians reported. Peace process stalled.', 'moderate', 'ET', 'Africa', 12.0, 39.0, ARRAY['ethiopia', 'amhara', 'fano', 'conflict'], now() - interval '18 hours', 'https://www.ethiopia-insight.com/'),
  ('00000000-0000-0000-0001-000000000008', 'seed-conflict-008', 'conflict', 'Lebanon-Israel Border: Hezbollah Exchange', 'Cross-border exchanges continue along Blue Line. IDF airstrikes on southern Lebanon. Hezbollah rocket fire into northern Israel.', 'high', 'IL', 'Middle East', 33.2, 35.5, ARRAY['lebanon', 'israel', 'hezbollah', 'border'], now() - interval '5 hours', null)
ON CONFLICT (id) DO NOTHING;

-- Weather events
INSERT INTO public.global_events (id, external_id, type, title, summary, severity, country_id, region, lat, lng, tags, occurred_at) VALUES
  ('00000000-0000-0000-0002-000000000001', 'seed-weather-001', 'weather', 'Tropical Storm Approaching Philippines', 'Category 3 typhoon tracking toward Luzon. Evacuation orders issued for coastal provinces. Expected landfall in 48 hours.', 'high', 'PH', 'Asia', 14.5, 122.0, ARRAY['typhoon', 'philippines', 'evacuation', 'tropical-storm'], now() - interval '1 hour'),
  ('00000000-0000-0000-0002-000000000002', 'seed-weather-002', 'weather', 'Magnitude 6.4 Earthquake — Japan', 'Strong earthquake strikes off coast of Fukushima prefecture. Tsunami advisory issued. Minor damage reported in coastal areas.', 'high', 'JP', 'Asia', 37.5, 141.9, ARRAY['earthquake', 'japan', 'tsunami', 'fukushima'], now() - interval '30 minutes'),
  ('00000000-0000-0000-0002-000000000003', 'seed-weather-003', 'weather', 'Unprecedented Heat Wave — Southern Europe', 'Record temperatures exceeding 45°C across Spain, Portugal, and southern France. Wildfire risk at extreme level. Health emergency declared.', 'high', 'ES', 'Europe', 38.0, -3.7, ARRAY['heatwave', 'europe', 'wildfire', 'extreme-heat'], now() - interval '6 hours'),
  ('00000000-0000-0000-0004-000000000001', 'seed-weather-004', 'weather', 'Heavy Monsoon Flooding — Bangladesh', 'Brahmaputra river overflow displaces 2 million people in northern Bangladesh. Emergency relief operations underway.', 'critical', 'BD', 'Asia', 24.5, 89.8, ARRAY['flooding', 'bangladesh', 'monsoon', 'displacement'], now() - interval '4 hours')
ON CONFLICT (id) DO NOTHING;

-- News events
INSERT INTO public.global_events (id, external_id, type, title, summary, severity, country_id, region, lat, lng, tags, occurred_at, source_url) VALUES
  ('00000000-0000-0000-0003-000000000001', 'seed-news-001', 'news', 'Fed Signals Rate Decision at Jackson Hole', 'Federal Reserve chair hints at potential rate adjustments based on employment data and inflation trajectory. Markets react positively.', 'moderate', 'US', 'Americas', 43.5, -110.8, ARRAY['federal-reserve', 'interest-rates', 'monetary-policy', 'economy'], now() - interval '2 hours', 'https://www.bloomberg.com/'),
  ('00000000-0000-0000-0003-000000000002', 'seed-news-002', 'news', 'BRICS Expansion: New Members Invited', 'BRICS summit concludes with invitation to five additional nations. Geopolitical shift toward multipolar economic framework accelerates.', 'moderate', 'ZA', 'Africa', -25.7, 28.2, ARRAY['brics', 'geopolitics', 'multipolar', 'trade'], now() - interval '12 hours', 'https://www.reuters.com/world/'),
  ('00000000-0000-0000-0003-000000000003', 'seed-news-003', 'news', 'EU Approves New Sanctions Package on Russia', 'European Union agrees on 14th sanctions package targeting energy sector, banks, and dual-use goods. Russia vows countermeasures.', 'moderate', 'RU', 'Europe', 55.8, 37.6, ARRAY['sanctions', 'eu', 'russia', 'energy', 'economy'], now() - interval '8 hours', 'https://www.euractiv.com/'),
  ('00000000-0000-0000-0003-000000000004', 'seed-news-004', 'news', 'Taiwan Strait: US Carrier Group Transit', 'USS Ronald Reagan carrier strike group conducts routine transit through Taiwan Strait. China PLA condemns as "provocative."', 'moderate', 'TW', 'Asia', 24.0, 120.5, ARRAY['taiwan', 'us-navy', 'south-china-sea', 'carrier'], now() - interval '6 hours', null),
  ('00000000-0000-0000-0003-000000000005', 'seed-news-005', 'news', 'North Korea Launches Ballistic Missile Test', 'DPRK fires intermediate-range ballistic missile toward Sea of Japan. Japan issues J-Alert. UN Security Council emergency session called.', 'high', 'KP', 'Asia', 40.3, 127.5, ARRAY['north-korea', 'ballistic-missile', 'nuclear', 'un-security-council'], now() - interval '1 hour', 'https://www.38north.org/'),
  ('00000000-0000-0000-0003-000000000006', 'seed-news-006', 'news', 'Iran Nuclear Programme: IAEA Findings', 'IAEA report indicates Iran has enriched uranium to 84% purity. Heightened concerns from P5+1. Diplomatic negotiations deadlocked.', 'high', 'IR', 'Middle East', 35.7, 51.4, ARRAY['iran', 'nuclear', 'iaea', 'enrichment', 'sanctions'], now() - interval '3 hours', 'https://www.iaea.org/'),
  ('00000000-0000-0000-0003-000000000007', 'seed-news-007', 'news', 'Venezuela: Opposition Leader Arrested', 'Venezuelan authorities arrest key opposition figure ahead of elections. International community condemns move. Protests erupt in Caracas.', 'high', 'VE', 'Americas', 10.5, -66.9, ARRAY['venezuela', 'maduro', 'opposition', 'elections', 'human-rights'], now() - interval '5 hours', null),
  ('00000000-0000-0000-0003-000000000008', 'seed-news-008', 'news', 'Pakistan-India Border Incident', 'Cross-border skirmish reported along Line of Control in Kashmir. Both sides exchange artillery fire. Diplomatic channels activated.', 'high', 'PK', 'Asia', 33.6, 74.0, ARRAY['pakistan', 'india', 'kashmir', 'loc', 'border'], now() - interval '7 hours', null)
ON CONFLICT (id) DO NOTHING;

-- Political/economic events
INSERT INTO public.global_events (id, external_id, type, title, summary, severity, country_id, region, lat, lng, tags, occurred_at) VALUES
  ('00000000-0000-0000-0005-000000000001', 'seed-political-001', 'political', 'Turkey: Currency Crisis Deepens', 'Turkish lira hits new historic low against USD. Central bank emergency measures insufficient. IMF consultation discussions begin.', 'high', 'TR', 'Europe', 39.0, 35.2, ARRAY['turkey', 'lira', 'currency-crisis', 'inflation', 'imf'], now() - interval '3 hours'),
  ('00000000-0000-0000-0005-000000000002', 'seed-market-001', 'market', 'Oil Markets: OPEC+ Production Cut Extension', 'OPEC+ agrees to extend voluntary production cuts through Q2. Saudi Arabia leads coalition. WTI crude rises 3.2%.', 'moderate', 'SA', 'Middle East', 24.7, 46.7, ARRAY['opec', 'oil', 'production-cut', 'energy', 'commodity'], now() - interval '4 hours'),
  ('00000000-0000-0000-0005-000000000003', 'seed-political-002', 'political', 'Mexico: Cartel Violence Escalates in Sinaloa', 'Intra-cartel conflict between Sinaloa factions results in 40+ casualties. Mexican army deploys additional forces.', 'high', 'MX', 'Americas', 24.8, -107.4, ARRAY['mexico', 'sinaloa', 'cartel', 'violence', 'security'], now() - interval '10 hours'),
  ('00000000-0000-0000-0005-000000000004', 'seed-market-002', 'market', 'Bitcoin ETF Inflows Hit New Record', 'Spot Bitcoin ETF daily inflows reach $1.2B. BTC approaches resistance level at $72k. Institutional adoption accelerating.', 'low', 'US', 'Americas', 37.1, -95.7, ARRAY['bitcoin', 'etf', 'institutional', 'crypto', 'sec'], now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

-- Conflict zones
WITH seed_src AS (SELECT id FROM public.data_sources WHERE slug = 'demo' LIMIT 1)
INSERT INTO public.conflict_zones (event_id, name, conflict_type, parties, active, intensity, casualties_estimate, start_date) VALUES
  ('00000000-0000-0000-0001-000000000001', 'Russo-Ukrainian War', 'armed_conflict', ARRAY['Russia', 'Ukraine'], true, 9, 500000, '2022-02-24'),
  ('00000000-0000-0000-0001-000000000002', 'Gaza Conflict', 'armed_conflict', ARRAY['Israel', 'Hamas', 'Palestinian Islamic Jihad'], true, 9, 40000, '2023-10-07'),
  ('00000000-0000-0000-0001-000000000003', 'Sudan Civil War', 'civil_unrest', ARRAY['Sudanese Armed Forces', 'Rapid Support Forces'], true, 8, 15000, '2023-04-15'),
  ('00000000-0000-0000-0001-000000000004', 'Myanmar Civil Conflict', 'civil_unrest', ARRAY['Tatmadaw', 'People Defence Force', 'TNLA', 'MNDAA', 'AA'], true, 7, 5000, '2021-02-01'),
  ('00000000-0000-0000-0001-000000000005', 'South China Sea Dispute', 'border_dispute', ARRAY['China', 'Philippines', 'Vietnam', 'Taiwan'], true, 4, 0, '2012-01-01'),
  ('00000000-0000-0000-0001-000000000006', 'Yemen War', 'armed_conflict', ARRAY['Houthi Movement', 'Saudi-led Coalition', 'Yemeni Government'], true, 7, 150000, '2015-03-26'),
  ('00000000-0000-0000-0001-000000000008', 'Lebanon-Israel Conflict', 'armed_conflict', ARRAY['Hezbollah', 'Israel Defense Forces'], true, 6, 200, '2023-10-08')
ON CONFLICT DO NOTHING;

-- Conflict updates
INSERT INTO public.conflict_updates (conflict_id, title, body, severity, occurred_at)
SELECT
  cz.id,
  updates.title,
  updates.body,
  updates.severity::severity_level,
  updates.occurred_at
FROM public.conflict_zones cz
JOIN (VALUES
  ('Russo-Ukrainian War', 'Artillery Exchange Near Chasiv Yar', 'Heavy artillery exchanges reported along the T0504 highway. Ukrainian forces maintain defensive positions.', 'high', now() - interval '2 hours'),
  ('Russo-Ukrainian War', 'Drone Strike on Odesa Port Infrastructure', 'Russian Shahed drones targeted port facilities. Ukrainian air defense intercepted majority of drones.', 'critical', now() - interval '8 hours'),
  ('Russo-Ukrainian War', 'Diplomatic Meeting in Geneva', 'Senior officials from EU and Ukraine discuss reconstruction funding framework.', 'low', now() - interval '1 day'),
  ('Gaza Conflict', 'Ceasefire Talks Resume in Cairo', 'Qatari and Egyptian mediators facilitate talks. Hostage deal framework discussed.', 'high', now() - interval '3 hours'),
  ('Gaza Conflict', 'UNRWA Reports Critical Food Shortage', 'UN agency warns of imminent famine in northern Gaza. Aid convoy access blocked.', 'critical', now() - interval '6 hours'),
  ('Sudan Civil War', 'RSF Takes Control of Key District in Omdurman', 'Rapid Support Forces advance through residential areas. 50,000+ civilians displaced.', 'critical', now() - interval '4 hours'),
  ('Yemen War', 'Houthi Anti-Ship Missile Targets Greek Tanker', 'MV Pacific Success struck by anti-ship ballistic missile in Gulf of Aden. Crew evacuated.', 'critical', now() - interval '1 hour'),
  ('Yemen War', 'US-UK Coalition Strikes Houthi Missile Sites', 'Coalition forces conduct precision strikes on missile storage facilities in Hodeidah province.', 'high', now() - interval '5 hours')
) AS updates(conflict_name, title, body, severity, occurred_at) ON cz.name = updates.conflict_name
ON CONFLICT DO NOTHING;

-- Weather events
INSERT INTO public.weather_events (event_id, weather_type, magnitude, valid_from, valid_until) VALUES
  ('00000000-0000-0000-0002-000000000001', 'typhoon', 120.5, now() - interval '1 hour', now() + interval '48 hours'),
  ('00000000-0000-0000-0002-000000000002', 'earthquake', 6.4, now() - interval '30 minutes', now() + interval '24 hours'),
  ('00000000-0000-0000-0002-000000000003', 'heatwave', 46.2, now() - interval '6 hours', now() + interval '72 hours'),
  ('00000000-0000-0000-0004-000000000001', 'flood', null, now() - interval '4 hours', now() + interval '7 days')
ON CONFLICT DO NOTHING;

-- News articles
INSERT INTO public.news_articles (event_id, headline, source_name, source_url, topics, published_at) VALUES
  ('00000000-0000-0000-0003-000000000001', 'Fed Chair Hints at Pivot: What It Means for Global Markets', 'Bloomberg', 'https://www.bloomberg.com/news/fed-signals-rate-decision', ARRAY['economy', 'monetary-policy', 'markets'], now() - interval '2 hours'),
  ('00000000-0000-0000-0003-000000000002', 'BRICS Invites Saudi Arabia, UAE, Iran and Others to Join Bloc', 'Reuters', 'https://www.reuters.com/world/brics-expansion-2024', ARRAY['geopolitics', 'trade', 'multilateralism'], now() - interval '12 hours'),
  ('00000000-0000-0000-0003-000000000005', 'North Korea Fires Ballistic Missile, Japan Issues Alert', 'NHK World', 'https://www3.nhk.or.jp/nhkworld/en/news/missile-test', ARRAY['north-korea', 'nuclear', 'security'], now() - interval '1 hour'),
  ('00000000-0000-0000-0003-000000000006', 'IAEA: Iran Enriching Uranium to Near-Weapons Grade', 'Reuters', 'https://www.reuters.com/world/middle-east/iaea-iran', ARRAY['nuclear', 'iran', 'diplomacy'], now() - interval '3 hours')
ON CONFLICT DO NOTHING;

-- Market signals
INSERT INTO public.market_signals (event_id, asset_id, signal_type, impact, magnitude, rationale)
SELECT
  '00000000-0000-0000-0005-000000000002',
  ma.id,
  'geopolitical',
  'bullish',
  6,
  'OPEC+ production cut extension reduces supply, pushing crude prices higher. Geopolitical premium from Middle East tensions adds additional upward pressure.'
FROM public.market_assets ma WHERE ma.symbol IN ('OIL_WTI', 'OIL_BRENT')
ON CONFLICT DO NOTHING;

-- AI Briefings
INSERT INTO public.ai_briefings (type, title, executive_summary, full_content, model_used, region, tags, is_published, briefing_date) VALUES
(
  'daily',
  'Global Situational Briefing — ' || to_char(CURRENT_DATE, 'DD Mon YYYY'),
  'Three active high-intensity conflicts dominate today''s threat picture: the Russo-Ukrainian war continues with significant frontline activity in Donetsk; Gaza ceasefire negotiations remain deadlocked; Sudan''s civil war intensifies in Khartoum. Maritime security in the Red Sea is severely degraded due to Houthi anti-shipping operations. North Korea''s ballistic missile test demands immediate diplomatic attention. Weather monitoring indicates Typhoon tracking toward the Philippines within 48 hours.',
  E'## World Situation Assessment\n\n### Critical Developments (Last 24h)\n\n**1. Eastern Europe — Russo-Ukrainian War**\nFrontline combat operations persist across a 1,000km front. Russian forces applying pressure near Chasiv Yar while Ukrainian forces conduct drone strikes on rear logistics. EU sanctions package 14 approved. Peace negotiations remain frozen.\n\n**2. Middle East — Gaza & Lebanon**\nGaza ceasefire talks continue in Cairo under Qatari/Egyptian mediation. Humanitarian situation described as "catastrophic" by UNRWA. Simultaneous Hezbollah-Israel cross-border exchanges continue along Lebanese Blue Line.\n\n**3. Red Sea — Maritime Security Crisis**\nHouthi (Ansar Allah) anti-ship missile attack struck MV Pacific Success in Gulf of Aden. US-UK coalition conducted retaliatory strikes on missile storage sites. Red Sea trade route disruption cost estimated at $6B/month in rerouting.\n\n**4. Northeast Asia — DPRK**\nNorth Korea''s ballistic missile test is the 8th this year. UN Security Council emergency session called. Japan and South Korea activate enhanced monitoring protocols.\n\n### Risk Radar\n- **ELEVATED**: Taiwan Strait following US carrier transit\n- **ELEVATED**: Iran nuclear program / IAEA findings\n- **MONITORING**: Pakistan-India LoC skirmish\n- **MONITORING**: Turkey currency stability\n\n### Economic Signals\n- WTI crude +3.2% following OPEC+ extension\n- Turkish lira at historic lows\n- Bitcoin ETF inflows at record $1.2B/day\n- Fed rate signals moderately positive for risk assets',
  'gpt-4o',
  'Global',
  ARRAY['daily-briefing', 'geopolitics', 'security', 'markets'],
  true,
  CURRENT_DATE
),
(
  'regional',
  'Middle East Intelligence Briefing',
  'Regional security environment remains highly volatile. Gaza conflict driving humanitarian crisis. Red Sea shipping disruption continues. Iran nuclear programme advancing. Saudi-led coalition and Houthis in active conflict in Yemen.',
  E'## Middle East Regional Assessment\n\n### Active Conflicts\n1. **Gaza Strip** — High intensity urban warfare\n2. **Lebanon-Israel Border** — Cross-border exchanges daily\n3. **Yemen** — Ongoing civil war + Red Sea operations\n\n### Economic Impact\n- Red Sea shipping rerouting adds 10-14 days to Europe-Asia routes\n- Suez Canal transits down 45% vs. pre-conflict\n- Oil infrastructure risk premium elevated\n\n### Key Actors to Watch\n- Iran: Proxy network activation\n- Saudi Arabia: Mediation role vs. defense posture\n- Qatar: Mediation role in Gaza talks\n- Egypt: Security corridor discussions',
  'gpt-4o',
  'Middle East',
  ARRAY['middle-east', 'regional', 'security'],
  true,
  CURRENT_DATE
),
(
  'market',
  'Market Intelligence: Energy & Crypto Brief',
  'Energy markets elevated on OPEC+ extension and geopolitical risk premium. Red Sea disruptions impacting LNG spot pricing. Crypto markets bullish on institutional ETF flows. DXY strength pressuring emerging market currencies.',
  E'## Market Intelligence Brief\n\n### Energy\n- **WTI Crude**: +3.2% on OPEC+ extension\n- **Brent**: Trading at $89 premium level\n- **Natural Gas**: European TTF elevated on supply concerns\n- **Red Sea Impact**: LNG spot market pricing in rerouting costs\n\n### Cryptocurrencies\n- **Bitcoin**: Strong institutional buying via ETF channels\n- **Ethereum**: Staking yields attracting institutional allocation\n- **Regulatory**: EU MiCA implementation progressing — positive for compliance clarity\n\n### FX Markets\n- **USD/TRY**: Historic highs — central bank credibility crisis\n- **USD/RUB**: Sanctions pressure + capital controls limiting movement\n- **USD/UAH**: Wartime controls maintain artificial stability\n\n### Commodities\n- **Gold**: Safe-haven demand elevated amid geopolitical tensions\n- **Wheat**: Ukraine corridor disruptions support prices\n\n*This briefing is for informational purposes only and does not constitute financial advice.*',
  'gpt-4o',
  null,
  ARRAY['markets', 'energy', 'crypto', 'currency'],
  true,
  CURRENT_DATE
);

-- Seed regions
INSERT INTO public.regions (id, name, lat, lng, country_ids) VALUES
  ('middle-east', 'Middle East', 28.5, 44.0, ARRAY['IR', 'IQ', 'SY', 'IL', 'PS', 'SA', 'YE', 'TR']),
  ('europe', 'Europe', 50.0, 15.0, ARRAY['UA', 'RU', 'DE', 'FR', 'GB']),
  ('east-asia', 'East Asia', 35.0, 115.0, ARRAY['CN', 'JP', 'KR', 'KP', 'TW']),
  ('south-asia', 'South Asia', 25.0, 78.0, ARRAY['IN', 'PK', 'AF', 'BD']),
  ('africa', 'Africa', 5.0, 20.0, ARRAY['SD', 'ET', 'NG', 'SO', 'ML', 'LY']),
  ('americas', 'Americas', 10.0, -80.0, ARRAY['US', 'CA', 'MX', 'BR', 'VE']),
  ('southeast-asia', 'Southeast Asia', 5.0, 110.0, ARRAY['MM', 'PH', 'TH', 'VN', 'ID'])
ON CONFLICT (id) DO NOTHING;

-- Airports (major hubs)
INSERT INTO public.airports (iata, name, city, country_id, lat, lng, is_major) VALUES
  ('JFK', 'John F. Kennedy International', 'New York', 'US', 40.64, -73.78, true),
  ('LHR', 'Heathrow Airport', 'London', 'GB', 51.48, -0.46, true),
  ('CDG', 'Charles de Gaulle Airport', 'Paris', 'FR', 49.01, 2.55, true),
  ('FRA', 'Frankfurt Airport', 'Frankfurt', 'DE', 50.04, 8.56, true),
  ('DXB', 'Dubai International Airport', 'Dubai', 'AE', 25.25, 55.36, true),
  ('SIN', 'Changi Airport', 'Singapore', 'SG', 1.36, 103.99, true),
  ('HKG', 'Hong Kong International', 'Hong Kong', 'CN', 22.31, 113.91, true),
  ('NRT', 'Narita International', 'Tokyo', 'JP', 35.77, 140.39, true),
  ('ICN', 'Incheon International', 'Seoul', 'KR', 37.45, 126.45, true),
  ('PEK', 'Beijing Capital International', 'Beijing', 'CN', 40.08, 116.59, true)
ON CONFLICT (iata) DO NOTHING;

-- Major ports
INSERT INTO public.ports (name, country_id, lat, lng, is_chokepoint, annual_teu) VALUES
  ('Port of Shanghai', 'CN', 31.32, 121.67, false, 47300000),
  ('Port of Singapore', 'SG', 1.26, 103.82, true, 37200000),
  ('Port of Rotterdam', 'NL', 51.93, 4.14, false, 14800000),
  ('Suez Canal (Northern Entry)', 'EG', 31.26, 32.32, true, null),
  ('Strait of Hormuz (Passage)', 'IR', 26.60, 56.25, true, null),
  ('Strait of Malacca (Passage)', 'MY', 2.38, 101.96, true, null),
  ('Port of Jebel Ali', 'AE', 24.98, 55.06, false, 14000000),
  ('Port of Busan', 'KR', 35.10, 129.04, false, 22000000),
  ('Port of Los Angeles', 'US', 33.74, -118.27, false, 9300000),
  ('Port of Tianjin', 'CN', 38.99, 117.73, false, 21600000)
ON CONFLICT DO NOTHING;
