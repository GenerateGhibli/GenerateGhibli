# GhibliHub

[GhibliHub](https://ghiblihub.art/) is your ultimate resource center for creating Studio Ghibli inspired AI art. Discover curated prompts, models, and tutorials to generate magical worlds and characters in the beloved Miyazaki style.

![GhibliHub](https://toimg.xyz/file/5aa892c8e8385232fcdf3.png)

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fqiayue%2Fghiblihub&project-name=GhibliHub&repository-name=GhibliHub&external-id=https%3A%2F%2Fgithub.com%2Fqiayue%2Fghiblihub%2Ftree%2Fmain)

## Features

- **Comprehensive Resource Collection**: Curated prompts, models, and tools for Ghibli-style AI art generation.
- **Step-by-Step Tutorials**: Detailed guides for creating Miyazaki-inspired landscapes, characters, and scenes.
- **Community Gallery**: Showcase of community-created Ghibli-style AI artwork.
- **Prompt Engineering Guides**: Specialized prompts optimized for various AI art generators.
- **Model Recommendations**: Reviews and recommendations for the best AI models for Ghibli-style art.
- **Multilingual Support**: Available in English and Chinese.
- **Responsive Design**: Fully responsive design using Tailwind CSS.
- **SEO Optimized**: Enhanced for search engines with dynamic metadata.

## Prerequisites

- Node.js (version 14 or later)
- npm (comes with Node.js)
- Git
- GitHub account
- Vercel account (for deployment)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/qiayue/ghiblihub.git
   cd ghiblihub
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repo_name
   ACCESS_PASSWORD=your_secure_access_password
   ```

4. Set up your GitHub repository:
   - Create a new repository on GitHub
   - Create two folders in the repository: `data/json` and `data/md`
   - In `data/json`, create a file named `resources.json` with an empty array: `[]`

5. Run the development server:
   ```
   npm run dev
   ```

Visit `http://localhost:3000` to see your GhibliHub instance running locally.

## Resource Categories

- **Prompts**: Optimized text prompts for generating Ghibli-style art
- **Models**: AI models fine-tuned for Ghibli aesthetics
- **Tools**: Software and utilities for enhancing AI-generated Ghibli art
- **Tutorials**: Step-by-step guides for creating specific Ghibli elements

## Contributing

We welcome contributions to GhibliHub! Please read our [Contributing Guide](https://ghiblihub.art/posts/how-to-contributing-to-ghiblihub) for details on our code of conduct and the process for submitting pull requests.

## License

GhibliHub is open-source software licensed under the [MIT license](https://github.com/qiayue/ghiblihub/?tab=MIT-1-ov-file).

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository or join our [Discord community](https://discord.gg/ghiblihub).

## Acknowledgements

GhibliHub is built with the following open-source libraries:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

We are grateful to the maintainers and contributors of these projects.