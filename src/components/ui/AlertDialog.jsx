import { useEffect, useRef } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

const AlertDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    variant = 'danger', 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    loading = false
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
            console.log('hey');
            
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (variant) {
            case 'danger': return <AlertCircle className="w-12 h-12 text-red-500 bg-red-50 p-2 rounded-full" />;
            case 'success': return <CheckCircle className="w-12 h-12 text-green-500 bg-green-50 p-2 rounded-full" />;
            case 'info': return <Info className="w-12 h-12 text-blue-500 bg-blue-50 p-2 rounded-full" />;
            case 'warning': return <AlertTriangle className="w-12 h-12 text-yellow-500 bg-yellow-50 p-2 rounded-full" />;
            default: return <AlertCircle className="w-12 h-12 text-gray-500 bg-gray-50 p-2 rounded-full" />;
        }
    };

    const getButtonColor = () => {
        switch (variant) {
            case 'danger': return 'bg-red-600 hover:bg-red-700 focus:ring-red-200';
            case 'success': return 'bg-green-600 hover:bg-green-700 focus:ring-green-200';
            case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-200';
            default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div 
                ref={modalRef}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                        {getIcon()}
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {title}
                    </h2>
                    
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
                            disabled={loading}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl shadow-lg shadow-gray-200 focus:outline-none focus:ring-4 transition-all ${getButtonColor()} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;
