import { getBaseURL } from "@/lib/utils";

const downloadFile = async (jobId: string): Promise<Blob> => {
  const response = await fetch(`${getBaseURL()}/download/${jobId}`);

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }

  return response.blob();
};

interface UseDownloadFileReturns {
  downloadFile: (jobId: string) => Promise<Blob>;
}

const useDownloadFile = (): UseDownloadFileReturns => {
  return {
    downloadFile,
  };
};

export default useDownloadFile;
