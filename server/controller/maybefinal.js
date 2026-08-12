const runPythonScript = require('./lol.js');

// Example usage
const emailSubject = 'hi';
const emailBody = 'hi';

runPythonScript(emailSubject, emailBody)
    .then((output) => {
        console.log('Python script output:', output);
    })
    .catch((error) => {
        console.error('Error running Python script:', error);
    });
