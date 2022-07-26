import { useEffect, useState } from 'react';
import SnackBar from 'services/snackbar';
import isImage from 'is-image';
import isVideo from 'is-video';

const MAX_SIZE = 50 * 1024 * 1024;

export async function readFile(file) {
  return new Promise(((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = () => {
      reject(new Error('unable to read file'));
    };
    reader.readAsDataURL(file);
  }));
}

export function useIsImage(file) {
  return isImage(file.name);
}

export function useIsVideo(file) {
  return isVideo(file.name);
}

export function useFileType(file) {
  if (file.size > MAX_SIZE) {
    return 'other';
  }
  if (isImage(file.name)) {
    return 'image';
  }
  if (isVideo(file.name)) {
    return 'video';
  }
  return 'other';
}

export function useFile(file) {
  const [data, setData] = useState(null);
  const type = useFileType(file);

  const refresh = async () => {
    try {
      if (['image', 'video'].includes(type)) {
        setData(await readFile(file));
      }
    } catch (e) {
      SnackBar.showError(e);
    }
  };

  useEffect(() => {
    refresh();
  }, [file.name]);

  return [data, type, refresh];
}
