import React, { useState, useEffect } from 'react';
import nlp from 'compromise'; // Import 'compromise' library here

const preprocessEmailContent = (content) => {
    let preprocessedText = content.toLowerCase();
    const tokens = nlp.tokenize(preprocessedText).out('array');

    const stopwords = ["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", "with"];
    const filteredTokens = tokens.filter(token => !stopwords.includes(token));

    const stemmedTokens = filteredTokens.map(token => nlp(token).normalize().out('root'));

    preprocessedText = stemmedTokens.join(' ');

    return preprocessedText;
};

const Spam = ({ emailBody }) => {
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

    if (!nlpLoaded) {
        return null; // Return null or loading indicator while waiting for 'compromise' library to load
    }

    const preprocessEmailContent = (content) => {
        let preprocessedText = content.toLowerCase();
        const tokens = nlp.tokenize(preprocessedText).out('array');

        const stopwords = ["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", "with"];
        const filteredTokens = tokens.filter(token => !stopwords.includes(token));

        const stemmedTokens = filteredTokens.map(token => nlp(token).normalize().out('root'));

        preprocessedText = stemmedTokens.join(' ');

        return preprocessedText;
    };

    return null; // Return null or loading indicator while waiting for 'compromise' library to load
};

export default Spam;
