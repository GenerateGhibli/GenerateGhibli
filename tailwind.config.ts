import type { Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"
import typographyPlugin from "@tailwindcss/typography"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'serif': ['Garamond', 'Georgia', 'serif'],
        'sans': ['Avenir', 'Montserrat', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 吉卜力特色颜色 - 更新为更温暖自然的调色板
        ghibli: {
          blue: "#3D929A", // 多瑙河蓝 - 宫崎骏水域色彩
          teal: "#5FB7B3", // 轻柔的蓝绿色 - 《千与千寻》海景
          green: "#8AB87A", // 自然草绿 - 《龙猫》森林绿
          leaf: "#A6C48A", // 浅叶绿 - 《起风了》树叶色
          cream: "#F7EFE2", // 温暖米色 - 自然纸张色
          sand: "#E7D7B4", // 沙滩色 - 《红猪》背景色
          brown: "#A67C52", // 泥土棕色 - 《幽灵公主》森林
          rust: "#C15B40", // 铁锈红 - 《天空之城》机械色
          orange: "#E6A06F", // 温暖橙色 - 《千与千寻》夕阳
          red: "#D16B54", // 朱红色 - 《红猪》主色调
          sky: "#A0C8D7", // 天空蓝 - 《天空之城》背景
          cloud: "#E8F1F5", // 云朵白 - 各种电影云彩
          night: "#2B4262", // 夜空蓝 - 《幽灵公主》夜景
          lilac: "#9F96C0", // 淡紫色 - 《千与千寻》魔法色
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "sway": {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        "gentle-bounce": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "sway": "sway 6s ease-in-out infinite",
        "gentle-bounce": "gentle-bounce 3s ease-in-out infinite",
      },
      boxShadow: {
        'ghibli': '0 8px 20px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
        'ghibli-hover': '0 12px 28px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
        'ghibli-card': '0 6px 15px rgba(0, 0, 0, 0.08), 0 2px 5px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'ghibli-gradient': 'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)) 80%, hsl(var(--secondary)))',
        'ghibli-button': 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)/0.9))',
        'ghibli-text': 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin],
} satisfies Config

export default config
