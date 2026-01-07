# CareerCompass VA

CareerCompass VA is a web application designed to help aspiring and current Virtual Assistants identify their strengths and find their ideal career path. Users take a short, interactive assessment, and based on their answers, the app assigns them a "VA Persona" and uses Google's Gemini AI model to generate a personalized career roadmap.

![CareerCompass VA Screenshot](https://storage.googleapis.com/studioprompt/carrercompassva/screenshot.png)

## Features

- **Interactive Quiz:** A multi-step quiz to assess user skills and preferences across different VA domains (Administrative, Creative, Technical, etc.).
- **Personalized Results:** Calculates a user's VA persona (e.g., "The Optimizer," "The Visionary") and displays a detailed breakdown of their skill affinities.
- **AI-Powered Roadmaps:** Leverages Google's AI (via Genkit) to generate a custom career roadmap, including:
  - A tailored checklist of skills to learn.
  - A realistic "Day in the Life" description for their VA persona.
  - A list of actionable first steps with links to real-world resources.
- **Save & View:** Users can save their generated roadmaps and view them at any time on a dedicated "My Saved Roadmaps" page.
- **Secure Backend:** Uses Firebase for secure data storage and server-side operations.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
- **Generative AI:** [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/careercompass-va.git
    cd careercompass-va
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    - In your project, create a new **Web App** and copy the `firebaseConfig` object.
    - Create a file named `.env.local` in the root of your project.
    - Add your client-side Firebase configuration to `.env.local`:
      ```env
      NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
      NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
      ```
    - Set up a **Service Account** for server-side access:
      - In the Firebase Console, go to **Project settings** > **Service accounts**.
      - Click "Generate new private key" and download the JSON file.
      - Copy the entire contents of the JSON file.
      - Add the service account key to your `src/firebase/admin.ts` file, replacing the placeholder.

4.  **Set up Google AI (for Genkit):**
    - Go to [Google AI Studio](https://aistudio.google.com/) and create an API key.
    - Add the key to your `.env.local` file:
      ```env
      GEMINI_API_KEY=your-google-ai-api-key
      ```

### Running the Development Server

Once all dependencies and environment variables are in place, you can start the development server.

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Firestore Security

The application uses Firestore to save user assessment results and roadmaps. The security of this data is managed by Firestore Security Rules, located in `firestore.rules`.

The current rules are set up to allow reads and writes for guest users, but should be configured to use Firebase Authentication for a production environment:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow a user to read/write their own results
    match /results/{userId}/{documents=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```
