// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api');
    if (response.ok) {
      console.log('✅ Backend is running');
      return true;
    } else {
      console.error('❌ Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Cannot connect to backend:', error.message);
    return false;
  }
};

// Call this function to test connection
if (process.env.NODE_ENV === 'development') {
  testBackendConnection();
}