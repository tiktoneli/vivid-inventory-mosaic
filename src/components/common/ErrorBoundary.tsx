
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 max-w-md w-full border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 dark:bg-red-800/30 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Something went wrong</h2>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We encountered an error while rendering this view. Please try again or return to the dashboard.
            </p>
            
            {this.state.error && (
              <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded mb-4 overflow-auto max-h-[200px]">
                <p className="text-sm font-mono text-red-800 dark:text-red-300">{this.state.error.message}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={() => this.setState({ hasError: false, error: null })} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Try again
              </button>
              <Link 
                to="/"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
