import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ServerComponent() {
  const t = useTranslations('Index.server');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
    </Card>
  );
} 