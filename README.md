# EML Viewer

A simple, client-side application for previewing `.eml` email files. This application allows users to inspect how emails would render in email clients.

## Features

- Drag and drop interface for `.eml` files
- Display of email header information (From, To, Subject, Date)
- Rendering of email content (HTML or plain text)
- Client-side only - no data is sent to any server
- DOMPurify on input

## Warning

⚠️ **Do not open `.eml` files from untrusted sources!** Email files can contain malicious content.

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Open the application in your browser
2. Drag and drop an `.eml` file onto the drop area
3. View the email header information and content
4. Click "Upload another file" to view a different email

## Technologies

- React
- Vite
- emailjs-mime-parser
- DOMPurify (for sanitizing HTML content)

## License

MIT
