import functions_framework
from google.cloud import firestore
from flask import jsonify

db = firestore.Client()

@functions_framework.http
def hello_http(request):
    request_json = request.get_json(silent=True)

    if not request_json:
        return jsonify({"error": "Invalid request, JSON body is required"}), 400

    try:
        chats = request_json.get("chats")
        if not isinstance(chats, list):
            return jsonify({"error": "Invalid request, 'chats' should be a list"}), 400

        for chat in chats:
            sender = chat.get("sender")
            message = chat.get("message")

            if not sender or not message:
                return jsonify({"error": "Invalid request, each chat must have 'sender' and 'message'"}), 400

            doc_ref = db.collection('Chats').document()
            doc_ref.set({
                'sender': sender,
                'message': message
            })

        return jsonify({"status": "success", "message": "Chats stored successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Error storing chats: {e}"}), 500
