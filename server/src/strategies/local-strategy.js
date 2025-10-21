import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/user.js";
import { comparePassword } from "../utils/helpers.js";

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) return done(null, false, { message: "User not Found" });

      const isMatch = await comparePassword(password, findUser.password);
      if (!isMatch) return done(null, false, { message: "Invalid Password" });

      return done(null, findUser);
    } catch (err) {
      return done(err, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});
