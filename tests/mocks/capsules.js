// Mocked locked capsule
export const lockedCapsule = {
  id: 'locked-capsule-1',
  name: 'Locked Capsule 1',
  unlocked: false,
  unlockAt: 'Dec 25, 2025',
  createdAt: 'Aug 10, 2025',
  color: '#FF6B6B',
  icon: '☀️',
  daysLeftCount: 30,
  imageCount: 5,
  videoCount: 2,
  messageCount: 3
};

// Mocked unlocked capsule
export const unlockedCapsule = {
  id: 'unlocked-capsule-1',
  name: 'Unlocked Capsule 1',
  unlocked: true,
  unlockAt: 'Aug 20, 2025',
  createdAt: 'Aug 10, 2025',
  color: '#4ECDC4',
  icon: '🎉',
  daysLeftCount: 0,
  imageCount: 10,
  videoCount: 1,
  messageCount: 2
};

// Mocked capsule content
export const capsuleContent = {
  messages: [
    { id: 1, message: 'Test message number 1' },
    { id: 2, message: 'Test message number 2' }
  ],
  capsule_media: [
    {
      id: 1,
      path: 'video.mp4',
      type: 'video/mp4',
      fileSize: 5242880, // 5MB in bytes
      duration: 30000, // 30s in milliseconds
      fileUrl: ''
    },
    {
      id: 2,
      path: 'image.jpg',
      type: 'image/jpeg',
      fileSize: 2097152, // 2MB in bytes
      fileUrl: ''
    }
  ]
};

// Mocked empty capsule content
export const emptyCapsuleContent = {
  messages: [],
  capsule_media: []
};

