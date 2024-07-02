exports.handler = async (event) => {
    let body;
    if (typeof event === 'string') {
        body = JSON.parse(event);
    } else {
        body = event; 
    }

    const issue = body.Issue;
    const bookingReferenceCode = body.BookingReferenceCode;

    console.log(`triggered by IntentHandler`);
    console.log(`Issue received: ${issue}`);
    console.log(`Booking Reference Code received: ${bookingReferenceCode}`);
    
    return {
        fulfillmentText: 'Your query has been submitted. A representative will contact you shortly.'
    };
};
