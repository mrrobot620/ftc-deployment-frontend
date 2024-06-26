import { useState } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-uploader";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
    </>
  );
};

const FileUploaderTest = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [showAlert, setShowAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [uploading, setUploading] = useState(false); 

  const dropZoneConfig = {
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
  };

  const handleUpload = async () => {
    if (files && files.length > 0 && !uploading) {
      setUploading(true); // Set uploading to true when starting upload

      const formData = new FormData();
      formData.append("file", files[0]);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_URL}/upload_users`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const responseMessage = await response.json();
          const message = responseMessage["message"];
          setShowAlert({ isOpen: true, title: "Success", message: message });
        } else {
          const errorMessage = await response.json();
          const error_message = errorMessage["error"];
          setShowAlert({ isOpen: true, title: "Error", message: error_message });
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false); 
      }
    }
  };

  return (
    <>
      <div>
        <FileUploader
          value={files}
          onValueChange={setFiles}
          dropzoneOptions={dropZoneConfig}
          className="relative bg-background rounded-lg p-2"
        >
          <FileInput className="outline-dashed outline-1 outline-white">
            <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
              <FileSvgDraw />
            </div>
          </FileInput>
          <FileUploaderContent>
            {files &&
              files.length > 0 &&
              files.map((file, i) => (
                <FileUploaderItem key={i} index={i}>
                  <Paperclip className="h-4 w-4 stroke-current" />
                  <span>{file.name}</span>
                </FileUploaderItem>
              ))}
          </FileUploaderContent>
        </FileUploader>
        <div className="flex justify-between pt-8">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="relative"
          >
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.447l4.243 4.243-1.414 1.414-4.243-4.243-4.243 4.243-1.414-1.414 4.243-4.243H4.472a7.963 7.963 0 014.258-1.181zM20 12c0-4.418-3.582-8-8-8v4c2.21 0 4 1.79 4 4h4zm-8 8c4.418 0 8-3.582 8-8h-4c0 2.21-1.79 4-4 4v4z"
                  ></path>
                </svg>
              </span>
            )}
            {uploading ? "" : "Upload"}
          </Button>
        </div>
      </div>
      <AlertDialog open={showAlert.isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{showAlert.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{showAlert.message}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() =>
                setShowAlert({ ...showAlert, isOpen: false })
              }
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileUploaderTest;
