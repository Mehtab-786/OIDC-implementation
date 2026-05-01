import express from 'express';
import { v4 as uuidv4 } from "uuid";
import oidcModel from '../model/oidc.model.js';
import path from 'path';
import authModel from '../../auth/model/auth.model.js';
import AuthorizationCode from '../../auth/model/code.model.js';

const publicDir = path.resolve(process.cwd(), "public");

const sendPublicPage = (res, fileName) => {
    res.sendFile(path.resolve(publicDir, fileName));
};

const router = express.Router()

const codeMap = new Map(
    // code : {client_id,user_id, redirect_uri} 
);

const tokenMap = new Map(
    //accesstoken : user_id
)

function pushToCodeObj(obj, code) {
    codeMap.set(code, obj);
}
function pushTokenMap(token, userId) {
    tokenMap.set(token, userId);
}




router.get("/.well-known/openid-configuration", async (req, res) => {
    return res.status(200).json({
        "issuer": "http://localhost:3000",
        "authorization_endpoint": "http://localhost:3000/authorize",
        "client-registration": "http://localhost:3000/client-registration",
        "token_endpoint": "http://localhost:3000/token",
        "userinfo_endpoint": "http://localhost:3000/userinfo",
        "jwks_uri": "http://localhost:3000/jwks"
    })
})

router.post("/client-registration", async (req, res) => {

    const { app_url, app_name, redirect_uri, contact_email } = req.body;

    // todo DTO layer zod or joi 

    // check if already check later

    const client_id = uuidv4()
    const client_secret = uuidv4()

    let createdClient = await oidcModel.create({ app_url, client_id, client_secret, redirect_uri, contact_email, app_name })

    if (createdClient) {
        return res.status(201).json({
            success: true,
            message: "Client is now trusted",
            data: {
                "app_name": createdClient.app_name,
                "client_id": createdClient.client_id,
                "client_secret": createdClient.client_secret,
                "redirect_uri": createdClient.redirect_uri
            }
        })
    } else {
        throw new Error("Internal error, cannot create client");
    }
})

router.get("/client-registration", (req, res) => {
    sendPublicPage(res, 'clientRegistration.html')
})

router.get('/authorize', (req, res) => {
    const client_id = req.query?.client_id
    const redirect_uri = req.query?.redirect_uri

    // validate if client_id present or not 
    // validate if redirect_uri is stored in client_id or not
    // if both correct then only move forward 

    sendPublicPage(res, 'signinPage.html')
})

// GET /register - show signup page
router.get('/register', (req, res) => {
    console.log("req.params --", req.params)
    console.log("req.query --", req.query)
    // no client_id or redirect_uri because user will only come from login page, so user will automatically get the id

    sendPublicPage(res, 'signupPage.html')
})

// POST /register - handle registration
router.post('/register', async (req, res) => {

    const { email, password, username, client_id, redirect_uri } = req.body

    // TODO: validate input - DTO

    // TODO: check if user already exists

    // TODO - client Id validation, with redirect_uri

    let user = await authModel.findOne({ email });

    if (user) {
        throw new Error("User already exists !!")
    }

    // TODO: hash password

    let userCreated = await authModel.create({ email, password, username })
    let user_id = userCreated._id.toString();
    let code = uuidv4();


    pushToCodeObj({ user_id, code, redirect_uri }, code);

    if (userCreated) {
        return res.status(200).json({
            success: true,
            message: "Register succesfull",
            data: {
                code,
                user_id,
                redirect_uri,
                client_id
            }
        })
    }

}
)

// send it to user routes 
router.post('/login', async (req, res) => {
    const { email, password, client_id, redirect_uri } = req.body;
    // dto layer

    let ifUserExist = await authModel.findOne({ email })

    if (!ifUserExist) {
        throw new Error("User not found")
    }

    let user_id = ifUserExist._id.toString()

    // TODO - check password

    // TODO - client Id validation, with redirect_uri

    let code = uuidv4();

    pushToCodeObj({ user_id, client_id, redirect_uri }, code);


    return res.status(200).json({
        success: true,
        message: "Login succesfull",
        data: {
            code,
            user_id: ifUserExist._id.toString(),
            redirect_uri,
            client_id
        }
    })
})

router.post('/token', async (req, res) => {
    const { code, client_id, client_secret } = req.body

    let AccessToken = uuidv4()

    if (!codeMap.has(code)) {
        throw new Error('Error short-code is not validated')
    }

    let stored = codeMap.get(code)

    if (stored.client_id != client_id) {
        throw new Error('Error client id  not matching')
    }

    pushTokenMap(AccessToken, stored.user_id)

    // todo - verify client_secret , later 
    return res.status(200).json({
        success: true,
        message: "AccessToken created succesfully",
        AccessToken
    })
})

router.get('/userinfo', async (req, res) => {
    let accesstoken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : "";

    if (accesstoken == "") {
        throw new Error('Token not received')
    }

    if (!tokenMap.has(accesstoken)) {
        throw new Error('Token not validated')
    }

    let userId = tokenMap.get(accesstoken);

    let user = await authModel.findById( userId )

    if (!user) {
        throw new Error('User not found !')
    }

    return res.status(200).json({
        success: true,
        data: {
            id: user._id.toString(),
            email: user.email,
            username: user.username
        }
    })

})


export default router;
