const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SG_API_KEY)

module.exports = () => {
    const utils = {
        sendVerificationMail: sendVerificationMail
    }  

    return utils


    function sendVerificationMail(code, sendTo) {
        let url = process.env.VERIFICATION_URL + code
        const message = {
            to: sendTo,
            from: {
                name: process.env.SG_FROM_NAME,
                email: process.env.SG_FROM_EMAIL
                },
                subject: 'Paws and Claws: Account Registration',
                text: `Confirm your account registration. 
                
                Please click this <a href="${url}">Link</a> to verify your email address and finalize your registration.
                `,
                html: `<h1>Confirm your account registration</h1>. 
                
                Please click this <a href="${url}">Link</a> to verify your email address and finalize your registration.
                `
            }

            return sgMail.send(message)

        }



}


