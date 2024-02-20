// Function to push an object with timestamp into the array
export function pushDataToArray(dataArray, newData) {
    const id = new Date().getTime();
  dataArray.push({id,...newData});
}
export function pushDataToArrayTwo(dataArray, newData) {
  dataArray.push({ ...newData});
}

// Function to store the array in localStorage
export function saveArrayToLocalStorage(key, dataArray) {
  localStorage.setItem(key, JSON.stringify(dataArray));
}

// Function to retrieve the array from localStorage
 export function getArrayFromLocalStorage(key) {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
}

