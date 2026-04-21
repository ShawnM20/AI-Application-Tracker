# AI Application Tracker

A professional, feature-rich web application for comprehensive job application management with AI-powered interview preparation. Built with modern React, TailwindCSS, and Framer Motion for a stunning user experience.

## Features

### Dashboard
- **Real-time Statistics**: Track total applications, interviews scheduled, response rates, and active searches
- **Recent Activity Timeline**: View your latest job applications, interviews, and reminders
- **Quick Navigation**: One-click access to all major features from the central dashboard
- **Performance Metrics**: Visual indicators for application success rates and progress

### Application Tracker
- **Complete CRUD Operations**: Add, edit, delete, and manage job applications
- **Advanced Status Management**: Track applications through Applied, Interview, Offer, Rejected, and Withdrawn stages
- **Rich Application Details**: Store company info, position, location, salary, job descriptions, and application URLs
- **Contact Management**: Save hiring manager contact information (name, email, phone)
- **Follow-up Tracking**: Set follow-up dates and reminders for each application
- **Notes System**: Add detailed notes and comments for each application
- **Visual Status Indicators**: Color-coded status badges for quick visual reference
- **Export/Import**: Backup and restore your application data as JSON files

### AI Interview Preparation
- **Real AI Integration**: Connect to OpenAI GPT or Anthropic Claude for personalized insights
- **Configurable AI Providers**: Choose between Mock (demo), OpenAI, or Anthropic AI services
- **Personalized Questions**: Generate role-specific interview questions based on job title, company, and experience level
- **Employer Insights**: Get detailed information about what employers look for in candidates
- **Expert Preparation Tips**: Receive tailored advice for interview preparation
- **Common Mistakes Guide**: Learn what to avoid during the interview process
- **Experience-Based Content**: Tailored content for entry-level, mid-level, senior, and lead positions
- **AI Settings Panel**: Easy configuration of API keys and provider settings
- **Caching System**: Intelligent caching to reduce API calls and costs

### Smart Job Search
- **Advanced Filtering**: Filter by job type, salary range, location, and keywords
- **Save Jobs**: Bookmark interesting opportunities for later review
- **Real-time Search**: Instant filtering of job results
- **Professional Listings**: Detailed job postings with requirements and company information
- **Quick Actions**: Direct links to apply and save positions

### Follow-up Reminders
- **Comprehensive Reminder System**: Create and manage reminders for follow-ups, interviews, and important dates
- **Priority Levels**: Set high, medium, or low priority for reminders
- **Multiple Types**: Follow-up, interview, phone call, and custom reminder types
- **Due Date Tracking**: Automatic notification of overdue reminders
- **Status Management**: Mark reminders as pending or completed
- **Application Linking**: Connect reminders to specific job applications
- **Real-time Notifications**: Browser notifications for due reminders

### Calendar Integration
- **Monthly Calendar View**: Visual calendar showing all applications, interviews, and reminders
- **Event Management**: View and manage all job search events in one place
- **Day Details**: Click any day to see detailed event information
- **Upcoming Events**: Sidebar showing next 7 days of activities
- **Monthly Statistics**: Quick stats for applications, interviews, and reminders
- **Export to iCal**: Export calendar events to external calendar applications
- **Interactive Navigation**: Easy month-to-month navigation

### Analytics & Reporting
- **Comprehensive Analytics**: Detailed insights into job search performance
- **Key Metrics**: Response rates, interview rates, offer rates, and average response times
- **Visual Charts**: Status distribution, top companies, and performance metrics
- **Time Range Filtering**: Analyze data by week, month, quarter, year, or all time
- **Activity Timeline**: Chronological view of all job search activities
- **Export Reports**: Download detailed analytics reports as JSON files
- **Performance Tracking**: Monitor progress and identify areas for improvement

## Technology Stack

- **Frontend**: React 18 with modern hooks and context
- **Styling**: TailwindCSS with custom gradient themes and glass morphism effects
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Icons**: Lucide React for consistent, modern iconography
- **Icons**: Lucide React for consistent iconography
- **Notifications**: React Hot Toast for user feedback
- **Routing**: React Router DOM for navigation
- **Markdown**: React Markdown for content rendering

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-application-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Usage

### 1. Dashboard
- View your job search statistics at a glance
- Access all features from the navigation menu
- Monitor recent application activity

### 2. Track Applications
- Click "Add Application" to create a new job entry
- Fill in details like company, position, location, salary, and job description
- Update application status as you progress through the hiring process
- Edit or delete applications as needed

### 3. Interview Preparation
- Enter a job title (e.g., "Software Engineer", "Product Manager")
- Optionally add company name and experience level
- Click "Generate Interview Prep" to receive AI-powered insights
- Explore different tabs for questions, employer expectations, tips, and mistakes

### 4. Job Search
- Use the search bar to find relevant positions
- Apply filters for job type, salary range, and location
- Save interesting jobs for later review
- Click on job listings to view full details and apply

## Design Features

- **Glass Morphism**: Modern glass-effect design with backdrop blur
- **Gradient Backgrounds**: Beautiful purple-to-blue gradient theme
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile
- **Smooth Animations**: Micro-interactions and transitions for enhanced UX
- **Professional Color Scheme**: Carefully selected colors for readability and aesthetics
- **Card Hover Effects**: Interactive elements that respond to user interaction

## AI Integration

The interview preparation feature uses AI to generate:
- Role-specific interview questions
- Industry-relevant preparation tips
- Common pitfalls to avoid
- Insights into what employers look for

*Note: Currently uses mock AI responses. In production, integrate with your preferred AI service (OpenAI, Claude, etc.) for real-time generation.*

## Project Structure

```
src/
components/
  - Navbar.js          # Navigation component
  - Dashboard.js       # Main dashboard with statistics
  - ApplicationTracker.js  # Job application management
  - InterviewPrep.js   # AI-powered interview preparation
  - JobSearch.js       # Job search and filtering
- App.js              # Main application component
- index.js            # Application entry point
- index.css           # Global styles and Tailwind imports
```

## Customization

### Adding AI Integration
Replace the mock AI functions in `InterviewPrep.js` with actual API calls:

```javascript
const generateInterviewPrep = async () => {
  const response = await fetch('your-ai-api-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobTitle, company, experience })
  });
  const data = await response.json();
  setInterviewData(data);
};
```

### Styling
Modify `tailwind.config.js` to customize colors, animations, and themes.
Update `index.css` for additional global styles and effects.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Portfolio Showcase

This application demonstrates:
- Modern React development with hooks
- Component-based architecture
- State management and data flow
- Responsive design principles
- UI/UX best practices
- Animation and micro-interactions
- Professional styling with TailwindCSS
- Integration patterns for AI services
- Form handling and validation
- Routing and navigation

Perfect for showcasing frontend development skills in your portfolio!
