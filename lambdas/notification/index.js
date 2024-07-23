import nodemailer from "nodemailer";

const email = "evansmathew256@gmail.com";

export async function handler(event) {
  console.log(" in lambd event", event);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: "noqz vazn guzw zkcv",
    },
  });

  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.body);
    console.log("after snsMessage", snsMessage.Message);
    const message = JSON.parse(snsMessage.Message);
    //const message = snsMessage;
    console.log("msg: ", message, message.to, message.subject, message.body);

    let mailOptions = {
      from: email,
      to: message.to,
      subject: message.subject,
      text: message.body,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email: " + error);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Emails processed successfully!"),
  };
}
