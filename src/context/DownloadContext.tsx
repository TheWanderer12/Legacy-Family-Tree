import { createContext, useContext, useState, ReactNode } from "react";

interface DownloadContextType {
  handleDownload?: () => void;
  setDownloadFunction: (fn?: () => void) => void;
}

const DownloadContext = createContext<DownloadContextType | undefined>(
  undefined
);

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error("useDownload must be used within a DownloadProvider");
  }
  return context;
};

export const DownloadProvider = ({ children }: { children: ReactNode }) => {
  const [handleDownload, setHandleDownload] = useState<
    (() => void) | undefined
  >(undefined);

  return (
    <DownloadContext.Provider
      value={{ handleDownload, setDownloadFunction: setHandleDownload }}
    >
      {children}
    </DownloadContext.Provider>
  );
};
