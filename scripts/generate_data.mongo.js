const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost/issuetracker';

async function populate() {
	const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		console.log('Connected to MongoDB');
		const db = client.db();

		const owners = ['Ravan', 'Eddie', 'Pieta', 'Parvati', 'Victor'];
		const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];

		const issues = db.collection('issues');	
		await issues.deleteMany({});
		const initialCount = await issues.countDocuments(); //count will be deprecated
		for (let i = 0; i < 100; i += 1) {
			const randomCreatedDate = (new Date()) - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24;
			const created = new Date(randomCreatedDate);
			const randomDueDate = (new Date()) - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24;
			const due = new Date(randomDueDate);

			const owner = owners[Math.floor(Math.random() * 5)];
			const status = statuses[Math.floor(Math.random() * 4)];
			const effort = Math.ceil(Math.random() * 20);
			const title = `Lorem ipsum dolor sit amet, ${i}`;
			const id = initialCount + i + 1;

			const issue = { id, title, created, due, owner, status, effort, };
			await issues.insertOne(issue);
		}

		const count = await issues.countDocuments();
		const counters = db.collection('counters');
		await counters.updateOne({ _id: 'issues' }, { $set: { current: count } });
		console.log('New issue count:', count);
	} catch(err) {
		console.log(err);
	} finally {
		client.close();
	}
}

populate();