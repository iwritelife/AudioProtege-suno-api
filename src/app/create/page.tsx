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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Section className="py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Music with AI</h1>
            <p className="text-lg text-gray-600 mb-6">
              Generate amazing music using Suno AI's powerful music generation technology
            </p>
            
            {/* Credits Display */}
            {credits && (
              <div className="inline-flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Credits: {credits.credits_left}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Monthly: {credits.monthly_usage}/{credits.monthly_limit}
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Generation Forms */}
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab('simple')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'simple'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Simple Mode
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'custom'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Custom Mode
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="text-red-800 text-sm">{error}</div>
                  </div>
                </div>
              )}

              {/* Simple Mode Form */}
              {activeTab === 'simple' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Simple Generation</h2>
                  <form onSubmit={handleSimpleGenerate} className="space-y-4">
                    <div>
                      <label htmlFor="simple-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your music
                      </label>
                      <textarea
                        id="simple-prompt"
                        value={simplePrompt}
                        onChange={(e) => setSimplePrompt(e.target.value)}
                        placeholder="A popular heavy metal song about war, sung by a deep-voiced male singer, slowly and melodiously..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="simple-instrumental"
                        type="checkbox"
                        checked={makeInstrumental}
                        onChange={(e) => setMakeInstrumental(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="simple-instrumental" className="ml-2 block text-sm text-gray-700">
                        Make instrumental (no vocals)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !simplePrompt.trim()}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </div>
                      ) : (
                        'Generate Music'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Custom Mode Form */}
              {activeTab === 'custom' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Generation</h2>
                  <form onSubmit={handleCustomGenerate} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Song Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Silent Battlefield"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Music Style/Genre
                      </label>
                      <input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="pop metal male melancholic"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                        Lyrics/Prompt
                      </label>
                      <textarea
                        id="custom-prompt"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="[Verse 1]&#10;Cruel flames of war engulf this land&#10;Battlefields filled with death and dread..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="custom-instrumental"
                        type="checkbox"
                        checked={customInstrumental}
                        onChange={(e) => setCustomInstrumental(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="custom-instrumental" className="ml-2 block text-sm text-gray-700">
                        Make instrumental (no vocals)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || !customPrompt.trim() || !tags.trim() || !title.trim()}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </div>
                      ) : (
                        'Generate Custom Music'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Generated Songs List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Generated Music</h2>
              <GeneratedSongsList 
                songs={generatedSongs} 
                onRefresh={fetchGeneratedSongs}
                isLoading={isGenerating}
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}