# On Track - Habit Time Tracker

On Track is a professional habit tracking application that helps users build and maintain positive habits through detailed time tracking and analytics. Built with modern web technologies and a Silicon Valley-inspired design philosophy.

![On Track Logo](public/logo.png)

## 🌟 Features

- **Habit Tracking**: Create, monitor, and maintain habits with detailed time tracking
- **Analytics Dashboard**: Visualize your progress with interactive charts and statistics
- **Professional Invoice System**: Generate and manage premium-quality PDF invoices
- **Subscription Management**: Flexible billing with monthly and annual plans
- **Modern UI/UX**: Clean, responsive design with optimal user experience
- **Secure Authentication**: Protected routes and secure user data management

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **PDF Generation**: jsPDF, jspdf-autotable
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Authentication**: NextAuth.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/on-track-habit-tracker.git
   cd on-track-habit-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📊 Project Structure

```
on-track-habit-tracker/
├── app/                    # Next.js app directory
├── components/            # Reusable React components
│   ├── billings/         # Billing and invoice components
│   ├── habits/           # Habit tracking components
│   └── ui/               # Common UI components
├── lib/                  # Utility functions and store
├── public/              # Static assets
└── styles/             # Global styles
```

## 🔒 Security

- All sensitive data is encrypted
- API routes are protected
- Environment variables are required for full functionality
- TypeScript for type safety

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For support, email support@ontrack.com or open an issue in the repository.

---

Built with ❤️ by [Kemo Jallow]
