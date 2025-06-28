import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cyber-gradient flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-dark-200/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-cyber font-bold text-white mb-4">
              Oops! Nešto je pošlo po zlu
            </h2>
            
            <p className="text-gray-300 font-tech mb-6">
              Dogodila se neočekivana greška. Molimo pokušajte ponovno učitati stranicu.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-dark-300/50 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-400 font-mono text-sm break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReload}
              className="flex items-center space-x-2 bg-neon-gradient text-white px-6 py-3 rounded-xl font-tech font-semibold hover:shadow-lg hover:shadow-neon-blue/25 transition-all duration-300 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Ponovno učitaj</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;