const { spawn } = require('child_process');

function runPythonScript(emailSubject, emailBody) {
    return new Promise((resolve, reject) => {
        // Define the Python script file path
        const pythonScriptPath = 'lol.py';

        // Define any arguments to pass to the Python script
        const args = [emailSubject, emailBody];

        try{
            // Spawn a child process to execute the Python script
            const pythonProcess = spawn('python', [pythonScriptPath, ...args]);

            // Capture the output from the Python script
            let output = '';
            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            // Listen for stderr data from the Python process
            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                reject(data);
            });

            // Listen for the Python process to exit
            pythonProcess.on('close', (code) => {
                console.log(`Child process exited with code ${code}`);
                console.log('Output:', output);
                resolve(output);
            });
        } catch (error) {
            console.error('Error detecting spam:', error.message);
            reject(error);
        }
    });
}

module.exports = runPythonScript;
