import base64
import json
import random
import requests
import functions_framework
from google.cloud import firestore
from datetime import datetime

db = firestore.Client()

# Function to fetch admin names and emails from the API endpoint
def fetch_admins():
    """
    Fetch admin names and emails from the API endpoint.
    
    Returns:
        list: A list of dictionaries containing admin details, or an empty list if an error occurs.
    """

    url = "https://bnnk8ocuma.execute-api.us-east-1.amazonaws.com/v1/fetchAdmins"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        admins = response.json()
        return admins
    except requests.RequestException as e:
        print(f"Error fetching admins: {e}")
        return []

# Triggered from a message on a Cloud Pub/Sub topic.
@functions_framework.cloud_event
def hello_pubsub(cloud_event):
    """
    Triggered from a message on a Cloud Pub/Sub topic.
    
    Args:
        cloud_event (google.cloud.functions.CloudEvent): The CloudEvent object containing Pub/Sub message data.
    """

    pubsub_data = base64.b64decode(cloud_event.data["message"]["data"]).decode('utf-8')
    
    try:
        # Parse the JSON data
        message_data = json.loads(pubsub_data)
        
        # Extract bookingReferenceCode, issue, and email from message_data
        booking_reference_code = message_data.get("bookingReferenceCode", "")
        concern_text = message_data.get("issue", "")  # Renamed to concern_text
        customer_email = message_data.get("email", "")  # Extract email as customer_email

        # Print or log the extracted values
        print(f"Booking Reference Code: {booking_reference_code}")
        print(f"Concern Text: {concern_text}")
        print(f"Customer Email: {customer_email}")  # Log the email

        # Fetch and log the admin details
        admins = fetch_admins()
        if admins:
            assigned_admin = random.choice(admins)
            assigned_admin_name = assigned_admin['name']
            assigned_admin_email = assigned_admin['email']
            print(f"Assigned Admin: {assigned_admin_name}, Email: {assigned_admin_email}")
        else:
            assigned_admin_name = "No Admin Available"
            assigned_admin_email = "No Admin Available"
            print("No Admin Available")

        # Initialize an empty array for chats
        chats = []

        # Dynamically generate dateRaised as the current date
        date_raised = datetime.utcnow().isoformat()

        # By default, keep isActive true
        is_active = True

        # Store the issue with the assigned agent name and email, and other details
        doc_ref = db.collection('Issues').add({
            'bookingReferenceCode': booking_reference_code,
            'concernText': concern_text,
            'customerEmail': customer_email,
            'agentName': assigned_admin_name,
            'agentEmail': assigned_admin_email,
            'dateRaised': date_raised,
            'isActive': is_active,
            'chats': chats
        })
        document_id = doc_ref[1].id
        print(f"Data written to Firestore successfully. Document ID: {document_id}")
        
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    
    except Exception as e:
        print(f"Error processing message: {e}")
