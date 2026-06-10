import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export const sanitizeFileName = (name, fallbackName) => {
  try {
    const decodedName = decodeURIComponent(String(name || fallbackName)).split('/').pop();
    const safeName = decodedName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim();
    return safeName || fallbackName;
  } catch {
    return fallbackName;
  }
};

export const getFileNameFromUrl = (url, fallbackName) => {
  const rawName = url?.split('/').pop()?.split('?')[0];
  return sanitizeFileName(rawName, fallbackName);
};

export const getMimeType = (fileName) => {
  const extension = String(fileName || '').split('.').pop()?.toLowerCase();
  const mimeTypes = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    txt: 'text/plain',
    csv: 'text/csv',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  return mimeTypes[extension] || 'application/octet-stream';
};

const ensureDirectory = async (folderName) => {
  const directory = `${FileSystem.documentDirectory}${folderName}/`;
  const directoryInfo = await FileSystem.getInfoAsync(directory);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  }

  return directory;
};

export const downloadFileToAppStorage = async ({
  url,
  fileName,
  fallbackName = `arquivo-${Date.now()}.pdf`,
  folderName = 'downloads',
}) => {
  if (!url) {
    throw new Error('URL do arquivo nao informada.');
  }

  const directory = await ensureDirectory(folderName);
  const safeFileName = sanitizeFileName(fileName, getFileNameFromUrl(url, fallbackName));
  const fileUri = `${directory}${safeFileName}`;
  const result = await FileSystem.downloadAsync(url, fileUri);

  if (result.status && (result.status < 200 || result.status >= 300)) {
    throw new Error(`Download falhou com status ${result.status}`);
  }

  return {
    fileName: safeFileName,
    uri: result.uri,
    platform: Platform.OS,
  };
};

const downloadToCache = async ({ url, fileName }) => {
  const cacheDirectory = `${FileSystem.cacheDirectory}downloads/`;
  const cacheInfo = await FileSystem.getInfoAsync(cacheDirectory);

  if (!cacheInfo.exists) {
    await FileSystem.makeDirectoryAsync(cacheDirectory, { intermediates: true });
  }

  const cacheUri = `${cacheDirectory}${fileName}`;
  const result = await FileSystem.downloadAsync(url, cacheUri);

  if (result.status && (result.status < 200 || result.status >= 300)) {
    throw new Error(`Download falhou com status ${result.status}`);
  }

  return result.uri;
};

const saveWithAndroidStoragePermission = async ({ url, fileName, mimeType }) => {
  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    return {
      cancelled: true,
      platform: Platform.OS,
    };
  }

  const temporaryUri = await downloadToCache({ url, fileName });
  const base64 = await FileSystem.readAsStringAsync(temporaryUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    fileName,
    mimeType
  );

  await FileSystem.StorageAccessFramework.writeAsStringAsync(destinationUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return {
    cancelled: false,
    fileName,
    uri: destinationUri,
    platform: Platform.OS,
  };
};

export const saveFileToDeviceStorage = async ({
  url,
  fileName,
  fallbackName = `arquivo-${Date.now()}.pdf`,
  folderName = 'downloads',
}) => {
  if (!url) {
    throw new Error('URL do arquivo nao informada.');
  }

  const safeFileName = sanitizeFileName(fileName, getFileNameFromUrl(url, fallbackName));
  const mimeType = getMimeType(safeFileName);

  if (Platform.OS === 'android') {
    return await saveWithAndroidStoragePermission({
      url,
      fileName: safeFileName,
      mimeType,
    });
  }

  return await downloadFileToAppStorage({
    url,
    fileName: safeFileName,
    fallbackName,
    folderName,
  });
};
