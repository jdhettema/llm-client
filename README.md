# LLM Client

A modern React-based front-end application for interacting with large language models through a secure, role-based API.

---

## Overview

This client application provides an intuitive interface for communicating with large language models through a secure backend service. It features user authentication, conversation management, and a responsive chat interface with markdown rendering.

---

## Features

- **User Authentication**: Secure login system with role-based access control  
- **Conversation Management**: Create, switch between, and delete conversations  
- **Real-time Chat Interface**: Intuitive messaging UI with typing indicators  
- **Markdown Support**: Rich text formatting with code syntax highlighting  
- **Responsive Design**: Works on desktop and mobile devices  
- **Role-Based Permissions**: Different access levels based on user roles  

---

## Prerequisites

- Node.js (v16 or higher)  
- npm or yarn  
- Access to the LLM server API  

---

## Installation

**Clone the repository:**

```bash
git clone https://github.com/jdhettema/llm-client.git
cd llm-client

**Install dependencies:**

npm install
# or
yarn install

**Create a .env file in the root directory with the following variables:**

VITE_API_URL=http://localhost:3000

**Create a .env file in the root directory using .env.example as a template:**

**Start the development server:**

npm run dev
# or
yarn dev

**Open your browser and navigate to http://localhost:5173**

##Usage

**Authentication**

Navigate to the login page
Enter your credentials
Upon successful login, you'll be redirected to the home page

**Creating a New Conversation**

Click the "New Conversation" button in the sidebar
Start chatting with the LLM in the input box at the bottom of the screen
Your conversation will be automatically saved

**Managing Conversations**

Switch Conversations: Click on any conversation in the sidebar
Delete Conversations: Click the delete icon next to a conversation title

Settings

Access application settings by clicking the "Settings" link in the sidebar footer.

## Project Structure

src/
├── assets/         # Static assets
├── components/     # Reusable UI components
│   ├── auth/       # Authentication components
│   ├── common/     # Shared UI elements
│   └── llm/        # LLM-specific components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Application pages
├── services/       # API service integrations
├── App.jsx         # Main application component
└── main.jsx        # Application entry point

## Key Components

MainLayout: Controls the overall application layout
Sidebar: Manages conversation listing and navigation
ChatPage: Handles the chat interface
PromptForm: Input form for sending prompts to the LLM
ChatHistory: Renders conversation messages with markdown support

## Development
Adding New Features

Create new components in the appropriate directory
Update the relevant context providers if needed
Add routes in App.jsx for new pages

## API Integration
The application communicates with the LLM server through services defined in src/services/:

api.js: Base API configuration
authService.js: Authentication-related API calls
llmService.js: LLM-related API calls

## Troubleshooting

Authentication Issues: Check that your credentials are correct and that the server is properly configured
Chat Not Displaying: Verify that you have permissions to access the LLM features
Server Connection Errors: Ensure the LLM server is running and the API URL is correctly set

## Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.

This README provides a comprehensive overview of your client application, including its features, installation instructions, usage guidelines, project structure, and development notes. Feel free to customize it further based on specific details of your implementation!RetryJH

