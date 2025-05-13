module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['js', 'json'],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  setupFilesAfterEnv: [],
};