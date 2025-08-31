import React, { useState, useMemo } from 'react';
import JsonPrompting from './components/JsonPrompting';
import VeoJsonHack from './components/VeoJsonHack';
import { TabButton } from './components/TabButton';
import { BrainCircuitIcon, VideoIcon } from './components/Icons';
import { AppMode } from './types';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.JSON_PROMPTING);

  const activeComponent = useMemo(() => {
    switch (mode) {
      case AppMode.JSON_PROMPTING:
        return <JsonPrompting />;
      case AppMode.VEO_HACK:
        return <VeoJsonHack />;
      default:
        return null;
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-gray-950 dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"></div>
      
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div className="text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Gemini Advanced Techniques
                    </h1>
                    <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
                        JSON Prompting & The Veo "JSON Hack"
                    </p>
                </div>
                <ThemeToggle />
            </header>

            <nav className="flex justify-center items-center mb-8 bg-gray-200/50 dark:bg-gray-900/50 p-2 rounded-xl max-w-md mx-auto backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50">
              <TabButton
                isActive={mode === AppMode.JSON_PROMPTING}
                onClick={() => setMode(AppMode.JSON_PROMPTING)}
              >
                <BrainCircuitIcon className="w-5 h-5 mr-2" />
                JSON Prompting
              </TabButton>
              <TabButton
                isActive={mode === AppMode.VEO_HACK}
                onClick={() => setMode(AppMode.VEO_HACK)}
              >
                <VideoIcon className="w-5 h-5 mr-2" />
                Veo JSON Hack
              </TabButton>
            </nav>
        </div>

        <main>
          {activeComponent}
        </main>
      </div>
    </div>
  );
};

export default App;