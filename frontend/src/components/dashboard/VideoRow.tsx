import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Play, ArrowRight } from 'lucide-react';
import { Fighter } from './Art';
import type { TrainingVideo } from '../../mock/training';
import './VideoRow.css';

interface VideoRowProps {
  videos: TrainingVideo[];
  onNavigate?: (path: string) => void;
}

const VideoRow: React.FC<VideoRowProps> = ({ videos, onNavigate }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate('/app/training');
    } else {
      navigate('/app/training');
    }
  };

  const handleVideoClick = (videoId: string) => {
    if (onNavigate) {
      onNavigate(`/app/training?videoId=${videoId}`);
    } else {
      navigate(`/app/training?videoId=${videoId}`);
    }
  };

  return (
    <section className="tkd-card">
      <div className="tkd-card-head">
        <div className="tkd-card-title">
          <PlayCircle fill="#e11d2e" color="#fff" size={22} strokeWidth={1.6} />
          Latest Training Videos
        </div>
        <button className="tkd-view-all" onClick={handleViewAll} type="button">
          View All <ArrowRight size={14} />
        </button>
      </div>
      <div className="tkd-videos">
        {videos.map((v, index) => (
          <button
            key={v.id}
            className="tkd-video"
            onClick={() => handleVideoClick(v.id)}
            type="button"
          >
            <div className={`tkd-thumb tkd-thumb--${['a', 'b', 'c'][index % 3]}`}>
              {v.thumbnailUrl ? <img src={v.thumbnailUrl} alt="" /> : <Fighter className="tkd-thumb-fig" color="rgba(255,255,255,0.55)" />}
              <div className="tkd-play"><Play /></div>
              {v.duration && <span className="tkd-dur">{v.duration}</span>}
            </div>
            <h4>{v.title}</h4>
            <span className="tkd-video-sub">{v.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default VideoRow;
