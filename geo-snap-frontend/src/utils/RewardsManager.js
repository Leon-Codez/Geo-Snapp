export default class RewardsManager {
  constructor(userProfile) {
    this.userProfile = userProfile; // Contains user info including points
  }

  addPoints(activityType) {
    let points = 0;

    switch (activityType) {
      case 'photo_upload':
        points = 10;
        break;
      case 'location_visited':
        points = 15;
        break;
      case 'landmark_unlocked':
        points = 20;
        break;
      default:
        points = 0;
    }

    this.userProfile.points = (this.userProfile.points || 0) + points;
    console.log(`Added ${points} points for ${activityType}`);
    return this.userProfile.points;
  }

  getPoints() {
    return this.userProfile.points || 0;
  }
}
