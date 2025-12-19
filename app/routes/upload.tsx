import { prepareInstructions } from "constants/index";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import generateUUID from "~/lib/utils/generateUUID";

function Upload() {
  const { auth, isLoading, fs, ai, kv } = usePuterStore(); // ks key value storage functions
  const navigate = useNavigate();
  const [isProcessing, setisProcessing] = useState(false);
  const [statusText, setstatusText] = useState("");
  const [file, setfile] = useState<File | null>(null);

  function HandleFileSelect(file: File | null) {
    setfile(file);
  }

  async function handleAnalyse({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) {
    setisProcessing(true);
    setstatusText("uploading the file ...");

    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile)
      return setstatusText(" Error: Failed to upload the file");

    setstatusText(" Converting to image ...");

    const imageFile = await convertPdfToImage(file);

    if (!imageFile.file)
      return setstatusText(" Error : Failed to convert PDF to Image");

    setstatusText(" uploading the image");

    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage)
      return setstatusText(" Error: Failed to upload the image");

    setstatusText(" Preparing data ...");

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobDescription,
      jobTitle,
      feedBack: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setstatusText(" Analysing ...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback) return setstatusText("Error : failed to analyse resume ...");

    const feedBackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedBack = JSON.parse(feedBackText);

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setstatusText(" Analysis complete , redirecting ..");
    console.log(data);
    navigate(`/resume/${uuid}`);
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) return;
    handleAnalyse({ companyName, jobDescription, jobTitle, file });

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
