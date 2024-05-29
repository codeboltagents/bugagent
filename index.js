const codebolt = require("@codebolt/codeboltjs").default;
const {CodeRunner} = require("./agents/runner/runner");
const {Bugfix} = require("./agents/bugfix/bugfix");
const path = require("path")
async function execute() {

	await codebolt.waitForConnection();
	codebolt.chat.stopProcess();
	var message = await codebolt.chat.waitforReply("Hi I am Code Runner Agent,I will help you to run of your code ");
	// del
	codebolt.chat.processStarted();

	const {markdown} = await codebolt.codeutils.getAllFilesAsMarkDown();
	const extractdata = await CodeRunner(markdown);

	const commands= JSON.parse(extractdata).commands.join(' && ');
	const port = JSON.parse(extractdata).port	

	const {projectPath} = await codebolt.project.getProjectPath();
	// let executeApp = await codebolt.terminal.executeCommandRunUntilError(commands);
	console.log("commands---",commands)
	
	let executeApp = await executeWithTimeout(commands, 60000,port);
	console.log("executeApp----", executeApp);

	codebolt.chat.stopProcess();
	message = await codebolt.chat.waitforReply("This is error " + executeApp.response);
	codebolt.chat.processStarted();
	var BugResponse;
	BugResponse = await Bugfix(markdown, executeApp ?. response, projectPath);
	console.log("BugResponse-----", BugResponse)
	if(BugResponse?.message){
		BugResponse = await Bugfix(markdown, BugResponse?.message, projectPath);
	}
	else {
		codebolt.fs.updateFile('', path.basename(BugResponse.filePath), BugResponse.fixedCode, 'utf-8');
		codebolt.chat.sendMessage("I Have Fix this error of this file " + path.basename(BugResponse.filePath));
		codebolt.chat.stopProcess();
	}

	if(executeApp?.response){
		await execute();
		// await codebolt.terminal.executeCommand(`npx kill-port ${port}`);
	}
}
 function executeWithTimeout(command, timeout, port) {
    return new Promise( (resolve, reject) => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
			codebolt.terminal.executeCommand(`npx kill-port ${port}`);
			codebolt.chat.waitforReply("There are no Error! ");
			codebolt.chat.stopProcess();
			reject('There are no error ');
        }, timeout);

        codebolt.terminal.executeCommandRunUntilError(command)
            .then(result => {
                clearTimeout(timer);
                resolve(result);
            })
            .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
    });
}

(async () => {
	await execute();
})();
