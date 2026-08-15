import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, placeholder, disabled }) => {
  return (
    <Editor
      apiKey="no-api-key"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 300,
        menubar: false,
        placeholder: placeholder || '',
        disabled: disabled,
        branding: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount',
        ],
        toolbar:
          'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        content_style: 'body { font-family: "Google Sans", Roboto, Arial, sans-serif; font-size: 14px }',
      }}
    />
  );
};

export default TextEditor;
