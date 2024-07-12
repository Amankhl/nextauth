import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"

export const sendEmail = async ({email,emailType,userId} : {email:string,emailType:string,userId:string})=>{
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10)   // with the help of this token we will verify thebuser via email by comparing the hashed token in the email with the hashed token in db

        if(emailType === 'VERIFY'){
            const updatedUser = await User.findByIdAndUpdate(userId, {$set:{verifyToken: hashedToken, verifyTokenExpiry: new Date(Date.now() + 3600000)}})
            console.log("Updated User data for verify", updatedUser)
        }else if(emailType === 'RESET'){
            const updatedUser = await User.findByIdAndUpdate(userId, {$set:{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: new Date(Date.now() + 3600000)}})
            console.log("Updated User data for password reset", updatedUser)
        }

        const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "9c0d461a20c3bd", // should be in the env, but we are just testing
            pass: "1151f6b267a268"
            }
        });
    
    const link = emailType === 'VERIFY' ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}` : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`
    const mailOptions = {
    from: 'aman@gmail.com', // sender address
    to: email, //receiver(s)
    subject: emailType === 'VERIFY' ? "verify your email" : "reset your password", // because we will use email for verification for forget password and signup
    html: `<p>Click <a href="${link}">here</a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'} or copy and paste this link in your browser </br> ${link}</p>`,
  } // html page should be a proper page for verification otherwise direct providing the link will be thrown in the spam folder by email as browser actually opens the link and if you have set it up as whenever a user clicks, the user is verfied. it will be thrown to spam folder

  const mailResponse = await transporter.sendMail(mailOptions)
  return mailResponse

    } catch (error: any) {
        throw new Error(error.message)
    }
}