import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const OpenAIResponseDisplay = ({ markdownContent }) => {
  return (
    <div style={{ width: '100%' }}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                style={{
                  backgroundColor: '#eee',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}
                {...props}
              >
                {children}
              </code>
            );
          }
        }}
      >
        {markdownContent}
      </Markdown>
    </div>
  );
};

export default OpenAIResponseDisplay;
