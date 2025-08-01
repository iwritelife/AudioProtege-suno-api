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
        return 'bg-green-100 text-green-800';
      case 'submitted':
      case 'queued':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No songs yet</h3>
        <p className="text-gray-500">Generate your first song to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          {songs.length} song{songs.length !== 1 ? 's' : ''}
        </h3>
        <button
          onClick={onRefresh}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {songs.map((song) => (
          <div key={song.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {song.title || 'Untitled'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(song.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(song.status)}`}>
                    {song.status}
                  </span>
                  <button
                    onClick={() => toggleExpanded(song.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${expandedSong === song.id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {song.tags && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {song.tags.split(' ').map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-indigo-50 text-indigo-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <AudioPlayer song={song} className="mb-3" />

              {(song.status === 'complete' || song.status === 'streaming') && song.audio_url && (
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadSong(song)}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
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
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
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

            {expandedSong === song.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="space-y-3">
                  {song.gpt_description_prompt && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">Original Prompt:</h5>
                      <p className="text-xs text-gray-600">{song.gpt_description_prompt}</p>
                    </div>
                  )}
                  
                  {song.lyric && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">Lyrics:</h5>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono bg-white p-2 rounded border max-h-32 overflow-y-auto">
                        {song.lyric}
                      </pre>
                    </div>
                  )}

                  {song.error_message && (
                    <div>
                      <h5 className="text-xs font-medium text-red-700 mb-1">Error:</h5>
                      <p className="text-xs text-red-600">{song.error_message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Model: {song.model_name}</span>
                    <span>ID: {song.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}