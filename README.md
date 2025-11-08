# ✨ Study Planner

A beautiful and functional study planner web app to help students organize tasks, track progress, and meet their goals. Built with vanilla HTML, CSS, and JavaScript with a delightful pastel aesthetic.

![preview:https://my-habit-trackerr.netlify.app/]


## 🎯 Features

### Core Functionality
- ✅ **Task Management** - Add, edit, delete, and complete tasks
- 🎨 **Priority Levels** - Organize tasks by low, medium, or high priority
- 📅 **Due Dates** - Set deadlines and track overdue items
- 🏷️ **Tags System** - Categorize tasks by subject (e.g., CS50, AI, GKS)
- 📊 **Progress Tracking** - Visual progress bar showing completion percentage

### Advanced Features
- 🔍 **Smart Search** - Search tasks by title, description, or tags
- 🎛️ **Multiple Filters** - View all, active, completed, or overdue tasks
- 📈 **Flexible Sorting** - Sort by newest, due date, or priority
- 💾 **Local Storage** - Tasks persist between sessions
- 📤 **Export/Import** - Backup and restore tasks as JSON files
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

### UI/UX Highlights
- 🌸 **Pastel Theme** - Soft pink, yellow, and peach gradient background
- 🔮 **Glassmorphism** - Frosted glass effect with backdrop blur
- ✨ **Smooth Animations** - Hover effects and transitions throughout
- 🎭 **Intuitive Interface** - Clean, organized, and easy to navigate

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with:
  - CSS Grid & Flexbox for layouts
  - Custom properties (CSS variables)
  - Gradient backgrounds
  - Backdrop filters (glassmorphism)
  - Smooth transitions and hover effects
- **Vanilla JavaScript** - No frameworks or libraries:
  - DOM manipulation
  - LocalStorage API
  - File handling (import/export)
  - Event delegation
  - Date manipulation

## 📁 Project Structure

```
study-planner/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-planner
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server (recommended)
   ```

3. **Using Live Server (VS Code)**
   - Install the Live Server extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

### No Installation Required!
This is a pure client-side application with no dependencies, build process, or server required.

## 💡 How to Use

### Adding Tasks
1. Click the **"+ Add Task"** button
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Due Date** (optional)
   - **Priority** (low/medium/high)
   - **Tags** (comma-separated, e.g., "CS50, AI")
3. Click **"Save Task"**

### Managing Tasks
- **Complete** - Click the checkbox to mark as done
- **Edit** - Click "Edit" button to modify task details
- **Delete** - Click "Delete" button to remove task

### Filtering & Sorting
- **Filters**: All, Active, Completed, Overdue
- **Sort by**: Newest, Due soon, Priority
- **Search**: Find tasks by title, description, or tags

### Data Management
- **Export** - Download all tasks as JSON file
- **Import** - Upload previously exported JSON file
- **Auto-save** - All changes saved automatically to browser storage


## 📊 Features Breakdown

### Progress Tracking
```javascript
// Calculates completion percentage
const total = tasks.length;
const done = tasks.filter(t => t.completed).length;
const percentage = (done / total) * 100;
```

### LocalStorage Integration
- Storage key: `study_planner_tasks_v1`
- Automatic save on every change
- Default seed tasks for new users
- Error handling for corrupted data

### Task Structure
```javascript
{
  id: "t_timestamp_random",
  title: "Task title",
  desc: "Task description",
  due: "2025-12-31",
  priority: "high",
  tags: ["tag1", "tag2"],
  completed: false,
  createdAt: "2025-11-08T12:00:00.000Z"
}
```

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)
- ⚠️ IE11 (not supported - uses modern CSS features)

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1100px max-width container
- **Tablet** (<900px): Single column layout, reordered sections
- **Mobile** (<700px): Stacked buttons, full-width elements
- **Small phones** (<500px): Vertical layout for all components

### Mobile Optimizations
- Touch-friendly button sizes
- Optimized font sizes
- Simplified layouts
- Bottom-up order for better mobile UX

## 🎓 Learning Outcomes

This project demonstrates:
- **Modern JavaScript**: ES6+ features, arrow functions, destructuring
- **DOM Manipulation**: Creating, updating, and removing elements dynamically
- **State Management**: Managing application state without frameworks
- **Local Storage**: Persisting data in the browser
- **File Handling**: Import/export JSON files
- **Responsive Design**: Mobile-first approach with media queries
- **CSS Modern Features**: Grid, Flexbox, custom properties, backdrop-filter
- **UX Design**: Intuitive interface with helpful feedback

## 🐛 Known Limitations

- LocalStorage is limited to ~5-10MB per domain
- No cloud sync (data stored locally only)
- No user authentication (single-user app)
- No recurring tasks feature
- Overdue detection based on browser's local time

## 🔮 Future Enhancements

Potential features for future versions:
- [ ] Dark mode toggle
- [ ] Recurring tasks
- [ ] Subtasks/checklist items
- [ ] Calendar view
- [ ] Pomodoro timer integration
- [ ] Cloud sync with Firebase/Supabase
- [ ] Collaboration features
- [ ] Statistics and analytics dashboard
- [ ] Custom themes
- [ ] Drag-and-drop reordering

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 👤 Author

**Zainab Abbas**

📧 [zainab.abbas.3495@gmail.com](mailto:zainab.abbas.3495@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/zainab2006)

- Created as a practical tool for students and productivity enthusiasts
- Built with ❤️ and vanilla JavaScript

## 🙏 Acknowledgments

- Inspired by the need for a simple, beautiful study planner
- Color palette influenced by soft pastel aesthetics
- UX patterns from modern productivity apps
- Font: Inter by Rasmus Andersson

## 💬 Support

If you have questions or need help:
- Open an issue on GitHub
- Check existing issues for solutions
- Feel free to customize for your needs

## ⭐ Show Your Support

If you find this project helpful:
- Give it a ⭐ on GitHub
- Share it with fellow students
- Contribute improvements
- Use it and provide feedback!

---

**Happy Studying! 📚✨**

Built with vanilla JavaScript - No frameworks, no dependencies, just pure code.
