import { Metadata } from "next"
import { RegisterPage } from "@/components/register-page"

export const metadata: Metadata = {
  title: "Регистрация - EGG",
  description: "Создайте аккаунт EGG",
}

export default function Page() {
  return <RegisterPage />
}
