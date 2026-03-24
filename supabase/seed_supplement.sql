-- ============================================================
-- OBSERVE — Supplemental seed data
-- Adds: flights, vessels, more events, news articles, price ticks
-- Safe to re-run (uses ON CONFLICT DO NOTHING)
-- ============================================================

-- ============================================================
-- FLIGHT TRACKS (20 realistic international flights)
-- ============================================================
INSERT INTO public.flight_tracks (id, callsign, icao24, lat, lng, altitude_ft, speed_kts, heading, on_ground, track_at)
VALUES
  ('ft000001-0000-0000-0000-000000000001', 'UAL1', 'a4d251', 40.6413, -73.7781, 35000, 480, 45, false, NOW() - INTERVAL '2 minutes'),
  ('ft000001-0000-0000-0000-000000000002', 'BAW172', '400cb6', 51.4775, -0.4614, 38000, 520, 270, false, NOW() - INTERVAL '3 minutes'),
  ('ft000001-0000-0000-0000-000000000003', 'DLH441', '3c4b26', 48.3537, 11.7860, 33000, 490, 180, false, NOW() - INTERVAL '1 minute'),
  ('ft000001-0000-0000-0000-000000000004', 'AFR22', '39b415', 49.0097, 2.5479, 37000, 510, 220, false, NOW() - INTERVAL '5 minutes'),
  ('ft000001-0000-0000-0000-000000000005', 'SIA321', '76ced6', 1.3521, 103.8198, 0, 0, 0, true, NOW() - INTERVAL '10 minutes'),
  ('ft000001-0000-0000-0000-000000000006', 'THA920', 'e0890b', 13.6811, 100.7470, 36000, 475, 310, false, NOW() - INTERVAL '4 minutes'),
  ('ft000001-0000-0000-0000-000000000007', 'ETH613', '040193', 8.9779, 38.7993, 32000, 460, 10, false, NOW() - INTERVAL '6 minutes'),
  ('ft000001-0000-0000-0000-000000000008', 'EK225', '896188', 25.2532, 55.3657, 0, 0, 0, true, NOW() - INTERVAL '15 minutes'),
  ('ft000001-0000-0000-0000-000000000009', 'QFA11', '7c6b2c', -33.9399, 151.1753, 39000, 500, 330, false, NOW() - INTERVAL '2 minutes'),
  ('ft000001-0000-0000-0000-000000000010', 'ANA8', '86811e', 35.5494, 139.7798, 0, 0, 0, true, NOW() - INTERVAL '8 minutes'),
  ('ft000001-0000-0000-0000-000000000011', 'AAL100', 'a00001', 33.9425, -118.4081, 41000, 520, 60, false, NOW() - INTERVAL '3 minutes'),
  ('ft000001-0000-0000-0000-000000000012', 'UAE412', '896001', 24.4330, 54.6511, 35000, 485, 315, false, NOW() - INTERVAL '7 minutes'),
  ('ft000001-0000-0000-0000-000000000013', 'KAL902', '71bc5e', 37.4602, 126.4407, 37000, 495, 50, false, NOW() - INTERVAL '4 minutes'),
  ('ft000001-0000-0000-0000-000000000014', 'TAM8020', 'e488cb', -23.4356, -46.4731, 36000, 470, 200, false, NOW() - INTERVAL '9 minutes'),
  ('ft000001-0000-0000-0000-000000000015', 'CSN3101', '7806d3', 23.3924, 113.2988, 33000, 465, 20, false, NOW() - INTERVAL '5 minutes'),
  ('ft000001-0000-0000-0000-000000000016', 'SVA35', '710082', 24.9578, 46.6989, 38000, 510, 275, false, NOW() - INTERVAL '6 minutes'),
  ('ft000001-0000-0000-0000-000000000017', 'MEA201', '2e0001', 33.8209, 35.4884, 28000, 420, 90, false, NOW() - INTERVAL '2 minutes'),
  ('ft000001-0000-0000-0000-000000000018', 'TUR1983', '4ba411', 40.9828, 28.8108, 0, 0, 0, true, NOW() - INTERVAL '20 minutes'),
  ('ft000001-0000-0000-0000-000000000019', 'IBE6841', '340001', 40.4983, -3.5676, 35000, 480, 250, false, NOW() - INTERVAL '3 minutes'),
  ('ft000001-0000-0000-0000-000000000020', 'PIA786', '760001', 33.5607, 73.1019, 31000, 440, 340, false, NOW() - INTERVAL '11 minutes')
ON CONFLICT (icao24) DO UPDATE SET
  lat = EXCLUDED.lat, lng = EXCLUDED.lng, altitude_ft = EXCLUDED.altitude_ft,
  speed_kts = EXCLUDED.speed_kts, heading = EXCLUDED.heading,
  on_ground = EXCLUDED.on_ground, track_at = EXCLUDED.track_at;

-- ============================================================
-- VESSELS (20 realistic maritime vessels)
-- ============================================================
INSERT INTO public.vessels (id, mmsi, name, vessel_type, flag, lat, lng, speed_kts, heading, destination, cargo_type, is_tanker, track_at)
VALUES
  ('vs000001-0000-0000-0000-000000000001', '123456789', 'EVER GIVEN', 'container', 'PA', 30.5852, 32.2654, 8.5, 160, 'PORT SAID', 'GENERAL', false, NOW() - INTERVAL '5 minutes'),
  ('vs000001-0000-0000-0000-000000000002', '234567890', 'MAERSK ESSEN', 'container', 'DK', 1.2655, 103.7577, 12.2, 270, 'SINGAPORE', 'GENERAL', false, NOW() - INTERVAL '3 minutes'),
  ('vs000001-0000-0000-0000-000000000003', '345678901', 'GULF PIONEER', 'tanker', 'SA', 26.9124, 50.6197, 10.1, 45, 'DAMMAM', 'CRUDE OIL', true, NOW() - INTERVAL '7 minutes'),
  ('vs000001-0000-0000-0000-000000000004', '456789012', 'ARCTIC AURORA', 'tanker', 'NO', 69.6489, 18.9551, 7.3, 220, 'TROMSO', 'LNG', true, NOW() - INTERVAL '4 minutes'),
  ('vs000001-0000-0000-0000-000000000005', '567890123', 'COSCO SHIPPING', 'container', 'CN', 22.3193, 114.1694, 14.0, 90, 'HONG KONG', 'ELECTRONICS', false, NOW() - INTERVAL '2 minutes'),
  ('vs000001-0000-0000-0000-000000000006', '678901234', 'MSC OSCAR', 'container', 'PA', 51.9535, 4.1342, 6.2, 315, 'ROTTERDAM', 'GENERAL', false, NOW() - INTERVAL '10 minutes'),
  ('vs000001-0000-0000-0000-000000000007', '789012345', 'ATLANTIC TRADER', 'cargo', 'LR', 14.6937, -17.4441, 9.8, 180, 'DAKAR', 'GRAIN', false, NOW() - INTERVAL '6 minutes'),
  ('vs000001-0000-0000-0000-000000000008', '890123456', 'BLACK SEA STAR', 'tanker', 'GR', 43.0000, 33.0000, 5.5, 270, 'ODESSA', 'FUEL OIL', true, NOW() - INTERVAL '8 minutes'),
  ('vs000001-0000-0000-0000-000000000009', '901234567', 'HORMUZ SPIRIT', 'tanker', 'IR', 26.5000, 56.2500, 8.0, 60, 'BANDAR ABBAS', 'CRUDE OIL', true, NOW() - INTERVAL '12 minutes'),
  ('vs000001-0000-0000-0000-000000000010', '012345678', 'SUEZ TRADER', 'cargo', 'EG', 29.9668, 32.5498, 7.1, 330, 'SUEZ', 'MIXED CARGO', false, NOW() - INTERVAL '5 minutes'),
  ('vs000001-0000-0000-0000-000000000011', '112345678', 'PACIFIC VISION', 'container', 'JP', 35.4437, 139.6380, 0, 0, 'YOKOHAMA', 'GENERAL', false, NOW() - INTERVAL '15 minutes'),
  ('vs000001-0000-0000-0000-000000000012', '212345678', 'BOSPHORUS BLUE', 'tanker', 'TR', 41.0082, 28.9784, 4.2, 0, 'ISTANBUL', 'NAPHTHA', true, NOW() - INTERVAL '9 minutes'),
  ('vs000001-0000-0000-0000-000000000013', '312345678', 'BALTIC EXPRESS', 'cargo', 'FI', 60.1699, 24.9384, 10.5, 45, 'HELSINKI', 'TIMBER', false, NOW() - INTERVAL '3 minutes'),
  ('vs000001-0000-0000-0000-000000000014', '412345678', 'CAPE CONDOR', 'bulk_carrier', 'BR', -33.9249, 18.4241, 11.2, 90, 'CAPE TOWN', 'IRON ORE', false, NOW() - INTERVAL '6 minutes'),
  ('vs000001-0000-0000-0000-000000000015', '512345678', 'INDIA STAR', 'container', 'IN', 18.9400, 72.8350, 0, 0, 'MUMBAI', 'TEXTILES', false, NOW() - INTERVAL '20 minutes'),
  ('vs000001-0000-0000-0000-000000000016', '612345678', 'AMAZON QUEEN', 'cargo', 'BR', -3.1190, -60.0217, 8.8, 270, 'MANAUS', 'AGRICULTURAL', false, NOW() - INTERVAL '4 minutes'),
  ('vs000001-0000-0000-0000-000000000017', '712345678', 'RED SEA PEARL', 'tanker', 'SA', 20.0000, 38.5000, 9.5, 330, 'JEDDAH', 'REFINED', true, NOW() - INTERVAL '7 minutes'),
  ('vs000001-0000-0000-0000-000000000018', '812345678', 'UKRAINE HOPE', 'cargo', 'UA', 46.4774, 30.7326, 6.3, 180, 'ODESSA', 'WHEAT', false, NOW() - INTERVAL '11 minutes'),
  ('vs000001-0000-0000-0000-000000000019', '912345678', 'MALACCA PRINCE', 'tanker', 'SG', 2.0000, 103.5000, 11.8, 315, 'SINGAPORE', 'CRUDE OIL', true, NOW() - INTERVAL '5 minutes'),
  ('vs000001-0000-0000-0000-000000000020', '102345678', 'NORTH ATLANTIC', 'container', 'GB', 53.8008, -3.0501, 13.5, 270, 'LIVERPOOL', 'CONSUMER GOODS', false, NOW() - INTERVAL '8 minutes')
ON CONFLICT (mmsi) DO UPDATE SET
  lat = EXCLUDED.lat, lng = EXCLUDED.lng, speed_kts = EXCLUDED.speed_kts,
  heading = EXCLUDED.heading, destination = EXCLUDED.destination, track_at = EXCLUDED.track_at;

-- ============================================================
-- MORE GLOBAL EVENTS (humanitarian, political, additional)
-- ============================================================
INSERT INTO public.global_events (id, external_id, type, title, summary, severity, country_id, lat, lng, source_url, tags, is_active, occurred_at)
VALUES
  -- Humanitarian
  ('00000000-0000-0000-0002-000000000001', 'seed-hum-001', 'humanitarian', 'Sudan Displacement Crisis Reaches 8 Million', 'Ongoing conflict has displaced over 8 million people, creating one of Africa''s largest humanitarian emergencies.', 'critical', 'SD', 15.5007, 32.5599, NULL, ARRAY['displacement','sudan','crisis','UN'], true, NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0002-000000000002', 'seed-hum-002', 'humanitarian', 'Gaza Aid Corridor Partially Reopened', 'Limited humanitarian aid convoy reaches northern Gaza after 10-day blockade, international agencies warn of severe shortages.', 'critical', 'PS', 31.5085, 34.4660, NULL, ARRAY['gaza','aid','blockade','humanitarian'], true, NOW() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0002-000000000003', 'seed-hum-003', 'humanitarian', 'Myanmar Floods Displace 200,000 in Rakhine State', 'Monsoon flooding compounds existing displacement crisis, aid agencies struggle to access affected areas.', 'high', 'MM', 20.1667, 92.9000, NULL, ARRAY['myanmar','floods','displacement','monsoon'], true, NOW() - INTERVAL '12 hours'),
  ('00000000-0000-0000-0002-000000000004', 'seed-hum-004', 'humanitarian', 'Horn of Africa Food Security: 24M Face Acute Hunger', 'Extended drought and conflict continue to drive food insecurity across Ethiopia, Somalia, and Kenya.', 'high', 'ET', 9.1450, 40.4897, NULL, ARRAY['food security','drought','horn of africa','hunger'], true, NOW() - INTERVAL '18 hours'),

  -- Political
  ('00000000-0000-0000-0002-000000000005', 'seed-pol-001', 'political', 'Venezuela Opposition Leader Arrested Ahead of Elections', 'Government detains key opposition figure weeks before scheduled presidential election, sparking international condemnation.', 'high', 'VE', 10.4806, -66.9036, NULL, ARRAY['venezuela','election','opposition','detention'], true, NOW() - INTERVAL '4 hours'),
  ('00000000-0000-0000-0002-000000000006', 'seed-pol-002', 'political', 'Pakistan Military Extends Emergency Powers in Border Regions', 'Army granted expanded surveillance and detention authority in Khyber Pakhtunkhwa following militant attacks.', 'moderate', 'PK', 34.0151, 71.5805, NULL, ARRAY['pakistan','military','emergency','border'], true, NOW() - INTERVAL '8 hours'),
  ('00000000-0000-0000-0002-000000000007', 'seed-pol-003', 'political', 'EU Parliament Debates Emergency Ukraine Aid Package', 'Heated debate over €50B multi-year aid framework as some member states demand tighter conditions.', 'moderate', 'UA', 48.3794, 31.1656, NULL, ARRAY['ukraine','EU','aid','parliament'], true, NOW() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0002-000000000008', 'seed-pol-004', 'political', 'Bolivia Political Crisis: Congress Blocks Presidential Decree', 'Constitutional standoff escalates as opposition-controlled congress challenges executive emergency declaration.', 'moderate', 'BO', -16.2902, -63.5887, NULL, ARRAY['bolivia','congress','political crisis','decree'], true, NOW() - INTERVAL '10 hours'),
  ('00000000-0000-0000-0002-000000000009', 'seed-pol-005', 'political', 'Taiwan Strait: PLA Conducts Live-Fire Exercises Near Median Line', 'China''s military announces 48-hour naval drill zone covering key shipping lanes, Taiwan raises alert.', 'high', 'TW', 23.6978, 120.9605, NULL, ARRAY['taiwan','PLA','military drill','strait'], true, NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0002-000000000010', 'seed-pol-006', 'political', 'Niger Junta Expels French Military Contingent', 'Transitional government orders withdrawal of remaining 1,500 French troops within 30 days.', 'moderate', 'NE', 17.6078, 8.0817, NULL, ARRAY['niger','france','military','junta'], true, NOW() - INTERVAL '14 hours'),

  -- Market events
  ('00000000-0000-0000-0002-000000000011', 'seed-mkt-001', 'market', 'Brent Crude Surges 4.2% on Red Sea Shipping Disruption', 'Oil prices spike as insurance costs rise and tankers reroute around Cape of Good Hope, adding 10+ days to transit.', 'high', 'SA', 25.0, 55.0, NULL, ARRAY['oil','shipping','red sea','commodities'], true, NOW() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0002-000000000012', 'seed-mkt-002', 'market', 'Ukrainian Grain Corridor Suspension Rattles Wheat Markets', 'Black Sea grain initiative suspended after Russian withdrawal, wheat futures jump 8% at Chicago Board of Trade.', 'high', 'UA', 46.0, 32.0, NULL, ARRAY['grain','wheat','ukraine','food prices'], true, NOW() - INTERVAL '7 hours'),
  ('00000000-0000-0000-0002-000000000013', 'seed-mkt-003', 'market', 'Taiwan Strait Tensions Spike Semiconductor Index Volatility', 'TSMC ADR falls 3.1% amid military exercises; analysts warn of supply chain fragility for advanced chips.', 'moderate', 'TW', 25.0330, 121.5654, NULL, ARRAY['semiconductors','taiwan','supply chain','tech'], true, NOW() - INTERVAL '4 hours'),
  ('00000000-0000-0000-0002-000000000014', 'seed-mkt-004', 'market', 'Sanctions Pressure Russian Ruble to 6-Month Low', 'New G7 secondary sanctions target Russian energy exporters; ruble weakens to 92.4 per dollar.', 'moderate', 'RU', 55.7558, 37.6173, NULL, ARRAY['russia','sanctions','ruble','currency'], true, NOW() - INTERVAL '9 hours'),

  -- Additional conflicts
  ('00000000-0000-0000-0002-000000000015', 'seed-con-009', 'conflict', 'Myanmar Junta Airstrikes on Chin State Villages', 'Military aircraft strikes residential areas in Hakha township; resistance forces report 23 civilian casualties.', 'critical', 'MM', 22.6000, 93.5700, NULL, ARRAY['myanmar','airstrike','civilian','junta'], true, NOW() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0002-000000000016', 'seed-con-010', 'conflict', 'Somalia: Al-Shabaab Attacks Mogadishu Government Complex', 'Suicide bombing at Ministry of Interior kills 14, injures 30. AMISOM forces secure perimeter.', 'critical', 'SO', 2.0469, 45.3182, NULL, ARRAY['somalia','al-shabaab','terrorism','mogadishu'], true, NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0002-000000000017', 'seed-con-011', 'conflict', 'Nagorno-Karabakh: Ceasefire Holds After Week of Skirmishes', 'OSCE monitoring mission reports 12 incidents but no major escalation; Azerbaijan denies incursion claims.', 'moderate', 'AZ', 40.1811, 47.1467, NULL, ARRAY['nagorno-karabakh','ceasefire','azerbaijan','armenia'], true, NOW() - INTERVAL '10 hours'),
  ('00000000-0000-0000-0002-000000000018', 'seed-con-012', 'conflict', 'Burkina Faso: 200 Killed in Jihadist Attack on Convoy', 'Largest single attack since 2015; military convoy ambushed on Sahel supply route, fuel depot destroyed.', 'critical', 'BF', 12.3641, -1.5330, NULL, ARRAY['burkina faso','jihadist','sahel','attack'], true, NOW() - INTERVAL '8 hours'),

  -- Additional weather
  ('00000000-0000-0000-0002-000000000019', 'seed-wx-005', 'weather', 'Typhoon Mawar Strengthens to Category 5 Near Philippines', 'Typhoon reaching 165mph sustained winds approaches Luzon; 1.2M evacuation orders issued.', 'critical', 'PH', 15.8700, 120.8800, NULL, ARRAY['typhoon','philippines','category 5','evacuation'], true, NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0002-000000000020', 'seed-wx-006', 'weather', 'Iran Earthquake M6.2 Strikes Kermanshah Province', 'Moderate quake damages 800+ structures; 3 dead, 47 injured. Aftershock sequence ongoing.', 'moderate', 'IR', 34.3142, 46.4361, NULL, ARRAY['earthquake','iran','Kermanshah','aftershocks'], true, NOW() - INTERVAL '7 hours'),
  ('00000000-0000-0000-0002-000000000021', 'seed-wx-007', 'weather', 'Morocco Heatwave: 47°C Recorded in Marrakech Region', 'Record temperatures affecting agriculture and infrastructure; health authorities activate emergency plan.', 'high', 'MA', 31.6295, -7.9811, NULL, ARRAY['heatwave','morocco','temperature record','drought'], true, NOW() - INTERVAL '14 hours'),

  -- Additional news
  ('00000000-0000-0000-0002-000000000022', 'seed-news-009', 'news', 'NATO Summit: Article 5 Reaffirmed, Defense Spending Targets Raised', 'Allies commit to 2.5% GDP defense spending target; new force posture plan unveiled for eastern flank.', 'high', 'BE', 50.8503, 4.3517, NULL, ARRAY['NATO','defense','article 5','spending'], true, NOW() - INTERVAL '4 hours'),
  ('00000000-0000-0000-0002-000000000023', 'seed-news-010', 'news', 'UN Security Council Emergency Session on North Korea Missile Tests', 'DPRK launches ICBM-class missile landing in Japan''s EEZ; US calls emergency meeting.', 'high', 'KP', 40.3399, 127.5101, NULL, ARRAY['north korea','missile','ICBM','UN'], true, NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0002-000000000024', 'seed-news-011', 'news', 'Iran Nuclear Talks Collapse in Vienna After Enrichment Disclosure', 'IAEA inspectors denied access to Fordow site; US and EU threaten to reimpose snapback sanctions.', 'high', 'IR', 32.4279, 53.6880, NULL, ARRAY['iran','nuclear','IAEA','sanctions'], true, NOW() - INTERVAL '9 hours'),
  ('00000000-0000-0000-0002-000000000025', 'seed-news-012', 'news', 'China Imposes Export Controls on Critical Minerals Used in EVs', 'Beijing restricts gallium, germanium and graphite exports citing national security; markets react sharply.', 'moderate', 'CN', 35.8617, 104.1954, NULL, ARRAY['china','critical minerals','export controls','EV'], true, NOW() - INTERVAL '11 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NEWS ARTICLES (linked to news events)
-- ============================================================
INSERT INTO public.news_articles (id, event_id, headline, body, source_name, source_url, sentiment, topics, published_at)
VALUES
  ('na000001-0000-0000-0000-000000000001',
   (SELECT id FROM public.global_events WHERE external_id = 'seed-news-001' LIMIT 1),
   'Ukraine Repels Russian Advance Near Kharkiv in Heavy Fighting',
   'Ukrainian forces have successfully repelled a major Russian offensive near Kharkiv, according to military officials. The battle involved significant use of drone warfare on both sides.',
   'Reuters', 'https://reuters.com', -0.6, ARRAY['conflict','ukraine','military'], NOW() - INTERVAL '2 hours'),
  ('na000001-0000-0000-0000-000000000002',
   (SELECT id FROM public.global_events WHERE external_id = 'seed-news-002' LIMIT 1),
   'Gaza Ceasefire Talks Enter Critical Phase in Cairo',
   'Mediators from Egypt, Qatar and the US are pressing both parties to agree to a framework deal. Key sticking points remain over hostage releases and troop withdrawals.',
   'Al Jazeera', 'https://aljazeera.com', -0.4, ARRAY['israel','gaza','ceasefire','diplomacy'], NOW() - INTERVAL '4 hours'),
  ('na000001-0000-0000-0000-000000000003',
   (SELECT id FROM public.global_events WHERE external_id = 'seed-news-003' LIMIT 1),
   'China Announces Military Drills Around Taiwan for 48-Hour Period',
   'People''s Liberation Army announces comprehensive live-fire exercises in the Taiwan Strait, citing "provocations" from Taiwanese leadership.',
   'South China Morning Post', 'https://scmp.com', -0.5, ARRAY['china','taiwan','military','PLA'], NOW() - INTERVAL '1 hour'),
  ('na000001-0000-0000-0000-000000000004',
   (SELECT id FROM public.global_events WHERE external_id = 'seed-news-004' LIMIT 1),
   'Iran Nuclear Enrichment Reaches 84%: IAEA Report',
   'The International Atomic Energy Agency confirms Iran has enriched uranium to near-weapons grade level, raising alarms in Washington and Brussels.',
   'BBC News', 'https://bbc.com', -0.7, ARRAY['iran','nuclear','IAEA','weapons'], NOW() - INTERVAL '3 hours'),
  ('na000001-0000-0000-0000-000000000005',
   (SELECT id FROM public.global_events WHERE external_id = 'seed-news-009' LIMIT 1),
   'NATO Leaders Agree on Enhanced Forward Presence in Baltic States',
   'The alliance will pre-position heavy equipment and rotate battle groups in Estonia, Latvia, Lithuania and Poland as part of a revised deterrence posture.',
   'Financial Times', 'https://ft.com', -0.2, ARRAY['NATO','baltic','deterrence','russia'], NOW() - INTERVAL '5 hours'),
  ('na000001-0000-0000-0000-000000000006',
   (SELECT id FROM public.global_events WHERE external_id = 'seed-news-010' LIMIT 1),
   'Japan Scrambles Jets as North Korean ICBM Crosses EEZ',
   'Japan''s Self-Defense Forces scrambled F-35s as an intercontinental ballistic missile splashed down within Japan''s exclusive economic zone, the closest such test in years.',
   'Nikkei Asia', 'https://asia.nikkei.com', -0.8, ARRAY['north korea','japan','missile','defense'], NOW() - INTERVAL '7 hours')
ON CONFLICT (source_url) DO NOTHING;

-- ============================================================
-- PRICE TICKS (current snapshot for market assets)
-- ============================================================
INSERT INTO public.price_ticks (id, asset_id, price, change_24h, change_pct, volume_24h, market_cap, tick_at)
SELECT
  gen_random_uuid(),
  id,
  CASE symbol
    WHEN 'BTC'     THEN 67420.00
    WHEN 'ETH'     THEN 3812.50
    WHEN 'XRP'     THEN 0.5820
    WHEN 'SOL'     THEN 175.30
    WHEN 'USDT'    THEN 1.0000
    WHEN 'BNB'     THEN 412.80
    WHEN 'USD/EUR' THEN 0.9182
    WHEN 'USD/GBP' THEN 0.7841
    WHEN 'USD/JPY' THEN 149.82
    WHEN 'USD/CNY' THEN 7.2431
    WHEN 'USD/RUB' THEN 89.45
    WHEN 'USD/TRY' THEN 32.15
    WHEN 'GOLD'    THEN 2341.50
    WHEN 'OIL_WTI' THEN 81.20
    WHEN 'OIL_BRENT' THEN 85.40
    WHEN 'WHEAT'   THEN 548.00
    ELSE 100.00
  END as price,
  CASE symbol
    WHEN 'BTC'     THEN 1580.00
    WHEN 'ETH'     THEN 67.20
    WHEN 'XRP'     THEN -0.005
    WHEN 'SOL'     THEN 7.10
    WHEN 'GOLD'    THEN 14.20
    WHEN 'OIL_WTI' THEN 2.58
    WHEN 'OIL_BRENT' THEN 2.42
    ELSE 0.00
  END as change_24h,
  CASE symbol
    WHEN 'BTC'     THEN 2.40
    WHEN 'ETH'     THEN 1.80
    WHEN 'XRP'     THEN -0.90
    WHEN 'SOL'     THEN 4.20
    WHEN 'BNB'     THEN 1.20
    WHEN 'USD/EUR' THEN -0.30
    WHEN 'USD/GBP' THEN 0.10
    WHEN 'USD/JPY' THEN -0.50
    WHEN 'USD/RUB' THEN 0.80
    WHEN 'GOLD'    THEN 0.60
    WHEN 'OIL_WTI' THEN 3.20
    WHEN 'OIL_BRENT' THEN 2.90
    WHEN 'WHEAT'   THEN -1.20
    ELSE 0.00
  END as change_pct,
  CASE symbol
    WHEN 'BTC'     THEN 28400000000.00
    WHEN 'ETH'     THEN 15200000000.00
    WHEN 'XRP'     THEN 2100000000.00
    WHEN 'SOL'     THEN 4800000000.00
    WHEN 'GOLD'    THEN 142000000000.00
    WHEN 'OIL_WTI' THEN 95000000000.00
    ELSE 0.00
  END as volume_24h,
  CASE symbol
    WHEN 'BTC'     THEN 1320000000000.00
    WHEN 'ETH'     THEN 458000000000.00
    WHEN 'XRP'     THEN 31500000000.00
    WHEN 'SOL'     THEN 76200000000.00
    ELSE 0.00
  END as market_cap,
  NOW()
FROM public.market_assets
WHERE is_active = true;

-- ============================================================
-- ADDITIONAL CONFLICT ZONES (for conflicts page)
-- ============================================================
INSERT INTO public.conflict_zones (id, event_id, name, conflict_type, parties, active, intensity, start_date, last_update)
SELECT
  gen_random_uuid(),
  id,
  CASE external_id
    WHEN 'seed-con-009' THEN 'Myanmar Civil War — Chin Front'
    WHEN 'seed-con-010' THEN 'Southern Somalia — Al-Shabaab Insurgency'
    WHEN 'seed-con-011' THEN 'Nagorno-Karabakh Ceasefire Line'
    WHEN 'seed-con-012' THEN 'Sahel — Burkina Faso'
  END,
  CASE external_id
    WHEN 'seed-con-009' THEN 'armed_conflict'
    WHEN 'seed-con-010' THEN 'terrorism'
    WHEN 'seed-con-011' THEN 'border_dispute'
    WHEN 'seed-con-012' THEN 'terrorism'
  END,
  CASE external_id
    WHEN 'seed-con-009' THEN ARRAY['Myanmar Junta','Chinland Defence Force']
    WHEN 'seed-con-010' THEN ARRAY['Al-Shabaab','Federal Government of Somalia','AMISOM']
    WHEN 'seed-con-011' THEN ARRAY['Azerbaijan','Armenian forces']
    WHEN 'seed-con-012' THEN ARRAY['Jihadist groups','Burkina Faso Armed Forces','Wagner Group']
  END,
  true,
  CASE external_id
    WHEN 'seed-con-009' THEN 8
    WHEN 'seed-con-010' THEN 7
    WHEN 'seed-con-011' THEN 4
    WHEN 'seed-con-012' THEN 9
  END,
  NOW() - INTERVAL '1 year',
  NOW() - INTERVAL '5 hours'
FROM public.global_events
WHERE external_id IN ('seed-con-009','seed-con-010','seed-con-011','seed-con-012')
ON CONFLICT DO NOTHING;
