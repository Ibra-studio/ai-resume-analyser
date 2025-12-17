import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";

function Upload() {
  const [isProcessing, setisProcessing] = useState(false);
  const [statusText, setstatusText] = useState("");
  const [file, setfile] = useState<File | null>(null);

  function HandleFileSelect(file: File | null) {
    setfile(file);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name");
    const jobTitle = formData.get("job-title");
    const jobDescription = formData.get("job-description");

    console.log({ companyName, jobDescription, jobTitle });
  }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" alt="" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an Ats score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="company-name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="job-title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job title</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="job-description"
                  id="job-description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <div className="w-full">
                  <FileUploader onFileSelect={HandleFileSelect} />
                </div>
              </div>

              <button className="primary-button" type="submit">
                Analyse resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default Upload;
