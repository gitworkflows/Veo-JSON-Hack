import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateVideo } from '../services/geminiService';
import { 
    DEFAULT_VEO_PROMPT, 
    VEO_LOADING_MESSAGES, 
    VEO_CORE_STRUCTURE_PROMPT,
    VEO_ANIMATION_PROMPT,
    VEO_DOCUMENTARY_PROMPT,
    VEO_ABSTRACT_PROMPT
} from '../constants';
import { Loader } from './Loader';
import { ProgressBar } from './ProgressBar';
import { SendIcon, DownloadIcon } from './Icons';
import { useDebounce } from '../hooks/useDebounce';

const VeoJsonHack: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(DEFAULT_VEO_PROMPT);
  const debouncedPrompt = useDebounce(prompt, 500);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [fps, setFps] = useState<string>('30');
  const [duration, setDuration] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  
  const messageIntervalRef = useRef<number | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    return () => {
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
      if(videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);
  
  useEffect(() => {
    if (apiError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [apiError]);

  useEffect(() => {
    if (!debouncedPrompt.trim()) {
      setSyntaxError(null);
      return;
    }
    try {
      const jsonString = debouncedPrompt.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      JSON.parse(jsonString);
      setSyntaxError(null);
    } catch (e) {
      if (e instanceof SyntaxError) {
        setSyntaxError(`Invalid JSON. Check for missing commas, brackets, or quotes. Details: ${e.message}`);
      } else {
        setSyntaxError('An unexpected parsing error occurred.');
      }
    }
  }, [debouncedPrompt]);

  const startLoadingIndicators = () => {
    let messageIndex = 0;
    setLoadingMessage(VEO_LOADING_MESSAGES[messageIndex]);
    messageIntervalRef.current = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % VEO_LOADING_MESSAGES.length;
      setLoadingMessage(VEO_LOADING_MESSAGES[messageIndex]);
    }, 3000);
  };

  const stopLoadingIndicators = () => {
    if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    messageIntervalRef.current = null;
    setLoadingMessage('');
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handleSubmit = useCallback(async () => {
    setApiError(null);
    if (syntaxError) {
      return;
    }
    if (!prompt) {
      setApiError('Prompt cannot be empty.');
      return;
    }

    let parsedPrompt: any;
    try {
      const jsonString = prompt.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      parsedPrompt = JSON.parse(jsonString);
    } catch (e) {
        setApiError(`Invalid JSON structure in prompt. Please fix the syntax.`);
        return;
    }

    if (typeof parsedPrompt === 'object' && parsedPrompt !== null) {
      if (typeof parsedPrompt.video_metadata !== 'object' || parsedPrompt.video_metadata === null) {
        parsedPrompt.video_metadata = {};
      }
      parsedPrompt.video_metadata.aspect_ratio = aspectRatio;
      parsedPrompt.video_metadata.fps = parseInt(fps, 10);
      if (duration) {
          parsedPrompt.video_metadata.target_duration_seconds = parseInt(duration, 10);
      } else {
          delete parsedPrompt.video_metadata.target_duration_seconds;
      }
    }
    const finalPrompt = JSON.stringify(parsedPrompt, null, 2);

    setIsLoading(true);
    setVideoUrl(null);
    startLoadingIndicators();
    setProgress(0);
    setIsGlowing(false);

    try {
      const url = await generateVideo(finalPrompt, setProgress);
      setVideoUrl(url);
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 3000);
    } catch (e) {
      if (e instanceof Error) {
        setApiError(`Video generation failed: ${e.message}`);
      } else {
        setApiError('An unexpected error occurred during video generation.');
      }
      setProgress(0);
    } finally {
      setIsLoading(false);
      stopLoadingIndicators();
    }
  }, [prompt, syntaxError, aspectRatio, fps, duration]);
  
  const templates = [
      { name: 'Simple Example', prompt: DEFAULT_VEO_PROMPT },
      { name: 'Core Structure', prompt: VEO_CORE_STRUCTURE_PROMPT },
      { name: 'Animation', prompt: VEO_ANIMATION_PROMPT },
      { name: 'Documentary', prompt: VEO_DOCUMENTARY_PROMPT },
      { name: 'Abstract', prompt: VEO_ABSTRACT_PROMPT },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col gap-6 p-4 md:p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm xl:col-span-2">
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">The "Veo JSON Hack"</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Veo generates video from text. While it doesn't officially take JSON, we can "hack" it by providing a highly structured, JSON-like prompt. This gives us more precise control over scenes, camera angles, and actions.
            </p>
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="veo-prompt" className="block text-sm font-medium text-indigo-600 dark:text-indigo-400">
              JSON-Like Video Prompt
            </label>
            <select
                onChange={(e) => { if (e.target.value) { handlePromptChange(e.target.value); }; }}
                className="text-sm font-medium px-3 py-1 bg-gray-200/60 dark:bg-gray-800/60 text-indigo-600 dark:text-indigo-300 rounded-md hover:bg-gray-300/60 dark:hover:bg-gray-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-indigo-500"
                aria-label="Load a prompt template"
                defaultValue=""
            >
                <option value="" disabled>Load a template...</option>
                {templates.map(t => <option key={t.name} value={t.prompt}>{t.name}</option>)}
            </select>
          </div>
          <textarea
            id="veo-prompt"
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            className={`w-full flex-grow min-h-[20rem] md:min-h-[24rem] p-3 bg-gray-100 dark:bg-gray-800 border rounded-lg focus:ring-2 transition duration-200 resize-none font-mono text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${syntaxError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'}`}
            placeholder="Describe your video scenes here..."
          />
          {syntaxError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{syntaxError}</p>}
        </div>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <h4 className="text-md font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Video Parameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Aspect Ratio
                    </label>
                    <select
                        id="aspect-ratio"
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full text-sm font-medium px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="9:16">9:16 (Vertical)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:3">4:3 (Standard)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="fps" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Frame Rate (FPS)
                    </label>
                    <select
                        id="fps"
                        value={fps}
                        onChange={(e) => setFps(e.target.value)}
                        className="w-full text-sm font-medium px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                        <option value="24">24 (Cinematic)</option>
                        <option value="30">30 (Standard)</option>
                        <option value="60">60 (Smooth)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Duration (s)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full text-sm font-medium px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
                        placeholder="e.g., 15"
                        min="1"
                        max="120"
                    />
                </div>
            </div>
        </div>

        {apiError && <div ref={errorRef} className="p-3 my-2 text-sm text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-900/50 rounded-lg animate-shake">{apiError}</div>}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !!syntaxError}
          className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-500/50 dark:disabled:bg-indigo-500/30 disabled:cursor-not-allowed transition-colors duration-300 mt-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-950"
        >
          {isLoading ? <Loader /> : <SendIcon className="w-5 h-5 mr-2" />}
          Generate Video
        </button>
      </div>
      <div className={`flex flex-col p-4 md:p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-shadow duration-1000 xl:col-span-3 ${isGlowing ? 'animate-glow' : ''}`}>
        <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-4">Generated Video</h3>
        <div className="flex-grow bg-gray-100 dark:bg-gray-800/80 rounded-lg flex items-center justify-center aspect-video">
          {isLoading && (
            <div className="text-center w-full max-w-sm mx-auto p-4">
              <Loader size="lg"/>
              <p className="mt-4 text-indigo-600 dark:text-indigo-300 h-6">{loadingMessage}</p>
              <div className="mt-4">
                <ProgressBar progress={progress} />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">(Video generation can take several minutes)</p>
            </div>
          )}
          {!isLoading && !apiError && videoUrl && (
            <div className="relative w-full h-full group">
                <video src={videoUrl} controls autoPlay loop className="w-full h-full rounded-lg" />
                <a
                  href={videoUrl}
                  download={`gemini-veo-video-${Date.now()}.mp4`}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600/80 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                  aria-label="Download video"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Download
                </a>
            </div>
          )}
          {!isLoading && !videoUrl && (
            <div className="text-center p-4">
              {apiError ? (
                 <div className="p-4 text-red-800 dark:text-red-300">{apiError}</div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">Your generated video will appear here.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VeoJsonHack;