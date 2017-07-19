## Installation

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
Modules required : **moments** and **boostrap**
It was initialy made with **node-sass-chokidar** but it was not compatible for the deployement on Heroku. (That's why there is an App.scss)

## Heroku link

You can find the app here : https://mysterious-river-33333.herokuapp.com/

## Future improvements

- Separate the actions functions from the App.js file
- Use reducers
- Handle errors
- Allow the user to sort the result by price

## Remark : Api fail

Generally it fails the first time the datas are fetch. The 'complete' element is set to false even in the poll search. So you need to click the button a few seconds later to show the tickets. I didn't know how to fix that issue.
