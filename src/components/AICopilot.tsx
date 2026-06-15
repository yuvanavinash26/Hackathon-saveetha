import React, { useState, useRef, useEffect } from 'react';
import { Patient, SimulatedAlert, ChatMessage } from '../types';
import { 
  Bot, Send, Sparkles, MessageSquare, HeartPulse, ShieldAlert, CheckCircle, 
  ArrowRight, Users, User, Trash2 
} from 'lucide-react';

interface AICopilotProps {
  patients: Patient[];
  alerts: SimulatedAlert[];
  onSelectPatient: (patientId: string) => void;
}

export default function AICopilot({ patients, alerts, onSelectPatient }: AICopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      timestamp: new Date(),
      text: "Hello! I am CARESYNC AI+ Copilot, your critical medical response assistant. I have full telemetry access to your 20 active ICU patients, vital trend logs, and current drug recommendations. Ask me anything or choose from one of the quick commands below!"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQueries = [
    { label: "Why is Patient 12 critical?", query: "Why is Patient 12 (Maya Angelou) in a critical state?" },
    { label: "Show high-risk patients", query: "Show me all high-risk and critical patients in the ward." },
    { label: "Explain latest alert", query: "Explain the latest alert in the system and recommend actions." },
    { label: "Who needs immediate attention?", query: "Which patient needs immediate attention?" }
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date(),
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI thinking and smart healthcare intelligence generation
    setTimeout(() => {
      let aiResponseText = '';
      const queryLower = text.toLowerCase();

      if (queryLower.includes('patient 12') || queryLower.includes('maya') || queryLower.includes('angelou')) {
        // Patient 12 - Maya Angelou
        const p12 = patients.find(p => p.id === 'pt-12') || patients[11];
        aiResponseText = `### Patient Assessment: Clinical Pearl (Maya Angelou) • Room ${p12.roomNumber}

**Clinical Status:** **CRITICAL** (Current Risk Index: **${p12.riskScore}%**)

**Direct Findings:**
1. **Severe Cardiovascular Collapse:** Current heart rate is **${p12.heartRate} bpm** alongside severe hypotension (**${p12.bloodPressure} mmHg**). 
2. **Extreme Respiratory Acidosis Hazard:** Oxygen levels have fallen to **${p12.spO2}%** while her breathing exceeds **${p12.respiratoryRate} rpm** (Cheyne-Stokes segments recorded on telemetry).
3. **Clinical Diagnosis:** End-Stage Valvular Heart Disease showing systemic circulatory shutdown.

**Recommended Actions:**
- **Symptom Management:** Check and verify comfort care protocols. High-depth oxygenation delivery via heavy facial mask.
- **Immediate Family Alert:** Prepare team for urgent family counselling regarding poor prognostic trend.`;
      } 
      else if (queryLower.includes('high-risk') || queryLower.includes('high risk') || queryLower.includes('show all') || queryLower.includes('critical patients')) {
        // Show high risk / critical patients
        const highRiskOrCritical = patients.filter(p => p.status === 'Critical' || p.status === 'High Risk');
        const listStr = highRiskOrCritical.map((p, idx) => 
          `${idx + 1}. **${p.name}** (Room ${p.roomNumber}) - Status: **${p.status}** | Risk: **${p.riskScore}%** | Diagnosis: *${p.primaryDiagnosis}*`
        ).join('\n');

        aiResponseText = `### Current Clinical Risk Triage Audit

Our continuous heuristic prediction engine has flagged **${highRiskOrCritical.length} patients** who require increased surveillance:

${listStr}

**Triage Protocol Advisory:**
Physicians should check on **Elena Rostova** (Room 208) and **Arthur Pendelton** (Room 402) first due to high slope risk curves.`;
      } 
      else if (queryLower.includes('latest alert') || queryLower.includes('explain alert')) {
        // Latest alert
        const unacked = alerts.filter(a => !a.isAcknowledged);
        const refAlert = unacked.length > 0 ? unacked[0] : alerts[0];
        
        aiResponseText = `### Clinical Incident Break Down: Active Alert for **${refAlert.patientName}**

**Metric Abnormality:** \`${refAlert.vitalsValue}\`
**Severity Rating:** **${refAlert.severity.toUpperCase()}**

**Diagnostic Analysis:**
This alert suggests rapid physiological distress. For **${refAlert.patientName}**, the documented **${refAlert.type}** represents acute secondary deterioration. 

**Immediate Intervention Protocol:**
1. **Airway & Oxygenation:** ${refAlert.suggestedResponse}
2. **Bedside Evaluation:** Charge nurse must execute manual blood pressure / arterial blood gas validation immediately to cross-confirm telemetry sensor integrity.`;
      } 
      else if (queryLower.includes('attention') || queryLower.includes('immediate attention') || queryLower.includes('who needs')) {
        // Critical prioritizer
        const criticalList = [...patients]
          .filter(p => p.status === 'Critical')
          .sort((a, b) => b.riskScore - a.riskScore);
        
        if (criticalList.length > 0) {
          const topBad = criticalList[0];
          aiResponseText = `### Immediate Clinical Attention Target: **${topBad.name}**

**Location:** ICU Room **${topBad.roomNumber}**
**Current Risk Metric:** **${topBad.riskScore}%** (Trajectory: +${topBad.predictedFutureRisk - topBad.riskScore}% in 2 hours)

**Key Indicators:**
* Heart Rate: **${topBad.heartRate} bpm**
* SpO₂ Levels: **${topBad.spO2}%**
* BP: **${topBad.bloodPressure} mmHg**
* Primary Condition: **${topBad.primaryDiagnosis}**

**Action Required:**
Initiate the Code Blue Prognostic intervention: *"${topBad.codeBlue.suggestedIntervention}"*`;
        } else {
          aiResponseText = "All monitored patients are registering within non-critical parameters. The highest-ranked observation case is currently stable.";
        }
      } 
      else {
        // Generic medical smart response using patient analytics
        aiResponseText = `### CARESYNC AI+ Diagnostics Report

I have received your inquiry: *"${text}"*. 

Based on my telemetry database scanning of 20 active ICU patients, I can generate these insights:
* **Current Ward Status:** **${patients.filter(p => p.status === 'Critical').length}** patients in Critical status, **${patients.filter(p => p.status === 'High Risk').length}** in High Risk observation.
* **Telemetry Sync:** 100% active. All telemetry nodes (Heart Rate, SpO₂, Blood Pressure, Temp, Resp Rate) are reporting clean feeds.
* **Suggested Workflow:** If you would like detailed analysis for a specific patient, please ask me something like *"Why is Patient 12 critical?"* or enter their name directly (e.g. *"Show details for Arthur Pendelton"*).`;
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date(),
        text: aiResponseText
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'assistant',
        timestamp: new Date(),
        text: "System refreshed. Ask me any patient inquiry or choose from the quick prompts below."
      }
    ]);
  };

  // Render text containing simple markdown format with lists and bold items
  const renderMessageContent = (msgText: string) => {
    const lines = msgText.split('\n');
    return lines.map((line, idx) => {
      let styledLine = line;
      
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-cyan-300 mt-3 mb-1.5 font-mono uppercase">{line.replace('### ', '')}</h4>;
      }
      
      // Strong text replacements
      // Matches double asterisks and replaces with bold tags
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-white font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Bullets vs ordinary paragraphs
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const remainingStr = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-350 text-xs py-0.5">
            {parts.length > 0 ? parts : remainingStr}
          </li>
        );
      } else if (/^\d+\./.test(line)) {
        return (
          <div key={idx} className="pl-2 text-slate-350 text-xs py-1 leading-relaxed">
            {parts.length > 0 ? parts : line}
          </div>
        );
      }

      return (
        <p key={idx} className="text-slate-300 text-xs leading-relaxed mb-1.5 min-h-[1.2em]">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col h-[650px] relative">
      
      {/* Bot Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2.5 rounded-xl text-slate-950">
            <Bot className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base flex items-center space-x-1.5">
              <span>CARESYNC AI+ Copilot</span>
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">ON-CALL DECISION-SUPPORT TELEMETRY ENGINE</p>
          </div>
        </div>
        
        <button 
          onClick={handleClear}
          className="p-2 bg-slate-950/40 hover:bg-slate-950 text-slate-500 hover:text-red-400 rounded-lg border border-slate-800 transition-all"
          title="Clear Chat Logs"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Queries container */}
      <div className="mb-4">
        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-2">QUICK SUGGESTED INQUIRIES</p>
        <div className="flex flex-wrap gap-2">
          {quickQueries.map((item, id) => (
            <button
              key={id}
              id={`quick-chip-${id}`}
              onClick={() => handleSend(item.query)}
              className="text-[10px] font-semibold bg-cyan-950/40 hover:bg-cyan-950/90 text-cyan-400 hover:text-cyan-300 border border-cyan-900/50 hover:border-cyan-500/40 px-3 py-1.5 rounded-lg transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Logs Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 bg-slate-950/40 border border-slate-850 p-4 rounded-xl">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="h-8 w-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className={`p-4 rounded-2xl max-w-[85%] border text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/40 border-cyan-800/45 text-white' 
                : 'bg-slate-900/50 border-slate-800 text-slate-100 shadow-md'
            }`}>
              <div className="mb-1 text-[9px] font-mono text-slate-400 tracking-wider flex items-center space-x-1">
                <span>{msg.sender === 'user' ? 'PHYSICIAN / CO-PILOT' : 'CARESYNC AGENT'}</span>
                <span>•</span>
                <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <div className="space-y-1">
                {renderMessageContent(msg.text)}
              </div>
            </div>
            {msg.sender === 'user' && (
              <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-cyan-400">
            <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-800/30 flex items-center justify-center text-cyan-400">
              <Bot className="h-4 w-4 animate-bounce" />
            </div>
            <div className="bg-slate-900/50 p-3 border border-slate-800 rounded-xl flex items-center space-x-1.5 text-[10px] font-mono select-none">
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce" />
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-slate-400 text-[9px] tracking-widest pl-1.5 uppercase">Computing clinical prognosis...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(inputVal); }}
        className="flex space-x-2"
      >
        <input
          id="chat-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask AI Copilot about high-risk alerts, drug actions, or clinical codes..."
          className="flex-1 bg-slate-950/80 hover:bg-slate-950 border border-slate-850 focus:border-cyan-500/80 p-3 rounded-xl text-slate-200 placeholder-slate-550 text-xs focus:outline-none transition-all"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
