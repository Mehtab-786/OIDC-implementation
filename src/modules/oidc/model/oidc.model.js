import mongoose from 'mongoose';

const oidcSchema = new mongoose.Schema({
    app_url: {
        type: String,
        required: [true, "Website main url is needed !"],
        // unique: true,
        trim: true
    },
    redirect_uri: {
        type: String,
        required: [true, "Redirection uri is needed !"],
        trim: true
    },
    app_name: {
        type: String,
        required:true
    },
    contact_email: {
        type: String,
        // unique: true,
        trim: true
    },
    client_id: {
        type: String,
    },
    client_secret: {
        type: String,
    },
}, {
    timestamps: true
});


const oidcModel = mongoose.model("OIDC", oidcSchema);
export default oidcModel;
