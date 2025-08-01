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
        // Only set credits if we have valid data
        if (data && !data.error) {
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
        // Ensure data is an array before setting state
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
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'submitted':
      case 'queued':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Create Your Sound
              </h1>
              <div className="h-8 w-px bg-white/20"></div>
              <p className="text-lg text-white/70 font-medium">AI Music Studio</p>
            </div>
            
            {credits && (
              <div className="flex items-center gap-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-emerald-500/20 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-sm animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-200">Credits Available</span>
                  <span className="text-2xl font-bold text-white">{credits.credits_left}</span>
                </div>
                <div className="h-6 w-px bg-emerald-400/30"></div>
                <div className="text-sm text-emerald-300/80 font-medium">
                  {credits.monthly_usage}/{credits.monthly_limit} used
                </div>
              </div>
            )}
            
            {!credits && (
              <div className="bg-gradient-to-r from-amber-500/25 to-orange-500/25 backdrop-blur-sm rounded-3xl px-8 py-6 border border-amber-400/50 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-amber-400/30 rounded-2xl border border-amber-400/40">
                    <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-amber-100 mb-1">Setup Required</div>
                    <div className="text-sm text-amber-200/90 font-medium">Configure SUNO_COOKIE to enable music generation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://github.com/gcui-art/suno-api#getting-started" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border border-amber-400/30 hover:border-amber-400/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Setup Guide
                  </a>
                  <div className="text-xs text-amber-300/70">
                    Get your cookie from <span className="font-mono bg-amber-400/20 px-2 py-1 rounded">suno.com</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid xl:grid-cols-5 gap-8">
          {/* Generation Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tab Selector */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-2 border border-white/10">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('simple')}
                  className={`py-4 px-6 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'simple'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
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
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
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
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-red-300 mb-1">Generation Error</h3>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Simple Mode Form */}
            {activeTab === 'simple' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Quick Generate</h2>
                      <p className="text-sm text-white/60">Describe your music and let AI create it</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSimpleGenerate} className="space-y-6">
                    <div>
                      <label htmlFor="simple-prompt" className="block text-sm font-semibold text-white/80 mb-3">
                        Music Description
                      </label>
                      <textarea
                        id="simple-prompt"
                        value={simplePrompt}
                        onChange={(e) => setSimplePrompt(e.target.value)}
                        placeholder="A dreamy synthwave track with nostalgic 80s vibes, perfect for late night drives..."
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none text-white placeholder-white/40 backdrop-blur-sm"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <input
                        id="simple-instrumental"
                        type="checkbox"
                        checked={makeInstrumental}
                        onChange={(e) => setMakeInstrumental(e.target.checked)}
                        className="w-5 h-5 text-purple-600 bg-white/10 border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                      />
                      <label htmlFor="simple-instrumental" className="text-sm font-medium text-white/80">
                        Generate instrumental version (no vocals)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !simplePrompt.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
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

            {/* Custom Mode Form */}
            {activeTab === 'custom' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Custom Studio</h2>
                      <p className="text-sm text-white/60">Full control over your music creation</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleCustomGenerate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-white/80 mb-3">
                          Song Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Midnight Dreams"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 text-white placeholder-white/40 backdrop-blur-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="tags" className="block text-sm font-semibold text-white/80 mb-3">
                          Genre & Style
                        </label>
                        <input
                          id="tags"
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="synthwave dreamy electronic"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 text-white placeholder-white/40 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="custom-prompt" className="block text-sm font-semibold text-white/80 mb-3">
                        Lyrics & Structure
                      </label>
                      <textarea
                        id="custom-prompt"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="[Verse 1]&#10;Walking through the neon lights&#10;City dreams and endless nights&#10;&#10;[Chorus]&#10;We're chasing midnight dreams..."
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 resize-none text-white placeholder-white/40 backdrop-blur-sm"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <input
                        id="custom-instrumental"
                        type="checkbox"
                        checked={customInstrumental}
                        onChange={(e) => setCustomInstrumental(e.target.checked)}
                        className="w-5 h-5 text-pink-600 bg-white/10 border-white/20 rounded-lg focus:ring-2 focus:ring-pink-500/50"
                      />
                      <label htmlFor="custom-instrumental" className="text-sm font-medium text-white/80">
                        Generate instrumental version (no vocals)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !customPrompt.trim() || !tags.trim() || !title.trim()}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
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

          {/* Music Library */}
          <div className="xl:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Your Music Library</h2>
                      <p className="text-sm text-white/60">
                        {generatedSongs.length} {generatedSongs.length === 1 ? 'Track' : 'Tracks'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={fetchGeneratedSongs}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white font-medium px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>

                {generatedSongs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-3xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No music created yet</h3>
                    <p className="text-white/60 max-w-sm mx-auto">Start by generating your first song using the forms on the left. Your creations will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {Array.isArray(generatedSongs) && generatedSongs.map((song) => (
                      <div key={song.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-200">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-white truncate">
                                  {song.title || 'Untitled Track'}
                                </h4>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(song.status)}`}>
                                  {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-white/60 mb-3">
                                Created {formatDate(song.created_at)}
                              </p>
                            </div>
                          </div>

                          {song.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {song.tags.split(' ').slice(0, 4).map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Audio Player */}
                          {song.audio_url ? (
                            <div className="bg-white/5 rounded-2xl p-4 mb-4">
                              <audio controls className="w-full">
                                <source src={song.audio_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          ) : (
                            <div className="bg-white/5 rounded-2xl p-6 mb-4 text-center">
                              <div className="w-8 h-8 border-2 border-white/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
                              <p className="text-sm text-white/60">Generating audio...</p>
                            </div>
                          )}

                          {(song.status === 'complete' || song.status === 'streaming') && song.audio_url && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => downloadSong(song)}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 font-medium border border-white/20"
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
                                  className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 font-medium border border-white/20"
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
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}