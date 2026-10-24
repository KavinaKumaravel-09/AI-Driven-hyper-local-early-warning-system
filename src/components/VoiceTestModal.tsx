import React, { useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Square,
  BellRing,
  Globe,
  Radio,
  Sliders,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { SupportedLanguage } from '../types/weather';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { playEmergencySiren, playAttentionChime, speakAlertText, stopAudioAlert } from '../utils/audioAlert';

interface VoiceTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
}

export const VoiceTestModal: React.FC<VoiceTestModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  speechRate,
  onChangeSpeechRate
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);
  const [isPlayingChime, setIsPlayingChime] = useState(false);

  if (!isOpen) return null;

  const testPhrases: Record<SupportedLanguage, string> = {
    en: 'Emergency Weather Warning. Red alert issued for Erode district. High flash flood risk within one hour. Evacuate low-lying river wards immediately.',
    ta: 'அவசர பேரிடர் எச்சரிக்கை. ஈரோடு மாவட்டத்திற்கு சிவப்பு எச்சரிக்கை விடுக்கப்பட்டுள்ளது. அடுத்த ஒரு மணி நேரத்தில் திடீர் வெள்ளப்பெருக்கு ஏற்படும் அபாயம் உள்ளது. கரையோர மக்கள் உடனடியாக பாதுகாப்பான இடங்களுக்கு செல்லவும்.',
    hi: 'आपातकालीन मौसम चेतावनी। ईरोड जिले के लिए रेड अलर्ट जारी किया गया है। अगले एक घंटे में अचानक बाढ़ का अत्यधिक खतरा है। नागरिक तुरंत सुरक्षित स्थानों पर जाएं।',
    ml: 'അടിയന്തര കാലാവസ്ഥാ മുന്നറിയിപ്പ്. ഈറോഡ് ജില്ലയിൽ റെഡ് അലേർട്ട് പ്രഖ്യാപിച്ചു. മിന്നൽ പ്രളയ സാധ്യത ഉള്ളതിനാൽ നദീതീരങ്ങളിൽ ഉള്ളവർ ഉടൻ മാറുക.',
    te: 'అత్యవసర వాతావరణ హెచ్చరిక. ఈరోడ్ జిల్లాకు రెడ్ అలర్ట్ జారీ చేయబడింది. రాబోయే గంటలోపు ఆకస్మిక వరద ప్రమాదం ఉంది. ప్రజలు తక్షణమే సురక్షిత ప్రాంతాలకు వెళ్ళాలి.'
  };

  const handleTestSiren = async () => {
    setIsPlayingSiren(true);
    await playEmergencySiren(2400);
    setIsPlayingSiren(false);
  };

  const handleTestChime = async () => {
    setIsPlayingChime(true);
    await playAttentionChime();
    setIsPlayingChime(false);
  };

  const handleTestVoice = (lang: SupportedLanguage) => {
    stopAudioAlert();
    setIsPlayingVoice(true);
    const phrase = testPhrases[lang];

    speakAlertText(
      phrase,
      lang,
      speechRate,
      () => setIsPlayingVoice(true),
      () => setIsPlayingVoice(false)
    );
  };

  const handleStopAll = () => {
    stopAudioAlert();
    setIsPlayingVoice(false);
    setIsPlayingSiren(false);
    setIsPlayingChime(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Voice & Sound Alert Testing Studio
              </h3>
              <p className="text-xs text-slate-400">
                CAP-Compliant Synthesizer & Civil Defense Sirens
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleStopAll();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Audio Chime and Siren Trigger Buttons */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              Emergency Sound Synthesis (Web Audio API)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleTestSiren}
                disabled={isPlayingSiren}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <BellRing className={`w-4 h-4 text-rose-600 ${isPlayingSiren ? 'animate-bounce' : ''}`} />
                <span>{isPlayingSiren ? 'Sounding Siren...' : 'Civil Defense Siren'}</span>
              </button>

              <button
                onClick={handleTestChime}
                disabled={isPlayingChime}
                className="p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Radio className={`w-4 h-4 text-blue-600 ${isPlayingChime ? 'animate-spin' : ''}`} />
                <span>{isPlayingChime ? 'Playing Chime...' : 'CAP Attention Chime'}</span>
              </button>
            </div>
          </div>

          {/* Multilingual Voice Testing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Multilingual Voice Dispatch (5 Indian Languages)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Web Speech API</span>
            </div>

            <div className="space-y-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isCurrent = selectedLanguage === lang.code;
                return (
                  <div
                    key={lang.code}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{lang.nativeName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">({lang.label})</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-600 text-[10px] font-bold text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Voice Code: {lang.speechCode}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectLanguage(lang.code);
                          handleTestVoice(lang.code);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Speak Sample</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speech Rate Adjustment */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Speech Cadence / Speed:</span>
            <div className="flex items-center gap-1.5">
              {[0.8, 0.95, 1.1].map((r) => (
                <button
                  key={r}
                  onClick={() => onChangeSpeechRate(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition ${
                    speechRate === r
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r === 0.95 ? 'Standard (0.95x)' : `${r}x`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleStopAll}
            className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop All Audio</span>
          </button>

          <button
            onClick={() => {
              handleStopAll();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
