module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/jest-env.js',
    'jest-canvas-mock'
  ],
  testPathIgnorePatterns: ['/build/', '/node_modules/'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(ol|ionicons)/).*/'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.svg$': 'jest-svg-transformer'
  },
  moduleNameMapper: {
    '.+\\.(png|jpg|ttf)$': '<rootDir>/tests/fileMock.js',
    '.+\\.(css|scss)$': 'identity-obj-proxy'
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/jest-env.js'
  ]
};