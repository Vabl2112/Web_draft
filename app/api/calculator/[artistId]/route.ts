import { NextResponse } from "next/server"
import type { CalculatorConfig, MasterCalculatorConfig } from "@/lib/types"

// In-memory storage for demo (in production, this would be in a database)
const calculatorConfigs: Record<string, MasterCalculatorConfig> = {
  "1": {
    variables: [
      { id: "a", name: "a", label: "Размер (см)", type: "slider", defaultValue: 15, min: 5, max: 30, step: 1, unit: "см" },
      { id: "b", name: "b", label: "Сложность", type: "select", defaultValue: 2, options: [
        { value: 1, label: "Контур" },
        { value: 2, label: "Тени" },
        { value: 3, label: "Цвет" },
      ]},
      { id: "c", name: "c", label: "Место нанесения", type: "select", defaultValue: 1, options: [
        { value: 1, label: "Запястье" },
        { value: 1.2, label: "Предплечье" },
        { value: 1.3, label: "Плечо" },
        { value: 1.5, label: "Спина" },
        { value: 1.4, label: "Грудь" },
        { value: 1.2, label: "Нога" },
        { value: 1.6, label: "Ребра" },
        { value: 1.5, label: "Шея" },
      ]},
    ],
    formula: "(a * 500 * b * c)",
    currency: "₽",
  }
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
    // Return default config if not found
    const defaultConfig: CalculatorConfig = {
      formula: "(a * 500 * b * c)",
      currency: "₽",
      parameters: [
        {
          id: "a",
          label: "Размер (см)",
          type: "slider",
          defaultValue: 15,
          min: 5,
          max: 30,
          step: 1,
          unit: "см",
          marks: [
            { value: 5, label: "5" },
            { value: 15, label: "15" },
            { value: 30, label: "30" }
          ]
        },
        {
          id: "b",
          label: "Сложность",
          type: "radio",
          defaultValue: "2",
          options: [
            { value: "1", label: "Контур" },
            { value: "2", label: "Тени" },
            { value: "3", label: "Цвет" }
          ]
        },
        {
          id: "c",
          label: "Место нанесения",
          type: "select",
          defaultValue: "1",
          options: [
            { value: "1", label: "Запястье" },
            { value: "1.2", label: "Предплечье" },
            { value: "1.3", label: "Плечо" },
            { value: "1.5", label: "Спина" },
          ]
        }
      ]
    }
    return NextResponse.json(defaultConfig)
  }
  
  // Transform master config to client-facing config
  const clientConfig: CalculatorConfig = {
    formula: masterConfig.formula,
    currency: masterConfig.currency,
    parameters: masterConfig.variables.map(v => ({
      id: v.name,
      label: v.label,
      type: v.type === "number" ? "slider" : v.type === "select" ? "select" : "slider",
      defaultValue: v.defaultValue,
      min: v.min,
      max: v.max,
      step: v.step,
      unit: v.unit,
      options: v.options?.map(o => ({ value: String(o.value), label: o.label })),
      marks: v.type === "slider" && v.min !== undefined && v.max !== undefined ? [
        { value: v.min, label: String(v.min) },
        { value: Math.round((v.min + v.max) / 2), label: String(Math.round((v.min + v.max) / 2)) },
        { value: v.max, label: String(v.max) },
      ] : undefined,
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
