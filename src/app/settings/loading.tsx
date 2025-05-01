import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto pt-8 pb-12 px-4">
      <div className="mb-8">
        <div className="h-8 w-72 bg-muted rounded-md mb-2"></div>
        <div className="h-5 w-96 bg-muted rounded-md"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado esquerdo - Cards de configurações */}
        <div className="md:col-span-2 space-y-8">
          {/* Card de Nome */}
          <Card className="shadow-md">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded-full"></div>
                <div className="h-6 w-32 bg-muted rounded"></div>
              </div>
              <div className="h-4 w-72 bg-muted rounded mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="h-10 w-64 bg-muted rounded"></div>
                <div className="h-9 w-24 bg-muted rounded mt-3 sm:mt-0"></div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card de Email */}
          <Card className="shadow-md">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded-full"></div>
                <div className="h-6 w-40 bg-muted rounded"></div>
              </div>
              <div className="h-4 w-80 bg-muted rounded mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="h-10 w-64 bg-muted rounded"></div>
                <div className="h-9 w-24 bg-muted rounded mt-3 sm:mt-0"></div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card de Contato */}
          <Card className="shadow-md">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded-full"></div>
                <div className="h-6 w-44 bg-muted rounded"></div>
              </div>
              <div className="h-4 w-64 bg-muted rounded mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              {/* Skeleton dos inputs */}
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 w-44 bg-muted rounded"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
              
              <div className="pt-2">
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card de Deletar Conta */}
          <Card className="shadow-md border border-red-100 dark:border-red-900/30">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded-full"></div>
                <div className="h-6 w-36 bg-muted rounded"></div>
              </div>
              <div className="h-4 w-60 bg-muted rounded mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div className="h-20 w-full max-w-md bg-muted rounded"></div>
              <div className="h-10 w-40 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
        
        {/* Lado direito - Skeleton do preview */}
        <div className="md:col-span-1">
          <Card className="sticky top-6 shadow-md">
            <CardHeader className="pb-2">
              <div className="h-6 w-48 bg-muted rounded mb-2"></div>
              <div className="h-4 w-56 bg-muted rounded"></div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 bg-muted rounded-full mb-4"></div>
                <div className="h-6 w-40 bg-muted rounded mb-2"></div>
                <div className="h-5 w-48 bg-muted rounded mb-3"></div>
                <div className="h-8 w-full bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 