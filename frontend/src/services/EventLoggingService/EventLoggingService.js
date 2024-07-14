export const logEvent = async (email, action) => {
  const response = await fetch(
    "https://auidgx4717.execute-api.us-east-1.amazonaws.com/dev/loginEvent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toISOString().split("T")[1].split(".")[0],
        action: action,
      }),
    }
  );

  if (!response.ok) {
    console.error(`Failed to log ${action} event`);
  } else {
    console.log(`${action} event logged successfully`);
  }
};
