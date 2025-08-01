'use client';

import { useState } from 'react';
import { AudioInfo } from '@/lib/SunoApi';
import AudioPlayer from './AudioPlayer';

interface GeneratedSongsListProps {
  songs: AudioInfo[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function GeneratedSongsList({ songs, onRefresh, isLoading }: GeneratedSongsListProps) {
  const [expandedSong, setExpandedSong] = useState<string | null>(null);

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
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpanded = (songId: string) => {
    setExpandedSong(expandedSong === songId ? null : songId);
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

  if (songs.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No music created yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto">Start by generating your first song using the forms on the left. Your creations will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">
            {songs.length} {songs.length === 1 ? 'Track' : 'Tracks'}
          </h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin"></div>
              <span>Generating...</span>
            </div>
          )}
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {songs.map((song) => (
          <div key={song.id} className="bg-gradient-to-r from-white to-slate-50/30 border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-slate-900 truncate">
                      {song.title || 'Untitled Track'}
                    </h4>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(song.status)}`}>
                      {getStatusIcon(song.status)}
                      {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    Created {formatDate(song.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpanded(song.id)}
                  className="flex-shrink-0 w-8 h-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${expandedSong === song.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {song.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {song.tags.split(' ').slice(0, 4).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
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

              <AudioPlayer song={song} className="mb-4" />

              {(song.status === 'complete' || song.status === 'streaming') && song.audio_url && (
                <div className="flex gap-3">
                  <button
                    onClick={() => downloadSong(song)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 font-medium"
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
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 font-medium"
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

            {expandedSong === song.id && (
              <div className="border-t border-slate-200/50 bg-slate-50/50 p-6">
                <div className="space-y-4">
                  {song.gpt_description_prompt && (
                    <div>
                      <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Original Prompt
                      </h5>
                      <p className="text-sm text-slate-600 bg-white/60 p-4 rounded-xl border border-slate-200/50">{song.gpt_description_prompt}</p>
                    </div>
                  )}
                  
                  {song.lyric && (
                    <div>
                      <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Lyrics
                      </h5>
                      <pre className="text-sm text-slate-600 whitespace-pre-wrap font-mono bg-white/60 p-4 rounded-xl border border-slate-200/50 max-h-40 overflow-y-auto custom-scrollbar">
                        {song.lyric}
                      </pre>
                    </div>
                  )}

                  {song.error_message && (
                    <div>
                      <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Error Details
                      </h5>
                      <p className="text-sm text-red-600 bg-red-50/60 p-4 rounded-xl border border-red-200/50">{song.error_message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200/50">
                    <span className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Model: {song.model_name}
                    </span>
                    <span className="font-mono">ID: {song.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
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