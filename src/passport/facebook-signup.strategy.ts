import { Request } from "express";
import passport from "passport";
import logger from "../logger";
import { SocialAuthProvider } from "../utils/user";
import { Profile, Strategy } from "passport-facebook";

import { UserModel } from "../models/user.model";
import { createUser, getUser } from "../services/user.service";

passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser((_id, done) => {
  UserModel.findById(_id, function (err, user) {
    done(err, user);
  });
});

export const facebookSignupStrategy = () => {
  const verify = async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    next: any
  ) => {
    const { email, id, name, picture } = profile._json;
    const user = await getUser({ email });
    if (user) return next(null, user); // Login the user

    // Signup the user
    let newUser = null;
    let err = null;
    try {
      // If no email then user will verify it from app's settings
      newUser = await createUser({
        fullName: name,
        email: email ?? undefined,
        emailVerified: email ? true : false,
        profilePic: { id: "facebook", URL: picture.data.url },
        isActive: email ? true : false,
        socialAuthInfo: [{ id: id, provider: SocialAuthProvider.FACEBOOK }],
      });
    } catch (error) {
      err = error;
      logger.error(error);
    }

    return next(err, newUser);
  };

  return new Strategy(
    {
      clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
      profileFields: ["id", "first_name", "displayName", "photos", "email"],
      passReqToCallback: true,
    },
    verify
  );
};

passport.use("facebook-signup", facebookSignupStrategy());
