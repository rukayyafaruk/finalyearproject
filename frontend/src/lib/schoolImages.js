const LOCAL_SCHOOL_IMAGES = [
  '/images/schools/school-01-kano-digital-literacy.webp',
  '/images/schools/school-03-drc-classroom.webp',
  '/images/schools/school-04-rwanda-classroom.webp',
  '/images/schools/school-05-african-schoolrooms.webp',
  '/images/schools/school-06-benin-campus.webp',
];

function isLocalSchoolImage(image) {
  return typeof image === 'string' && image.startsWith('/images/schools/');
}

function isUnsplashImage(image) {
  return typeof image === 'string' && image.includes('images.unsplash.com');
}

export function getSchoolImage(school, index = 0) {
  const featuredImage = school?.featured_image?.trim();
  const imageUrl = school?.image_url?.trim();
  const schoolImage = featuredImage || imageUrl;

  if (isLocalSchoolImage(schoolImage)) {
    return schoolImage;
  }

  // Keep custom images supplied by a school representative, while replacing
  // old Unsplash seed URLs with bundled local photos.
  if (schoolImage && !isUnsplashImage(schoolImage)) {
    return schoolImage;
  }

  const seed = Number(school?.id) || (school?.name?.length ?? index);
  return LOCAL_SCHOOL_IMAGES[Math.abs(seed) % LOCAL_SCHOOL_IMAGES.length];
}

export function handleImageError(event, fallbackIndex = 0) {
  const image = event.currentTarget;
  if (image.dataset.localFallbackApplied) return;

  image.dataset.localFallbackApplied = 'true';
  image.src = LOCAL_SCHOOL_IMAGES[Math.abs(fallbackIndex + 1) % LOCAL_SCHOOL_IMAGES.length];
}
