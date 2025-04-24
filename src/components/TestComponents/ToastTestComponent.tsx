'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiInfo, FiCheck, FiAlertTriangle, FiX, FiBell } from 'react-icons/fi';

export default function ToastTestComponent() {
  const t = useTranslations('Index.toast');

  // Função para mostrar um toast de sucesso
  const showSuccessToast = () => {
    toast.success(t('successMessage'), {
      description: t('successDescription'),
      action: {
        label: t('actionLabel'),
        onClick: () => {
          // console.log('Toast action clicked');
        },
      },
    });
  };

  // Função para mostrar um toast de erro
  const showErrorToast = () => {
    toast.error(t('errorMessage'), {
      description: t('errorDescription'),
    });
  };

  // Função para mostrar um toast de aviso
  const showWarningToast = () => {
    toast.warning(t('warningMessage'), {
      description: t('warningDescription'),
    });
  };

  // Função para mostrar um toast informativo
  const showInfoToast = () => {
    toast.info(t('infoMessage'), {
      description: t('infoDescription'),
    });
  };

  // Função para mostrar um toast personalizado
  const showCustomToast = () => {
    toast(
      <div className="flex items-center gap-2">
        <FiBell className="h-5 w-5" />
        <span>{t('customMessage')}</span>
      </div>,
      {
        description: t('customDescription'),
        duration: 5000,
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={showSuccessToast} className="flex items-center gap-1">
            <FiCheck className="h-4 w-4" />
            <span>{t('successButton')}</span>
          </Button>
          
          <Button onClick={showErrorToast} variant="destructive" className="flex items-center gap-1">
            <FiX className="h-4 w-4" />
            <span>{t('errorButton')}</span>
          </Button>
          
          <Button onClick={showWarningToast} variant="outline" className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800">
            <FiAlertTriangle className="h-4 w-4" />
            <span>{t('warningButton')}</span>
          </Button>
          
          <Button onClick={showInfoToast} variant="secondary" className="flex items-center gap-1">
            <FiInfo className="h-4 w-4" />
            <span>{t('infoButton')}</span>
          </Button>
          
          <Button onClick={showCustomToast} variant="outline" className="flex items-center gap-1">
            <FiBell className="h-4 w-4" />
            <span>{t('customButton')}</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">{t('footer')}</p>
      </CardFooter>
    </Card>
  );
} 