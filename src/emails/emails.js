
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SGMAILAPIKEY);

const sendWelcomeEmail = (email, name) => {

  const msg = {
    to: email,
    from: 'abdfre7at1@gmail.com',
    subject: 'Welcome to drsne.com',
    text: `hi ${name} i hope u get enjoy in our website!`
  };
  sgMail.send(msg).then(() => {
    console.log('Message sent')
  }).catch((error) => {
    console.log(error.response.body)
  })
}

const sendBye=(email,name)=>{
  const msg = {
    to: email,
    from: 'abdfre7at1@gmail.com',
    subject: 'Good bye',
    text: `hi ${name} i hope u get enjoy in our website! feel free to contact us `
  };
  sgMail.send(msg).then(() => {
    console.log('Message sent')
  }).catch((error) => {
    console.log(error.response.body)
  })
}


module.exports={sendWelcomeEmail,
  sendBye
}
  
