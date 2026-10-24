import { LanguageOption, SupportedLanguage, WeatherAlert, RiskLevel } from '../types/weather';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    speechCode: 'en-IN',
    flag: '🇮🇳'
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeName: 'தமிழ்',
    speechCode: 'ta-IN',
    flag: '🇮🇳'
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    flag: '🇮🇳'
  },
  {
    code: 'ml',
    label: 'Malayalam',
    nativeName: 'മലയാളം',
    speechCode: 'ml-IN',
    flag: '🇮🇳'
  },
  {
    code: 'te',
    label: 'Telugu',
    nativeName: 'తెలుగు',
    speechCode: 'te-IN',
    flag: '🇮🇳'
  }
];

export const RISK_TRANSLATIONS: Record<RiskLevel, Record<SupportedLanguage, string>> = {
  LOW: {
    en: 'Low Risk',
    ta: 'குறைந்த அபாயம்',
    hi: 'कम जोखिम',
    ml: 'കുറഞ്ഞ അപകടസാധ്യത',
    te: 'తక్కువ ప్రమాదం'
  },
  MODERATE: {
    en: 'Moderate Risk',
    ta: 'மிதமான அபாயம்',
    hi: 'मध्यम जोखिम',
    ml: 'മിതമായ അപകടസാധ്യത',
    te: 'మితమైన ప్రమాదం'
  },
  HIGH: {
    en: 'High Risk (Orange Alert)',
    ta: 'அதிக அபாயம் (ஆரஞ்சு எச்சரிக்கை)',
    hi: 'उच्च जोखिम (ऑरेंज अलर्ट)',
    ml: 'ഉയർന്ന അപകടസാധ്യത (ഓറഞ്ച് അലേർട്ട്)',
    te: 'అధిక ప్రమాదం (ఆరెంజ్ అలర్ట్)'
  },
  VERY_HIGH: {
    en: 'Very High Risk (Red Alert)',
    ta: 'மிக அதிக அபாயம் (சிவப்பு எச்சரிக்கை)',
    hi: 'अत्यधिक उच्च जोखिम (रेड अलर्ट)',
    ml: 'വളരെ ഉയർന്ന അപകടസാധ്യത (റെഡ് അലേർട്ട്)',
    te: 'తీవ్రమైన ప్రమాదం (రెడ్ అలర్ట్)'
  }
};

export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    voiceAlert: 'Voice Alert',
    playVoice: 'Play Voice Alert',
    stopVoice: 'Stop Voice',
    testingSiren: 'Test Siren',
    offlineMode: 'Offline Mode',
    onlineMode: 'Online Mode',
    offlineBanner: 'Disaster Offline Mode active. Operating on local cached telemetry & GIS maps.',
    syncPending: 'Sync Pending Alerts',
    installApp: 'Install App',
    emergencyBroadcast: 'Issue Emergency Broadcast',
    activeAlerts: 'Active Warnings',
    disseminationChannels: 'Dissemination Channels',
    leadTimeHorizon: 'Advance Lead Time',
    evacuationAdvisory: 'Action Directive / Advisory',
    affectedPop: 'Population at Risk',
    expectedArrival: 'Expected Arrival',
    languageSelect: 'Language'
  },
  ta: {
    voiceAlert: 'குரல் எச்சரிக்கை',
    playVoice: 'குரல் எச்சரிக்கையைக் கேட்கவும்',
    stopVoice: 'குரலை நிறுத்தவும்',
    testingSiren: 'சைரன் சோதனை',
    offlineMode: 'ஆஃப்லைன் முறை',
    onlineMode: 'ஆன்லைன் முறை',
    offlineBanner: 'பேரிடர் ஆஃப்லைன் முறை இயக்கத்தில் உள்ளது. சேமிக்கப்பட்ட மேப் மற்றும் விவரங்கள் பயன்பாட்டில் உள்ளன.',
    syncPending: 'நிலுவையில் உள்ள எச்சரிக்கைகளை ஒத்திசைக்கவும்',
    installApp: 'செயலியை நிறுவுங்கள்',
    emergencyBroadcast: 'அவசர எச்சரிக்கை ஒளிபரப்பு',
    activeAlerts: 'தீவிர எச்சரிக்கைகள்',
    disseminationChannels: 'எச்சரிக்கை வழிகள்',
    leadTimeHorizon: 'முன்னறிவிப்பு அவகாசம்',
    evacuationAdvisory: 'பாதுகாப்பு மற்றும் வெளியேற்ற வழிகாட்டுதல்',
    affectedPop: 'பாதிக்கப்படும் மக்கள் தொகை',
    expectedArrival: 'எதிர்பார்க்கப்படும் நேரம்',
    languageSelect: 'மொழி'
  },
  hi: {
    voiceAlert: 'ध्वनि चेतावनी',
    playVoice: 'आवाज चेतावनी सुनें',
    stopVoice: 'आवाज बंद करें',
    testingSiren: 'सायरन परीक्षण',
    offlineMode: 'ऑफ़लाइन मोड',
    onlineMode: 'ऑनलाइन मोड',
    offlineBanner: 'आपदा ऑफ़लाइन मोड सक्रिय। स्थानीय रूप से संग्रहीत डेटा और जीआईएस मानचित्रों का उपयोग किया जा रहा है।',
    syncPending: 'लंबित अलर्ट सिंक करें',
    installApp: 'ऐप इंस्टॉल करें',
    emergencyBroadcast: 'आपातकालीन चेतावनी जारी करें',
    activeAlerts: 'सक्रिय चेतावनियाँ',
    disseminationChannels: 'प्रसारण माध्यम',
    leadTimeHorizon: 'अग्रिम चेतावनी समय',
    evacuationAdvisory: 'सुरक्षा एवं निकासी निर्देश',
    affectedPop: 'प्रभावित संभावित आबादी',
    expectedArrival: 'अपेक्षित समय',
    languageSelect: 'भाषा'
  },
  ml: {
    voiceAlert: 'വോയ്‌സ് മുന്നറിയിപ്പ്',
    playVoice: 'ശബ്ദ മുന്നറിയിപ്പ് കേൾക്കുക',
    stopVoice: 'നിർത്തുക',
    testingSiren: 'സൈറൻ പരീക്ഷണം',
    offlineMode: 'ഓഫ്‌ലൈൻ മോഡ്',
    onlineMode: 'ഓൺലൈൻ മോഡ്',
    offlineBanner: 'ദുരന്ത നിവാരണ ഓഫ്‌ലൈൻ മോഡ് സജീവം. മുൻകൂട്ടി സംഭരിച്ച മാപ്പുകളും വിവരങ്ങളും ഉപയോഗിക്കുന്നു.',
    syncPending: 'മുന്നറിയിപ്പുകൾ സമന്വയിപ്പിക്കുക',
    installApp: 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക',
    emergencyBroadcast: 'അടിയന്തര മുന്നറിയിപ്പ് നൽകുക',
    activeAlerts: 'സജീവ മുന്നറിയിപ്പുകൾ',
    disseminationChannels: 'വിതരണ ചാനലുകൾ',
    leadTimeHorizon: 'മുന്നറിയിപ്പ് സമയം',
    evacuationAdvisory: 'സുരക്ഷാ നിർദ്ദേശങ്ങൾ',
    affectedPop: 'സാധ്യതാ ജനസംഖ്യ',
    expectedArrival: 'പ്രതീക്ഷിക്കുന്ന സമയം',
    languageSelect: 'ഭാഷ'
  },
  te: {
    voiceAlert: 'వాయిస్ అలర్ట్',
    playVoice: 'వాయిస్ అలర్ట్ వినండి',
    stopVoice: 'వాయిస్ ఆపండి',
    testingSiren: 'సైరన్ పరీక్ష',
    offlineMode: 'ఆఫ్‌లైన్ మోడ్',
    onlineMode: 'ఆన్‌లైన్ మోడ్',
    offlineBanner: 'విపత్తు ఆఫ్‌లైన్ మోడ్ సక్రియం. స్థానిక కాష్ డేటా మరియు మ్యాప్‌లు అందుబాటులో ఉన్నాయి.',
    syncPending: 'పెండింగ్ అలర్ట్‌లను సమకాలీకరించండి',
    installApp: 'యాప్‌ను ఇన్‌స్టాల్ చేయండి',
    emergencyBroadcast: 'అత్యవసర హెచ్చరిక జారీ చేయండి',
    activeAlerts: 'క్రియాశీల హెచ్చరికలు',
    disseminationChannels: 'ప్రసార మాధ్యమాలు',
    leadTimeHorizon: 'ముందస్తు సమయం',
    evacuationAdvisory: 'రక్షణ మరియు తరలింపు మార్గదర్శకాలు',
    affectedPop: 'ప్రమాదంలో ఉన్న జనాభా',
    expectedArrival: 'రాక సమయం',
    languageSelect: 'భాష'
  }
};

// Built-in translations dictionary for mock alerts by ID
export const ALERT_TRANSLATIONS_DB: Record<string, Record<SupportedLanguage, {
  weatherEvent: string;
  instruction: string;
  expectedTime: string;
  speechText: string;
}>> = {
  'ALT-1024': {
    en: {
      weatherEvent: 'Heavy Rainfall & Cloudburst Warning',
      instruction: 'Severe convective cloud cell detected approaching Siruvani & Western foothills. Flood gates at Valankulam monitored. Move residents in low-lying underpasses to shelters.',
      expectedTime: 'Within 1 hour 45 minutes',
      speechText: 'Emergency Weather Warning. High risk alert for Coimbatore. Heavy rainfall and cloudburst likely within two hours. Please avoid underpasses and low-lying areas near Noyyal basin.'
    },
    ta: {
      weatherEvent: 'அதிதீவிர கனமழை மற்றும் மேகவெடிப்பு எச்சரிக்கை',
      instruction: 'சிறுவாணி மற்றும் மேற்கு தொடர்ச்சி மலை அடிவாரப் பகுதிகளில் தீவிர மழை மேகங்கள் சூழ்ந்துள்ளன. வாலாங்குளம் உபரி நீர் கண்காணிக்கப்படுகிறது. தாழ்வான பகுதியில் உள்ள மக்கள் உடனடியாக பாதுகாப்பு மையங்களுக்கு செல்லவும்.',
      expectedTime: '1 மணி 45 நிமிடங்களுக்குள்',
      speechText: 'அவசர வானிலை எச்சரிக்கை. கோயம்புத்தூர் மாவட்டத்திற்கு ஆரஞ்சு எச்சரிக்கை விடுக்கப்பட்டுள்ளது. அடுத்த இரண்டு மணி நேரத்தில் மிகக் கனமழை பெய்ய வாய்ப்புள்ளது. தாழ்வான பகுதிகள் மற்றும் பாலங்களின் அடியில் செல்வதை தவிர்க்கவும்.'
    },
    hi: {
      weatherEvent: 'अति भारी वर्षा एवं बादलों का फटना',
      instruction: 'सिरुवाणी और पश्चिमी तलहटी की ओर तीव्र वर्षा मेघ बढ़ रहे हैं। नीचले इलाकों और जलभराव वाले रास्तों से दूर रहें एवं सुरक्षित आश्रयों में पहुंचे।',
      expectedTime: '1 घंटे 45 मिनट के भीतर',
      speechText: 'आपातकालीन मौसम चेतावनी। कोयंबटूर जिले के लिए भारी वर्षा की उच्च जोखिम चेतावनी। अगले दो घंटों में मूसलाधार बारिश की संभावना है। कृपया सुरक्षित स्थानों पर रहें।'
    },
    ml: {
      weatherEvent: 'അതിശക്തമായ മഴ മുന്നറിയിപ്പ്',
      instruction: 'സിരുവാണി മലനിരകളിൽ അതിശക്തമായ മഴയ്ക്ക് സാധ്യത. താഴ്ന്ന പ്രദേശങ്ങളിലെ താമസക്കാർ സുരക്ഷിത സ്ഥാനങ്ങളിലേക്ക് മാറണം.',
      expectedTime: '1 മണിക്കൂർ 45 മിനിറ്റിനുള്ളിൽ',
      speechText: 'അടിയന്തര കാലാവസ്ഥാ മുന്നറിയിപ്പ്. കോയമ്പത്തൂർ ജില്ലയിൽ അടുത്ത രണ്ട് മണിക്കൂറിനുള്ളിൽ അതിശക്തമായ മഴയ്ക്ക് സാധ്യത. ജാഗ്രത പാലിക്കുക.'
    },
    te: {
      weatherEvent: 'భారీ వర్షపాతం హెచ్చరిక',
      instruction: 'సిరువాణి కొండ ప్రాంతాలలో తీవ్రమైన మేఘాలు కేంద్రీకృతమయ్యాయి. లోతట్టు ప్రాంతాల ప్రజలు సురక్షిత ప్రాంతాలకు తరలి వెళ్ళాలి.',
      expectedTime: '1 గంట 45 నిమిషాల్లో',
      speechText: 'అత్యవసర వాతావరణ హెచ్చరిక. కోయంబత్తూరు పరిసర ప్రాంతాలలో రాబోయే రెండు గంటల్లో భారీ వర్షం కురిసే అవకాశం ఉంది. లోతట్టు ప్రాంతాల ప్రజలు అప్రమత్తంగా ఉండండి.'
    }
  },
  'ALT-1022': {
    en: {
      weatherEvent: 'Flash Flood Risk & River Surges',
      instruction: 'Cloudburst threshold crossed over Bhavanisagar catchment. Immediate evacuation order for riverside wards and agricultural settlements along Cauvery.',
      expectedTime: 'Within 1 hour',
      speechText: 'Flash flood red alert for Erode district. Bhavanisagar water inflow is surging rapidly. Immediate evacuation required for Cauvery and Bhavani riverside wards.'
    },
    ta: {
      weatherEvent: 'திடீர் வெள்ளப்பெருக்கு & பவானி ஆற்று எச்சரிக்கை',
      instruction: 'பவானிசாகர் நீர்ப்பிடிப்பு பகுதியில் மேகவெடிப்பு பதிவாகியுள்ளது. காவிரி மற்றும் பவானி ஆற்றங்கரையோர குடியிருப்பு மக்கள் உடனடியாக பாதுகாப்பான மேடான இடங்களுக்கு செல்லுமாறு உத்தரவிடப்படுகிறது.',
      expectedTime: '1 மணி நேரத்திற்குள்',
      speechText: 'அதிதீவிர வெள்ள எச்சரிக்கை. ஈரோடு மாவட்டத்திற்கு சிவப்பு எச்சரிக்கை விடுக்கப்பட்டுள்ளது. பவானிசாகர் மற்றும் காவிரி ஆற்றில் திடீர் வெள்ளப்பெருக்கு ஏற்படும் அபாயம் உள்ளது. கரையோர மக்கள் உடனடியாக வெளியேறவும்.'
    },
    hi: {
      weatherEvent: 'अचानक बाढ़ का खतरा (फ्लैश फ्लड)',
      instruction: 'भवानीसागर जलग्रहण क्षेत्र में बादल फटने का स्तर पार हो गया है। कावेरी और भवानी नदी के किनारे रहने वाले बस्तियों को तत्काल खाली करने का आदेश।',
      expectedTime: '1 घंटे के भीतर',
      speechText: 'ईरोड जिले के लिए अचानक बाढ़ की रेड अलर्ट चेतावनी। कावेरी और भवानी नदी के किनारे के नागरिक तुरंत सुरक्षित ऊंचाई वाले स्थानों पर जाएं।'
    },
    ml: {
      weatherEvent: 'മിന്നൽ പ്രളയ സാധ്യത',
      instruction: 'ഭവാനി സാഗർ വൃഷ്ടിപ്രദേശത്ത് മേഘവിസ്ഫോടനം. നദീതീരങ്ങളിൽ ഉള്ളവർ ഉടൻ സുരക്ഷിത സ്ഥാനങ്ങളിലേക്ക് മാറുക.',
      expectedTime: '1 മണിക്കൂറിനുള്ളിൽ',
      speechText: 'ഈറോഡ് ജില്ലയിൽ മിന്നൽ പ്രളയ റെഡ് അലേർട്ട്. ഭവാനി, കാവേരി നദീതീരങ്ങളിൽ ഉള്ളവർ ഉടൻ മാറിത്താമസിക്കുക.'
    },
    te: {
      weatherEvent: 'ఆకస్మిక వరద ప్రమాదం',
      instruction: 'భవానిసాగర్ పరివాహక ప్రాంతంలో ఆకస్మిక వరద ఉధృతి. కావేరి మరియు భవాని నదీ తీర ప్రజలు వెంటనే ఖాళీ చేసి సురక్షిత ప్రాంతాలకు వెళ్లాలి.',
      expectedTime: '1 గంటలోపు',
      speechText: 'ఈరోడ్ జిల్లాకు ఆకస్మిక వరదల రెడ్ అలర్ట్. నదీ పరీవాహక ప్రాంతాల ప్రజలు తక్షణమే సురక్షిత ప్రదేశాలకు చేరుకోవాలి.'
    }
  },
  'ALT-1021': {
    en: {
      weatherEvent: 'Landslide Warning (Ghat Roads)',
      instruction: 'Critical pore water pressure exceeded in slope sensors along Coonoor ghats. Transit suspended on Mettupalayam-Coonoor highway. Pre-position SDRF earthmovers.',
      expectedTime: 'Within 2 hours',
      speechText: 'Critical landslide red alert for Nilgiris and Coonoor ghats. Road transit is suspended. Stay away from steep mountain slopes.'
    },
    ta: {
      weatherEvent: 'மண்சரிவு அபாய எச்சரிக்கை (மலைப்பாதை)',
      instruction: 'குன்னூர் மலைப்பாதை சென்சார்களில் ஆபத்து அளவு தாண்டியுள்ளது. மேட்டுப்பாளையம்-குன்னூர் சாலையில் அனைத்து போக்குவரத்துகளும் நிறுத்தப்பட்டுள்ளன. பேரிடர் மீட்புப் படையினர் விரைந்துள்ளனர்.',
      expectedTime: '2 மணி நேரத்திற்குள்',
      speechText: 'நீலகிரி மற்றும் குன்னூர் மலைப்பகுதிக்கு தீவிர மண்சரிவு சிவப்பு எச்சரிக்கை. மலைப்பாதைகளில் போக்குவரத்து தடை செய்யப்பட்டுள்ளது. செங்குத்தான சரிவுகளின் அருகே செல்ல வேண்டாம்.'
    },
    hi: {
      weatherEvent: 'भूस्खलन की गंभीर चेतावनी',
      instruction: 'कुन्नूर घाट पर ढलान सेंसर में अत्यधिक जल दबाव दर्ज किया गया है। मेट्टुपालयम-कुन्नूर राष्ट्रीय राजमार्ग पर यातायात निलंबित।',
      expectedTime: '2 घंटे के भीतर',
      speechText: 'नीलगिरि जिले के लिए भूस्खलन की रेड अलर्ट चेतावनी। घाट मार्गों पर आवागमन बंद कर दिया गया है। पहाड़ी ढलानों से दूर रहें।'
    },
    ml: {
      weatherEvent: 'ഉരുൾപൊട്ടൽ / മണ്ണിടിച്ചിൽ മുന്നറിയിപ്പ്',
      instruction: 'കുന്നൂർ ചുരത്തിൽ മണ്ണിടിച്ചിൽ സാധ്യത അതീവ ഗുരുതരം. ചുരം വഴിയുള്ള ഗതാഗതം പൂർണ്ണമായി നിരോധിച്ചു.',
      expectedTime: '2 മണിക്കൂറിനുള്ളിൽ',
      speechText: 'നീലഗിരി കുന്നൂർ മേഖലയിൽ ഉരുൾപൊട്ടൽ റെഡ് അലേർട്ട്. മലയോര പാതകളിലൂടെയുള്ള യാത്ര ഒഴിവാക്കുക.'
    },
    te: {
      weatherEvent: 'కొండచరియలు విరిగిపడే ప్రమాదం',
      instruction: 'కూనూర్ ఘాట్ రోడ్డులో కొండచరియలు విరిగిపడే ప్రమాదం ఉంది. మెట్టుపాళయం-కూనూర్ మార్గంలో రాకపోకలు నిలిపివేయబడ్డాయి.',
      expectedTime: '2 గంటల్లోపు',
      speechText: 'నీలగిరి ఘాట్ ప్రాంతానికి కొండచరియల రెడ్ అలర్ట్. పర్వత రహదారులపై ప్రయాణాలు నిలిపివేయబడ్డాయి.'
    }
  },
  'ALT-1023': {
    en: {
      weatherEvent: 'Severe Thunderstorm & Lightning',
      instruction: 'Intense electrical activity and localized squalls projected. Workers advised to refrain from open machinery handling and avoid open metal shelters.',
      expectedTime: 'Within 3 hours',
      speechText: 'Thunderstorm and lightning alert for Tiruppur. Lightning strikes likely in industrial belts. Remain indoors.'
    },
    ta: {
      weatherEvent: 'இடி மின்னலுடன் கூடிய பலத்த புயல் காற்று',
      instruction: 'திருப்பூர் தொழிற்பேட்டை பகுதிகளில் தீவிர மின்னல் மற்றும் காற்று வீசக்கூடும். திறந்த வெளியில் மின் சாதனங்கள் இயக்குவதை தவிர்க்கவும்.',
      expectedTime: '3 மணி நேரத்திற்குள்',
      speechText: 'திருப்பூர் பகுதிக்கு இடி மின்னல் எச்சரிக்கை. அடுத்த மூன்று மணி நேரத்தில் பலத்த காற்றுடன் மின்னல் தாக்க வாய்ப்புள்ளது. பொதுமக்கள் பாதுகாப்பான கட்டிடங்களுக்குள் இருக்கவும்.'
    },
    hi: {
      weatherEvent: 'गरज-चमक के साथ आंधी-तूफान',
      instruction: 'तीव्र आकाशीय बिजली और आंधी का अनुमान। खुले में मशीनों के संचालन से बचें और पक्के भवनों में शरण लें।',
      expectedTime: '3 घंटे के भीतर',
      speechText: 'तिरुपूर जिले के लिए आंधी और बिजली गिरने का अलर्ट। खुले स्थानों में न जाएं, घरों में सुरक्षित रहें।'
    },
    ml: {
      weatherEvent: 'ഇടിമിന്നലും ശക്തമായ കാറ്റും',
      instruction: 'തീവ്രമായ ഇടിമിന്നലിന് സാധ്യത. തുറസ്സായ സ്ഥലങ്ങളിൽ യന്ത്രങ്ങൾ പ്രവർത്തിപ്പിക്കരുത്.',
      expectedTime: '3 മണിക്കൂറിനുള്ളിൽ',
      speechText: 'തിരുപ്പൂരിൽ ശക്തമായ ഇടിമിന്നൽ മുന്നറിയിപ്പ്. ജനങ്ങൾ സുരക്ഷിതമായി വീടുകളിൽ കഴിയുക.'
    },
    te: {
      weatherEvent: 'ఉరుములు మరియు మెరుపులతో కూడిన గాలివాన',
      instruction: 'తీవ్రమైన మెరుపులు మరియు ఈదురు గాలులు వీచే అవకాశం ఉంది. పరిశ్రమలలో బహిరంగంగా పనులు చేయరాదు.',
      expectedTime: '3 గంటల్లోపు',
      speechText: 'తిరుప్పూర్ ప్రాంతానికి ఉరుములు మెరుపుల హెచ్చరిక. ప్రజలు సురక్షితమైన భవనాల్లో ఉండాలి.'
    }
  },
  'ALT-1020': {
    en: {
      weatherEvent: 'Coastal High Wind & Sea Surge',
      instruction: 'Coastal squalls reaching 55 km/h. Fishing boats anchored at Devanampattinam and Silver Beach instructed to secure moorings.',
      expectedTime: 'Within 2 hours 15 minutes',
      speechText: 'Coastal high wind warning for Cuddalore. Gusts exceeding 55 km/h. Fishermen must not venture into the sea.'
    },
    ta: {
      weatherEvent: 'கடலோர தீவிர சூறாவளி காற்று & கடல் கொந்தளிப்பு',
      instruction: 'மணிக்கு 55 கி.மீ வேகத்தில் பலத்த காற்று வீசக்கூடும். தேவநாம்பட்டினம் மற்றும் சில்வர் பீச் படகுகளை பாதுகாப்பாக கட்டி வைக்க உத்தரவிடப்பட்டுள்ளது. மீனவர்கள் கடலுக்கு செல்ல வேண்டாம்.',
      expectedTime: '2 மணி 15 நிமிடங்களுக்குள்',
      speechText: 'கடலூர் கடலோரப் பகுதிக்கு தீவிர காற்று எச்சரிக்கை. கடல் அலைகள் சீற்றத்துடன் காணப்படும். மீனவர்கள் கடலுக்கு செல்ல வேண்டாம்.'
    },
    hi: {
      weatherEvent: 'तटीय तेज हवाएं एवं समुद्री लहरें',
      instruction: 'तट पर हवा की गति 55 किमी/घंटा तक पहुंचने की संभावना। मछुआरे समुद्र में न जाएं और नौकाओं को सुरक्षित बांधें।',
      expectedTime: '2 घंटे 15 मिनट के भीतर',
      speechText: 'कुड्डालोर तट के लिए तेज हवाओं की चेतावनी। 55 किमी प्रति घंटा की रफ्तार से हवाएं चलेंगी। समुद्र में न उतरें।'
    },
    ml: {
      weatherEvent: 'തീരദേശ ശക്തമായ കാറ്റും കടൽക്ഷോഭവും',
      instruction: 'മണിക്കൂറിൽ 55 കി.മീ വേഗതയിൽ കാറ്റടിക്കാൻ സാധ്യത. മത്സ്യത്തൊഴിലാളികൾ കടലിൽ പോകരുത്.',
      expectedTime: '2 മണിക്കൂർ 15 മിനിറ്റിനുള്ളിൽ',
      speechText: 'കടലൂർ തീരത്ത് ശക്തമായ കാറ്റ് മുന്നറിയിപ്പ്. മത്സ്യബന്ധനം ഒഴിവാക്കുക.'
    },
    te: {
      weatherEvent: 'తీరప్రాంత ఈదురు గాలులు మరియు సముద్రపు అలల ఉధృతి',
      instruction: 'తీరప్రాంతంలో గంటకు 55 కిమీ వేగంతో గాలులు వీస్తాయి. మత్స్యకారులు వేటకు వెళ్ళరాదు.',
      expectedTime: '2 గంటల 15 నిమిషాల్లో',
      speechText: 'కడలూరు తీరప్రాంతానికి తీవ్రమైన గాలుల హెచ్చరిక. మత్స్యకారులు సముద్రంలోకి వెళ్లవద్దు.'
    }
  }
};

/**
 * Returns localized text for an alert based on selected language
 */
export function getAlertContent(alert: WeatherAlert, lang: SupportedLanguage) {
  // 1. Direct translation DB lookup
  const dbEntry = ALERT_TRANSLATIONS_DB[alert.id]?.[lang];
  if (dbEntry) {
    return {
      weatherEvent: dbEntry.weatherEvent,
      instruction: dbEntry.instruction,
      expectedTime: dbEntry.expectedTime,
      speechText: dbEntry.speechText
    };
  }

  // 2. Custom translation object stored on the alert itself
  if (alert.translations && alert.translations[lang]) {
    const t = alert.translations[lang]!;
    return {
      weatherEvent: t.weatherEvent || alert.weatherEvent,
      instruction: t.instruction || alert.instruction,
      expectedTime: t.expectedTime || alert.expectedTime,
      speechText: t.speechText || `${alert.risk} warning for ${alert.location}: ${alert.instruction}`
    };
  }

  // 3. Fallback: English / Original content
  const riskLabel = RISK_TRANSLATIONS[alert.risk]?.[lang] || alert.risk;
  return {
    weatherEvent: alert.weatherEvent,
    instruction: alert.instruction,
    expectedTime: alert.expectedTime,
    speechText: `Emergency Weather Warning. ${riskLabel} for ${alert.location}, ${alert.district}. ${alert.weatherEvent}. Expected: ${alert.expectedTime}. Guidance: ${alert.instruction}`
  };
}
