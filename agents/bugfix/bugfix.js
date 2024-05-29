const codebolt = require("@codebolt/codeboltjs").default;
const {readFileSync} = require("fs");
const {compile} = require("handlebars");
const path = require("path");
const os = require('os');
// const {CodeRunner} = require("../runner/runner")

const Bugfix = async(markdown , OccureError, projectPath)=> {

    let templatePath = `${__dirname}/prompt.handlebars`;
	const PROMPT = readFileSync(templatePath, "utf-8").trim();
	let template = compile(PROMPT);    
    
	let renderedTemplate = template({errorMsg: OccureError, markdown: markdown });
	const llmresponse = await codebolt.llm.inference(renderedTemplate);
	try {
		const jsonStartIndex = llmresponse.message.indexOf('{');
		const jsonEndIndex = llmresponse.message.lastIndexOf('}');
	
		if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
			const jsonString = llmresponse.message.substring(jsonStartIndex, jsonEndIndex + 1).trim();
			const jsonData = JSON.parse(jsonString);
			console.log('Parsed JSON data:', jsonData);
			return jsonData;
		} else {
			return llmresponse;
			throw new Error('JSON data not found in response message');
			
		}
	} catch (error) {
		// console.error('Error handling llmresponse:', error);
		return llmresponse;
		}
}

module.exports = {
	Bugfix
};
