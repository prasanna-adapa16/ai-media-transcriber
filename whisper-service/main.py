from fastapi import FastAPI, UploadFile, File, HTTPException
from faster_whisper import WhisperModel
import tempfile
import os


app = FastAPI(
    title="AI Media Whisper Service",
    version="1.0.0"
)


# Load Whisper model once when the service starts.
#
# "small" provides better accuracy than "base"
# while still being practical to run on CPU.
model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "Whisper Transcription Service"
    }


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):

    # --------------------------------------------------
    # 1. Validate file name
    # --------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required"
        )


    # --------------------------------------------------
    # 2. Supported audio formats
    # --------------------------------------------------
    #
    # Spring Boot + FFmpeg handles video files.
    # Whisper receives audio files here.
    #

    allowed_extensions = {
        ".wav",
        ".mp3",
        ".m4a",
        ".aac",
        ".flac",
        ".ogg",
        ".opus"
    }


    extension = os.path.splitext(
        file.filename
    )[1].lower()


    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported audio format. "
                "Supported formats: WAV, MP3, M4A, AAC, "
                "FLAC, OGG and OPUS."
            )
        )


    temp_path = None


    try:

        # --------------------------------------------------
        # 3. Save uploaded audio temporarily
        # --------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:

            temp_path = temp_file.name

            content = await file.read()

            if not content:
                raise HTTPException(
                    status_code=400,
                    detail="Uploaded file is empty"
                )

            temp_file.write(content)


        # --------------------------------------------------
        # 4. Transcribe using Whisper
        # --------------------------------------------------
        #
        # language=None:
        # Whisper automatically detects the language.
        #
        # beam_size=5:
        # Improves decoding quality.
        #
        # vad_filter=True:
        # Helps ignore silence/non-speech portions.
        #
        # condition_on_previous_text=True:
        # Helps maintain context between segments.
        #
        # temperature=0:
        # Makes the result more deterministic.
        #

        segments, info = model.transcribe(
            temp_path,
            language=None,
            beam_size=5,
            temperature=0.0,
            vad_filter=True,
            condition_on_previous_text=True
        )


        # --------------------------------------------------
        # 5. Combine Whisper segments
        # --------------------------------------------------

        transcript_parts = []


        for segment in segments:

            text = segment.text.strip()

            if text:
                transcript_parts.append(text)


        transcript = " ".join(
            transcript_parts
        ).strip()


        # --------------------------------------------------
        # 6. Handle empty transcription
        # --------------------------------------------------

        if not transcript:

            raise HTTPException(
                status_code=422,
                detail=(
                    "No speech could be detected "
                    "in the uploaded audio."
                )
            )


        # --------------------------------------------------
        # 7. Return transcription result
        # --------------------------------------------------

        return {
            "filename": file.filename,
            "language": info.language,
            "language_probability": info.language_probability,
            "transcript": transcript
        }


    except HTTPException:
        raise


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )


    finally:

        # --------------------------------------------------
        # 8. Delete temporary audio file
        # --------------------------------------------------

        if temp_path and os.path.exists(temp_path):

            try:
                os.remove(temp_path)

            except OSError:
                pass