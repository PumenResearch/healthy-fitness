import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { createPost, fetchCategories, type Category, type CreatePostPayload } from '../../../lib/api';
import './CreatePostModal.css';

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  initialCategory?: string;
}

const EMOJI_MAP: Record<string, string> = {
  'Chạy bộ': '🏃‍♀️',
  'Tập tạ': '🏋️',
  'Yoga': '🧘',
  'Đạp xe': '🚴',
  'Dinh dưỡng': '🥗',
  'Thử thách': '🏆',
  'Chia sẻ': '💡',
};

const PLACEHOLDER_MAP: Record<string, string> = {
  'Chạy bộ': 'Hôm nay bạn vừa hoàn thành quãng đường chạy bao nhiêu km?',
  'Tập tạ': 'Hôm nay bạn tập nhóm cơ nào? Mức tạ tối đa bao nhiêu?',
  'Yoga': 'Cảm giác thư giãn và năng lượng tích cực sau buổi tập Yoga hôm nay...',
  'Đạp xe': 'Cung đường đạp xe hôm nay thế nào?',
  'Dinh dưỡng': 'Chia sẻ thực đơn healthy, công thức món ăn dinh dưỡng của bạn...',
  'Thử thách': 'Bạn vừa chinh phục cột mốc thử thách mới nào?',
  'Chia sẻ': 'Kinh nghiệm, mẹo luyện tập hoặc lời khuyên dành cho cộng đồng...',
};

const GRADIENT_PRESETS = [
  { id: 'cyber-neon', name: 'Đại dương Neon', value: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 60%, #059669 100%)' },
  { id: 'sunset-blaze', name: 'Hoàng hôn rực rỡ', value: 'linear-gradient(135deg, #e53e3e 0%, #ff6b35 60%, #f59e0b 100%)' },
  { id: 'violet-aura', name: 'Hào quang Tím', value: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 60%, #06b6d4 100%)' },
  { id: 'fresh-energy', name: 'Năng lượng Xanh', value: 'linear-gradient(135deg, #10b981 0%, #84cc16 60%, #f59e0b 100%)' },
  { id: 'berry-punch', name: 'Hồng Đam mê', value: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 60%, #fb7185 100%)' },
];

const EMOJI_OPTIONS = ['🏃‍♀️', '🏋️', '🧘', '🚴', '🥗', '💪', '🔥', '🏆', '⚡', '🥑', '🥇', '🎯'];

const SAMPLE_DEMO_IMAGES = [
  { label: 'Chạy công viên', url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Phòng Gym', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' },
  { label: 'Món ăn Healthy', url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tập Yoga', url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80' },
];

export default function CreatePostModal({ isOpen, onClose, onPostCreated, initialCategory }: CreatePostModalProps) {
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');

  // Media options
  const [mediaType, setMediaType] = useState<'gradient' | 'image'>('gradient');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0].value);
  const [selectedEmoji, setSelectedEmoji] = useState('🏃‍♀️');
  const [imageUrl, setImageUrl] = useState('');

  // Metrics
  const [showMetrics, setShowMetrics] = useState(true);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [pace, setPace] = useState('');

  // State
  const [includeStreak, setIncludeStreak] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories()
        .then(setCategories)
        .catch(() => showToast('Không tải được danh mục', 'error'));
    }
  }, [isOpen]);

  // Sync initial category when modal opens
  useEffect(() => {
    if (initialCategory && categories.length > 0) {
      const idx = categories.findIndex(c => c.label.toLowerCase() === initialCategory.toLowerCase());
      if (idx !== -1) {
        setCategoryIndex(idx);
        setSelectedEmoji(EMOJI_MAP[categories[idx].label] || '📝');
      }
    }
  }, [initialCategory, isOpen, categories]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const safeIndex = categoryIndex < categories.length ? categoryIndex : 0;
  const currentCategory = categories[safeIndex] || null;

  const handleCategorySelect = (index: number) => {
    setCategoryIndex(index);
    setSelectedEmoji(EMOJI_MAP[categories[index].label] || '📝');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      setMediaType('image');
    }
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
    setDistance('');
    setDuration('');
    setCalories('');
    setPace('');
    setImageUrl('');
    setShowPreview(false);
    setMediaType('gradient');
    setSelectedGradient(GRADIENT_PRESETS[0].value);
    setSelectedEmoji('🏃‍♀️');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() && !title.trim()) return;
    if (!currentCategory) return;

    setIsSubmitting(true);

    const payload: CreatePostPayload = {
      title: title.trim() || `${currentCategory.label} hoàn thành! 💪`,
      category_id: currentCategory.id,
      body: body.trim() || undefined,
      distance: distance.trim() ? parseFloat(distance) || null : null,
      duration: duration.trim() ? parseFloat(duration) || null : null,
      calories: calories.trim() ? parseFloat(calories) || null : null,
      pace: pace.trim() ? parseFloat(pace) || null : null,
      images: mediaType === 'image' && imageUrl ? [imageUrl] : undefined,
    };

    try {
      await createPost(payload);
      showToast('Đăng bài thành công!', 'success');
      resetForm();
      onPostCreated();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Đăng bài thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryLabel = currentCategory?.label || '';
  const categoryColor = currentCategory?.color || '#10b981';
  const placeholder = PLACEHOLDER_MAP[categoryLabel] || 'Chia sẻ hoạt động của bạn...';

  return (
    <div className="create-post-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="create-post-header">
          <div className="modal-title-row">
            <div className="modal-user-info">
              <div className="modal-avatar" style={profile?.avatar_color ? { background: profile.avatar_color } : undefined}>
                {profile?.avatar_text || 'U'}
              </div>
              <div>
                <div className="modal-user-name">
                  {profile?.name || 'Người dùng'}
                  {profile?.streak ? <span className="modal-streak-badge">🔥 {profile.streak} ngày</span> : null}
                </div>
                <div className="privacy-selector">
                  <select
                    value={privacy}
                    onChange={e => setPrivacy(e.target.value as any)}
                    className="privacy-select"
                  >
                    <option value="public">🌍 Công khai</option>
                    <option value="friends">👥 Bạn bè</option>
                    <option value="private">🔒 Chỉ mình tôi</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Category Chips */}
          <div className="category-chips">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                className={`category-chip ${categoryIndex === idx ? 'active' : ''}`}
                style={{ '--chip-color': cat.color } as React.CSSProperties}
                onClick={() => handleCategorySelect(idx)}
              >
                <span>{EMOJI_MAP[cat.label] || '📝'}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-fields">
            {/* Title */}
            <input
              type="text"
              className="post-title-input"
              placeholder={`Tiêu đề (Ví dụ: ${categoryLabel} buổi sáng...)`}
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />

            {/* Body Content */}
            <div className="textarea-wrapper">
              <textarea
                className="post-body-textarea"
                placeholder={placeholder}
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={4}
                maxLength={1000}
              />
              <div className="char-count">{body.length} / 1000</div>
            </div>

            {/* Metrics Section */}
            <div className="modal-section">
              <div className="section-header-row">
                <span className="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  Chỉ số tập luyện
                </span>
                <button type="button" className="toggle-section-btn" onClick={() => setShowMetrics(!showMetrics)}>
                  {showMetrics ? 'Ẩn chỉ số' : 'Thêm chỉ số'}
                </button>
              </div>

              {showMetrics && (
                <div className="metrics-grid">
                  <div className="metric-input-group">
                    <label>📏 Khoảng cách (km)</label>
                    <input type="number" step="0.1" placeholder="vd: 5.2" value={distance} onChange={e => setDistance(e.target.value)} />
                  </div>
                  <div className="metric-input-group">
                    <label>⏱️ Thời gian (phút)</label>
                    <input type="number" step="1" placeholder="vd: 45" value={duration} onChange={e => setDuration(e.target.value)} />
                  </div>
                  <div className="metric-input-group">
                    <label>🔥 Calo tiêu thụ</label>
                    <input type="number" step="1" placeholder="vd: 350" value={calories} onChange={e => setCalories(e.target.value)} />
                  </div>
                  <div className="metric-input-group">
                    <label>⚡ Pace (phút/km)</label>
                    <input type="number" step="0.01" placeholder="vd: 5.15" value={pace} onChange={e => setPace(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* Media Customizer */}
            <div className="modal-section">
              <div className="media-tabs">
                <button type="button" className={`media-tab ${mediaType === 'gradient' ? 'active' : ''}`} onClick={() => setMediaType('gradient')}>
                  🎨 Bìa Gradient & Emoji
                </button>
                <button type="button" className={`media-tab ${mediaType === 'image' ? 'active' : ''}`} onClick={() => setMediaType('image')}>
                  📸 Hình ảnh
                </button>
              </div>

              {mediaType === 'gradient' ? (
                <div className="gradient-customizer">
                  <div className="gradient-preview" style={{ background: selectedGradient }}>
                    <span className="gradient-preview-emoji">{selectedEmoji}</span>
                    <div className="gradient-preview-metrics">
                      {distance && <span>📈 {distance} km</span>}
                      {duration && <span>⏱️ {duration} phút</span>}
                      {calories && <span>🔥 {calories} kcal</span>}
                      {pace && <span>⚡ {pace} /km</span>}
                    </div>
                  </div>

                  <div className="gradient-options">
                    <label className="sub-label">Chọn màu chủ đề Bìa:</label>
                    <div className="gradient-swatches">
                      {GRADIENT_PRESETS.map(g => (
                        <button
                          key={g.id}
                          type="button"
                          className={`swatch-btn ${selectedGradient === g.value ? 'active' : ''}`}
                          style={{ background: g.value }}
                          title={g.name}
                          onClick={() => setSelectedGradient(g.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="emoji-options">
                    <label className="sub-label">Biểu tượng chính:</label>
                    <div className="emoji-chips">
                      {EMOJI_OPTIONS.map(emo => (
                        <button key={emo} type="button" className={`emoji-chip ${selectedEmoji === emo ? 'active' : ''}`} onClick={() => setSelectedEmoji(emo)}>
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="image-customizer">
                  {imageUrl ? (
                    <div className="uploaded-image-preview">
                      <img src={imageUrl} alt="Uploaded post preview" />
                      <button type="button" className="remove-img-btn" onClick={() => setImageUrl('')} title="Xóa ảnh">✕</button>
                    </div>
                  ) : (
                    <div className="upload-dropzone">
                      <input type="file" accept="image/*" id="post-img-file" className="file-input-hidden" onChange={handleImageFileChange} />
                      <label htmlFor="post-img-file" className="upload-label">
                        <div className="upload-icon">📷</div>
                        <div><strong>Nhấp để chọn ảnh</strong> hoặc kéo thả vào đây</div>
                        <span className="upload-hint">Hỗ trợ JPG, PNG, WebP</span>
                      </label>
                    </div>
                  )}

                  <div className="sample-images-bar">
                    <span className="sub-label">Hoặc chọn ảnh mẫu nhanh:</span>
                    <div className="sample-thumbs">
                      {SAMPLE_DEMO_IMAGES.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`sample-thumb-btn ${imageUrl === img.url ? 'active' : ''}`}
                          onClick={() => setImageUrl(img.url)}
                        >
                          <img src={img.url} alt={img.label} />
                          <span>{img.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Extra Options & Live Preview Toggle */}
            <div className="post-options-bar">
              <label className="streak-toggle-checkbox">
                <input type="checkbox" checked={includeStreak} onChange={e => setIncludeStreak(e.target.checked)} />
                <span>Gắn Badge Chuỗi Luyện Tập (🔥 {profile?.streak || 0} ngày)</span>
              </label>

              <button type="button" className={`preview-toggle-btn ${showPreview ? 'active' : ''}`} onClick={() => setShowPreview(!showPreview)}>
                👁️ {showPreview ? 'Ẩn xem trước' : 'Xem trước bài đăng'}
              </button>
            </div>

            {/* Live Preview Card */}
            {showPreview && currentCategory && (
              <div className="live-preview-box">
                <div className="preview-badge">Xem trước bài viết trên Bảng tin</div>
                <article className="feed-post dashboard-card preview-card">
                  <header className="post-header">
                    <div className="post-avatar" style={{ background: profile?.avatar_color || 'linear-gradient(135deg, #e53e3e, #ff6b35)' }}>
                      {profile?.avatar_text || 'U'}
                    </div>
                    <div className="post-meta">
                      <div className="post-author-row">
                        <span className="post-author">{profile?.name || 'Người dùng'}</span>
                        {includeStreak && profile?.streak ? <span className="streak-tag streak-tag--consistent">🔥 {profile.streak} ngày</span> : null}
                        <span className="post-category" style={{ background: `${categoryColor}1f`, color: categoryColor }}>
                          {categoryLabel}
                        </span>
                      </div>
                      <span className="post-time">Vừa xong</span>
                    </div>
                  </header>
                  <div className="post-body">
                    <h3 className="post-title">{title || `${categoryLabel} hoàn thành! 💪`}</h3>
                    <p className="post-text">{body || 'Nội dung bài đăng sẽ hiển thị ở đây...'}</p>
                    {mediaType === 'image' && imageUrl && (
                      <div className="post-media post-media--image">
                        <img src={imageUrl} alt="Preview" className="post-media-img" />
                      </div>
                    )}
                    {mediaType === 'gradient' && (
                      <div className="post-media" style={{ background: selectedGradient }}>
                        <span className="post-media-emoji">{selectedEmoji}</span>
                        {(distance || duration || calories || pace) && (
                          <div className="post-media-metrics">
                            {distance && <span>📈 {distance} km</span>}
                            {duration && <span>⏱️ {duration} phút</span>}
                            {calories && <span>🔥 {calories} kcal</span>}
                            {pace && <span>⚡ {pace} /km</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="create-post-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit-post" disabled={(!title.trim() && !body.trim()) || isSubmitting || !currentCategory}>
              {isSubmitting ? (
                <span className="submitting-spinner">Đang đăng bài...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Đăng bài ngay
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
