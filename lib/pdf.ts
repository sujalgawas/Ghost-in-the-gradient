/**
 * Client-side PDF text extractor utilizing pdfjs-dist.
 * Executes strictly in the browser so no Node.js binary or heavy serverless runtime is required.
 */

export async function extractTextFromPDF(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction is only supported in browser environments');
  }

  const arrayBuffer = await file.arrayBuffer();

  // Dynamic import to prevent SSR bundling issues
  const pdfjs = await import('pdfjs-dist');

  // Configure worker
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdfDocument = await loadingTask.promise;

  const totalPages = pdfDocument.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    pageTexts.push(pageText.trim());
  }

  return pageTexts.filter(Boolean).join('\n\n--- Page Break ---\n\n');
}
