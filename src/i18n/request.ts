import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['ar', 'fr', 'en'];

export default getRequestConfig(async (args) => {
  const locale = await args.requestLocale;
  const currentLocale = locale || 'ar';

  if (!locales.includes(currentLocale as any)) {
    notFound();
  }

  return {
    locale: currentLocale,
    messages: (await import(`../../messages/${currentLocale}.json`)).default
  };
});
