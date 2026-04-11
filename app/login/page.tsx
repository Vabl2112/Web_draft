import { Metadata } from "next"
import { LoginPage } from "@/components/login-page"

export const metadata: Metadata = {
  title: "Вход - EGG",
  description: "Войдите в свой аккаунт EGG",
}

export default function Page() {
  return <LoginPage />
}
