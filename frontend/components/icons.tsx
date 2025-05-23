import {
  Loader2,
  Mail,
  Github,
  Chrome,
  LogIn,
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  spinner: Loader2,
  mail: Mail,
  github: Github,
  google: Chrome,
  login: LogIn,
  logo: (props: React.ComponentProps<LucideIcon>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
  ),
} 