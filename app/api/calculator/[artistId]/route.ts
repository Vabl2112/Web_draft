import { NextResponse } from "next/server"
import type { CalculatorVariable, MasterCalculatorConfig } from "@/lib/types"

// In-memory storage for demo (in production, this would be in a database)
const calculatorConfigs: Record<string, MasterCalculatorConfig> = {
  "1": {
    variables: [
      { 
        id: "a", 
        name: "a", 
        label: "Размер (см)", 
        type: "slider", 
        defaultValue: 15, 
        min: 5, 
        max: 30, 
        step: 1, 
        unit: "см" 
      },
      { 
        id: "b", 
        name: "b", 
        label: "Стиль", 
        type: "radio", 
        defaultValue: 100, 
        options: [
          { value: 100, label: "Реализм" },
          { value: 70, label: "Графика" },
          { value: 50, label: "Олдскул" },
        ]
      },
      { 
        id: "c", 
        name: "c", 
        label: "Сложность", 
        type: "select", 
        defaultValue: 1, 
        options: [
          { value: 1, label: "Контур" },
          { value: 1.5, label: "Тени" },
          { value: 2, label: "Цвет" },
        ]
      },
      { 
        id: "d", 
        name: "d", 
        label: "Место нанесения", 
        type: "select", 
        defaultValue: 1, 
        options: [
          { value: 1, label: "Запястье" },
          { value: 1.2, label: "Предплечье" },
          { value: 1.3, label: "Плечо" },
          { value: 1.5, label: "Спина" },
          { value: 1.4, label: "Грудь" },
          { value: 1.25, label: "Нога" },
          { value: 1.6, label: "Ребра" },
          { value: 1.55, label: "Шея" },
        ]
      },
      {
        id: "e",
        name: "e",
        label: "Срочный заказ",
        type: "checkbox",
        defaultValue: 0,
        checkedValue: 1.5,
        uncheckedValue: 1
      }
    ],
    formula: "(a * b * c * d * e)",
    currency: "₽",
  }
}

// Response format for the client
interface ClientCalculatorConfig {
  formula: string
  parameters: CalculatorVariable[]
  currency: string
}

// GET - Retrieve calculator config for an artist
export async function GET(
  request: Request,
  { params }: { params: Promise<{ artistId: string }> }
) {
  const { artistId } = await params
  
  // Get the master's calculator config
  const masterConfig = calculatorConfigs[artistId]
  
  if (!masterConfig) {
    // Return null if not found
    return NextResponse.json(null)
  }
  
  // Return in format expected by calculator-card
  const clientConfig: ClientCalculatorConfig = {
    formula: masterConfig.formula,
    currency: masterConfig.currency,
    parameters: masterConfig.variables.map(v => ({
      id: v.id,
      name: v.name,
      label: v.label,
      type: v.type,
      defaultValue: v.defaultValue,
      min: v.min,
      max: v.max,
      step: v.step,
      unit: v.unit,
      options: v.options,
      checkedValue: v.checkedValue,
      uncheckedValue: v.uncheckedValue
    }))
  }

  return NextResponse.json(clientConfig)
}

// PUT - Update calculator config for an artist
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ artistId: string }> }
) {
  const { artistId } = await params
  
  try {
    const body: MasterCalculatorConfig = await request.json()
    
    // Validate the config
    if (!body.formula || !body.variables || !Array.isArray(body.variables)) {
      return NextResponse.json(
        { error: "Invalid calculator config" },
        { status: 400 }
      )
    }
    
    // Store the config (in production, save to database)
    calculatorConfigs[artistId] = body
    
    return NextResponse.json({ 
      success: true, 
      message: "Calculator config updated successfully",
      config: body 
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update calculator config" },
      { status: 500 }
    )
  }
}
