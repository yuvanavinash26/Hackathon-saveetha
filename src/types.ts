export type PatientStatus = 'Stable' | 'Observation' | 'High Risk' | 'Critical';

export interface VitalsHistoryEntry {
  time: string;
  heartRate: number;
  spO2: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: number;
  riskScore: number;
}

export interface CodeBluePrediction {
  probability: number;
  timeWindow: string; // e.g., "15 mins", "1 hour"
  suggestedIntervention: string;
  isAtImmediateRisk: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  roomNumber: string;
  admissionDate: string;
  primaryDiagnosis: string;
  status: PatientStatus;
  
  // Vitals
  heartRate: number;         // bpm
  spO2: number;              // %
  bloodPressure: string;     // e.g. "118/75"
  temperature: number;       // °C
  respiratoryRate: number;   // breaths/min
  
  // AI Prediction Engine
  riskScore: number;          // 0-100
  predictedFutureRisk: number; // 0-100 (in 2 hours)
  timeUntilDeterioration: string; // e.g., "35 mins", "1.5 hours", "N/A"
  confidencePercentage: number;  // %
  
  // Code Blue Predictor
  codeBlue: CodeBluePrediction;
  
  // History and Digital Twin
  history: VitalsHistoryEntry[];
  aiGeneratedSummary: string;
  predictedOutcomes: string;
}

export interface SimulatedAlert {
  id: string;
  timestamp: string;
  patientId: string;
  patientName: string;
  roomNumber: string;
  type: 'Oxygen Drop' | 'Blood Pressure Collapse' | 'High Fever' | 'Respiratory Distress' | 'Cardiac Risk';
  severity: 'Warning' | 'Critical' | 'Extreme';
  vitalsValue: string;
  suggestedResponse: string;
  isAcknowledged: boolean;
}

export interface BedAllocation {
  id: string;
  number: string;
  status: 'Occupied' | 'Available' | 'Reserved';
  patientId?: string;
  type: 'General ICU' | 'Cardiac ICU' | 'Neuro ICU' | 'Pediatric ICU';
}

export interface HospitalStats {
  totalPatients: number;
  criticalPatients: number;
  icuBedsAvailable: number;
  doctorsOnDuty: number;
  hospitalStressIndex: number; // 0-100
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  text: string;
}
