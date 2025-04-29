import RewardsManager from './RewardsManager';

// Simulated user profile object
let user = {
  name: 'Isaiah',
  points: 0
};

const rewards = new RewardsManager(user);

// Simulated photo upload function
function uploadPhoto(photoFile) {
  console.log(`Uploading photo: ${photoFile.name}`);

  // Simulate success response from a server or upload handler
  setTimeout(() => {
    console.log('Photo uploaded successfully.');

    // Award points for uploading a photo
    const totalPoints = rewards.addPoints('photo_upload');
    console.log(`User now has ${totalPoints} points.`);

  }, 1000); // Simulated upload delay
}

// Example usage
const fakePhoto = { name: 'landmark.jpg' };
uploadPhoto(fakePhoto);
