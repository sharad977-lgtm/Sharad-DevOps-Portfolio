# Sharad-DevOps-Portfolio

A modern personal portfolio website for Sharad Kumar Mishra, a Senior DevOps Engineer and Azure Cloud Architect. The site showcases cloud architecture experience, DevOps expertise, featured projects, certifications, and contact information in a sleek single-page format.

## Overview

This project is a static portfolio built with:
- HTML
- CSS
- JavaScript
- GitHub API integration for live repository cards
- GitHub Pages compatible deployment

It features:
- Responsive one-page layout
- Hero section and career highlights
- Expertise and skill cards
- Project gallery with live GitHub repo data
- Interactive terminal-style command prompt
- Contact section and resume download link
- Light/dark theme toggle

## Repository Structure

```text
Sharad-DevOps-Portfolio/
├── CNAME
├── LICENSE
├── README.md
├── about.html
├── awards.html
├── contact.html
├── index.html
├── projects.html
├── skills.html
├── css/
├── public/
│   └── resume.pdf
├── src/
│   ├── main.js
│   └── style.css
└── .gitignore (if present in your repo)
```

## Features

- Professional personal branding for a DevOps and Azure-focused career
- Modern UI with animated gradients and terminal aesthetic
- Dynamic GitHub repository feed using the GitHub REST API
- Project filtering by technology area (Terraform, Kubernetes, Azure, CI/CD)
- Downloadable resume in the `public/` directory
- Easy deployment via GitHub Pages or any static web host

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Styling: Custom CSS with responsive layout and custom animations
- Data integration: GitHub public repository API
- Hosting: GitHub Pages

## Local Development

1. Clone the repository

```bash
git clone https://github.com/sharad977-lgtm/Sharad-DevOps-Portfolio.git
cd Sharad-DevOps-Portfolio
```

2. Open the project locally

You can either:
- open `index.html` directly in a browser, or
- serve it with a local web server

Example with Python:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Configuration

Before using the live GitHub repository cards, update the GitHub username in `src/main.js`:

```javascript
const GITHUB_USERNAME = "YOUR_GITHUB_USERNAME";
```

Replace it with your actual GitHub username so the project cards and profile links work correctly.

You may also want to update these values:

```javascript
const LINKEDIN_URL = "https://www.linkedin.com/in/sharadkumarmishra977";
const EMAIL = "sharad977@gmail.com";
```

## Deployment

This project is designed to work well with GitHub Pages.

### GitHub Pages

1. Push the repository to GitHub.
2. Go to the repository settings.
3. Open the Pages section.
4. Select the branch and root folder to deploy from.
5. Save the settings.

If you are using a custom domain, keep the `CNAME` file configured as needed.

## Customization

To personalize the portfolio:
- update the content in `index.html`
- edit styles in `src/style.css`
- modify project data and profile links in `src/main.js`
- replace `public/resume.pdf` with your own resume

## License

This project is licensed under the Apache License 2.0. See the `LICENSE` file for details.

## Author

Sharad Kumar Mishra

## Contact

- Email: sharad977@gmail.com
- LinkedIn: https://www.linkedin.com/in/sharadkumarmishra977
- GitHub: https://github.com/sharad977-lgtm
