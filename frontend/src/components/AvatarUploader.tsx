import React, { useState } from 'react';
import { Button, Input } from 'semantic-ui-react';

interface AvatarUploaderProps {
    onUpload: (file: File) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ onUpload }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div>
            <Input type="file" onChange={handleFileChange} />
            <Button primary onClick={handleUpload}>Upload Avatar</Button>
        </div>
    );
};

export default AvatarUploader;
