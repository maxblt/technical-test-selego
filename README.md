# Technical test for Selego

## Bugs
"What bugs did you find? How did you solve these and why?"

- The webapp was crashing when viewing a project details page: removed toString() on project name
- The project details page had no data: changed the api route to use findOne instead of find to avoid returning an array
- The project links were sometimes redirecting to an api endpoint instead of the url: added http prefix when missing
- The placeholder text for projects textbox on the activities page had "undefined" in it: used correct property for the project name
- The availability of the logged user wasn't refreshing on the home page and the people page when changed in the header: watched for availability change
- Usernames were not saved: used correct property in form to match the api
- Password weren't hidden when creating user: added password type on input
- The user edit save button was broken: used onClick instead of onChange
- The projects list wasn't refreshing after a new project was created: added fetching projects after creating
- Redirecting to the wrong page after deleting a project: changed route
- A project activity wasn't deleted when project was, resulting in activities without any name: changed api endpoint to perform multiple actions on project deletion
- The activities list wasn't refreshing after a project was deleted: added fetching projects after deleting
- The user email wasn't updating when saving on the account page: added onChange on the input


## Features
"Which feature did you develop and why?"

Tweaks on activities page:
- Allowed having mutiple projects textarea opened at the same time
- Textarea opening when clicking on the project name cell, not any cell
- Being able to close those textarea
- Fixed bug where the placeholder "0" wasn't cleared when clicking on the cell, if the textarea of this project wasn't open

User chat per project on a project details page:
- Users can send messages on the project chat
- Users can delete their own messages
- Date & time are displayed for each message
- Messages are saved in the database
- All messages are deleted upon project deletion
- Auto scroll down to the bottom of the page when writing and sending a message

The chat can be useful for giving notes on the projects, asking questions, leaving feedback, updating milestones, etc. It's aimed for less important or temporary information, unlike the textarea on a project activity.

## Feedback
"Do you have any feedback about the code / architecture of the project and what was the difficulty you encountered while doing it?"

The main difficulty encountered was the overall poor code readability: unclear & inconsistent naming, too many components in a same file, duplicated & unused code, lack of comments, etc.

Other feedback:
- The project could have been written in TypeScript for a better understanding and enhanced maintainability
- The data model could be improved (status and availability should be bool/enum instead of strings for example)
- The API response contains an 'ok' field, which is redundant given the presence of status codes.
- When saving on the activities page, all items are sent to the API regardless of whether changes have been made or not
- The UX for adding links to a project isn't clear
- WebSockets should have been used to notify users of data changes in real-time, such as users availability, activities, etc.
- The app lacks tests, both for the API and end-to-end


