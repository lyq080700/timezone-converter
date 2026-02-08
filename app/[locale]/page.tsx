import { ClientPage } from '@/components/client-page';

type Locale = 'en' | 'zh';

export default function Page(
  props: {
    params: Promise<{ locale: Locale }>;
  }
) {
  return props.params.then(async ({ locale }) => {
    return <ClientPage locale={locale} />;
  });
}
