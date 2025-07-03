export interface Action {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'ghost' | 'link' | 'outline' | 'destructive';
}

export interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    actions?: Action[];
} 