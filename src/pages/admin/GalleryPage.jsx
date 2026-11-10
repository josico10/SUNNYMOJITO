import { useRef, useState } from 'react';
import Icon from '../../components/Icon';
import { ConfirmDialog, Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { useApp } from '../../context/AppContext';
import { formatBytes, formatDate } from '../../lib/format';
import { readPhoto } from '../../lib/image';

export default function GalleryPage() {
  const { gallery, addPhotos, deletePhoto } = useApp();
  const toast = useToast();
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const upload = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setBusy(true);
    const photos = [];
    const problems = [];
    for (const file of files) {
      try {
        photos.push(await readPhoto(file));
      } catch (err) {
        problems.push(err.message);
      }
    }
    if (photos.length > 0) {
      addPhotos(photos);
      toast(photos.length === 1 ? 'Photo uploaded.' : `${photos.length} photos uploaded.`);
    }
    problems.forEach((message) => toast(message, 'error'));
    setBusy(false);
  };

  const confirmDelete = () => {
    deletePhoto(toDelete.id);
    toast('Photo deleted.');
    setToDelete(null);
  };

  const openPicker = () => fileRef.current?.click();

  return (
    <>
      <div className="page-head page-head--split">
        <div>
          <h1 className="page-title">Gallery</h1>
          <p className="page-lead">A collection of sunny moments, ready for your website.</p>
        </div>
        <button type="button" className="btn btn--yellow" onClick={openPicker} disabled={busy}>
          <Icon name="upload" size={18} /> {busy ? 'Uploading…' : 'Upload Photo'}
        </button>
      </div>

      <div
        className={`dropbar${dragging ? ' is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files);
        }}
      >
        <span className="dropbar__icon">
          <Icon name="cloudUpload" size={24} />
        </span>
        <div>
          <strong>Drop a little sunshine here</strong>
          <small>Upload JPG, PNG or WebP photos up to 5 MB each.</small>
        </div>
        <button type="button" className="btn btn--outline" onClick={openPicker} disabled={busy}>
          Choose files
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => {
            upload(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <div className="list-meta">
        <strong>All photos ({gallery.length})</strong>
        <span>
          Newest first <Icon name="arrowRight" size={12} className="rotate-down" />
        </span>
      </div>

      {gallery.length === 0 ? (
        <p className="empty card">Your gallery is empty. Upload a photo to show it on your website.</p>
      ) : (
        <ul className="photo-grid">
          {gallery.map((photo) => (
            <li key={photo.id} className="card photo">
              <img src={photo.src} alt={photo.name} loading="lazy" />
              <strong title={photo.name}>{photo.name}</strong>
              <small>
                {formatBytes(photo.size)} · {formatDate(photo.date)}
              </small>
              <div className="photo__actions">
                <button type="button" className="text-btn" onClick={() => setPreview(photo)}>
                  <Icon name="eye" size={16} /> Preview
                </button>
                <button type="button" className="text-btn text-btn--danger" onClick={() => setToDelete(photo)}>
                  <Icon name="trash" size={16} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="list-foot">Showing all {gallery.length} photos · Changes to your gallery appear on the public website.</p>

      {preview && (
        <Modal title={preview.name} onClose={() => setPreview(null)} wide>
          <img className="modal__image" src={preview.src} alt={preview.name} />
          <p className="modal__caption">
            {preview.name} · {formatBytes(preview.size)} · {formatDate(preview.date)}
          </p>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete this photo?"
          message={`${toDelete.name} will be removed from your gallery and your public website. This can’t be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
