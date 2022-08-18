require('dotenv').config()
const twillo = require('twilio')(process.env.SID, process.env.TOKEN)


function twilio(message, mobilenumber, otp, res) {
    console.log("mmess",message)
    console.log("number",mobilenumber)
        console.log("otp",otp)
            // console.log("res",res)
    try {
        twillo.messages.create({
            from: '+16812498432',
            to: "+91" + mobilenumber,
            body: message
        }).then(mms => {
            console.log("mms",mms)
            res.send({ message: "sms sended", res: mms, otp: otp })
            console.log("sms sended")
        }).catch(err => {
            res.send({ message: err.message })
            console.log('err fffffff', err.message)
        })
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = { twilio }