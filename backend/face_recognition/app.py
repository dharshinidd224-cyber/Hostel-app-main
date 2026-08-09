from flask import Flask, request, jsonify
from services.registration_service import RegistrationService

app = Flask(__name__)

registration_service = RegistrationService()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "Face Recognition Service Running"
    })


@app.route("/register-face", methods=["POST"])
def register_face():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No request body received."
            }), 400

        samples = data.get("samples")

        if not samples:
            return jsonify({
                "success": False,
                "message": "No face samples received."
            }), 400

        result = registration_service.generate_embeddings(samples)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)