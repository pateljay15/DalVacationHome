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
        # Extract top-level fields
        concern_text = request_json.get("concernText")
        customer_name = request_json.get("customerName")
        customer_email = request_json.get("customerEmail")
        agent_name = request_json.get("agentName")
        agent_email = request_json.get("agentEmail")
        date_raised = request_json.get("dateRaised")
        is_active = request_json.get("isActive")
        chats = request_json.get("chats")

        if not all([concern_text, customer_name, customer_email, agent_name, agent_email, date_raised, is_active, chats]):
            return jsonify({"error": "Invalid request, all top-level fields are required"}), 400

        if not isinstance(chats, list):
            return jsonify({"error": "Invalid request, 'chats' should be a list"}), 400

        for chat in chats:
            if not all([chat.get("from"), chat.get("message"), chat.get("timestamp")]):
                return jsonify({"error": "Invalid request, each chat must have 'from', 'message', and 'timestamp'"}), 400

        # Store the document in Firestore
        doc_ref = db.collection('Issues').document()
        doc_ref.set({
            'concernText': concern_text,
            'customerName': customer_name,
            'customerEmail': customer_email,
            'agentName': agent_name,
            'agentEmail': agent_email,
            'dateRaised': date_raised,
            'isActive': is_active,
            'chats': chats
        })

        return jsonify({"status": "success", "message": "Issue and chats stored successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Error storing issue and chats: {e}"}), 500
