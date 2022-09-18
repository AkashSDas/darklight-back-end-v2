import passport from "passport";
import { Profile, Strategy } from "passport-facebook";

import { UserModel } from "../models/user.model";
import { getUser } from "../services/user.service";
import { SocialAuthProvider } from "../utils/user";

passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser((_id, done) => {
  UserModel.findById(_id, function (err, user) {
    done(err, user);
  });
});

export const facebookLoginStrategy = () => {
  const verify = async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    next: any
  ) => {
    const { id } = profile._json;
    const user = await getUser({
      socialAuthInfo: {
        $elemMatch: { id, provider: SocialAuthProvider.FACEBOOK },
      },
    });

    if (user && (!user.username || !user.email || !user.fullName)) {
      return next(null, null);
    }

    return next(null, user); // Login the user
  };

  return new Strategy(
    {
      clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL_FOR_LOGIN,
      profileFields: ["id", "first_name", "displayName", "photos", "email"],
    },
    verify
  );
};

passport.use("facebook-login", facebookLoginStrategy());
