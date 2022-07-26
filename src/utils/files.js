import Snackbar from 'services/snackbar';

export function validateFiles(files) {
  const notAllowed = [];
  files.find((file) => {
    const ext = file.name.toLowerCase().split('.').pop().toLowerCase();
    const size = Math.round((file?.size / (1024 * 1024)));
    if (size > 50) {
      file.ext = ext;
      notAllowed.push(file);
    }
    return null;
  });

  if (notAllowed.length > 0) {
    Snackbar.show(`${notAllowed[0].name} is too big! Max 50 Mb allowed`, 'error');
    return [];
  }

  return files;
}
