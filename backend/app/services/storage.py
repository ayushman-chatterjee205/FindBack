import os
import uuid
import io
from PIL import Image
from app.core.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}

def sanitize_and_save_image(file_bytes: bytes, filename: str) -> str:
    """
    Validates, strips sensitive EXIF metadata (GPS latitude/longitude, camera serials),
    and saves safely re-encoded image to disk. Rejects arbitrary file uploads.
    """
    if not file_bytes:
        raise ValueError("Upload file cannot be empty.")

    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise ValueError("File exceeds maximum allowed upload size (5 MB limit).")

    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File type '{ext}' is not permitted. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    clean_filename = f"{uuid.uuid4().hex}.jpg"
    out_path = os.path.join(settings.UPLOAD_DIR, clean_filename)

    try:
        image = Image.open(io.BytesIO(file_bytes))
        if image.format not in ALLOWED_FORMATS:
            raise ValueError(f"Unsupported image format: {image.format}")

        # Re-encode completely to strip any EXIF tags, embedded scripts, or polyglot payloads
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        image.save(out_path, format="JPEG", quality=85)
        return f"/uploads/{clean_filename}"
    except Exception as e:
        # Clean up any partial file on error
        if os.path.exists(out_path):
            try:
                os.remove(out_path)
            except OSError:
                pass
        raise ValueError(f"Invalid or corrupted image: {str(e)}")
