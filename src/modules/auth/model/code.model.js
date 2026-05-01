import mongoose from "mongoose";

const authorizationCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    client_id: {
      type: String,
      required: true,
    },
    redirect_uri: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    is_used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AuthorizationCode = mongoose.model(
  "AuthorizationCode",
  authorizationCodeSchema
);

export default AuthorizationCode;