import { NextResponse } from "next/server"
import type { CalculatorConfig } from "@/lib/types"

export async function GET() {
  // Simulating API response with dynamic calculator config
  const config: CalculatorConfig = {
    formula: "($size * 500) * $complexity * $style + ($location * 500)",
    currency: "₽",
    parameters: [
      {
        id: "size",
        label: "Размер (см)",
        type: "slider",
        defaultValue: 15,
        min: 5,
        max: 30,
        step: 1,
        unit: "",
        marks: [
          { value: 5, label: "5" },
          { value: 10, label: "10" },
          { value: 15, label: "15" },
          { value: 20, label: "20" },
          { value: 25, label: "25" },
          { value: 30, label: "30" }
        ]
      },
      {
        id: "complexity",
        label: "Сложность",
        type: "radio",
        defaultValue: "shadows",
        options: [
          { value: "outline", label: "Контур" },
          { value: "shadows", label: "Тени" },
          { value: "color", label: "Цвет" }
        ]
      },
      {
        id: "style",
        label: "Сложность",
        type: "radio", 
        defaultValue: "shadows",
        options: [
          { value: "outline", label: "Контур" },
          { value: "shadows", label: "Тени" },
          { value: "color", label: "Цвет" }
        ]
      },
      {
        id: "location",
        label: "Место нанесения",
        type: "select",
        defaultValue: "forearm",
        options: [
          { value: "wrist", label: "Запястье" },
          { value: "forearm", label: "Предплечье" },
          { value: "shoulder", label: "Плечо" },
          { value: "back", label: "Спина" },
          { value: "chest", label: "Грудь" },
          { value: "leg", label: "Нога" },
          { value: "ribs", label: "Ребра" },
          { value: "neck", label: "Шея" }
        ]
      }
    ]
  }

  return NextResponse.json(config)
}
