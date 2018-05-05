/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.status(200).json({
    data: "Welcome to the api homepage"
  });
};
