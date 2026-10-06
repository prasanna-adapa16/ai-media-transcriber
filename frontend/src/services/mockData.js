/**
 * Day 1 Frontend Mock Data
 * Realistic sample data representing media files, transcripts, and dashboard metrics.
 */

export const mockStats = {
  totalFiles: 28,
  totalHours: 14.6,
  completedTranscripts: 25,
  accuracyRate: 98.4,
  processingCount: 2,
  failedCount: 1,
};

export const mockRecentTranscriptions = [
  {
    id: 'tr-101',
    fileName: 'CS101_Lecture_4_Neural_Networks.mp4',
    mediaType: 'video',
    fileSize: '42.5 MB',
    duration: '45:12',
    language: 'English (US)',
    status: 'COMPLETED',
    createdAt: '2026-10-04T10:30:00Z',
    speakerCount: 2,
    preview: 'Good morning everyone. Today we begin our deep dive into convolutional architectures and backpropagation algorithms...',
  },
  {
    id: 'tr-102',
    fileName: 'Product_Roadmap_Q4_Sync.m4a',
    mediaType: 'audio',
    fileSize: '18.2 MB',
    duration: '28:40',
    language: 'English',
    status: 'COMPLETED',
    createdAt: '2026-10-03T16:15:00Z',
    speakerCount: 4,
    preview: 'Thanks for hopping on. Let us review the sprint deliverables for the AI transcriber service release...',
  },
  {
    id: 'tr-103',
    fileName: 'Keynote_AI_Ethics_Symposium.mp3',
    mediaType: 'audio',
    fileSize: '65.1 MB',
    duration: '58:05',
    language: 'English',
    status: 'PROCESSING',
    createdAt: '2026-10-03T11:00:00Z',
    speakerCount: 1,
    preview: 'Audio uploaded, queued for Whisper transcription pipeline...',
  },
  {
    id: 'tr-104',
    fileName: 'User_Interview_Participant_07.wav',
    mediaType: 'audio',
    fileSize: '124.0 MB',
    duration: '31:22',
    language: 'English',
    status: 'COMPLETED',
    createdAt: '2026-10-02T14:20:00Z',
    speakerCount: 2,
    preview: 'I found the search inside the transcript especially helpful when looking up specific course definitions...',
  },
  {
    id: 'tr-105',
    fileName: 'Quarterly_All_Hands_Recording.mp4',
    mediaType: 'video',
    fileSize: '198.4 MB',
    duration: '52:18',
    language: 'English',
    status: 'COMPLETED',
    createdAt: '2026-10-01T09:00:00Z',
    speakerCount: 3,
    preview: 'Welcome to our annual company review. We have achieved strong engineering milestones across our AI initiatives...',
  },
];

export const mockDefaultTranscript = {
  id: 'tr-101',
  fileName: 'CS101_Lecture_4_Neural_Networks.mp4',
  mediaType: 'video',
  fileSize: '42.5 MB',
  duration: '45:12',
  language: 'English (US)',
  modelUsed: 'OpenAI Whisper (medium)',
  status: 'COMPLETED',
  createdAt: '2026-10-04T10:30:00Z',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Safe demo audio stream
  summary: 'This lecture covers the fundamental mathematics behind neural networks, focusing on activation functions, gradient descent, loss calculation, and backpropagation mechanics.',
  segments: [
    {
      id: 1,
      start: '00:00',
      end: '00:14',
      speaker: 'Prof. Miller',
      text: "Good morning everyone. Welcome back to CS101. Today we are kicking off unit four, where we shift our focus from classic machine learning toward artificial neural networks.",
    },
    {
      id: 2,
      start: '00:15',
      end: '00:32',
      speaker: 'Prof. Miller',
      text: "Before we get into deep architectures, we must thoroughly grasp how a single artificial neuron functions. At its heart, a perceptron takes weighted inputs, computes a linear combination, and passes it through an activation function.",
    },
    {
      id: 3,
      start: '00:33',
      end: '00:48',
      speaker: 'Student Question',
      text: "Professor, why do we need non-linear activation functions like ReLU or GELU? Couldn't we just stack multiple linear layers together?",
    },
    {
      id: 4,
      start: '00:49',
      end: '01:12',
      speaker: 'Prof. Miller',
      text: "That is an excellent question. If you only use linear functions, any composition of linear functions is simply another linear function. The non-linearity is what gives multi-layer neural networks the power to approximate arbitrary continuous functions.",
    },
    {
      id: 5,
      start: '01:13',
      end: '01:35',
      speaker: 'Prof. Miller',
      text: "Next, we will look at how the network learns. We define an objective loss function that quantifies the error between predicted labels and actual ground truth targets.",
    },
    {
      id: 6,
      start: '01:36',
      end: '02:00',
      speaker: 'Prof. Miller',
      text: "Using the chain rule of calculus, backpropagation propagates this loss backwards through every layer, computing partial derivatives with respect to each weight and bias.",
    },
  ],
};
