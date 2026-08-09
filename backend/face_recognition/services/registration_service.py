import base64
import cv2
import numpy as np

from models.detector import FaceDetector


class RegistrationService:
    """
    Registration Service

    Receives 5 face images
    Detects exactly one face in each image
    Generates one embedding per image
    Returns all embeddings
    """

    def __init__(self):
        self.model = FaceDetector.get_model()

    def _decode_image(self, base64_string):
        try:
            if "," in base64_string:
                base64_string = base64_string.split(",")[1]

            image_bytes = base64.b64decode(base64_string)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            return image

        except Exception:
            return None

    def generate_embeddings(self, samples):

        embeddings = []

        if len(samples) != 5:
            return {
                "success": False,
                "message": "Exactly 5 face samples are required."
            }

        for index, sample in enumerate(samples):

            image = self._decode_image(sample)

            if image is None:
                return {
                    "success": False,
                    "sample": index + 1,
                    "message": "Invalid image."
                }

            faces = self.model.get(image)

            if len(faces) == 0:
                return {
                    "success": False,
                    "sample": index + 1,
                    "message": "No face detected."
                }

            if len(faces) > 1:
                return {
                    "success": False,
                    "sample": index + 1,
                    "message": "Multiple faces detected."
                }

            face = faces[0]

            embedding = face.embedding.astype(np.float32)
            embeddings.append(embedding.tolist())

        print("\n===== GENERATED EMBEDDINGS =====")
        print(f"Generated {len(embeddings)} embeddings")

        for i, emb in enumerate(embeddings):
            print(f"Sample {i+1}: {len(emb)} dimensions")
            print(emb[:10])   # first 10 values
            print("--------------------------------")

        return {
            "success": True,
            "embeddings": embeddings
        }