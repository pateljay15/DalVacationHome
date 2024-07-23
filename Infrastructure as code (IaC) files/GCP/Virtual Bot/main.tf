resource "google_dialogflow_agent" "guest_agent" {
  display_name          = "Guest-agent"
  default_language_code = "en"
  time_zone             = "America/Los_Angeles"
  description           = "An example Dialogflow agent"
}

resource "google_dialogflow_agent" "vacbot_agent" {
  display_name          = "vacbot-agent"
  default_language_code = "en"
  time_zone             = "America/Los_Angeles"
  description           = "Dialogflow agent for authenticate users"
}

resource "google_dialogflow_intent" "booking_navigation" {
  display_name = "Booking Navigation"
  depends_on   = [google_dialogflow_agent.guest_agent, google_dialogflow_agent.vacbot_agent]

  training_phrases {
    parts {
      text = "How do I book a room?"
    }
  }

  training_phrases {
    parts {
      text = "How to book a room?"
    }
  }

  messages {
    text {
      text = ["You can book a room by clicking on the 'View Details' button of your preferred room and then selecting 'Book Room' on the room details page."]
    }
  }
}

resource "google_dialogflow_intent" "default_fallback_intent" {
  display_name = "Default Fallback Intent"
  depends_on   = [google_dialogflow_agent.guest_agent, google_dialogflow_agent.vacbot_agent]

  is_fallback = true

  messages {
    text {
      text = [
        "I didn't get that. Can you say it again?",
        "I missed what you said. What was that?",
        "Sorry, could you say that again?",
        "Sorry, can you say that again?",
        "Can you say that again?",
        "Sorry, I didn't get that. Can you rephrase?",
        "Sorry, what was that?",
        "One more time?",
        "What was that?",
        "Say that one more time?",
        "I didn't get that. Can you repeat?",
        "I missed that, say that again?"
      ]
    }
  }
}

resource "google_dialogflow_intent" "default_welcome_intent" {
  display_name = "Default Welcome Intent"
  depends_on   = [google_dialogflow_agent.guest_agent, google_dialogflow_agent.vacbot_agent]

  events = ["WELCOME"]

  training_phrases {
    parts {
      text = "just going to say hi"
    }
  }

  training_phrases {
    parts {
      text = "heya"
    }
  }

  training_phrases {
    parts {
      text = "hello hi"
    }
  }

  training_phrases {
    parts {
      text = "howdy"
    }
  }

  training_phrases {
    parts {
      text = "hey there"
    }
  }

  training_phrases {
    parts {
      text = "hi there"
    }
  }

  training_phrases {
    parts {
      text = "greetings"
    }
  }

  training_phrases {
    parts {
      text = "hey"
    }
  }

  training_phrases {
    parts {
      text = "long time no see"
    }
  }

  training_phrases {
    parts {
      text = "hello"
    }
  }

  messages {
    text {
      text = [
        "Hi! How are you doing?",
        "Hello! How can I help you?",
        "Good day! What can I do for you today?",
        "Greetings! How can I assist?"
      ]
    }
  }
}

resource "google_dialogflow_intent" "homepage_navigation" {
  display_name = "Homepage Navigation"
  depends_on   = [google_dialogflow_agent.guest_agent, google_dialogflow_agent.vacbot_agent]

  training_phrases {
    parts {
      text = "Home page"
    }
  }

  training_phrases {
    parts {
      text = "Go to home"
    }
  }

  training_phrases {
    parts {
      text = "Back to home"
    }
  }

  training_phrases {
    parts {
      text = "Homepage"
    }
  }

  messages {
    text {
      text = ["Please click the button below to go to the Home Page."]
    }
  }

  messages {
    payload = jsonencode({
      richContent = [
        {
          type = "button",
          text = "Go to Home Page",
          link = "https://dalvacationhome-sdp36-g3ffjvedxq-ue.a.run.app/",
          icon = {
            type  = "chevron_right",
            color = "#FF9800"
          }
        }
      ]
    })
  }
}

resource "google_dialogflow_intent" "login_navigation" {
  display_name = "Login Navigation"
  depends_on   = [google_dialogflow_agent.guest_agent, google_dialogflow_agent.vacbot_agent]

  training_phrases {
    parts {
      text = "How do I log in?"
    }
  }

  training_phrases {
    parts {
      text = "Where is the login page?"
    }
  }

  training_phrases {
    parts {
      text = "How can I sign in?"
    }
  }

  training_phrases {
    parts {
      text = "Login page"
    }
  }

  training_phrases {
    parts {
      text = "Sign in"
    }
  }

  messages {
    text {
      text = ["You can log in by clicking the button below."]
    }
  }

  messages {
    payload = jsonencode({
      richContent = [
        {
          type  = "description",
          title = "User Login",
          text = [
            "Please fill out the following details:",
            "Email",
            "Password"
          ]
        },
        {
          type = "button",
          text = "Log In",
          link = "https://dalvacationhome-sdp36-g3ffjvedxq-ue.a.run.app/user/login",
          icon = {
            type  = "chevron_right",
            color = "#FF9800"
          }
        }
      ]
    })
  }
}

resource "google_dialogflow_intent" "mybookings_navigation" {
  display_name = "MyBookings Navigation"
  depends_on   = [google_dialogflow_agent.guest_agent, google_dialogflow_agent.vacbot_agent]

  training_phrases {
    parts {
      text = "How do I view my bookings?"
    }
  }

  training_phrases {
    parts {
      text = "My bookings"
    }
  }

  training_phrases {
    parts {
      text = "Show my reservations"
    }
  }

  training_phrases {
    parts {
      text = "View my bookings"
    }
  }

  training_phrases {
    parts {
      text = "Check my bookings"
    }
  }

  messages {
    text {
      text = ["You can view your bookings by clicking the button below to go to the MyBookings page."]
    }
  }

  messages {
    payload = jsonencode({
      richContent = [
        {
          type = "button",
          text = "View MyBookings",
          link = "https://dalvacationhome-sdp36-g3ffjvedxq-ue.a.run.app/mybookings",
          icon = {
            type  = "chevron_right",
            color = "#FF9800"
          }
        }
      ]
    })
  }
}

resource "google_dialogflow_intent" "signup_navigation" {
  display_name = "Signup Navigation"
  depends_on   = [google_dialogflow_agent.guest_agent, google_dialogflow_agent.vacbot_agent]
  
  training_phrases {
    parts {
      text = "How do I register?"
    }
  }

  training_phrases {
    parts {
      text = "Where is the registration page?"
    }
  }

  training_phrases {
    parts {
      text = "How can I sign up?"
    }
  }

  training_phrases {
    parts {
      text = "Sign up"
    }
  }

  training_phrases {
    parts {
      text = "Signup"
    }
  }

  training_phrases {
    parts {
      text = "Register"
    }
  }

  messages {
    text {
      text = ["You can sign up by clicking the button below."]
    }
  }

  messages {
    payload = jsonencode({
      richContent = [
        {
          type  = "description",
          title = "User Registration",
          text = [
            "Please fill out the following details:",
            "Name",
            "Email",
            "Password",
            "Re-enter Password",
            "Shift Key",
            "Security Question: What is your mother's maiden name?"
          ]
        },
        {
          type = "button",
          text = "Sign Up",
          link = "https://dalvacationhome-sdp36-g3ffjvedxq-ue.a.run.app/user/registration",
          icon = {
            type  = "chevron_right",
            color = "#FF9800"
          }
        }
      ]
    })
  }
}

resource "google_dialogflow_intent" "welcome_intent" {
  display_name = "Welcome"
  depends_on   = [google_dialogflow_agent.guest_agent, google_dialogflow_agent.vacbot_agent]

  events = ["vacbot_welcome"]

  training_phrases {
    parts {
      text = "hello"
    }
  }

  training_phrases {
    parts {
      text = "hi"
    }
  }

  training_phrases {
    parts {
      text = "hey"
    }
  }

  training_phrases {
    parts {
      text = "start"
    }
  }

  training_phrases {
    parts {
      text = "welcome"
    }
  }

  messages {
    text {
      text = ["Welcome to DalVacationHome! How can I assist you today?"]
    }
  }
}

resource "google_dialogflow_intent" "guest_booking_info_intent" {
  display_name = "Booking Info Intent"
  depends_on   = [google_dialogflow_agent.guest_agent]

  training_phrases {
    parts {
      text = "BH123456"
    }
    parts {
      text = "Room number?"
    }
    parts {
      text = "What's my room number?"
    }
    parts {
      text = "This is my booking reference code BH123456. Could you please fetch me my booking details?"
    }
  }

  messages {
    text {
      text = [
        "You need to login or register to know the booking details. Please visit the login or registration page to proceed."
      ]
    }
  }
}


resource "google_dialogflow_intent" "guest_customer_support_request_intent" {
  display_name = "Customer Support Request Intent"
  depends_on   = [google_dialogflow_agent.guest_agent]

  training_phrases {
    parts {
      text = "Can I get connected to an agent? I am having trouble with booking a room. My booking reference is BH557834."
    }
    parts {
      text = "Please connect me to an agent. This is my booking code: BH123456"
    }
    parts {
      text = "I need to talk to an agent"
    }
    parts {
      text = "I would like to get connected with an agent"
    }
  }

  messages {
    text {
      text = [
        "You need to login or register to connect with an agent. Please visit the login or registration page to proceed."
      ]
    }
  }
}

resource "google_dialogflow_intent" "booking_info_intent" {
  display_name = "Booking Info Intent"
  depends_on   = [google_dialogflow_agent.vacbot_agent]

  training_phrases {
    parts {
      text        = "BH123456"
      entity_type = "@BookingReference"
      alias       = "BookingReferenceCode"
    }
  }

  training_phrases {
    parts {
      text = "Room number?"
    }
  }

  training_phrases {
    parts {
      text = "What's my room number?"
    }
  }

  training_phrases {
    parts {
      text = "This is my booking reference code "
    }
    parts {
      text        = "BH123456"
      entity_type = "@BookingReference"
      alias       = "BookingReferenceCode"
    }
    parts {
      text = ". Could you please fetch me my booking details?"
    }
  }

  parameters {
    display_name             = "BookingReferenceCode"
    entity_type_display_name = "@BookingReference"
    value                    = "$BookingReferenceCode"
    mandatory                = true
    prompts                  = ["What's your Booking Reference Code?"]
  }

  messages {
    text {
      text = ["Fetching your booking details for reference code ${BookingReferenceCode}."]
    }
  }

  fulfillment {
    webhook {
      enabled = true
    }
  }
}

resource "google_dialogflow_intent" "customer_support_request_intent" {
  display_name = "Customer Support Request Intent"
  depends_on   = [google_dialogflow_agent.vacbot_agent]

  training_phrases {
    parts {
      text = "Can I get connected to an agent? "
    }
    parts {
      text        = "I am having trouble with booking a room"
      entity_type = "@sys.any"
      alias       = "Issue"
    }
    parts {
      text = ". My booking reference is "
    }
    parts {
      text        = "BH557834."
      entity_type = "@BookingReference"
      alias       = "BookingReferenceCode"
    }
  }

  training_phrases {
    parts {
      text = "Please connect me to an agent. This is my booking code: "
    }
    parts {
      text        = "BH123456"
      entity_type = "@BookingReference"
      alias       = "BookingReferenceCode"
    }
  }

  training_phrases {
    parts {
      text = "I need to talk to an agent"
    }
  }

  training_phrases {
    parts {
      text = "I would like to get connected with an agent"
    }
  }

  parameters {
    display_name             = "Issue"
    entity_type_display_name = "@sys.any"
    value                    = "$Issue"
    mandatory                = true
    prompts                  = ["Please describe your issue."]
  }

  parameters {
    display_name             = "BookingReferenceCode"
    entity_type_display_name = "@BookingReference"
    value                    = "$BookingReferenceCode"
    mandatory                = true
    prompts                  = ["What's your booking reference code?"]
  }

  parameters {
    display_name             = "Email"
    entity_type_display_name = "@sys.email"
    value                    = "$Email"
    mandatory                = true
    prompts                  = ["Please enter your email ID"]
  }

  messages {
    text {
      text = ["Your query has been submitted. An agent will be contacting you soon."]
    }
  }

  fulfillment {
    webhook {
      enabled = true
    }
  }
}

resource "google_dialogflow_intent" "hotel_booking_intent" {
  display_name = "Hotel Booking Intent"
  depends_on   = [google_dialogflow_agent.vacbot_agent]

  training_phrases {
    parts {
      text        = "book a room on "
    }
    parts {
      text        = "20th July"
      entity_type = "@sys.date"
      alias       = "CheckinDate"
    }
    parts {
      text        = " for "
    }
    parts {
      text        = "3"
      entity_type = "@sys.number"
      alias       = "Guests"
    }
    parts {
      text        = " people in a "
    }
    parts {
      text        = "family"
      entity_type = "@RoomType"
      alias       = "RoomType"
    }
    parts {
      text        = " sized room in "
    }
    parts {
      text        = "Mumbai"
      entity_type = "@sys.geo-city"
      alias       = "City"
    }
    parts {
      text        = " for "
    }
    parts {
      text        = "4"
      entity_type = "@sys.number"
      alias       = "Nights"
    }
    parts {
      text        = " nights"
    }
  }

  training_phrases {
    parts {
      text = "Book a room"
    }
  }

  training_phrases {
    parts {
      text = "Book hotel"
    }
  }

  parameters {
    display_name             = "City"
    entity_type_display_name = "@sys.geo-city"
    value                    = "$City"
    mandatory                = true
    prompts                  = ["Which city are you planning to visit?"]
  }

  parameters {
    display_name             = "Guests"
    entity_type_display_name = "@sys.number"
    value                    = "$Guests"
    mandatory                = true
    prompts                  = ["For how many people do you need a room?"]
  }

  parameters {
    display_name             = "Nights"
    entity_type_display_name = "@sys.number"
    value                    = "$Nights"
    mandatory                = true
    prompts                  = ["How many nights are you planning to stay?"]
  }

  parameters {
    display_name             = "CheckinDate"
    entity_type_display_name = "@sys.date"
    value                    = "$CheckinDate"
    mandatory                = true
    prompts                  = [
      "When can we expect you?",
      "When will you be checking in?"
    ]
  }

  parameters {
    display_name             = "RoomType"
    entity_type_display_name = "@RoomType"
    value                    = "$RoomType"
    mandatory                = true
    prompts                  = ["What type of room would you like to book? Available options are: Single, Double, Twin, Family, Suite, Deluxe, and Accessible"]
  }

  messages {
    text {
      text = ["Alright, I have you down for a ${RoomType} room booked for ${Nights} nights in ${City} for ${Guests} people. We are expecting you on ${CheckinDate}. See ya soon!"]
    }
  }

  fulfillment {
    webhook {
      enabled = true
    }
  }
}

resource "google_dialogflow_entity_type" "booking_reference" {
  display_name = "BookingReference"
  kind         = "KIND_MAP"

  entities {
    value = "BH\\d{6}"
    synonyms = ["BH\\d{6}"]
  }
}

resource "google_dialogflow_entity_type" "room_type" {
  display_name = "RoomType"
  kind         = "KIND_MAP"

  entities {
    value = "Single"
    synonyms = ["Single"]
  }

  entities {
    value = "Double"
    synonyms = ["Double"]
  }

  entities {
    value = "Twin"
    synonyms = ["Twin"]
  }

  entities {
    value = "Family"
    synonyms = ["Family"]
  }

  entities {
    value = "Suite"
    synonyms = ["Suite"]
  }

  entities {
    value = "Deluxe"
    synonyms = ["Deluxe"]
  }

  entities {
    value = "Accessible"
    synonyms = ["Accessible"]
  }
}