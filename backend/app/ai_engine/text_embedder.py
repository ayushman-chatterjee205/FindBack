from typing import List
from app.ai_engine.model_loader import model_loader

def generate_text_embedding(title: str, description: str, category: str = "", brand: str = "") -> List[float]:
    """Combines item attributes into rich semantic text and generates 384-dim vector."""
    combined_text = f"{title}. Category: {category}. Brand: {brand}. Description: {description}".strip()
    return model_loader.get_text_embedding(combined_text)

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Computes dot product between two unit-normalized vectors."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    # Clamp between 0.0 and 1.0
    return max(0.0, min(1.0, float(dot)))
