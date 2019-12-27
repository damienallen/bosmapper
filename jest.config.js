module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: [
    "/node_modules/(?!(ol|ionicons)/).*/"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
};