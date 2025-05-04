# embedder.py

import os
import uuid
from dotenv import load_dotenv
from typing import List, Optional

import weaviate
from weaviate.classes.init import Auth
from pypdf import PdfReader
import re

# ==== 1. Load environment variables ====
load_dotenv()

WEAVIATE_URL = os.getenv("WEAVIATE_URL")
WEAVIATE_API_KEY = os.getenv("WEAVIATE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not WEAVIATE_URL:
    raise ValueError("Missing WEAVIATE_URL in environment variables!")
if not WEAVIATE_API_KEY:
    raise ValueError("Missing WEAVIATE_API_KEY in environment variables!")
if not OPENAI_API_KEY:
    raise ValueError("Missing OPENAI_API_KEY in environment variables!")

# ==== 2. Initialize Weaviate Client ====
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=WEAVIATE_URL,
    auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    headers={'X-OpenAI-Api-Key': OPENAI_API_KEY}
)

# ==== 3. Helper: Extract and split PDF text ====
def extract_clean_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    all_text = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            clean = re.sub(r'\s+', ' ', text)  # Normalize whitespace
            all_text.append(clean.strip())
    return "\n".join(all_text)

def split_into_chunks(text: str, chunk_size: int = 1500, overlap: int = 150) -> List[str]:
    """Split text into chunks with increased chunk size for OpenAI embeddings"""
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks, chunk = [], ""
    for sentence in sentences:
        if len(chunk) + len(sentence) <= chunk_size:
            chunk += sentence + " "
        else:
            chunks.append(chunk.strip())
            chunk = sentence + " "
    if chunk:
        chunks.append(chunk.strip())
    return chunks

# ==== 5. Storing (no need to manually embed) ====
def store_chunks(chunks: List[str], class_name: str, metadata: Optional[dict] = None):
    """Store text chunks in Weaviate - vectorization is handled by the text2vec-openai module"""
    for chunk in chunks:
        data_object = {"text": chunk}
        if metadata:
            data_object.update(metadata)
        client.collections.get(class_name).data.insert(
            properties=data_object,
            uuid=str(uuid.uuid4())
        )

# ==== 6. Process PDF wrapper ====
def process_pdf(pdf_path: str, class_name: str, metadata: Optional[dict] = None):
    print(f"Processing PDF: {pdf_path}")
    text = extract_clean_text_from_pdf(pdf_path)
    chunks = split_into_chunks(text)
    store_chunks(chunks, class_name=class_name, metadata=metadata)
    print(f"Finished processing {pdf_path} - {len(chunks)} chunks created")

# ==== 7. Upload handlers ====
def upload_official_document(pdf_path: str):
    """Upload an official labor law document to the GermanLaborLaw collection"""
    filename = os.path.basename(pdf_path)
    name, _ = os.path.splitext(filename)
    
    process_pdf(
        pdf_path, 
        class_name="GermanLaborLaw",
        metadata={"source": name, "document_type": "official"}
    )

def upload_user_document(pdf_path: str, user_id: str):
    process_pdf(
        pdf_path, 
        class_name="GermanLaborLaw", 
        metadata={"user_id": user_id, "document_type": "user"}
    )

# ==== 8. Main usage ====
if __name__ == "__main__":
    try:
        try:
            collection = client.collections.get("GermanLaborLaw")
            print(f"Found collection: GermanLaborLaw")
        except Exception as e:
            print(f"Error: The GermanLaborLaw collection does not exist. Please create it first: {e}")
            exit(1)
            
        pdf_files = [
            "/Users/dogukangundogan/Desktop/Dev/nex_ai_v2/pipeline/ArbZG.pdf",
            "/Users/dogukangundogan/Desktop/Dev/nex_ai_v2/pipeline/AÜG.pdf",
            "/Users/dogukangundogan/Desktop/Dev/nex_ai_v2/pipeline/BetrVG.pdf",
            "/Users/dogukangundogan/Desktop/Dev/nex_ai_v2/pipeline/NachwG.pdf"
        ]
        
        comprehensive_law = "/Users/dogukangundogan/Desktop/Dev/nex_ai_v2/pipeline/a711-arbeitsrecht.pdf"
        if os.path.exists(comprehensive_law):
            pdf_files.append(comprehensive_law)
        
        for pdf_file in pdf_files:
            if os.path.exists(pdf_file):
                upload_official_document(pdf_file)
            else:
                print(f"Warning: File not found: {pdf_file}")

    finally:
        client.close()
        print("Pipeline completed")
