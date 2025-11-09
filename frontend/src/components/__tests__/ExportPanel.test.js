import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExportPanel from '../ExportPanel';

// Mock the API
jest.mock('../../services/api', () => ({
  exportAPIEnhanced: {
    pdf: jest.fn(),
    docx: jest.fn(),
    text: jest.fn(),
    email: jest.fn(),
    share: jest.fn(),
  },
}));

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ExportPanel', () => {
  const mockResumeId = 1;
  const mockHtmlContent = '<html><body><h1>Resume</h1></body></html>';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders export buttons', () => {
    render(<ExportPanel resumeId={mockResumeId} htmlContent={mockHtmlContent} />);
    
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.getByText('Download DOCX')).toBeInTheDocument();
    expect(screen.getByText('Download Text')).toBeInTheDocument();
    expect(screen.getByText('Email Export')).toBeInTheDocument();
    expect(screen.getByText('Create Share Link')).toBeInTheDocument();
  });

  test('shows email modal when email export is clicked', () => {
    render(<ExportPanel resumeId={mockResumeId} htmlContent={mockHtmlContent} />);
    
    const emailButton = screen.getByText('Email Export');
    fireEvent.click(emailButton);
    
    expect(screen.getByText('Email Export')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('recipient@example.com')).toBeInTheDocument();
  });
});

