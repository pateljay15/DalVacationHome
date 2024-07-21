resource "google_dialogflow_agent" "guest_agent" {
  display_name          = "Guest-agent"
  default_language_code = "en"
  time_zone             = "America/Los_Angeles"
  description           = "An example Dialogflow agent"
}

resource "google_dialogflow_intent" "booking_navigation" {
  display_name = "Booking Navigation"
  depends_on   = [google_dialogflow_agent.guest_agent]

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
  depends_on   = [google_dialogflow_agent.guest_agent]

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
  depends_on   = [google_dialogflow_agent.guest_agent]

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
  depends_on   = [google_dialogflow_agent.guest_agent]

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
  depends_on   = [google_dialogflow_agent.guest_agent]

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
  depends_on   = [google_dialogflow_agent.guest_agent]

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
  depends_on   = [google_dialogflow_agent.guest_agent]

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
  depends_on   = [google_dialogflow_agent.guest_agent]

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
