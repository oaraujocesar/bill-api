import { Config } from 'jest'

const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': '@swc/jest',
	},
	testEnvironment: 'node',
	roots: ['<rootDir>/'],
	modulePaths: ['<rootDir>'],
	moduleDirectories: ['node_modules'],
}

export default config

// {
//Config,  	"moduleFileExtensions": ["js", "json", "ts"],
// 	"rootDir": ".",
// 	"testEnvironment": "node",
// 	"testRegex": ".e2e-spec.ts$",
// 	"transform": {
// 		"^.+\\.(t|j)s$": "ts-jest"
// 	}
// }
