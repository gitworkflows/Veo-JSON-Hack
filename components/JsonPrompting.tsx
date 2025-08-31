import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateJsonContent } from '../services/geminiService';
import { DEFAULT_JSON_PROMPT, DEFAULT_SCHEMA } from '../constants';
import { CodeBlock } from './CodeBlock';
import { Loader } from './Loader';
import { SendIcon, CopyIcon, CheckIcon, HistoryIcon } from './Icons';
import { JsonHistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'json_prompting_history';

const JsonPrompting: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(DEFAULT_JSON_PROMPT);
  const [schema, setSchema] = useState<string>(JSON.stringify(DEFAULT_SCHEMA, null, 2));
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<JsonHistoryItem[]>([]);
  const [isGlowing, setIsGlowing] = useState(false);

  const errorRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const handleSchemaChange = (newSchema: string) => {
    setSchema(newSchema);
    if (newSchema.trim() === '') {
      setSchemaError(null);
      return;
    }
    try {
      JSON.parse(newSchema);
      setSchemaError(null);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setSchemaError(`Invalid JSON: ${err.message}`);
      }
    }
  };

  const handleSubmit = useCallback(async () => {
    if (schemaError) {
      setError("Please fix the invalid JSON schema before submitting.");
      return;
    }
    if (!prompt || !schema) {
      setError('Prompt and schema cannot be empty.');
      return;
    }

    setIsLoading(true);
    setResult('');
    setError(null);
    setIsGlowing(false);

    try {
      const parsedSchema = JSON.parse(schema);
      const responseText = await generateJsonContent(prompt, parsedSchema);
      
      if (responseText.startsWith('Error:')) {
          setError(responseText);
          setResult('');
      } else {
          let formattedResult = responseText;
          try {
              const jsonResponse = JSON.parse(responseText);
              formattedResult = JSON.stringify(jsonResponse, null, 2);
          } catch {
              // If it's not valid JSON, show the raw text
          }
          setResult(formattedResult);
          setIsGlowing(true);
          setTimeout(() => setIsGlowing(false), 3000);


          // Add to history
          setHistory(prev => {
            const isDuplicate = prev.some(item => item.prompt === prompt && item.schema === schema);
            if (isDuplicate) return prev;
            const newHistoryItem: JsonHistoryItem = { id: new Date().toISOString(), prompt, schema };
            return [newHistoryItem, ...prev].slice(0, 10); // Keep last 10
          });

      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(`Schema is not valid JSON: ${e.message}`);
      } else if (e instanceof Error) {
        setError(`An error occurred: ${e.message}`);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, schema, schemaError]);

  const handleCopy = useCallback(() => {
    if (!result || !navigator.clipboard) return;
    navigator.clipboard.writeText(result).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  }, [result]);

  const handleReloadHistory = (item: JsonHistoryItem) => {
    setPrompt(item.prompt);
    setSchema(item.schema);
    setSchemaError(null);
    setError(null);
    setResult('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-6 backdrop-blur-sm">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                Your Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="e.g., Generate a list of sci-fi movie plots."
              />
            </div>
            <div>
              <label htmlFor="schema" className="block text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                JSON Response Schema
              </label>
              <textarea
                id="schema"
                value={schema}
                onChange={(e) => handleSchemaChange(e.target.value)}
                className={`w-full h-72 p-3 bg-gray-100 dark:bg-gray-800 border rounded-lg focus:ring-2 transition duration-200 resize-none font-mono text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${schemaError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'}`}
                placeholder="Enter your JSON schema here..."
              />
              {schemaError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{schemaError}</p>}
            </div>
            {error && <div ref={errorRef} className="p-4 text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-900/50 rounded-lg animate-shake">{error}</div>}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !!schemaError}
              className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-500/50 dark:disabled:bg-indigo-500/30 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-950"
            >
              {isLoading ? <Loader /> : <SendIcon className="w-5 h-5 mr-2" />}
              Generate JSON
            </button>
        </div>
        {history.length > 0 && (
          <div className="p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
             <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-4 flex items-center"><HistoryIcon className="w-5 h-5 mr-2"/> History</h3>
             <div className="max-h-48 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  {history.map(item => (
                    <li key={item.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800/70 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate pr-4">
                        {item.prompt}
                      </p>
                      <button onClick={() => handleReloadHistory(item)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 rounded-md">
                        Reload
                      </button>
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        )}
      </div>
      <div ref={outputRef} className={`flex flex-col p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-shadow duration-1000 ${isGlowing ? 'animate-glow' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">Structured Output</h3>
          {result && (
              <button onClick={handleCopy} className="flex items-center text-sm px-3 py-1 bg-gray-200/60 dark:bg-gray-800/60 text-indigo-600 dark:text-indigo-300 rounded-md hover:bg-gray-300/60 dark:hover:bg-gray-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900">
                  {isCopied ? <CheckIcon className="w-4 h-4 mr-2 text-green-500"/> : <CopyIcon className="w-4 h-4 mr-2"/>}
                  {isCopied ? 'Copied!' : 'Copy'}
              </button>
          )}
        </div>
        <div className="flex-grow bg-gray-100 dark:bg-gray-800/80 rounded-lg p-1 min-h-[300px] relative">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          )}
          {!isLoading && !result && !error && <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Your structured JSON will appear here.</div>}
          {result && <CodeBlock code={result} language="json" />}
        </div>
      </div>
    </div>
  );
};

export default JsonPrompting;