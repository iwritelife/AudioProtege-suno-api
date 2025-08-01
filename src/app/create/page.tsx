'use client';

import { useState, useEffect } from 'react';
import Section from '../components/Section';
import AudioPlayer from '../components/AudioPlayer';
import GeneratedSongsList from '../components/GeneratedSongsList';
import { AudioInfo } from '@/lib/SunoApi';

export default function CreatePage() {
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
      const data = await response.json();
      setCredits(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchGeneratedSongs = async () => {
    try {
      const response = await fetch('/api/get');
      const data = await response.json();
      setGeneratedSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <h1 className="text-5xl font-bold tracking-tight">Tune Gawd Studio</h1>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Create chart-topping hits with AI. Your musical vision, our advanced technology.
            </p>
            
            {/* Credits Display */}
            {credits && (
              <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-slate-200/50 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
                  <span className="text-sm font-semibold text-slate-700">Credits Available</span>
                  <span className="text-2xl font-bold text-slate-900">{credits.credits_left}</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="text-sm text-slate-500">
                  <span className="font-medium">{credits.monthly_usage}</span>
                  <span className="mx-1">/</span>
                  <span>{credits.monthly_limit}</span>
                  <span className="ml-1">used this month</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid xl:grid-cols-5 gap-8">
            {/* Generation Forms */}
            <div className="xl:col-span-2 space-y-8">
              {/* Tab Selector */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-slate-200/50">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab('simple')}
                    className={`py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'simple'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                    className={`py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'custom'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-red-800 mb-1">Generation Error</h3>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Simple Mode Form */}
              {activeTab === 'simple' && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Quick Generate</h2>
                        <p className="text-sm text-slate-500">Describe your music and let AI create it</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSimpleGenerate} className="space-y-6">
                      <div>
                        <label htmlFor="simple-prompt" className="block text-sm font-semibold text-slate-700 mb-3">
                          Music Description
                        </label>
                        <textarea
                          id="simple-prompt"
                          value={simplePrompt}
                          onChange={(e) => setSimplePrompt(e.target.value)}
                          placeholder="A dreamy synthwave track with nostalgic 80s vibes, perfect for late night drives..."
                          className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none text-slate-700 placeholder-slate-400"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl">
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

              {/* Custom Mode Form */}
              {activeTab === 'custom' && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Custom Studio</h2>
                        <p className="text-sm text-slate-500">Full control over your music creation</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleCustomGenerate} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-3">
                            Song Title
                          </label>
                          <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Midnight Dreams"
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="tags" className="block text-sm font-semibold text-slate-700 mb-3">
                            Genre & Style
                          </label>
                          <input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="synthwave dreamy electronic"
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="custom-prompt" className="block text-sm font-semibold text-slate-700 mb-3">
                          Lyrics & Structure
                        </label>
                        <textarea
                          id="custom-prompt"
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="[Verse 1]&#10;Walking through the neon lights&#10;City dreams and endless nights&#10;&#10;[Chorus]&#10;We're chasing midnight dreams..."
                          className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none text-slate-700 placeholder-slate-400"
                          rows={6}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl">
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

            {/* Generated Songs List */}
            <div className="xl:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden h-fit">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Your Music Library</h2>
                      <p className="text-sm text-slate-500">Listen, download, and manage your creations</p>
                    </div>
                  </div>
                  
                  <GeneratedSongsList 
                    songs={generatedSongs} 
                    onRefresh={fetchGeneratedSongs}
                    isLoading={isGenerating}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}