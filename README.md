🔍 Audit-AI

Audit-AI is a powerful Next.js application that leverages AI to audit and verify smart contracts. With the help of OpenAI's models, Audit-AI can identify potential issues in your smart contracts, making blockchain development more secure and efficient.

This project also comes with a CLI tool, Audit-AI-CLI, which allows you to perform smart contract audits directly from your terminal.

🚀 Features

Smart Contract Auditing: Automatically detect vulnerabilities in smart contracts using AI.
Easy Integration: Integrates seamlessly with your blockchain projects.
CLI Tool: Use the audit-ai-cli to audit contracts right from your terminal.

📦 Packages

Audit-AI (Next.js App)
Framework: Next.js
Version: 0.1.0
License: MIT
Audit-AI-CLI (NPM Package)
Name: @alexandra2888/audit-ai-cli
Version: 1.0.5
License: MIT

🛠️ Installation

Audit-AI (Next.js App)
Clone the Repository:

```
git clone https://github.com/your-username/audit-ai.git
cd audit-ai
```

Install Dependencies:

```
npm install
```

Run the Development Server:

```
npm run dev
```

Build for Production:

```
npm run build
```

Start the Application:

```
npm start
```


Audit-AI-CLI (NPM Package)
Install via NPM:

```
npm install -g @alexandra2888/audit-ai-cli
```

Usage:

```
auditai check <path-to-your-smart-contract>
```

Example:

```
auditai check contracts/MyContract.sol
```

📚 Usage

Audit-AI (Next.js App)
Upload Your Smart Contract: Use the web interface to upload your smart contract.
Run Audit: Click the "Audit" button to start the AI-driven analysis.
View Results: Review the report generated by the AI, highlighting potential issues in your smart contract.
Audit-AI-CLI
Command-line Auditing: Run audits directly from your terminal using the auditai command.
Simple & Fast: Get quick results and insights into your smart contract's security.

📝 Example

Let's audit a simple smart contract using the CLI:

```
auditai check contracts/SimpleStorage.sol
```

The output will show potential issues or confirm that your contract is secure. The web app offers a more detailed report with suggestions and explanations.

🌟 Contributing

We welcome contributions to Audit-AI! Feel free to submit issues, fork the repository, and send pull requests.

Fork the repo.
Create a new branch.
Make your changes.
Submit a pull request.

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

🙌 Acknowledgments

Powered by OpenAI.
