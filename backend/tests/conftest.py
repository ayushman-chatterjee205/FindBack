import os
import sys

# Ensure backend root is on sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Force test configuration
os.environ["TESTING"] = "true"
os.environ["USE_SQLITE"] = "true"
os.environ["USE_LOCAL_MODELS"] = "true"
os.environ["JWT_SECRET"] = "ci_testing_secret_key_32_characters_long_min"
os.environ["ENVIRONMENT"] = "testing"
