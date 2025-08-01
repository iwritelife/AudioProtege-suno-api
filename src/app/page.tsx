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
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'submitted':
      case 'queued':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-700/50 text-gray-400 border-gray-600/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Professional Audio Header */}
      <div className="bg-gray-900 border-b border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg border border-red-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    TUNE GAWD STUDIO
                  </h1>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">AI Music Production Suite</p>
                </div>
              </div>
            </div>
            
            {credits && credits.credits_left !== undefined ? (
              <div className="flex items-center gap-6 bg-gray-800 rounded-lg px-6 py-3 border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Credits</div>
                    <div className="text-xl font-bold text-white">{credits.credits_left}</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-700"></div>
                <div className="text-xs text-gray-400">
                  <div className="font-medium">{credits.monthly_usage}/{credits.monthly_limit}</div>
                  <div className="text-gray-500 uppercase tracking-wider">Monthly Usage</div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 border border-red-500/30 rounded-lg px-6 py-4 max-w-md">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-900/30 rounded-lg border border-red-500/30">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Setup Required</div>
                    <div className="text-xs text-gray-400">Configure SUNO_COOKIE to enable music generation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://github.com/gcui-art/suno-api#getting-started" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-semibold transition-all duration-200 uppercase tracking-wider"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Setup Guide
                  </a>
                  <div className="text-xs text-gray-500">
                    Get cookie from <span className="font-mono bg-gray-700 px-2 py-1 rounded text-gray-300">suno.com</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid xl:grid-cols-5 gap-8">
          {/* Audio Equipment Style Control Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Mode Selector - Red Buttons Style */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-2xl">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('simple')}
                  className={`py-3 px-4 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === 'simple'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  }`}
                >
                  Quick Generate
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`py-3 px-4 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === 'custom'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  }`}
                >
                  Custom Studio
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-gray-800 border border-red-500/50 rounded-lg p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-900/30 rounded-lg flex items-center justify-center border border-red-500/30">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Generation Error</h3>
                    <p className="text-xs text-gray-300">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="flex-shrink-0 w-6 h-6 text-gray-400 hover:text-white hover:bg-gray-700 rounded flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Control Panels */}
            {activeTab === 'simple' && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
                <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center border border-red-500/30">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">Quick Generate</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Describe your music</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleSimpleGenerate} className="space-y-6">
                    <div>
                      <label htmlFor="simple-prompt" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Music Description
                      </label>
                      <textarea
                        id="simple-prompt"
                        value={simplePrompt}
                        onChange={(e) => setSimplePrompt(e.target.value)}
                        placeholder="A dreamy synthwave track with nostalgic 80s vibes..."
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gray-900 rounded border border-gray-600">
                      <input
                        id="simple-instrumental"
                        type="checkbox"
                        checked={makeInstrumental}
                        onChange={(e) => setMakeInstrumental(e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <label htmlFor="simple-instrumental" className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Instrumental Only
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !simplePrompt.trim()}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-4 px-6 rounded font-bold uppercase tracking-wider transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        'Generate Music'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
                <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center border border-red-500/30">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">Custom Studio</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Full Control Mode</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleCustomGenerate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="title" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                          Song Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Midnight Dreams"
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="tags" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                          Genre & Style
                        </label>
                        <input
                          id="tags"
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="synthwave dreamy electronic"
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="custom-prompt" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Lyrics & Structure
                      </label>
                      <textarea
                        id="custom-prompt"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="[Verse 1]&#10;Walking through the neon lights&#10;City dreams and endless nights..."
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gray-900 rounded border border-gray-600">
                      <input
                        id="custom-instrumental"
                        type="checkbox"
                        checked={customInstrumental}
                        onChange={(e) => setCustomInstrumental(e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <label htmlFor="custom-instrumental" className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Instrumental Only
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !customPrompt.trim() || !tags.trim() || !title.trim()}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-4 px-6 rounded font-bold uppercase tracking-wider transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        'Create Custom Music'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Music Library - Equipment Style */}
          <div className="xl:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
              <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center border border-green-500/30">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">Music Library</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {generatedSongs.length} {generatedSongs.length === 1 ? 'Track' : 'Tracks'}
                        {isGenerating && <span className="ml-2 text-red-400 font-bold">• Recording...</span>}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={fetchGeneratedSongs}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-white font-bold px-3 py-2 rounded hover:bg-gray-700 transition-all duration-200 border border-gray-600 uppercase tracking-wider"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              <div className="p-6">
                {generatedSongs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">No Tracks Recorded</h3>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">Start by generating your first track using the control panels. Your recordings will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {Array.isArray(generatedSongs) && generatedSongs.map((song) => (
                      <div key={song.id} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-200">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-sm font-bold text-white truncate uppercase tracking-wider">
                                  {song.title || 'Untitled Track'}
                                </h4>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider ${getStatusColor(song.status)}`}>
                                  {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                {formatDate(song.created_at)}
                              </p>
                            </div>
                          </div>

                          {song.tags && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {song.tags.split(' ').slice(0, 4).map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-800 text-gray-300 border border-gray-600 uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Audio Player */}
                          {song.audio_url ? (
                            <div className="bg-black rounded border border-gray-600 p-3 mb-3">
                              <audio controls className="w-full">
                                <source src={song.audio_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          ) : (
                            <div className="bg-gray-800 rounded border border-gray-600 p-4 mb-3 text-center">
                              <div className="w-6 h-6 border-2 border-red-400 border-t-red-600 rounded-full animate-spin mx-auto mb-2"></div>
                              <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Recording...</p>
                            </div>
                          )}

                          {(song.status === 'complete' || song.status === 'streaming') && song.audio_url && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => downloadSong(song)}
                                className="flex items-center gap-2 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-all duration-200 font-bold border border-gray-600 uppercase tracking-wider"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                              </button>
                              {song.video_url && (
                                <a
                                  href={song.video_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-all duration-200 font-bold border border-gray-600 uppercase tracking-wider"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Video
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
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}