const codebolt = require("@codebolt/codeboltjs").default;
const {readFileSync} = require("fs");
const {compile} = require("handlebars");
const path = require("path");
const os = require('os');
const { Bugfix } = require("../bugfix/bugfix")

const CodeRunner = async (markdown) => { // typeof(tree)

	let templatePath = `${__dirname}/prompt.handlebars`;

	const PROMPT = readFileSync(templatePath, "utf-8").trim();
    
	let template = compile(PROMPT);

	let renderedTemplate = template({fullCode: markdown, OS: os.platform()});

	console.log("renderedTemplate----",renderedTemplate);

  const llmresponse = await codebolt.llm.inference(renderedTemplate);
  
  const commandFormat = llmresponse.message.trim().replace(/```/g, '');

  return commandFormat
 
}

module.exports = {
	CodeRunner
};
