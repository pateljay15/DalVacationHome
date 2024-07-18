import functions_framework
from google.cloud import firestore

db = firestore.Client()

@functions_framework.http
def ChatRetriever(request):
    request_json = request.get_json(silent=True)
    request_args = request.args

    email_id = None

    if request_json and 'emailId' in request_json:
        email_id = request_json['emailId']
    elif request_args and 'emailId' in request_args:
        email_id = request_args['emailId']

    if not email_id:
        return 'EmailId is required!', 400

    try:
        chats_ref = db.collection('Chats')
        query = chats_ref.where('emailId', '==', email_id)
        docs = query.stream()

        chats = []
        for doc in docs:
            chat_data = doc.to_dict()
            chats.append(chat_data)

        return {'chats': chats}, 200

    except Exception as e:
        return {'error': str(e)}, 500

