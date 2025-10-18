import React from 'react';

/**
 * Debug component to log image URLs and paths
 */
const ImageDebugger = ({ artistProfile }) => {
    if (!artistProfile) return null;

    console.log('🔍 Image Debug Info:');
    console.log('Raw avatar from DB:', artistProfile.avatarUrl);
    console.log('Raw cover from DB:', artistProfile.coverImageUrl);
    console.log('Processed avatar URL:', artistProfile.avatar);
    console.log('Processed cover URL:', artistProfile.coverImage);

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
            <h4 className="font-bold mb-2">🔍 Image Debug</h4>
            <div className="space-y-1">
                <div><strong>Avatar Raw:</strong> {artistProfile.avatarUrl || 'null'}</div>
                <div><strong>Avatar Processed:</strong> {artistProfile.avatar || 'null'}</div>
                <div><strong>Cover Raw:</strong> {artistProfile.coverImageUrl || 'null'}</div>
                <div><strong>Cover Processed:</strong> {artistProfile.coverImage || 'null'}</div>
            </div>
        </div>
    );
};

export default ImageDebugger;
