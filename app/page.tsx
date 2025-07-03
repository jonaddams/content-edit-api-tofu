'use client';

import { useEffect, useState } from 'react';
import Viewer from '@/components/viewer';

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isContentEditing, setIsContentEditing] = useState(false);

  // Listen for editing state changes from the viewer
  useEffect(() => {
    const handleEditingStateChange = (event: CustomEvent) => {
      setIsEditing(event.detail.isEditing);
      // Reset selected count when editing mode changes
      if (!event.detail.isEditing) {
        setSelectedCount(0);
      }
    };

    const handleSelectedBlocksChange = (event: CustomEvent) => {
      setSelectedCount(event.detail.selectedCount);
    };

    const handleContentEditingStateChange = (event: CustomEvent) => {
      setIsContentEditing(event.detail.isContentEditing);
    };

    // Set up global event listeners
    window.addEventListener('editingStateChange', handleEditingStateChange as EventListener);
    window.addEventListener('selectedBlocksChange', handleSelectedBlocksChange as EventListener);
    window.addEventListener('contentEditingStateChange', handleContentEditingStateChange as EventListener);

    return () => {
      window.removeEventListener('editingStateChange', handleEditingStateChange as EventListener);
      window.removeEventListener('selectedBlocksChange', handleSelectedBlocksChange as EventListener);
      window.removeEventListener('contentEditingStateChange', handleContentEditingStateChange as EventListener);
    };
  }, []);
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='mx-auto px-4 sm:px-6 lg:px-4'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>Content Editing API Demo - TOFU</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='flex flex-1'>
        {/* Sidebar */}
        <aside className='w-64 bg-white shadow-sm border-r border-gray-200'>
          <div className='h-full px-4 py-6'>
            {/* <h2 className='text-lg font-medium text-gray-900 mb-4'>Navigation</h2> */}
            <nav className='space-y-3'>
              <button
                type='button'
                onClick={() => !isContentEditing && window.viewerInstance?.detectText?.()}
                disabled={isContentEditing}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  isContentEditing
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : isEditing
                      ? 'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 shadow-sm cursor-pointer'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                title={
                  isContentEditing
                    ? 'Cannot use Detect Text while Edit Text is active'
                    : isEditing
                      ? 'Click to exit text detection mode'
                      : 'Detect and highlight text blocks in the document'
                }
              >
                <svg
                  className={`mr-3 h-5 w-5 ${isContentEditing ? 'text-gray-400' : isEditing ? 'text-white' : 'text-gray-600'}`}
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-label='Detect text blocks'
                >
                  <title>Detect text blocks</title>
                  <path d='M0 0h24v24H0z' fill='none' />
                  <rect x='5' y='5' width='12' height='12' stroke='currentColor' fill='none' strokeWidth='2' />
                  <rect x='9' y='9' width='12' height='12' stroke='currentColor' fill='none' strokeWidth='2' />
                </svg>
                Detect Text
              </button>
              <button
                type='button'
                onClick={() => isEditing && selectedCount === 0 && !isContentEditing && window.viewerInstance?.toggleFindReplace?.()}
                disabled={!isEditing || selectedCount > 0 || isContentEditing}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  isEditing && selectedCount === 0 && !isContentEditing
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-sm cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
                title={
                  isContentEditing
                    ? 'Cannot use Find & Replace while Edit Text is active'
                    : !isEditing
                      ? 'Enable Content Boxes mode first'
                      : selectedCount > 0
                        ? `Deselect ${selectedCount} text block${selectedCount > 1 ? 's' : ''} to use Find & Replace`
                        : 'Find & Replace text across all blocks'
                }
              >
                <svg
                  className={`mr-3 h-5 w-5 ${isEditing && selectedCount === 0 && !isContentEditing ? 'text-white' : 'text-gray-400'}`}
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <title>Scroll through text</title>
                  <path d='M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' />
                  <circle cx='18' cy='7' r='2' fill={isEditing && selectedCount === 0 && !isContentEditing ? 'white' : '#6b7280'} />
                  <path
                    d='M16.5 11.5l3 3-3 3M20 14.5h-4'
                    stroke={isEditing && selectedCount === 0 && !isContentEditing ? 'white' : '#6b7280'}
                    strokeWidth='1.5'
                    fill='none'
                  />
                </svg>
                Find & Replace
              </button>
              <button
                type='button'
                onClick={() => isEditing && selectedCount > 0 && !isContentEditing && window.viewerInstance?.triggerAIReplace?.()}
                disabled={!isEditing || selectedCount === 0 || isContentEditing}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  isEditing && selectedCount > 0 && !isContentEditing
                    ? 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700 hover:border-orange-700 shadow-sm cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
                title={
                  isContentEditing
                    ? 'Cannot use AI Reword while Edit Text is active'
                    : !isEditing
                      ? 'Enable Content Boxes mode first'
                      : selectedCount === 0
                        ? 'Select text blocks first (click on blue boxes to turn them red)'
                        : `Reword ${selectedCount} selected text block${selectedCount > 1 ? 's' : ''} with AI`
                }
              >
                <svg
                  className={`mr-3 h-5 w-5 ${isEditing && selectedCount > 0 && !isContentEditing ? 'text-white' : 'text-gray-400'}`}
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <title>Replace text</title>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                  />
                </svg>
                Reword with AI
                {selectedCount > 0 && <span className='ml-auto bg-white/20 text-xs px-2 py-1 rounded-full'>{selectedCount}</span>}
              </button>
              <button
                type='button'
                onClick={() => !isEditing && window.viewerInstance?.toggleContentEditor?.()}
                disabled={isEditing}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  isEditing
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : isContentEditing
                      ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700 shadow-sm cursor-pointer'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                title={isEditing ? 'Cannot use Edit Text while Detect Text is active' : isContentEditing ? 'Exit Edit Text mode' : 'Enter Edit Text mode'}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${isEditing ? 'text-gray-400' : isContentEditing ? 'text-white' : 'text-gray-600'}`}
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-label='Edit text'
                >
                  <title>Edit text</title>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
                Edit Text
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 h-full min-h-[600px]'>
              <div className='p-6'>
                <div className='h-full'>
                  <Viewer document='Tofu.pdf' />
                  {/* <Viewer document='sample-doc-with-google-fonts.pdf' /> */}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='text-sm text-gray-500'>© 2025 Content Editing API Demo. All rights reserved.</div>
            <div className='flex space-x-6'>
              <a href='/privacy' className='text-sm text-gray-500 hover:text-gray-900'>
                Privacy Policy
              </a>
              <a href='/terms' className='text-sm text-gray-500 hover:text-gray-900'>
                Terms of Service
              </a>
              <a href='/support' className='text-sm text-gray-500 hover:text-gray-900'>
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
