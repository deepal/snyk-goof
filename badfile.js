// Example vulnerable JavaScript code for testing with Snyk

function processUserInput(userInput) {
  // Vulnerability: Using eval() with unsanitized user input
  eval("console.log(" + userInput + ")");
}

// Example of how a malicious user might exploit this vulnerability
const maliciousInput = "process.mainModule.require('child_process').execSync('rm -rf /')"; // Simulate dangerous command

// Uncommenting the next line would execute the malicious code if the code were run.
// processUserInput(maliciousInput);

function insecureDeserialization(serializedData) {
    // Vulnerability: Insecure deserialization using JSON.parse, which can be dangerous if the serialized data is untrusted.
    try {
        const obj = JSON.parse(serializedData);
        console.log(obj.name); // Example usage, could be more dangerous.
        return obj;
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
}

// Example of potentially malicious serialized data.
const serializedData = '{"constructor": {"prototype": {"isAdmin": true}}, "name": "test"}'; //Prototype pollution.
//insecureDeserialization(serializedData);

function insecureFileRead(filename) {
    //Vulnerability: Path traversal.
    const fs = require('fs');
    try {
        const data = fs.readFileSync(filename, 'utf8');
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}

//Example of malicious file path.
//insecureFileRead("../../../etc/passwd");

function regexDoS(input) {
  //Vulnerability: Regular expression denial of service (ReDoS).
    const regex = /^(a+)+$/;
    if(regex.test(input)){
      console.log("match");
    } else {
      console.log("no match");
    }
}

//Example of malicious input.
//regexDoS("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!");
