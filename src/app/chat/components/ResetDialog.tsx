import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

const ResetDialog: React.FC<ResetDialogProps> = ({
  isOpen,
  onClose,
  onReset
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reiniciar conversa?</DialogTitle>
          <DialogDescription>
            Você está tentando interagir com uma mensagem anterior. Deseja reiniciar a conversa do início?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onReset} variant="default">
            Reiniciar conversa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetDialog; 