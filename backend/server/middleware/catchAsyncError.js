export default (use) => (req, res, next) => {
  Promise.resolve(use(req, res, next)).catch(next);
};
