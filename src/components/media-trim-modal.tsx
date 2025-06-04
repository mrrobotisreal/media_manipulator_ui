import React, { useState, useRef, useEffect } from 'react';
import { X, Scissors, Play, Pause } from 'lucide-react';

interface TrimRange {
  startTime: number;
  endTime: number;
}

interface MediaTrimModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'video' | 'audio';
  onTrimSave: (trimRange: TrimRange) => void;
  initialTrim?: TrimRange;
}

const MediaTrimModal: React.FC<MediaTrimModalProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaType,
  onTrimSave,
  initialTrim,
}) => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trimRange, setTrimRange] = useState<TrimRange>(
    initialTrim || { startTime: 0, endTime: 0 }
  );
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && mediaRef.current) {
      const media = mediaRef.current;

      const handleLoadedMetadata = () => {
        setDuration(media.duration);
        if (!initialTrim) {
          setTrimRange({ startTime: 0, endTime: media.duration });
        }
      };

      const handleTimeUpdate = () => {
        setCurrentTime(media.currentTime);
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      media.addEventListener('loadedmetadata', handleLoadedMetadata);
      media.addEventListener('timeupdate', handleTimeUpdate);
      media.addEventListener('play', handlePlay);
      media.addEventListener('pause', handlePause);

      return () => {
        media.removeEventListener('loadedmetadata', handleLoadedMetadata);
        media.removeEventListener('timeupdate', handleTimeUpdate);
        media.removeEventListener('play', handlePlay);
        media.removeEventListener('pause', handlePause);
      };
    }
  }, [isOpen, initialTrim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || duration === 0) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const clickTime = clickRatio * duration;

    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.max(0, Math.min(clickTime, duration));
    }
  };

  const handleDragStart = (e: React.MouseEvent, handle: 'start' | 'end') => {
    e.preventDefault();
    if (handle === 'start') {
      setIsDraggingStart(true);
    } else {
      setIsDraggingEnd(true);
    }
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!timelineRef.current || duration === 0 || (!isDraggingStart && !isDraggingEnd)) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    const time = ratio * duration;

    if (isDraggingStart) {
      setTrimRange(prev => ({
        ...prev,
        startTime: Math.min(time, prev.endTime - 0.1), // Ensure start is before end
      }));
    } else if (isDraggingEnd) {
      setTrimRange(prev => ({
        ...prev,
        endTime: Math.max(time, prev.startTime + 0.1), // Ensure end is after start
      }));
    }
  };

  const handleDragEnd = () => {
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  };

  const handlePlayPause = () => {
    if (!mediaRef.current) return;

    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      // Jump to start of trim range when playing
      mediaRef.current.currentTime = trimRange.startTime;
      mediaRef.current.play();
    }
  };

  const handleSaveTrim = () => {
    onTrimSave(trimRange);
    onClose();
  };

  // Auto-pause when reaching end of trim range
  useEffect(() => {
    if (isPlaying && currentTime >= trimRange.endTime && mediaRef.current) {
      mediaRef.current.pause();
    }
  }, [currentTime, trimRange.endTime, isPlaying]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const trimDuration = trimRange.endTime - trimRange.startTime;
  const startPercent = duration > 0 ? (trimRange.startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (trimRange.endTime / duration) * 100 : 100;
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            Trim {mediaType === 'video' ? 'Video' : 'Audio'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Drag the handles on the timeline to select the portion you want to keep.
            The grayed areas will be removed.
          </div>

          {/* Media Element */}
          <div className="mb-6 flex justify-center">
            {mediaType === 'video' ? (
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                src={mediaUrl}
                className="max-w-full max-h-64 rounded-lg"
                controls={false}
              />
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 w-full max-w-md">
                <audio
                  ref={mediaRef as React.RefObject<HTMLAudioElement>}
                  src={mediaUrl}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.136 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.136l4.247-3.816a1 1 0 011 .892zM16 8a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414L15.586 10l-.707.707a1 1 0 000 1.414l.707.707A1 1 0 0016 12l-.414-.414.707-.707A1 1 0 0016 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Audio File</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <button
              onClick={handlePlayPause}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play Preview'}
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <div
              ref={timelineRef}
              className="relative h-12 bg-gray-200 dark:bg-gray-600 rounded-lg cursor-pointer"
              onClick={handleTimelineClick}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              {/* Dimmed areas (will be trimmed) */}
              <div
                className="absolute top-0 left-0 h-full bg-gray-400 dark:bg-gray-700 opacity-75 rounded-l-lg"
                style={{ width: `${startPercent}%` }}
              />
              <div
                className="absolute top-0 right-0 h-full bg-gray-400 dark:bg-gray-700 opacity-75 rounded-r-lg"
                style={{ width: `${100 - endPercent}%` }}
              />

              {/* Active (kept) area */}
              <div
                className="absolute top-0 h-full bg-blue-200 dark:bg-blue-800"
                style={{
                  left: `${startPercent}%`,
                  width: `${endPercent - startPercent}%`,
                }}
              />

              {/* Start handle */}
              <div
                className="absolute top-0 w-3 h-full bg-blue-600 cursor-ew-resize rounded-l"
                style={{ left: `${startPercent}%` }}
                onMouseDown={(e) => handleDragStart(e, 'start')}
              />

              {/* End handle */}
              <div
                className="absolute top-0 w-3 h-full bg-blue-600 cursor-ew-resize rounded-r"
                style={{ left: `${endPercent - 0.5}%` }}
                onMouseDown={(e) => handleDragStart(e, 'end')}
              />

              {/* Current time indicator */}
              <div
                className="absolute top-0 w-0.5 h-full bg-red-500"
                style={{ left: `${currentPercent}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>0:00</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Trim info */}
          <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-600 dark:text-gray-400">Start Time</div>
              <div className="font-medium">{formatTime(trimRange.startTime)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 dark:text-gray-400">Duration</div>
              <div className="font-medium">{formatTime(trimDuration)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 dark:text-gray-400">End Time</div>
              <div className="font-medium">{formatTime(trimRange.endTime)}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Final duration: {formatTime(trimDuration)}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrim}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                Apply Trim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTrimModal;