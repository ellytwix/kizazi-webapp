import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Load saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('app_language');
    if (savedLang && languages[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    sw: { name: 'Kiswahili', flag: '🇹🇿' },
    lg: { name: 'Luganda', flag: '🇺🇬' },
    fr: { name: 'Français', flag: '🇫🇷' },
    rw: { name: 'Kinyarwanda', flag: '🇷🇼' }
  };

  const translations = {
    en: {
      // Navigation & UI
      welcome: 'Welcome to KizaziSocial',
      selectRegion: 'Select Your Region',
      chooseExperience: 'Choose Your Experience',
      demoMode: 'Demo Mode',
      fullAccess: 'Full Access',
      exploreFeatures: 'Explore features with sample data',
      createAccount: 'Create account and manage real campaigns',
      getStarted: 'Get Started',
      
      // Menu items
      dashboard: 'Dashboard',
      aiContent: 'AI Content',
      postScheduler: 'Post Scheduler',
      analytics: 'Analytics',
      pricing: 'Pricing',
      support: 'Support',
      
      // Dashboard
      welcomeBack: 'Welcome back',
      socialMediaOverview: 'Here\'s your social media overview',
      scheduledPosts: 'Scheduled Posts',
      totalReach: 'Total Reach',
      followers: 'Followers',
      revenue: 'Revenue',
      noPosts: 'No posts yet',
      startCreating: 'Start creating content to see your posts here',
      createFirstPost: 'Create Your First Post',
      
      // AI Content
      aiContentGenerator: 'AI Content Generator',
      createEngaging: 'Create engaging content with Gemini AI',
      describeContent: 'Describe what content you want to create:',
      generateContent: 'Generate Content',
      generatedContent: 'Generated Content:',
      copyToClipboard: 'Copy to Clipboard',
      
      // Post Scheduler
      manageSchedule: 'Manage and schedule your upcoming posts',
      downloadCalendar: 'Download Calendar',
      newPost: 'New Post',
      noScheduled: 'No scheduled posts',
      scheduleFirst: 'Schedule your first post to get started',
      scheduleFirstPost: 'Schedule Your First Post',
      
      // Pricing
      choosePlan: 'Choose Your Plan',
      flexiblePricing: 'Flexible pricing for',
      mostPopular: 'Most Popular',
      paymentMethods: 'Payment Methods Available in',
      securePayments: 'Secure payments powered by trusted mobile money providers',
      
      // Forms
      login: 'Login',
      signUp: 'Sign Up',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      processing: 'Processing...',
      dontHaveAccount: 'Don\'t have an account?',
      alreadyHaveAccount: 'Already have an account?',
      
      // Regions & Currency
      kenya: 'Kenya',
      tanzania: 'Tanzania',
      kenyanShilling: 'Kenyan Shilling pricing',
      tanzanianShilling: 'Tanzanian Shilling pricing',
      
      // Common actions
      continue: 'Continue',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      
      // Status messages
      settingUpRegion: 'Setting up your region...',
      loading: 'Loading...',
      generatingAI: 'Generating with AI...',
      selected: 'Selected! Processing...',
      
      // Post creation
      createPost: 'Create Post',
      postContent: 'Post Content',
      selectPlatform: 'Select Platform',
      scheduleTime: 'Schedule Time',
      publishNow: 'Publish Now',
      scheduleLater: 'Schedule for Later',
      postCreated: 'Post created successfully!',
      postScheduled: 'Post scheduled successfully!'
    },
    
    sw: {
      // Navigation & UI
      welcome: 'Karibu KizaziSocial',
      selectRegion: 'Chagua Mkoa Wako',
      chooseExperience: 'Chagua Uzoefu Wako',
      demoMode: 'Hali ya Jaribio',
      fullAccess: 'Ufikiaji Kamili',
      exploreFeatures: 'Chunguza vipengele na data ya mfano',
      createAccount: 'Unda akaunti na usimamie kampeni halisi',
      getStarted: 'Anza',
      
      // Menu items
      dashboard: 'Dashibodi',
      aiContent: 'Maudhui ya AI',
      postScheduler: 'Mpangaji wa Machapisho',
      analytics: 'Uchambuzi',
      pricing: 'Bei',
      support: 'Msaada',
      
      // Dashboard
      welcomeBack: 'Karibu tena',
      socialMediaOverview: 'Hii ni muhtasari wa mitandao yako ya kijamii',
      scheduledPosts: 'Machapisho Yaliyopangwa',
      totalReach: 'Jumla ya Kufikia',
      followers: 'Wafuasi',
      revenue: 'Mapato',
      noPosts: 'Hakuna machapisho bado',
      startCreating: 'Anza kuunda maudhui ili kuona machapisho yako hapa',
      createFirstPost: 'Unda Chapisho Lako la Kwanza',
      
      // AI Content
      aiContentGenerator: 'Kizalishi cha Maudhui ya AI',
      createEngaging: 'Unda maudhui yanayovutia na Gemini AI',
      describeContent: 'Eleza maudhui unayotaka kuunda:',
      generateContent: 'Zalisha Maudhui',
      generatedContent: 'Maudhui Yaliyozalishwa:',
      copyToClipboard: 'Nakili kwenye Ubao wa Kunakili',
      
      // Post Scheduler
      manageSchedule: 'Simamia na upange machapisho yako yanayokuja',
      downloadCalendar: 'Pakua Kalenda',
      newPost: 'Chapisho Jipya',
      noScheduled: 'Hakuna machapisho yaliyopangwa',
      scheduleFirst: 'Panga chapisho lako la kwanza ili kuanza',
      scheduleFirstPost: 'Panga Chapisho Lako la Kwanza',
      
      // Pricing
      choosePlan: 'Chagua Mpango Wako',
      flexiblePricing: 'Bei zinazobadilika kwa',
      mostPopular: 'Maarufu Zaidi',
      paymentMethods: 'Njia za Malipo Zinazopatikana',
      securePayments: 'Malipo salama yanayoendeshwa na watoa huduma wa simu wa kuaminika',
      
      // Forms
      login: 'Ingia',
      signUp: 'Jisajili',
      register: 'Sajili',
      email: 'Barua pepe',
      password: 'Nywila',
      fullName: 'Jina Kamili',
      processing: 'Inachakata...',
      dontHaveAccount: 'Huna akaunti?',
      alreadyHaveAccount: 'Una akaunti tayari?',
      
      // Regions & Currency
      kenya: 'Kenya',
      tanzania: 'Tanzania',
      kenyanShilling: 'Bei za Shilingi ya Kenya',
      tanzanianShilling: 'Bei za Shilingi ya Tanzania',
      
      // Common actions
      continue: 'Endelea',
      cancel: 'Ghairi',
      save: 'Hifadhi',
      delete: 'Futa',
      edit: 'Hariri',
      close: 'Funga',
      
      // Status messages
      settingUpRegion: 'Inaanzisha mkoa wako...',
      loading: 'Inapakia...',
      generatingAI: 'Inazalisha na AI...',
      selected: 'Imechaguliwa! Inachakata...',
      
      // Post creation
      createPost: 'Unda Chapisho',
      postContent: 'Maudhui ya Chapisho',
      selectPlatform: 'Chagua Jukwaa',
      scheduleTime: 'Panga Wakati',
      publishNow: 'Chapisha Sasa',
      scheduleLater: 'Panga kwa Baadaye',
      postCreated: 'Chapisho limeundwa kwa ufanisi!',
      postScheduled: 'Chapisho limepangwa kwa ufanisi!'
    },
    
    lg: {
      // Navigation & UI
      welcome: 'Tusanyuse ku KizaziSocial',
      selectRegion: 'Londako Ekitundu Kyo',
      chooseExperience: 'Londako Obumanyirivu Bwo',
      demoMode: 'Engeri ya Okugezesa',
      fullAccess: 'Okutuuka Okujjuvu',
      exploreFeatures: 'Noonyereza ebitundu n\'obubaka obw\'ekyokulabirako',
      createAccount: 'Tondawo akawunti olungamye kampeyini entuufu',
      getStarted: 'Tandika',
      
      // Menu items  
      dashboard: 'Dashboodi',
      aiContent: 'Ebintu bya AI',
      postScheduler: 'Omupanga w\'Ebiwandiiko',
      analytics: 'Okwekenenya',
      pricing: 'Emiwendo',
      support: 'Obuyambi',
      
      // Common translations
      login: 'Yingira',
      signUp: 'Weekolerere',
      register: 'Weekolerere',
      email: 'Email',
      password: 'Ekigambo ky\'okukweka',
      continue: 'Genda mu maaso',
      loading: 'Kitegekeka...',
      kenya: 'Kenya',
      tanzania: 'Tanzania'
    },
    
    fr: {
      // Navigation & UI
      welcome: 'Bienvenue sur KizaziSocial',
      selectRegion: 'Sélectionnez Votre Région',
      chooseExperience: 'Choisissez Votre Expérience',
      demoMode: 'Mode Démo',
      fullAccess: 'Accès Complet',
      exploreFeatures: 'Explorez les fonctionnalités avec des données d\'exemple',
      createAccount: 'Créez un compte et gérez de vraies campagnes',
      getStarted: 'Commencer',
      
      // Menu items
      dashboard: 'Tableau de Bord',
      aiContent: 'Contenu IA',
      postScheduler: 'Planificateur de Posts',
      analytics: 'Analyses',
      pricing: 'Tarification',
      support: 'Support',
      
      // Common translations
      login: 'Connexion',
      signUp: 'S\'inscrire',
      register: 'S\'inscrire',
      email: 'Email',
      password: 'Mot de passe',
      continue: 'Continuer',
      loading: 'Chargement...',
      kenya: 'Kenya',
      tanzania: 'Tanzanie'
    },
    
    rw: {
      // Navigation & UI
      welcome: 'Murakaza neza kuri KizaziSocial',
      selectRegion: 'Hitamo Akarere Kawe',
      chooseExperience: 'Hitamo Uburambe Bwawe',
      demoMode: 'Uburyo bwo Kugerageza',
      fullAccess: 'Kwinjira Kwuzuye',
      exploreFeatures: 'Shakisha ibintu hamwe n\'amakuru y\'urugero',
      createAccount: 'Kora konti ugenzure kampeyini nyazo',
      getStarted: 'Tangira',
      
      // Menu items
      dashboard: 'Imbonerahamwe',
      aiContent: 'Ibirimo bya AI',
      postScheduler: 'Umugenzuzi w\'Ubutumwa',
      analytics: 'Isesengura',
      pricing: 'Ibiciro',
      support: 'Ubufasha',
      
      // Common translations
      login: 'Kwinjira',
      signUp: 'Kwiyandikisha',
      register: 'Kwiyandikisha',
      email: 'Email',
      password: 'Ijambo banga',
      continue: 'Komeza',
      loading: 'Birategekwa...',
      kenya: 'Kenya',
      tanzania: 'Tanzaniya'
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || translations.en[key] || key;
  };

  const changeLanguage = (newLang) => {
    if (languages[newLang]) {
      setLanguage(newLang);
      localStorage.setItem('app_language', newLang);
    }
  };

  const value = {
    language,
    languages,
    setLanguage: changeLanguage,
    t,
    currentLanguage: languages[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
