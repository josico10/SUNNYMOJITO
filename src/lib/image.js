const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const LOGO_TYPES = ['image/svg+xml', 'image/png'];

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('We couldn’t read that file. Try another one.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('That image looks damaged. Try another file.'));
    img.src = src;
  });
}

/**
 * Validates and reads a photo (JPG, PNG or WebP, up to 5 MB).
 * The image is scaled down before saving so it fits in browser storage.
 */
export async function readPhoto(file, { maxSide = 1400, quality = 0.85 } = {}) {
  if (!PHOTO_TYPES.includes(file.type)) {
    throw new Error(`${file.name} isn’t supported. Use a JPG, PNG or WebP photo.`);
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`${file.name} is larger than 5 MB. Choose a smaller photo.`);
  }
  const original = await readAsDataUrl(file);
  const img = await loadImage(original);
  const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
  const width = Math.round(img.width * ratio);
  const height = Math.round(img.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);
  const src = canvas.toDataURL('image/jpeg', quality);
  return {
    src,
    name: file.name,
    size: file.size,
    width: img.width,
    height: img.height,
  };
}

/** Validates and reads a logo (SVG or PNG, up to 2 MB). */
export async function readLogo(file) {
  if (!LOGO_TYPES.includes(file.type)) {
    throw new Error('Use an SVG or PNG file for your logo.');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Your logo is larger than 2 MB. Choose a smaller file.');
  }
  const src = await readAsDataUrl(file);
  return { src, name: file.name, size: file.size };
}
