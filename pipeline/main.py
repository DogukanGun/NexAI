# embedder.py

import os
from dotenv import load_dotenv
import weaviate
from weaviate.classes.init import Auth
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader  # Use pypdf instead of PyPDF2
import uuid

# ==== 1. Load environment variables ====
load_dotenv()

WEAVIATE_URL = os.getenv("WEAVIATE_URL")
WEAVIATE_API_KEY = os.getenv("WEAVIATE_API_KEY")  # Optional

if not WEAVIATE_URL:
    raise ValueError("Missing WEAVIATE_URL in environment variables!")

# ==== 2. Initialize Weaviate Client with API Key ====
# Now using Weaviate Client v4
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=WEAVIATE_URL,  # Weaviate URL (change to your URL if different)
    auth_credentials=Auth.api_key(
        WEAVIATE_API_KEY  # Replace with your actual API key
    ),
    headers={'X-OpenAI-Api-key': os.getenv("OPENAI_API_KEY")}
)

# ==== 3. Load Sentence Transformer Model ====
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# ==== 4. Helper: Read and Split PDF into Chunks ====
def read_pdf_chunks(file_path, chunk_size=500):
    reader = PdfReader(file_path)
    full_text = ''
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            full_text += page_text + '\n'
    chunks = [full_text[i:i+chunk_size] for i in range(0, len(full_text), chunk_size)]
    return chunks

# ==== 5. Helper: Embed and Push to Weaviate ====
def embed_and_store(chunks, class_name, extra_metadata=None):
    for text in chunks:
        embedding = model.encode(text)
        data_object = {"text": text}
        if extra_metadata:
            data_object.update(extra_metadata)

        # Create the object in Weaviate using v4 API
        client.collections.get(class_name).data.insert(
            properties=data_object,
            uuid=str(uuid.uuid4()),  # Generate a unique UUID
            vector=embedding  # Store the vector (embedding) for search functionality
        )

# ==== 6. Main Functions ====

# Embed official German Law (free access)
def upload_official_document(pdf_path):
    print(f"Uploading official document: {pdf_path}")
    chunks = read_pdf_chunks(pdf_path)
    embed_and_store(chunks, class_name="GermanLaw")
    print("Upload complete for official document.")

# Embed a Paid User's Personal Document
def upload_user_document(pdf_path, user_id):
    print(f"Uploading document for user: {user_id}")
    chunks = read_pdf_chunks(pdf_path)
    embed_and_store(chunks, class_name="UserFiles", extra_metadata={"user_id": user_id})
    print("Upload complete for user.")

# ==== 7. Example usage (Uncomment to run directly) ====
if __name__ == "__main__":
    try:
        # Upload official document
        upload_official_document("/Users/dogukangundogan/Desktop/Dev/nex_ai_v2/pipeline/a711-arbeitsrecht.pdf")

        # Upload user document
        # upload_user_document("path_to_user_upload.pdf", user_id="user-12345")
    finally:
        # Ensure the connection is properly closed
        client.close()
