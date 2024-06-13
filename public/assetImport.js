export let assetData = {};

export function fetchAssets() {
  return fetch('/assets')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch game assets');
      }
      return response.json();
    })
    .then(data => {
      assetData = data;
      console.log(assetData);
      return assetData; 
    })
    .catch(error => {
      console.error('Error fetching game assets:', error);
    });
}
