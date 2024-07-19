import functions_framework
from google.cloud import firestore
from flask import jsonify

db = firestore.Client()

@functions_framework.http
def ChatRetriever(request):
    request_json = request.get_json(silent=True)
    request_args = request.args

    customer_email = None

    if request_json and 'customerEmail' in request_json:
        customer_email = request_json['customerEmail']
    elif request_args and 'customerEmail' in request_args:
        customer_email = request_args['customerEmail']

    if not customer_email:
        return jsonify({'error': 'customerEmail is required!'}), 400

    try:
        issues_ref = db.collection('Issues')
        query = issues_ref.where('customerEmail', '==', customer_email)
        docs = query.stream()

        issues = []
        for doc in docs:
            issue_data = doc.to_dict()
            issue_data['concernId'] = doc.id
            issues.append(issue_data)

        return jsonify({'issues': issues}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
