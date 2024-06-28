const baseUrl = "https://fa7721ywbk.execute-api.us-east-1.amazonaws.com/room"

export const fetchRooms = () => {

    fetch(`${baseUrl}`, {
        method: "GET",
    })
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
}

export const postImage = (filename, img) => {

    fetch(`${baseUrl}/${filename}`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: img,
    })
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
}

export const postData = async (data) => {
    
    fetch(`${baseUrl}`, {
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



