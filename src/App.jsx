import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import {
  Calendar,
  Rocket,
  BarChart,
  Lightbulb,
  DollarSign,
  Headset,
  Menu,
  X,
  Languages,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
  Send,
  PlusCircle,
  Copy,
  Info,
  Edit,
  Trash2,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  Hash,
  LogOut,
  User,
  PlayCircle,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import apiService from './services/api';

// Create AuthContext for use in components
const AuthContext = React.createContext();

// --- TRANSLATION & LANGUAGE CONTEXT ---
// This context manages the application's language state and provides a translation function 't'.
// It's a clean way to handle internationalization (i18n).

const translations = {
  en: {
    appName: 'KIZAZI',
    menu: {
      dashboard: 'Dashboard',
      scheduler: 'Post Scheduler',
      analytics: 'Analytics',
      aiContent: 'AI Content',
      pricing: 'Pricing',
      support: 'Support'
    },
    language: 'Language',
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back to KIZAZI!',
      summary: 'Here is a quick summary of your social media performance.',
      postsScheduled: 'Scheduled Posts',
      engagements: 'Engagements',
      newFollowers: 'New Followers',
      growthRate: 'Growth Rate',
      upcomingPosts: 'Upcoming Posts'
    },
    scheduler: {
      title: 'Post Scheduler & Calendar',
      managePosts: 'Manage and schedule your social media posts for different platforms.',
      createPost: 'Create a New Post',
      editPost: 'Edit Post',
      platform: 'Platform',
      content: 'Post Content',
      date: 'Schedule Date',
      time: 'Schedule Time',
      schedule: 'Schedule Post',
      update: 'Update Post',
      noPosts: 'No posts scheduled for this day.',
      postScheduled: 'Post scheduled successfully!',
      postUpdated: 'Post updated successfully!',
      deletePost: 'Delete Post',
      deleteConfirmTitle: 'Confirm Deletion',
      deleteConfirm: 'Are you sure you want to delete this post? This action cannot be undone.',
      deleteSuccess: 'Post deleted successfully!',
      placeholderContent: 'Write your post content here...',
      confirm: 'Confirm',
      cancel: 'Cancel'
    },
    aiContent: {
      title: 'AI Content Generator',
      caption: 'Generate Captions & Hashtags',
      promptLabel: 'Describe your post:',
      promptPlaceholder: 'e.g., A photo of a beautiful sunset over the savanna.',
      generate: 'Generate Content',
      generatedTitle: 'Generated Content',
      copySuccess: 'Copied to clipboard!',
      loading: 'Generating your content...',
      error: 'Failed to generate content. Please try again.'
    },
    analytics: {
      title: 'Analytics & Reports',
      placeholder: 'This is where you would see your cross-platform performance reports. We are working on integrating with Facebook, Instagram, and X APIs to provide detailed insights.'
    },
    pricing: {
      title: 'Pricing for Africa',
      intro: 'Simple and affordable pricing plans to help you grow your business.',
      plan1: {
        name: 'Starter',
        price: 'Ksh 1,500',
        features: ['Up to 3 social media accounts', '15 scheduled posts/month', 'Basic analytics']
      },
      plan2: {
        name: 'Pro',
        price: 'Ksh 5,000',
        features: ['Up to 10 social media accounts', 'Unlimited scheduled posts', 'Advanced analytics', 'AI Content Generator']
      },
      plan3: {
        name: 'Enterprise',
        price: 'Contact us',
        features: ['Unlimited accounts', 'Custom solutions', 'Dedicated support', 'Payment Integration']
      },
      buyButton: 'Choose Plan',
      paymentSuccess: 'Thank you for your purchase! Your simulated payment was successful. We will contact you shortly.'
    },
    support: {
      title: 'Support & Resources',
      whatsapp: 'WhatsApp Support',
      whatsappDescription: 'Get real-time support from our team on WhatsApp.',
      educational: 'Educational Resources',
      educationalDescription: 'Learn how to maximize your social media presence with our guides.',
      resource1: 'Getting Started with KIZAZI',
      resource2: 'Mastering the Post Scheduler',
      resource3: 'Guide to AI-Generated Content',
      link: 'View Resource',
      chat: 'Chat with us'
    }
  },
  sw: {
    appName: 'KIZAZI',
    menu: {
      dashboard: 'Dashibodi',
      scheduler: 'Kipanga-Chapisho',
      analytics: 'Uchambuzi',
      aiContent: 'Maudhui ya AI',
      pricing: 'Bei',
      support: 'Usaidizi'
    },
    language: 'Lugha',
    dashboard: {
      title: 'Dashibodi',
      welcome: 'Karibu tena kwenye KIZAZI!',
      summary: 'Huu ni muhtasari wa haraka wa utendaji wako kwenye mitandao ya kijamii.',
      postsScheduled: 'Machapisho Yaliyopangwa',
      engagements: 'Mwingiliano',
      newFollowers: 'Wafuasi Wapya',
      growthRate: 'Kiwango cha Ukuaji',
      upcomingPosts: 'Machapisho Yanayokuja'
    },
    scheduler: {
      title: 'Kipanga-Chapisho & Kalenda',
      managePosts: 'Dhibiti na panga machapisho yako ya mitandao ya kijamii.',
      createPost: 'Andika Chapisho Jipya',
      editPost: 'Hariri Chapisho',
      platform: 'Jukwaa',
      content: 'Maudhui ya Chapisho',
      date: 'Tarehe ya Kupanga',
      time: 'Muda wa Kupanga',
      schedule: 'Panga Chapisho',
      update: 'Sasisha Chapisho',
      noPosts: 'Hakuna machapisho yaliyopangwa kwa siku hii.',
      postScheduled: 'Chapisho limepangwa kwa mafanikio!',
      postUpdated: 'Chapisho limesasishwa kwa mafanikio!',
      deletePost: 'Futa Chapisho',
      deleteConfirmTitle: 'Thibitisha Kufuta',
      deleteConfirm: 'Una uhakika unataka kufuta chapisho hili? Kitendo hiki hakiwezi kutenduliwa.',
      deleteSuccess: 'Chapisho limefutwa kwa mafanikio!',
      placeholderContent: 'Andika maudhui ya chapisho lako hapa...',
      confirm: 'Thibitisha',
      cancel: 'Ghairi'
    },
    aiContent: {
      title: 'Maudhui ya AI',
      caption: 'Tengeneza Maelezo & Hashtag',
      promptLabel: 'Eleza chapisho lako:',
      promptPlaceholder: 'mfano, Picha ya machweo mazuri juu ya savanna.',
      generate: 'Tengeneza Maudhui',
      generatedTitle: 'Maudhui Yaliyotengenezwa',
      copySuccess: 'Imenakiliwa!',
      loading: 'Tunatengeneza maudhui yako...',
      error: 'Imeshindwa kutengeneza maudhui. Tafadhali jaribu tena.'
    },
    analytics: {
      title: 'Uchambuzi na Ripoti',
      placeholder: 'Hapa ndipo utaona ripoti za utendaji wako wa majukwaa mbalimbali. Tunafanyia kazi ujumuishaji wa API za Facebook, Instagram na X ili kutoa maarifa ya kina.'
    },
    pricing: {
      title: 'Bei kwa Afrika',
      intro: 'Mipango rahisi na ya bei nafuu kukusaidia kukuza biashara yako.',
      plan1: {
        name: 'Mwanzo',
        price: 'Ksh 1,500',
        features: ['Hadi akaunti 3 za mitandao ya kijamii', 'machapisho 15 yaliyopangwa/mwezi', 'Uchambuzi wa kawaida']
      },
      plan2: {
        name: 'Pro',
        price: 'Ksh 5,000',
        features: ['Hadi akaunti 10 za mitandao ya kijamii', 'Machapisho yasiyo na kikomo', 'Uchambuzi wa hali ya juu', 'Jenereta ya Maudhui ya AI']
      },
      plan3: {
        name: 'Biashara Kubwa',
        price: 'Wasiliana nasi',
        features: ['Akaunti zisizo na kikomo', 'Suluhisho maalum', 'Usaidizi maalum', 'Ujumuishaji wa Malipo']
      },
      buyButton: 'Chagua Mpango',
      paymentSuccess: 'Asante kwa ununuzi wako! Malipo yako ya kuiga yamefaulu. Tutakutana na wewe hivi karibuni.'
    },
    support: {
      title: 'Usaidizi na Rasilimali',
      whatsapp: 'Usaidizi wa WhatsApp',
      whatsappDescription: 'Pata usaidizi wa moja kwa moja kutoka kwa timu yetu kwenye WhatsApp.',
      educational: 'Rasilimali za Elimu',
      educationalDescription: 'Jifunze jinsi ya kuongeza uwepo wako kwenye mitandao ya kijamii kwa kutumia miongozo yetu.',
      resource1: 'Kuanza na KIZAZI',
      resource2: 'Kutawala Kipanga-Chapisho',
      resource3: 'Mwongozo wa Maudhui Yanayotengenezwa na AI',
      link: 'Tazama Rasilimali',
      chat: 'Wasiliana nasi'
    }
  },
  fr: {
    appName: 'KIZAZI',
    menu: {
      dashboard: 'Tableau de bord',
      scheduler: 'Planificateur de publications',
      analytics: 'Analyses',
      aiContent: 'Contenu IA',
      pricing: 'Tarifs',
      support: 'Support'
    },
    language: 'Langue',
    dashboard: {
      title: 'Tableau de bord',
      welcome: 'Bienvenue sur KIZAZI!',
      summary: 'Voici un résumé rapide de vos performances sur les réseaux sociaux.',
      postsScheduled: 'Publications planifiées',
      engagements: 'Engagements',
      newFollowers: 'Nouveaux abonnés',
      growthRate: 'Taux de croissance',
      upcomingPosts: 'Publications à venir'
    },
    scheduler: {
      title: 'Planificateur de publications et calendrier',
      managePosts: 'Gérez et planifiez vos publications pour les différents réseaux sociaux.',
      createPost: 'Créer une nouvelle publication',
      editPost: 'Modifier la publication',
      platform: 'Plateforme',
      content: 'Contenu de la publication',
      date: 'Date de planification',
      time: 'Heure de planification',
      schedule: 'Planifier',
      update: 'Mettre à jour',
      noPosts: 'Aucune publication prévue pour ce jour.',
      postScheduled: 'Publication planifiée avec succès!',
      postUpdated: 'Publication mise à jour avec succès!',
      deletePost: 'Supprimer la publication',
      deleteConfirmTitle: 'Confirmer la suppression',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette publication? Cette action est irréversible.',
      deleteSuccess: 'Publication supprimée avec succès!',
      placeholderContent: 'Écrivez le contenu de votre publication ici...',
      confirm: 'Confirmer',
      cancel: 'Annuler'
    },
    aiContent: {
      title: 'Générateur de contenu IA',
      caption: 'Générer des légendes et des hashtags',
      promptLabel: 'Décrivez votre publication:',
      promptPlaceholder: 'Ex: Une photo d\'un magnifique coucher de soleil sur la savane.',
      generate: 'Générer du contenu',
      generatedTitle: 'Contenu généré',
      copySuccess: 'Copié dans le presse-papiers!',
      loading: 'Génération de votre contenu en cours...',
      error: 'Échec de la génération de contenu. Veuillez réessayer.'
    },
    analytics: {
      title: 'Analyses et rapports',
      placeholder: 'C\'est ici que vous verrez vos rapports de performance. Nous travaillons à l\'intégration des API Facebook, Instagram et X pour vous fournir des analyses détaillées.'
    },
    pricing: {
      title: 'Tarifs pour l\'Afrique',
      intro: 'Des plans simples et abordables pour vous aider à développer votre entreprise.',
      plan1: {
        name: 'Démarreur',
        price: 'Ksh 1,500',
        features: ['Jusqu\'à 3 comptes de réseaux sociaux', '15 publications par mois', 'Analyses de base']
      },
      plan2: {
        name: 'Pro',
        price: 'Ksh 5,000',
        features: ['Jusqu\'à 10 comptes de réseaux sociaux', 'Publications illimitées', 'Analyses avancées', 'Générateur de contenu IA']
      },
      plan3: {
        name: 'Entreprise',
        price: 'Contactez-nous',
        features: ['Comptes illimités', 'Solutions personnalisées', 'Support dédié', 'Intégration de paiement']
      },
      buyButton: 'Choisir le plan',
      paymentSuccess: 'Merci pour votre achat ! Votre paiement simulé a été un succès. Nous vous contacterons sous peu.'
    },
    support: {
      title: 'Support et ressources',
      whatsapp: 'Support WhatsApp',
      whatsappDescription: 'Obtenez un support en temps réel de notre équipe sur WhatsApp.',
      educational: 'Ressources éducatives',
      educationalDescription: 'Apprenez à maximiser votre présence sur les réseaux sociaux avec nos guides.',
      resource1: 'Démarrer avec KIZAZI',
      resource2: 'Maîtriser le planificateur',
      resource3: 'Guide du contenu généré par l\'IA',
      link: 'Voir la ressource',
      chat: 'Discuter avec nous'
    }
  },
  ar: {
    appName: 'KIZAZI',
    menu: {
      dashboard: 'لوحة القيادة',
      scheduler: 'مجدول المنشورات',
      analytics: 'التحليلات',
      aiContent: 'محتوى الذكاء الاصطناعي',
      pricing: 'الأسعار',
      support: 'الدعم'
    },
    language: 'اللغة',
    dashboard: {
      title: 'لوحة القيادة',
      welcome: 'مرحبًا بك مرة أخرى في KIZAZI!',
      summary: 'هذا ملخص سريع لأدائك على وسائل التواصل الاجتماعي.',
      postsScheduled: 'المنشورات المجدولة',
      engagements: 'التفاعلات',
      newFollowers: 'متابعون جدد',
      growthRate: 'معدل النمو',
      upcomingPosts: 'المنشورات القادمة'
    },
    scheduler: {
      title: 'مجدول المنشورات والتقويم',
      managePosts: 'إدارة وجدولة منشوراتك على وسائل التواصل الاجتماعي.',
      createPost: 'إنشاء منشور جديد',
      editPost: 'تعديل المنشور',
      platform: 'المنصة',
      content: 'محتوى المنشور',
      date: 'تاريخ الجدولة',
      time: 'وقت الجدولة',
      schedule: 'جدولة المنشور',
      update: 'تحديث المنشور',
      noPosts: 'لا توجد منشورات مجدولة لهذا اليوم.',
      postScheduled: 'تم جدولة المنشور بنجاح!',
      postUpdated: 'تم تحديث المنشور بنجاح!',
      deletePost: 'حذف المنشور',
      deleteConfirmTitle: 'تأكيد الحذف',
      deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.',
      deleteSuccess: 'تم حذف المنشور بنجاح!',
      placeholderContent: 'اكتب محتوى منشورك هنا...',
      confirm: 'تأكيد',
      cancel: 'إلغاء'
    },
    aiContent: {
      title: 'مولد محتوى الذكاء الاصطناعي',
      caption: 'توليد التسميات التوضيحية والهاشتاجات',
      promptLabel: 'صف منشورك:',
      promptPlaceholder: 'مثال، صورة لغروب الشمس الجميل على السافانا.',
      generate: 'توليد المحتوى',
      generatedTitle: 'المحتوى المُولَّد',
      copySuccess: 'تم النسخ إلى الحافظة!',
      loading: 'جارٍ توليد المحتوى الخاص بك...',
      error: 'فشل توليد المحتوى. يرجى المحاولة مرة أخرى.'
    },
    analytics: {
      title: 'التحليلات والتقارير',
      placeholder: 'هنا سترى تقارير أداء منصاتك المختلفة. نحن نعمل على دمج واجهات برمجة تطبيقات فيسبوك وإنستغرام و X لتوفير رؤى مفصلة.'
    },
    pricing: {
      title: 'أسعار أفريقيا',
      intro: 'خطط أسعار بسيطة ومعقولة لمساعدتك على تنمية عملك.',
      plan1: {
        name: 'مبتدئ',
        price: '1,500 شلن',
        features: ['حتى 3 حسابات على وسائل التواصل الاجتماعي', '15 منشورًا مجدولًا شهريًا', 'تحليلات أساسية']
      },
      plan2: {
        name: 'احترافي',
        price: '5,000 شلن',
        features: ['حتى 10 حسابات على وسائل التواصل الاجتماعي', 'منشورات مجدولة غير محدودة', 'تحليلات متقدمة', 'مولد محتوى الذكاء الاصطناعي']
      },
      plan3: {
        name: 'شركات',
        price: 'اتصل بنا',
        features: ['حسابات غير محدودة', 'حلول مخصصة', 'دعم مخصص', 'دمج المدفوعات']
      },
      buyButton: 'اختر الخطة',
      paymentSuccess: 'شكرًا لشرائك! لقد تمت عملية الدفع المحاكاة بنجاح. سنتواصل معك قريبًا.'
    },
    support: {
      title: 'الدعم والموارد',
      whatsapp: 'دعم واتساب',
      whatsappDescription: 'احصل على دعم فوري من فريقنا على واتساب.',
      educational: 'الموارد التعليمية',
      educationalDescription: 'تعلم كيفية زيادة تواجدك على وسائل التواصل الاجتماعي باستخدام أدلتنا.',
      resource1: 'البدء مع KIZAZI',
      resource2: 'إتقان مجدول المنشورات',
      resource3: 'دليل المحتوى المُولَّد بواسطة الذكاء الاصطناعي',
      link: 'عرض المورد',
      chat: 'تحدث معنا'
    }
  },
  pt: {
    appName: 'KIZAZI',
    menu: {
      dashboard: 'Painel',
      scheduler: 'Agendador de Posts',
      analytics: 'Análise',
      aiContent: 'Conteúdo de IA',
      pricing: 'Preços',
      support: 'Suporte'
    },
    language: 'Idioma',
    dashboard: {
      title: 'Painel',
      welcome: 'Bem-vindo de volta ao KIZAZI!',
      summary: 'Aqui está um resumo rápido do seu desempenho nas redes sociais.',
      postsScheduled: 'Posts Agendados',
      engagements: 'Engajamentos',
      newFollowers: 'Novos Seguidores',
      growthRate: 'Taxa de Crescimento',
      upcomingPosts: 'Próximos Posts'
    },
    scheduler: {
      title: 'Agendador de Posts e Calendário',
      managePosts: 'Gerencie e agende suas postagens nas redes sociais.',
      createPost: 'Criar um novo post',
      editPost: 'Editar Post',
      platform: 'Plataforma',
      content: 'Conteúdo do Post',
      date: 'Data do agendamento',
      time: 'Hora do agendamento',
      schedule: 'Agendar Post',
      update: 'Atualizar Post',
      noPosts: 'Nenhum post agendado para este dia.',
      postScheduled: 'Post agendado com sucesso!',
      postUpdated: 'Post atualizado com sucesso!',
      deletePost: 'Excluir Post',
      deleteConfirmTitle: 'Confirmar Exclusão',
      deleteConfirm: 'Tem certeza de que deseja excluir este post? Esta ação não pode ser desfeita.',
      deleteSuccess: 'Post excluído com sucesso!',
      placeholderContent: 'Escreva o conteúdo do seu post aqui...',
      confirm: 'Confirmar',
      cancel: 'Cancelar'
    },
    aiContent: {
      title: 'Gerador de Conteúdo de IA',
      caption: 'Gerar legendas e hashtags',
      promptLabel: 'Descreva seu post:',
      promptPlaceholder: 'Ex: Uma foto de um lindo pôr do sol na savana.',
      generate: 'Gerar Conteúdo',
      generatedTitle: 'Conteúdo Gerado',
      copySuccess: 'Copiado para a área de transferência!',
      loading: 'Gerando seu conteúdo...',
      error: 'Falha ao gerar conteúdo. Por favor, tente novamente.'
    },
    analytics: {
      title: 'Análises e Relatórios',
      placeholder: 'É aqui que você verá seus relatórios de desempenho. Estamos trabalhando na integração das APIs do Facebook, Instagram e X para fornecer insights detalhados.'
    },
    pricing: {
      title: 'Preços para a África',
      intro: 'Planos de preços simples e acessíveis para ajudar você a expandir seus negócios.',
      plan1: {
        name: 'Iniciante',
        price: 'Ksh 1,500',
        features: ['Até 3 contas de mídia social', '15 posts agendados/mês', 'Análise básica']
      },
      plan2: {
        name: 'Pro',
        price: 'Ksh 5,000',
        features: ['Até 10 contas de mídia social', 'Posts agendados ilimitados', 'Análise avançada', 'Gerador de conteúdo de IA']
      },
      plan3: {
        name: 'Empresarial',
        price: 'Fale conosco',
        features: ['Contas ilimitadas', 'Soluções personalizadas', 'Suporte dedicado', 'Integração de pagamento']
      },
      buyButton: 'Escolher Plano',
      paymentSuccess: 'Obrigado pela sua compra! Seu pagamento simulado foi bem-sucedido. Entraremos em contato em breve.'
    },
    support: {
      title: 'Suporte e Recursos',
      whatsapp: 'Suporte via WhatsApp',
      whatsappDescription: 'Obtenha suporte em tempo real de nossa equipe no WhatsApp.',
      educational: 'Recursos Educacionais',
      educationalDescription: 'Aprenda a maximizar sua presença nas redes sociais com nossos guias.',
      resource1: 'Começando com KIZAZI',
      resource2: 'Dominando o Agendador de Posts',
      resource3: 'Guia para Conteúdo Gerado por IA',
      link: 'Ver Recurso',
      chat: 'Converse conosco'
    }
  }
};

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // The 't' function safely navigates the translation object.
  // If a key is not found, it returns the key itself as a fallback.
  const t = (key) => {
    const keys = key.split('.');
    let text = translations[language];
    for (const k of keys) {
      if (text && text[k] !== undefined) {
        text = text[k];
      } else {
        return key;
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// --- MODE SELECTION COMPONENT ---
// This component allows users to choose between Demo Mode and Full Authentication Mode
const ModeSelection = ({ onModeSelect }) => {
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-900 to-pink-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <img 
            src="/logo.jpg" 
            alt="KIZAZI Logo" 
            className="h-24 w-auto mx-auto mb-6 rounded-xl shadow-2xl"
          />
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Welcome to KIZAZI
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Your AI-Powered Social Media Management Platform
          </p>
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Demo Mode Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onModeSelect('demo')}
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 cursor-pointer transition-all duration-300 ${
              selectedMode === 'demo' ? 'ring-4 ring-green-400 bg-white/20' : 'hover:bg-white/15'
            }`}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayCircle size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">🎯 Demo Mode</h3>
              <p className="text-purple-200 mb-4">
                Explore all features instantly with sample data. Perfect for testing and demonstrations.
              </p>
            </div>
            
            <div className="space-y-2 text-left">
              <div className="flex items-center text-green-300">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">Instant access - no signup required</span>
              </div>
              <div className="flex items-center text-green-300">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">Pre-loaded sample data</span>
              </div>
              <div className="flex items-center text-green-300">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">All features unlocked</span>
              </div>
              <div className="flex items-center text-green-300">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">Perfect for presentations</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
              Start Demo
            </button>
          </motion.div>

          {/* Full Mode Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onModeSelect('full')}
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 cursor-pointer transition-all duration-300 ${
              selectedMode === 'full' ? 'ring-4 ring-purple-400 bg-white/20' : 'hover:bg-white/15'
            }`}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">🚀 Full Platform</h3>
              <p className="text-purple-200 mb-4">
                Complete experience with your own account, data, and social media connections.
              </p>
            </div>
            
            <div className="space-y-2 text-left">
              <div className="flex items-center text-purple-300">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">Personal account & data</span>
              </div>
              <div className="flex items-center text-purple-300">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">Real social media connections</span>
              </div>
              <div className="flex items-center text-purple-300">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">AI content generation</span>
              </div>
              <div className="flex items-center text-purple-300">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">Advanced analytics</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300">
              Sign In / Register
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-purple-300 text-sm"
        >
          <p>© 2025 KIZAZI - AI-Powered Social Media Management</p>
          <p className="mt-2">Choose your experience above to get started</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
// This component provides the Auth and Language contexts and renders the main layout.
const App = () => {
  const [appMode, setAppMode] = useState('demo'); // Start directly in demo mode to fix styling
  const [showModeSelection, setShowModeSelection] = useState(false);

  const handleModeSelect = (mode) => {
    setAppMode(mode);
    setShowModeSelection(false);
  };

  const handleBackToHome = () => {
    setShowModeSelection(true);
  };

  // Show mode selection if requested
  if (showModeSelection) {
    return <ModeSelection onModeSelect={handleModeSelect} />;
  }

  // Demo Mode
  if (appMode === 'demo') {
    return (
      <LanguageProvider>
        <AppLayout isDemoMode={true} onBackToHome={handleBackToHome} onShowModeSelection={() => setShowModeSelection(true)} />
      </LanguageProvider>
    );
  }

  // Full Authentication Mode
  return (
    <AuthProvider>
      <LanguageProvider>
        <ProtectedRoute>
          <AppLayout isDemoMode={false} onBackToHome={handleBackToHome} onShowModeSelection={() => setShowModeSelection(true)} />
        </ProtectedRoute>
      </LanguageProvider>
    </AuthProvider>
  );
};

// --- APP LAYOUT COMPONENT ---
// This component contains the main structure of the app, including state management for navigation.
// This structure is necessary to allow child components to access the LanguageContext and AuthContext.
const AppLayout = ({ isDemoMode, onBackToHome, onShowModeSelection }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language } = useContext(LanguageContext);
  const auth = isDemoMode ? null : useAuth();

  // A simple router-like function to render the correct page component based on state.
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'scheduler':
        return <PostScheduler />;
      case 'analytics':
        return <Analytics />;
      case 'aiContent':
        return <AIContentGenerator />;
      case 'pricing':
        return <Pricing />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  const isDashboard = currentPage === 'dashboard';

  return (
    <AuthContext.Provider value={auth}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-gray-800" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
          <Header setIsSidebarOpen={setIsSidebarOpen} currentPage={currentPage} isDemoMode={isDemoMode} onBackToHome={onBackToHome} onShowModeSelection={onShowModeSelection} />
          <main className={`flex-1 p-4 md:p-8 overflow-y-auto ${isDashboard ? 'bg-gradient-to-br from-fuchsia-50/80 via-white to-purple-50/80' : 'bg-gradient-to-br from-white to-slate-50/50'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

// --- HEADER COMPONENT ---
const Header = ({ setIsSidebarOpen, currentPage, isDemoMode, onBackToHome, onShowModeSelection }) => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  
  // Only use auth context if not in demo mode
  const authContext = isDemoMode ? null : useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;
  
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // This effect handles clicks outside the menus to close them.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  // Gets the title from the translation object based on the current page.
  const pageTitle = t(`menu.${currentPage}`);
  const isDashboard = currentPage === 'dashboard';

  return (
    <header className={`sticky top-0 shadow-lg backdrop-blur-md z-20 ${isDashboard ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 border-b border-fuchsia-500/30' : 'bg-white/90 border-b border-gray-200/50'}`}>
      <div className={`flex items-center justify-between p-4`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`md:hidden p-2 rounded-lg hover:bg-white/20 transition-all duration-200 ${isDashboard ? 'text-white hover:text-white' : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'}`}
            aria-label="Open sidebar menu"
          >
            <Menu size={24} />
          </button>
          <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${isDashboard ? 'text-white' : 'from-gray-800 to-gray-600 bg-clip-text text-transparent'}`}>{pageTitle}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* User Menu - Only show if not in demo mode */}
          {!isDemoMode && user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${isDashboard ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                <User size={20} />
                <span className="hidden md:inline-block text-sm font-medium">{user?.name}</span>
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-red-600 text-gray-700"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Demo Mode Indicator & Back Button */}
          {isDemoMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={onShowModeSelection}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${isDashboard ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                title="Switch Mode"
              >
                🏠 Switch Mode
              </button>
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${isDashboard ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                ✨ Demo Mode
              </div>
            </div>
          )}

          {/* Language Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${isDashboard ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
              aria-label="Select language"
            >
              <Languages size={20} />
              <span className="hidden md:inline-block text-sm font-medium uppercase">{language}</span>
            </button>
          <AnimatePresence>
            {isLanguageMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 ${language === 'en' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'}`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇺🇸</span> English
                </button>
                <button
                  onClick={() => handleLanguageChange('sw')}
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 ${language === 'sw' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'}`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇰🇪</span> Kiswahili
                </button>
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 ${language === 'fr' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'}`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇫🇷</span> Français
                </button>
                <button
                  onClick={() => handleLanguageChange('ar')}
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 ${language === 'ar' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'}`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇸🇦</span> العربية
                </button>
                <button
                  onClick={() => handleLanguageChange('pt')}
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 ${language === 'pt' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'}`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇧🇷</span> Português
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen }) => {
  const { t } = useContext(LanguageContext);
  const sidebarRef = useRef(null);

  // This effect handles clicks outside the sidebar to close it on mobile.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, setIsSidebarOpen]);

  // A list of navigation items for the sidebar.
  const navItems = [
    { id: 'dashboard', icon: Rocket, label: t('menu.dashboard') },
    { id: 'scheduler', icon: Calendar, label: t('menu.scheduler') },
    { id: 'analytics', icon: BarChart, label: t('menu.analytics') },
    { id: 'aiContent', icon: Lightbulb, label: t('menu.aiContent') },
    { id: 'pricing', icon: DollarSign, label: t('menu.pricing') },
    { id: 'support', icon: Headset, label: t('menu.support') },
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  const KizaziLogoSVG = () => (
    <svg width="100%" height="auto" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="40" fontFamily="Inter, sans-serif" fontSize="40" fontWeight="800" fill="#E879F9">KIZAZI</text>
    </svg>
  );

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-64 bg-indigo-950 text-gray-200 z-50 md:hidden"
          ref={sidebarRef}
        >
          <div className="flex justify-between items-center p-4 border-b border-indigo-800">
            <h2 className="text-xl font-bold text-fuchsia-400">{t('appName')}</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-fuchsia-400 transition-colors">
              <X size={24} />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors ${
                      currentPage === item.id ? 'bg-indigo-900 text-fuchsia-400' : 'text-gray-300 hover:bg-indigo-900 hover:text-fuchsia-400'
                    }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-gray-200 shadow-2xl">
        <div className="p-6 pb-4 border-b border-indigo-800/50">
          <img
            src="/logo.jpg"
            alt="Kizazi Logo"
            className="h-16 w-auto mx-auto transition-transform duration-200 hover:scale-105 rounded-lg shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64," + btoa('<svg width="100%" height="auto" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="10" y="40" fontFamily="Inter, sans-serif" fontSize="40" fontWeight="800" fill="#E879F9">KIZAZI</text></svg>'); }}
          />
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center w-full p-3 rounded-xl font-medium transition-all duration-200 group ${
                    currentPage === item.id 
                      ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-lg shadow-fuchsia-500/25' 
                      : 'text-gray-300 hover:bg-indigo-900/50 hover:text-fuchsia-400 hover:shadow-md hover:translate-x-1'
                  }`}
                >
                  <item.icon size={20} className="mr-3 transition-transform duration-200 group-hover:scale-110" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-indigo-800/50 text-sm text-gray-400">
          <p className="text-center bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">© 2025 KIZAZI</p>
        </div>
      </div>
    </AnimatePresence>
  );
};

// --- PAGES ---

// Dashboard Page
const Dashboard = () => {
  const { t } = useContext(LanguageContext);
  // Placeholder data for the dashboard
  const stats = [
    { label: t('dashboard.postsScheduled'), value: '25', icon: Clock, color: 'text-fuchsia-600' },
    { label: t('dashboard.engagements'), value: '12.4K', icon: CheckCircle, color: 'text-green-500' },
    { label: t('dashboard.newFollowers'), value: '458', icon: PlusCircle, color: 'text-purple-600' },
    { label: t('dashboard.growthRate'), value: '8.2%', icon: BarChart, color: 'text-orange-500' },
  ];

  const upcomingPosts = [
    { id: 1, platform: 'Instagram', content: 'A beautiful photo of Nairobi National Park...', date: '2025-01-20', time: '10:00 AM' },
    { id: 2, platform: 'Facebook', content: 'Exciting news about our latest feature...', date: '2025-01-22', time: '02:30 PM' },
    { id: 3, platform: 'X', content: 'Just launched our new product! #KIZAZI', date: '2025-01-23', time: '09:00 AM' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
      <p className="text-gray-600 mb-6">{t('dashboard.welcome')}</p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-fuchsia-200/50"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">{t('dashboard.summary')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center bg-gradient-to-br from-white to-fuchsia-50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-fuchsia-200 group"
            >
              <div className={`p-4 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-fuchsia-600 transition-colors duration-300">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-fuchsia-200/50"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">{t('dashboard.upcomingPosts')}</h2>
        <ul className="space-y-4">
          {upcomingPosts.map((post, index) => (
            <motion.li 
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex flex-col md:flex-row items-start md:items-center p-5 bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-fuchsia-200 group"
            >
              <div className="flex-1">
                <span className={`text-sm font-semibold rounded-lg px-3 py-2 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md ${post.platform === 'Instagram' ? 'text-pink-700 hover:bg-pink-50' : post.platform === 'Facebook' ? 'text-blue-700 hover:bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    {post.platform === 'Instagram' && <Instagram size={20} />}
                    {post.platform === 'Facebook' && <Facebook size={20} />}
                    {(post.platform === 'Twitter' || post.platform === 'X') && <X size={20} />}
                    <span className="font-medium">{post.platform}</span>
                  </div>
                </span>
                <p className="mt-3 text-gray-700 font-medium leading-relaxed">{post.content}</p>
              </div>
              <div className="mt-3 md:mt-0 md:ml-6 text-right text-gray-500 text-sm bg-white rounded-lg p-3 shadow-sm">
                <p className="font-semibold">{post.date}</p>
                <p className="text-fuchsia-600">{post.time}</p>
              </div>
            </motion.li>
          ))}
        </ul>
        {upcomingPosts.length === 0 && (
          <div className="text-center text-gray-500 p-8 bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-xl">
            <p>{t('scheduler.noPosts')}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Post Scheduler Page
const PostScheduler = () => {
  const { t } = useContext(LanguageContext);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);

  const [form, setForm] = useState({
    platform: 'Instagram',
    content: '',
    date: '',
    time: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    const newPost = {
      id: posts.length + 1,
      ...form,
    };
    setPosts([...posts, newPost]);
    setShowModal(false);
    setForm({
      platform: 'Instagram',
      content: '',
      date: '',
      time: ''
    });
    // Replaced alert() with a custom message box or toast notification
    // For this example, we'll use a simple state to show a message.
  };

  const handleEditPost = (e) => {
    e.preventDefault();
    setPosts(posts.map(post => post.id === postToEdit.id ? { ...post, ...form } : post));
    setShowModal(false);
    setPostToEdit(null);
    setForm({
      platform: 'Instagram',
      content: '',
      date: '',
      time: ''
    });
    // Replaced alert() with a custom message box or toast notification
  };

  const openEditModal = (post) => {
    setPostToEdit(post);
    setForm({
      platform: post.platform,
      content: post.content,
      date: post.date,
      time: post.time
    });
    setShowModal(true);
  };

  const openDeleteModal = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleDeletePost = () => {
    setPosts(posts.filter(post => post.id !== postToDelete.id));
    setShowDeleteModal(false);
    setPostToDelete(null);
    // Replaced alert() with a custom message box or toast notification
  };

  const closeModal = () => {
    setShowModal(false);
    setPostToEdit(null);
    setForm({
      platform: 'Instagram',
      content: '',
      date: '',
      time: ''
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('scheduler.title')}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
        >
          <PlusCircle size={20} className="mr-2" />
          {t('scheduler.createPost')}
        </button>
      </div>
      <p className="text-gray-600 mb-6">{t('scheduler.managePosts')}</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div 
                key={post.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-100 hover:border-blue-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-semibold rounded-lg px-3 py-2 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md ${post.platform === 'Instagram' ? 'text-pink-700 hover:bg-pink-50' : post.platform === 'Facebook' ? 'text-blue-700 hover:bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-2">
                        {post.platform === 'Instagram' && <Instagram size={20} />}
                        {post.platform === 'Facebook' && <Facebook size={20} />}
                        {(post.platform === 'Twitter' || post.platform === 'X') && <X size={20} />}
                        <span>{post.platform}</span>
                      </div>
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(post)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" aria-label="Edit post">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => openDeleteModal(post)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" aria-label="Delete post">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-3 leading-relaxed">{post.content}</p>
                </div>
                <div className="mt-4 flex items-center text-gray-500 text-sm bg-gray-50 rounded-lg p-3">
                  <Clock size={16} className="mr-2 text-blue-500" />
                  <span className="font-medium">{post.date} at {post.time}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 p-12 col-span-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <AlertTriangle size={48} className="mx-auto text-blue-500 mb-4" />
              <p className="text-lg font-medium">{t('scheduler.noPosts')}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-4">{postToEdit ? t('scheduler.editPost') : t('scheduler.createPost')}</h2>
          <form onSubmit={postToEdit ? handleEditPost : handleCreatePost} className="space-y-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">{t('scheduler.platform')}</label>
              <select id="platform" name="platform" value={form.platform} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="X">X (formerly Twitter)</option>
              </select>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">{t('scheduler.content')}</label>
              <textarea id="content" name="content" rows="4" value={form.content} onChange={handleInputChange} required placeholder={t('scheduler.placeholderContent')} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">{t('scheduler.date')}</label>
                <input type="date" id="date" name="date" value={form.date} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">{t('scheduler.time')}</label>
                <input type="time" id="time" name="time" value={form.time} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">{t('scheduler.cancel')}</button>
              <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">{postToEdit ? t('scheduler.update') : t('scheduler.schedule')}</button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteModal && (
        <ConfirmModal onClose={() => setShowDeleteModal(false)} onConfirm={handleDeletePost} title={t('scheduler.deleteConfirmTitle')} message={t('scheduler.deleteConfirm')} />
      )}
    </motion.div>
  );
};

// AI Content Generator Page
const AIContentGenerator = () => {
  const { t } = useContext(LanguageContext);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      // Simulate API call to Gemini
      const mockApiCall = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            caption: "🌅 Sunset over the savanna is a sight to behold! Let this majestic view inspire your week. #KIZAZI #Sunset #Savanna #Africa",
            hashtags: ["#KIZAZI", "#SunsetPhotography", "#AfricaIsBeautiful", "#TravelAfrica"]
          });
        }, 2000);
      });
      const result = await mockApiCall;
      setGeneratedContent(result);
    } catch (error) {
      console.error(error);
      // Replaced alert() with a custom message box or toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    // navigator.clipboard.writeText is more modern and reliable, but can fail in some iframe environments.
    // We'll keep it here as it's the standard.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    } else {
      // Fallback for older browsers or restricted environments
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000);
      } catch (err) {
        console.error('Failed to copy text (fallback): ', err);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-2">{t('aiContent.title')}</h1>
      <p className="text-gray-600 mb-6">{t('aiContent.caption')}</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('aiContent.promptLabel')}</label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('aiContent.promptPlaceholder')}
              className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-shrink-0 px-6 py-4 mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:from-blue-400 disabled:to-purple-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Send size={20} className="inline-block mr-2" />
            {isLoading ? t('aiContent.loading') : t('aiContent.generate')}
          </button>
        </div>

        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-inner mt-6 border border-blue-100"
          >
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('aiContent.generatedTitle')}</h3>
            <div className="space-y-4">
              <div className="relative p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-800">{generatedContent.caption}</p>
                <button
                  onClick={() => copyToClipboard(generatedContent.caption)}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Copy caption"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="relative p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-800">{generatedContent.hashtags.join(' ')}</p>
                <button
                  onClick={() => copyToClipboard(generatedContent.hashtags.join(' '))}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Copy hashtags"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div >
            <AnimatePresence>
              {showCopyMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-center text-green-600 font-medium"
                >
                  {t('aiContent.copySuccess')}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Analytics Page
const Analytics = () => {
  const { t } = useContext(LanguageContext);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-2">{t('analytics.title')}</h1>
      <p className="text-gray-600 mb-6">{t('analytics.placeholder')}</p>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <Info size={48} className="mx-auto text-blue-600 mb-4" />
          <p className="max-w-lg">{t('analytics.placeholder')}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Pricing Page
const Pricing = () => {
  const { t } = useContext(LanguageContext);
  const plans = [
    t('pricing.plan1'),
    t('pricing.plan2'),
    t('pricing.plan3')
  ];
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">{t('pricing.title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('pricing.intro')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
            <p className="text-4xl font-extrabold text-blue-600 my-4">{plan.price}</p>
            <ul className="text-gray-600 space-y-2 text-left mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle size={18} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {plan.name !== t('pricing.plan3').name ? (
              <button onClick={handlePayment} className="mt-auto bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors w-full">
                {t('pricing.buyButton')}
              </button>
            ) : (
              <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="mt-auto bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition-colors w-full flex items-center justify-center">
                <MessageSquare className="mr-2" size={20} />
                {t('support.chat')}
              </a>
            )}
          </div>
        ))}
      </div>

      {showPaymentModal && (
        <SimulatedPaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </motion.div>
  );
};

const SimulatedPaymentModal = ({ onClose }) => {
  const { t } = useContext(LanguageContext);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Simulate a successful payment after a delay
    const timer = setTimeout(() => {
      setPaymentSuccess(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center p-6">
        {paymentSuccess ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="p-4 bg-green-200 rounded-full text-green-600 mb-4"
            >
              <CheckCircle size={48} />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{t('pricing.paymentSuccess')}</p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Processing Payment...</h2>
            <p className="text-gray-600">Please do not close this window.</p>
          </>
        )}
      </div>
    </Modal>
  );
};

// Support Page
const Support = () => {
  const { t } = useContext(LanguageContext);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-2">{t('support.title')}</h1>
      <p className="text-gray-600 mb-6">Find the help and resources you need on your social media journey.</p>
      <div className="p-6 bg-white rounded-xl mb-6 shadow-inner flex flex-col sm:flex-row items-center justify-between border border-gray-200">
        <div className="flex-1 mb-4 sm:mb-0">
          <h2 className="text-xl font-bold mb-1">{t('support.whatsapp')}</h2>
          <p className="text-gray-600">{t('support.whatsappDescription')}</p>
        </div>
        <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center">
          <MessageSquare className="text-white inline-block mr-2" size={20} />{t('support.chat')}
        </a>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-inner border border-gray-200">
        <h2 className="text-xl font-bold mb-4">{t('support.educational')}</h2>
        <p className="text-gray-600 mb-4">{t('support.educationalDescription')}</p>
        <ul className="space-y-4">
          {[t('support.resource1'), t('support.resource2'), t('support.resource3')].map((resource, index) => (
            <li key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-200">
              <span className="text-gray-800 font-medium">{resource}</span>
              <a href="#" className="text-blue-600 hover:underline flex items-center">
                {t('support.link')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};


// --- MODAL COMPONENTS ---

// A generic modal component
const Modal = ({ children, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md text-gray-800"
        ref={modalRef}
      >
        {children}
      </motion.div>
    </div>
  );
};

// A confirmation modal component
const ConfirmModal = ({ title, message, onClose, onConfirm }) => {
  const { t } = useContext(LanguageContext);
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="p-4 bg-red-200 rounded-full text-red-600 mb-4">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t('scheduler.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('scheduler.confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default App;
