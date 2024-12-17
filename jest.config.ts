import { Config } from 'jest'

const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': '@swc/jest',
	},
	collectCoverageFrom: ['src/application/**/*.(t|j)s', 'src/shared/**/*.(t|j)s'],
	coverageDirectory: './coverage',
	testEnvironment: 'node',
	resetMocks: true,
	clearMocks: true,
	roots: ['<rootDir>/'],
	modulePaths: ['<rootDir>'],
	moduleDirectories: ['node_modules'],
}

export default config
