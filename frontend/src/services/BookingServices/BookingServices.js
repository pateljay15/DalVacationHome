const baseUrl = "https://fa7721ywbk.execute-api.us-east-1.amazonaws.com/"

export const postBookingData = async (data) => {
    console.log(data)
    fetch(`${baseUrl}book`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
}


export const postFeedbackForRoom = async (data) => {
    console.log(data)
    fetch(`${baseUrl}/feedback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
}