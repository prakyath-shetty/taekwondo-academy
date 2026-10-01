import React, { useEffect, useMemo, useState } from 'react';
import { Camera, Calendar, User } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import { galleryImages, getImagesByCategory } from '../../mock/gallery';
import type { GalleryImage } from '../../mock/gallery';
import './Gallery.css';

const CATEGORIES: { key: GalleryImage['category']; label: string; icon: string }[] = [
  { key: 'event',     label: 'Events',      icon: '🎉' },
  { key: 'training',  label: 'Training',    icon: '🥋' },
  { key: 'poomsae',   label: 'Poomsae',     icon: '🧘' },
  { key: 'sparring',  label: 'Sparring',    icon: '⚔️' },
  { key: 'award',     label: 'Awards',      icon: '🏆' },
  { key: 'facility',  label: 'Facility',    icon: '🏛️' },
];

const Gallery: React.FC = () => {
  const { setPage } = useNavigation();
  const [category, setCategory] = useState<GalleryImage['category'] | 'all'>('all');
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => { setPage('gallery'); }, [setPage]);

  const filtered = useMemo(() => {
    if (category === 'all') return galleryImages;
    return getImagesByCategory(category);
  }, [category]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered],
  );

  return (
    <AppShell>
      <div className="tkd-gal-page">
        <div className="tkd-gal-content">

          <div className="tkd-gal-header">
            <h1>Gallery</h1>
            <p>Browse photos from training sessions, events, and competitions.</p>
          </div>

          {/* Category filters */}
          <div className="tkd-gal-filters">
            <button
              className={`tkd-gal-filter${category === 'all' ? ' tkd-gal-filter--active' : ''}`}
              onClick={() => setCategory('all')}
              type="button"
            >
              All <span className="tkd-gal-filter-count">{galleryImages.length}</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`tkd-gal-filter${category === cat.key ? ' tkd-gal-filter--active' : ''}`}
                onClick={() => setCategory(cat.key)}
                type="button"
              >
                {cat.icon} {cat.label}
                <span className="tkd-gal-filter-count">{getImagesByCategory(cat.key).length}</span>
              </button>
            ))}
          </div>

          {/* Grid or detail */}
          {!selected ? (
            <div className="tkd-gal-grid">
              {sorted.map((img) => (
                <button
                  key={img.id}
                  className="tkd-gal-card"
                  onClick={() => setSelected(img)}
                  type="button"
                >
                  <div className="tkd-gal-card-img" style={{ background: `linear-gradient(135deg, ${img.color}, ${img.color}dd)` }}>
                    <Camera size={28} color="rgba(255,255,255,0.4)" />
                    <span className="tkd-gal-card-cat">{img.category}</span>
                  </div>
                  <div className="tkd-gal-card-info">
                    <h3 className="tkd-gal-card-title">{img.title}</h3>
                    <div className="tkd-gal-card-meta">
                      <span className="tkd-gal-meta-item">
                        <Calendar size={11} />
                        {new Date(`${img.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="tkd-gal-meta-item">
                        <User size={11} />
                        {img.photographer}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="tkd-gal-detail">
              <button className="tkd-gal-back" onClick={() => setSelected(null)} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to gallery
              </button>
              <div
                className="tkd-gal-detail-img"
                style={{ background: `linear-gradient(135deg, ${selected.color}, ${selected.color}aa)` }}
              >
                <Camera size={56} color="rgba(255,255,255,0.3)" />
                <span className="tkd-gal-detail-cat">{selected.category}</span>
              </div>
              <div className="tkd-gal-detail-info">
                <h2 className="tkd-gal-detail-title">{selected.title}</h2>
                <p className="tkd-gal-detail-desc">{selected.description}</p>
                <div className="tkd-gal-detail-meta">
                  <span className="tkd-gal-meta-item">
                    <Calendar size={13} />
                    {new Date(`${selected.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="tkd-gal-meta-item">
                    <User size={13} />
                    {selected.photographer}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
};

export default Gallery;
