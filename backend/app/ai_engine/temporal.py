import math
from datetime import datetime, timezone

def compute_temporal_similarity(lost_time: datetime, found_time: datetime, decay_rate: float = 0.05) -> float:
    """
    Computes temporal proximity score using exponential decay: exp(-lambda * delta_t_days).
    Rule: Found time should naturally be after or around the lost time.
    """
    if lost_time.tzinfo is None:
        lost_time = lost_time.replace(tzinfo=timezone.utc)
    if found_time.tzinfo is None:
        found_time = found_time.replace(tzinfo=timezone.utc)

    diff_seconds = (found_time - lost_time).total_seconds()
    diff_days = diff_seconds / 86400.0

    # If found prior to report by more than 2 hours, penalize (temporal causality violation)
    if diff_days < -0.1:
        return 0.05

    # If found within a few minutes/hours of loss
    effective_days = max(0.0, diff_days)
    score = math.exp(-decay_rate * effective_days)

    return max(0.0, min(1.0, score))
