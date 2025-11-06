import os

from dotenv import load_dotenv

# load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"), override=True)
load_dotenv(override=True)

GRPC_HOST = os.getenv("GRPC_HOST")
GRPC_PORT = os.getenv("GRPC_PORT")
GRPC_TOKEN = os.getenv("GRPC_TOKEN")
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", 5))
K8S_CONFIG_FILE = os.getenv("K8S_CONFIG_FILE")
K8S_CONTEXT = os.getenv("K8S_CONTEXT")
LOG_LEVEL = os.getenv("LOG_LEVEL", "info")
