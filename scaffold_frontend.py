import os

base_path = "frontend/src"
dirs = [
    "components", "components/ui", "components/layout", "components/shared",
    "pages", "context", "i18n", "i18n/locales", "utils"
]

for d in dirs:
    os.makedirs(os.path.join(base_path, d), exist_ok=True)

def write_file(sub_path, content):
    with open(os.path.join(base_path, sub_path), "w") as f:
        f.write(content.strip() + "\n")

# UTILS
write_file("utils/cn.ts", """
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
""")

# i18n
write_file("i18n/i18n.ts", """
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import en from './locales/en.json';

const resources = {
  vi: { translation: vi },
  en: { translation: en }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
""")

write_file("i18n/locales/vi.json", """
{
  "nav": {
    "home": "Trang chủ",
    "create": "Tạo đơn",
    "tracking": "Theo dõi đơn hàng",
    "admin": "Quản trị viên"
  },
  "landing": {
    "title": "Smart Adaptive Recovery System",
    "subtitle": "Giải pháp phát hiện và xử lý sự cố giao hàng tự động",
    "start": "Tạo đơn hàng Demo"
  }
}
""")

write_file("i18n/locales/en.json", """
{
  "nav": {
    "home": "Home",
    "create": "Create Demo",
    "tracking": "Tracking",
    "admin": "Admin"
  },
  "landing": {
    "title": "Smart Adaptive Recovery System",
    "subtitle": "Automated incident detection and recovery solution",
    "start": "Create Demo Shipment"
  }
}
""")

# UI COMPONENTS (shadcn mocks)
write_file("components/ui/button.tsx", """
import * as React from "react"
import { cn } from "../../utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
""")

write_file("components/ui/card.tsx", """
import * as React from "react"
import { cn } from "../../utils/cn"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
""")

# PAGES
pages = ["LandingPage", "CreateShipment", "MyShipment", "RecoveryCenter", "AdminDashboard"]
for page in pages:
    write_file(f"pages/{page}.tsx", f"""
import React from 'react';

export default function {page}() {{
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">{page}</h1>
    </div>
  );
}}
""")

# APP & MAIN
write_file("App.tsx", """
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateShipment from './pages/CreateShipment';
import MyShipment from './pages/MyShipment';
import RecoveryCenter from './pages/RecoveryCenter';
import AdminDashboard from './pages/AdminDashboard';
import './i18n/i18n';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans">
        {/* Header placeholder */}
        <header className="border-b bg-card py-4 shadow-sm">
          <div className="container flex items-center justify-between">
            <div className="text-xl font-bold text-primary">Viettel Post SARS</div>
            <nav className="flex gap-4">
              <a href="/" className="hover:text-primary">Home</a>
              <a href="/tracking" className="hover:text-primary">Tracking</a>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateShipment />} />
            <Route path="/tracking" element={<MyShipment />} />
            <Route path="/recovery/:caseId" element={<RecoveryCenter />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
""")

print("Frontend scaffolding complete.")
