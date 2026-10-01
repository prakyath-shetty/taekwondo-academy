import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Play, Search, X } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import { getTrainingVideos } from '../../mock/training';
import type { TrainingVideo } from '../../mock/training';
import './Training.css';

const formatUploadDate = (dateStr: string): string => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

const ThumbnailPlaceholder: React.FC<{ color: string }> = ({ color }) => (
  <div className="tkd-train-thumb-placeholder" style={{ background: color }}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L6 14v20l18 10 18-10V14L24 4z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none"/>
      <path d="M20 18l8 6-8 6v-12z" fill="rgba(255,255,255,0.7)"/>
    </svg>
  </div>
);

const THUMB_COLORS = [
  'linear-gradient(135deg, #1e2a3a 0%, #2d4a5e 100%)',
  'linear-gradient(135deg, #2a1e3a 0%, #4a2d5e 100%)',
  'linear-gradient(135deg, #1e3a2a 0%, #2d5e4a 100%)',
  'linear-gradient(135deg, #3a2a1e 0%, #5e4a2d 100%)',
  'linear-gradient(135deg, #1e2a3a 0%, #3a4a5e 100%)',
  'linear-gradient(135deg, #2a1e2a 0%, #4a2d4a 100%)',
  'linear-gradient(135deg, #1e3a3a 0%, #2d5e5e 100%)',
  'linear-gradient(135deg, #3a1e1e 0%, #5e2d2d 100%)',
  'linear-gradient(135deg, #1e1e3a 0%, #2d2d5e 100%)',
];

const Training: React.FC = () => {
  const { setPage } = useNavigation();
  const videos = useMemo(() => getTrainingVideos(), []);

  const [search, setSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);

  useEffect(() => { setPage('training'); }, [setPage]);

  const filteredVideos = useMemo(() => {
    if (!search.trim()) return videos;
    const q = search.toLowerCase();
    return videos.filter(
      (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q),
    );
  }, [videos, search]);

  const openVideo = (video: TrainingVideo) => setSelectedVideo(video);
  const closeVideo = () => setSelectedVideo(null);

  return (
    <AppShell>
      <div className="tkd-training-page">
        <div className="tkd-training-content">

          {/* ── Header ── */}
          <div className="tkd-training-header">
            <h1>Training</h1>
            <p>Watch training videos and learn from your coach.</p>
          </div>

          {/* ── Search ── */}
          <div className="tkd-training-search-wrap">
            <div className="tkd-training-search">
              <Search size={15} />
              <input
                type="search"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="tkd-training-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* ── Video Grid ── */}
          {!selectedVideo ? (
            <>
              <div className="tkd-training-grid">
                {filteredVideos.map((video, idx) => (
                  <button
                    key={video.id}
                    className="tkd-training-card"
                    onClick={() => openVideo(video)}
                    type="button"
                  >
                    <div className="tkd-training-thumb">
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt="" className="tkd-training-thumb-img" />
                      ) : (
                        <ThumbnailPlaceholder color={THUMB_COLORS[idx % THUMB_COLORS.length]} />
                      )}
                      <div className="tkd-training-play">
                        <Play size={18} fill="currentColor" />
                      </div>
                    </div>
                    <div className="tkd-training-card-body">
                      <h3 className="tkd-training-card-title">{video.title}</h3>
                      <p className="tkd-training-card-desc">{video.description}</p>
                      <span className="tkd-training-card-date">
                        Uploaded: {formatUploadDate(video.uploadedAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {filteredVideos.length === 0 && (
                <p className="tkd-training-empty">No videos match "{search}".</p>
              )}
            </>
          ) : (
            /* ── Video Detail / Player ── */
            <div className="tkd-training-detail">
              <button className="tkd-training-back" onClick={closeVideo} type="button">
                <ArrowLeft size={15} /> Back to all videos
              </button>

              <div className="tkd-training-player-wrap">
                <video
                  className="tkd-training-player"
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                />
              </div>

              <div className="tkd-training-detail-info">
                <h2 className="tkd-training-detail-title">{selectedVideo.title}</h2>
                <p className="tkd-training-detail-desc">{selectedVideo.description}</p>
                <span className="tkd-training-detail-date">
                  Uploaded: {formatUploadDate(selectedVideo.uploadedAt)}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
};

export default Training;
