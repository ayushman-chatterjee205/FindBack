from typing import Optional

def compute_spatial_similarity(
    lost_building: Optional[str],
    found_building: Optional[str],
    lost_zone: Optional[str] = None,
    found_zone: Optional[str] = None
) -> float:
    """
    Computes spatial proximity score between lost and found locations based on campus topology.
    Scores:
      - 1.00: Exact same room / specific zone
      - 0.85: Same floor / corridor in building
      - 0.60: Same building
      - 0.30: Adjacent campus quad / common area
      - 0.15: Different campus buildings
    """
    if not lost_building or not found_building:
        return 0.30  # Baseline campus proximity

    b_lost = lost_building.lower().strip()
    b_found = found_building.lower().strip()

    if b_lost == b_found:
        if lost_zone and found_zone:
            z_lost = lost_zone.lower().strip()
            z_found = found_zone.lower().strip()
            if z_lost == z_found:
                return 1.00  # Same room
            return 0.85  # Same building, different room/floor
        return 0.65  # Same building general area

    # Proximity matrix for common campus blocks
    adjacent_clusters = [
        {"cse block", "main academic block", "workshop"},
        {"central library", "campus canteen", "canteen quad"},
        {"hostel quad", "sports complex", "hostel"},
    ]

    for cluster in adjacent_clusters:
        has_lost = any(k in b_lost for k in cluster)
        has_found = any(k in b_found for k in cluster)
        if has_lost and has_found:
            return 0.40  # Adjacent campus cluster

    return 0.15  # Opposite ends of campus
