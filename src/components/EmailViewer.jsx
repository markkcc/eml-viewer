import { useState, useEffect } from 'react';
import MimeParser from 'emailjs-mime-parser';
import DOMPurify from 'dompurify';
import '../styles/EmailViewer.css';

const EmailViewer = ({ emailData }) => {
  const [parsedEmail, setParsedEmail] = useState(null);
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    if (emailData) {
      try {
        const parsed = new MimeParser(emailData);
        setParsedEmail(parsed);
      } catch (error) {
        console.error('Error parsing email:', error);
      }
    }
  }, [emailData]);

  useEffect(() => {
    if (!parsedEmail) return;

    // Find HTML body
    let htmlBody = '';
    let textBody = '';

    const findBody = (node) => {
      if (node.contentType && node.contentType.value.indexOf('text/html') === 0) {
        htmlBody = node.content;
      } else if (node.contentType && node.contentType.value.indexOf('text/plain') === 0) {
        textBody = node.content;
      }

      if (node.childNodes) {
        node.childNodes.forEach(child => findBody(child));
      }
    };

    findBody(parsedEmail);

    // Convert buffer or array to string if needed
    const convertToString = (content) => {
      if (!content) return '';
      
      // If it's already a string, return it
      if (typeof content === 'string') return content;
      
      // If it's an array or buffer, convert to string
      if (Array.isArray(content) || (content instanceof Uint8Array) || Buffer.isBuffer(content)) {
        try {
          // Try to convert from UTF-8
          return new TextDecoder('utf-8').decode(
            content instanceof Uint8Array ? content : new Uint8Array(content)
          );
        } catch (e) {
          console.error('Error decoding content:', e);
          // Fallback: try to convert directly to string
          return String.fromCharCode.apply(null, content);
        }
      }
      
      // Last resort, try direct string conversion
      return String(content);
    };

    if (htmlBody) {
      // Convert htmlBody to string if it's not already
      const htmlString = convertToString(htmlBody);
      
      // Configure DOMPurify to allow more content
      const clean = DOMPurify.sanitize(htmlString, { 
        ADD_ATTR: ['target', 'src', 'href', 'srcset', 'style'],
        ADD_TAGS: ['link', 'script'],
        ALLOW_UNKNOWN_PROTOCOLS: true,
        WHOLE_DOCUMENT: true,
        RETURN_DOM_FRAGMENT: false,
        RETURN_DOM: false
      });
      
      // Add a base target to make links open in a new tab by default
      const htmlWithBase = `
        <base target="_blank">
        ${clean}
      `;
      setSanitizedHtml(htmlWithBase);
    } else if (textBody) {
      // Convert textBody to string if needed
      const textString = convertToString(textBody);
      // If only text is available, convert it to basic HTML
      setSanitizedHtml(`<pre style="white-space: pre-wrap; font-family: monospace;">${textString}</pre>`);
    }
  }, [parsedEmail]);

  if (!parsedEmail) {
    return null;
  }

  // Format address field (handle both string and object formats)
  const formatAddress = (address) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    
    // Handle case where address is an object with name and address properties
    if (address.name && address.address) {
      return address.name ? `${address.name} <${address.address}>` : address.address;
    }

    // Special case for when address only has address property (common in some email formats)
    if (address.address) {
      return address.address;
    }
    
    // Handle array of addresses
    if (Array.isArray(address)) {
      return address.map(addr => formatAddress(addr)).join(', ');
    }
    
    // Debug output to console to see format of problematic address objects
    console.log('Address object format:', JSON.stringify(address));
    
    // Fallback to string representation
    return String(address);
  };

  // Extract header information
  const from = parsedEmail.headers.from && formatAddress(parsedEmail.headers.from[0].value);
  const to = parsedEmail.headers.to && formatAddress(parsedEmail.headers.to[0].value);
  const subject = parsedEmail.headers.subject && parsedEmail.headers.subject[0].value;
  const date = parsedEmail.headers.date && parsedEmail.headers.date[0].value;

  return (
    <div className="email-viewer">
      <div className="email-header">
        <div className="header-row">
          <span className="header-label">From:</span>
          <span className="header-value">{from}</span>
        </div>
        <div className="header-row">
          <span className="header-label">To:</span>
          <span className="header-value">{to}</span>
        </div>
        <div className="header-row">
          <span className="header-label">Subject:</span>
          <span className="header-value">{subject}</span>
        </div>
        <div className="header-row">
          <span className="header-label">Date:</span>
          <span className="header-value">{date}</span>
        </div>
      </div>
      <div className="email-content">
        {sanitizedHtml ? (
          <iframe 
            srcDoc={sanitizedHtml} 
            title="Email Content" 
            className="email-iframe"
            sandbox="allow-scripts allow-popups allow-forms allow-modals allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="email-loading">Loading email content...</div>
        )}
      </div>
    </div>
  );
};

export default EmailViewer; 