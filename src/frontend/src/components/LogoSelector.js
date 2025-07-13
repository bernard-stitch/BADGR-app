import React, { useState, useCallback } from 'react';
import {
  Card,
  Text,
  Button,
  Stack,
  Thumbnail,
  Banner,
  DropZone,
  LegacyStack,
  Caption,
} from '@shopify/polaris';

function LogoSelector({ value, onChange, label = "Widget Logo" }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(value || null);

  const handleDropZoneDrop = useCallback((droppedFiles) => {
    setError(null);
    
    // Validate file
    const file = droppedFiles[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, GIF, SVG)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    setFiles(droppedFiles);
    
    // Call parent onChange
    if (onChange) {
      onChange(file, imageUrl);
    }
  }, [onChange]);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setPreviewUrl(null);
    setError(null);
    if (onChange) {
      onChange(null, null);
    }
  }, [onChange]);

  const fileUpload = !files.length && (
    <DropZone.FileUpload
      actionTitle="Upload logo"
      actionHint="Accepts JPG, PNG, GIF, and SVG files up to 5MB"
    />
  );

  const uploadedFile = files.length > 0 && (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <LegacyStack vertical spacing="tight">
        <Thumbnail
          size="large"
          alt={files[0].name}
          source={previewUrl}
        />
        <div>
          <Text variant="bodySm" as="p">
            {files[0].name}
          </Text>
          <Caption>
            {(files[0].size / 1024).toFixed(1)} KB
          </Caption>
        </div>
        <Button
          size="slim"
          onClick={handleRemove}
        >
          Remove
        </Button>
      </LegacyStack>
    </div>
  );

  const existingPreview = !files.length && previewUrl && (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <LegacyStack vertical spacing="tight">
        <Thumbnail
          size="large"
          alt="Current logo"
          source={previewUrl}
        />
        <div>
          <Text variant="bodySm" as="p">
            Current logo
          </Text>
        </div>
        <Button
          size="slim"
          onClick={handleRemove}
        >
          Remove
        </Button>
      </LegacyStack>
    </div>
  );

  return (
    <Card>
      <div style={{ padding: '20px' }}>
        <LegacyStack vertical spacing="tight">
          <Text variant="headingMd" as="h3">
            {label}
          </Text>
          
          {error && (
            <Banner status="critical" title="Upload Error">
              <p>{error}</p>
            </Banner>
          )}
          
          <DropZone
            onDrop={handleDropZoneDrop}
            accept="image/*"
            type="image"
            allowMultiple={false}
          >
            {uploadedFile}
            {existingPreview}
            {fileUpload}
          </DropZone>
          
          <div style={{ marginTop: '8px' }}>
            <Caption>
              Recommended size: 200x60px. Supports JPG, PNG, GIF, and SVG formats.
            </Caption>
          </div>
        </LegacyStack>
      </div>
    </Card>
  );
}

export default LogoSelector; 