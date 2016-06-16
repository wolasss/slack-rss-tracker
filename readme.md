#Slack rss tracker

This is a ES6 node application that tracks rss feeds and send updates to your slack channels. It supports multiple feeds, slack teams and channels. 

# Configuration

The configuration is done via two json files, config.json and feeds.json. 

### config.json
**Configuration file for the whole application**

~ is an optional property

| Property        | Value       | Meaning |
| ------------- |:-------------:| 
| port     | [Integer] | port on which server will run
| debug     | [Boolean]      | if set to true, will show logs on std output
| logfile     | ~[String]     | namefile, if set, will log to that file 
| minInterval | [Integer]      | minimal interval that will be accepted during subscription (in min)
| maxNewItems     | [Integer]     | maximum new items that will be send to a channel when the feed is new
| teams | [Array]      | Array of teams to which notifications will be sent

Each team properties:

| Property        | Value       | Meaning |
| ------------- |:-------------:| 
| token     | [String] | token obtained from slack outgoing webhooks
| hook_url     | [String]      | url of incoming webhook
| name     | [String]     | name of the slack domain

### feeds.json
**The file that holds currently watched feeds, if not empty before the app had started, the app will automatically subscribe to all feeds specified in that file. After every check of the feed, the app will save the date of last check to that file.** 

~ is an optional property

The file contains a `rss` property, which is an array of RSS objects with following properties:

| Property        | Value       | Meaning |
| ------------- |:-------------:| 
| name     | [String] | Name of the feed
| url     | [Boolean]      | Feed url to check
| channel     | [String]     | Name of the channel; For example: #general, private_channel
| interval | [Integer]      | check interval in ms
| team     | [String]     | name of the team; for now - one feed supports one team

# Installation

###1. Configure Outgoing Webhook on Slack
Go to custom integrations and add an outgoing webhook - trigger word should be `rss-tracker`, URL would be IP:port or domain that the app is running on your server. You can trigger it from any channel or add specific public channel for managing rss tracker.

###2. Configure Incoming Webhook on Slack
Choose the default channel to which the notifications will be sent. 

###3. Fill config.json
Fill config.json file with the tokens and url you obtained from Slack. 

###4. Build your application

1. `npm install`
2. `npm run build:dev` or `npm run build:prod`

`main.js` file will be produced.

###5. Run the application

`npm start` or use forever to run it continuously. 

###6. Check if everything works
Type `rss-tracker:help` in the channel you specified in outgoing integration configuration on Slack. As a response you should get list of all available commands.

###7. Enjoy :)
