import React, { useEffect, useState } from 'react';
import nlp from 'compromise';

interface SpamProps {
  emailBody: string;
}

const stopwords = [
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has',
  'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was',
  'were', 'will', 'with',
];

const preprocessEmailContent = (content: string): string => {
  let preprocessedText = content.toLowerCase();
  const tokens = nlp.tokenize(preprocessedText).out('array');

  const filteredTokens = tokens.filter((token: string) => !stopwords.includes(token));
  const stemmedTokens = filteredTokens.map((token: string) => nlp(token).normalize().out('root'));

  preprocessedText = stemmedTokens.join(' ');
  return preprocessedText;
};

const Spam = ({ emailBody }: SpamProps) => {
  const [nlpLoaded, setNlpLoaded] = useState(false);

  useEffect(() => {
    // Load the 'compromise' library asynchronously
    const loadNlp = async () => {
      try {
        await import('compromise');
        setNlpLoaded(true);
      } catch (error) {
        console.error('Error loading compromise library:', error);
      }
    };

    loadNlp();
  }, []);

  if (!nlpLoaded || !emailBody) {
    return null; // Return null or loading indicator while waiting for 'compromise' library to load
  }

  const processed = preprocessEmailContent(emailBody);
  return <span>{processed}</span>;
};

export default Spam;