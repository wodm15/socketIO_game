export let assetData = {}; 

fetch('/assets')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch game assets');
    }
    return response.json(); 
  })
  .then(data => {
    assetData = data;
  })
  .catch(error => {
    console.error('Error fetching game assets:', error);
  });
