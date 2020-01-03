module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.jsx',
    'jest-canvas-mock'
  ],
  testPathIgnorePattern: ["<rootDir>/build/", "<rootDir>/node_modules/"],
  transformIgnorePatterns: [
    // '/node_modules/(?!(ol)/).*/'
    '/node_modules/(?!(ol|ionicons)/).*/'
  ],
  transform: {
  //   // '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.svg$': 'jest-svg-transformer',
  //   '.+\\.(css|styl|less|sass|scss)$': 'jest-transform-css',
  },
};