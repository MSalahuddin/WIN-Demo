# Win_demo Mobile App - React Native App

## Getting Started
## Environment Variables 
Note the project requires a `.env` file. Please ask developers for 
it. 

If you want to make a distributed build through Microsoft App Center, 
you will need to set the environment in the build pipe in MS App
Center and in `appcenter-post-clone.sh`.

### Required 
- node 10
- watchman
- react-native-cli
- yarn
- Xcode 10

---
## Running the Project

### Install Dependencies 
Install project dependencies 
``` bash
yarn install 
cd ios && pod install 
```

### Run on iOS
*Make sure to update your `.env` file to the correct environment*
## Run development environment
`react-native run-ios --configuration "Debug-Dev"`

## Run staging environment
`react-native run-ios --configuration "Debug-Staging"`

## Run production environment
`react-native run-ios --configuration "Debug"`

---
## Lint and test code

We use husky for pre-commit verification to ensure all code is linted, 
and pass unit tests.

- Run eslint
``` bash
yarn eslint
```
- Run tests
``` bash 
yarn test
```

If the Jest snapshots need to be updated use `yarn test -u`  
[Snapshot Testing Overview](https://facebook.github.io/jest/docs/en/snapshot-testing.html)

--- 
## Debugging tool
The project has [Reactotron](https://github.com/infinitered/reactotron) installed which is a useful debugging tool that allows you to inspect the app. It can be used to view API requests & responses. To use Reactotron, install the [Reactotron application](https://github.com/infinitered/reactotron/blob/master/docs/installing.md) locally, and run the app on a simulator in debug mode. 
