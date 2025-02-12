const isSignedIn = (req, res, next) => {
    if(!req.session.user) {
        return res.redirect('/auth/signin');
    }

    next();
}

module.exports = isSignedIn;