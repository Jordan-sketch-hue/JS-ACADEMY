-- Ferguson Law CMS — Separate estate workflow templates (Oct 2026)
-- Replaces any combined "estate" template with 5 focused sub-type workflows.

-- 1. Expand fl_workflow_templates type constraint to allow all estate sub-types
alter table public.fl_workflow_templates
  drop constraint if exists fl_workflow_templates_type_check;

alter table public.fl_workflow_templates
  add constraint fl_workflow_templates_type_check
  check (type in (
    'property_purchase','property_sale','lease_agreement','title_search','transfer',
    'power_of_attorney','power_of_attorney_limited','lost_title','first_registration',
    'adverse_possession','subdivision','will_drafting','probate',
    'letters_of_administration','resealing','transmission_of_title',
    'non_contentious_divorce','general'
  ));

-- 2. Will Drafting
insert into public.fl_workflow_templates (type, name, phases)
values ('will_drafting', 'Will Drafting', '[
  {"order":1,"name":"Intake & Instructions","milestones":["Client intake form received","Identity documents verified","Testator capacity confirmed","Instructions for Will received and confirmed","Engagement letter signed"]},
  {"order":2,"name":"Drafting","milestones":["Draft Will prepared","Draft sent to client for review","Client amendments received and incorporated","Final draft approved by client"]},
  {"order":3,"name":"Execution","milestones":["Signing appointment scheduled","Will signed by Testator","Will witnessed and attested","Executed Will handed to client / held in safe custody"]},
  {"order":4,"name":"File Closure","milestones":["Copy provided to client","Safe custody arrangement confirmed","File closed"]}
]'::jsonb)
on conflict (type) do update set name = excluded.name, phases = excluded.phases;

-- 3. Probate
insert into public.fl_workflow_templates (type, name, phases)
values ('probate', 'Probate', '[
  {"order":1,"name":"Intake & KYC/AML","milestones":["Client intake form received","Identity documents verified (executor)","Relationship to deceased confirmed","Engagement letter signed"]},
  {"order":2,"name":"Document Collection","milestones":["Original Will located and verified","Death certificate obtained","Grant application documents prepared","Estate assets inventoried and valued","Outstanding debts and liabilities noted"]},
  {"order":3,"name":"Application Filing","milestones":["Stamp duty assessed and paid","Oath of Executor sworn","Application for Grant of Probate filed at Supreme Court","Caveat search conducted"]},
  {"order":4,"name":"Grant & Administration","milestones":["Grant of Probate issued","Estate debts settled","Estate assets distributed to beneficiaries","Final estate accounts prepared"]},
  {"order":5,"name":"File Closure","milestones":["Distribution confirmed by beneficiaries","File closed"]}
]'::jsonb)
on conflict (type) do update set name = excluded.name, phases = excluded.phases;

-- 4. Letters of Administration
insert into public.fl_workflow_templates (type, name, phases)
values ('letters_of_administration', 'Letters of Administration', '[
  {"order":1,"name":"Intake & KYC/AML","milestones":["Client intake form received","Identity documents verified (administrator)","Next of kin status confirmed","Relationship to deceased confirmed","Engagement letter signed"]},
  {"order":2,"name":"Document Collection","milestones":["Death certificate obtained","Letters of Administration application documents prepared","Beneficiaries identified and confirmed","Estate assets inventoried and valued","Outstanding debts and liabilities noted"]},
  {"order":3,"name":"Bond & Application","milestones":["Bond / surety arranged","Stamp duty assessed and paid","Oath of Administrator sworn","Application for Letters of Administration filed at Supreme Court"]},
  {"order":4,"name":"Administration","milestones":["Letters of Administration issued","Estate debts settled","Estate assets distributed to beneficiaries","Final estate accounts prepared"]},
  {"order":5,"name":"File Closure","milestones":["Distribution confirmed by beneficiaries","File closed"]}
]'::jsonb)
on conflict (type) do update set name = excluded.name, phases = excluded.phases;

-- 5. Resealing of Foreign Grant
insert into public.fl_workflow_templates (type, name, phases)
values ('resealing', 'Resealing of Foreign Grant', '[
  {"order":1,"name":"Intake & KYC/AML","milestones":["Client intake form received","Identity documents verified","Foreign Grant obtained","Apostille / authentication confirmed","Engagement letter signed"]},
  {"order":2,"name":"Document Collection","milestones":["Certified copy of foreign Grant obtained","Original Will (if applicable) obtained","Authentication of all documents confirmed","Jamaican assets identified and valued"]},
  {"order":3,"name":"Application Filing","milestones":["Stamp duty assessed and paid","Resealing application filed at Supreme Court","Caveat search conducted"]},
  {"order":4,"name":"Resealing & Administration","milestones":["Resealed Grant issued","Jamaican assets dealt with","Jamaican estate distributed to beneficiaries"]},
  {"order":5,"name":"File Closure","milestones":["Distribution confirmed","File closed"]}
]'::jsonb)
on conflict (type) do update set name = excluded.name, phases = excluded.phases;

-- 6. Transmission of Title
insert into public.fl_workflow_templates (type, name, phases)
values ('transmission_of_title', 'Transmission of Title', '[
  {"order":1,"name":"Intake & KYC/AML","milestones":["Client intake form received","Identity documents verified","Relationship to deceased confirmed","Engagement letter signed"]},
  {"order":2,"name":"Document Collection","milestones":["Copy of title obtained","Death certificate obtained","Probate / Letters of Administration / Assent obtained","Property valuation obtained"]},
  {"order":3,"name":"Preparation","milestones":["Transmission application prepared","Stamp duty assessed and paid","Transmission / Assent instrument prepared and signed"]},
  {"order":4,"name":"Registration","milestones":["Application filed at National Land Agency","Title updated in new name"]},
  {"order":5,"name":"File Closure","milestones":["Updated title handed to client","File closed"]}
]'::jsonb)
on conflict (type) do update set name = excluded.name, phases = excluded.phases;