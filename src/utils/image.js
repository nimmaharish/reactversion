import Snackbar from 'services/snackbar';
import compressor from 'browser-image-compression';
import { inParallelWithLimit } from 'utils/parallel';

/**
 * @param {File} file
 * @param {Number} size
 * @param {Number} maxWidthOrHeight
 * @param {Function} onProgress
 * @returns {Promise<File>}
 */
export async function compressImage(file, size = 10, maxWidthOrHeight = 8192, onProgress = undefined) {
  const compressed = await compressor(file, {
    maxSizeMB: size,
    maxWidthOrHeight,
    useWebWorker: true,
    maxIterations: 2,
    onProgress,
  });

  return new File([compressed], file.name);
}

const compressionSet = new Set(['jpg', 'jpeg', 'png']);
const videoCompressionSet = new Set(['mp4', 'mov']);
const allSet = new Set([...compressionSet, ...videoCompressionSet]);

export async function compressImages(files, size, maxWidthOrHeight, onProgress) {
  const notAllowed = [];
  // eslint-disable-next-line array-callback-return
  files.map((file) => {
    const ext = file.name.toLowerCase().split('.').pop().toLowerCase();
    const size = Math.round((file?.size / (1024 * 1024)));
    if (compressionSet.has(ext)) {
      if (size > 5) {
        file.ext = ext;
        notAllowed.push(file);
        return;
      }
    }
    if (videoCompressionSet.has(ext)) {
      if (size > 50) {
        file.ext = ext;
        notAllowed.push(file);
        return;
      }
    }
    if (!allSet.has(ext)) {
      file.ext = ext;
      notAllowed.push(file);
    }
  });

  if (notAllowed.length > 0) {
    if (compressionSet.has(notAllowed[0].ext)) {
      Snackbar.show(`${notAllowed[0].name} is too big! Max 5 Mb allowed`, 'error');
    }
    if (videoCompressionSet.has(notAllowed[0].ext)) {
      Snackbar.show(`${notAllowed[0].name} is too big! Max 50 Mb allowed`, 'error');
    }
    if (!allSet.has(notAllowed[0].ext)) {
      Snackbar.show(`${notAllowed[0].name} is not supported!`, 'error');
    }
  }

  const list = Array.isArray(files) ? files : [files];
  const fileMap = list.reduce((acc, file) => {
    const ext = file.name.toLowerCase().split('.').pop().toLowerCase();
    acc[compressionSet.has(ext) ? 'yes' : 'no'].push(file);
    return acc;
  }, { yes: [], no: [] });

  const compressedFiles = await inParallelWithLimit(
    fileMap.yes,
    2,
    (file) => compressImage(file, size, maxWidthOrHeight, onProgress),
  );

  const finalList = [...compressedFiles, ...fileMap.no];

  return Array.isArray(files) ? finalList : finalList[0];
}
