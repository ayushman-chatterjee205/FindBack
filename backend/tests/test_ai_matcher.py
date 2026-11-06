import math
from datetime import datetime, timedelta, timezone
import pytest

from app.ai_engine.text_embedder import cosine_similarity, generate_text_embedding
from app.ai_engine.spatial import compute_spatial_similarity
from app.ai_engine.temporal import compute_temporal_similarity
from app.ai_engine.matcher import calculate_composite_score

def test_cosine_similarity():
    vec_a = [1.0, 0.0, 0.0]
    vec_b = [1.0, 0.0, 0.0]
    assert cosine_similarity(vec_a, vec_b) == 1.0

    vec_c = [0.0, 1.0, 0.0]
    assert cosine_similarity(vec_a, vec_c) == 0.0

def test_text_embedding_generation():
    emb = generate_text_embedding("Casio fx-991EX Calculator", "Scientific calculator black color", "Electronics", "Casio")
    assert len(emb) == 384
    # Check L2 normalization
    norm = math.sqrt(sum(x * x for x in emb))
    assert abs(norm - 1.0) < 1e-4

def test_spatial_similarity_hierarchy():
    # Same exact room
    assert compute_spatial_similarity("CSE Block", "CSE Block", "Lab 204", "Lab 204") == 1.00
    # Same building, different room
    assert compute_spatial_similarity("CSE Block", "CSE Block", "Lab 204", "Classroom 101") == 0.85
    # Same building, unspecified room
    assert compute_spatial_similarity("CSE Block", "CSE Block") == 0.65
    # Adjacent campus quad
    assert compute_spatial_similarity("Central Library", "Campus Canteen") == 0.40
    # Opposite ends of campus
    assert compute_spatial_similarity("Hostel Quad", "Workshop") == 0.15

def test_temporal_decay_curve():
    now = datetime.now(timezone.utc)
    # Found 30 mins after lost
    t_lost = now - timedelta(minutes=30)
    t_found = now
    score_fresh = compute_temporal_similarity(t_lost, t_found)
    assert score_fresh > 0.95

    # Found 2 weeks later
    t_lost_old = now - timedelta(days=14)
    score_old = compute_temporal_similarity(t_lost_old, now)
    assert score_old < score_fresh
    assert score_old > 0.20

    # Found before lost (temporal causality violation)
    score_impossible = compute_temporal_similarity(now + timedelta(days=2), now)
    assert score_impossible == 0.05

def test_composite_scoring_weights():
    # Perfect match on all 4 signals
    perfect = calculate_composite_score(1.0, 1.0, 1.0, 1.0)
    assert perfect == 100.0

    # Zero match
    zero = calculate_composite_score(0.0, 0.0, 0.0, 0.0)
    assert zero == 0.0

    # Realistic candidate: High text (0.9), moderate visual (0.7), same building (0.65), recent (0.9)
    # (0.35 * 0.9) + (0.35 * 0.7) + (0.15 * 0.65) + (0.15 * 0.9) = 0.315 + 0.245 + 0.0975 + 0.135 = 0.7925
    realistic = calculate_composite_score(0.9, 0.7, 0.65, 0.9)
    assert realistic >= 75.0  # Should trigger student notification
