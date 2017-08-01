const KakaoStrategy = require('./passport-kakao').Strategy;
const NaverStrategy = require('./passport-naver').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const debug = require('debug')('server');
const express = require('express');
const passport = require('passport');

exports.initialize = () => {
    const app = express();

    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_CLIENT_KEY,
        clientSecret: process.env.NAVER_SECRET_KEY,
        callbackURL: "http://localhost:8080/api/users/naver_oauth"
    },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;

            debug(_profile);
            done(null, _profile);
        }
    ));

    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_CLIENT_KEY,
        clientSecret: process.env.KAKAO_SECRET_KEY,
        callbackURL: "http://localhost:8080/api/users/kakao_oauth"
    },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;

            debug(_profile);
            done(null, _profile);
        }
    ));

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_KEY,
        clientSecret: process.env.FACEBOOK_SECRET_KEY,
        callbackURL: "http://localhost:8080/api/users/facebook_oauth",
        profileFields: ['id', 'email', 'link', 'locale', 'verified', 'displayName']
    },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;

            debug(_profile);
            done(null, _profile);
        }
    ));
    app.use(passport.initialize());
}