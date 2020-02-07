const { MongoClient } = require('mongodb');
//const url = 'mongodb://localhost/issuetracker';
const url = 'mongodb+srv://brian:CtA00CPWEjc4GTz0@cluster0-n6xfz.mongodb.net/test?retryWrites=true&w=majority';

async function reset() {
	//client needs to be defined here so it is accessible in the finally block
	const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		console.log('Connected to MongoDB');
		const db = client.db();

		const issues = db.collection('issues');	
		const deleted_issues = db.collection('deleted_issues');
		await issues.deleteMany({}); //remove is deprecated 
		await deleted_issues.deleteMany({});
		const issuesDB = [
		  {
		    id: 1, 
		    status: 'New', 
		    owner: 'Ravan', 
		    effort: 5,
		    created: new Date('2019-01-15'), 
		    due: undefined,
		    title: 'Error in console when clicking Add',
		    description: 'Steps to recreate the problem:'
		      + '\n1. Refresh the browser.'
		      + '\n2. Select "New" in the filter'
		      + '\n3. Refresh the browser again. Note the warning in the console:'
		      + '\n   Warning: Hash history cannot PUSH the same path; a new entry'
		      + '\n   will not be added to the history stack'
		      + '\n4. Click on Add.'
		      + '\n5. There is an error in console, and add doesn\'t work.',
		  },
		  {
		    id: 2, 
		    status: 'Assigned', 
		    owner: 'Eddie', 
		    effort: 14,
		    created: new Date('2019-01-16'), 
		    due: new Date('2019-02-01'),
		    title: 'Missing bottom border on panel',
		    description: 'There needs to be a border in the bottom in the panel'
      		+ ' that appears when clicking on Add',
		  },
		];

		await issues.insertMany(issuesDB);
		let count = await issues.countDocuments();
		console.log('Inserted', count, 'issues');

		const counters = db.collection('counters');
		await counters.deleteMany({ _id: 'issues' });
		await counters.insertOne({ _id: 'issues', current: count });
		count = await counters.countDocuments();
		console.log('Inserted', count, 'counters');

		await issues.createIndex({ id: 1 }, { unique: true });
		await issues.createIndex({ status: 1 });
		await issues.createIndex({ owner: 1 });
		await issues.createIndex({ created: 1 });
		await issues.createIndex({ title: 'text', description: 'text' });

		await deleted_issues.createIndex({ id: 1 });	
	} catch(err) {
		console.log(err);
	} finally {
		client.close();
	}
}

reset();
