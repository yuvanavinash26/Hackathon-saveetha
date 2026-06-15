import { Patient, SimulatedAlert, BedAllocation } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pt-1',
    name: 'Arthur Pendelton',
    age: 72,
    gender: 'Male',
    roomNumber: 'ICU-402',
    admissionDate: '2026-06-10',
    primaryDiagnosis: 'Congestive Heart Failure (Decompensated)',
    status: 'Critical',
    heartRate: 112,
    spO2: 89,
    bloodPressure: '88/54',
    temperature: 36.8,
    respiratoryRate: 28,
    riskScore: 89,
    predictedFutureRisk: 95,
    timeUntilDeterioration: '15 mins',
    confidencePercentage: 92,
    codeBlue: {
      probability: 78,
      timeWindow: '20 mins',
      suggestedIntervention: 'Initiate non-invasive positive pressure ventilation (NIPPV) and continuous dobutamine infusion.',
      isAtImmediateRisk: true
    },
    history: [
      { time: '17:00', heartRate: 98, spO2: 93, bloodPressure: '102/62', temperature: 36.7, respiratoryRate: 22, riskScore: 65 },
      { time: '18:00', heartRate: 104, spO2: 91, bloodPressure: '95/58', temperature: 36.8, respiratoryRate: 24, riskScore: 75 },
      { time: '19:00', heartRate: 110, spO2: 90, bloodPressure: '90/55', temperature: 36.8, respiratoryRate: 26, riskScore: 84 },
      { time: '20:00', heartRate: 112, spO2: 89, bloodPressure: '88/54', temperature: 36.8, respiratoryRate: 28, riskScore: 89 }
    ],
    aiGeneratedSummary: 'Arthur Pendelton is a 72-year-old male with severe Class IV CHF. Current trending demonstrates rapid tachycardia, progressive SpO₂ degradation (89%), and worsening hypotension (88/54), signaling cardiogenic shock. Fluid overload has led to pulmonary congestion. Immediate diuretic and inotropic support is advised.',
    predictedOutcomes: 'Without prompt hemodynamic optimization, high probability of complete pump failure and respiratory collapse requiring intubation within 30 minutes.'
  },
  {
    id: 'pt-2',
    name: 'Sarah Jenkins',
    age: 28,
    gender: 'Female',
    roomNumber: 'ICU-311',
    admissionDate: '2026-06-13',
    primaryDiagnosis: 'Acute Respiratory Distress Syndrome (ARDS)',
    status: 'High Risk',
    heartRate: 98,
    spO2: 92,
    bloodPressure: '115/72',
    temperature: 38.5,
    respiratoryRate: 24,
    riskScore: 74,
    predictedFutureRisk: 82,
    timeUntilDeterioration: '45 mins',
    confidencePercentage: 88,
    codeBlue: {
      probability: 45,
      timeWindow: '45 mins',
      suggestedIntervention: 'Increase PEEP setting by 2 cmH₂O; prepare for recruitment maneuvers and arterial blood gas analysis.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 92, spO2: 95, bloodPressure: '118/74', temperature: 38.2, respiratoryRate: 20, riskScore: 55 },
      { time: '18:00', heartRate: 95, spO2: 94, bloodPressure: '116/73', temperature: 38.4, respiratoryRate: 22, riskScore: 64 },
      { time: '19:00', heartRate: 98, spO2: 92, bloodPressure: '115/72', temperature: 38.5, respiratoryRate: 24, riskScore: 74 }
    ],
    aiGeneratedSummary: 'Sarah Jenkins is a 28-year-old female admitted with secondary ARDS. Vent-patient dyssynchrony is suspected. Elevating respiratory rate and rising body temperature (38.5°C) are driving increased metabolic demand. Lung protective ventilation guidelines are active.',
    predictedOutcomes: 'Potential worsening hypoxemia requiring neuromuscular blockade and prone positioning if SpO₂ fails to stabilize above 92%.'
  },
  {
    id: 'pt-3',
    name: 'Marcus Vance',
    age: 64,
    gender: 'Male',
    roomNumber: 'ICU-415',
    admissionDate: '2026-06-12',
    primaryDiagnosis: 'Post-Op Coronary Artery Bypass Graft (CABG)',
    status: 'Observation',
    heartRate: 78,
    spO2: 97,
    bloodPressure: '124/80',
    temperature: 37.1,
    respiratoryRate: 16,
    riskScore: 35,
    predictedFutureRisk: 30,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 90,
    codeBlue: {
      probability: 5,
      timeWindow: 'N/A',
      suggestedIntervention: 'Continue routine post-operative rehabilitation and fluid monitoring.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 85, spO2: 96, bloodPressure: '130/82', temperature: 37.2, respiratoryRate: 18, riskScore: 45 },
      { time: '18:00', heartRate: 80, spO2: 97, bloodPressure: '126/81', temperature: 37.1, respiratoryRate: 16, riskScore: 38 },
      { time: '19:00', heartRate: 78, spO2: 97, bloodPressure: '124/80', temperature: 37.1, respiratoryRate: 16, riskScore: 35 }
    ],
    aiGeneratedSummary: 'Marcus Vance is 24 hours post-CABG x3. Hemodynamics are stabilizing nicely. Extubated successfully this morning. Minimal chest tube drainage and stable electrolytes. Sinus rhythm maintained with occasional unifocal PVCs.',
    predictedOutcomes: 'High likelihood of transfer to step-down unit within the next 12 hours.'
  },
  {
    id: 'pt-4',
    name: 'Elena Rostova',
    age: 51,
    gender: 'Female',
    roomNumber: 'ICU-208',
    admissionDate: '2026-06-11',
    primaryDiagnosis: 'Sepsis (Urosepsis originating)',
    status: 'Critical',
    heartRate: 124,
    spO2: 91,
    bloodPressure: '82/48',
    temperature: 39.4,
    respiratoryRate: 26,
    riskScore: 92,
    predictedFutureRisk: 96,
    timeUntilDeterioration: '10 mins',
    confidencePercentage: 94,
    codeBlue: {
      probability: 85,
      timeWindow: '12 mins',
      suggestedIntervention: 'Initiate aggressive norepinephrine resuscitation titrated to MAP > 65 mmHg; administer urgent Broad-Spectrum antibiotics.',
      isAtImmediateRisk: true
    },
    history: [
      { time: '17:00', heartRate: 110, spO2: 93, bloodPressure: '96/54', temperature: 39.0, respiratoryRate: 22, riskScore: 78 },
      { time: '18:00', heartRate: 118, spO2: 92, bloodPressure: '88/50', temperature: 39.2, respiratoryRate: 24, riskScore: 84 },
      { time: '19:00', heartRate: 124, spO2: 91, bloodPressure: '82/48', temperature: 39.4, respiratoryRate: 26, riskScore: 92 }
    ],
    aiGeneratedSummary: 'Elena Rostova presents with severe hyperthermic septic shock. Refractory hypotension (82/48) despite 2L fluid resuscitation. Metabolic acidosis is compounding. High lactate levels (>4.2 mmol/L) suggest decompensated systemic hypoperfusion.',
    predictedOutcomes: 'Organ dysfunction progression, renal shutdown, and multiple organ dysfunction syndrome (MODS) if mean arterial pressure is not normalized immediately.'
  },
  {
    id: 'pt-5',
    name: 'Damian Vance',
    age: 45,
    gender: 'Male',
    roomNumber: 'ICU-102',
    admissionDate: '2026-06-14',
    primaryDiagnosis: 'Massive Pulmonary Embolism',
    status: 'High Risk',
    heartRate: 105,
    spO2: 90,
    bloodPressure: '105/65',
    temperature: 36.9,
    respiratoryRate: 25,
    riskScore: 76,
    predictedFutureRisk: 85,
    timeUntilDeterioration: '35 mins',
    confidencePercentage: 87,
    codeBlue: {
      probability: 58,
      timeWindow: '30 mins',
      suggestedIntervention: 'Assess eligibility for systemic thrombolysis (Alteplase) or urgent suction embolectomy due to impending right ventricular strain.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 98, spO2: 93, bloodPressure: '112/68', temperature: 36.8, respiratoryRate: 21, riskScore: 60 },
      { time: '18:00', heartRate: 102, spO2: 91, bloodPressure: '108/66', temperature: 36.9, respiratoryRate: 23, riskScore: 70 },
      { time: '19:00', heartRate: 105, spO2: 90, bloodPressure: '105/65', temperature: 36.9, respiratoryRate: 25, riskScore: 76 }
    ],
    aiGeneratedSummary: 'Damian Vance was admitted 4 hours ago. CTA confirmed saddle embolus in main pulmonary artery. He has acute cor pulmonale. SpO₂ remains marginal despite high-flow nasal cannula at 50L/60% FiO₂. Hemodynamics showing borderline stability but deteriorating trend.',
    predictedOutcomes: 'Right ventricular collapse and cardiac arrest if pulmonary arterial blockade is not alleviated.'
  },
  {
    id: 'pt-6',
    name: 'Clara Barton',
    age: 83,
    gender: 'Female',
    roomNumber: 'ICU-410',
    admissionDate: '2026-06-08',
    primaryDiagnosis: 'Severe Lobar Pneumonia & Acute COPD',
    status: 'Observation',
    heartRate: 88,
    spO2: 94,
    bloodPressure: '132/76',
    temperature: 37.8,
    respiratoryRate: 19,
    riskScore: 48,
    predictedFutureRisk: 52,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 81,
    codeBlue: {
      probability: 12,
      timeWindow: 'N/A',
      suggestedIntervention: 'Check sputum cultures, continue scheduled bronchodilators, and optimize humidified oxygen.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 92, spO2: 92, bloodPressure: '135/78', temperature: 38.0, respiratoryRate: 22, riskScore: 56 },
      { time: '18:00', heartRate: 90, spO2: 93, bloodPressure: '130/74', temperature: 37.9, respiratoryRate: 20, riskScore: 50 },
      { time: '19:00', heartRate: 88, spO2: 94, bloodPressure: '132/76', temperature: 37.8, respiratoryRate: 19, riskScore: 48 }
    ],
    aiGeneratedSummary: 'Clara Barton is improving slowly on IV cefepime and azithromycin. Sputum clear. CO₂ retention is present but compensated (pH 7.37). Mental status alert and cooperative.',
    predictedOutcomes: 'Stable course expected. Plan for progressive weaning of supplemental nasal oxygen over tomorrow.'
  },
  {
    id: 'pt-7',
    name: 'Jared Leto',
    age: 39,
    gender: 'Male',
    roomNumber: 'ICU-215',
    admissionDate: '2026-06-13',
    primaryDiagnosis: 'Diabetic Ketoacidosis',
    status: 'Stable',
    heartRate: 72,
    spO2: 99,
    bloodPressure: '120/78',
    temperature: 36.6,
    respiratoryRate: 14,
    riskScore: 18,
    predictedFutureRisk: 15,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 95,
    codeBlue: {
      probability: 1,
      timeWindow: 'N/A',
      suggestedIntervention: 'Standard insulin sliding scale and subcutaneous transitioning protocol.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 88, spO2: 98, bloodPressure: '115/72', temperature: 36.8, respiratoryRate: 16, riskScore: 30 },
      { time: '18:00', heartRate: 80, spO2: 99, bloodPressure: '118/75', temperature: 36.7, respiratoryRate: 15, riskScore: 22 },
      { time: '19:00', heartRate: 72, spO2: 99, bloodPressure: '120/78', temperature: 36.6, respiratoryRate: 14, riskScore: 18 }
    ],
    aiGeneratedSummary: 'Jared Leto has recovered from severe acidosis. Anion gap closed (9 mEq/L). Blood glucose stabilized to 142 mg/dL. Rehydrated and initiating clear diet. Serum potassium replacement successful.',
    predictedOutcomes: 'Discharge to general medical ward within 4 hours.'
  },
  {
    id: 'pt-8',
    name: 'Patricia Neal',
    age: 66,
    gender: 'Female',
    roomNumber: 'ICU-301',
    admissionDate: '2026-06-14',
    primaryDiagnosis: 'Acute Anterolateral STEMI',
    status: 'High Risk',
    heartRate: 96,
    spO2: 94,
    bloodPressure: '110/60',
    temperature: 36.8,
    respiratoryRate: 22,
    riskScore: 81,
    predictedFutureRisk: 89,
    timeUntilDeterioration: '25 mins',
    confidencePercentage: 90,
    codeBlue: {
      probability: 68,
      timeWindow: '25 mins',
      suggestedIntervention: 'Prepare for emergent cardiac catheterization/revascularization; prepare defibrillator pads for high risk of VF.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 82, spO2: 96, bloodPressure: '124/70', temperature: 36.7, respiratoryRate: 18, riskScore: 50 },
      { time: '18:00', heartRate: 90, spO2: 95, bloodPressure: '118/64', temperature: 36.8, respiratoryRate: 20, riskScore: 68 },
      { time: '19:00', heartRate: 96, spO2: 94, bloodPressure: '110/60', temperature: 36.8, respiratoryRate: 22, riskScore: 81 }
    ],
    aiGeneratedSummary: 'Patricia Neal is experiencing post-infarct ischemia. Elevated ST segments on telemetry are accompanied by intermittent chest crushing. Mild basilar rales. Frequent ventricular runs (V-tach of 4-6 beats) occurring.',
    predictedOutcomes: 'High risk of ventricular fibrillation or cardiogenic shock if ischemia is not relieved quickly by intervention.'
  },
  {
    id: 'pt-9',
    name: 'Devon Brooks',
    age: 58,
    gender: 'Male',
    roomNumber: 'ICU-204',
    admissionDate: '2026-06-11',
    primaryDiagnosis: 'Acute Kidney Injury (Prerenal)',
    status: 'Stable',
    heartRate: 68,
    spO2: 98,
    bloodPressure: '128/82',
    temperature: 36.7,
    respiratoryRate: 14,
    riskScore: 15,
    predictedFutureRisk: 15,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 91,
    codeBlue: {
      probability: 2,
      timeWindow: 'N/A',
      suggestedIntervention: 'Maintain state hydration matching output; monitor BUN and serum creatinine.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 72, spO2: 98, bloodPressure: '130/84', temperature: 36.8, respiratoryRate: 16, riskScore: 20 },
      { time: '18:00', heartRate: 70, spO2: 98, bloodPressure: '128/82', temperature: 36.7, respiratoryRate: 15, riskScore: 17 },
      { time: '19:00', heartRate: 68, spO2: 98, bloodPressure: '128/82', temperature: 36.7, respiratoryRate: 14, riskScore: 15 }
    ],
    aiGeneratedSummary: 'Devon Brooks exhibits resolved prerenal AKI. Urine output is >0.8 mL/kg/hr following active fluid resus. Creatinine has dropped close to his baseline at 1.2 mg/dL.',
    predictedOutcomes: 'Stable recovery. Expected transfer to ordinary room within 24 hours.'
  },
  {
    id: 'pt-10',
    name: 'Aiko Tanaka',
    age: 79,
    gender: 'Female',
    roomNumber: 'ICU-418',
    admissionDate: '2026-06-12',
    primaryDiagnosis: 'Ischemic Stroke (Left MCA)',
    status: 'Observation',
    heartRate: 76,
    spO2: 96,
    bloodPressure: '142/91',
    temperature: 37.0,
    respiratoryRate: 17,
    riskScore: 42,
    predictedFutureRisk: 45,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 83,
    codeBlue: {
      probability: 8,
      timeWindow: 'N/A',
      suggestedIntervention: 'Maintain blood pressure parameters (NPO, target SBP < 160 mmHg); perform intensive neurological checks.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 80, spO2: 96, bloodPressure: '145/92', temperature: 37.1, respiratoryRate: 18, riskScore: 46 },
      { time: '18:00', heartRate: 78, spO2: 96, bloodPressure: '142/90', temperature: 37.0, respiratoryRate: 17, riskScore: 44 },
      { time: '19:00', heartRate: 76, spO2: 96, bloodPressure: '142/91', temperature: 37.0, respiratoryRate: 17, riskScore: 42 }
    ],
    aiGeneratedSummary: 'Aiko Tanaka is in post-tPA stroke observation. Left hemiparesis. Speech is moderately dysphagic but improving. No signs of hemorrhagic conversion on CT scan. Close monitoring of cerebral perfusion pressure.',
    predictedOutcomes: 'Continued slow neurological recovery with early active physical therapy intervention.'
  },
  {
    id: 'pt-11',
    name: 'Liam Neeson',
    age: 62,
    gender: 'Male',
    roomNumber: 'ICU-305',
    admissionDate: '2026-06-13',
    primaryDiagnosis: 'Septic Shock & Severe Pancreatitis',
    status: 'Critical',
    heartRate: 118,
    spO2: 90,
    bloodPressure: '90/50',
    temperature: 38.9,
    respiratoryRate: 26,
    riskScore: 85,
    predictedFutureRisk: 90,
    timeUntilDeterioration: '20 mins',
    confidencePercentage: 91,
    codeBlue: {
      probability: 72,
      timeWindow: '25 mins',
      suggestedIntervention: 'Titrate Vasopressin infusion alongside Norepinephrine; assess abdominal pressure for abdominal compartment syndrome.',
      isAtImmediateRisk: true
    },
    history: [
      { time: '17:00', heartRate: 105, spO2: 93, bloodPressure: '100/55', temperature: 38.6, respiratoryRate: 22, riskScore: 68 },
      { time: '18:00', heartRate: 112, spO2: 91, bloodPressure: '94/52', temperature: 38.8, respiratoryRate: 24, riskScore: 78 },
      { time: '19:00', heartRate: 118, spO2: 90, bloodPressure: '90/50', temperature: 38.9, respiratoryRate: 26, riskScore: 85 }
    ],
    aiGeneratedSummary: 'Liam Neeson condition is critical, requiring dual vasopressor support for septic shock. He shows highly elevated systemic inflammatory markers (CRP, IL-6). Oliguric urine patterns noted over the last 3 hours.',
    predictedOutcomes: 'Severe lactic acidosis and multiple system failure if pressors are unable to maintain tissue perfusion.'
  },
  {
    id: 'pt-12',
    name: 'Clinical Pearl (Maya Angelou)',
    age: 88,
    gender: 'Female',
    roomNumber: 'ICU-404',
    admissionDate: '2026-06-09',
    primaryDiagnosis: 'End-Stage Valvular Heart Disease',
    status: 'Critical',
    heartRate: 128,
    spO2: 86,
    bloodPressure: '80/42',
    temperature: 36.1,
    respiratoryRate: 32,
    riskScore: 96,
    predictedFutureRisk: 99,
    timeUntilDeterioration: '5 mins',
    confidencePercentage: 96,
    codeBlue: {
      probability: 94,
      timeWindow: '10 mins',
      suggestedIntervention: 'Provide immediate high-flow facial mask oxygen; prepare emergency resuscitation kit; notify cardiology and primary family regarding code status (comfort care parameters active).',
      isAtImmediateRisk: true
    },
    history: [
      { time: '17:00', heartRate: 115, spO2: 89, bloodPressure: '90/48', temperature: 36.3, respiratoryRate: 26, riskScore: 85 },
      { time: '18:00', heartRate: 122, spO2: 88, bloodPressure: '84/44', temperature: 36.2, respiratoryRate: 29, riskScore: 91 },
      { time: '19:00', heartRate: 128, spO2: 86, bloodPressure: '80/42', temperature: 36.1, respiratoryRate: 32, riskScore: 96 }
    ],
    aiGeneratedSummary: 'Maya Angelou has advanced cardiovascular collapse. Severe hypoxia (86%) and severe systemic hypotension are refractory to medical assistance. Cold pale extremities and Cheyne-Stokes breath breathing intervals are active.',
    predictedOutcomes: 'Extreme high probability of cardiac/respiratory standstill in less than 15 minutes. Strongly consider comfort care measures.'
  },
  {
    id: 'pt-13',
    name: 'Gregory House',
    age: 54,
    gender: 'Male',
    roomNumber: 'ICU-316',
    admissionDate: '2026-06-13',
    primaryDiagnosis: 'Systemic Lupus Erythematosus (SLE Flares)',
    status: 'Observation',
    heartRate: 82,
    spO2: 98,
    bloodPressure: '118/76',
    temperature: 37.4,
    respiratoryRate: 16,
    riskScore: 28,
    predictedFutureRisk: 32,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 89,
    codeBlue: {
      probability: 4,
      timeWindow: 'N/A',
      suggestedIntervention: 'Monitor autoantibody panels, liver enzymes, and response to high-dose IV methylprednisolone.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 85, spO2: 97, bloodPressure: '120/78', temperature: 37.5, respiratoryRate: 18, riskScore: 32 },
      { time: '18:00', heartRate: 82, spO2: 98, bloodPressure: '118/76', temperature: 37.4, respiratoryRate: 16, riskScore: 28 }
    ],
    aiGeneratedSummary: 'Gregory House suffers from an systemic lupus flare. Fever is resolving on steroids. Visualizing kidneys show stable EGFR. Minimal joint swelling reported.',
    predictedOutcomes: 'Continuous therapeutic regression of inflammatory flare, discharge-ready in 48 hours.'
  },
  {
    id: 'pt-14',
    name: 'Sophia Loren',
    age: 85,
    gender: 'Female',
    roomNumber: 'ICU-420',
    admissionDate: '2026-06-14',
    primaryDiagnosis: 'Post-Op Femur Hemiarthroplasty',
    status: 'Stable',
    heartRate: 74,
    spO2: 97,
    bloodPressure: '130/74',
    temperature: 36.8,
    respiratoryRate: 15,
    riskScore: 22,
    predictedFutureRisk: 25,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 92,
    codeBlue: {
      probability: 2,
      timeWindow: 'N/A',
      suggestedIntervention: 'Encourage incentive spirometry; continuous DVT prophylaxis with Lovenox.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 80, spO2: 95, bloodPressure: '128/70', temperature: 36.9, respiratoryRate: 16, riskScore: 28 },
      { time: '18:00', heartRate: 74, spO2: 97, bloodPressure: '130/74', temperature: 36.8, respiratoryRate: 15, riskScore: 22 }
    ],
    aiGeneratedSummary: 'Sophia Loren is doing exceptionally well post hip hemiarthroplasty. Tolerated physical therapy transfer to chair. Pain controlled on oral meds. Lungs clear to auscultation.',
    predictedOutcomes: 'Very stable postop progress. Ready for transfer to orthopedic floor in the morning.'
  },
  {
    id: 'pt-15',
    name: 'Jonathan Miller',
    age: 33,
    gender: 'Male',
    roomNumber: 'ICU-112',
    admissionDate: '2026-06-11',
    primaryDiagnosis: 'Traumatic Pneumothorax & Flail Chest',
    status: 'High Risk',
    heartRate: 104,
    spO2: 91,
    bloodPressure: '112/60',
    temperature: 37.2,
    respiratoryRate: 26,
    riskScore: 71,
    predictedFutureRisk: 78,
    timeUntilDeterioration: '40 mins',
    confidencePercentage: 86,
    codeBlue: {
      probability: 38,
      timeWindow: '45 mins',
      suggestedIntervention: 'Inspect the right chest tube for patency or active air leaks; analyze potential tension pneumothorax conversion.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 94, spO2: 94, bloodPressure: '118/68', temperature: 37.0, respiratoryRate: 20, riskScore: 52 },
      { time: '18:00', heartRate: 100, spO2: 92, bloodPressure: '115/64', temperature: 37.1, respiratoryRate: 23, riskScore: 65 },
      { time: '19:00', heartRate: 104, spO2: 91, bloodPressure: '112/60', temperature: 37.2, respiratoryRate: 26, riskScore: 71 }
    ],
    aiGeneratedSummary: 'Jonathan Miller is in ICU following a motor vehicle collision. Left-sided chest wall instability (flail chest) with an active underwater seal chest tube. Patient is in severe pain, compromising deep breaths and triggering chest wall guarding.',
    predictedOutcomes: 'Impending respiratory distress requiring urgent interpleural vacuum assessment or mechanical respiratory assistance.'
  },
  {
    id: 'pt-16',
    name: 'Isabella Swan',
    age: 22,
    gender: 'Female',
    roomNumber: 'ICU-107',
    admissionDate: '2026-06-14',
    primaryDiagnosis: 'Status Asthmaticus',
    status: 'Observation',
    heartRate: 90,
    spO2: 95,
    bloodPressure: '116/70',
    temperature: 36.9,
    respiratoryRate: 20,
    riskScore: 40,
    predictedFutureRisk: 42,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 84,
    codeBlue: {
      probability: 15,
      timeWindow: 'N/A',
      suggestedIntervention: 'Execute continuous Albuterol nebulizers alongside saline hydrate; check arterial gas parameters if hypercapnia begins.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 98, spO2: 93, bloodPressure: '118/72', temperature: 37.0, respiratoryRate: 24, riskScore: 52 },
      { time: '18:00', heartRate: 90, spO2: 95, bloodPressure: '116/70', temperature: 36.9, respiratoryRate: 20, riskScore: 40 }
    ],
    aiGeneratedSummary: 'Isabella Swan is recovering from an exacerbation of life-threatening asthma. Air entry is improving of both fields, though residual expiratory wheeze is present.',
    predictedOutcomes: 'Continued stable bronchodilator treatment, planning oral steroid discharge sequence.'
  },
  {
    id: 'pt-17',
    name: 'Walter White',
    age: 52,
    gender: 'Male',
    roomNumber: 'ICU-222',
    admissionDate: '2026-06-13',
    primaryDiagnosis: 'Post-Chemotherapy Neutropenic Sepsis',
    status: 'High Risk',
    heartRate: 108,
    spO2: 93,
    bloodPressure: '96/58',
    temperature: 39.1,
    respiratoryRate: 22,
    riskScore: 70,
    predictedFutureRisk: 78,
    timeUntilDeterioration: '50 mins',
    confidencePercentage: 89,
    codeBlue: {
      probability: 45,
      timeWindow: '60 mins',
      suggestedIntervention: 'Administer broad-spectrum cefepime, absolute fluid titration, and inject G-CSF factors to boost counts.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 98, spO2: 95, bloodPressure: '106/64', temperature: 38.6, respiratoryRate: 18, riskScore: 54 },
      { time: '18:00', heartRate: 105, spO2: 94, bloodPressure: '100/60', temperature: 38.9, respiratoryRate: 20, riskScore: 62 },
      { time: '19:00', heartRate: 108, spO2: 93, bloodPressure: '96/58', temperature: 39.1, respiratoryRate: 22, riskScore: 70 }
    ],
    aiGeneratedSummary: 'Walter White is incredibly vulnerable due to profound myelosuppression (ANC < 100). Elevated high fever (39.1°C) with marginal pressures (96/58). Broad coverage and barrier nursing are extremely critical.',
    predictedOutcomes: 'Risk of profound distributive septic shock if neutropenic infection source is not treated aggressively.'
  },
  {
    id: 'pt-18',
    name: 'Bruce Wayne',
    age: 41,
    gender: 'Male',
    roomNumber: 'ICU-401',
    admissionDate: '2026-06-14',
    primaryDiagnosis: 'Traumatic Brain Injury & Epidural Hematoma',
    status: 'Observation',
    heartRate: 60,
    spO2: 98,
    bloodPressure: '138/85',
    temperature: 36.8,
    respiratoryRate: 12,
    riskScore: 45,
    predictedFutureRisk: 50,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 88,
    codeBlue: {
      probability: 10,
      timeWindow: 'N/A',
      suggestedIntervention: 'Keep head of bed elevated to 30°; examine pupillary reflexes rapidly to monitor for Cushing\'s response (Bradycardia + Hypertension).',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 64, spO2: 98, bloodPressure: '135/82', temperature: 36.8, respiratoryRate: 14, riskScore: 42 },
      { time: '18:00', heartRate: 60, spO2: 98, bloodPressure: '138/85', temperature: 36.8, respiratoryRate: 12, riskScore: 45 }
    ],
    aiGeneratedSummary: 'Bruce Wayne is post small intracranial hematoma drainage. Mild confusion, GCS 14 (E4V4M6). Telemetry shows borderline sinus bradycardia (60 bpm), which requires very careful tracking to rule out cerebral pressure spikes.',
    predictedOutcomes: 'Close monitoring. Immediate neurosurgical CT if GCS drops or pupillary asymmetry develops.'
  },
  {
    id: 'pt-19',
    name: 'Diana Prince',
    age: 35,
    gender: 'Female',
    roomNumber: 'ICU-303',
    admissionDate: '2026-06-14',
    primaryDiagnosis: 'Acute Myocarditis (Post-Viral)',
    status: 'Stable',
    heartRate: 76,
    spO2: 98,
    bloodPressure: '118/74',
    temperature: 36.9,
    respiratoryRate: 15,
    riskScore: 20,
    predictedFutureRisk: 22,
    timeUntilDeterioration: 'Stable',
    confidencePercentage: 90,
    codeBlue: {
      probability: 3,
      timeWindow: 'N/A',
      suggestedIntervention: 'Serial troponin levels, keep physical stress minimal, continuous cardiac EKG surveillance.',
      isAtImmediateRisk: false
    },
    history: [
      { time: '17:00', heartRate: 80, spO2: 97, bloodPressure: '115/72', temperature: 37.0, respiratoryRate: 16, riskScore: 25 },
      { time: '18:00', heartRate: 76, spO2: 98, bloodPressure: '118/74', temperature: 36.9, respiratoryRate: 15, riskScore: 20 }
    ],
    aiGeneratedSummary: 'Diana Prince has acute mild post-flu myocarditis. Troponin levels are trending down. Left ventricular ejection fraction is preserved (52%). Standard beta-blocker micro-infusion tolerated.',
    predictedOutcomes: 'Excellent recovery pattern, expect postop outpatient monitoring within 24 hours.'
  },
  {
    id: 'pt-20',
    name: 'Tony Stark',
    age: 50,
    gender: 'Male',
    roomNumber: 'ICU-406',
    admissionDate: '2026-06-13',
    primaryDiagnosis: 'Cadiogenic Shock & High-Degree AV Block',
    status: 'Critical',
    heartRate: 44, // Bradycardia due to heart block
    spO2: 90,
    bloodPressure: '89/52',
    temperature: 36.4,
    respiratoryRate: 24,
    riskScore: 87,
    predictedFutureRisk: 94,
    timeUntilDeterioration: '18 mins',
    confidencePercentage: 91,
    codeBlue: {
      probability: 76,
      timeWindow: '20 mins',
      suggestedIntervention: 'Prepare for transcutaneous pacing immediately; administer Atropine 1mg IV; check and verify pacemaker catheter connection.',
      isAtImmediateRisk: true
    },
    history: [
      { time: '17:00', heartRate: 58, spO2: 92, bloodPressure: '100/58', temperature: 36.6, respiratoryRate: 20, riskScore: 68 },
      { time: '18:00', heartRate: 50, spO2: 91, bloodPressure: '94/54', temperature: 36.5, respiratoryRate: 22, riskScore: 78 },
      { time: '19:00', heartRate: 44, spO2: 90, bloodPressure: '89/52', temperature: 36.4, respiratoryRate: 24, riskScore: 87 }
    ],
    aiGeneratedSummary: 'Tony Stark has worsening third-degree AV block leading to severe bradycardia (44 bpm). Compromised cardiac output is driving cardiogenic shock (BP 89/52) and pulmonary congestion with SpO₂ at 90%. Pacemaker setup required.',
    predictedOutcomes: 'Impending complete asystolic arrest if emergency pacing or chronotropic support is not established immediately.'
  }
];

export const INITIAL_ALERTS: SimulatedAlert[] = [
  {
    id: 'alt-1',
    timestamp: '21:14:15',
    patientId: 'pt-12',
    patientName: 'Maya Angelou',
    roomNumber: 'ICU-404',
    type: 'Oxygen Drop',
    severity: 'Extreme',
    vitalsValue: 'Oxygen: 86%',
    suggestedResponse: 'Apply emergency oxygen flow, verify airway patency, check for secretions.',
    isAcknowledged: false
  },
  {
    id: 'alt-2',
    timestamp: '21:12:08',
    patientId: 'pt-4',
    patientName: 'Elena Rostova',
    roomNumber: 'ICU-208',
    type: 'Blood Pressure Collapse',
    severity: 'Critical',
    vitalsValue: 'BP: 82/48',
    suggestedResponse: 'Urgent Norepinephrine bolus/pumping; initiate 500mL Lactated Ringer infusion.',
    isAcknowledged: false
  },
  {
    id: 'alt-3',
    timestamp: '21:08:42',
    patientId: 'pt-20',
    patientName: 'Tony Stark',
    roomNumber: 'ICU-406',
    type: 'Cardiac Risk',
    severity: 'Critical',
    vitalsValue: 'HR: 44 bpm (AV Block)',
    suggestedResponse: 'Verify pacing unit, check Atropine dose, prepare paddles.',
    isAcknowledged: false
  },
  {
    id: 'alt-4',
    timestamp: '21:05:11',
    patientId: 'pt-1',
    patientName: 'Arthur Pendelton',
    roomNumber: 'ICU-402',
    type: 'Respiratory Distress',
    severity: 'Critical',
    vitalsValue: 'RR: 28 rpm / Oxygen: 89%',
    suggestedResponse: 'Transition patient to CPAP support immediately; inspect fluid overload status.',
    isAcknowledged: false
  },
  {
    id: 'alt-5',
    timestamp: '21:01:23',
    patientId: 'pt-17',
    patientName: 'Walter White',
    roomNumber: 'ICU-222',
    type: 'High Fever',
    severity: 'Warning',
    vitalsValue: 'Temp: 39.1°C',
    suggestedResponse: 'Administer IV Acetaminophen; collect urgent blood cultures, inspect access site.',
    isAcknowledged: true
  }
];

export const BEDS_DATA: BedAllocation[] = [
  { id: 'b-1', number: 'Bed 401', status: 'Occupied', patientId: 'pt-18', type: 'Neuro ICU' },
  { id: 'b-2', number: 'Bed 402', status: 'Occupied', patientId: 'pt-1', type: 'Cardiac ICU' },
  { id: 'b-3', number: 'Bed 403', status: 'Available', type: 'General ICU' },
  { id: 'b-4', number: 'Bed 404', status: 'Occupied', patientId: 'pt-12', type: 'Cardiac ICU' },
  { id: 'b-5', number: 'Bed 405', status: 'Available', type: 'Cardiac ICU' },
  { id: 'b-6', number: 'Bed 406', status: 'Occupied', patientId: 'pt-20', type: 'Cardiac ICU' },
  { id: 'b-7', number: 'Bed 407', status: 'Reserved', type: 'Neuro ICU' },
  { id: 'b-8', number: 'Bed 408', status: 'Available', type: 'General ICU' },
  { id: 'b-9', number: 'Bed 409', status: 'Occupied', patientId: 'pt-6', type: 'General ICU' },
  { id: 'b-10', number: 'Bed 410', status: 'Occupied', patientId: 'pt-3', type: 'Cardiac ICU' },
  { id: 'b-11', number: 'Bed 411', status: 'Available', type: 'Pediatric ICU' },
  { id: 'b-12', number: 'Bed 412', status: 'Available', type: 'General ICU' }
];

export const ON_DUTY_DOCTORS = [
  { name: 'Dr. Evelyn Carter', role: 'Chief Intensivist', specialty: 'Critical Care / Pulmonology', status: 'On Call' },
  { name: 'Dr. Aris Vance', role: 'Trauma Surgeon', specialty: 'Emergency Medicine', status: 'Active (Surgery)' },
  { name: 'Dr. Raymond Zhao', role: 'Electrophysiologist', specialty: 'Cardiology', status: 'On Floor' },
  { name: 'Dr. Sarah Patel', role: 'Pediatric Intensivist', specialty: 'Pediatric Critical Care', status: 'On Floor' },
  { name: 'Dr. James Thorne', role: 'Critical Care Fellow', specialty: 'Anesthesiology', status: 'Resting' }
];
