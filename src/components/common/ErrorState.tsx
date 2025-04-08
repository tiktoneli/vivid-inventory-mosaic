
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  backLink?: string;
  backLinkText?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Error",
  message = "Something went wrong. Please try again.",
  backLink,
  backLinkText = "Go back",
  onRetry
}) => {
  return (
    <div className="flex justify-center p-6">
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 max-w-md w-full border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 dark:bg-red-800/30 p-2 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">{title}</h2>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {message}
        </p>
        
        <div className="flex gap-3">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="destructive"
            >
              Try again
            </Button>
          )}
          {backLink && (
            <Link to={backLink}>
              <Button variant="outline">
                {backLinkText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
