// Utility to clean up location-related data from localStorage
const cleanupLocationData = () => {
  try {
    localStorage.removeItem('userLocation');
    localStorage.removeItem('locationPermission');
    console.log('✅ Location data cleaned up from localStorage');
  } catch (error) {
    console.error('❌ Error cleaning up location data:', error);
  }
};

// Auto-run cleanup when this file is imported
cleanupLocationData();

export default cleanupLocationData;