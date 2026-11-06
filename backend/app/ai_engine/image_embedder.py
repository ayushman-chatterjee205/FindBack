from typing import List, Optional
from app.ai_engine.model_loader import model_loader
from app.ai_engine.text_embedder import cosine_similarity

def generate_image_embedding(image_bytes: Optional[bytes] = None) -> List[float]:
    """Generates 512-dim visual feature vector from image bytes."""
    return model_loader.get_image_embedding(image_bytes)

def compute_visual_similarity(emb_a: Optional[List[float]], emb_b: Optional[List[float]]) -> float:
    """Computes cosine similarity between two visual vectors. If either is omitted or mismatched, returns neutral 0.5."""
    if not emb_a or not emb_b or len(emb_a) != len(emb_b):
        return 0.5  # Neutral default score if image is omitted or not comparable
    return cosine_similarity(emb_a, emb_b)
