import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface JointConfig {
  height: number;
  width: number;
  skeleton: Array<{
    loc: [number, number];
    name: string;
    parent: string | null; 
  }>;
}

interface GenerateArtifactsParams {
  boundingBox: BoundingBox;
  croppedImage: string;
  maskImage: string; // Base64 encoded PNG
  jointConfig: JointConfig;
  outputNumber: number;
}

export async function generateArtifacts({
  boundingBox,
  croppedImage,
  maskImage,
  jointConfig,
  outputNumber
}: GenerateArtifactsParams): Promise<void> {
  const response = await fetch('/api/generate-artifacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      boundingBox,
      croppedImage,
      maskImage,
      jointConfig,
      outputNumber
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate artifacts');
  }
} 