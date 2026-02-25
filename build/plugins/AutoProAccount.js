/**
 * @name AutoProAccount
 * @description Automatically makes a pro account when making games to support more players
 * @author retrozy
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main/build/plugins/AutoProAccount.js
 */

// plugins/AutoProAccount/src/index.ts
api.net.modifyFetchRequest(
	'/api/matchmaker/intent/map/play/create',
	async (options) => {
		const { userData } = await fetch('/api/games/summary/me').then((res) =>
			res.json()
		);
		const hookOptions = options.data.options.hookOptions;
		const kitKey = Object.keys(hookOptions).find(([key]) =>
			key.toLowerCase().includes('kit')
		);
		if (!kitKey) return;
		const kitId = hookOptions[kitKey];
		const { kit } = await fetch(`/api/games/fetch/${kitId}`).then((res) =>
			res.json()
		);
		await fetch('/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: `${Math.random().toString()}@outlook.com`,
				googleToken: '',
				password: Math.random().toString(),
				accountType: 'educator',
				country: 'US',
				areaOfExpertise: 'Arts',
				organization: '',
				gradeLevel: 'Pre-K',
				groupJoining: ''
			})
		});
		const newKitId = await fetch('/api/v1/editor/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				gradeLevel: kit.gradeLevel,
				image: kit.gif,
				isPrivate: true,
				language: kit.lang,
				subject: kit.subject,
				title: kit.title
			})
		})
			.then((x) => x.json())
			.then((x) => x._id);
		await fetch('/api/v1/editor/questions/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				questions: kit.questions.map((question) => ({
					answers: question.answers.map((answer) => ({
						correct: answer.correct,
						text: answer.text
					})),
					kitId: newKitId,
					questionText: question.text,
					source: question.source,
					type: question.type
				}))
			})
		});
		hookOptions[kitKey] = newKitId;
	}
);
