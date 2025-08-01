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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'submitted':
      case 'queued':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    Tune Gawd Studio
                  </h1>
                  <p className="text-slate-600 font-medium">Professional AI Music Creation Platform</p>
                </div>
              </div>
            </div>
            
            {credits && (
              <div className="flex items-center gap-8 bg-gradient-to-r from-emerald-50 to-teal-50 backdrop-blur-sm rounded-2xl px-8 py-4 border border-emerald-200/50 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-sm animate-pulse"></div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-800">Available Credits</div>
                    <div className="text-2xl font-bold text-emerald-900">{credits.credits_left}</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-emerald-300"></div>
                <div className="text-sm text-emerald-700">
                  <div className="font-medium">{credits.monthly_usage}/{credits.monthly_limit}</div>
                  <div className="text-emerald-600">used this month</div>
                </div>
              </div>
            )}
            
            {!credits && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm rounded-3xl px-8 py-6 border border-amber-200/50 shadow-xl max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-2xl border border-amber-200/50">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-amber-900 mb-1">Setup Required</div>
                    <div className="text-sm text-amber-800 font-medium">Configure SUNO_COOKIE to enable music generation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://github.com/gcui-art/suno-api#getting-started" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-amber-200/50 hover:bg-amber-200/70 text-amber-900 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border border-amber-300/50 hover:border-amber-300/70"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Setup Guide
                  </a>
                  <div className="text-xs text-amber-700 font-medium">
                    Get your cookie from <span className="font-mono bg-amber-200/50 px-2 py-1 rounded">suno.com</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid xl:grid-cols-5 gap-8">
          {/* Enhanced Generation Panel */}
          <div className="xl:col-span-2 space-y-8">
            {/* Modern Tab Selector */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-2 border border-slate-200/50 shadow-lg">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('simple')}
                  className={`py-4 px-6 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'simple'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
                  className={`py-4 px-6 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'custom'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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

            {/* Enhanced Error Display */}
            {error && (
              <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-3xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-900 mb-1">Generation Error</h3>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="flex-shrink-0 w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Simple Mode Form */}
            {activeTab === 'simple' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Quick Generate</h2>
                      <p className="text-slate-600">Describe your music and let AI create it</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSimpleGenerate} className="space-y-6">
                    <div>
                      <label htmlFor="simple-prompt" className="block text-sm font-semibold text-slate-800 mb-3">
                        Music Description
                      </label>
                      <textarea
                        id="simple-prompt"
                        value={simplePrompt}
                        onChange={(e) => setSimplePrompt(e.target.value)}
                        placeholder="A dreamy synthwave track with nostalgic 80s vibes, perfect for late night drives..."
                        className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none text-slate-800 placeholder-slate-500"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-200/50">
                      <input
                        id="simple-instrumental"
                        type="checkbox"
                        checked={makeInstrumental}
                        onChange={(e) => setMakeInstrumental(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 bg-white border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <label htmlFor="simple-instrumental" className="text-sm font-medium text-slate-700">
                        Generate instrumental version (no vocals)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !simplePrompt.trim()}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating your music...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
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

            {/* Enhanced Custom Mode Form */}
            {activeTab === 'custom' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Custom Studio</h2>
                      <p className="text-slate-600">Full control over your music creation</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleCustomGenerate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-3">
                          Song Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Midnight Dreams"
                          className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-800 placeholder-slate-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="tags" className="block text-sm font-semibold text-slate-800 mb-3">
                          Genre & Style
                        </label>
                        <input
                          id="tags"
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="synthwave dreamy electronic"
                          className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-800 placeholder-slate-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="custom-prompt" className="block text-sm font-semibold text-slate-800 mb-3">
                        Lyrics & Structure
                      </label>
                      <textarea
                        id="custom-prompt"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="[Verse 1]&#10;Walking through the neon lights&#10;City dreams and endless nights&#10;&#10;[Chorus]&#10;We're chasing midnight dreams..."
                        className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none text-slate-800 placeholder-slate-500"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-200/50">
                      <input
                        id="custom-instrumental"
                        type="checkbox"
                        checked={customInstrumental}
                        onChange={(e) => setCustomInstrumental(e.target.checked)}
                        className="w-5 h-5 text-purple-600 bg-white border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                      />
                      <label htmlFor="custom-instrumental" className="text-sm font-medium text-slate-700">
                        Generate instrumental version (no vocals)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !customPrompt.trim() || !tags.trim() || !title.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Crafting your masterpiece...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
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

          {/* Enhanced Music Library */}
          <div className="xl:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Your Music Library</h2>
                      <p className="text-slate-600">
                        {generatedSongs.length} {generatedSongs.length === 1 ? 'Track' : 'Tracks'}
                        {isGenerating && <span className="ml-2 text-indigo-600 font-medium">• Generating...</span>}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={fetchGeneratedSongs}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>

                {generatedSongs.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">No music created yet</h3>
                    <p className="text-slate-600 max-w-md mx-auto leading-relaxed">Start by generating your first song using the forms on the left. Your creations will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {Array.isArray(generatedSongs) && generatedSongs.map((song) => (
                      <div key={song.id} className="bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-slate-900 truncate">
                                  {song.title || 'Untitled Track'}
                                </h4>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(song.status)}`}>
                                  {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 mb-3 font-medium">
                                Created {formatDate(song.created_at)}
                              </p>
                            </div>
                          </div>

                          {song.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {song.tags.split(' ').slice(0, 4).map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {tag}
                                </span>
                              ))}
                              {song.tags.split(' ').length > 4 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                  +{song.tags.split(' ').length - 4} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Enhanced Audio Player */}
                          {song.audio_url ? (
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-2xl p-4 mb-4 border border-slate-200/50">
                              <audio controls className="w-full">
                                <source src={song.audio_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          ) : (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-4 text-center border border-indigo-200/50">
                              <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                              <p className="text-sm text-indigo-700 font-medium">Generating audio...</p>
                              <p className="text-xs text-indigo-600 mt-1">This usually takes 30-60 seconds</p>
                            </div>
                          )}

                          {(song.status === 'complete' || song.status === 'streaming') && song.audio_url && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => downloadSong(song)}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 font-medium border border-slate-200"
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
                                  className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 font-medium border border-slate-200"
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
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}