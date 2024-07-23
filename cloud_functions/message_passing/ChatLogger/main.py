import functions_framework
from google.cloud import firestore
from flask import jsonify, request
from flask_cors import cross_origin

db = firestore.Client()

@functions_framework.http
@cross_origin()
def hello_http(request):
    """
    HTTP Cloud Function to update chats for a specific issue in Firestore.

    This function expects a JSON body in the request with the following format:
    {
        "concernId": "string",
        "chats": [
            {
                "from": "string",
                "message": "string",
                "timestamp": "ISO8601 string"
            },
            ...
        ]
    }

    Args:
        request (flask.Request): The HTTP request object containing JSON data.

    Returns:
        flask.Response: A JSON response indicating the result of the operation.
    """
    
    request_json = request.get_json(silent=True)

    if not request_json:
        return jsonify({"error": "Invalid request, JSON body is required"}), 400

    try:
        # Extract the concernId and chats
        concern_id = request_json.get("concernId")
        new_chats = request_json.get("chats")

        if not concern_id:
            return jsonify({"error": "Invalid request, concernId is required"}), 400

        if not new_chats or not isinstance(new_chats, list):
            return jsonify({"error": "Invalid request, 'chats' should be a list and cannot be empty"}), 400

        for chat in new_chats:
            if not all([chat.get("from"), chat.get("message"), chat.get("timestamp")]):
                return jsonify({"error": "Invalid request, each chat must have 'from', 'message', and 'timestamp'"}), 400

        # Fetch the existing issue document
        doc_ref = db.collection('Issues').document(concern_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": "Issue not found"}), 404

        issue_data = doc.to_dict()

        # Append new chats to the existing chats
        existing_chats = issue_data.get('chats', [])
        existing_chats.extend(new_chats)

        # Update the issue document with the new chats array
        doc_ref.update({
            'chats': existing_chats
        })

        return jsonify({"status": "success", "message": "Chats updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Error updating chats: {e}"}), 500
