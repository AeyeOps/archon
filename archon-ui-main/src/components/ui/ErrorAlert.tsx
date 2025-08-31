/**
 * Enhanced error alert component for displaying OpenAI API errors
 * 
 * Provides specialized UI feedback for different error types including
 * quota exhaustion, rate limiting, and API errors.
 * 
 * Related to GitHub issue #362 - improves user experience by showing
 * clear, actionable error messages instead of generic failures.
 */

import React from 'react';
import { Alert, AlertDescription } from './Alert';
import { EnhancedError, getDisplayErrorMessage, getErrorSeverity, getErrorAction } from '../../services/knowledgeBaseErrorHandler';

interface ErrorAlertProps {
  error: EnhancedError | null;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss, className = '' }) => {
  if (!error) return null;

  const severity = getErrorSeverity(error);
  const displayMessage = getDisplayErrorMessage(error);
  const suggestedAction = getErrorAction(error);
  
  // Determine alert styling based on severity
  const alertVariant = severity === 'error' ? 'destructive' : 'default';
  
  // Special styling for OpenAI errors
  const isOpenAIError = error.isOpenAIError;

  return (
    <Alert variant={alertVariant} className={`mb-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Error icon based on type */}
          <div className="flex items-center gap-2 mb-2">
            {isOpenAIError ? (
              <span className="text-lg">⚠️</span>
            ) : (
              <span className="text-lg">❌</span>
            )}
            <span className="font-semibold">
              {isOpenAIError ? 'OpenAI API Error' : 'Error'}
            </span>
          </div>
          
          {/* Main error message */}
          <AlertDescription className="text-sm mb-2">
            {displayMessage}
          </AlertDescription>
          
          {/* Suggested action for OpenAI errors */}
          {suggestedAction && (
            <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded-r">
              <p className="text-sm font-medium text-blue-800">
                💡 Suggested action:
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {suggestedAction}
              </p>
            </div>
          )}
          
          {/* Token usage info for quota errors */}
          {error.errorDetails?.tokens_used && (
            <div className="mt-2 text-xs text-gray-600">
              Tokens used: {error.errorDetails.tokens_used.toLocaleString()}
            </div>
          )}
        </div>
        
        {/* Dismiss button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Dismiss error"
          >
            <span className="text-lg">×</span>
          </button>
        )}
      </div>
    </Alert>
  );
};

/**
 * Hook for handling knowledge base operation errors
 * 
 * Usage example:
 * ```tsx
 * const { error, setError, clearError } = useErrorHandler();
 * 
 * const handleSearch = async () => {
 *   try {
 *     await knowledgeBaseService.searchKnowledgeBase(query);
 *   } catch (err) {
 *     setError(err as EnhancedError);
 *   }
 * };
 * 
 * return (
 *   <>
 *     <ErrorAlert error={error} onDismiss={clearError} />
 *     <YourComponentContent />
 *   </>
 * );
 * ```
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<EnhancedError | null>(null);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    clearError
  };
}