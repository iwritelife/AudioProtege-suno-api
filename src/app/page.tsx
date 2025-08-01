'use client';

import { useState, useEffect } from 'react';
import { AudioInfo } from '@/lib/SunoApi';

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSongs, setGeneratedSongs] = useState<AudioInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'simple' | 'custom'>('simple');
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<any>(null);

  // Simple mode form state
  const [simplePrompt, setSimplePrompt] = useState('');
  const [makeInstrumental, setMakeInstrumental] = useState(false);

  // Custom mode form state
  const [customPrompt, setCustomPrompt] = useState('');
  const [tags, setTags] = useState('');
  const [title, setTitle] = useState('');
  const [customInstrumental, setCustomInstrumental] = useState(false);

  useEffect(() => {
    fetchCredits();
    fetchGeneratedSongs();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/get_limit');
      if (response.ok) {
        const data = await response.json();
        if (data && !data.error && data.credits_left !== undefined) {
          setCredits(data);
        } else {
          console.warn('SUNO_COOKIE not configured properly:', data.error);
          setCredits(null);
        }
      } else {
        console.error('Failed to fetch credits:', response.statusText);
        setCredits(null);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits(null);
    }
  };

  const fetchGeneratedSongs = async () => {
    try {
      const response = await fetch('/api/get');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setGeneratedSongs(data);
        } else {
          console.error('API returned non-array data:', data);
          setGeneratedSongs([]);
        }
      } else {
        console.error('Failed to fetch songs:', response.statusText);
        setGeneratedSongs([]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setGeneratedSongs([]);
    }
  };

  const handleSimpleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simplePrompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: simplePrompt,
          make_instrumental: makeInstrumental,
          wait_audio: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate music');
      }

      const newSongs = await response.json();
      setGeneratedSongs(prev => [...newSongs, ...prev]);
      setSimplePrompt('');
      fetchCredits();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || !tags.trim() || !title.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/custom_generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: customPrompt,
          tags: tags,
          title: title,
          make_instrumental: customInstrumental,
          wait_audio: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate music');
      }

      const newSongs = await response.json();
      setGeneratedSongs(prev => [...newSongs, ...prev]);
      setCustomPrompt('');
      setTags('');
      setTitle('');
      fetchCredits();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSong = (song: AudioInfo) => {
    if (song.audio_url) {
      const link = document.createElement('a');
      link.href = song.audio_url;
      link.download = `${song.title || 'song'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
      case 'streaming':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'submitted':
      case 'queued':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
      case 'streaming':
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'submitted':
      case 'queued':
        return (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
        );
      case 'error':
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Professional Header */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl border border-red-400/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    TUNE GAWD
                  </h1>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Professional AI Music Studio</p>
                </div>
              </div>
            </div>
            
            {credits && credits.credits_left !== undefined ? (
              <div className="flex items-center gap-6 bg-slate-800/80 backdrop-blur-sm rounded-2xl px-8 py-4 border border-slate-600/50 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Credits</div>
                    <div className="text-2xl font-black text-white">{credits.credits_left}</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-600/50"></div>
                <div className="text-sm text-slate-400">
                  <div className="font-semibold">{credits.monthly_usage} / {credits.monthly_limit}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Monthly Usage</div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/90 backdrop-blur-sm border border-red-500/40 rounded-2xl px-8 py-6 max-w-md shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-xl border border-red-500/40">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-red-400 uppercase tracking-wider mb-1">Setup Required</div>
                    <div className="text-sm text-slate-400">Configure SUNO_COOKIE to enable music generation</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://github.com/gcui-art/suno-api#getting-started" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 uppercase tracking-wider shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Setup Guide
                  </a>
                  <div className="text-xs text-slate-500">
                    Get cookie from <span className="font-mono bg-slate-700 px-2 py-1 rounded text-slate-300">suno.com</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid xl:grid-cols-5 gap-10">
          {/* Control Panel */}
          <div className="xl:col-span-2 space-y-8">
            {/* Mode Selector */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('simple')}
                  className={`py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === 'simple'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25 border border-red-400/50'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Generate
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === 'custom'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25 border border-red-400/50'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Custom Studio
                  </div>
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">Generation Error</h3>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="flex-shrink-0 w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Control Panels */}
            {activeTab === 'simple' && (
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 border-b border-slate-600/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-wider">Quick Generate</h2>
                      <p className="text-sm text-slate-400 uppercase tracking-wider">Describe your music vision</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <form onSubmit={handleSimpleGenerate} className="space-y-8">
                    <div>
                      <label htmlFor="simple-prompt" className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                        Music Description
                      </label>
                      <textarea
                        id="simple-prompt"
                        value={simplePrompt}
                        onChange={(e) => setSimplePrompt(e.target.value)}
                        placeholder="A dreamy synthwave track with nostalgic 80s vibes, perfect for late night drives through neon-lit cities..."
                        className="w-full px-6 py-4 bg-slate-900/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 resize-none backdrop-blur-sm"
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-600/30">
                      <input
                        id="simple-instrumental"
                        type="checkbox"
                        checked={makeInstrumental}
                        onChange={(e) => setMakeInstrumental(e.target.checked)}
                        className="w-5 h-5 text-red-500 bg-slate-800 border-slate-600 rounded-lg focus:ring-red-500/50 focus:ring-2"
                      />
                      <label htmlFor="simple-instrumental" className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Generate Instrumental Version (No Vocals)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !simplePrompt.trim()}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white py-5 px-8 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 shadow-xl disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating Your Music...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          Generate Music
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 border-b border-slate-600/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-wider">Custom Studio</h2>
                      <p className="text-sm text-slate-400 uppercase tracking-wider">Full creative control</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <form onSubmit={handleCustomGenerate} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                          Song Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Midnight Dreams"
                          className="w-full px-6 py-4 bg-slate-900/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 backdrop-blur-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="tags" className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                          Genre & Style
                        </label>
                        <input
                          id="tags"
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="synthwave dreamy electronic nostalgic"
                          className="w-full px-6 py-4 bg-slate-900/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="custom-prompt" className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                        Lyrics & Structure
                      </label>
                      <textarea
                        id="custom-prompt"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="[Verse 1]&#10;Walking through the neon lights&#10;City dreams and endless nights&#10;&#10;[Chorus]&#10;We're chasing midnight dreams&#10;Nothing's quite the way it seems..."
                        className="w-full px-6 py-4 bg-slate-900/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 resize-none backdrop-blur-sm"
                        rows={8}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-600/30">
                      <input
                        id="custom-instrumental"
                        type="checkbox"
                        checked={customInstrumental}
                        onChange={(e) => setCustomInstrumental(e.target.checked)}
                        className="w-5 h-5 text-red-500 bg-slate-800 border-slate-600 rounded-lg focus:ring-red-500/50 focus:ring-2"
                      />
                      <label htmlFor="custom-instrumental" className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Generate Instrumental Version (No Vocals)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !customPrompt.trim() || !tags.trim() || !title.trim()}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white py-5 px-8 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 shadow-xl disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Crafting Your Masterpiece...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          Create Custom Music
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Music Library */}
          <div className="xl:col-span-3">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 border-b border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-wider">Music Library</h2>
                      <p className="text-sm text-slate-400 uppercase tracking-wider">
                        {generatedSongs.length} {generatedSongs.length === 1 ? 'Track' : 'Tracks'}
                        {isGenerating && <span className="ml-3 text-red-400 font-bold animate-pulse">• Recording...</span>}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={fetchGeneratedSongs}
                    className="flex items-center gap-3 text-sm text-slate-400 hover:text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/50 uppercase tracking-wider"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Library
                  </button>
                </div>
              </div>

              <div className="p-8">
                {generatedSongs.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-8 bg-slate-700/50 rounded-2xl flex items-center justify-center border border-slate-600/50">
                      <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-3">No Tracks Created</h3>
                    <p className="text-slate-400 text-lg max-w-md mx-auto">Start by generating your first track using the control panels. Your musical creations will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
                    {Array.isArray(generatedSongs) && generatedSongs.map((song) => (
                      <div key={song.id} className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 shadow-xl">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-4 mb-3">
                                <h4 className="text-lg font-bold text-white truncate uppercase tracking-wider">
                                  {song.title || 'Untitled Track'}
                                </h4>
                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${getStatusColor(song.status)}`}>
                                  {getStatusIcon(song.status)}
                                  {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                                Created {formatDate(song.created_at)}
                              </p>
                            </div>
                          </div>

                          {song.tags && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {song.tags.split(' ').slice(0, 5).map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800/80 text-slate-300 border border-slate-600/50 uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                              {song.tags.split(' ').length > 5 && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700/50 text-slate-400 border border-slate-600/30 uppercase tracking-wider">
                                  +{song.tags.split(' ').length - 5} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Audio Player */}
                          {song.audio_url ? (
                            <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-4 mb-6">
                              <audio controls className="w-full">
                                <source src={song.audio_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          ) : (
                            <div className="bg-slate-800/50 rounded-xl border border-slate-600/50 p-8 mb-6 text-center">
                              <div className="w-8 h-8 border-2 border-red-400 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                              <p className="text-sm text-red-400 font-bold uppercase tracking-wider">Recording in Progress...</p>
                              <p className="text-xs text-slate-500 mt-1">This usually takes 30-60 seconds</p>
                            </div>
                          )}

                          {(song.status === 'complete' || song.status === 'streaming') && song.audio_url && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => downloadSong(song)}
                                className="flex items-center gap-2 px-6 py-3 text-sm bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white rounded-xl transition-all duration-200 font-bold border border-slate-600/50 hover:border-slate-500/50 uppercase tracking-wider shadow-lg"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download MP3
                              </button>
                              {song.video_url && (
                                <a
                                  href={song.video_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-6 py-3 text-sm bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white rounded-xl transition-all duration-200 font-bold border border-slate-600/50 hover:border-slate-500/50 uppercase tracking-wider shadow-lg"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Watch Video
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.8);
        }
      `}</style>
    </div>
  );
}