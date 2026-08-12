const { spawn } = require('child_process');
const path = require('path');

function runPythonScript(emailSubject, emailBody) {
    return new Promise((resolve, reject) => {
        // Absolute path to the Python detection script inside the Python.Service folder
        const pythonScriptPath = path.join(__dirname, '..', '..', 'Python.Service', 'detect.py');

        // Define any arguments to pass to the Python script
        const args = [emailSubject, emailBody];

        try{
            // Spawn a child process to execute the Python script
            const pythonProcess = spawn('python', [pythonScriptPath, ...args]);

            // Capture the output from the Python script
            let output = '';
            let errorOutput = '';
            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            // Listen for stderr data from the Python process (log it but don't reject yet)
            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
                console.error(`stderr: ${data}`);
            });

            // Listen for the Python process to exit
            pythonProcess.on('close', (code) => {
                console.log(`Child process exited with code ${code}`);
                if (code !== 0) {
                    reject(new Error(errorOutput || `Python script exited with code ${code}`));
                    return;
                }
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
