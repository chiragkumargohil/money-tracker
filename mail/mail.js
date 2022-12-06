import * as dotenv from 'dotenv';
dotenv.config({path: '../.env'});
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const refresh_token = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
oAuth2Client.setCredentials({refresh_token: refresh_token});

const sendMail = async (email_address, msg) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'YOUR_EMAIL_ID',
                clientId: client_id,
                clientSecret: client_secret,
                refreshToken: refresh_token,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: 'Money Tracker App <YOUR_EMAIL_ID>',
            to: email_address,
            subject: 'REMINDER FROM MONEY TRACKER!',
            html: msg
        };

        const result = transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return console.log(error);
    }
};

export default sendMail;