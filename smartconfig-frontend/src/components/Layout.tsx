import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '@/store/config.store';
import { useFlowStore } from '@/store/flow.store';
import type { FlowStep } from '@/types/flow';
import { useTranslation } from '@/hooks/useTranslation';

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backTo?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showBackButton, 
  backTo,
}) => {
  const navigate = useNavigate();
  const summaryItems = useConfigStore((state) => state.summaryItems);
  const resetSelections = useConfigStore((state) => state.resetSelections);
  const resetConfig = useConfigStore((state) => state.resetConfig);
  const goToStep = useFlowStore((state) => state.goToStep);
  const reset = useFlowStore((state) => state.reset);
  const language = useConfigStore((s) => s.language);
  const setLanguage = useConfigStore((s) => s.setLanguage);
  const { t } = useTranslation();

  const handleLogoClick = () => {
    resetSelections();
    goToStep('MODE' as FlowStep);
    navigate('/');
  };

  const handleGoToSummary = () => {
    navigate('/');
    goToStep('SUMMARY' as FlowStep);
  };

  const handleLanguageChange = (lang: 'es' | 'en') => {
    resetConfig(); // Esto ahora preservará el idioma
    setLanguage(lang); // Establecer el nuevo idioma DESPUÉS de resetConfig
    reset();
    goToStep('MODE' as FlowStep);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <div className="text-2xl font-bold  text-primary-600" style={{ marginBottom: '5px' }}>{t('app.brandTitle')}</div>
              <span className="text-sm text-gray-500 hidden sm:inline">
                {t('app.brandSubtitle')}
              </span>
            </button>
            
            <div className="flex items-center gap-4">
              {summaryItems.length > 0 && (
                <button
                  onClick={handleGoToSummary}
                  className="relative px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition"
                >
                  {t('header.summary')}
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {summaryItems.length}
                  </span>
                </button>
              )}
              <div className="border border-gray-300 rounded-lg px-2 py-1 text-sm flex items-center gap-1 bg-white">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('es')}
                  className={language === 'es' ? 'font-bold text-primary-600' : 'text-gray-500'}
                >
                  {t('language.es')}
                </button>
                <span className="text-gray-400">|</span>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={language === 'en' ? 'font-bold text-primary-600' : 'text-gray-500'}
                >
                  {t('language.en')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {showBackButton && (
          <button
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="mb-6 text-primary-600 hover:text-primary-700 flex items-center space-x-2"
          >
            {t('buttons.back')}
          </button>
        )}
        
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            {t('footer.text')}
          </p>
        </div>
      </footer>
    </div>
  );
};
