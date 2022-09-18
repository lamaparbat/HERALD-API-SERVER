const feedbackAuth = () => {
  return (req, res, next) => {
    Object.keys(req.body).length == 2 && !req.body?.uploadFileName ?
      req.body.withProof = false : req.body.withProof = true
    next();
  }
}

module.exports = feedbackAuth;