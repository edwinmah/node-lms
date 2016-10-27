# Node Learning Management System

This is a Learning Management System (LMS) that makes it easy to create a sequence of lessons or steps for a single course or assignment. It's built on [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/) and supports [Markdown](https://daringfireball.net/projects/markdown/), which means that it can be used to present most any type of content.

It's not intended to be match all of the features of LMSs such as [BlackBoard](http://www.blackboard.com/), [Desire2Learn](https://www.d2l.com/), [Moodle](https://moodle.org/), et al. So you won't find things like a gradebook, video conferencing, or [Turnitin](http://turnitin.com/) support. But sometimes having so many features available can be intimidating for some professors and instructors to use.

Instead of trying to do *everything*, this Node LMS aims to do *one thing well* and make it easier to create and present your lesson content and be an effective supplement to your organization's existing LMS.

## Screenshots

![lesson screen](lesson.png)

Fig. 1 – Sample lesson

***

![edit lesson screen](edit-lesson.png)

Fig. 2 – Edit lesson

***

![create lesson screen](create-lesson.png)

Fig. 3 – Create lesson

## Other software used

* [Mongoose](http://mongoosejs.com/)
* Testing
	* [Mocha](https://mochajs.org/)
	* [Chai](http://chaijs.com/)
* Markdown
	* [SimpleMDE](https://github.com/NextStepWebs/simplemde-markdown-editor)
	* [MarkdownIt](https://github.com/markdown-it/markdown-it)
* Deployment
	* [mLab](https://mlab.com/)
	* [Heroku](https://www.heroku.com/)