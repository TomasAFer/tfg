import { useConfigStore } from '@/store/config.store';
import { t as translate, type TranslationKey } from '@/i18n';

export function useTranslation() {
  const language = useConfigStore((s) => s.language);
  return {
    language,
    t: (key: TranslationKey) => translate(language, key),
  };
}
