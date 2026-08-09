from insightface.app import FaceAnalysis

from config import MODEL_NAME
from config import DEVICE_ID
from config import DETECTION_SIZE


class FaceDetector:

    _instance = None

    @classmethod
    def get_model(cls):

        if cls._instance is None:

            app = FaceAnalysis(name=MODEL_NAME)

            app.prepare(
                ctx_id=DEVICE_ID,
                det_size=DETECTION_SIZE
            )

            cls._instance = app

            print("InsightFace model loaded successfully.")

        return cls._instance