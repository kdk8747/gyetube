const KakaoStrategy = require('./passport-kakao').Strategy;
const NaverStrategy = require('./passport-naver').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const debug = require('debug')('passports');
const express = require('express');
const passport = require('passport');

exports.initialize = () => {
    const app = express();

    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_CLIENT_KEY,
        clientSecret: process.env.NAVER_SECRET_KEY,
        callbackURL: process.env.END_POINT + '/api/v1.0/users/naver_oauth'
    },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;

            debug(_profile);
            done(null, {
                id: 'nv' + String(_profile.id),
                name: _profile.nickname,
                imageUrl: _profile.profile_image,
                loggedInBy: 'naver'
            });
        }
    ));

    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_CLIENT_KEY,
        clientSecret: process.env.KAKAO_SECRET_KEY,
        callbackURL: process.env.END_POINT + '/api/v1.0/users/kakao_oauth'
    },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;

            debug(_profile);
            done(null, {
                id: 'kk' + String(_profile.id),
                name: _profile.properties.nickname,
                imageUrl: _profile.properties.thumbnail_image,
                loggedInBy: 'kakao'
            });
        }
    ));

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_KEY,
        clientSecret: process.env.FACEBOOK_SECRET_KEY,
        callbackURL: process.env.END_POINT + '/api/v1.0/users/facebook_oauth',
        profileFields: ['id', 'email', 'link', 'locale', 'verified', 'displayName', 'picture']
    },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;

            debug(_profile);
            done(null, {
                id: 'fb' + String(_profile.id),
                name: _profile.name,
                imageUrl: _profile.picture.data.url,
                loggedInBy: 'facebook'
            });
        }
    ));
    app.use(passport.initialize());
}
