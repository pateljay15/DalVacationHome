import functions_framework
from google.cloud import firestore
from flask import jsonify
from flask_cors import cross_origin

db = firestore.Client()

@functions_framework.http
@cross_origin()
def ChatRetriever(request):
    """
    HTTP Cloud Function to retrieve chat issues based on customer or agent email.

    This function can be called with either a JSON body or URL query parameters.
    It expects one of the following formats:
    
    JSON body:
    {
        "customerEmail": "string",
        "agentEmail": "string"
    }
    
    URL query parameters:
    ?customerEmail=string&agentEmail=string

    Args:
        request (flask.Request): The HTTP request object containing JSON data or query parameters.

    Returns:
        flask.Response: A JSON response containing the list of issues associated with the given email.
    """

    request_json = request.get_json(silent=True)
    request_args = request.args

    customer_email = None
    agent_email = None

    if request_json:
        customer_email = request_json.get('customerEmail')
        agent_email = request_json.get('agentEmail')
    elif request_args:
        customer_email = request_args.get('customerEmail')
        agent_email = request_args.get('agentEmail')

    if not customer_email and not agent_email:
        return jsonify({'error': 'customerEmail or agentEmail is required!'}), 400

    try:
        issues_ref = db.collection('Issues')

        if customer_email:
            query = issues_ref.where('customerEmail', '==', customer_email)
        else:
            query = issues_ref.where('agentEmail', '==', agent_email)

        docs = query.stream()

        issues = []
        for doc in docs:
            issue_data = doc.to_dict()
            issue_data['concernId'] = doc.id
            issues.append(issue_data)

        return jsonify({'issues': issues}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
