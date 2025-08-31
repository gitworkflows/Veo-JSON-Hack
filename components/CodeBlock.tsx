import React from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800/80 rounded-lg overflow-hidden">
      <pre className="h-full w-full overflow-auto p-4">
        <code className={`language-${language} text-sm text-gray-800 dark:text-gray-300`}>
          {code}
        </code>
      </pre>
    </div>
  );
};