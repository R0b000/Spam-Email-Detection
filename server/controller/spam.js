const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runPythonScript(emailSubject, emailBody) {
    return new Promise((resolve, reject) => {
        // Absolute path to the Python detection script inside the Python.Service folder
        const pythonScriptPath = path.join(__dirname, '..', '..', 'Python.Service', 'detect.py');

        console.log('[Python] ---- Python Script Runner ----');
        console.log('[Python] Script path:', pythonScriptPath);
        console.log('[Python] Script exists:', fs.existsSync(pythonScriptPath));
        console.log('[Python] Subject arg:', emailSubject);
        console.log('[Python] Body arg:', emailBody ? emailBody.substring(0, 80) + '...' : '(empty)');

        // Define any arguments to pass to the Python script
        const args = [emailSubject, emailBody];

        try{
            console.log('[Python] Spawning: python', pythonScriptPath);
            const startTime = Date.now();

            // Spawn a child process to execute the Python script
            const pythonProcess = spawn('python', [pythonScriptPath, ...args]);

            console.log('[Python] Process spawned, PID:', pythonProcess.pid);

            // Capture the output from the Python script
            let output = '';
            let errorOutput = '';
            pythonProcess.stdout.on('data', (data) => {
                const chunk = data.toString();
                console.log('[Python stdout]', chunk.trim());
                output += chunk;
            });

            // Listen for stderr data from the Python process (log it but don't reject yet)
            pythonProcess.stderr.on('data', (data) => {
                const chunk = data.toString();
                console.error('[Python stderr]', chunk.trim());
                errorOutput += chunk;
            });

            pythonProcess.on('error', (err) => {
                console.error('[Python] Failed to start process:', err.message);
                console.error('[Python] Is Python installed and in PATH?');
                reject(err);
            });

            // Listen for the Python process to exit
            pythonProcess.on('close', (code) => {
                const elapsed = Date.now() - startTime;
                console.log(`[Python] Process exited with code ${code} (took ${elapsed}ms)`);
                if (code !== 0) {
                    console.error('[Python] FAILED - stderr output:', errorOutput);
                    reject(new Error(errorOutput || `Python script exited with code ${code}`));
                    return;
                }
                console.log('[Python] SUCCESS - full output:', output);
                console.log('[Python] ---- End Python Script Runner ----');
                resolve(output);
            });
        } catch (error) {
            console.error('[Python] Error spawning process:', error.message);
            reject(error);
        }
    });
}

module.exports = runPythonScript;
