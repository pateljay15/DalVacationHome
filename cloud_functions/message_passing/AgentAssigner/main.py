import base64
import json
import random
import requests
import functions_framework
from google.cloud import firestore

db = firestore.Client()

# Function to fetch admin names from the API endpoint
def fetch_admin_names():
    url = "https://bnnk8ocuma.execute-api.us-east-1.amazonaws.com/v1/fetchAdmins"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        admins = response.json()
        admin_names = [admin['name'] for admin in admins]
        return admin_names
    except requests.RequestException as e:
        print(f"Error fetching admins: {e}")
        return []

# Triggered from a message on a Cloud Pub/Sub topic.
@functions_framework.cloud_event
def hello_pubsub(cloud_event):
    pubsub_data = base64.b64decode(cloud_event.data["message"]["data"]).decode('utf-8')
    
    try:
        # Parse the JSON data
        message_data = json.loads(pubsub_data)
        
        # Extract bookingReferenceCode and issue from message_data
        booking_reference_code = message_data.get("bookingReferenceCode", "")
        issue = message_data.get("issue", "")
        
        # Print or log the extracted values
        print(f"Booking Reference Code: {booking_reference_code}")
        print(f"Issue: {issue}")

        # Fetch and log the admin names
        admin_names = fetch_admin_names()
        print(f"Fetched Admin Names: {admin_names}")

        if admin_names:
            # Pick a random admin
            assigned_admin = random.choice(admin_names)
            print(f"Assigned Admin: {assigned_admin}")
        else:
            assigned_admin = "No Admin Available"
            print(assigned_admin)

        # Store the issue with the assigned agent name
        doc_ref = db.collection('Issues').document()
        doc_ref.set({
            'bookingReferenceCode': booking_reference_code,
            'issue': issue,
            'assignedAgentName': assigned_admin
        })
        print("Data written to Firestore successfully.")
        
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    
    except Exception as e:
        print(f"Error processing message: {e}")
